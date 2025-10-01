import { PhotoUploader } from '../PhotoUploader';
import { Textarea } from '../../ui/Input';
import { ProfileDetails } from '../../../types/profile';

interface PhotosStepProps {
  data: Partial<ProfileDetails>;
  onChange: (updates: Partial<ProfileDetails>) => void;
}

export function PhotosStep({ data, onChange }: PhotosStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">
          Show your best self
        </h3>
        <p className="text-secondary-600">
          Add photos and write a bio that represents who you are
        </p>
      </div>

      <PhotoUploader
        photos={data.photos || []}
        onChange={(photos) => onChange({ photos })}
      />

      <Textarea
        label="About You"
        placeholder="Tell people about yourself... What makes you unique? What are you passionate about?"
        value={data.bio || ''}
        onChange={(e) => onChange({ bio: e.target.value })}
        rows={4}
        error={!data.bio ? 'Bio is required' : undefined}
      />

      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
        <h4 className="font-medium text-primary-800 mb-2">Tips for a great profile:</h4>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Be authentic and genuine in your bio</li>
          <li>• Use recent photos that show your personality</li>
          <li>• Include photos of activities you enjoy</li>
          <li>• Smile! It makes you more approachable</li>
        </ul>
      </div>
    </div>
  );
}