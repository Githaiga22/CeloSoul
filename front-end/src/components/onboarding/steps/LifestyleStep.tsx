import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { ProfileDetails, LIFESTYLE_OPTIONS } from '../../../types/profile';

interface LifestyleStepProps {
  data: Partial<ProfileDetails>;
  onChange: (updates: Partial<ProfileDetails>) => void;
}

const FAMILY_PLANS = ['Want kids', 'Maybe someday', 'No kids', 'Have kids'];
const PERSONALITY_TYPES = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
const COMMUNICATION_STYLES = ['Direct', 'Reserved', 'Humorous', 'Thoughtful', 'Spontaneous'];
const LOVE_STYLES = ['Acts of Service', 'Words of Affirmation', 'Quality Time', 'Physical Touch', 'Gifts'];

export function LifestyleStep({ data, onChange }: LifestyleStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">
          Your lifestyle
        </h3>
        <p className="text-secondary-600">
          Share more about how you live and what matters to you
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Family Plans
        </label>
        <div className="flex flex-wrap gap-2">
          {FAMILY_PLANS.map((plan) => (
            <Badge
              key={plan}
              variant={data.familyPlans === plan ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => onChange({ familyPlans: plan })}
            >
              {plan}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Pets
          </label>
          <div className="space-y-2">
            {LIFESTYLE_OPTIONS.pets.map((option) => (
              <Badge
                key={option}
                variant={data.pets === option ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80 block text-center"
                onClick={() => onChange({ pets: option })}
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Drinking
          </label>
          <div className="space-y-2">
            {LIFESTYLE_OPTIONS.drinking.map((option) => (
              <Badge
                key={option}
                variant={data.drinking === option ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80 block text-center"
                onClick={() => onChange({ drinking: option })}
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Smoking
          </label>
          <div className="space-y-2">
            {LIFESTYLE_OPTIONS.smoking.map((option) => (
              <Badge
                key={option}
                variant={data.smoking === option ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80 block text-center"
                onClick={() => onChange({ smoking: option })}
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Workout Frequency
          </label>
          <div className="flex flex-wrap gap-2">
            {LIFESTYLE_OPTIONS.workout.map((option) => (
              <Badge
                key={option}
                variant={data.workoutFrequency === option ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80"
                onClick={() => onChange({ workoutFrequency: option })}
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Diet
          </label>
          <div className="flex flex-wrap gap-2">
            {LIFESTYLE_OPTIONS.diet.map((option) => (
              <Badge
                key={option}
                variant={data.dietaryPreference === option ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80"
                onClick={() => onChange({ dietaryPreference: option })}
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Sleep Schedule
        </label>
        <div className="flex flex-wrap gap-2">
          {LIFESTYLE_OPTIONS.sleep.map((option) => (
            <Badge
              key={option}
              variant={data.sleepingHabits === option ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => onChange({ sleepingHabits: option })}
            >
              {option}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Personality Type (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TYPES.map((type) => (
            <Badge
              key={type}
              variant={data.personalityType === type ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => onChange({ personalityType: type })}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Communication Style
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMUNICATION_STYLES.map((style) => (
              <Badge
                key={style}
                variant={data.communicationStyle === style ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80"
                onClick={() => onChange({ communicationStyle: style })}
              >
                {style}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Love Language
          </label>
          <div className="flex flex-wrap gap-2">
            {LOVE_STYLES.map((style) => (
              <Badge
                key={style}
                variant={data.loveStyle === style ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80"
                onClick={() => onChange({ loveStyle: style })}
              >
                {style}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Instagram (Optional)"
          placeholder="@username"
          value={data.socialMedia?.instagram || ''}
          onChange={(e) => onChange({ 
            socialMedia: { ...data.socialMedia, instagram: e.target.value }
          })}
        />
        
        <Input
          label="Twitter (Optional)"
          placeholder="@username"
          value={data.socialMedia?.twitter || ''}
          onChange={(e) => onChange({ 
            socialMedia: { ...data.socialMedia, twitter: e.target.value }
          })}
        />
      </div>
    </div>
  );
}