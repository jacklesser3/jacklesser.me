// Utility functions for Marathon Training Application

import type { TrainingWeek, Workout } from './types';

// Race date constant
export const NYC_MARATHON_2026 = new Date('2026-11-02T09:00:00-05:00');

/**
 * Calculate weeks from today to race date
 */
export function calculateWeeksToRace(raceDate: Date = NYC_MARATHON_2026): number {
  const today = new Date();
  const diffTime = raceDate.getTime() - today.getTime();
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(diffWeeks, 0);
}

/**
 * Calculate start date given race date and number of weeks
 */
export function calculateStartDate(raceDate: Date, weeksToTrain: number): Date {
  const startDate = new Date(raceDate);
  startDate.setDate(startDate.getDate() - (weeksToTrain * 7));
  // Start on a Sunday (day 0 of the week)
  const dayOfWeek = startDate.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : -dayOfWeek;
  startDate.setDate(startDate.getDate() + daysUntilSunday);
  return startDate;
}

/**
 * Get current week number based on start date
 */
export function getCurrentWeekNumber(startDate: Date): number {
  const today = new Date();
  const diffTime = today.getTime() - startDate.getTime();
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.max(1, diffWeeks + 1);
}

/**
 * Get week start and end dates
 */
export function getWeekDates(startDate: Date, weekNumber: number): { start: Date; end: Date } {
  const weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() + ((weekNumber - 1) * 7));

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return { start: weekStart, end: weekEnd };
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

/**
 * Format date for display (e.g., "Mon, Nov 2")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

/**
 * Format date for calendar (e.g., "November 2, 2026")
 */
export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

/**
 * Format date for iCalendar (YYYYMMDDTHHMMSS)
 */
export function formatICalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Calculate pace from distance and duration
 * @param distance - miles
 * @param duration - minutes
 * @returns pace string (e.g., "9:30/mile")
 */
export function calculatePace(distance: number, duration: number): string {
  if (!distance || distance === 0) return '--:--';
  const paceMinutes = duration / distance;
  const minutes = Math.floor(paceMinutes);
  const seconds = Math.round((paceMinutes - minutes) * 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}/mile`;
}

/**
 * Estimate duration from distance and target pace
 * @param distance - miles
 * @param targetPace - 'easy' | 'tempo' | 'interval' | etc.
 * @returns estimated minutes
 */
export function estimateDuration(distance: number, targetPace: string): number {
  // Rough estimates (minutes per mile)
  const paceEstimates: Record<string, number> = {
    easy: 11,
    conversational: 11,
    recovery: 12,
    tempo: 9,
    interval: 8,
  };

  const minutesPerMile = paceEstimates[targetPace] || 10;
  return Math.round(distance * minutesPerMile);
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculate days until race
 */
export function daysUntilRace(raceDate: Date = NYC_MARATHON_2026): number {
  const today = new Date();
  const diffTime = raceDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays, 0);
}

/**
 * Format countdown for display
 */
export function formatCountdown(days: number): string {
  if (days === 0) return 'Race Day!';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;

  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  if (remainingDays === 0) {
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }

  return `${weeks} week${weeks > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
}

/**
 * Calculate total mileage from workouts
 */
export function calculateTotalMileage(workouts: Workout[]): number {
  return workouts.reduce((sum, workout) => {
    return sum + (workout.actualDistance || workout.distance || 0);
  }, 0);
}

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(workouts: Workout[]): number {
  const eligibleWorkouts = workouts.filter(w => w.type !== 'rest');
  if (eligibleWorkouts.length === 0) return 0;

  const completed = eligibleWorkouts.filter(w => w.completed).length;
  return completed / eligibleWorkouts.length;
}

/**
 * Get today's workout from a week
 */
export function getTodaysWorkout(week: TrainingWeek): Workout | null {
  const today = new Date();
  return week.workouts.find(workout => isToday(workout.date)) || null;
}

/**
 * Round to nearest 0.5
 */
export function roundToHalf(num: number): number {
  return Math.round(num * 2) / 2;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Load from localStorage with type safety
 */
export function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const item = window.localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);

    // Revive Date objects
    return JSON.parse(item, (key, value) => {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return null;
  }
}

/**
 * Save to localStorage
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

/**
 * Clear specific key from localStorage
 */
export function clearFromStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}
