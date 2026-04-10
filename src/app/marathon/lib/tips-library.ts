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
  {
    id: 'race-day-taper-madness',
    category: 'race_day',
    title: 'Taper Madness is Real',
    content: 'You\'ll feel weird during taper. Sluggish one day, antsy the next. You might even feel phantom aches. This is completely normal! Your body is absorbing months of training. Trust it.',
    relevantPhases: ['Taper'],
  },
  {
    id: 'race-day-excitement',
    category: 'race_day',
    title: 'Embrace the Nerves',
    content: 'Pre-race jitters mean you care. Channel that energy into excitement. You\'ve put in the work. Race day is your victory lap. Smile at the start line—you earned this moment.',
    relevantPhases: ['Taper'],
  },

  // Mental Toughness & Mindset
  {
    id: 'mental-bad-runs',
    category: 'pacing',
    title: 'Bad Runs Happen to Everyone',
    content: 'Some days your legs feel like concrete. It happens. A bad workout doesn\'t erase weeks of training. Learn from it, shake it off, and show up for the next one. Consistency > perfection.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'mental-comparison',
    category: 'pacing',
    title: 'Don\'t Compare Your Chapter 1 to Someone\'s Chapter 20',
    content: 'Everyone at the marathon worked to get there. Your pace is YOUR pace. There\'s no prize for finishing first in training. The only person you\'re racing is yesterday\'s version of yourself.',
    relevantPhases: ['Base Building', 'Build'],
  },
  {
    id: 'mental-why',
    category: 'race_day',
    title: 'Remember Your Why',
    content: 'When training gets tough (and it will), remember why you started. Write it down. Put it somewhere you\'ll see it. At mile 20, when your legs are screaming, your "why" will carry you home.',
    relevantPhases: ['Peak', 'Taper'],
  },
  {
    id: 'mental-wall',
    category: 'race_day',
    title: 'The Wall is a Liar',
    content: 'Around mile 20, your brain will try to convince you to stop. It\'s lying. You\'re not actually dying. Your body has way more in reserve than your brain thinks. This is where training pays off.',
    relevantPhases: ['Peak', 'Taper'],
  },

  // Weather & Conditions
  {
    id: 'weather-heat',
    category: 'pacing',
    title: 'Heat Slows Everyone Down',
    content: 'Running in summer heat? Slow down 30-60 seconds per mile. Run early morning or late evening. Hydrate more. Don\'t chase pace in the heat—chase effort. Heat training makes you stronger.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'weather-rain',
    category: 'pacing',
    title: 'Embrace Running in the Rain',
    content: 'You can\'t control race day weather. Practice running in the rain during training. Wear a hat to keep water out of your eyes. Body Glide prevents chafing. You\'ll feel like a badass.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'weather-winter',
    category: 'injury_prevention',
    title: 'Cold Weather Running',
    content: 'Layer up! You should feel slightly cool at the start—you\'ll warm up fast. Cover your ears and hands. Do a longer warm-up in cold weather. And yes, your nose will run. Embrace the snot rocket.',
    relevantPhases: ['Base Building', 'Build'],
  },

  // Form & Technique
  {
    id: 'form-basics',
    category: 'injury_prevention',
    title: 'Running Form Fundamentals',
    content: 'Don\'t overthink it, but: keep your shoulders relaxed, arms at 90 degrees, and land with your foot under your body. Run tall. Small tweaks make big differences over 26.2 miles.',
    relevantPhases: ['Base Building'],
  },
  {
    id: 'form-breathing',
    category: 'zone2',
    title: 'Breathing Patterns',
    content: 'Breathe from your belly, not your chest. Try rhythmic breathing: 3 steps inhale, 2 steps exhale. This feels weird at first but becomes natural. Proper breathing = more oxygen = better running.',
    relevantPhases: ['Base Building', 'Build'],
  },
  {
    id: 'form-cadence',
    category: 'injury_prevention',
    title: 'Optimal Running Cadence',
    content: 'Most efficient runners take 170-180 steps per minute. Shorter, quicker strides reduce impact and injury risk. Count your steps for 30 seconds and multiply by 2. Adjust from there.',
    relevantPhases: ['Build'],
  },

  // Sleep & Recovery
  {
    id: 'sleep-adaptation',
    category: 'recovery',
    title: 'Sleep is Your Secret Weapon',
    content: 'Adaptation happens when you sleep, not when you run. Aim for 7-9 hours, especially during peak training. Can\'t get enough? Even a 20-minute nap helps. Your marathon is won in bed.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'recovery-inflammation',
    category: 'recovery',
    title: 'Natural Anti-Inflammatories',
    content: 'Tart cherry juice, turmeric, ginger, and omega-3s reduce inflammation naturally. Eat berries, fatty fish, and leafy greens. Food is medicine. Your body will thank you.',
    relevantPhases: ['Peak'],
  },
  {
    id: 'recovery-massage',
    category: 'recovery',
    title: 'Self-Massage Techniques',
    content: 'Foam rolling, massage guns, or even a tennis ball on your feet all help. Spend 10 minutes post-run working out knots. It\'s not fun, but it prevents bigger problems later.',
    relevantPhases: ['Build', 'Peak'],
  },

  // Fun & Motivation
  {
    id: 'fun-playlist',
    category: 'pacing',
    title: 'Music & Podcasts',
    content: 'Running alone for hours? Make a killer playlist. Or queue up podcasts for long runs. But practice running without music sometimes—race day crowds are loud and you might not want earbuds.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'fun-running-community',
    category: 'zone2',
    title: 'Find Your Running Crew',
    content: 'Solo training is fine, but running with others makes hard workouts easier. Join a local running club or find a training partner. Shared suffering creates unbreakable bonds.',
    relevantPhases: ['Base Building', 'Build'],
  },
  {
    id: 'fun-celebrate-milestones',
    category: 'recovery',
    title: 'Celebrate the Small Wins',
    content: 'First double-digit run? New distance PR? Completed a recovery week? Celebrate it! Training is hard. Acknowledging progress keeps you motivated. You\'re doing something most people never will.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'fun-post-race',
    category: 'race_day',
    title: 'You\'ll Earn That Medal',
    content: 'After 26.2 miles, you get a medal, a Mylar blanket, and probably free beer. You\'ll waddle like a penguin for 3 days. Stairs will be your nemesis. It\'s all worth it. You\'re a marathoner.',
    relevantPhases: ['Taper'],
  },

  // Common Mistakes
  {
    id: 'mistake-too-fast',
    category: 'pacing',
    title: 'The #1 Beginner Mistake',
    content: 'Running easy days too hard. Your ego wants to go fast. Your training demands you go slow. Easy runs build your engine. Hard runs just wear you down. Learn the difference.',
    relevantPhases: ['Base Building'],
  },
  {
    id: 'mistake-skipping-rest',
    category: 'recovery',
    title: 'Rest Days Aren\'t Optional',
    content: 'You can\'t outrun bad recovery. Skipping rest days doesn\'t make you tougher—it makes you injured. The work happens during rest. Trust the plan.',
    relevantPhases: ['Build', 'Peak'],
  },
  {
    id: 'mistake-new-gear',
    category: 'race_day',
    title: 'Nothing New on Race Day',
    content: 'New shoes? New shorts? New gel flavor? Don\'t do it. Race day is not the time to experiment. Everything should be tested in training. Even your socks. Especially your socks.',
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
