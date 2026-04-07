"use client";

import { useState } from 'react';
import type { Workout } from '../lib/types';
import { formatDate, isToday, isPast, calculatePace } from '../lib/utils';
import { WORKOUT_TEMPLATES } from '../lib/workout-library';
import styles from '../marathon.module.css';

interface WorkoutCardProps {
  workout: Workout;
  onComplete?: (workoutId: string) => void;
  onUncomplete?: (workoutId: string) => void;
  compact?: boolean;
}

export function WorkoutCard({ workout, onComplete, onUncomplete, compact = false }: WorkoutCardProps) {
  const template = WORKOUT_TEMPLATES[workout.type];
  const isRestDay = workout.type === 'rest';
  const canComplete = isPast(workout.date) || isToday(workout.date);
  const today = isToday(workout.date);

  const handleClick = () => {
    if (!canComplete || !onComplete) return;

    if (workout.completed && onUncomplete) {
      onUncomplete(workout.id);
    } else if (!workout.completed && !isRestDay) {
      onComplete(workout.id);
    }
  };

  return (
    <div
      className={`${styles.workoutCard} ${workout.completed ? styles.workoutCardCompleted : ''} ${
        today ? styles.workoutCardToday : ''
      } ${compact ? styles.workoutCardCompact : ''}`}
      onClick={handleClick}
      style={{
        cursor: canComplete && !isRestDay ? 'pointer' : 'default',
      }}
    >
      <div className={styles.workoutCardHeader}>
        <div className={styles.workoutCardTitle}>
          <span className={styles.workoutCardType}>{template.name}</span>
          {today && <span className={styles.todayBadge}>Today</span>}
          {workout.completed && <span className={styles.completedBadge}>✓</span>}
        </div>
        <span className={styles.workoutCardDate}>{formatDate(workout.date)}</span>
      </div>

      {!isRestDay && (
        <>
          <div className={styles.workoutCardStats}>
            {workout.distance && (
              <div className={styles.workoutCardStat}>
                <span className={styles.statLabel}>Distance</span>
                <span className={styles.statValue}>{workout.distance} mi</span>
              </div>
            )}
            {workout.duration && (
              <div className={styles.workoutCardStat}>
                <span className={styles.statLabel}>Time</span>
                <span className={styles.statValue}>{workout.duration} min</span>
              </div>
            )}
            <div className={styles.workoutCardStat}>
              <span className={styles.statLabel}>Pace</span>
              <span className={styles.statValue}>{workout.paceGuidance}</span>
            </div>
          </div>

          {!compact && (
            <p className={styles.workoutCardDescription}>{workout.description}</p>
          )}

          {workout.completed && workout.actualDistance && (
            <div className={styles.workoutCardActuals}>
              <div className={styles.actualStat}>
                <span className={styles.actualLabel}>Completed:</span>
                <span className={styles.actualValue}>
                  {workout.actualDistance} mi in {workout.actualDuration} min
                </span>
              </div>
              {workout.actualPace && (
                <div className={styles.actualStat}>
                  <span className={styles.actualLabel}>Pace:</span>
                  <span className={styles.actualValue}>{workout.actualPace}</span>
                </div>
              )}
              {workout.notes && (
                <p className={styles.workoutNotes}>{workout.notes}</p>
              )}
            </div>
          )}
        </>
      )}

      {isRestDay && (
        <p className={styles.workoutCardDescription}>{workout.description}</p>
      )}
    </div>
  );
}
