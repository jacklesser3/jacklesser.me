// Core TypeScript interfaces for Marathon Training Application

export type FitnessLevel = 'beginner' | 'some_running' | 'regular_runner';
export type GoalFinishTime = 'finish' | 'sub5' | 'sub4_30' | 'sub4';
export type WorkoutType = 'easy_run' | 'long_run' | 'tempo_run' | 'interval_training' | 'recovery_run' | 'rest';
export type PaceGuidance = 'easy' | 'tempo' | 'interval' | 'conversational' | 'recovery';
export type TrainingPhaseType = 'Base Building' | 'Build' | 'Peak' | 'Taper';

// User questionnaire responses
export interface UserProfile {
  id: string;
  createdAt: number;
  currentFitness: FitnessLevel;
  longestRun: number; // miles in past 3 months
  weeksAvailable: number; // weeks until race (calculated from today)
  daysPerWeek: number; // 3-6 training days
  goalFinishTime: GoalFinishTime;
  hasInjuryHistory: boolean;
  injuryNotes?: string;
}

// Training phase definition
export interface TrainingPhase {
  name: TrainingPhaseType;
  startWeek: number;
  endWeek: number;
  description: string;
  weeklyMileageRange: [number, number];
}

// Individual workout
export interface Workout {
  id: string;
  weekNumber: number;
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  date: Date;
  type: WorkoutType;
  distance?: number; // miles
  duration?: number; // minutes
  paceGuidance: PaceGuidance;
  description: string;
  completed: boolean;
  completedAt?: number;
  actualDistance?: number;
  actualDuration?: number;
  actualPace?: string; // e.g., "9:30/mile"
  notes?: string;
  effortLevel?: number; // 1-10 scale
}

// Weekly structure
export interface TrainingWeek {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  phase: TrainingPhaseType;
  totalPlannedMiles: number;
  totalActualMiles: number;
  workouts: Workout[];
  restDays: number;
  weeklyTip?: string;
  isRecoveryWeek: boolean;
  completionRate: number; // 0-1
}

// Generated training plan
export interface TrainingPlan {
  profileId: string;
  generatedAt: number;
  raceDate: Date; // November 2, 2026
  startDate: Date;
  totalWeeks: number;
  phases: TrainingPhase[];
  weeks: TrainingWeek[];
  peakMileage: number;
  longestRun: number;
}

// Progress tracking
export interface WeeklyStats {
  weekNumber: number;
  plannedMiles: number;
  actualMiles: number;
  workoutsCompleted: number;
  totalWorkouts: number;
  completionRate: number;
}

export interface Milestone {
  id: string;
  type: 'first_week' | 'first_long_run' | 'half_distance' | 'peak_week' | 'taper_start' | 'race_week' | 'streak_7' | 'streak_14' | 'hundred_miles';
  title: string;
  description: string;
  achievedAt?: number;
  weekNumber?: number;
}

export interface ProgressMetrics {
  profileId: string;
  weeklyStats: WeeklyStats[];
  totalPlannedMiles: number;
  totalActualMiles: number;
  overallCompletionRate: number;
  currentStreak: number; // consecutive workouts completed
  longestStreak: number;
  milestones: Milestone[];
  lastUpdated: number;
}

// Workout completion form data
export interface CompletionData {
  actualDistance: number;
  actualDuration: number; // minutes
  actualPace?: string;
  notes?: string;
  effortLevel?: number; // 1-10
}

// Educational tip
export interface TrainingTip {
  id: string;
  category: 'zone2' | 'recovery' | 'long_runs' | 'injury_prevention' | 'nutrition' | 'pacing' | 'race_day';
  title: string;
  content: string;
  relevantPhases?: TrainingPhaseType[];
  relevantWeeks?: number[];
}

// Workout template for generation
export interface WorkoutTemplate {
  type: WorkoutType;
  name: string;
  paceGuidance: PaceGuidance;
  descriptionTemplate: string; // Can include {distance} placeholder
  durationMultiplier?: number; // For estimating duration based on distance
}

// Storage keys
export const STORAGE_KEYS = {
  PROFILE: 'marathon-training-profile',
  PLAN: 'marathon-training-plan',
  PROGRESS: 'marathon-training-progress',
} as const;
