import * as THREE from "three";
import type { BookInfo } from "../booksData";
import { loadGltf } from "./gltf-runtime";

const SLOT_GAP = 0.028;

export type BookLoadState = "placeholder" | "loading" | "ready" | "failed";

export interface BookEntity {
  info: BookInfo;
  index: number;
  /** Static anchor at the book's shelf slot; never animated. */
  anchor: THREE.Group;
  /**
   * Animated holder whose origin is the book's geometric center. Hover lift
   * and the pull-forward inspection tween move/rotate this group.
   */
  content: THREE.Group;
  /** Content-group position when the book is resting in its slot. */
  home: THREE.Vector3;
  /** Invisible padded box used for pointer raycasts. */
  hitMesh: THREE.Mesh;
  loadState: BookLoadState;
  hoverLift: number;
  hoverTarget: number;
}

export interface ShelfLayout {
  entities: BookEntity[];
  totalWidth: number;
}

export function createBooks(scene: THREE.Scene, books: BookInfo[]): ShelfLayout {
  const entities: BookEntity[] = [];
  let cursor = 0;

  books.forEach((info, index) => {
    const { height, thickness, depth } = info.size;
    const pitch = thickness + SLOT_GAP;
    const x = cursor + pitch / 2;
    cursor += pitch;

    const anchor = new THREE.Group();
    anchor.position.set(x, 0, 0);
    anchor.name = `book-anchor-${info.id}`;

    // Book base rests on the board (y = 0), spine flush with the front plane (z = 0).
    const home = new THREE.Vector3(0, height / 2, -depth / 2);
    const content = new THREE.Group();
    content.name = `book-content-${info.id}`;
    content.position.copy(home);
    content.add(createPlaceholderVolume(info, index));

    const hitMesh = new THREE.Mesh(
      new THREE.BoxGeometry(pitch, height + 0.02, depth),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    hitMesh.userData.bookIndex = index;
    content.add(hitMesh);

    anchor.add(content);
    scene.add(anchor);

    entities.push({
      info,
      index,
      anchor,
      content,
      home,
      hitMesh,
      loadState: "placeholder",
      hoverLift: 0,
      hoverTarget: 0,
    });
  });

  return { entities, totalWidth: cursor };
}

/**
 * Clothbound stand-in rendered until (or in place of) the Mint model:
 * cloth case, cream text block on the top edge, and foil rules on the spine.
 * All parts are positioned relative to the book's geometric center.
 */
function createPlaceholderVolume(info: BookInfo, index: number): THREE.Group {
  const { height, thickness, depth } = info.size;
  const volume = new THREE.Group();
  volume.name = `book-placeholder-${info.id}`;

  const cloth = new THREE.MeshStandardMaterial({
    color: new THREE.Color(info.cloth),
    roughness: 0.85,
    metalness: 0.02,
  });
  const caseMesh = new THREE.Mesh(new THREE.BoxGeometry(thickness, height, depth), cloth);
  caseMesh.castShadow = true;
  caseMesh.receiveShadow = true;
  volume.add(caseMesh);

  // Text block peeking out at the top edge.
  const paper = new THREE.MeshStandardMaterial({ color: 0xefe7d5, roughness: 0.9 });
  const block = new THREE.Mesh(
    new THREE.BoxGeometry(thickness * 0.72, 0.004, depth * 0.9),
    paper,
  );
  block.position.set(0, height / 2 + 0.002, -0.004);
  volume.add(block);

  const foil = new THREE.MeshStandardMaterial({
    color: new THREE.Color(info.foil),
    roughness: 0.35,
    metalness: 0.65,
  });

  // Foil rules across the spine; layout varies per volume.
  const spineZ = depth / 2 + 0.0008;
  const ruleGeo = new THREE.BoxGeometry(thickness * 0.78, 0.0035, 0.0012);
  const layout = index % 3;
  const ruleFractions =
    layout === 0
      ? [0.82, 0.76]
      : layout === 1
        ? [0.86, 0.18]
        : [0.8, 0.74, 0.14];
  for (const fraction of ruleFractions) {
    const rule = new THREE.Mesh(ruleGeo, foil);
    rule.position.set(0, height * (fraction - 0.5), spineZ);
    volume.add(rule);
  }

  // A small abstract foil motif mid-spine.
  const motifSize = thickness * 0.45;
  const motifGeo =
    index % 2 === 0
      ? new THREE.CircleGeometry(motifSize / 2, 24)
      : new THREE.PlaneGeometry(motifSize, motifSize);
  const motif = new THREE.Mesh(motifGeo, foil);
  motif.position.set(0, 0, spineZ + 0.0004);
  if (index % 2 !== 0) motif.rotation.z = Math.PI / 4;
  volume.add(motif);

  addCoverPlate(volume, info);

  return volume;
}

/**
 * Tipped-in plate on the front cover (+X face, the one shown to the reader
 * when a book is pulled from the shelf): the story's cover art on a cream
 * paper backing, or a typographic label when the story has no artwork.
 */
function addCoverPlate(volume: THREE.Group, info: BookInfo): void {
  const { height, thickness, depth } = info.size;

  const plate = new THREE.Group();
  plate.name = `book-cover-${info.id}`;
  plate.rotation.y = Math.PI / 2;
  plate.position.set(thickness / 2 + 0.0008, height * 0.04, 0);
  volume.add(plate);

  const paper = new THREE.MeshStandardMaterial({ color: 0xf3ead8, roughness: 0.92 });

  if (!info.cover) {
    const labelHeight = Math.min(height * 0.52, (depth * 0.72) / 0.78);
    const labelWidth = labelHeight * 0.78;
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(labelWidth, labelHeight),
      new THREE.MeshStandardMaterial({ map: createLabelTexture(info), roughness: 0.88 }),
    );
    plate.add(label);
    return;
  }

  new THREE.TextureLoader().load(info.cover, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    const image = texture.image as { width: number; height: number };
    const aspect = image.width / image.height;
    let plateWidth = depth * 0.78;
    let plateHeight = plateWidth / aspect;
    const maxHeight = height * 0.62;
    if (plateHeight > maxHeight) {
      plateHeight = maxHeight;
      plateWidth = plateHeight * aspect;
    }
    const backing = new THREE.Mesh(
      new THREE.PlaneGeometry(plateWidth * 1.08, plateHeight * 1.1),
      paper,
    );
    const art = new THREE.Mesh(
      new THREE.PlaneGeometry(plateWidth, plateHeight),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.62 }),
    );
    art.position.z = 0.0005;
    plate.add(backing, art);
  });
}

