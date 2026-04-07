"use client";

import type { Milestone } from '../lib/types';
import { formatLongDate } from '../lib/utils';
import styles from '../marathon.module.css';

interface MilestoneBadgeProps {
  milestone: Milestone;
  compact?: boolean;
}

const MILESTONE_EMOJIS: Record<Milestone['type'], string> = {
  first_week: '🎉',
  first_long_run: '🏃‍♂️',
  half_distance: '🎯',
  peak_week: '⛰️',
  taper_start: '🧘',
  race_week: '🏁',
  streak_7: '🔥',
  streak_14: '⚡',
  hundred_miles: '💯',
};

export function MilestoneBadge({ milestone, compact = false }: MilestoneBadgeProps) {
  const emoji = MILESTONE_EMOJIS[milestone.type] || '⭐';

  if (compact) {
    return (
      <div className={styles.milestoneBadgeCompact} title={milestone.description}>
        <span className={styles.milestoneEmoji}>{emoji}</span>
        <span className={styles.milestoneTitle}>{milestone.title}</span>
      </div>
    );
  }

  return (
    <div className={styles.milestoneBadge}>
      <div className={styles.milestoneIcon}>{emoji}</div>
      <div className={styles.milestoneContent}>
        <h4 className={styles.milestoneTitle}>{milestone.title}</h4>
        <p className={styles.milestoneDescription}>{milestone.description}</p>
        {milestone.achievedAt && (
          <span className={styles.milestoneDate}>
            {formatLongDate(new Date(milestone.achievedAt))}
          </span>
        )}
        {milestone.weekNumber && (
          <span className={styles.milestoneWeek}>Week {milestone.weekNumber}</span>
        )}
      </div>
    </div>
  );
}

interface MilestonesListProps {
  milestones: Milestone[];
  limit?: number;
}

export function MilestonesList({ milestones, limit }: MilestonesListProps) {
  const sortedMilestones = [...milestones].sort((a, b) => {
    const timeA = a.achievedAt || 0;
    const timeB = b.achievedAt || 0;
    return timeB - timeA; // Most recent first
  });

  const displayMilestones = limit ? sortedMilestones.slice(0, limit) : sortedMilestones;

  if (displayMilestones.length === 0) {
    return (
      <div className={styles.noMilestones}>
        <p>Complete your first workout to earn milestones!</p>
      </div>
    );
  }

  return (
    <div className={styles.milestonesList}>
      {displayMilestones.map(milestone => (
        <MilestoneBadge key={milestone.id} milestone={milestone} />
      ))}
    </div>
  );
}
