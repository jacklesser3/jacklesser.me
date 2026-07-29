import * as THREE from "three";

export const BROWSE_VIEW = {
  y: 0.175,
  z: 1.02,
  lookY: 0.15,
};

/** Where a selected book is pulled forward to for inspection. */
export const FOCUS_POINT = { y: 0.22, z: 0.36 };

const DAMPING = 7.5;

/**
 * Damped dolly along the shelf axis. Owns the camera during browsing;
 * OrbitControls take over during inspection and the rig resumes on return.
 */
export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  enabled = true;
  private scroll: number;
  private target: number;
  private readonly min: number;
  private readonly max: number;

  constructor(camera: THREE.PerspectiveCamera, totalWidth: number, startX: number) {
    this.camera = camera;
    this.min = 0;
    this.max = totalWidth;
    this.scroll = startX;
    this.target = startX;
    this.apply();
  }

  get position(): number {
    return this.scroll;
  }

  get targetPosition(): number {
    return this.target;
  }

  scrollBy(delta: number): void {
    this.setTarget(this.target + delta);
  }

  setTarget(x: number): void {
    this.target = THREE.MathUtils.clamp(x, this.min, this.max);
  }

  /** Jump the internal state (used when resuming after an inspection return). */
  snapTo(x: number): void {
    this.target = THREE.MathUtils.clamp(x, this.min, this.max);
    this.scroll = this.target;
    this.apply();
  }

  update(dt: number): void {
    if (!this.enabled) return;
    const alpha = 1 - Math.exp(-DAMPING * dt);
    this.scroll += (this.target - this.scroll) * alpha;
    this.apply();
  }

  browsePoseFor(x: number): { position: THREE.Vector3; look: THREE.Vector3 } {
    return {
      position: new THREE.Vector3(x, BROWSE_VIEW.y, BROWSE_VIEW.z),
      look: new THREE.Vector3(x, BROWSE_VIEW.lookY, 0),
    };
  }

  private apply(): void {
    const pose = this.browsePoseFor(this.scroll);
    this.camera.position.copy(pose.position);
    this.camera.lookAt(pose.look);
  }
}
