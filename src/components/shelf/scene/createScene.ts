import * as THREE from "three";

export const PALETTE = {
  paper: 0xf5efe3,
  paperDeep: 0xede4d3,
  wall: 0xefe7d6,
  walnut: 0x5a4030,
  walnutDark: 0x46311f,
  ink: 0x2a2118,
};

/** Shelf geometry constants (meters). Book bases sit at y = 0, spines at z ≈ 0. */
export const SHELF = {
  boardThickness: 0.032,
  boardDepth: 0.26,
  /** How far the board runs past the first/last book on each side. */
  overhang: 0.34,
  wallZ: -0.24,
};

export interface SceneHandles {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  dispose: () => void;
}

export function createScene(canvas: HTMLCanvasElement, totalWidth: number): SceneHandles {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.paper);
  scene.fog = new THREE.Fog(PALETTE.paper, 2.4, 5.5);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 20);
  camera.position.set(0, 0.17, 1.02);

  buildLighting(scene, totalWidth);
  buildShelf(scene, totalWidth);

  const dispose = () => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m.dispose());
      }
    });
    renderer.dispose();
  };

  return { scene, camera, renderer, dispose };
}

function buildLighting(scene: THREE.Scene, totalWidth: number): void {
  const hemi = new THREE.HemisphereLight(0xfff6e6, 0xd8c9ae, 1.05);
  scene.add(hemi);

  // Warm key light from the upper left, casting the books' contact shadows.
  const key = new THREE.DirectionalLight(0xffedd2, 1.2);
  key.position.set(-0.8, 1.4, 1.6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 0.2;
  key.shadow.camera.far = 6;
  key.shadow.camera.left = -(totalWidth / 2 + 1);
  key.shadow.camera.right = totalWidth / 2 + 1;
  key.shadow.camera.top = 1.2;
  key.shadow.camera.bottom = -0.6;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 4;
  key.target.position.set(0, 0.1, 0);
  scene.add(key, key.target);

  const fill = new THREE.DirectionalLight(0xe8ecf2, 0.4);
  fill.position.set(1.2, 0.6, 1.0);
  scene.add(fill);
}

function buildShelf(scene: THREE.Scene, totalWidth: number): void {
  const walnut = new THREE.MeshStandardMaterial({
    color: PALETTE.walnut,
    roughness: 0.62,
    metalness: 0.05,
  });
  const walnutEdge = new THREE.MeshStandardMaterial({
    color: PALETTE.walnutDark,
    roughness: 0.55,
    metalness: 0.05,
  });
  const wallMat = new THREE.MeshStandardMaterial({
    color: PALETTE.wall,
    roughness: 0.96,
    metalness: 0,
  });

  const runLength = totalWidth + SHELF.overhang * 2;
  const centerX = totalWidth / 2;

  const shelfGroup = new THREE.Group();
  shelfGroup.name = "shelf-furniture";

  // Main board the books stand on.
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(runLength, SHELF.boardThickness, SHELF.boardDepth),
    walnut,
  );
  board.position.set(centerX, -SHELF.boardThickness / 2, SHELF.boardDepth / 2 + SHELF.wallZ + 0.01);
  board.receiveShadow = true;
  shelfGroup.add(board);

  // Slim front lip gives the board a bound, editorial edge.
  const lip = new THREE.Mesh(
    new THREE.BoxGeometry(runLength, SHELF.boardThickness + 0.006, 0.012),
    walnutEdge,
  );
  lip.position.set(centerX, -SHELF.boardThickness / 2, board.position.z + SHELF.boardDepth / 2 + 0.006);
  shelfGroup.add(lip);

  // Bookend blocks at either end of the run.
  const endGeo = new THREE.BoxGeometry(0.05, 0.19, SHELF.boardDepth * 0.7);
  for (const side of [-1, 1] as const) {
    const end = new THREE.Mesh(endGeo, walnutEdge);
    const x = side === -1 ? -SHELF.overhang * 0.45 : totalWidth + SHELF.overhang * 0.45;
    end.position.set(x, 0.095, board.position.z);
    end.castShadow = true;
    end.receiveShadow = true;
    shelfGroup.add(end);
  }

  // Back wall in warm plaster.
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(runLength + 4, 4), wallMat);
  wall.position.set(centerX, 0.7, SHELF.wallZ);
  wall.receiveShadow = true;
  shelfGroup.add(wall);

  scene.add(shelfGroup);
}
