import * as THREE from "three";

export interface InteractionHandlers {
  /** Horizontal drag while browsing, in world units (already sign-flipped). */
  onDragScroll(deltaWorld: number): void;
  onWheel(deltaWorld: number): void;
  /** A true click/tap (small movement, short duration) at normalized coords. */
  onTap(ndc: THREE.Vector2): void;
  onPointerMove(ndc: THREE.Vector2, clientX: number, clientY: number): void;
  onPointerLeave(): void;
  onArrow(direction: -1 | 1): void;
  onEscape(): void;
}

const CLICK_MAX_MOVEMENT_PX = 6;
const CLICK_MAX_DURATION_MS = 400;

/**
 * Pointer, wheel, and keyboard wiring for the shelf. Converts pixel input to
 * world-space scroll deltas using the camera's view width at the shelf plane.
 */
export function attachInteraction(
  element: HTMLElement,
  camera: THREE.PerspectiveCamera,
  handlers: InteractionHandlers,
): () => void {
  let pointerDown = false;
  let downX = 0;
  let downY = 0;
  let downTime = 0;
  let lastX = 0;
  let dragDistance = 0;

  const worldPerPixel = () => {
    const distance = camera.position.z; // shelf plane sits at z ≈ 0
    const viewHeight = 2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    return (viewHeight * camera.aspect) / element.clientWidth;
  };

  const toNdc = (event: PointerEvent): THREE.Vector2 => {
    const rect = element.getBoundingClientRect();
    return new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -(((event.clientY - rect.top) / rect.height) * 2 - 1),
    );
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    pointerDown = true;
    downX = lastX = event.clientX;
    downY = event.clientY;
    downTime = performance.now();
    dragDistance = 0;
    element.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (pointerDown) {
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      dragDistance = Math.max(
        dragDistance,
        Math.hypot(event.clientX - downX, event.clientY - downY),
      );
      handlers.onDragScroll(-dx * worldPerPixel());
    } else {
      handlers.onPointerMove(toNdc(event), event.clientX, event.clientY);
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!pointerDown) return;
    pointerDown = false;
    element.releasePointerCapture(event.pointerId);
    const quick = performance.now() - downTime < CLICK_MAX_DURATION_MS;
    if (quick && dragDistance < CLICK_MAX_MOVEMENT_PX) {
      handlers.onTap(toNdc(event));
    }
  };

  const onPointerLeave = () => {
    handlers.onPointerLeave();
  };

  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const dominant = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    handlers.onWheel(dominant * worldPerPixel() * 0.9);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlers.onArrow(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handlers.onArrow(1);
    } else if (event.key === "Escape") {
      handlers.onEscape();
    }
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", onPointerUp);
  element.addEventListener("pointerleave", onPointerLeave);
  element.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeyDown);

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", onPointerUp);
    element.removeEventListener("pointerleave", onPointerLeave);
    element.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKeyDown);
  };
}
