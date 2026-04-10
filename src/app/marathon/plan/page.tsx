"use client";

import { useState, useEffect } from 'react';
import { useTrainingState } from '../lib/training-state';
import styles from './plan.module.css';

export default function TrainingPlanPage() {
  const { plan, completeWorkout, uncompleteWorkout } = useTrainingState();
  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));

  if (!plan) {
    return <div className={styles.loading}>Loading your training plan...</div>;
  }

  const togglePhase = (phaseNum: number) => {
    setOpenPhases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(phaseNum)) {
        newSet.delete(phaseNum);
      } else {
        newSet.add(phaseNum);
      }
      return newSet;
    });
  };

  const handleWorkoutToggle = (workoutId: string, isCompleted: boolean) => {
    if (isCompleted) {
      uncompleteWorkout(workoutId);
    } else {
      // Simple completion - just mark as done with planned distance
      const workout = plan.weeks
        .flatMap(w => w.workouts)
        .find(w => w.id === workoutId);

      if (workout && workout.distance) {
        completeWorkout(workoutId, {
          actualDistance: workout.distance,
          actualDuration: workout.duration || 60,
        });
      }
    }
  };

  // Group weeks by phase
  const phases = [
    { num: 1, name: 'Foundation', weeks: [1, 2, 3, 4], color: '#4ade80', dates: 'Weeks 1–4', mileage: '15–22 mi/wk' },
    { num: 2, name: 'Aerobic Development', weeks: [5, 6, 7, 8], color: '#60a5fa', dates: 'Weeks 5–8', mileage: '22–28 mi/wk' },
    { num: 3, name: 'Endurance Building', weeks: [9, 10, 11, 12, 13, 14], color: '#facc15', dates: 'Weeks 9–14', mileage: '28–35 mi/wk' },
    { num: 4, name: 'Peak Training', weeks: [15, 16, 17, 18, 19, 20], color: '#e8652e', dates: 'Weeks 15–20', mileage: '35–40 mi/wk' },
    { num: 5, name: 'Taper', weeks: [21, 22, 23], color: '#c084fc', dates: 'Weeks 21–23', mileage: '25–18 mi/wk' },
    { num: 6, name: 'Race Week', weeks: [24], color: '#f87171', dates: 'Week 24', mileage: 'Race Day' },
  ];

  const startDate = plan.startDate;
  const raceDate = new Date(startDate);
  raceDate.setDate(raceDate.getDate() + (24 * 7));

  return (
    <div className={styles.container}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>Your Training Blueprint</div>
        <h1 className={styles.heroTitle}>
          NYC Marathon <em>Training Plan</em>
        </h1>
        <p className={styles.heroSub}>
          24-week phased training plan building to 26.2 miles. Race day — {raceDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
        </p>
        <div className={styles.heroMeta}>
          <div className={styles.heroMetaItem}>
            <div className={styles.value}>24</div>
            <div className={styles.label}>Weeks</div>
          </div>
          <div className={styles.heroMetaItem}>
            <div className={styles.value}>{plan.peakMileage}</div>
            <div className={styles.label}>Peak Miles/Wk</div>
          </div>
          <div className={styles.heroMetaItem}>
            <div className={styles.value}>{plan.longestRun}</div>
            <div className={styles.label}>Peak Long Run</div>
          </div>
          <div className={styles.heroMetaItem}>
            <div className={styles.value}>26.2</div>
            <div className={styles.label}>Miles</div>
          </div>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>00</span>
          <h2>How This Plan Works</h2>
        </div>
        <p>This guide is structured in 6 phases across 24 weeks. Each phase has a specific purpose — from building your aerobic foundation to sharpening for race day. The plan uses a 3-week build / 1-week recovery cycle to keep you healthy.</p>
        <p>Most training runs should be at easy conversational pace. The hard truth of marathon training: <strong>you get fast by running easy</strong>.</p>

        <div className={styles.tipBox + ' ' + styles.mindset}>
          <h4>Mindset</h4>
          <p>Every mile you train is a deposit. There will be weeks where life gets in the way — miss one run, not three. Consistency over perfection. You're training for a single day in November, and the work starts now.</p>
        </div>
      </div>

      {/* PHASES */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>01</span>
          <h2>The Training Phases</h2>
        </div>

        {phases.map(phase => {
          const phaseWeeks = plan.weeks.filter(w => phase.weeks.includes(w.weekNumber));
          const isOpen = openPhases.has(phase.num);

          return (
            <div key={phase.num} className={`${styles.phase} ${isOpen ? styles.open : ''}`}>
              <div className={styles.phaseHeader} onClick={() => togglePhase(phase.num)}>
                <div className={styles.phaseTitleGroup}>
                  <div className={styles.phaseDot} style={{ background: phase.color }} />
                  <div>
                    <div className={styles.phaseName}>Phase {phase.num} — {phase.name}</div>
                    <div className={styles.phaseDates}>{phase.dates}</div>
                  </div>
                </div>
                <span className={styles.phaseBadge} style={{ background: phase.color + '22', color: phase.color }}>
                  {phase.mileage}
                </span>
              </div>

              {isOpen && (
                <div className={styles.phaseBody}>
                  <table className={styles.weekTable}>
                    <thead>
                      <tr>
                        <th>Week</th>
                        <th>Total Miles</th>
                        <th>Long Run</th>
                        <th>Workouts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phaseWeeks.map(week => {
                        const longRun = week.workouts.find(w => w.type === 'long_run');
                        const otherWorkouts = week.workouts.filter(w => w.type !== 'rest' && w.type !== 'long_run');

                        return (
                          <tr key={week.weekNumber}>
                            <td className={styles.weekNum}>Wk {week.weekNumber}</td>
                            <td className={styles.miles}>{Math.round(week.totalPlannedMiles)} mi</td>
                            <td className={styles.longRun}>{longRun?.distance || 0} mi</td>
                            <td>
                              <div className={styles.workoutChecklist}>
                                {week.workouts.filter(w => w.type !== 'rest').map(workout => (
                                  <label key={workout.id} className={styles.workoutItem}>
                                    <input
                                      type="checkbox"
                                      checked={workout.completed}
                                      onChange={() => handleWorkoutToggle(workout.id, workout.completed)}
                                    />
                                    <span className={workout.completed ? styles.completed : ''}>
                                      {workout.description}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <div className={styles.motto}>The miracle isn't that you finished — it's that you had the courage to start.</div>
        <p>NYC Marathon Training · 24 Weeks · {raceDate.getFullYear()}</p>
      </div>
    </div>
  );
}
