"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTrainingState } from '../../lib/training-state';
import { WeekSummary } from '../../components/WeekSummary';
import { WeeklyCalendar } from '../../components/WeeklyCalendar';
import { TipsPanel } from '../../components/TipsPanel';
import { CompleteWorkoutForm } from '../../components/CompleteWorkoutForm';
import type { Workout } from '../../lib/types';
import styles from '../../marathon.module.css';

interface PageProps {
  params: Promise<{
    weekNumber: string;
  }>;
}

export default function WeekDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const weekNumber = parseInt(resolvedParams.weekNumber);

  const {
    plan,
    completeWorkout,
    uncompleteWorkout,
    isLoaded,
    hasProfile,
  } = useTrainingState();

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showCompleteForm, setShowCompleteForm] = useState(false);

  if (!isLoaded) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!hasProfile || !plan) {
    router.push('/marathon');
    return null;
  }

  const week = plan.weeks.find(w => w.weekNumber === weekNumber);

  if (!week) {
    return (
      <div className={styles.weekDetailPage}>
        <div className={styles.errorMessage}>
          <h2>Week not found</h2>
          <p>Week {weekNumber} doesn't exist in your training plan.</p>
          <button onClick={() => router.push('/marathon/dashboard')} className={styles.buttonPrimary}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleCompleteWorkout = (workoutId: string) => {
    const workout = week.workouts.find(w => w.id === workoutId);
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

  const previousWeek = weekNumber > 1 ? weekNumber - 1 : null;
  const nextWeek = weekNumber < plan.weeks.length ? weekNumber + 1 : null;

  return (
    <div className={styles.weekDetailPage}>
      <div className={styles.weekDetailHeader}>
        <button onClick={() => router.push('/marathon/dashboard')} className={styles.backButton}>
          ← Dashboard
        </button>
        <h1 className={styles.weekDetailTitle}>Week {weekNumber}</h1>
      </div>

      <div className={styles.weekDetailContent}>
        <section className={styles.weekSummarySection}>
          <WeekSummary week={week} showPhase />
        </section>

        <section className={styles.weekCalendarSection}>
          <h2 className={styles.sectionTitle}>Workouts</h2>
          <WeeklyCalendar
            week={week}
            onCompleteWorkout={handleCompleteWorkout}
            onUncompleteWorkout={uncompleteWorkout}
            compact={false}
          />
        </section>

        <section className={styles.weekTipsSection}>
          <TipsPanel
            weekNumber={weekNumber}
            phase={week.phase}
            showMultiple
          />
        </section>

        <section className={styles.weekNavigationSection}>
          <div className={styles.weekNavButtons}>
            {previousWeek && (
              <button
                onClick={() => router.push(`/marathon/week/${previousWeek}`)}
                className={styles.navButton}
              >
                ← Week {previousWeek}
              </button>
            )}
            {nextWeek && (
              <button
                onClick={() => router.push(`/marathon/week/${nextWeek}`)}
                className={styles.navButton}
              >
                Week {nextWeek} →
              </button>
            )}
          </div>
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
