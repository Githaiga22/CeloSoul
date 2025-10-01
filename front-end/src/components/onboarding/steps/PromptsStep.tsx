import { Textarea, Input } from '../../ui/Input';
import { ProfileDetails } from '../../../types/profile';

interface PromptsStepProps {
  data: Partial<ProfileDetails>;
  onChange: (updates: Partial<ProfileDetails>) => void;
}

export function PromptsStep({ data, onChange }: PromptsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">
          Final touches
        </h3>
        <p className="text-secondary-600">
          Add some personality with prompts and conversation starters
        </p>
      </div>

      <Input
        label="Ask me about..."
        placeholder="e.g. my weekend adventures, my favorite coffee spots, travel stories"
        value={data.askMeAbout || ''}
        onChange={(e) => onChange({ askMeAbout: e.target.value })}
      />

      <Textarea
        label="The key to my heart is..."
        placeholder="Share what really matters to you in a relationship"
        value={data.profilePrompts?.keyToMyHeart || ''}
        onChange={(e) => onChange({ 
          profilePrompts: { 
            keyToMyHeart: e.target.value,
            bucketListItem: data.profilePrompts?.bucketListItem || ''
          }
        })}
        rows={3}
      />

      <Textarea
        label="First item on my bucket list is..."
        placeholder="What's something you're excited to experience or achieve?"
        value={data.profilePrompts?.bucketListItem || ''}
        onChange={(e) => onChange({ 
          profilePrompts: { 
            keyToMyHeart: data.profilePrompts?.keyToMyHeart || '',
            bucketListItem: e.target.value
          }
        })}
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Education"
          placeholder="e.g. Bachelor's in Computer Science"
          value={data.education || ''}
          onChange={(e) => onChange({ education: e.target.value })}
        />
        
        <Input
          label="Zodiac Sign (Optional)"
          placeholder="e.g. Gemini"
          value={data.zodiacSign || ''}
          onChange={(e) => onChange({ zodiacSign: e.target.value })}
        />
      </div>

      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-6">
        <h4 className="font-semibold text-secondary-900 mb-3">Profile Preview</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Photos:</span>
            <span className="text-secondary-600">{data.photos?.length || 0} uploaded</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Bio:</span>
            <span className="text-secondary-600">
              {data.bio ? `${data.bio.slice(0, 50)}...` : 'Not added'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Interests:</span>
            <span className="text-secondary-600">{data.interests?.length || 0} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Looking for:</span>
            <span className="text-secondary-600">{data.relationshipGoals || 'Not specified'}</span>
          </div>
        </div>
      </div>

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <h4 className="font-medium text-primary-800 mb-2">🎉 Almost done!</h4>
        <p className="text-sm text-primary-700">
          Your profile is looking great! Once you complete this step, our AI will start finding your perfect matches based on your preferences and personality.
        </p>
      </div>
    </div>
  );
}