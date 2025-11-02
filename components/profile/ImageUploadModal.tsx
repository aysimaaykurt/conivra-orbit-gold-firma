"use client";

import React, { useRef, useState } from "react";
import Modal from "@/components/ui/modal/Modal";
import { Button } from "@/components/ui/button";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (file: File) => void;
  currentImageSrc?: string;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onImageSelect,
  currentImageSrc,
}: ImageUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    currentImageSrc || null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      onImageSelect(file);
      onClose();
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profil Resmi Yükle">
      <div className="space-y-6">
        {/* Preview */}
        <div className="flex justify-center">
          <div
            className="w-40 h-40 rounded-full border-4 flex items-center justify-center overflow-hidden"
            style={{ borderColor: "#4C226A" }}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : currentImageSrc ? (
              <img
                src={currentImageSrc}
                alt="Current Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/images/Profil.png"
                alt="Default Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* File Input */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="profile-image-upload"
          />
          <label
            htmlFor="profile-image-upload"
            className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
            style={{ borderColor: preview ? "#4C226A" : undefined }}
          >
            <div className="text-center">
              <i className="pi pi-upload text-2xl mb-2" style={{ color: "#4C226A" }} />
              <p className="text-sm text-dark">
                {preview ? "Resmi Değiştir" : "Resim Seç"}
              </p>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-4">
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 text-white py-3 rounded-lg font-medium"
            style={{ backgroundColor: "#4C226A" }}
            disabled={!preview}
          >
            Kaydet
          </Button>
          {preview && (
            <Button
              type="button"
              onClick={handleRemove}
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#EF4444" }}
            >
              Kaldır
            </Button>
          )}
          <Button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#3B82F6" }}
          >
            İptal
          </Button>
        </div>
      </div>
    </Modal>
  );
}

