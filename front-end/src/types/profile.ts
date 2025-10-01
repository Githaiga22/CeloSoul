export interface ProfileDetails {
  // Photos
  photos: string[];
  
  // Basic Info
  bio: string;
  age: number;
  gender: string;
  pronouns: string;
  height: string;
  jobTitle: string;
  company: string;
  city: string;
  
  // Interests & Goals
  interests: string[];
  relationshipGoals: string;
  sexualOrientation: string;
  
  // Personality
  zodiacSign: string;
  education: string;
  languages: string[];
  personalityType: string;
  communicationStyle: string;
  loveStyle: string;
  
  // Lifestyle
  familyPlans: string;
  pets: string;
  drinking: string;
  smoking: string;
  workoutFrequency: string;
  dietaryPreference: string;
  sleepingHabits: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
  };
  
  // Prompts
  askMeAbout: string;
  profilePrompts: {
    keyToMyHeart: string;
    bucketListItem: string;
  };
}

export const INTERESTS_OPTIONS = [
  'Technology', 'DeFi', 'Crypto', 'NFTs', 'Gaming', 'Anime', 'Music', 'Art',
  'Travel', 'Fitness', 'Cooking', 'Photography', 'Reading', 'Movies', 'Dancing',
  'Hiking', 'Yoga', 'Coffee', 'Wine', 'Startups', 'AI/ML', 'Web3', 'Design'
];

export const RELATIONSHIP_GOALS = [
  'Long-term relationship',
  'Casual dating', 
  'Open to discovery',
  'Marriage',
  'Friendship first'
];

export const PRONOUNS_OPTIONS = [
  'he/him', 'she/her', 'they/them', 'he/they', 'she/they', 'custom'
];

export const GENDER_OPTIONS = [
  'Man', 'Woman', 'Non-binary', 'Trans man', 'Trans woman', 'Prefer not to say'
];

export const LIFESTYLE_OPTIONS = {
  pets: ['Love pets', 'No pets', 'Allergic to pets'],
  drinking: ['Never', 'Socially', 'Regularly'],
  smoking: ['Never', 'Occasionally', 'Regularly'],
  workout: ['Daily', 'Weekly', 'Sometimes', 'Never'],
  diet: ['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto'],
  sleep: ['Early bird', 'Night owl', 'Flexible']
};