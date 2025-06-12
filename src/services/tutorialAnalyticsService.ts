export interface TutorialEvent {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  type:
    | 'exercise_start'
    | 'exercise_complete'
    | 'hint_used'
    | 'validation_failed'
    | 'validation_passed'
    | 'tutorial_exit'
    | 'achievement_unlocked';
  exerciseId?: string;
  data: Record<string, unknown>;
  duration?: number; // milliseconds
  score?: number; // 0-100
}

export interface LearningSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  exercisesAttempted: string[];
  exercisesCompleted: string[];
  totalScore: number;
  averageScore: number;
  hintsUsed: number;
  validationAttempts: number;
  timeSpent: number; // minutes
  strugglingAreas: string[];
  achievements: string[];
}

export interface LearningInsight {
  type: 'strength' | 'weakness' | 'improvement' | 'recommendation';
  category: string;
  title: string;
  description: string;
  confidence: number; // 0-100
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  data: Record<string, unknown>;
}

export interface TutorialMetrics {
  totalUsers: number;
  activeUsers: number;
  completionRate: number;
  averageSessionTime: number;
  mostPopularExercises: string[];
  commonStrugglingAreas: string[];
  retentionRate: number;
  satisfactionScore: number;
  improvementSuggestions: string[];
}

export class TutorialAnalyticsService {
  private static instance: TutorialAnalyticsService;
  private events: TutorialEvent[] = [];
  private sessions: LearningSession[] = [];

  public static getInstance(): TutorialAnalyticsService {
    if (!TutorialAnalyticsService.instance) {
      TutorialAnalyticsService.instance = new TutorialAnalyticsService();
    }
    return TutorialAnalyticsService.instance;
  }

  // Event tracking
  trackEvent(event: Omit<TutorialEvent, 'id' | 'timestamp'>): void {
    const newEvent: TutorialEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date(),
    };

    this.events.push(newEvent);
    this.processEventInRealTime(newEvent);

