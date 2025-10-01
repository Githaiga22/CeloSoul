import { useState, useRef } from 'react';
import { Upload, X, Plus } from 'lucide-react';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
  minPhotos?: number;
}

export function PhotoUploader({ photos, onChange, maxPhotos = 5, minPhotos = 2 }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList) => {
    if (photos.length + files.length > maxPhotos) {
      alert(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);
    const newPhotos: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const mockUrl = URL.createObjectURL(file);
        newPhotos.push(mockUrl);
      }
    }

    onChange([...photos, ...newPhotos]);
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onChange(newPhotos);
  };

  const canAddMore = photos.length < maxPhotos;
  const hasMinimum = photos.length >= minPhotos;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900">
          Add Photos ({photos.length}/{maxPhotos})
        </h3>
        {!hasMinimum && (
          <span className="text-sm text-danger-600">
            Minimum {minPhotos} photos required
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-secondary-100">
            <img
              src={photo}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-primary-500 text-black text-xs font-medium rounded">
                Main
              </div>
            )}
          </div>
        ))}

        {canAddMore && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-secondary-300 hover:border-primary-500 transition-colors flex flex-col items-center justify-center gap-2 text-secondary-600 hover:text-primary-600"
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-8 h-8" />
                <span className="text-sm font-medium">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
      />

      <div className="flex items-center gap-2 p-4 bg-secondary-50 rounded-xl">
        <Upload className="w-5 h-5 text-secondary-600" />
        <div className="text-sm text-secondary-600">
          <p className="font-medium">Photo Tips:</p>
          <p>• Use high-quality, recent photos</p>
          <p>• Show your face clearly in the first photo</p>
          <p>• Include variety: close-ups, full body, activities</p>
        </div>
      </div>
    </div>
  );
}