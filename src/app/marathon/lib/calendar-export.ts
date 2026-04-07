// iCalendar (ICS) file generation for training plan

import type { TrainingPlan, Workout } from './types';
import { formatICalDate } from './utils';
import { WORKOUT_TEMPLATES } from './workout-library';

/**
 * Generate RFC 5545 compliant iCalendar format
 */
export function generateTrainingCalendar(plan: TrainingPlan): string {
  let ics = 'BEGIN:VCALENDAR\r\n';
  ics += 'VERSION:2.0\r\n';
  ics += 'PRODID:-//jacklesser.me//Marathon Training//EN\r\n';
  ics += 'CALSCALE:GREGORIAN\r\n';
  ics += 'METHOD:PUBLISH\r\n';
  ics += 'X-WR-CALNAME:NYC Marathon 2026 Training\r\n';
  ics += 'X-WR-TIMEZONE:America/New_York\r\n';
  ics += 'X-WR-CALDESC:Personalized marathon training plan for NYC Marathon 2026\r\n';

  // Add workouts as events
  plan.weeks.forEach(week => {
    week.workouts.forEach(workout => {
      if (workout.type !== 'rest') {
        ics += generateWorkoutEvent(workout);
      }
    });
  });

  // Add race day event
  ics += generateRaceEvent(plan.raceDate);

  ics += 'END:VCALENDAR\r\n';
  return ics;
}

/**
 * Generate individual workout event
 */
function generateWorkoutEvent(workout: Workout): string {
  const template = WORKOUT_TEMPLATES[workout.type];
  const startDate = new Date(workout.date);
  startDate.setHours(7, 0, 0, 0); // Default to 7 AM

  let event = 'BEGIN:VEVENT\r\n';
  event += `UID:${workout.id}@jacklesser.me\r\n`;
  event += `DTSTAMP:${formatICalDate(new Date())}\r\n`;
  event += `DTSTART:${formatICalDate(startDate)}\r\n`;
  event += `DURATION:PT${workout.duration || 60}M\r\n`;

  // Summary (title)
  const distanceStr = workout.distance ? `${workout.distance} mi` : '';
  event += `SUMMARY:${template.name}${distanceStr ? ' - ' + distanceStr : ''}\r\n`;

  // Description
  let description = workout.description;
  description += `\\n\\nPace: ${workout.paceGuidance}`;
  description += `\\n\\nWeek ${workout.weekNumber}`;
  description = escapeICalText(description);
  event += `DESCRIPTION:${description}\r\n`;

  // Category/color
  event += `CATEGORIES:Marathon Training\r\n`;

  // Reminder: 12 hours before (evening before for morning workout)
  event += 'BEGIN:VALARM\r\n';
  event += 'TRIGGER:-PT12H\r\n';
  event += 'ACTION:DISPLAY\r\n';
  event += `DESCRIPTION:Reminder: ${template.name} tomorrow morning!\r\n`;
  event += 'END:VALARM\r\n';

  // Optional: Reminder 30 minutes before
  event += 'BEGIN:VALARM\r\n';
  event += 'TRIGGER:-PT30M\r\n';
  event += 'ACTION:DISPLAY\r\n';
  event += `DESCRIPTION:${template.name} starts in 30 minutes\r\n`;
  event += 'END:VALARM\r\n';

  event += 'END:VEVENT\r\n';
  return event;
}

/**
 * Generate race day event
 */
function generateRaceEvent(raceDate: Date): string {
  const startTime = new Date(raceDate);
  startTime.setHours(9, 0, 0, 0); // NYC Marathon typically starts at 9 AM

  let event = 'BEGIN:VEVENT\r\n';
  event += `UID:nyc-marathon-2026@jacklesser.me\r\n`;
  event += `DTSTAMP:${formatICalDate(new Date())}\r\n`;
  event += `DTSTART:${formatICalDate(startTime)}\r\n`;
  event += `DURATION:PT6H\r\n`; // Allow 6 hours for completion
  event += `SUMMARY:🏃 NYC MARATHON 2026 - RACE DAY!\r\n`;

  const description = escapeICalText(
    'New York City Marathon 2026!\\n\\n' +
    'You trained for this. Trust your preparation.\\n\\n' +
    'Start slow. Break it into chunks. Enjoy the experience!\\n\\n' +
    'Good luck! 🎉'
  );
  event += `DESCRIPTION:${description}\r\n`;
  event += `LOCATION:New York City\r\n`;
  event += `CATEGORIES:Marathon Training,Race Day\r\n`;

  // Race day reminders
  event += 'BEGIN:VALARM\r\n';
  event += 'TRIGGER:-P1D\r\n'; // 1 day before
  event += 'ACTION:DISPLAY\r\n';
  event += `DESCRIPTION:Race tomorrow! Hydrate, prep gear, get to bed early.\r\n`;
  event += 'END:VALARM\r\n';

  event += 'BEGIN:VALARM\r\n';
  event += 'TRIGGER:-PT12H\r\n'; // 12 hours before (evening before)
  event += 'ACTION:DISPLAY\r\n';
  event += `DESCRIPTION:Race morning tomorrow! Lay out clothes, pin bib, set alarms.\r\n`;
  event += 'END:VALARM\r\n';

  event += 'END:VEVENT\r\n';
  return event;
}

/**
 * Escape special characters for iCalendar text
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')   // Backslash
    .replace(/;/g, '\\;')     // Semicolon
    .replace(/,/g, '\\,')     // Comma
    .replace(/\n/g, '\\n');   // Newline
}

/**
 * Trigger download in browser
 */
export function downloadCalendar(plan: TrainingPlan): void {
  const icsContent = generateTrainingCalendar(plan);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nyc-marathon-2026-training.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get calendar download stats
 */
export function getCalendarStats(plan: TrainingPlan): {
  totalEvents: number;
  workoutEvents: number;
  totalWeeks: number;
} {
  const workoutEvents = plan.weeks.reduce((sum, week) => {
    return sum + week.workouts.filter(w => w.type !== 'rest').length;
  }, 0);

  return {
    totalEvents: workoutEvents + 1, // +1 for race day
    workoutEvents,
    totalWeeks: plan.totalWeeks,
  };
}
