"use client";

import { useState } from 'react';
import type { Workout, CompletionData } from '../lib/types';
import { calculatePace } from '../lib/utils';
import styles from '../marathon.module.css';

interface CompleteWorkoutFormProps {
  workout: Workout;
  onComplete: (workoutId: string, data: CompletionData) => void;
  onCancel: () => void;
}

export function CompleteWorkoutForm({ workout, onComplete, onCancel }: CompleteWorkoutFormProps) {
  const [actualDistance, setActualDistance] = useState(workout.distance?.toString() || '');
  const [actualDuration, setActualDuration] = useState(workout.duration?.toString() || '');
  const [notes, setNotes] = useState('');
  const [effortLevel, setEffortLevel] = useState<number>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const distance = parseFloat(actualDistance);
    const duration = parseFloat(actualDuration);

    if (isNaN(distance) || isNaN(duration) || distance <= 0 || duration <= 0) {
      alert('Please enter valid distance and duration');
      return;
    }

    const pace = calculatePace(distance, duration);

    const completionData: CompletionData = {
      actualDistance: distance,
      actualDuration: duration,
      actualPace: pace,
      notes: notes.trim() || undefined,
      effortLevel,
    };

    onComplete(workout.id, completionData);
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Complete Workout</h3>
          <button onClick={onCancel} className={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.workoutForm}>
          <div className={styles.formGroup}>
            <label htmlFor="distance" className={styles.formLabel}>
              Distance (miles)
            </label>
            <input
              type="number"
              id="distance"
              step="0.1"
              min="0"
              value={actualDistance}
              onChange={(e) => setActualDistance(e.target.value)}
              className={styles.formInput}
              placeholder="e.g., 5.0"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="duration" className={styles.formLabel}>
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              step="1"
              min="0"
              value={actualDuration}
              onChange={(e) => setActualDuration(e.target.value)}
              className={styles.formInput}
              placeholder="e.g., 45"
              required
            />
          </div>

          {actualDistance && actualDuration && (
            <div className={styles.pacePreview}>
              <span className={styles.paceLabel}>Pace:</span>
              <span className={styles.paceValue}>
                {calculatePace(parseFloat(actualDistance), parseFloat(actualDuration))}
              </span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="effort" className={styles.formLabel}>
              Effort Level: {effortLevel}/10
            </label>
            <input
              type="range"
              id="effort"
              min="1"
              max="10"
              value={effortLevel}
              onChange={(e) => setEffortLevel(parseInt(e.target.value))}
              className={styles.formRange}
            />
            <div className={styles.effortLabels}>
              <span>Easy</span>
              <span>Moderate</span>
              <span>Hard</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes" className={styles.formLabel}>
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={styles.formTextarea}
              placeholder="How did it feel? Any observations?"
              rows={3}
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onCancel} className={styles.buttonSecondary}>
              Cancel
            </button>
            <button type="submit" className={styles.buttonPrimary}>
              Complete Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
