export type EaseFn = (t: number) => number;

export const easeInOutCubic: EaseFn = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic: EaseFn = (t) => 1 - Math.pow(1 - t, 3);

interface ActiveTween {
  elapsed: number;
  duration: number;
  ease: EaseFn;
  onUpdate: (t: number) => void;
  onComplete?: () => void;
  cancelled: boolean;
}

export interface TweenHandle {
  cancel(): void;
}

/** Minimal time-based tween runner, stepped from the experience RAF loop. */
export class Tweens {
  private active: ActiveTween[] = [];

  run(opts: {
    duration: number;
    ease?: EaseFn;
    onUpdate: (t: number) => void;
    onComplete?: () => void;
  }): TweenHandle {
    const tween: ActiveTween = {
      elapsed: 0,
      duration: Math.max(opts.duration, 0.001),
      ease: opts.ease ?? easeInOutCubic,
      onUpdate: opts.onUpdate,
      onComplete: opts.onComplete,
      cancelled: false,
    };
    this.active.push(tween);
    return {
      cancel: () => {
        tween.cancelled = true;
      },
    };
  }

  update(dt: number): void {
    if (this.active.length === 0) return;
    const finished: ActiveTween[] = [];
    this.active = this.active.filter((tween) => {
      if (tween.cancelled) return false;
      tween.elapsed += dt;
      const t = Math.min(tween.elapsed / tween.duration, 1);
      tween.onUpdate(tween.ease(t));
      if (t >= 1) {
        finished.push(tween);
        return false;
      }
      return true;
    });
    for (const tween of finished) tween.onComplete?.();
  }

  clear(): void {
    this.active = [];
  }
}
