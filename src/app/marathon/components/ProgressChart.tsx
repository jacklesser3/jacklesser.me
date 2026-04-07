"use client";

import type { TrainingWeek } from '../lib/types';
import styles from '../marathon.module.css';

interface ProgressChartProps {
  weeks: TrainingWeek[];
  currentWeekNumber: number;
  maxWeeksToShow?: number;
}

export function ProgressChart({ weeks, currentWeekNumber, maxWeeksToShow = 12 }: ProgressChartProps) {
  // Show only recent/upcoming weeks
  const startWeek = Math.max(1, currentWeekNumber - 4);
  const endWeek = Math.min(weeks.length, startWeek + maxWeeksToShow - 1);
  const displayWeeks = weeks.slice(startWeek - 1, endWeek);

  // Calculate max mileage for scaling
  const maxMileage = Math.max(...displayWeeks.map(w => w.totalPlannedMiles));
  const chartHeight = 200;

  return (
    <div className={styles.progressChart}>
      <h3 className={styles.chartTitle}>Weekly Mileage Progress</h3>

      <div className={styles.chartContainer}>
        <svg
          className={styles.chartSvg}
          viewBox={`0 0 ${displayWeeks.length * 60} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {displayWeeks.map((week, index) => {
            const x = index * 60 + 15;
            const plannedHeight = (week.totalPlannedMiles / maxMileage) * (chartHeight - 40);
            const actualHeight = (week.totalActualMiles / maxMileage) * (chartHeight - 40);
            const isCurrent = week.weekNumber === currentWeekNumber;

            return (
              <g key={week.weekNumber}>
                {/* Planned bar (background) */}
                <rect
                  x={x}
                  y={chartHeight - 20 - plannedHeight}
                  width={20}
                  height={plannedHeight}
                  fill="rgba(108, 140, 173, 0.3)"
                  rx={2}
                />

                {/* Actual bar (foreground) */}
                {week.totalActualMiles > 0 && (
                  <rect
                    x={x}
                    y={chartHeight - 20 - actualHeight}
                    width={20}
                    height={actualHeight}
                    fill={isCurrent ? '#C88D5D' : '#6C8CAD'}
                    rx={2}
                  />
                )}

                {/* Current week indicator */}
                {isCurrent && (
                  <circle
                    cx={x + 10}
                    cy={chartHeight - 20 - plannedHeight - 5}
                    r={3}
                    fill="#C88D5D"
                  />
                )}

                {/* Week number label */}
                <text
                  x={x + 10}
                  y={chartHeight - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#596470"
                >
                  {week.weekNumber}
                </text>

                {/* Mileage label */}
                <text
                  x={x + 10}
                  y={chartHeight - 20 - plannedHeight - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#616F81"
                  fontWeight="500"
                >
                  {week.totalActualMiles > 0
                    ? week.totalActualMiles.toFixed(1)
                    : week.totalPlannedMiles}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.chartLegend}>
        <div className={styles.legendItem}>
          <span className={styles.legendColorPlanned}></span>
          <span className={styles.legendLabel}>Planned</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendColorActual}></span>
          <span className={styles.legendLabel}>Actual</span>
        </div>
      </div>
    </div>
  );
}
