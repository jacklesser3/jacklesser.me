// Training plan generation algorithm

import type {
  UserProfile,
  TrainingPlan,
  TrainingWeek,
  Workout,
  TrainingPhase,
  TrainingPhaseType,
  WorkoutType,
} from './types';
import {
  calculateStartDate,
  getWeekDates,
  generateId,
  roundToHalf,
  clamp,
  estimateDuration,
} from './utils';
import { getWorkoutDescription, generateIntervalDescription } from './workout-library';
import { NYC_MARATHON_2026 } from './utils';

/**
 * Main entry point: Generate complete training plan
 */
export function generateTrainingPlan(profile: UserProfile): TrainingPlan {
  const weeksToRace = 24; // Fixed 24-week marathon plan
  const startDate = profile.startDate;

  // Calculate race date from start date
  const raceDate = new Date(startDate);
  raceDate.setDate(raceDate.getDate() + (weeksToRace * 7));

  // Determine starting mileage based on fitness level
  const startingMileage = determineStartingMileage(profile);

  // Define training phases (24-week structured plan)
  const phases = defineMarathonPhases();

  // Generate weekly mileage progression for full marathon
  const weeklyMileages = generateMarathonProgression(
    startingMileage,
    profile.hasInjuryHistory
  );

  // Generate weeks with workouts
  const weeks = weeklyMileages.map((mileage, index) => {
    const weekNumber = index + 1;
    const phase = getPhaseForWeek(weekNumber, phases);

    return generateWeek(
      weekNumber,
      mileage,
      phase,
      startDate,
      profile.daysPerWeek,
      profile.hasInjuryHistory
    );
  });

  // Calculate metrics
  const peakMileage = Math.max(...weeklyMileages);
  const longestRun = Math.max(...weeks.flatMap(w =>
    w.workouts
      .filter(wo => wo.type === 'long_run')
      .map(wo => wo.distance || 0)
  ));

  return {
    profileId: profile.id,
    generatedAt: Date.now(),
    raceDate,
    startDate,
    totalWeeks: weeksToRace,
    phases,
    weeks,
    peakMileage,
    longestRun,
  };
}

/**
 * Determine starting weekly mileage based on fitness level
 */
function determineStartingMileage(profile: UserProfile): number {
  let baseMileage: number;

  switch (profile.currentFitness) {
    case 'beginner':
      baseMileage = profile.longestRun > 0 ? Math.max(8, profile.longestRun * 2) : 8;
      break;
    case 'some_running':
      baseMileage = Math.max(12, profile.longestRun * 2.5);
      break;
    case 'regular_runner':
      baseMileage = Math.max(18, profile.longestRun * 3);
      break;
    default:
      baseMileage = 10;
  }

  // Adjust for injury history (more conservative)
  if (profile.hasInjuryHistory) {
    baseMileage *= 0.85;
  }

  return roundToHalf(clamp(baseMileage, 8, 25));
}

/**
 * Define structured 24-week marathon training phases
 * Matches the Sub-5:00 First Timer plan structure
 */
function defineMarathonPhases(): TrainingPhase[] {
  return [
    {
      name: 'Base Building',
      startWeek: 1,
      endWeek: 4,
      description: 'Build a running habit and aerobic base. Every run is easy pace. No workouts.',
      weeklyMileageRange: [15, 20],
    },
    {
      name: 'Build',
      startWeek: 5,
      endWeek: 8,
      description: 'Start pushing long runs further and introduce structured workouts. Still 80% easy.',
      weeklyMileageRange: [20, 28],
    },
    {
      name: 'Peak',
      startWeek: 9,
      endWeek: 14,
      description: 'Long runs grow to 14-16 miles. Weekly mileage reaches first plateau.',
      weeklyMileageRange: [24, 35],
    },
    {
      name: 'Peak',
      startWeek: 15,
      endWeek: 20,
      description: 'Peak mileage and longest runs (18-20 miles). The hardest block.',
      weeklyMileageRange: [28, 40],
    },
    {
      name: 'Taper',
      startWeek: 21,
      endWeek: 24,
      description: 'Reducing volume significantly. Trust the process. Race week included.',
      weeklyMileageRange: [8, 25],
    },
  ];
}

/**
 * Generate 24-week marathon mileage progression
 * Exactly matches the Sub-5:00 First Timer plan
 */
function generateMarathonProgression(
  startingMileage: number,
  hasInjuryHistory: boolean
): number[] {
  // Exact weekly mileages from the example plan
  const baseMileages = [
    // Phase 1: Foundation (Weeks 1-4)
    15, 17, 20, 15,
    // Phase 2: Aerobic Development (Weeks 5-8)
    22, 24, 28, 20,
    // Phase 3: Endurance Building (Weeks 9-14)
    28, 30, 33, 24, 33, 35,
    // Phase 4: Peak Training (Weeks 15-20)
    35, 38, 40, 28, 36, 32,
    // Phase 5: Taper (Weeks 21-23)
    25, 20, 18,
    // Phase 6: Race Week (Week 24)
    8
  ];

  // For beginners, use the plan as-is
  // Only reduce slightly if injury history
  const injuryFactor = hasInjuryHistory ? 0.95 : 1.0;

  return baseMileages.map(miles => {
    return roundToHalf(miles * injuryFactor);
  });
}

