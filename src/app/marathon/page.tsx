"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTrainingState } from './lib/training-state';
import { daysUntilRace, formatCountdown, NYC_MARATHON_2026, formatLongDate } from './lib/utils';
import styles from './marathon.module.css';

export default function MarathonLandingPage() {
  const router = useRouter();
  const { hasProfile, isLoaded } = useTrainingState();
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    setCountdown(daysUntilRace());
  }, []);

  useEffect(() => {
    // Redirect to plan if user already has a profile
    if (isLoaded && hasProfile) {
      router.push('/marathon/plan');
    }
  }, [isLoaded, hasProfile, router]);

  const handleGetStarted = () => {
    router.push('/marathon/onboarding');
  };

  if (!isLoaded) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.landingPage}>
      <div className={styles.landingHero}>
        <h1 className={styles.heroTitle}>NYC Marathon 2026</h1>
        <p className={styles.heroSubtitle}>
          {formatLongDate(NYC_MARATHON_2026)}
        </p>

        <div className={styles.countdown}>
          <div className={styles.countdownNumber}>{countdown}</div>
          <div className={styles.countdownLabel}>days until race day</div>
        </div>

        <p className={styles.heroDescription}>
          Your personalized marathon training plan. Built for beginners, designed for success.
        </p>

        <button onClick={handleGetStarted} className={styles.ctaButton}>
          Start Training
        </button>
      </div>

      <div className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>What You'll Get</h2>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📅</div>
            <h3 className={styles.featureTitle}>Personalized Plan</h3>
            <p className={styles.featureDescription}>
              24-week full marathon training plan building to 26.2 miles. Pick your start date and train at your own pace.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Progress Tracking</h3>
            <p className={styles.featureDescription}>
              Log workouts, track mileage, and see your progress week by week. Stay motivated with milestones and streaks.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>💡</div>
            <h3 className={styles.featureTitle}>Expert Guidance</h3>
            <p className={styles.featureDescription}>
              Educational tips on Zone 2 training, recovery, nutrition, and race day strategy. Learn as you train.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📲</div>
            <h3 className={styles.featureTitle}>Calendar Export</h3>
            <p className={styles.featureDescription}>
              Download your plan as an .ics file. Import to Google Calendar, Apple Calendar, or Outlook with built-in reminders.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🏃</div>
            <h3 className={styles.featureTitle}>Beginner Friendly</h3>
            <p className={styles.featureDescription}>
              Conservative progression, built-in recovery weeks, and emphasis on injury prevention. Perfect for first-time marathoners.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🎯</div>
            <h3 className={styles.featureTitle}>Goal Oriented</h3>
            <p className={styles.featureDescription}>
              Whether you want to finish strong or target a specific time, your plan adapts to your goals and adjusts for your experience.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.trainingPhases}>
        <h2 className={styles.phasesTitle}>Your Training Journey</h2>

        <div className={styles.phasesList}>
          <div className={styles.phaseItem}>
            <span className={`${styles.phaseNumber} ${styles.phaseBase}`}>1</span>
            <div className={styles.phaseContent}>
              <h3 className={styles.phaseName}>Base Building</h3>
              <p className={styles.phaseDesc}>
                Build your aerobic foundation with easy-paced runs. Focus on time on feet, not speed.
              </p>
            </div>
          </div>

          <div className={styles.phaseItem}>
            <span className={`${styles.phaseNumber} ${styles.phaseBuild}`}>2</span>
            <div className={styles.phaseContent}>
              <h3 className={styles.phaseName}>Build</h3>
              <p className={styles.phaseDesc}>
                Add tempo runs and intervals to develop speed and lactate threshold.
              </p>
            </div>
          </div>

          <div className={styles.phaseItem}>
            <span className={`${styles.phaseNumber} ${styles.phasePeak}`}>3</span>
            <div className={styles.phaseContent}>
              <h3 className={styles.phaseName}>Peak</h3>
              <p className={styles.phaseDesc}>
                Highest mileage weeks with 20+ mile long runs. You're at your strongest.
              </p>
            </div>
          </div>

          <div className={styles.phaseItem}>
            <span className={`${styles.phaseNumber} ${styles.phaseTaper}`}>4</span>
            <div className={styles.phaseContent}>
              <h3 className={styles.phaseName}>Taper</h3>
              <p className={styles.phaseDesc}>
                Reduce volume, maintain intensity. Rest and trust your training.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Start?</h2>
        <p className={styles.ctaText}>
          Answer a few questions about your fitness level and goals, and we'll generate your personalized training plan in seconds.
        </p>
        <button onClick={handleGetStarted} className={styles.ctaButton}>
          Create My Plan
        </button>
      </div>
    </div>
  );
}
