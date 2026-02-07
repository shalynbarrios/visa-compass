export type VisaStatus = 'F-1' | 'H-1B' | 'L-1' | 'O-1' | 'J-1' | 'B-1/B-2' | 'TN' | 'E-2';

export type UpdateCategory = 'DHS/USCIS' | 'Court' | 'Election' | 'International Policy';

export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown';

export interface UserProfile {
  id: string;
  name: string;
  citizenship: string;
  visaStatus: VisaStatus;
  affiliation: string;
  affiliationType: 'school' | 'employer';
  visaExpiry: string;
  lastI20Extension?: string;
  travelPlans?: TravelPlan[];
  notificationPreferences: NotificationPreferences;
}

export interface TravelPlan {
  destination: string;
  departureDate: string;
  returnDate: string;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  categories: UpdateCategory[];
}

export interface PolicyUpdate {
  id: string;
  title: string;
  summary: string;
  category: UpdateCategory;
  date: string;
  appliesToUser: boolean;
  impact: RiskLevel;
  explanation: string;
  sources: Source[];
}

export interface Source {
  title: string;
  url: string;
  publishedDate: string;
  publisher: string;
}

export interface TravelResponse {
  riskLevel: RiskLevel;
  destination: string;
  keyReasons: string[];
  clarifyingQuestions: string[];
  sources: Source[];
  nextSteps: string[];
}

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Alex Chen',
  citizenship: 'China',
  visaStatus: 'F-1',
  affiliation: 'Stanford University',
  affiliationType: 'school',
  visaExpiry: '2026-08-15',
  lastI20Extension: '2024-12-01',
  notificationPreferences: {
    email: true,
    sms: false,
    push: true,
    categories: ['DHS/USCIS', 'Court', 'International Policy'],
  },
};

export const mockUpdates: PolicyUpdate[] = [
  {
    id: '1',
    title: 'USCIS Updates OPT Extension Processing Times',
    summary: 'Processing times for STEM OPT extensions have been updated. New average is 90-120 days.',
    category: 'DHS/USCIS',
    date: '2025-02-05',
    appliesToUser: true,
    impact: 'medium',
    explanation: 'As an F-1 student, this directly affects your ability to extend Optional Practical Training. Plan to file 90+ days before your current OPT expires.',
    sources: [
      {
        title: 'USCIS Processing Times Update',
        url: 'https://www.uscis.gov/processing-times',
        publishedDate: '2025-02-05',
        publisher: 'USCIS',
      },
    ],
  },
  {
    id: '2',
    title: 'Federal Court Blocks New H-1B Wage Requirements',
    summary: 'A federal judge has issued a preliminary injunction blocking the implementation of increased prevailing wage requirements for H-1B visa holders.',
    category: 'Court',
    date: '2025-02-03',
    appliesToUser: false,
    impact: 'low',
    explanation: 'This ruling primarily affects H-1B visa holders and their employers. As an F-1 student, this may be relevant if you plan to transition to H-1B status.',
    sources: [
      {
        title: 'Court Order - H-1B Wage Rule',
        url: 'https://example.com/court-order',
        publishedDate: '2025-02-03',
        publisher: 'U.S. District Court',
      },
    ],
  },
  {
    id: '3',
    title: 'New Administration Announces Immigration Policy Review',
    summary: 'Comprehensive review of all immigration policies announced, including student and work visas.',
    category: 'Election',
    date: '2025-01-28',
    appliesToUser: true,
    impact: 'unknown',
    explanation: 'Policy reviews can lead to changes in visa processing, requirements, or availability. Monitor closely for updates that may affect F-1 students.',
    sources: [
      {
        title: 'White House Immigration Announcement',
        url: 'https://example.com/whitehouse',
        publishedDate: '2025-01-28',
        publisher: 'White House',
      },
    ],
  },
  {
    id: '4',
    title: 'US-China Relations: New Visa Interview Requirements',
    summary: 'Enhanced screening procedures announced for visa applicants from specific countries.',
    category: 'International Policy',
    date: '2025-01-25',
    appliesToUser: true,
    impact: 'high',
    explanation: 'As a Chinese national, you may face additional screening during visa renewals or re-entry. Carry all supporting documents and allow extra processing time.',
    sources: [
      {
        title: 'State Department Announcement',
        url: 'https://example.com/state-dept',
        publishedDate: '2025-01-25',
        publisher: 'U.S. State Department',
      },
      {
        title: 'Analysis: New Visa Requirements',
        url: 'https://example.com/analysis',
        publishedDate: '2025-01-26',
        publisher: 'Immigration Law Journal',
      },
    ],
  },
];

export const mockTravelResponse: TravelResponse = {
  riskLevel: 'high',
  destination: 'Russia',
  keyReasons: [
    'Current travel advisory level 4 (Do Not Travel) for Russia',
    'Limited U.S. consular services available in Russia',
    'Risk of visa issues upon re-entry to the United States',
    'Potential for extended detention or inability to leave',
  ],
  clarifyingQuestions: [
    'What is the purpose of your travel to Russia?',
    'Do you have dual citizenship or family ties in Russia?',
    'What is your current visa stamp validity?',
    'Do you have a valid travel signature on your I-20?',
  ],
  sources: [
    {
      title: 'Russia Travel Advisory',
      url: 'https://travel.state.gov/russia',
      publishedDate: '2025-02-01',
      publisher: 'U.S. State Department',
    },
    {
      title: 'SEVP Travel Guidance for F-1 Students',
      url: 'https://www.ice.gov/sevp',
      publishedDate: '2025-01-15',
      publisher: 'ICE SEVP',
    },
  ],
  nextSteps: [
    'Consult with your DSO (Designated School Official) before making travel plans',
    'Consider postponing non-essential travel to Russia',
    'If travel is essential, ensure your visa and I-20 are up to date',
    'Register with the Smart Traveler Enrollment Program (STEP)',
    'Have a backup plan if you cannot return to the U.S.',
  ],
};

export const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia',
  'Denmark', 'Egypt', 'Ethiopia', 'Finland', 'France', 'Germany', 'Ghana',
  'Greece', 'Hong Kong', 'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan', 'Kenya', 'South Korea',
  'Kuwait', 'Lebanon', 'Malaysia', 'Mexico', 'Morocco', 'Nepal', 'Netherlands',
  'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Turkey',
  'UAE', 'Ukraine', 'United Kingdom', 'Venezuela', 'Vietnam', 'Yemen', 'Zimbabwe',
];

export const visaStatuses: VisaStatus[] = ['F-1', 'H-1B', 'L-1', 'O-1', 'J-1', 'B-1/B-2', 'TN', 'E-2'];