/**
 * Get exact long run distances from the Sub-5:00 plan
 * Peak long run is 20 miles in Week 17
 */
function getMarathonLongRunDistance(weekNumber: number): number {
  const longRunProgression = [
    // Phase 1: Foundation (Weeks 1-4)
    5, 6, 7, 5,
    // Phase 2: Aerobic Development (Weeks 5-8)
    8, 9, 10, 6,
    // Phase 3: Endurance Building (Weeks 9-14)
    11, 12, 14, 8, 15, 16,
    // Phase 4: Peak Training (Weeks 15-20)
    16, 18, 20, 10, 18, 14,  // Week 17 = 20 miles (PEAK)
    // Phase 5: Taper (Weeks 21-23)
    12, 10, 8,
    // Phase 6: Race Week (Week 24)
    26.2  // Race day - full marathon
  ];

  return longRunProgression[weekNumber - 1] || 10;
}

/**
 * Get phase for specific week number
 */
function getPhaseForWeek(weekNumber: number, phases: TrainingPhase[]): TrainingPhaseType {
  const phase = phases.find(p => weekNumber >= p.startWeek && weekNumber <= p.endWeek);
  return phase?.name || 'Base Building';
}


/**
 * Generate a single training week
 */
function generateWeek(
  weekNumber: number,
  totalMileage: number,
  phase: TrainingPhaseType,
  planStartDate: Date,
  daysPerWeek: number,
  hasInjuryHistory: boolean
): TrainingWeek {
  const { start, end } = getWeekDates(planStartDate, weekNumber);
  const isRecoveryWeek = weekNumber % 4 === 0;

  // Generate workouts for the week
  const workouts = generateWeekWorkouts(
    weekNumber,
    totalMileage,
    phase,
    start,
    daysPerWeek,
    isRecoveryWeek,
    hasInjuryHistory
  );

  // Calculate actual totals
  const totalActualMiles = workouts
    .filter(w => w.completed)
    .reduce((sum, w) => sum + (w.actualDistance || 0), 0);

  const completedWorkouts = workouts.filter(w => w.completed && w.type !== 'rest').length;
  const totalWorkouts = workouts.filter(w => w.type !== 'rest').length;
  const completionRate = totalWorkouts > 0 ? completedWorkouts / totalWorkouts : 0;

  return {
    weekNumber,
    startDate: start,
    endDate: end,
    phase,
    totalPlannedMiles: totalMileage,
    totalActualMiles,
    workouts,
    restDays: 7 - daysPerWeek,
    isRecoveryWeek,
    completionRate,
  };
}

/**
 * Generate daily workouts for a week
 */
function generateWeekWorkouts(
  weekNumber: number,
  totalMileage: number,
  phase: TrainingPhaseType,
  weekStart: Date,
  daysPerWeek: number,
  isRecoveryWeek: boolean,
  hasInjuryHistory: boolean
): Workout[] {
  const workouts: Workout[] = [];

  // Determine long run distance based on 24-week progression
  let longRunMiles = getMarathonLongRunDistance(weekNumber);

  // Adjust for injury history
  if (hasInjuryHistory) {
    longRunMiles = roundToHalf(longRunMiles * 0.95);
  }

  // Remaining mileage to distribute
  const remainingMiles = totalMileage - longRunMiles;
  const numberOfOtherRuns = daysPerWeek - 1; // -1 for long run

  // Determine workout types based on phase
  const workoutTypes = determineWorkoutTypes(phase, numberOfOtherRuns, isRecoveryWeek);

  // Calculate distances for other runs
  const otherRunDistances = distributeRemainingMileage(
    remainingMiles,
    workoutTypes,
    hasInjuryHistory
  );

  // Create workout schedule
  // Long run on Sunday (day 0)
  workouts.push(createWorkout(
    weekNumber,
    0,
    weekStart,
    'long_run',
    longRunMiles,
    phase
  ));

  // Distribute other workouts throughout the week
  const workoutDays = getWorkoutDays(daysPerWeek);

  workoutTypes.forEach((type, index) => {
    const dayOfWeek = workoutDays[index];
    const distance = otherRunDistances[index];

    workouts.push(createWorkout(
      weekNumber,
      dayOfWeek,
      weekStart,
      type,
      distance,
      phase
    ));
  });

  // Add rest days
  const restDays = [0, 1, 2, 3, 4, 5, 6].filter(day =>
    !workouts.some(w => w.dayOfWeek === day)
  );

  restDays.forEach(day => {
    workouts.push(createWorkout(
      weekNumber,
      day,
      weekStart,
      'rest',
      undefined,
      phase
    ));
  });

  // Sort by day of week
  workouts.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return workouts;
}

/**
 * Determine workout types based on phase
 */
