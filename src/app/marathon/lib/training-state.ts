"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  UserProfile,
  TrainingPlan,
  ProgressMetrics,
  Workout,
  CompletionData,
  WeeklyStats,
  Milestone,
} from './types';
import { STORAGE_KEYS } from './types';
import { loadFromStorage, saveToStorage, clearFromStorage, getCurrentWeekNumber, calculateTotalMileage, calculateCompletionRate } from './utils';
import { generateTrainingPlan, initializeProgress } from './training-plan-generator';

/**
 * Main hook for managing marathon training state
 * Follows localStorage pattern from draft-state.ts
 */
export function useTrainingState() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [progress, setProgress] = useState<ProgressMetrics | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedProfile = loadFromStorage<UserProfile>(STORAGE_KEYS.PROFILE);
    const loadedPlan = loadFromStorage<TrainingPlan>(STORAGE_KEYS.PLAN);
    const loadedProgress = loadFromStorage<ProgressMetrics>(STORAGE_KEYS.PROGRESS);

    setProfile(loadedProfile);
    setPlan(loadedPlan);
    setProgress(loadedProgress);
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.PROFILE, profile);
      saveToStorage(STORAGE_KEYS.PLAN, plan);
      saveToStorage(STORAGE_KEYS.PROGRESS, progress);
    }
  }, [profile, plan, progress, isLoaded]);

  /**
   * Create new profile and generate training plan
   */
  const createProfile = useCallback((data: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newProfile: UserProfile = {
      ...data,
      id: `profile-${Date.now()}`,
      createdAt: Date.now(),
    };

    setProfile(newProfile);

    // Auto-generate plan
    const newPlan = generateTrainingPlan(newProfile);
    setPlan(newPlan);

    // Initialize progress
    const newProgress = initializeProgress(newProfile.id);
    setProgress(newProgress);

    return { profile: newProfile, plan: newPlan };
  }, []);

  /**
   * Mark workout as complete
   */
  const completeWorkout = useCallback((workoutId: string, data: CompletionData) => {
    if (!plan || !progress) return;

    setPlan(prevPlan => {
      if (!prevPlan) return prevPlan;

      const updatedWeeks = prevPlan.weeks.map(week => {
        const updatedWorkouts = week.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              completed: true,
              completedAt: Date.now(),
              actualDistance: data.actualDistance,
              actualDuration: data.actualDuration,
              actualPace: data.actualPace,
              notes: data.notes,
              effortLevel: data.effortLevel,
            };
          }
          return workout;
        });

        // Recalculate week totals
        const totalActualMiles = calculateTotalMileage(updatedWorkouts);
        const completionRate = calculateCompletionRate(updatedWorkouts);

        return {
          ...week,
          workouts: updatedWorkouts,
          totalActualMiles,
          completionRate,
        };
      });

      return {
        ...prevPlan,
        weeks: updatedWeeks,
      };
    });

    // Update progress metrics
    updateProgressMetrics();
  }, [plan, progress]);

  /**
   * Update progress metrics based on completed workouts
   */
  const updateProgressMetrics = useCallback(() => {
    if (!plan) return;

    // Calculate weekly stats
    const weeklyStats: WeeklyStats[] = plan.weeks.map(week => ({
      weekNumber: week.weekNumber,
      plannedMiles: week.totalPlannedMiles,
      actualMiles: week.totalActualMiles,
      workoutsCompleted: week.workouts.filter(w => w.completed && w.type !== 'rest').length,
      totalWorkouts: week.workouts.filter(w => w.type !== 'rest').length,
      completionRate: week.completionRate,
    }));

    // Calculate totals
    const totalPlannedMiles = plan.weeks.reduce(
      (sum, week) => sum + week.totalPlannedMiles,
      0
    );

    const totalActualMiles = plan.weeks.reduce(
      (sum, week) => sum + week.totalActualMiles,
      0
    );

    // Calculate overall completion rate
    const allWorkouts = plan.weeks.flatMap(w => w.workouts);
    const eligibleWorkouts = allWorkouts.filter(w => w.type !== 'rest');
    const completedWorkouts = eligibleWorkouts.filter(w => w.completed);
    const overallCompletionRate = eligibleWorkouts.length > 0
      ? completedWorkouts.length / eligibleWorkouts.length
      : 0;

    // Calculate current streak
    const { currentStreak, longestStreak } = calculateStreaks(allWorkouts);

    // Check for new milestones
    const newMilestones = checkMilestones(
      plan,
      totalActualMiles,
      currentStreak,
      progress?.milestones || []
    );

    setProgress({
      profileId: plan.profileId,
      weeklyStats,
      totalPlannedMiles,
      totalActualMiles,
      overallCompletionRate,
      currentStreak,
      longestStreak,
      milestones: newMilestones,
      lastUpdated: Date.now(),
    });
  }, [plan, progress]);

  /**
   * Uncomplete a workout (undo)
   */
  const uncompleteWorkout = useCallback((workoutId: string) => {
    if (!plan) return;

    setPlan(prevPlan => {
      if (!prevPlan) return prevPlan;

      const updatedWeeks = prevPlan.weeks.map(week => {
        const updatedWorkouts = week.workouts.map(workout => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              completed: false,
              completedAt: undefined,
              actualDistance: undefined,
              actualDuration: undefined,
              actualPace: undefined,
              notes: undefined,
              effortLevel: undefined,
            };
          }
          return workout;
        });

        const totalActualMiles = calculateTotalMileage(updatedWorkouts);
        const completionRate = calculateCompletionRate(updatedWorkouts);

        return {
          ...week,
          workouts: updatedWorkouts,
          totalActualMiles,
          completionRate,
        };
      });

      return {
        ...prevPlan,
        weeks: updatedWeeks,
      };
    });

    updateProgressMetrics();
  }, [plan, updateProgressMetrics]);

  /**
   * Reset all training data
   */
  const resetTraining = useCallback(() => {
    setProfile(null);
    setPlan(null);
    setProgress(null);
    clearFromStorage(STORAGE_KEYS.PROFILE);
    clearFromStorage(STORAGE_KEYS.PLAN);
    clearFromStorage(STORAGE_KEYS.PROGRESS);
  }, []);

  /**
   * Update profile (e.g., change goal, injury notes)
   */
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);

    // Optionally regenerate plan if critical fields changed
    if (updates.daysPerWeek || updates.goalFinishTime) {
      const newPlan = generateTrainingPlan(updatedProfile);
      setPlan(newPlan);
    }
  }, [profile]);

  // Computed values
  const currentWeek = useMemo(() => {
    if (!plan) return null;
    const weekNumber = getCurrentWeekNumber(plan.startDate);
    return plan.weeks.find(w => w.weekNumber === weekNumber) || null;
  }, [plan]);

  const currentWeekNumber = useMemo(() => {
    if (!plan) return 0;
    return getCurrentWeekNumber(plan.startDate);
  }, [plan]);

  const hasProfile = !!profile;
  const hasPlan = !!plan;

  return {
    // State
    profile,
    plan,
    progress,
    currentWeek,
    currentWeekNumber,
    isLoaded,
    hasProfile,
    hasPlan,

    // Actions
    createProfile,
    updateProfile,
    completeWorkout,
    uncompleteWorkout,
    updateProgressMetrics,
    resetTraining,
  };
}

