import { UserContext } from '../types/theme';

const mockUserContexts: UserContext[] = [
  { timeOfDay: 'day', location: 'urban', device: 'desktop' },
  { timeOfDay: 'night', location: 'nature', device: 'mobile' },
  { timeOfDay: 'day', location: 'nature', device: 'desktop' },
  { timeOfDay: 'night', location: 'urban', device: 'mobile' },
  { timeOfDay: 'day', location: 'urban', device: 'vr' },
  { timeOfDay: 'night', location: 'nature', device: 'ar' },
];

let currentIndex = 0;

/**
 * Simulates fetching user context data from an AI service.
 * Cycles through predefined profiles for demonstration.
 * @returns A promise that resolves to a UserContext object.
 */
export const fetchUserContext = async (): Promise<UserContext> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const context = mockUserContexts[currentIndex];
      currentIndex = (currentIndex + 1) % mockUserContexts.length;
      console.log('Mock AI Service: Fetched User Context:', context);
      resolve(context);
    }, 500); // Simulate network delay
  });
};

/**
 * Simulates fetching user context data from an AI service.
 * Returns a random predefined profile for demonstration.
 * @returns A promise that resolves to a UserContext object.
 */
export const fetchRandomUserContext = async (): Promise<UserContext> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockUserContexts.length);
      const context = mockUserContexts[randomIndex];
      console.log('Mock AI Service: Fetched Random User Context:', context);
      resolve(context);
    }, 500); // Simulate network delay
  });
};

// For this task, we'll use the cycling one by default.
// The user can switch to fetchRandomUserContext if they prefer.
export const getMockUserContext = fetchUserContext;
