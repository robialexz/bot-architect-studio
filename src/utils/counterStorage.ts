import { logger } from '@/lib/logger';

export interface CounterData {
  waiting: number;
  today: number;
  thisWeek: number;
  lastUpdated: number;
  baselineCount: number;
}

class CounterStorage {
  private readonly STORAGE_KEY = 'flowsyai_waitlist_counters';
  private readonly BASELINE_COUNT = 100; // Starting baseline for credibility
  private readonly MAX_REALISTIC_COUNT = 800; // Maximum realistic count for $9.8K market cap

  /**
   * Gets the current counter data from localStorage
   */
  getCounters(): CounterData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as CounterData;

        // Validate data integrity
        if (this.isValidCounterData(data)) {
          return this.ensureRealisticCounts(data);
        }
      }
    } catch (error) {
      logger.warn('Failed to load counter data from localStorage:', error);
    }

    // Return default values if no valid data found
    return this.getDefaultCounters();
  }

  /**
   * Saves counter data to localStorage
   */
  saveCounters(data: CounterData): void {
    try {
      const validatedData = this.ensureRealisticCounts(data);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validatedData));
      logger.info('Counter data saved to localStorage:', validatedData);
    } catch (error) {
      logger.error('Failed to save counter data to localStorage:', error);
    }
  }

  /**
   * Increments the waiting counter and updates related counters
   */
  incrementWaitingCounter(): CounterData {
    const current = this.getCounters();
    const now = Date.now();

    // Check if it's a new day
    const isNewDay = this.isNewDay(current.lastUpdated, now);
    const isNewWeek = this.isNewWeek(current.lastUpdated, now);

    const updated: CounterData = {
      waiting: Math.min(current.waiting + 1, this.MAX_REALISTIC_COUNT),
      today: isNewDay ? 1 : current.today + 1,
      thisWeek: isNewWeek ? 1 : current.thisWeek + 1,
      lastUpdated: now,
      baselineCount: current.baselineCount,
    };

    this.saveCounters(updated);
    return updated;
  }

  /**
   * Resets daily/weekly counters if time periods have passed
   */
  updateTimeBasedCounters(): CounterData {
    const current = this.getCounters();
    const now = Date.now();

    const updated = { ...current };
    let hasChanges = false;

    // Reset daily counter if it's a new day
    if (this.isNewDay(current.lastUpdated, now)) {
      updated.today = 0;
      hasChanges = true;
    }

    // Reset weekly counter if it's a new week
    if (this.isNewWeek(current.lastUpdated, now)) {
      updated.thisWeek = 0;
      hasChanges = true;
    }

    if (hasChanges) {
      updated.lastUpdated = now;
      this.saveCounters(updated);
    }

    return updated;
  }

  /**
   * Gets default counter values
   */
  private getDefaultCounters(): CounterData {
    return {
      waiting: this.BASELINE_COUNT,
      today: 2,
      thisWeek: 8,
      lastUpdated: Date.now(),
      baselineCount: this.BASELINE_COUNT,
    };
  }

  /**
   * Validates counter data structure
   */
  private isValidCounterData(data: unknown): data is CounterData {
    return (
      typeof data === 'object' &&
      typeof data.waiting === 'number' &&
      typeof data.today === 'number' &&
      typeof data.thisWeek === 'number' &&
      typeof data.lastUpdated === 'number' &&
      typeof data.baselineCount === 'number'
    );
  }

  /**
   * Ensures counter values remain realistic for the project's market cap
   */
  private ensureRealisticCounts(data: CounterData): CounterData {
    return {
      ...data,
      waiting: Math.min(Math.max(data.waiting, this.BASELINE_COUNT), this.MAX_REALISTIC_COUNT),
      today: Math.min(data.today, 15), // Max 15 signups per day
      thisWeek: Math.min(data.thisWeek, 50), // Max 50 signups per week
    };
  }

  /**
   * Checks if the given timestamp is from a different day
   */
  private isNewDay(lastUpdated: number, now: number): boolean {
    const lastDate = new Date(lastUpdated);
    const currentDate = new Date(now);

    return (
      lastDate.getDate() !== currentDate.getDate() ||
      lastDate.getMonth() !== currentDate.getMonth() ||
      lastDate.getFullYear() !== currentDate.getFullYear()
    );
  }

  /**
   * Checks if the given timestamp is from a different week
   */
  private isNewWeek(lastUpdated: number, now: number): boolean {
    const lastDate = new Date(lastUpdated);
    const currentDate = new Date(now);

    // Get the start of the week (Monday)
    const getWeekStart = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      return new Date(d.setDate(diff));
    };

    const lastWeekStart = getWeekStart(lastDate);
    const currentWeekStart = getWeekStart(currentDate);

    return lastWeekStart.getTime() !== currentWeekStart.getTime();
  }

  /**
   * Clears all counter data (for testing/reset purposes)
   */
  clearCounters(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      logger.info('Counter data cleared from localStorage');
    } catch (error) {
      logger.error('Failed to clear counter data:', error);
    }
  }
}

export const counterStorage = new CounterStorage();
