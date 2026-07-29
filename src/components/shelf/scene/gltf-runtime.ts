import { GLTFLoader, type GLTF } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

/**
 * Shared Draco-capable glTF runtime for Mint-generated GLBs.
 * Mint's optimizer emits KHR_draco_mesh_compression, so a bare GLTFLoader
 * cannot decode these files. One shared decoder serves every loader; it is
 * only disposed at permanent teardown of the experience.
 */
const DRACO_DECODER_PATH = "https://cdn.mint.gg/runtime/draco/gltf/three-0.184.0/";

let sharedDraco: DRACOLoader | null = null;

function getSharedDracoLoader(): DRACOLoader {
  if (!sharedDraco) {
    sharedDraco = new DRACOLoader();
    sharedDraco.setDecoderPath(DRACO_DECODER_PATH);
  }
  return sharedDraco;
}

export function createGltfLoader(): GLTFLoader {
  const loader = new GLTFLoader();
  loader.setDRACOLoader(getSharedDracoLoader());
  return loader;
}

export function loadGltf(url: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    createGltfLoader().load(url, resolve, undefined, reject);
  });
}

export function disposeGltfRuntime(): void {
  sharedDraco?.dispose();
  sharedDraco = null;
}
