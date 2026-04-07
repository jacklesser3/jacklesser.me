// Workout templates and definitions

import type { WorkoutTemplate, WorkoutType } from './types';

export const WORKOUT_TEMPLATES: Record<WorkoutType, WorkoutTemplate> = {
  easy_run: {
    type: 'easy_run',
    name: 'Easy Run',
    paceGuidance: 'easy',
    descriptionTemplate: '{distance} miles at easy, conversational pace. You should be able to speak in full sentences. This builds your aerobic base.',
    durationMultiplier: 11, // minutes per mile
  },

  long_run: {
    type: 'long_run',
    name: 'Long Run',
    paceGuidance: 'conversational',
    descriptionTemplate: '{distance} miles at a comfortable, steady pace. Focus on time on feet rather than speed. Take walk breaks if needed.',
    durationMultiplier: 11.5,
  },

  recovery_run: {
    type: 'recovery_run',
    name: 'Recovery Run',
    paceGuidance: 'recovery',
    descriptionTemplate: '{distance} miles at very easy pace. This should feel effortless. The goal is active recovery, not fitness building.',
    durationMultiplier: 12,
  },

  tempo_run: {
    type: 'tempo_run',
    name: 'Tempo Run',
    paceGuidance: 'tempo',
    descriptionTemplate: 'Warm up 1 mile easy, then {distance} miles at "comfortably hard" pace (you can speak a few words but not sentences), cool down 1 mile easy.',
    durationMultiplier: 9.5,
  },

  interval_training: {
    type: 'interval_training',
    name: 'Interval Training',
    paceGuidance: 'interval',
    descriptionTemplate: 'Warm up 1-2 miles easy. Then alternate: {intervals}. Cool down 1 mile easy. Jog or walk between intervals to recover.',
    durationMultiplier: 10,
  },

  rest: {
    type: 'rest',
    name: 'Rest Day',
    paceGuidance: 'recovery',
    descriptionTemplate: 'Complete rest or gentle cross-training (yoga, swimming, cycling). No running. Recovery is when your body adapts and gets stronger.',
  },
};

/**
 * Get workout description with distance filled in
 */
export function getWorkoutDescription(type: WorkoutType, distance?: number, customIntervals?: string): string {
  const template = WORKOUT_TEMPLATES[type];
  let description = template.descriptionTemplate;

  if (distance) {
    description = description.replace('{distance}', distance.toString());
  }

  if (type === 'interval_training' && customIntervals) {
    description = description.replace('{intervals}', customIntervals);
  }

  return description;
}

/**
 * Generate interval workout description based on week/phase
 */
export function generateIntervalDescription(weekNumber: number, phase: string): string {
  // Early weeks: shorter intervals
  if (weekNumber < 10 || phase === 'Base Building') {
    return '6 x 400m at 5K pace (2 min rest between)';
  }

  // Build phase: mix of distances
  if (phase === 'Build') {
    const variations = [
      '8 x 400m at 5K pace (90 sec rest)',
      '5 x 800m at 10K pace (2 min rest)',
      '4 x 1000m at 10K pace (3 min rest)',
      '3 x 1 mile at tempo pace (4 min rest)',
    ];
    return variations[weekNumber % variations.length];
  }

  // Peak phase: longer intervals
  if (phase === 'Peak') {
    const variations = [
      '6 x 800m at 10K pace (90 sec rest)',
      '4 x 1 mile at tempo pace (3 min rest)',
      '3 x 2K at half-marathon pace (4 min rest)',
    ];
    return variations[weekNumber % variations.length];
  }

  // Taper: maintain but reduce volume
  return '4 x 400m at 5K pace (2 min rest)';
}

/**
 * Estimate workout duration
 */
export function estimateWorkoutDuration(type: WorkoutType, distance?: number): number {
  const template = WORKOUT_TEMPLATES[type];

  if (!distance) return 60; // default 1 hour

  // Add warm-up/cool-down time for tempo and intervals
  if (type === 'tempo_run') {
    return Math.round((distance + 2) * template.durationMultiplier!);
  }

  if (type === 'interval_training') {
    return Math.round((distance + 3) * template.durationMultiplier!);
  }

  return Math.round(distance * (template.durationMultiplier || 10));
}

/**
 * Get workout color for UI
 */
export function getWorkoutColor(type: WorkoutType): string {
  const colors: Record<WorkoutType, string> = {
    easy_run: '#6C8CAD',      // Forge (blue-gray)
    long_run: '#C88D5D',      // Ember (warm orange)
    recovery_run: '#8BA888',   // Soft green
    tempo_run: '#B87D6C',     // Clay (terracotta)
    interval_training: '#9B7DAD', // Twilight (purple)
    rest: '#9BA3A8',          // Cool gray
  };

  return colors[type];
}

/**
 * Get workout emoji for visual identification
 */
export function getWorkoutEmoji(type: WorkoutType): string {
  const emojis: Record<WorkoutType, string> = {
    easy_run: '🏃',
    long_run: '🏃‍♂️',
    recovery_run: '🚶',
    tempo_run: '💨',
    interval_training: '⚡',
    rest: '🧘',
  };

  return emojis[type];
}
