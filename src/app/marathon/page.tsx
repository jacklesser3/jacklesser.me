"use client";

import { useState } from 'react';
import styles from './marathon.module.css';

interface Workout {
  id: string;
  day: string;
  description: string;
  completed: boolean;
}

interface Week {
  number: number;
  totalMiles: number;
  longRun: number;
  focus: string;
  workouts: Workout[];
}

export default function MarathonTrainingGuide() {
  // Store completed workouts in localStorage
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('marathon-completed');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });

  const [openPhases, setOpenPhases] = useState<Set<number>>(new Set([1]));

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

  const toggleWorkout = (workoutId: string) => {
    setCompletedWorkouts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(workoutId)) {
        newSet.delete(workoutId);
      } else {
        newSet.add(workoutId);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('marathon-completed', JSON.stringify(Array.from(newSet)));
      }
      return newSet;
    });
  };

  // Define all weeks with their workouts
  const phases = [
    {
      num: 1,
      name: 'Foundation',
      dates: 'Weeks 1–4 · May 11 – Jun 7',
      mileageRange: '15–22 mi/wk',
      color: '#4ade80',
      description: 'Build a running habit and aerobic base. Every run is easy pace. No workouts. The goal is simply to get your legs accustomed to consistent mileage without injury.',
      weeks: [
        { number: 1, totalMiles: 15, longRun: 5, focus: 'All easy. Run/walk OK. Establish schedule.', workouts: [
          { id: 'w1-tue', day: 'Tue', description: '3 mi easy', completed: false },
          { id: 'w1-thu', day: 'Thu', description: '3 mi easy', completed: false },
          { id: 'w1-sun', day: 'Sun', description: '5 mi long run', completed: false },
        ]},
        { number: 2, totalMiles: 17, longRun: 6, focus: 'All easy. Focus on form & breathing.', workouts: [
          { id: 'w2-tue', day: 'Tue', description: '3 mi easy', completed: false },
          { id: 'w2-thu', day: 'Thu', description: '4 mi easy', completed: false },
          { id: 'w2-sun', day: 'Sun', description: '6 mi long run', completed: false },
        ]},
        { number: 3, totalMiles: 20, longRun: 7, focus: 'All easy. Add 4th run day if feeling good.', workouts: [
          { id: 'w3-tue', day: 'Tue', description: '4 mi easy', completed: false },
          { id: 'w3-thu', day: 'Thu', description: '4 mi easy', completed: false },
          { id: 'w3-sat', day: 'Sat', description: '3 mi easy', completed: false },
          { id: 'w3-sun', day: 'Sun', description: '7 mi long run', completed: false },
        ]},
        { number: 4, totalMiles: 15, longRun: 5, focus: 'Recovery week. Absorb the work.', workouts: [
          { id: 'w4-tue', day: 'Tue', description: '3 mi easy', completed: false },
          { id: 'w4-thu', day: 'Thu', description: '3 mi easy', completed: false },
          { id: 'w4-sun', day: 'Sun', description: '5 mi long run', completed: false },
        ]},
      ],
    },
    {
      num: 2,
      name: 'Aerobic Development',
      dates: 'Weeks 5–8 · Jun 8 – Jul 5',
      mileageRange: '22–28 mi/wk',
      color: '#60a5fa',
      description: 'Start pushing long runs further and introduce your first structured workouts. Still 80% easy, but you\'re adding strides and tempo efforts to teach your legs new speeds.',
      weeks: [
        { number: 5, totalMiles: 22, longRun: 8, focus: 'Intro strides after 1 easy run (4–6 × 20 sec).', workouts: [
          { id: 'w5-tue', day: 'Tue', description: '4 mi easy + strides', completed: false },
          { id: 'w5-thu', day: 'Thu', description: '4 mi easy', completed: false },
          { id: 'w5-sat', day: 'Sat', description: '3 mi easy', completed: false },
          { id: 'w5-sun', day: 'Sun', description: '8 mi long run', completed: false },
        ]},
        { number: 6, totalMiles: 24, longRun: 9, focus: 'First tempo: 15 min at tempo pace mid-run.', workouts: [
          { id: 'w6-tue', day: 'Tue', description: '5 mi w/ 15 min tempo', completed: false },
          { id: 'w6-thu', day: 'Thu', description: '4 mi easy', completed: false },
          { id: 'w6-sat', day: 'Sat', description: '3 mi easy', completed: false },
          { id: 'w6-sun', day: 'Sun', description: '9 mi long run', completed: false },
        ]},
        { number: 7, totalMiles: 28, longRun: 10, focus: 'Double-digit long run milestone. Stay easy.', workouts: [
          { id: 'w7-tue', day: 'Tue', description: '5 mi easy + strides', completed: false },
          { id: 'w7-thu', day: 'Thu', description: '5 mi easy', completed: false },
          { id: 'w7-sat', day: 'Sat', description: '4 mi easy', completed: false },
          { id: 'w7-sun', day: 'Sun', description: '10 mi long run', completed: false },
        ]},
        { number: 8, totalMiles: 20, longRun: 6, focus: 'Recovery week. Light strides only.', workouts: [
          { id: 'w8-tue', day: 'Tue', description: '4 mi easy', completed: false },
          { id: 'w8-thu', day: 'Thu', description: '4 mi easy', completed: false },
          { id: 'w8-sun', day: 'Sun', description: '6 mi long run', completed: false },
        ]},
      ],
    },
    {
      num: 3,
      name: 'Endurance Building',
      dates: 'Weeks 9–14 · Jul 6 – Aug 16',
      mileageRange: '28–35 mi/wk',
      color: '#facc15',
      description: 'The heart of your training. Long runs grow to 14–16 miles, and weekly mileage reaches its first plateau. You\'ll feel the cumulative fatigue — this is normal and necessary. Trust the recovery weeks.',
      weeks: [
        { number: 9, totalMiles: 28, longRun: 11, focus: 'Tempo: 20 min at tempo pace.', workouts: [
          { id: 'w9-tue', day: 'Tue', description: '5 mi w/ 20 min tempo', completed: false },
          { id: 'w9-thu', day: 'Thu', description: '4 mi easy', completed: false },
          { id: 'w9-sat', day: 'Sat', description: '4 mi easy', completed: false },
          { id: 'w9-sun', day: 'Sun', description: '11 mi long run', completed: false },
        ]},
        { number: 10, totalMiles: 30, longRun: 12, focus: 'Long run with last 2 mi at MGP.', workouts: [
          { id: 'w10-tue', day: 'Tue', description: '5 mi easy', completed: false },
          { id: 'w10-thu', day: 'Thu', description: '5 mi easy', completed: false },
          { id: 'w10-sat', day: 'Sat', description: '4 mi easy', completed: false },
          { id: 'w10-sun', day: 'Sun', description: '12 mi (last 2 at MGP)', completed: false },
        ]},
        { number: 11, totalMiles: 33, longRun: 14, focus: 'Longest run yet. Practice full fueling plan.', workouts: [
          { id: 'w11-tue', day: 'Tue', description: '6 mi w/ 20 min tempo', completed: false },
          { id: 'w11-thu', day: 'Thu', description: '5 mi easy', completed: false },
          { id: 'w11-sat', day: 'Sat', description: '4 mi easy', completed: false },
          { id: 'w11-sun', day: 'Sun', description: '14 mi long run', completed: false },
        ]},
        { number: 12, totalMiles: 24, longRun: 8, focus: 'Recovery week. Easy runs + stretching.', workouts: [
          { id: 'w12-tue', day: 'Tue', description: '4 mi easy', completed: false },
          { id: 'w12-thu', day: 'Thu', description: '4 mi easy', completed: false },
          { id: 'w12-sun', day: 'Sun', description: '8 mi long run', completed: false },
        ]},
        { number: 13, totalMiles: 33, longRun: 15, focus: 'Introduce MGP miles in the middle of long run.', workouts: [
          { id: 'w13-tue', day: 'Tue', description: '6 mi easy', completed: false },
          { id: 'w13-thu', day: 'Thu', description: '5 mi w/ tempo', completed: false },
          { id: 'w13-sat', day: 'Sat', description: '4 mi easy', completed: false },
          { id: 'w13-sun', day: 'Sun', description: '15 mi (miles 8-12 at MGP)', completed: false },
        ]},
        { number: 14, totalMiles: 35, longRun: 16, focus: 'Biggest week yet. Celebrate this milestone.', workouts: [
          { id: 'w14-tue', day: 'Tue', description: '6 mi easy', completed: false },
          { id: 'w14-thu', day: 'Thu', description: '5 mi easy', completed: false },
          { id: 'w14-sat', day: 'Sat', description: '4 mi easy', completed: false },
          { id: 'w14-sun', day: 'Sun', description: '16 mi long run', completed: false },
        ]},
      ],
    },
    {
      num: 4,
      name: 'Peak Training',
      dates: 'Weeks 15–20 · Aug 17 – Sep 27',
      mileageRange: '35–40 mi/wk',
      color: '#e8652e',
      description: 'This is the hardest block. You\'ll hit your peak mileage and your longest runs (18–20 miles). The work you put in here is what carries you across the finish line in Central Park. Stay disciplined on easy days.',
      weeks: [
        { number: 15, totalMiles: 35, longRun: 16, focus: 'Tempo: 25 min. Practice race-day nutrition.', workouts: [
          { id: 'w15-tue', day: 'Tue', description: '5 mi easy + strides', completed: false },
          { id: 'w15-wed', day: 'Wed', description: '6 mi w/ 25 min tempo', completed: false },
          { id: 'w15-fri', day: 'Fri', description: '4 mi easy', completed: false },
          { id: 'w15-sun', day: 'Sun', description: '16 mi long run', completed: false },
        ]},
        { number: 16, totalMiles: 38, longRun: 18, focus: 'First 18-miler. Run with fueling plan start to finish.', workouts: [
          { id: 'w16-tue', day: 'Tue', description: '5 mi easy + strides', completed: false },
          { id: 'w16-wed', day: 'Wed', description: '7 mi w/ 25 min tempo', completed: false },
          { id: 'w16-fri', day: 'Fri', description: '4 mi easy', completed: false },
          { id: 'w16-sun', day: 'Sun', description: '18 mi long run', completed: false },
        ]},
        { number: 17, totalMiles: 40, longRun: 20, focus: 'Peak long run. Dress in race-day gear. Full rehearsal.', workouts: [
          { id: 'w17-tue', day: 'Tue', description: '5 mi easy + strides', completed: false },
          { id: 'w17-wed', day: 'Wed', description: '7 mi w/ 25 min tempo', completed: false },
          { id: 'w17-thu', day: 'Thu', description: '4 mi recovery', completed: false },
          { id: 'w17-fri', day: 'Fri', description: '4 mi easy', completed: false },
          { id: 'w17-sat', day: 'Sat', description: '20 mi PEAK LONG RUN', completed: false },
        ]},
        { number: 18, totalMiles: 28, longRun: 10, focus: 'Recovery week. You earned this. Absorb the work.', workouts: [
          { id: 'w18-tue', day: 'Tue', description: '5 mi easy', completed: false },
          { id: 'w18-thu', day: 'Thu', description: '5 mi easy', completed: false },
          { id: 'w18-sun', day: 'Sun', description: '10 mi long run', completed: false },
        ]},
        { number: 19, totalMiles: 36, longRun: 18, focus: 'Last big long run. MGP for final 3–4 mi.', workouts: [
          { id: 'w19-tue', day: 'Tue', description: '5 mi easy', completed: false },
          { id: 'w19-wed', day: 'Wed', description: '6 mi w/ tempo', completed: false },
          { id: 'w19-fri', day: 'Fri', description: '4 mi easy', completed: false },
          { id: 'w19-sun', day: 'Sun', description: '18 mi (last 4 at MGP)', completed: false },
        ]},
        { number: 20, totalMiles: 32, longRun: 14, focus: 'Starting to come down. Confidence builder.', workouts: [
          { id: 'w20-tue', day: 'Tue', description: '5 mi easy', completed: false },
          { id: 'w20-thu', day: 'Thu', description: '5 mi easy', completed: false },
          { id: 'w20-sat', day: 'Sat', description: '4 mi easy', completed: false },
          { id: 'w20-sun', day: 'Sun', description: '14 mi long run', completed: false },
        ]},
      ],
    },
    {
      num: 5,
      name: 'Taper',
      dates: 'Weeks 21–23 · Sep 28 – Oct 18',
      mileageRange: '25–18 mi/wk',
      color: '#c084fc',
      description: 'The hardest phase mentally. You\'re reducing mileage significantly while your body absorbs all the training. You will feel antsy, sluggish, and doubt everything. This is completely normal and has a name — taper madness. Trust the process.',
      weeks: [
        { number: 21, totalMiles: 25, longRun: 12, focus: 'Reduce volume 30%. Keep 1 tempo session.', workouts: [
          { id: 'w21-tue', day: 'Tue', description: '5 mi w/ 20 min tempo', completed: false },
          { id: 'w21-thu', day: 'Thu', description: '4 mi easy', completed: false },
          { id: 'w21-sun', day: 'Sun', description: '12 mi long run', completed: false },
        ]},
        { number: 22, totalMiles: 20, longRun: 10, focus: 'Last long run w/ 3 mi at MGP. Feel the legs.', workouts: [
          { id: 'w22-tue', day: 'Tue', description: '4 mi easy', completed: false },
          { id: 'w22-thu', day: 'Thu', description: '3 mi easy', completed: false },
          { id: 'w22-sun', day: 'Sun', description: '10 mi (last 3 at MGP)', completed: false },
        ]},
        { number: 23, totalMiles: 18, longRun: 8, focus: 'Easy running. Short strides to keep legs sharp.', workouts: [
          { id: 'w23-tue', day: 'Tue', description: '3 mi easy + strides', completed: false },
          { id: 'w23-thu', day: 'Thu', description: '3 mi easy', completed: false },
          { id: 'w23-sun', day: 'Sun', description: '8 mi easy', completed: false },
        ]},
      ],
    },
    {
      num: 6,
      name: 'Race Week & Race Day',
      dates: 'Week 24 · Oct 26 – Nov 1',
      mileageRange: 'Race Day',
      color: '#f87171',
      description: 'You\'ve done the work. This week is about logistics, rest, and mental preparation. Run 2–3 easy shakeout runs of 2–3 miles each. Nothing more.',
      weeks: [
        { number: 24, totalMiles: 8, longRun: 26.2, focus: 'RACE WEEK. Shakeout runs only.', workouts: [
          { id: 'w24-mon', day: 'Mon', description: '2 mi easy shakeout + strides', completed: false },
          { id: 'w24-wed', day: 'Wed', description: '2 mi easy shakeout', completed: false },
          { id: 'w24-fri', day: 'Fri', description: '2 mi easy. Lay out race gear.', completed: false },
          { id: 'w24-sun', day: 'Sun', description: '🏅 RACE DAY — 26.2 miles!', completed: false },
        ]},
      ],
    },
  ];

  const weeklyMiles = [15,17,20,15, 22,24,28,20, 28,30,33,24,33,35, 35,38,40,28,36,32, 25,20,18, 8];

  return (
    <div className={styles.container}>
      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>First-Timer Training Blueprint</div>
        <h1 className={styles.heroTitle}>
          NYC Marathon <em>Sub-5:00</em>
        </h1>
        <p className={styles.heroSub}>
          A 24-week phased training plan for first-time marathoners. Goal #1: Finish. Goal #2: Break 5 hours. Race day — November 1, 2026.
        </p>
        <div className={styles.heroMeta}>
          <div className={styles.heroMetaItem}>
            <div className={styles.value}>24</div>
            <div className={styles.label}>Weeks</div>
          </div>
          <div className={styles.heroMetaItem}>
            <div className={styles.value}>4:55</div>
            <div className={styles.label}>Target Finish</div>
          </div>
          <div className={styles.heroMetaItem}>
            <div className={styles.value}>11:16</div>
            <div className={styles.label}>Avg Pace / Mi</div>
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
        <p>This guide is structured in 6 phases across 24 weeks starting in mid-May 2026. Each phase has a specific purpose — from building your aerobic foundation to sharpening for race day. The plan peaks at 40 miles per week and uses a 3-week build / 1-week recovery cycle to keep you healthy.</p>
        <p>Your target pace is roughly <strong>11:15/mi</strong> which gives you a 4:55 finish with buffer. Most training runs should be <strong>slower</strong> than race pace — around 11:30–12:30/mi. The hard truth of marathon training: you get fast by running easy.</p>

        <div className={styles.highlightRow}>
          <div className={styles.highlightStat}>
            <div className={styles.num}>3–4</div>
            <div className={styles.desc}>Run Days / Week</div>
          </div>
          <div className={styles.highlightStat}>
            <div className={styles.num}>2</div>
            <div className={styles.desc}>Strength Days</div>
          </div>
          <div className={styles.highlightStat}>
            <div className={styles.num}>1–2</div>
            <div className={styles.desc}>Full Rest Days</div>
          </div>
          <div className={styles.highlightStat}>
            <div className={styles.num}>20 mi</div>
            <div className={styles.desc}>Peak Long Run</div>
          </div>
        </div>

        <div className={`${styles.tipBox} ${styles.mindset}`}>
          <h4>Mindset</h4>
          <p>Every mile you train is a deposit. There will be weeks where life gets in the way — miss one run, not three. Consistency over perfection. You're training for a single day in November, and the work starts now.</p>
        </div>
      </div>

      {/* PACE REFERENCE */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>01</span>
          <h2>Pace Reference Guide</h2>
        </div>
        <p>These are the key paces you'll use throughout this plan. Memorize your easy pace — you'll spend 80% of your time there. If you can hold a conversation, you're in the right zone.</p>

        <div className={styles.paceCard}>
          <h4>Training Paces</h4>
          <div className={styles.paceRow}>
            <span className={styles.paceLabel}>Easy / Recovery Pace</span>
            <span className={styles.paceValue}>12:00 – 13:00 /mi</span>
          </div>
          <div className={styles.paceRow}>
            <span className={styles.paceLabel}>Long Run Pace</span>
            <span className={styles.paceValue}>11:30 – 12:30 /mi</span>
          </div>
          <div className={styles.paceRow}>
            <span className={styles.paceLabel}>Marathon Goal Pace (MGP)</span>
            <span className={styles.paceValue}>11:00 – 11:20 /mi</span>
          </div>
          <div className={styles.paceRow}>
            <span className={styles.paceLabel}>Tempo / Comfortably Hard</span>
            <span className={styles.paceValue}>10:15 – 10:45 /mi</span>
          </div>
          <div className={styles.paceRow}>
            <span className={styles.paceLabel}>Strides / Short Pickups</span>
            <span className={styles.paceValue}>9:00 – 9:30 /mi (20–30 sec bursts)</span>
          </div>
        </div>

        <div className={`${styles.tipBox} ${styles.warning}`}>
          <h4>The #1 First-Timer Mistake</h4>
          <p>Running too fast on easy days. If your easy runs feel "too slow," you're doing it right. Easy pace builds your aerobic engine without trashing your body. Save intensity for the designated workout days. A heart rate monitor can be a great tool to keep yourself honest.</p>
        </div>
      </div>

      {/* TRAINING PHASES */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>02</span>
          <h2>The Training Phases</h2>
        </div>

        {phases.map(phase => {
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
                  {phase.mileageRange}
                </span>
              </div>

              {isOpen && (
                <div className={styles.phaseBody}>
                  <p>{phase.description}</p>

                  <table className={styles.weekTable}>
                    <thead>
                      <tr>
                        <th>Week</th>
                        <th>Total Miles</th>
                        <th>Long Run</th>
                        <th>Focus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phase.weeks.map(week => (
                        <tr key={week.number}>
                          <td className={styles.weekNum}>Wk {week.number}</td>
                          <td className={styles.miles}>{week.totalMiles}</td>
                          <td className={styles.longRun}>{week.longRun} mi</td>
                          <td>{week.focus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Workout checklist for first week of phase */}
                  <p style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}><strong>Sample Week (Week {phase.weeks[0].number}):</strong></p>
                  <div className={styles.workoutChecklist}>
                    {phase.weeks[0].workouts.map(workout => (
                      <label key={workout.id} className={styles.workoutItem}>
                        <input
                          type="checkbox"
                          checked={completedWorkouts.has(workout.id)}
                          onChange={() => toggleWorkout(workout.id)}
                        />
                        <span className={completedWorkouts.has(workout.id) ? styles.completed : ''}>
                          {workout.day}: {workout.description}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Phase-specific tips */}
                  {phase.num === 1 && (
                    <>
                      <div className={`${styles.tipBox} ${styles.strength}`}>
                        <h4>Strength Work — Phase 1</h4>
                        <ul>
                          <li>Bodyweight squats — 3 × 15</li>
                          <li>Glute bridges — 3 × 15</li>
                          <li>Calf raises — 3 × 20</li>
                          <li>Planks — 3 × 30 sec</li>
                          <li>Side-lying leg lifts — 3 × 12 each</li>
                          <li>Single-leg deadlift (no weight) — 3 × 10 each</li>
                        </ul>
                        <p style={{ marginTop: '0.5rem' }}>Keep it simple. 20–25 minutes, 2x/week. These exercises strengthen your hips, glutes, and ankles as mileage builds.</p>
                      </div>
                      <div className={`${styles.tipBox} ${styles.recovery}`}>
                        <h4>Recovery — Phase 1</h4>
                        <ul>
                          <li>Foam roll quads, IT band, and calves after every run (5–10 min)</li>
                          <li>Stretch hip flexors daily — they tighten from sitting at a desk</li>
                          <li>Sleep 7–8 hours minimum. This is where adaptation happens.</li>
                          <li>Hydrate consistently — aim for half your bodyweight in ounces daily</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {phase.num === 2 && (
                    <>
                      <div className={`${styles.tipBox} ${styles.nutrition}`}>
                        <h4>Fueling — Start Practicing Now</h4>
                        <ul>
                          <li>Begin testing gels/chews on long runs over 8 miles</li>
                          <li>Take one gel every 45–50 min during long runs — practice this like a skill</li>
                          <li>Find 2–3 fueling products that don't upset your stomach and stick with them</li>
                          <li>Never try new fuel on race day — your gut needs to be trained just like your legs</li>
                        </ul>
                      </div>
                      <div className={`${styles.tipBox} ${styles.strength}`}>
                        <h4>Strength Work — Phase 2 (Level Up)</h4>
                        <ul>
                          <li>Goblet squats — 3 × 12 (add light weight)</li>
                          <li>Romanian deadlifts — 3 × 10</li>
                          <li>Step-ups — 3 × 10 each leg</li>
                          <li>Plank variations (side, up-down) — 3 × 30 sec each</li>
                          <li>Banded clamshells — 3 × 15 each</li>
                          <li>Single-leg calf raises — 3 × 12 each</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {phase.num === 3 && (
                    <>
                      <div className={`${styles.tipBox} ${styles.warning}`}>
                        <h4>Heat Training — Nashville Summers</h4>
                        <ul>
                          <li>Run early morning (before 7 AM) or after sunset — Nashville summer heat is no joke</li>
                          <li>Carry a handheld bottle or plan routes with water fountains</li>
                          <li>Accept that heat slows you down 30–90 sec/mi. Don't chase pace in July.</li>
                          <li>Electrolyte tabs (Nuun, LMNT, etc.) in your water on runs over 60 min</li>
                          <li>The good news: heat adaptation makes you stronger for a cool November race</li>
                        </ul>
                      </div>
                      <div className={`${styles.tipBox} ${styles.recovery}`}>
                        <h4>Recovery — Mid-Training Check</h4>
                        <ul>
                          <li>Get new shoes if your current pair has 300+ miles — don't wait until race month</li>
                          <li>Consider rotating two pairs to vary the ground feel and reduce injury risk</li>
                          <li>Yoga or light mobility on rest days — even 15 min helps</li>
                          <li>Ice baths or cold water on legs after long runs if you have access</li>
                          <li>If anything hurts for 3+ days, take an extra rest day. Don't run through sharp pain.</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {phase.num === 4 && (
                    <>
                      <div className={`${styles.tipBox} ${styles.mindset}`}>
                        <h4>Mindset — The 20-Miler</h4>
                        <p>Your 20-mile run is the cornerstone of this plan. It will be hard. The last 3–4 miles will test you mentally. That's the point — you're training your brain as much as your body. When it gets tough, slow down but don't stop. Walk breaks are totally valid. Remember: if you can do 20, you can do 26.2 on race day with adrenaline, crowd support, and taper freshness on your side.</p>
                      </div>
                      <div className={`${styles.tipBox} ${styles.strength}`}>
                        <h4>Strength Work — Maintenance Mode</h4>
                        <ul>
                          <li>Reduce to 1–2 sessions/week, lighter weight, fewer sets</li>
                          <li>Focus on: single-leg squats, hip stability, core planks, calf work</li>
                          <li>Stop all heavy leg work 10 days before the race</li>
                          <li>Prioritize mobility and form over strength gains now</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {phase.num === 5 && (
                    <>
                      <div className={`${styles.tipBox} ${styles.recovery}`}>
                        <h4>Taper Recovery Protocol</h4>
                        <ul>
                          <li>Sleep is your #1 performance enhancer — 8+ hours nightly</li>
                          <li>Foam roll and stretch daily but gently — not the time for deep tissue</li>
                          <li>Keep your normal eating patterns. Don't drastically change anything.</li>
                          <li>Reduce caffeine slightly if you plan to use it on race day (for a bigger boost)</li>
                          <li>No new exercises, no pickup basketball, no random hikes with heavy packs</li>
                        </ul>
                      </div>
                      <div className={`${styles.tipBox} ${styles.nutrition}`}>
                        <h4>Race Week Nutrition</h4>
                        <ul>
                          <li>Carb-load the last 2–3 days. Add extra rice, pasta, bread, sweet potatoes to meals.</li>
                          <li>Carb-loading is not "eat everything" — increase carb ratio, don't double portions</li>
                          <li>Stay hydrated but don't over-hydrate — clear-ish urine is the target</li>
                          <li>Thursday/Friday dinner: familiar, carb-heavy, low-fiber. Not the time for new restaurants.</li>
                          <li>Race morning: eat 2–3 hours before gun time. Toast, banana, peanut butter, coffee — whatever you've practiced.</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {phase.num === 6 && (
                    <>
                      <div className={`${styles.tipBox} ${styles.mindset}`}>
                        <h4>Race Day Execution Strategy</h4>
                        <ul>
                          <li><strong>Miles 1–8 (Staten Island → Brooklyn):</strong> Start SLOW. The bridge, the crowds, the adrenaline will tempt you to go fast. Hold back. Target 11:30/mi. You'll feel like you're jogging. Perfect.</li>
                          <li><strong>Miles 9–16 (Brooklyn → Queens → Bronx):</strong> Settle in. Find your rhythm. Take gels every 45 min. Hit every water station. Enjoy the crowds — Brooklyn is electric.</li>
                          <li><strong>Miles 17–20 (Bronx → Manhattan):</strong> This is where the race starts. Stick to your pace. Walk through water stations if needed. Don't panic if you slow down.</li>
                          <li><strong>Miles 20–26.2 (Manhattan → Central Park):</strong> The wall. It's real. But you trained through your 20-miler. Shorten your stride, keep moving. When you see Central Park, you'll find another gear. The finish line is yours.</li>
                        </ul>
                      </div>
                      <div className={`${styles.tipBox} ${styles.warning}`}>
                        <h4>Race Day Checklist</h4>
                        <ul>
                          <li>Bib pinned to front of shirt (4 pins, one at each corner)</li>
                          <li>Timing chip on shoes (if separate from bib)</li>
                          <li>Body Glide on thighs, underarms, nipples — chafing is real at 26.2</li>
                          <li>Gels/chews in belt or taped to shorts (don't rely on course fuel alone)</li>
                          <li>Throwaway layers for the start — it's cold on the Verrazzano at 9 AM in November</li>
                          <li>Phone charged if you want photos at the finish</li>
                          <li>Write your name on your shirt — the crowd will cheer for you by name</li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MILEAGE CHART */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionNumber}>03</span>
          <h2>24-Week Mileage Overview</h2>
        </div>
        <p>Here's the full mileage trajectory. Notice the sawtooth pattern — 2–3 weeks of building followed by a recovery pullback. This is how you stay healthy across 24 weeks.</p>

        <div className={styles.mileageChart}>
          {weeklyMiles.map((miles, i) => {
            const isRecovery = [3,7,11,17].includes(i);
            const isRace = i === 23;
            const isPeak = i === 16;

            let color = '#e8652e';
            if (isRecovery) color = '#4ade80';
            if (isRace) color = '#f87171';
            if (isPeak) color = '#facc15';

            return (
              <div key={i} className={styles.mileageBar} style={{ height: `${(miles / 40) * 100}%`, background: color }}>
                <div className={styles.mileageLabel}>{miles}</div>
                <div className={styles.weekLabel}>{i === 23 ? 'R' : i + 1}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className={styles.footer}>
        <div className={styles.motto}>The miracle isn't that you finished — it's that you had the courage to start.</div>
        <p>NYC Marathon Training Guide · Sub-5:00 · November 1, 2026</p>
      </div>
    </div>
  );
}