function determineWorkoutTypes(
  phase: TrainingPhaseType,
  count: number,
  isRecoveryWeek: boolean
): WorkoutType[] {
  const types: WorkoutType[] = [];

  if (phase === 'Base Building') {
    // All easy runs during base building
    for (let i = 0; i < count; i++) {
      types.push(i % 3 === 0 ? 'recovery_run' : 'easy_run');
    }
  } else if (phase === 'Build') {
    // Mix of easy, tempo, and intervals
    if (isRecoveryWeek) {
      // Recovery week: all easy
      for (let i = 0; i < count; i++) {
        types.push('easy_run');
      }
    } else {
      types.push('tempo_run'); // One tempo per week
      if (count > 2) types.push('interval_training'); // One interval if 4+ days
      while (types.length < count) {
        types.push('easy_run');
      }
    }
  } else if (phase === 'Peak') {
    // Similar to build but higher mileage
    if (isRecoveryWeek) {
      for (let i = 0; i < count; i++) {
        types.push('easy_run');
      }
    } else {
      types.push('tempo_run');
      if (count > 2) types.push('interval_training');
      if (count > 3) types.push('recovery_run');
      while (types.length < count) {
        types.push('easy_run');
      }
    }
  } else if (phase === 'Taper') {
    // Taper: maintain some intensity, reduce volume
    if (count > 1) types.push('tempo_run'); // Keep one quality workout
    while (types.length < count) {
      types.push('easy_run');
    }
  }

  return types;
}

/**
 * Distribute remaining mileage among workouts
 */
function distributeRemainingMileage(
  totalMiles: number,
  workoutTypes: WorkoutType[],
  hasInjuryHistory: boolean
): number[] {
  const distances: number[] = [];
  const baseDistance = totalMiles / workoutTypes.length;

  workoutTypes.forEach(type => {
    let distance: number;

    if (type === 'recovery_run') {
      distance = Math.max(3, baseDistance * 0.7);
    } else if (type === 'tempo_run') {
      // Tempo: warm-up + tempo + cool-down
      distance = Math.max(4, Math.min(6, baseDistance * 0.9));
    } else if (type === 'interval_training') {
      // Intervals: warm-up + intervals + cool-down
      distance = Math.max(4, Math.min(7, baseDistance * 1.0));
    } else {
      distance = baseDistance;
    }

    // Round and add safety margin for injury history
    if (hasInjuryHistory) {
      distance *= 0.95;
    }

    distances.push(roundToHalf(distance));
  });

  return distances;
}

/**
 * Get workout days for the week (excluding Sunday which is long run day)
 */
function getWorkoutDays(daysPerWeek: number): number[] {
  // Sunday (0) is always long run day
  // Distribute other workouts with rest in between

  const schedules: Record<number, number[]> = {
    3: [2, 4],         // Tuesday, Thursday
    4: [2, 4, 6],      // Tuesday, Thursday, Saturday
    5: [1, 3, 4, 6],   // Monday, Wednesday, Thursday, Saturday
    6: [1, 2, 3, 4, 6], // Monday-Thursday, Saturday
  };

  return schedules[daysPerWeek] || schedules[4];
}

/**
 * Create a single workout
 */
function createWorkout(
  weekNumber: number,
  dayOfWeek: number,
  weekStart: Date,
  type: WorkoutType,
  distance: number | undefined,
  phase: TrainingPhaseType
): Workout {
  const workoutDate = new Date(weekStart);
  workoutDate.setDate(workoutDate.getDate() + dayOfWeek);

  const paceGuidance = type === 'easy_run' || type === 'long_run' ? 'easy' :
    type === 'recovery_run' ? 'recovery' :
      type === 'tempo_run' ? 'tempo' :
        type === 'interval_training' ? 'interval' : 'easy';

  // Generate description
  let description: string;
  if (type === 'interval_training') {
    const intervalDesc = generateIntervalDescription(weekNumber, phase);
    description = getWorkoutDescription(type, distance, intervalDesc);
  } else {
    description = getWorkoutDescription(type, distance);
  }

  // Estimate duration
  const duration = distance ? estimateDuration(distance, paceGuidance) : undefined;

  return {
    id: generateId(),
    weekNumber,
    dayOfWeek,
    date: workoutDate,
    type,
    distance,
    duration,
    paceGuidance,
    description,
    completed: false,
  };
}

/**
 * Initialize progress metrics for a new plan
 */
export function initializeProgress(profileId: string): {
  profileId: string;
  weeklyStats: [];
  totalPlannedMiles: number;
  totalActualMiles: number;
  overallCompletionRate: number;
  currentStreak: number;
  longestStreak: number;
  milestones: Array<{
    id: string;
    type: 'first_week';
    title: string;
    description: string;
  }>;
  lastUpdated: number;
} {
  return {
    profileId,
    weeklyStats: [],
    totalPlannedMiles: 0,
    totalActualMiles: 0,
    overallCompletionRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    milestones: [
      {
        id: generateId(),
        type: 'first_week',
        title: 'Welcome to Training!',
        description: 'Your journey to NYC Marathon 2026 begins now.',
      },
    ],
    lastUpdated: Date.now(),
  };
}
