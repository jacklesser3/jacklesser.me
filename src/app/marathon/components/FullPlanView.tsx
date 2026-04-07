"use client";

import { useState } from 'react';
import type { TrainingPlan } from '../lib/types';
import { formatDate } from '../lib/utils';
import { WORKOUT_TEMPLATES } from '../lib/workout-library';
import styles from '../marathon.module.css';

interface FullPlanViewProps {
  plan: TrainingPlan;
  currentWeekNumber: number;
}

export function FullPlanView({ plan, currentWeekNumber }: FullPlanViewProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([currentWeekNumber]));

  const toggleWeek = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  const expandAll = () => {
    setExpandedWeeks(new Set(plan.weeks.map(w => w.weekNumber)));
  };

  const collapseAll = () => {
    setExpandedWeeks(new Set());
  };

  return (
    <div className={styles.fullPlanView}>
      <div className={styles.fullPlanHeader}>
        <h2 className={styles.fullPlanTitle}>Full {plan.totalWeeks}-Week Training Plan</h2>
        <div className={styles.fullPlanActions}>
          <button onClick={expandAll} className={styles.planActionButton}>
            Expand All
          </button>
          <button onClick={collapseAll} className={styles.planActionButton}>
            Collapse All
          </button>
        </div>
      </div>

      <div className={styles.weeksList}>
        {plan.weeks.map((week) => {
          const isExpanded = expandedWeeks.has(week.weekNumber);
          const isCurrent = week.weekNumber === currentWeekNumber;
          const isPast = week.weekNumber < currentWeekNumber;

          return (
            <div
              key={week.weekNumber}
              className={`${styles.weekRow} ${isCurrent ? styles.weekRowCurrent : ''} ${isPast ? styles.weekRowPast : ''}`}
            >
              <div className={styles.weekRowHeader} onClick={() => toggleWeek(week.weekNumber)}>
                <div className={styles.weekRowLeft}>
                  <span className={styles.weekRowNumber}>Week {week.weekNumber}</span>
                  <span className={styles.weekRowDates}>
                    {formatDate(week.startDate)} - {formatDate(week.endDate)}
                  </span>
                  {isCurrent && <span className={styles.currentBadge}>Current</span>}
                  {week.isRecoveryWeek && <span className={styles.recoveryBadge}>Recovery</span>}
                </div>

                <div className={styles.weekRowRight}>
                  <span className={`${styles.phaseBadge} ${styles[`phase${week.phase.replace(/\s+/g, '')}`]}`}>
                    {week.phase}
                  </span>
                  <span className={styles.weekRowMiles}>{week.totalPlannedMiles} mi</span>
                  {week.totalActualMiles > 0 && (
                    <span className={styles.weekRowActual}>
                      ({week.totalActualMiles.toFixed(1)} actual)
                    </span>
                  )}
                  <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.weekRowContent}>
                  <div className={styles.weekWorkouts}>
                    {week.workouts.map((workout) => {
                      const template = WORKOUT_TEMPLATES[workout.type];
                      return (
                        <div
                          key={workout.id}
                          className={`${styles.miniWorkout} ${workout.completed ? styles.miniWorkoutCompleted : ''}`}
                        >
                          <div className={styles.miniWorkoutDay}>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][workout.dayOfWeek]}
                          </div>
                          <div className={styles.miniWorkoutInfo}>
                            <span className={styles.miniWorkoutType}>{template.name}</span>
                            {workout.distance && (
                              <span className={styles.miniWorkoutDistance}>{workout.distance} mi</span>
                            )}
                            {workout.completed && <span className={styles.miniCheck}>✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
