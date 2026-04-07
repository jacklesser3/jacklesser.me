"use client";

import type { TrainingWeek } from '../lib/types';
import { formatDate, formatLongDate } from '../lib/utils';
import styles from '../marathon.module.css';

interface WeekSummaryProps {
  week: TrainingWeek;
  showPhase?: boolean;
}

export function WeekSummary({ week, showPhase = true }: WeekSummaryProps) {
  const completedWorkouts = week.workouts.filter(w => w.completed && w.type !== 'rest').length;
  const totalWorkouts = week.workouts.filter(w => w.type !== 'rest').length;
  const completionPercentage = Math.round(week.completionRate * 100);

  return (
    <div className={styles.weekSummary}>
      <div className={styles.weekSummaryHeader}>
        <div>
          <h3 className={styles.weekSummaryTitle}>Week {week.weekNumber}</h3>
          <p className={styles.weekSummaryDates}>
            {formatDate(week.startDate)} - {formatDate(week.endDate)}
          </p>
        </div>
        {showPhase && (
          <span className={`${styles.phaseBadge} ${styles[`phase${week.phase.replace(/\s+/g, '')}`]}`}>
            {week.phase}
          </span>
        )}
      </div>

      <div className={styles.weekSummaryStats}>
        <div className={styles.summaryStat}>
          <span className={styles.summaryStatValue}>{week.totalPlannedMiles}</span>
          <span className={styles.summaryStatLabel}>Planned Miles</span>
        </div>

        {week.totalActualMiles > 0 && (
          <div className={styles.summaryStat}>
            <span className={styles.summaryStatValue}>{week.totalActualMiles.toFixed(1)}</span>
            <span className={styles.summaryStatLabel}>Actual Miles</span>
          </div>
        )}

        <div className={styles.summaryStat}>
          <span className={styles.summaryStatValue}>
            {completedWorkouts}/{totalWorkouts}
          </span>
          <span className={styles.summaryStatLabel}>Workouts</span>
        </div>

        {completedWorkouts > 0 && (
          <div className={styles.summaryStat}>
            <span className={styles.summaryStatValue}>{completionPercentage}%</span>
            <span className={styles.summaryStatLabel}>Complete</span>
          </div>
        )}
      </div>

      {week.isRecoveryWeek && (
        <div className={styles.recoveryWeekBadge}>
          Recovery Week - Reduced volume for adaptation
        </div>
      )}

      {week.weeklyTip && (
        <div className={styles.weeklyTip}>
          <strong>Tip:</strong> {week.weeklyTip}
        </div>
      )}
    </div>
  );
}
