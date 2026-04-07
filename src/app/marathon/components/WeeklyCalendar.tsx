"use client";

import type { TrainingWeek } from '../lib/types';
import { WorkoutCard } from './WorkoutCard';
import styles from '../marathon.module.css';

interface WeeklyCalendarProps {
  week: TrainingWeek;
  onCompleteWorkout?: (workoutId: string) => void;
  onUncompleteWorkout?: (workoutId: string) => void;
  compact?: boolean;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function WeeklyCalendar({ week, onCompleteWorkout, onUncompleteWorkout, compact = false }: WeeklyCalendarProps) {
  // Sort workouts by day
  const sortedWorkouts = [...week.workouts].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <div className={styles.weeklyCalendar}>
      <div className={styles.calendarGrid}>
        {sortedWorkouts.map((workout) => (
          <div key={workout.id} className={styles.calendarDay}>
            <div className={styles.dayHeader}>
              <span className={styles.dayName}>{DAY_NAMES[workout.dayOfWeek]}</span>
            </div>
            <WorkoutCard
              workout={workout}
              onComplete={onCompleteWorkout}
              onUncomplete={onUncompleteWorkout}
              compact={compact}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
