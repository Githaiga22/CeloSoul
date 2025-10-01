import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { DEFAULT_INTERESTS } from '../../lib/constants';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileEditModal({ isOpen, onClose }: ProfileEditModalProps) {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name || '');
      setBio(user.bio || '');
      setDateOfBirth(user.date_of_birth || '');
      setSelectedInterests(user.interests || []);
    }
  }, [user]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests((prev) => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleSave = async () => {
    if (!user || !displayName.trim()) {
      setError('Display name is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          display_name: displayName.trim(),
          bio: bio.trim(),
          date_of_birth: dateOfBirth || null,
          interests: selectedInterests,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await refreshUser();
      onClose();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="lg">
      <div className="space-y-6">
        <Input
          label="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name"
          error={error && !displayName.trim() ? 'Required' : undefined}
        />

        <Textarea
          label="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell others about yourself..."
          rows={4}
        />

        <Input
          label="Date of Birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
        />

        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-3">
            Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {DEFAULT_INTERESTS.map((interest) => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest as string) ? 'primary' : 'secondary'}
                className="cursor-pointer hover:opacity-80"
                onClick={() => toggleInterest(interest as string)}
              >
                {interest}
              </Badge>
            ))}
          </div>

          {selectedInterests.filter((i) => !DEFAULT_INTERESTS.includes(i as any)).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedInterests
                .filter((i) => !DEFAULT_INTERESTS.includes(i as any))
                .map((interest) => (
                  <Badge
                    key={interest}
                    variant="primary"
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest} ×
                  </Badge>
                ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Add custom interest"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomInterest();
                }
              }}
              fullWidth
            />
            <Button variant="secondary" onClick={addCustomInterest} disabled={!customInterest.trim()}>
              Add
            </Button>
          </div>
        </div>

        {error && <p className="text-sm text-danger-500">{error}</p>}

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" size="lg" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!displayName.trim()}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
