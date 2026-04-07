"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTrainingState } from '../lib/training-state';
import { daysUntilRace, formatCountdown, getTodaysWorkout } from '../lib/utils';
import { WeekSummary } from '../components/WeekSummary';
import { CompactWeekView } from '../components/CompactWeekView';
import { ProgressChart } from '../components/ProgressChart';
import { TipsPanel } from '../components/TipsPanel';
import { ProgressTicker } from '../components/ProgressTicker';
import { FullPlanView } from '../components/FullPlanView';
import { MilestonesList } from '../components/MilestoneBadge';
import { ExportCalendarButton } from '../components/ExportCalendarButton';
import { CompleteWorkoutForm } from '../components/CompleteWorkoutForm';
import type { Workout } from '../lib/types';
import styles from '../marathon.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const {
    profile,
    plan,
    progress,
    currentWeek,
    currentWeekNumber,
    isLoaded,
    hasProfile,
    completeWorkout,
    uncompleteWorkout,
    updateProgressMetrics,
  } = useTrainingState();

  const [countdown, setCountdown] = useState<number>(0);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  useEffect(() => {
    setCountdown(daysUntilRace());
  }, []);

  useEffect(() => {
    if (isLoaded && !hasProfile) {
      router.push('/marathon');
    }
  }, [isLoaded, hasProfile, router]);

  const handleCompleteWorkout = (workoutId: string) => {
    if (!plan) return;

    const workout = plan.weeks
      .flatMap(w => w.workouts)
      .find(w => w.id === workoutId);

    if (workout) {
      setSelectedWorkout(workout);
      setShowCompleteForm(true);
    }
  };

  const handleSubmitCompletion = (workoutId: string, data: any) => {
    completeWorkout(workoutId, data);
    setShowCompleteForm(false);
    setSelectedWorkout(null);
  };

  const handleViewWeek = (weekNumber: number) => {
    router.push(`/marathon/week/${weekNumber}`);
  };

  if (!isLoaded || !plan || !profile || !currentWeek) {
    return <div className={styles.loading}>Loading your training plan...</div>;
  }

  const todaysWorkout = getTodaysWorkout(currentWeek);
  const recentMilestones = progress?.milestones.slice(0, 3) || [];

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.dashboardTitle}>Training Dashboard</h1>
          <div className={styles.raceCountdown}>
            <div className={styles.countdownTicker}>
              <span className={styles.tickerLabel}>NYC MARATHON 2026</span>
              <div className={styles.tickerNumbers}>
                <div className={styles.tickerUnit}>
                  <span className={styles.tickerValue}>{Math.floor(countdown / 7)}</span>
                  <span className={styles.tickerUnitLabel}>weeks</span>
                </div>
                <div className={styles.tickerDivider}>·</div>
                <div className={styles.tickerUnit}>
                  <span className={styles.tickerValue}>{countdown % 7}</span>
                  <span className={styles.tickerUnitLabel}>days</span>
                </div>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((plan.totalWeeks - currentWeekNumber + 1) / plan.totalWeeks) * 100}%` }}
                />
              </div>
              <span className={styles.weekProgress}>Week {currentWeekNumber} of {plan.totalWeeks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Progress Ticker */}
      <ProgressTicker
        progress={progress}
        plan={plan}
        currentWeekNumber={currentWeekNumber}
      />

      <div className={styles.dashboardGrid}>
        {/* Quick Start Guide */}
        {progress && progress.totalActualMiles === 0 && (
          <div className={styles.quickStartBanner}>
            <span className={styles.bannerIcon}>💡</span>
            <div className={styles.bannerContent}>
              <strong>How to track progress:</strong> Complete a workout, then click "Mark Complete" or click on any day below to log it!
            </div>
          </div>
        )}

        {/* Today's Workout */}
        <section className={styles.todaysSection}>
          <h2 className={styles.sectionTitle}>Today's Workout</h2>
          {todaysWorkout ? (
            <div className={styles.todayWorkoutCard}>
              <div className={styles.workoutHeader}>
                <h3 className={styles.workoutType}>{todaysWorkout.type.replace('_', ' ')}</h3>
                {todaysWorkout.completed ? (
                  <span className={styles.completedBadge}>✓ Completed</span>
                ) : (
                  <button
                    onClick={() => handleCompleteWorkout(todaysWorkout.id)}
                    className={styles.completeButton}
                  >
                    Mark Complete
                  </button>
                )}
              </div>

              {todaysWorkout.type !== 'rest' && (
                <>
                  <div className={styles.workoutDetails}>
                    {todaysWorkout.distance && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Distance:</span>
                        <span className={styles.detailValue}>{todaysWorkout.distance} miles</span>
                      </div>
                    )}
                    {todaysWorkout.duration && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Duration:</span>
                        <span className={styles.detailValue}>{todaysWorkout.duration} min</span>
                      </div>
                    )}
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Pace:</span>
                      <span className={styles.detailValue}>{todaysWorkout.paceGuidance}</span>
                    </div>
                  </div>

                  <p className={styles.workoutDescription}>{todaysWorkout.description}</p>
                </>
              )}

              {todaysWorkout.type === 'rest' && (
                <p className={styles.restDayMessage}>
                  Rest and recovery day. Your body rebuilds and gets stronger during rest.
                </p>
              )}
            </div>
          ) : (
            <div className={styles.noWorkoutToday}>
              <p>No workout scheduled for today. Check your weekly calendar below.</p>
            </div>
          )}
        </section>


        {/* Current Week */}
        <section className={styles.currentWeekSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Week {currentWeekNumber}</h2>
          </div>

          <WeekSummary week={currentWeek} />

          <div className={styles.weekCalendarContainer}>
            <CompactWeekView
              week={currentWeek}
              onWorkoutClick={handleCompleteWorkout}
            />
          </div>
        </section>

        {/* Mileage Chart */}
        <section className={styles.chartSection}>
          <ProgressChart
            weeks={plan.weeks}
            currentWeekNumber={currentWeekNumber}
            maxWeeksToShow={12}
          />
        </section>

        {/* Training Tips */}
        <section className={styles.tipsSection}>
          <TipsPanel
            weekNumber={currentWeekNumber}
            phase={currentWeek.phase}
            showMultiple={false}
          />
        </section>

        {/* Recent Milestones */}
        {recentMilestones.length > 0 && (
          <section className={styles.milestonesSection}>
            <h2 className={styles.sectionTitle}>Recent Milestones</h2>
            <MilestonesList milestones={recentMilestones} limit={3} />
          </section>
        )}

        {/* Calendar Export */}
        <section className={styles.exportSection}>
          <h2 className={styles.sectionTitle}>Export Your Plan</h2>
          <ExportCalendarButton plan={plan} variant="outline" />
        </section>

        {/* Full Training Plan */}
        <section className={styles.fullPlanSection}>
          <FullPlanView plan={plan} currentWeekNumber={currentWeekNumber} />
        </section>

      </div>

      {/* Complete Workout Modal */}
      {showCompleteForm && selectedWorkout && (
        <CompleteWorkoutForm
          workout={selectedWorkout}
          onComplete={handleSubmitCompletion}
          onCancel={() => {
            setShowCompleteForm(false);
            setSelectedWorkout(null);
          }}
        />
      )}
    </div>
  );
}
