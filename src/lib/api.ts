import { 
  mockUserProfile, 
  mockUpdates, 
  mockTravelResponse,
  UserProfile,
  PolicyUpdate,
  TravelResponse,
} from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchUserProfile(): Promise<UserProfile> {
  await delay(500);
  return mockUserProfile;
}

export async function fetchUpdates(): Promise<PolicyUpdate[]> {
  await delay(800);
  return mockUpdates;
}

export async function askTravelBot(question: string): Promise<TravelResponse> {
  await delay(1500);
  // In a real app, this would parse the question and return relevant data
  return mockTravelResponse;
}

export async function saveUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  await delay(500);
  return { ...mockUserProfile, ...profile };
}

export async function saveOnboardingData(data: OnboardingData): Promise<void> {
  await delay(800);
  console.log('Onboarding data saved:', data);
}

export interface OnboardingData {
  citizenship: string;
  visaStatus: string;
  affiliationType: 'school' | 'employer';
  affiliation: string;
  hasTravelPlans: boolean;
  travelDestination?: string;
  travelDepartureDate?: string;
  travelReturnDate?: string;
  notificationEmail: boolean;
  notificationSms: boolean;
  notificationPush: boolean;
}
