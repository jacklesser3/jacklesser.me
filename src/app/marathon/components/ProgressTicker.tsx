"use client";

import { useMemo } from 'react';
import type { ProgressMetrics, TrainingPlan } from '../lib/types';
import { daysUntilRace } from '../lib/utils';
import styles from '../marathon.module.css';

interface ProgressTickerProps {
  progress: ProgressMetrics | null;
  plan: TrainingPlan;
  currentWeekNumber: number;
}

export function ProgressTicker({ progress, plan, currentWeekNumber }: ProgressTickerProps) {
  const tickerItems = useMemo(() => {
    const items = [];
    const daysLeft = daysUntilRace();
    const weeksLeft = Math.floor(daysLeft / 7);

    // Race countdown
    items.push({
      icon: '🏁',
      label: 'Race Day',
      value: `${weeksLeft}w ${daysLeft % 7}d`,
    });

    // Total miles
    items.push({
      icon: '📍',
      label: 'Total Miles',
      value: progress?.totalActualMiles.toFixed(1) || '0.0',
    });

    // Completion rate
    items.push({
      icon: '✓',
      label: 'Completion',
      value: `${Math.round((progress?.overallCompletionRate || 0) * 100)}%`,
    });

    // Current streak
    if (progress && progress.currentStreak > 0) {
      items.push({
        icon: '🔥',
        label: 'Streak',
        value: `${progress.currentStreak} days`,
      });
    }

    // Current week
    items.push({
      icon: '📅',
      label: 'Training Week',
      value: `${currentWeekNumber}/${plan.totalWeeks}`,
    });

    // Peak mileage
    items.push({
      icon: '⛰️',
      label: 'Peak Week',
      value: `${plan.peakMileage} mi`,
    });

    // Longest run
    items.push({
      icon: '🏃',
      label: 'Longest Run',
      value: `${plan.longestRun} mi`,
    });

    // Current phase
    const currentPhase = plan.phases.find(
      p => currentWeekNumber >= p.startWeek && currentWeekNumber <= p.endWeek
    );
    if (currentPhase) {
      items.push({
        icon: '📊',
        label: 'Phase',
        value: currentPhase.name,
      });
    }

    // Workouts completed
    if (progress) {
      const totalWorkouts = progress.weeklyStats.reduce((sum, w) => sum + w.totalWorkouts, 0);
      const completedWorkouts = progress.weeklyStats.reduce((sum, w) => sum + w.workoutsCompleted, 0);
      items.push({
        icon: '💪',
        label: 'Workouts',
        value: `${completedWorkouts}/${totalWorkouts}`,
      });
    }

    // Milestones
    if (progress && progress.milestones.length > 0) {
      items.push({
        icon: '🏆',
        label: 'Milestones',
        value: `${progress.milestones.length}`,
      });
    }

    return items;
  }, [progress, plan, currentWeekNumber]);

  return (
    <div className={styles.progressTicker}>
      <div className={styles.tickerTrack}>
        {/* Render items twice for seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <div key={index} className={styles.tickerItem}>
            <span className={styles.tickerIcon}>{item.icon}</span>
            <div className={styles.tickerText}>
              <span className={styles.tickerValue}>{item.value}</span>
              <span className={styles.tickerLabel}>{item.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