    // Store in localStorage for persistence
    this.persistEvents();
  }

  // Session management
  startSession(userId: string): string {
    const sessionId = this.generateId();
    const session: LearningSession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      exercisesAttempted: [],
      exercisesCompleted: [],
      totalScore: 0,
      averageScore: 0,
      hintsUsed: 0,
      validationAttempts: 0,
      timeSpent: 0,
      strugglingAreas: [],
      achievements: [],
    };

    this.sessions.push(session);
    return sessionId;
  }

  endSession(sessionId: string): LearningSession | null {
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return null;

    session.endTime = new Date();
    session.timeSpent = (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60);

    // Calculate final metrics
    this.calculateSessionMetrics(session);

    // Generate insights
    this.generateSessionInsights(session);

    return session;
  }

  // Analytics and insights
  generateLearningInsights(userId: string): LearningInsight[] {
    const userEvents = this.events.filter(e => e.userId === userId);
    const userSessions = this.sessions.filter(s => s.userId === userId);

    const insights: LearningInsight[] = [];

    // Analyze completion patterns
    const completionInsight = this.analyzeCompletionPatterns(userEvents);
    if (completionInsight) insights.push(completionInsight);

    // Analyze learning velocity
    const velocityInsight = this.analyzeLearningVelocity(userSessions);
    if (velocityInsight) insights.push(velocityInsight);

    // Analyze struggling areas
    const strugglingInsight = this.analyzeStrugglingAreas(userEvents);
    if (strugglingInsight) insights.push(strugglingInsight);

    // Analyze strengths
    const strengthsInsight = this.analyzeStrengths(userEvents);
    if (strengthsInsight) insights.push(strengthsInsight);

    // Generate recommendations
    const recommendations = this.generateRecommendations(userEvents, userSessions);
    insights.push(...recommendations);

    return insights.sort((a, b) => b.confidence - a.confidence);
  }

  // Metrics calculation
  calculateOverallMetrics(): TutorialMetrics {
    const uniqueUsers = new Set(this.events.map(e => e.userId)).size;
    const activeUsers = this.getActiveUsersCount();
    const completionRate = this.calculateCompletionRate();
    const averageSessionTime = this.calculateAverageSessionTime();

    return {
      totalUsers: uniqueUsers,
      activeUsers,
      completionRate,
      averageSessionTime,
      mostPopularExercises: this.getMostPopularExercises(),
      commonStrugglingAreas: this.getCommonStrugglingAreas(),
      retentionRate: this.calculateRetentionRate(),
      satisfactionScore: this.calculateSatisfactionScore(),
      improvementSuggestions: this.generateImprovementSuggestions(),
    };
  }

  // Real-time processing
  private processEventInRealTime(event: TutorialEvent): void {
    // Update current session
    const currentSession = this.sessions.find(s => s.userId === event.userId && !s.endTime);

    if (currentSession) {
      this.updateSessionWithEvent(currentSession, event);
    }

    // Trigger real-time insights
    if (event.type === 'validation_failed') {
      this.handleValidationFailure(event);
    }

    if (event.type === 'exercise_complete') {
      this.handleExerciseCompletion(event);
    }
  }

  private updateSessionWithEvent(session: LearningSession, event: TutorialEvent): void {
    switch (event.type) {
      case 'exercise_start':
        if (event.exerciseId && !session.exercisesAttempted.includes(event.exerciseId)) {
          session.exercisesAttempted.push(event.exerciseId);
        }
        break;

      case 'exercise_complete':
        if (event.exerciseId && !session.exercisesCompleted.includes(event.exerciseId)) {
          session.exercisesCompleted.push(event.exerciseId);
          if (event.score) {
            session.totalScore += event.score;
            session.averageScore = session.totalScore / session.exercisesCompleted.length;
          }
        }
        break;

      case 'hint_used':
        session.hintsUsed++;
        break;

      case 'validation_failed':
        session.validationAttempts++;
        if (event.data?.strugglingArea) {
          session.strugglingAreas.push(event.data.strugglingArea);
        }
        break;

      case 'achievement_unlocked':
        if (event.data?.achievementId) {
          session.achievements.push(event.data.achievementId);
        }
        break;
    }
  }

  // Analysis methods
  private analyzeCompletionPatterns(events: TutorialEvent[]): LearningInsight | null {
    const completionEvents = events.filter(e => e.type === 'exercise_complete');
    const startEvents = events.filter(e => e.type === 'exercise_start');

    if (startEvents.length === 0) return null;

    const completionRate = (completionEvents.length / startEvents.length) * 100;

    if (completionRate > 80) {
      return {
        type: 'strength',
        category: 'completion',
        title: 'Excellent Completion Rate',
        description: `You complete ${completionRate.toFixed(1)}% of exercises you start. This shows great persistence!`,
        confidence: 95,
        actionable: false,
        priority: 'low',
        data: { completionRate },
      };
    } else if (completionRate < 50) {
      return {
        type: 'weakness',
        category: 'completion',
        title: 'Low Completion Rate',
        description: `You complete only ${completionRate.toFixed(1)}% of exercises. Consider breaking down complex tasks into smaller steps.`,
        confidence: 90,
        actionable: true,
        priority: 'high',
        data: { completionRate },
      };
    }

    return null;
  }

  private analyzeLearningVelocity(sessions: LearningSession[]): LearningInsight | null {
    if (sessions.length === 0) return null;

    const totalTime = sessions.reduce((sum, s) => sum + s.timeSpent, 0);
    const totalExercises = sessions.reduce((sum, s) => sum + s.exercisesCompleted.length, 0);

    if (totalTime === 0 || totalExercises === 0) return null;

    const velocity = totalExercises / (totalTime / 60); // exercises per hour

    if (velocity > 2) {
      return {
        type: 'strength',
        category: 'velocity',
        title: 'Fast Learner',
        description: `You complete ${velocity.toFixed(1)} exercises per hour. You're learning efficiently!`,
        confidence: 85,
        actionable: false,
        priority: 'low',
        data: { velocity },
      };
    } else if (velocity < 0.5) {
      return {
        type: 'recommendation',
        category: 'velocity',
        title: 'Consider Shorter Sessions',
        description:
          'Your learning pace suggests shorter, more focused sessions might be more effective.',
        confidence: 75,
        actionable: true,
        priority: 'medium',
        data: { velocity },
      };
    }

    return null;
  }

  private analyzeStrugglingAreas(events: TutorialEvent[]): LearningInsight | null {
    const failureEvents = events.filter(e => e.type === 'validation_failed');

    if (failureEvents.length === 0) return null;

    const strugglingAreas = failureEvents.reduce(
      (acc, event) => {
        const area = event.data?.category || 'unknown';
        acc[area] = (acc[area] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostProblematicArea = Object.entries(strugglingAreas).sort(([, a], [, b]) => b - a)[0];

    if (mostProblematicArea && mostProblematicArea[1] > 2) {
      return {
        type: 'weakness',
        category: 'struggling_areas',
        title: `Difficulty with ${mostProblematicArea[0]}`,
        description: `You've had ${mostProblematicArea[1]} validation failures in ${mostProblematicArea[0]}. Consider reviewing the fundamentals.`,
        confidence: 80,
        actionable: true,
        priority: 'high',
        data: { area: mostProblematicArea[0], failures: mostProblematicArea[1] },
      };
    }

    return null;
  }

  private analyzeStrengths(events: TutorialEvent[]): LearningInsight | null {
    const completionEvents = events.filter(
      e => e.type === 'exercise_complete' && e.score && e.score > 90
    );

    if (completionEvents.length < 3) return null;

    const categories = completionEvents.reduce(
      (acc, event) => {
        const category = event.data?.category || 'unknown';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const strongestArea = Object.entries(categories).sort(([, a], [, b]) => b - a)[0];

    if (strongestArea && strongestArea[1] >= 3) {
      return {
        type: 'strength',
        category: 'mastery',
        title: `Strong in ${strongestArea[0]}`,
        description: `You excel at ${strongestArea[0]} with ${strongestArea[1]} high-scoring completions. Consider advanced challenges!`,
        confidence: 90,
        actionable: true,
        priority: 'medium',
        data: { area: strongestArea[0], successes: strongestArea[1] },
      };
    }

    return null;
  }

  private generateRecommendations(
    events: TutorialEvent[],
    sessions: LearningSession[]
  ): LearningInsight[] {
    const recommendations: LearningInsight[] = [];

    // Recommend spaced repetition if retention seems low
    const hintUsage = events.filter(e => e.type === 'hint_used').length;
    const totalExercises = events.filter(e => e.type === 'exercise_complete').length;

    if (totalExercises > 0 && hintUsage / totalExercises > 0.5) {
      recommendations.push({
        type: 'recommendation',
        category: 'retention',
        title: 'Try Spaced Repetition',
        description:
          'High hint usage suggests reviewing concepts at spaced intervals could improve retention.',
        confidence: 70,
        actionable: true,
        priority: 'medium',
        data: { hintRatio: hintUsage / totalExercises },
      });
    }

    return recommendations;
  }

  // Helper methods
  private calculateSessionMetrics(session: LearningSession): void {
    // Calculate average score
    if (session.exercisesCompleted.length > 0) {
      session.averageScore = session.totalScore / session.exercisesCompleted.length;
    }

    // Identify struggling areas from validation failures
    const sessionEvents = this.events.filter(
      e =>
        e.userId === session.userId &&
        e.timestamp >= session.startTime &&
        (!session.endTime || e.timestamp <= session.endTime)
    );

    const failureEvents = sessionEvents.filter(e => e.type === 'validation_failed');
    session.strugglingAreas = [
      ...new Set(failureEvents.map(e => e.data?.category).filter(Boolean)),
    ];
  }

  private generateSessionInsights(session: LearningSession): void {
    // Generate insights specific to this session
    console.log('Generated insights for session:', session.id);
  }

  private handleValidationFailure(event: TutorialEvent): void {
    // Real-time handling of validation failures
    console.log('Validation failure detected:', event);
  }

  private handleExerciseCompletion(event: TutorialEvent): void {
    // Real-time handling of exercise completions
    console.log('Exercise completed:', event);
  }

  // Utility methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private persistEvents(): void {
    try {
      localStorage.setItem('tutorial-events', JSON.stringify(this.events.slice(-1000))); // Keep last 1000 events
    } catch (error) {
      console.warn('Failed to persist tutorial events:', error);
    }
  }

  private loadPersistedEvents(): void {
    try {
      const stored = localStorage.getItem('tutorial-events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load persisted tutorial events:', error);
    }
  }

  // Metrics calculation helpers
  private getActiveUsersCount(): number {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => e.timestamp >= oneWeekAgo);
    return new Set(recentEvents.map(e => e.userId)).size;
  }

  private calculateCompletionRate(): number {
    const startEvents = this.events.filter(e => e.type === 'exercise_start');
    const completeEvents = this.events.filter(e => e.type === 'exercise_complete');

    if (startEvents.length === 0) return 0;
    return (completeEvents.length / startEvents.length) * 100;
  }

  private calculateAverageSessionTime(): number {
    const completedSessions = this.sessions.filter(s => s.endTime);
    if (completedSessions.length === 0) return 0;

    const totalTime = completedSessions.reduce((sum, s) => sum + s.timeSpent, 0);
    return totalTime / completedSessions.length;
  }

  private getMostPopularExercises(): string[] {
    const exerciseCounts = this.events
      .filter(e => e.type === 'exercise_start' && e.exerciseId)
      .reduce(
        (acc, e) => {
          acc[e.exerciseId!] = (acc[e.exerciseId!] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    return Object.entries(exerciseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([exercise]) => exercise);
  }

  private getCommonStrugglingAreas(): string[] {
    const areaCounts = this.events
      .filter(e => e.type === 'validation_failed' && e.data?.category)
      .reduce(
        (acc, e) => {
          acc[e.data.category] = (acc[e.data.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

    return Object.entries(areaCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([area]) => area);
  }

  private calculateRetentionRate(): number {
    // Simplified retention calculation
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const usersLastWeek = new Set(
      this.events.filter(e => e.timestamp >= oneWeekAgo).map(e => e.userId)
    );

    const usersTwoWeeksAgo = new Set(
      this.events
        .filter(e => e.timestamp >= twoWeeksAgo && e.timestamp < oneWeekAgo)
        .map(e => e.userId)
    );

    if (usersTwoWeeksAgo.size === 0) return 0;

    const retainedUsers = [...usersLastWeek].filter(userId => usersTwoWeeksAgo.has(userId));
    return (retainedUsers.length / usersTwoWeeksAgo.size) * 100;
  }

  private calculateSatisfactionScore(): number {
    // Mock satisfaction score based on completion rates and scores
    const avgScore = this.events
      .filter(e => e.type === 'exercise_complete' && e.score)
      .reduce((sum, e, _, arr) => sum + e.score! / arr.length, 0);

    return Math.min(avgScore, 100);
  }

  private generateImprovementSuggestions(): string[] {
    const suggestions: string[] = [];

    const metrics = this.calculateOverallMetrics();

    if (metrics.completionRate < 70) {
      suggestions.push('Add more hints and guidance for struggling users');
    }

    if (metrics.averageSessionTime > 45) {
      suggestions.push('Consider breaking down exercises into smaller chunks');
    }

    if (metrics.retentionRate < 60) {
      suggestions.push('Implement spaced repetition and follow-up reminders');
    }

    return suggestions;
  }

  // Initialize service
  constructor() {
    this.loadPersistedEvents();
  }
}
