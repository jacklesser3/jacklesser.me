import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { BookInfo } from "../booksData";
import { createScene, type SceneHandles } from "./createScene";
import { createBooks, ensureBookLoaded, type BookEntity } from "./books";
import { CameraRig, FOCUS_POINT } from "./cameraRig";
import { attachInteraction } from "./interaction";
import { Tweens, easeOutCubic } from "./tween";
import { disposeGltfRuntime } from "./gltf-runtime";

export type ShelfMode = "browsing" | "focusing" | "inspecting" | "returning";

export interface ShelfCallbacks {
  onActiveIndex(index: number): void;
  onMode(mode: ShelfMode, bookIndex: number | null): void;
  onHover(book: BookInfo | null, clientX: number, clientY: number): void;
  onLoadProgress(loaded: number, failed: number, total: number): void;
}

export interface ShelfController {
  select(index: number): void;
  deselect(): void;
  step(direction: -1 | 1): void;
  scrollToIndex(index: number): void;
  setSize(width: number, height: number): void;
  dispose(): void;
}

const HOVER_LIFT = 0.016;
const MAX_CONCURRENT_LOADS = 3;

export function createShelfExperience(
  canvas: HTMLCanvasElement,
  books: BookInfo[],
  modelUrls: Record<string, string | null>,
  callbacks: ShelfCallbacks,
): ShelfController {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const speed = reduceMotion ? 0.25 : 1;

  let handles: SceneHandles;
  let entities: BookEntity[];
  let totalWidth: number;

  {
    // Layout is derived from the book size hints, so build books first for width.
    const probe = new THREE.Scene();
    const layout = createBooks(probe, books);
    totalWidth = layout.totalWidth;
    handles = createScene(canvas, totalWidth);
    layout.entities.forEach((e) => handles.scene.add(e.anchor));
    entities = layout.entities;
  }

  const { scene, camera, renderer } = handles;
  const rig = new CameraRig(camera, totalWidth, totalWidth / 2);
  const tweens = new Tweens();
  const raycaster = new THREE.Raycaster();
  const clock = new THREE.Clock();

  let mode: ShelfMode = "browsing";
  let selected: BookEntity | null = null;
  let controls: OrbitControls | null = null;
  let activeIndex = -1;
  let hovered: BookEntity | null = null;
  let pendingNdc: THREE.Vector2 | null = null;
  let pendingPointer: { x: number; y: number } | null = null;
  let rafId = 0;
  let disposed = false;
  let loadsInFlight = 0;

  const urlsAvailable = books.filter((b) => modelUrls[b.id]).length;

  const setMode = (next: ShelfMode) => {
    mode = next;
    callbacks.onMode(mode, selected ? selected.index : null);
  };

  const emitProgress = () => {
    const loaded = entities.filter((e) => e.loadState === "ready").length;
    const failed = entities.filter((e) => e.loadState === "failed").length;
    callbacks.onLoadProgress(loaded, failed, urlsAvailable);
  };

  const onBookLoadStateChange = () => {
    loadsInFlight = Math.max(0, loadsInFlight - 1);
    emitProgress();
  };

  const pumpLoadQueue = () => {
    if (loadsInFlight >= MAX_CONCURRENT_LOADS) return;
    const candidates = entities
      .filter((e) => e.loadState === "placeholder" && modelUrls[e.info.id])
      .sort((a, b) => {
        if (selected) {
          if (a === selected) return -1;
          if (b === selected) return 1;
        }
        return (
          Math.abs(a.anchor.position.x - rig.targetPosition) -
          Math.abs(b.anchor.position.x - rig.targetPosition)
        );
      });
    while (loadsInFlight < MAX_CONCURRENT_LOADS && candidates.length > 0) {
      const next = candidates.shift()!;
      loadsInFlight += 1;
      ensureBookLoaded(next, modelUrls, onBookLoadStateChange);
    }
  };

  const nearestIndex = (x: number): number => {
    let best = 0;
    let bestDist = Infinity;
    entities.forEach((e, i) => {
      const d = Math.abs(e.anchor.position.x - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const updateActiveIndex = () => {
    const idx = nearestIndex(rig.targetPosition);
    if (idx !== activeIndex) {
      activeIndex = idx;
      callbacks.onActiveIndex(idx);
    }
  };

  const setHovered = (entity: BookEntity | null, clientX = 0, clientY = 0) => {
    if (hovered === entity) {
      if (entity) callbacks.onHover(entity.info, clientX, clientY);
      return;
    }
    if (hovered) hovered.hoverTarget = 0;
    hovered = entity;
    if (hovered) hovered.hoverTarget = HOVER_LIFT;
    callbacks.onHover(entity ? entity.info : null, clientX, clientY);
    canvas.style.cursor = entity ? "pointer" : "grab";
  };

  const raycastBook = (ndc: THREE.Vector2): BookEntity | null => {
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(
      entities.map((e) => e.hitMesh),
      false,
    );
    if (hits.length === 0) return null;
    const idx = hits[0].object.userData.bookIndex as number;
    return entities[idx] ?? null;
  };

  // --- Selection state machine -------------------------------------------

  const focusWorld = (entity: BookEntity) =>
    new THREE.Vector3(entity.anchor.position.x, FOCUS_POINT.y, FOCUS_POINT.z);

  const select = (index: number) => {
    const entity = entities[Math.max(0, Math.min(entities.length - 1, index))];
    if (mode === "inspecting" || mode === "focusing") {
      if (selected === entity) return;
      deselect(() => select(index));
      return;
    }
    if (mode !== "browsing") return;

    selected = entity;
    setHovered(null);
    setMode("focusing");
    pumpLoadQueue();
    rig.setTarget(entity.anchor.position.x);

    const fromPos = entity.content.position.clone();
    const toPos = focusWorld(entity).sub(entity.anchor.position);
    const fromRot = entity.content.rotation.y;
    const toRot = -Math.PI / 2; // cover faces the reader

    tweens.run({
      duration: 0.85 * speed,
      onUpdate: (t) => {
        entity.content.position.lerpVectors(fromPos, toPos, t);
        // Small arc outward so the book clears its neighbors before turning.
        entity.content.position.z += Math.sin(t * Math.PI) * 0.05;
        entity.content.rotation.y = THREE.MathUtils.lerp(fromRot, toRot, t);
      },
      onComplete: () => {
        if (disposed) return;
        controls = new OrbitControls(camera, canvas);
        controls.target.copy(focusWorld(entity));
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.minDistance = 0.24;
        controls.maxDistance = 1.5;
        controls.minPolarAngle = Math.PI * 0.12;
        controls.maxPolarAngle = Math.PI * 0.88;
        controls.enablePan = true;
        controls.screenSpacePanning = true;
        controls.panSpeed = 0.7;
        controls.rotateSpeed = 0.85;
        controls.zoomSpeed = 0.7;
        controls.update();
        canvas.style.cursor = "grab";
        setMode("inspecting");
      },
    });
  };

  const deselect = (after?: () => void) => {
    if (mode !== "inspecting" || !selected) return;
    const entity = selected;
    setMode("returning");

    controls?.dispose();
    controls = null;

    const fromCam = camera.position.clone();
    const fromLook = focusWorld(entity);
    const pose = rig.browsePoseFor(entity.anchor.position.x);
    const fromPos = entity.content.position.clone();
    const fromRot = entity.content.rotation.y;

    tweens.run({
      duration: 0.75 * speed,
      ease: easeOutCubic,
      onUpdate: (t) => {
        camera.position.lerpVectors(fromCam, pose.position, t);
        const look = new THREE.Vector3().lerpVectors(fromLook, pose.look, t);
        camera.lookAt(look);
        entity.content.position.lerpVectors(fromPos, entity.home, t);
        entity.content.position.z += Math.sin(t * Math.PI) * 0.04;
        entity.content.rotation.y = THREE.MathUtils.lerp(fromRot, 0, t);
      },
      onComplete: () => {
        if (disposed) return;
        entity.content.position.copy(entity.home);
        entity.content.rotation.y = 0;
        selected = null;
        rig.snapTo(entity.anchor.position.x);
        setMode("browsing");
        after?.();
      },
    });
  };

  // --- Input wiring --------------------------------------------------------

  const detachInput = attachInteraction(canvas, camera, {
    onDragScroll: (delta) => {
      if (mode === "browsing") rig.scrollBy(delta);
    },
    onWheel: (delta) => {
      if (mode === "browsing") rig.scrollBy(delta);
    },
    onTap: (ndc) => {
      if (mode !== "browsing") return;
      const hit = raycastBook(ndc);
      if (hit) select(hit.index);
    },
    onPointerMove: (ndc, clientX, clientY) => {
      if (mode !== "browsing") return;
      pendingNdc = ndc;
      pendingPointer = { x: clientX, y: clientY };
    },
    onPointerLeave: () => {
      pendingNdc = null;
      setHovered(null);
    },
    onArrow: (direction) => {
      if (mode === "browsing") {
        const idx = Math.max(0, Math.min(entities.length - 1, activeIndex + direction));
        rig.setTarget(entities[idx].anchor.position.x);
      } else if (mode === "inspecting" && selected) {
        const idx = Math.max(0, Math.min(entities.length - 1, selected.index + direction));
        if (idx !== selected.index) select(idx);
      }
    },
    onEscape: () => {
      deselect();
    },
  });

  canvas.style.cursor = "grab";
  canvas.style.touchAction = "none";

  const onContextLost = (event: Event) => event.preventDefault();
  canvas.addEventListener("webglcontextlost", onContextLost);

  // --- Frame loop -----------------------------------------------------------

  let frame = 0;
  const loop = () => {
    if (disposed) return;
    rafId = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);

    tweens.update(dt);
    rig.enabled = mode === "browsing" || mode === "focusing";
    rig.update(dt);
    if (mode === "inspecting") controls?.update();

    // Hover raycast at most once per frame, from the latest pointer position.
    if (pendingNdc && mode === "browsing") {
      const hit = raycastBook(pendingNdc);
      setHovered(hit, pendingPointer?.x ?? 0, pendingPointer?.y ?? 0);
      pendingNdc = null;
    }

    // Damped hover lift.
    const liftAlpha = 1 - Math.exp(-10 * dt);
    for (const entity of entities) {
      if (entity === selected) continue;
      entity.hoverLift += (entity.hoverTarget - entity.hoverLift) * liftAlpha;
      entity.content.position.y = entity.home.y + entity.hoverLift;
    }

    frame += 1;
    if (frame % 20 === 0) {
      pumpLoadQueue();
      updateActiveIndex();
    }

    renderer.render(scene, camera);
  };

  updateActiveIndex();
  emitProgress();
  pumpLoadQueue();
  loop();

  return {
    select,
    deselect: () => deselect(),
    step: (direction) => {
      if (mode === "inspecting" && selected) {
        const idx = Math.max(0, Math.min(entities.length - 1, selected.index + direction));
        if (idx !== selected.index) select(idx);
        return;
      }
      const idx = Math.max(0, Math.min(entities.length - 1, activeIndex + direction));
      rig.setTarget(entities[idx].anchor.position.x);
      updateActiveIndex();
    },
    scrollToIndex: (index) => {
      const idx = Math.max(0, Math.min(entities.length - 1, index));
      if (mode === "inspecting") {
        select(idx);
        return;
      }
      if (mode !== "browsing") return;
      rig.setTarget(entities[idx].anchor.position.x);
      updateActiveIndex();
    },
    setSize: (width, height) => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      detachInput();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      controls?.dispose();
      tweens.clear();
      handles.dispose();
      disposeGltfRuntime();
    },
  };
}
