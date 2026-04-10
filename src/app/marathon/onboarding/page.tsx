"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTrainingState } from '../lib/training-state';
import type { FitnessLevel, GoalFinishTime } from '../lib/types';
import styles from '../marathon.module.css';

export default function OnboardingPage() {
  const router = useRouter();
  const { createProfile } = useTrainingState();

  const [step, setStep] = useState(1);
  const totalSteps = 8;

  // Form state
  const [currentFitness, setCurrentFitness] = useState<FitnessLevel>('beginner');
  const [longestRun, setLongestRun] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(4);
  const [goalFinishTime, setGoalFinishTime] = useState<GoalFinishTime>('finish');
  const [hasInjuryHistory, setHasInjuryHistory] = useState<boolean>(false);
  const [injuryNotes, setInjuryNotes] = useState<string>('');

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    const startDateObj = new Date(startDate);
    const weeksAvailable = 24; // Fixed 24-week plan
    const longestRunValue = parseFloat(longestRun) || 0;

    createProfile({
      currentFitness,
      longestRun: longestRunValue,
      startDate: startDateObj,
      weeksAvailable,
      daysPerWeek,
      goalFinishTime,
      hasInjuryHistory,
      injuryNotes: injuryNotes.trim() || undefined,
    });

    router.push('/marathon/plan');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true; // fitness level always has a value
      case 2:
        return longestRun !== '' && !isNaN(parseFloat(longestRun));
      case 3:
        return startDate !== '';
      case 4:
        return true; // days per week always has a value
      case 5:
        return true; // goal always has a value
      case 6:
        return true; // injury history is boolean
      case 7:
        return !hasInjuryHistory || injuryNotes.trim().length > 0;
      case 8:
        return true; // final confirmation
      default:
        return true;
    }
  };

  return (
    <div className={styles.onboardingPage}>
      <div className={styles.onboardingContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className={styles.stepIndicator}>
          Step {step} of {totalSteps}
        </div>

        <div className={styles.stepContent}>
          {step === 1 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>What's your current fitness level?</h2>
              <p className={styles.stepDescription}>
                This helps us set the right starting mileage for your plan.
              </p>

              <div className={styles.optionsGrid}>
                <button
                  className={`${styles.optionCard} ${currentFitness === 'beginner' ? styles.optionCardSelected : ''}`}
                  onClick={() => setCurrentFitness('beginner')}
                >
                  <h3 className={styles.optionTitle}>Beginner</h3>
                  <p className={styles.optionDesc}>
                    New to running or just starting to build a routine.
                  </p>
                </button>

                <button
                  className={`${styles.optionCard} ${currentFitness === 'some_running' ? styles.optionCardSelected : ''}`}
                  onClick={() => setCurrentFitness('some_running')}
                >
                  <h3 className={styles.optionTitle}>Some Running</h3>
                  <p className={styles.optionDesc}>
                    Run 1-2 times per week, comfortable with 3-5 mile runs.
                  </p>
                </button>

                <button
                  className={`${styles.optionCard} ${currentFitness === 'regular_runner' ? styles.optionCardSelected : ''}`}
                  onClick={() => setCurrentFitness('regular_runner')}
                >
                  <h3 className={styles.optionTitle}>Regular Runner</h3>
                  <p className={styles.optionDesc}>
                    Run 3+ times per week, comfortable with 6+ mile runs.
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>What's your longest run in the past 3 months?</h2>
              <p className={styles.stepDescription}>
                Enter 0 if you haven't been running. We'll start you at a comfortable level.
              </p>

              <div className={styles.inputGroup}>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={longestRun}
                  onChange={(e) => setLongestRun(e.target.value)}
                  placeholder="e.g., 5"
                  className={styles.inputLarge}
                />
                <span className={styles.inputUnit}>miles</span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>When do you want to start training?</h2>
              <p className={styles.stepDescription}>
                Pick your start date. You'll follow a 24-week plan building to the full marathon distance.
              </p>

              <div className={styles.inputGroup}>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={styles.inputLarge}
                />
              </div>

              {startDate && (
                <p className={styles.recommendation}>
                  24-week plan starting {new Date(startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>How many days per week can you train?</h2>
              <p className={styles.stepDescription}>
                Be realistic. More isn't always better. Recovery is crucial.
              </p>

              <div className={styles.daysSelector}>
                {[3, 4, 5, 6].map((days) => (
                  <button
                    key={days}
                    className={`${styles.dayOption} ${daysPerWeek === days ? styles.dayOptionSelected : ''}`}
                    onClick={() => setDaysPerWeek(days)}
                  >
                    {days} days
                  </button>
                ))}
              </div>

              <p className={styles.recommendation}>
                {daysPerWeek === 3 && 'Great for beginners or busy schedules.'}
                {daysPerWeek === 4 && 'Recommended for most beginners (includes 1 rest day mid-week).'}
                {daysPerWeek === 5 && 'Good for experienced runners with time to recover.'}
                {daysPerWeek === 6 && 'Advanced schedule. Requires discipline with easy days.'}
              </p>
            </div>
          )}

          {step === 5 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>What's your goal finish time?</h2>
              <p className={styles.stepDescription}>
                Your plan will adjust training intensity based on your goal.
              </p>

              <div className={styles.optionsGrid}>
                <button
                  className={`${styles.optionCard} ${goalFinishTime === 'finish' ? styles.optionCardSelected : ''}`}
                  onClick={() => setGoalFinishTime('finish')}
                >
                  <h3 className={styles.optionTitle}>Just Finish</h3>
                  <p className={styles.optionDesc}>
                    Complete the distance. Enjoy the experience.
                  </p>
                </button>

                <button
                  className={`${styles.optionCard} ${goalFinishTime === 'sub5' ? styles.optionCardSelected : ''}`}
                  onClick={() => setGoalFinishTime('sub5')}
                >
                  <h3 className={styles.optionTitle}>Sub-5 Hours</h3>
                  <p className={styles.optionDesc}>
                    ~11:30/mile pace. Achievable first-time goal.
                  </p>
                </button>

                <button
                  className={`${styles.optionCard} ${goalFinishTime === 'sub4_30' ? styles.optionCardSelected : ''}`}
                  onClick={() => setGoalFinishTime('sub4_30')}
                >
                  <h3 className={styles.optionTitle}>Sub-4:30</h3>
                  <p className={styles.optionDesc}>
                    ~10:20/mile pace. Solid recreational target.
                  </p>
                </button>

                <button
                  className={`${styles.optionCard} ${goalFinishTime === 'sub4' ? styles.optionCardSelected : ''}`}
                  onClick={() => setGoalFinishTime('sub4')}
                >
                  <h3 className={styles.optionTitle}>Sub-4 Hours</h3>
                  <p className={styles.optionDesc}>
                    ~9:10/mile pace. Ambitious and challenging.
                  </p>
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Do you have a history of running injuries?</h2>
              <p className={styles.stepDescription}>
                We'll build in extra recovery if needed. Honesty helps prevent setbacks.
              </p>

              <div className={styles.binaryChoice}>
                <button
                  className={`${styles.choiceButton} ${!hasInjuryHistory ? styles.choiceButtonSelected : ''}`}
                  onClick={() => setHasInjuryHistory(false)}
                >
                  No injuries
                </button>
                <button
                  className={`${styles.choiceButton} ${hasInjuryHistory ? styles.choiceButtonSelected : ''}`}
                  onClick={() => setHasInjuryHistory(true)}
                >
                  Yes, I've had injuries
                </button>
              </div>
            </div>
          )}

          {step === 7 && hasInjuryHistory && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Tell us about your injury history</h2>
              <p className={styles.stepDescription}>
                What injuries have you experienced? This helps us adjust your plan.
              </p>

              <textarea
                value={injuryNotes}
                onChange={(e) => setInjuryNotes(e.target.value)}
                placeholder="e.g., shin splints, IT band issues, plantar fasciitis..."
                className={styles.textareaLarge}
                rows={5}
              />
            </div>
          )}

          {((step === 7 && !hasInjuryHistory) || step === 8) && (
            <div className={styles.step}>
              <h2 className={styles.stepTitle}>Ready to generate your plan!</h2>
              <p className={styles.stepDescription}>
                We'll create a personalized training plan based on your answers.
              </p>

              <div className={styles.summary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Fitness Level:</span>
                  <span className={styles.summaryValue}>
                    {currentFitness === 'beginner' ? 'Beginner' :
                      currentFitness === 'some_running' ? 'Some Running' :
                        'Regular Runner'}
                  </span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Longest Recent Run:</span>
                  <span className={styles.summaryValue}>{longestRun || 0} miles</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Training Days:</span>
                  <span className={styles.summaryValue}>{daysPerWeek} days/week</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Goal:</span>
                  <span className={styles.summaryValue}>
                    {goalFinishTime === 'finish' ? 'Just Finish' :
                      goalFinishTime === 'sub5' ? 'Sub-5 Hours' :
                        goalFinishTime === 'sub4_30' ? 'Sub-4:30' :
                          'Sub-4 Hours'}
                  </span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Injury History:</span>
                  <span className={styles.summaryValue}>
                    {hasInjuryHistory ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Start Date:</span>
                  <span className={styles.summaryValue}>
                    {startDate && new Date(startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Training Duration:</span>
                  <span className={styles.summaryValue}>24 weeks</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.navigationButtons}>
          {step > 1 && (
            <button onClick={handleBack} className={styles.buttonSecondary}>
              Back
            </button>
          )}

          {step < totalSteps && !(step === 7 && !hasInjuryHistory) && (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={styles.buttonPrimary}
            >
              Next
            </button>
          )}

          {(step === totalSteps || (step === 7 && !hasInjuryHistory)) && (
            <button onClick={handleSubmit} className={styles.buttonPrimary}>
              Create My Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
