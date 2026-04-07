"use client";

import { useState } from 'react';
import type { TrainingPlan } from '../lib/types';
import { downloadCalendar, getCalendarStats } from '../lib/calendar-export';
import styles from '../marathon.module.css';

interface ExportCalendarButtonProps {
  plan: TrainingPlan;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function ExportCalendarButton({ plan, variant = 'outline' }: ExportCalendarButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    try {
      downloadCalendar(plan);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error exporting calendar:', error);
      alert('Failed to export calendar. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const stats = getCalendarStats(plan);

  return (
    <div className={styles.exportCalendarSection}>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`${styles.exportButton} ${styles[`button${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`}
      >
        {isExporting ? (
          <>
            <span className={styles.spinner}></span>
            Generating...
          </>
        ) : showSuccess ? (
          <>
            ✓ Downloaded!
          </>
        ) : (
          <>
            📅 Export to Calendar
          </>
        )}
      </button>

      <div className={styles.exportInfo}>
        <p className={styles.exportDescription}>
          Download an .ics file with all {stats.workoutEvents} workouts. Import to Google Calendar, Apple Calendar, or Outlook.
        </p>
        <p className={styles.exportNote}>
          Includes reminders 12 hours before each workout.
        </p>
      </div>
    </div>
  );
}