/**
 * Calculate current and longest streaks
 */
function calculateStreaks(workouts: Workout[]): { currentStreak: number; longestStreak: number } {
  // Sort workouts by date
  const sortedWorkouts = [...workouts]
    .filter(w => w.type !== 'rest')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (let i = sortedWorkouts.length - 1; i >= 0; i--) {
    if (sortedWorkouts[i].completed) {
      tempStreak++;
      if (i === sortedWorkouts.length - 1) {
        currentStreak = tempStreak;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      if (i === sortedWorkouts.length - 1) {
        currentStreak = 0;
      }
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}

/**
 * Check for achieved milestones
 */
function checkMilestones(
  plan: TrainingPlan,
  totalMiles: number,
  currentStreak: number,
  existingMilestones: Milestone[]
): Milestone[] {
  const milestones = [...existingMilestones];

  const addMilestone = (type: Milestone['type'], title: string, description: string, weekNumber?: number) => {
    if (!milestones.some(m => m.type === type)) {
      milestones.push({
        id: `milestone-${Date.now()}-${type}`,
        type,
        title,
        description,
        achievedAt: Date.now(),
        weekNumber,
      });
    }
  };

  // First long run
  const firstLongRun = plan.weeks
    .flatMap(w => w.workouts)
    .find(w => w.type === 'long_run' && w.completed);

  if (firstLongRun && !milestones.some(m => m.type === 'first_long_run')) {
    addMilestone(
      'first_long_run',
      'First Long Run Complete!',
      'You completed your first long run. The foundation is being built.',
      firstLongRun.weekNumber
    );
  }

  // Half marathon distance
  const halfMarathonRun = plan.weeks
    .flatMap(w => w.workouts)
    .find(w => w.completed && (w.actualDistance || 0) >= 13.1);

  if (halfMarathonRun && !milestones.some(m => m.type === 'half_distance')) {
    addMilestone(
      'half_distance',
      'Halfway There!',
      'You ran 13.1 miles—a half marathon distance! You\'re capable of amazing things.',
      halfMarathonRun.weekNumber
    );
  }

  // Peak week
  const peakPhase = plan.phases.find(p => p.name === 'Peak');
  if (peakPhase) {
    const peakWeekCompleted = plan.weeks
      .filter(w => w.weekNumber >= peakPhase.startWeek && w.weekNumber <= peakPhase.endWeek)
      .some(w => w.completionRate === 1);

    if (peakWeekCompleted && !milestones.some(m => m.type === 'peak_week')) {
      addMilestone(
        'peak_week',
        'Peak Training Complete!',
        'You completed a peak week. You\'re at your strongest.',
        peakPhase.startWeek
      );
    }
  }

  // Streaks
  if (currentStreak >= 7 && !milestones.some(m => m.type === 'streak_7')) {
    addMilestone(
      'streak_7',
      '7-Day Streak!',
      'Seven workouts in a row. Consistency builds champions.'
    );
  }

  if (currentStreak >= 14 && !milestones.some(m => m.type === 'streak_14')) {
    addMilestone(
      'streak_14',
      '14-Day Streak!',
      'Two weeks of consistency. You\'re unstoppable.'
    );
  }

  // Total mileage
  if (totalMiles >= 100 && !milestones.some(m => m.type === 'hundred_miles')) {
    addMilestone(
      'hundred_miles',
      '100 Miles!',
      'You\'ve run 100 miles in training. Every step counts.'
    );
  }

  // Taper start
  const taperPhase = plan.phases.find(p => p.name === 'Taper');
  const currentWeekNum = getCurrentWeekNumber(plan.startDate);
  if (taperPhase && currentWeekNum >= taperPhase.startWeek && !milestones.some(m => m.type === 'taper_start')) {
    addMilestone(
      'taper_start',
      'Taper Time!',
      'The hard work is done. Now trust your training and rest up.',
      taperPhase.startWeek
    );
  }

  return milestones;
}
