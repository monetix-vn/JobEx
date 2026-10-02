import { DAYS_PER_WEEK, WEEKS_PER_YEAR } from '@je/contracts';
import type { ClockPort, ClockSnapshot } from '@je/contracts';

/** Virtual world clock: one turn is one week. Wall-clock time never enters the simulation. */
export function snapshotForTurn(turn: number): ClockSnapshot {
  const week = turn % WEEKS_PER_YEAR;
  const month = 1 + Math.floor((week * 12) / WEEKS_PER_YEAR);
  return {
    turn,
    year: Math.floor(turn / WEEKS_PER_YEAR),
    week_of_year: week,
    month_of_year: month,
    quarter: 1 + Math.floor((month - 1) / 3),
  };
}

export class WorldClock implements ClockPort {
  private turn = 0;

  now(): ClockSnapshot {
    return snapshotForTurn(this.turn);
  }

  advance(): void {
    this.turn += 1;
  }
}

/** Day of the game year (0 to 363) for the start of the given week, plus an offset of days inside the week. */
export function dayOfYear(clock: ClockSnapshot, dayInWeek = 0): number {
  return clock.week_of_year * DAYS_PER_WEEK + dayInWeek;
}

/** Days from one turn's start to another's. Used for ages, tenures and anniversaries. */
export function daysBetween(fromTurn: number, toTurn: number): number {
  return (toTurn - fromTurn) * DAYS_PER_WEEK;
}
