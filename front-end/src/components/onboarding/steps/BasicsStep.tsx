import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { ProfileDetails, INTERESTS_OPTIONS, RELATIONSHIP_GOALS, PRONOUNS_OPTIONS, GENDER_OPTIONS } from '../../../types/profile';

interface BasicsStepProps {
  data: Partial<ProfileDetails>;
  onChange: (updates: Partial<ProfileDetails>) => void;
}

export function BasicsStep({ data, onChange }: BasicsStepProps) {
  const toggleInterest = (interest: string) => {
    const current = data.interests || [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    onChange({ interests: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">
          Tell us about yourself
        </h3>
        <p className="text-secondary-600">
          Help us understand who you are and what you're looking for
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Age"
          type="number"
          value={data.age || ''}
          onChange={(e) => onChange({ age: parseInt(e.target.value) || 0 })}
          min="18"
          max="100"
        />
        
        <Input
          label="Height"
          placeholder="e.g. 5'8 or 173cm"
          value={data.height || ''}
          onChange={(e) => onChange({ height: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Gender
        </label>
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((gender) => (
            <Badge
              key={gender}
              variant={data.gender === gender ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => onChange({ gender })}
            >
              {gender}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Pronouns
        </label>
        <div className="flex flex-wrap gap-2">
          {PRONOUNS_OPTIONS.map((pronoun) => (
            <Badge
              key={pronoun}
              variant={data.pronouns === pronoun ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => onChange({ pronouns: pronoun })}
            >
              {pronoun}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Job Title"
          placeholder="e.g. Software Engineer"
          value={data.jobTitle || ''}
          onChange={(e) => onChange({ jobTitle: e.target.value })}
        />
        
        <Input
          label="Company"
          placeholder="e.g. Tech Startup"
          value={data.company || ''}
          onChange={(e) => onChange({ company: e.target.value })}
        />
      </div>

      <Input
        label="City"
        placeholder="e.g. San Francisco, CA"
        value={data.city || ''}
        onChange={(e) => onChange({ city: e.target.value })}
      />

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Interests ({data.interests?.length || 0} selected)
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS_OPTIONS.map((interest) => (
            <Badge
              key={interest}
              variant={data.interests?.includes(interest) ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => toggleInterest(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-3">
          Looking for
        </label>
        <div className="flex flex-wrap gap-2">
          {RELATIONSHIP_GOALS.map((goal) => (
            <Badge
              key={goal}
              variant={data.relationshipGoals === goal ? 'primary' : 'secondary'}
              className="cursor-pointer hover:opacity-80"
              onClick={() => onChange({ relationshipGoals: goal })}
            >
              {goal}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}