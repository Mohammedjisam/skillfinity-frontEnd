import React, { useState } from 'react';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CropperModal = ({ isOpen, onClose, image, onCropComplete }) => {
  const [cropper, setCropper] = useState(null);

  const handleCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          onCropComplete(blob);
          onClose();
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Crop Image</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50">
          <Cropper
            src={image}
            style={{ height: 400, width: '100%' }}
            aspectRatio={1}
            guides={true}
            onInitialized={(instance) => setCropper(instance)}
          />
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <Button onClick={onClose} variant="outline" className="bg-white hover:bg-gray-100">Cancel</Button>
            <Button onClick={handleCrop} className="bg-blue-600 hover:bg-blue-700 text-white">Crop and Upload</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;
