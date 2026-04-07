// Educational content for marathon training

import type { TrainingTip } from './types';

export const TRAINING_TIPS: TrainingTip[] = [
  // Zone 2 Training
  {
    id: 'zone2-basics',
    category: 'zone2',
    title: 'What is Zone 2 Training?',
    content: 'Zone 2 is conversational pace where you can speak in full sentences. This pace builds your aerobic base and fat-burning capacity. Target 60-70% of max heart rate. Most of your training should be in this zone.',
    relevantPhases: ['Base Building'],
  },
  {
    id: 'zone2-benefits',
    category: 'zone2',
    title: 'Why Zone 2 Matters for Marathon',
    content: 'Zone 2 training increases mitochondrial density and capillary development, making you more efficient at using fat for fuel. This is crucial for marathons where you\'ll run for hours.',
    relevantPhases: ['Base Building', 'Build'],
  },
  {
    id: 'zone2-patience',
    category: 'zone2',
    title: 'The Patience of Zone 2',
    content: 'It might feel too easy at first. That\'s the point! Trust the process. Most beginners run too fast on easy days, which prevents full recovery and increases injury risk.',
    relevantPhases: ['Base Building'],
  },

  // Recovery
  {
    id: 'recovery-importance',
    category: 'recovery',
    title: 'Why Rest Days Matter',
    content: 'Adaptation happens during rest, not during workouts. Your body rebuilds stronger during recovery. Never skip rest days, especially as mileage increases. Rest is not being lazy—it\'s training smart.',
    relevantPhases: ['Base Building', 'Build', 'Peak'],
  },
  {
    id: 'recovery-signs',
    category: 'recovery',
    title: 'Signs You Need Extra Rest',
    content: 'Elevated resting heart rate, persistent fatigue, irritability, decreased performance, or trouble sleeping all signal you need more recovery. It\'s better to take an extra rest day than to push through and risk injury.',
  },
  {
    id: 'recovery-active',
    category: 'recovery',
    title: 'Active Recovery Options',
    content: 'On rest days, you can do gentle yoga, easy swimming, or casual cycling. Keep it light and fun. The goal is movement without stress. Or just rest completely—that works too!',
  },

  // Long Runs
  {
    id: 'long-run-purpose',
    category: 'long_runs',
    title: 'The Purpose of Long Runs',
    content: 'Long runs teach your body to use fat for fuel, build mental toughness, and strengthen connective tissues. Run them at conversational pace—slower than you think you should.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'long-run-fueling',
    category: 'long_runs',
    title: 'Fueling Long Runs',
    content: 'For runs over 90 minutes, consume 30-60g carbs per hour. Try gels, chews, or sports drinks. Practice race-day nutrition during long runs to avoid surprises. Your gut needs training too!',
    relevantPhases: ['Peak'],
    relevantWeeks: [12, 16, 20],
  },
  {
    id: 'long-run-recovery',
    category: 'long_runs',
    title: 'Recovering from Long Runs',
    content: 'Eat protein and carbs within 30 minutes of finishing. Stay hydrated. The next day should be rest or very easy running. You might feel stiff—that\'s normal. Gentle movement helps.',
    relevantPhases: ['Build', 'Peak'],
  },

  // Injury Prevention
  {
    id: 'injury-warning-signs',
    category: 'injury_prevention',
    title: 'Warning Signs to Watch',
    content: 'Sharp pain, pain that worsens during a run, or pain that doesn\'t improve with rest requires attention. When in doubt, take an extra rest day. It\'s better to miss one workout than miss weeks from injury.',
  },
  {
    id: 'injury-prevention-strength',
    category: 'injury_prevention',
    title: 'Strength Training for Runners',
    content: 'Add 2x weekly strength work focusing on glutes, core, and single-leg stability. Exercises like planks, single-leg deadlifts, and calf raises prevent common running injuries.',
  },
  {
    id: 'injury-prevention-shoes',
    category: 'injury_prevention',
    title: 'Running Shoe Guidelines',
    content: 'Replace shoes every 300-500 miles. Track your mileage! Worn shoes lose cushioning and support, increasing injury risk. Get fitted at a running store if you\'re new to this.',
  },

  // Nutrition
  {
    id: 'nutrition-daily',
    category: 'nutrition',
    title: 'Daily Nutrition for Training',
    content: 'Focus on whole foods: complex carbs (oats, rice, sweet potatoes), lean proteins, healthy fats, and lots of vegetables. You\'re building an engine—give it quality fuel.',
  },
  {
    id: 'nutrition-hydration',
    category: 'nutrition',
    title: 'Hydration Strategy',
    content: 'Drink water throughout the day, not just during runs. A good rule: your urine should be pale yellow. For runs over 60 minutes, consider a sports drink with electrolytes.',
  },
  {
    id: 'nutrition-race-day',
    category: 'nutrition',
    title: 'Race Day Nutrition',
    content: 'Eat a familiar breakfast 3-4 hours before. Nothing new on race day! Aim for 300-500 calories of easily digestible carbs. Test your race morning meal during long runs.',
    relevantPhases: ['Peak', 'Taper'],
  },

  // Pacing
  {
    id: 'pacing-easy-days',
    category: 'pacing',
    title: 'Running Easy Enough',
    content: 'Easy runs should feel easy. If you can\'t hold a conversation, you\'re going too hard. Slow down! Building your base at the right intensity prevents burnout and injury.',
    relevantPhases: ['Base Building'],
  },
  {
    id: 'pacing-tempo',
    category: 'pacing',
    title: 'Tempo Run Pacing',
    content: 'Tempo pace is "comfortably hard"—you can say a few words but not hold a conversation. It should feel challenging but sustainable. Think of it as the pace you could hold for an hour.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'pacing-race',
    category: 'pacing',
    title: 'Marathon Pacing Strategy',
    content: 'Start slower than goal pace. The first 10K should feel easy. If you\'re feeling great at mile 20, you paced it right. Going out too fast is the #1 mistake beginners make.',
    relevantPhases: ['Taper'],
  },

  // Race Day
  {
    id: 'race-day-prep',
    category: 'race_day',
    title: 'Race Week Preparation',
    content: 'Taper means rest! Trust your training. Reduce mileage but maintain some intensity. Focus on sleep, hydration, and staying healthy. No heroics this week.',
    relevantPhases: ['Taper'],
  },
  {
    id: 'race-day-logistics',
    category: 'race_day',
    title: 'Race Morning Logistics',
    content: 'Arrive early. Porta-potty lines are long! Pin your bib the night before. Wear clothes you\'ve trained in. Bring throwaway layers for the start. Plan your transportation home.',
    relevantPhases: ['Taper'],
    relevantWeeks: [26, 27, 28],
  },
  {
    id: 'race-day-mental',
    category: 'race_day',
    title: 'Mental Strategy for Race Day',
    content: 'Break the race into chunks: get to mile 10, then halfway, then mile 20. When it gets hard (and it will), focus on the next mile marker. You\'ve trained for this.',
    relevantPhases: ['Taper'],
  },
];

/**
 * Get relevant tips for current week and phase
 */
export function getRelevantTips(weekNumber: number, phase: string, count: number = 2): TrainingTip[] {
  const relevant = TRAINING_TIPS.filter(tip => {
    // Check if tip is relevant to current phase
    const phaseMatch = !tip.relevantPhases || tip.relevantPhases.includes(phase as any);

    // Check if tip is relevant to current week
    const weekMatch = !tip.relevantWeeks || tip.relevantWeeks.includes(weekNumber);

    return phaseMatch && weekMatch;
  });

  // Shuffle and return requested count
  const shuffled = relevant.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get tips by category
 */
export function getTipsByCategory(category: TrainingTip['category'], count?: number): TrainingTip[] {
  const tips = TRAINING_TIPS.filter(tip => tip.category === category);
  return count ? tips.slice(0, count) : tips;
}

/**
 * Get random tip
 */
export function getRandomTip(): TrainingTip {
  return TRAINING_TIPS[Math.floor(Math.random() * TRAINING_TIPS.length)];
}