/** Cream paper label with the title set in serif, for stories without cover art. */
function createLabelTexture(info: BookInfo): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 656;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f5edda";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = info.foil;
  ctx.lineWidth = 5;
  ctx.strokeRect(26, 26, canvas.width - 52, canvas.height - 52);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  ctx.textAlign = "center";
  ctx.fillStyle = "#8a6f4d";
  ctx.font = "600 22px system-ui, sans-serif";
  ctx.fillText(info.kind.toUpperCase().split("").join("  "), canvas.width / 2, 118);

  // Word-wrapped serif title.
  ctx.fillStyle = "#2a2118";
  ctx.font = "italic 58px Georgia, serif";
  const words = info.title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const attempt = line ? `${line} ${word}` : word;
    if (ctx.measureText(attempt).width > 380 && line) {
      lines.push(line);
      line = word;
    } else {
      line = attempt;
    }
  }
  if (line) lines.push(line);
  const lineHeight = 70;
  const startY = canvas.height / 2 + 20 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((text, i) => ctx.fillText(text, canvas.width / 2, startY + i * lineHeight));

  // Foil diamond ornament below the title.
  ctx.fillStyle = info.foil;
  const cx = canvas.width / 2;
  const cy = startY + lines.length * lineHeight + 26;
  ctx.beginPath();
  ctx.moveTo(cx, cy - 14);
  ctx.lineTo(cx + 11, cy);
  ctx.lineTo(cx, cy + 14);
  ctx.lineTo(cx - 11, cy);
  ctx.closePath();
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Kick off (at most once) the Mint GLB load for a book and swap it in when ready. */
export function ensureBookLoaded(
  entity: BookEntity,
  modelUrls: Record<string, string | null>,
  onStateChange: (entity: BookEntity) => void,
): void {
  if (entity.loadState !== "placeholder") return;
  const url = modelUrls[entity.info.id];
  if (!url) return;

  entity.loadState = "loading";
  loadGltf(url)
    .then((gltf) => {
      const model = normalizeBookModel(gltf.scene, entity.info);
      const placeholder = entity.content.getObjectByName(`book-placeholder-${entity.info.id}`);
      if (placeholder) {
        entity.content.remove(placeholder);
        disposeObject(placeholder);
      }
      entity.content.add(model);
      entity.loadState = "ready";
      onStateChange(entity);
    })
    .catch(() => {
      // Keep the labeled placeholder volume; latch the failure.
      entity.loadState = "failed";
      onStateChange(entity);
    });
}

/**
 * Orient and fit a generated hardcover into its slot: height along Y,
 * thickness along X (spine facing the viewer), centered on the holder origin.
 */
function normalizeBookModel(root: THREE.Object3D, info: BookInfo): THREE.Object3D {
  const holder = new THREE.Group();
  holder.name = `book-model-${info.id}`;
  holder.add(root);

  // Step 1: largest dimension becomes height (Y).
  let size = measure(holder);
  if (size.x >= size.y && size.x >= size.z) root.rotation.z = Math.PI / 2;
  else if (size.z >= size.y && size.z >= size.x) root.rotation.x = -Math.PI / 2;

  // Step 2: thickness (smallest of the remaining two) becomes X.
  size = measure(holder);
  if (size.x > size.z) root.rotation.y += Math.PI / 2;

  // Fit within the slot while preserving proportions.
  size = measure(holder);
  const scale = Math.min(
    info.size.height / size.y,
    (info.size.thickness * 1.05) / size.x,
    (info.size.depth * 1.1) / size.z,
  );
  holder.scale.setScalar(scale);

  // Center the fitted model on the holder origin.
  const box = new THREE.Box3().setFromObject(holder);
  const center = box.getCenter(new THREE.Vector3());
  holder.position.sub(center);

  holder.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });

  return holder;
}

function measure(object: THREE.Object3D): THREE.Vector3 {
  object.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3());
}

export function disposeObject(object: THREE.Object3D): void {
  object.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach((m) => m.dispose());
    }
  });
}
