"use client";

import { useState } from 'react';
import type { TrainingWeek, Workout } from '../lib/types';
import { formatDate, isToday } from '../lib/utils';
import { WORKOUT_TEMPLATES } from '../lib/workout-library';
import styles from '../marathon.module.css';

interface CompactWeekViewProps {
  week: TrainingWeek;
  onWorkoutClick?: (workout: Workout) => void;
}

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CompactWeekView({ week, onWorkoutClick }: CompactWeekViewProps) {
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);

  const sortedWorkouts = [...week.workouts].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  const handleWorkoutClick = (workout: Workout) => {
    if (expandedWorkout === workout.id) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(workout.id);
    }
  };

  return (
    <div className={styles.compactWeekView}>
      <div className={styles.workoutScrollContainer}>
        {sortedWorkouts.map((workout) => {
          const template = WORKOUT_TEMPLATES[workout.type];
          const today = isToday(workout.date);
          const isExpanded = expandedWorkout === workout.id;

          return (
            <div
              key={workout.id}
              className={`${styles.compactWorkoutCard} ${
                workout.completed ? styles.compactCompleted : ''
              } ${today ? styles.compactToday : ''} ${isExpanded ? styles.compactExpanded : ''}`}
              onClick={() => handleWorkoutClick(workout)}
            >
              {/* Collapsed View */}
              <div className={styles.compactHeader}>
                <div className={styles.compactDay}>
                  <span className={styles.compactDayName}>{DAY_NAMES_SHORT[workout.dayOfWeek]}</span>
                  <span className={styles.compactDate}>{new Date(workout.date).getDate()}</span>
                </div>
                <div className={styles.compactInfo}>
                  <div className={styles.compactTitle}>
                    {template.name}
                    {today && <span className={styles.todayDot}>●</span>}
                    {workout.completed && <span className={styles.checkmark}>✓</span>}
                  </div>
                  {workout.distance && (
                    <div className={styles.compactDistance}>{workout.distance} mi</div>
                  )}
                </div>
              </div>

              {/* Expanded View */}
              {isExpanded && workout.type !== 'rest' && (
                <div className={styles.compactDetails}>
                  <div className={styles.compactStats}>
                    {workout.duration && (
                      <span className={styles.compactStat}>{workout.duration} min</span>
                    )}
                    <span className={styles.compactStat}>{workout.paceGuidance} pace</span>
                  </div>
                  <p className={styles.compactDescription}>{workout.description}</p>
                  {!workout.completed && onWorkoutClick && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onWorkoutClick(workout);
                      }}
                      className={styles.compactLogButton}
                    >
                      Log Workout
                    </button>
                  )}
                  {workout.completed && workout.actualDistance && (
                    <div className={styles.compactCompleted}>
                      <strong>Completed:</strong> {workout.actualDistance} mi in {workout.actualDuration} min
                      {workout.notes && <div className={styles.compactNotes}>{workout.notes}</div>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
