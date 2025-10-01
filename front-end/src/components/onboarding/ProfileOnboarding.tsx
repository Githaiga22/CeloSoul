import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from './StepIndicator';
import { PhotosStep } from './steps/PhotosStep';
import { BasicsStep } from './steps/BasicsStep';
import { LifestyleStep } from './steps/LifestyleStep';
import { PromptsStep } from './steps/PromptsStep';
import { Button } from '../ui/Button';
import { ProfileDetails } from '../../types/profile';
import { useAuth } from '../../contexts/AuthContext';
import { saveProfile, createMockAgentResponse, AgentResponse } from '../../lib/localCache';

const STEPS = [
  'Photos & Bio',
  'About You', 
  'Lifestyle',
  'Final Touches'
];

export function ProfileOnboarding() {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [profileData, setProfileData] = useState<Partial<ProfileDetails>>({
    photos: [],
    bio: '',
    age: 25,
    gender: '',
    pronouns: '',
    height: '',
    jobTitle: '',
    company: '',
    city: '',
    interests: [],
    relationshipGoals: '',
    sexualOrientation: '',
    zodiacSign: '',
    education: '',
    languages: ['English'],
    personalityType: '',
    communicationStyle: '',
    loveStyle: '',
    familyPlans: '',
    pets: '',
    drinking: '',
    smoking: '',
    workoutFrequency: '',
    dietaryPreference: '',
    sleepingHabits: '',
    socialMedia: {},
    askMeAbout: '',
    profilePrompts: {
      keyToMyHeart: '',
      bucketListItem: ''
    }
  });

  const updateProfileData = (updates: Partial<ProfileDetails>) => {
    setProfileData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (profileData.photos?.length || 0) >= 2 && !!profileData.bio;
      case 2:
        return !!(profileData.gender && profileData.interests?.length && profileData.relationshipGoals);
      case 3:
        return !!(profileData.familyPlans && profileData.pets && profileData.drinking);
      case 4:
        return !!(profileData.askMeAbout && profileData.profilePrompts?.keyToMyHeart);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    const addressKey = user?.wallet_address || 'dev';
    let agentResponse: AgentResponse;
    let usedFallback = false;

    try {
      // Check if mock mode is enabled
      const forceMock = import.meta.env.VITE_MOCK_AGENT === 'true';
      
      if (!forceMock) {
        // Try real API first
        const response = await fetch('/api/agent/initProfile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            walletAddress: user?.wallet_address,
            profileData
          })
        });
        
        if (response.ok) {
          agentResponse = await response.json();
          // Cache profile even on successful API call
          saveProfile(addressKey, profileData as ProfileDetails);
        } else {
          throw new Error(`API returned ${response.status}`);
        }
      } else {
        throw new Error('Mock mode enabled');
      }
    } catch (error) {
      console.log('Using localStorage fallback:', error);
      // Fallback to localStorage
      saveProfile(addressKey, profileData as ProfileDetails);
      agentResponse = createMockAgentResponse(`local_${Date.now()}`);
      usedFallback = true;
    }

    // Show success message
    if (usedFallback) {
      alert('Profile saved (mock)');
    }

    // Log response for debugging
    console.log('Agent response:', agentResponse);

    completeProfile();
    navigate('/app/discover');
    setIsSubmitting(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PhotosStep data={profileData} onChange={updateProfileData} />;
      case 2:
        return <BasicsStep data={profileData} onChange={updateProfileData} />;
      case 3:
        return <LifestyleStep data={profileData} onChange={updateProfileData} />;
      case 4:
        return <PromptsStep data={profileData} onChange={updateProfileData} />;
      default:
        return null;
    }
  };

  const isStepValid = validateStep(currentStep);
  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-4">
      <div className="max-w-2xl mx-auto">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={STEPS.length}
          stepTitles={STEPS}
        />

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {renderStep()}
        </div>

        <div className="flex gap-4">
          {currentStep > 1 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBack}
              className="flex-1"
            >
              Back
            </Button>
          )}
          
          <Button
            variant="primary"
            size="lg"
            onClick={isLastStep ? handleSubmit : handleNext}
            disabled={!isStepValid || isSubmitting}
            isLoading={isSubmitting}
            className="flex-1"
          >
            {isLastStep ? 'Complete Profile' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}