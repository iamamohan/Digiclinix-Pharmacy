'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Check, AlertCircle, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ProductImageUploadProps {
  currentImageUrl?: string;
  currentImagePublicId?: string;
  onUploadSuccess: (info: { imageUrl: string; imagePublicId: string }) => void;
  onUploadStart?: () => void;
  onUploadError?: (errorMsg: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  currentImageUrl,
  currentImagePublicId,
  onUploadSuccess,
  onUploadStart,
  onUploadError,
  onClear,
  disabled = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(Boolean(currentImageUrl));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
      setUploadSuccess(true);
    }
  }, [currentImageUrl]);

  const validateFile = (file: File): string | null => {
    const fileName = file.name.toLowerCase();
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext));

    if (!ALLOWED_MIME_TYPES.includes(file.type) && !hasValidExt) {
      return 'Only JPG, JPEG, PNG, and WEBP image formats are allowed.';
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return 'File size exceeds maximum allowed limit of 5 MB.';
    }

    return null;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setErrorMessage(null);

    // Validate file type and size
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      if (onUploadError) onUploadError(validationError);
      return;
    }

    // Local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    if (onUploadStart) onUploadStart();

    try {
      // 1. Request signature from /api/cloudinary/sign
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!signRes.ok) {
        const errJson = await signRes.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || 'Failed to get upload authorization signature.');
      }

      const signData = await signRes.json();
      if (!signData.success || !signData.data) {
        throw new Error('Invalid signature response received from server.');
      }

      const { signature, timestamp, apiKey, cloudName, folder } = signData.data;

      // 2. Prepare FormData for direct Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder);

      // 3. Upload directly to Cloudinary using XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            try {
              const res = JSON.parse(xhr.responseText);
              const secureUrl = res.secure_url;
              const publicId = res.public_id;

              if (!secureUrl || !publicId) {
                throw new Error('Cloudinary response missing image URL or public ID.');
              }

              setPreviewUrl(secureUrl);
              setIsUploading(false);
              setUploadSuccess(true);
              setUploadProgress(100);
              setErrorMessage(null);

              onUploadSuccess({
                imageUrl: secureUrl,
                imagePublicId: publicId,
              });
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Error parsing upload response.';
              setIsUploading(false);
              setErrorMessage(msg);
              if (onUploadError) onUploadError(msg);
            }
          } else {
            let errorMsg = `Upload failed with status code ${xhr.status}`;
            try {
              const errRes = JSON.parse(xhr.responseText);
              if (errRes.error?.message) {
                errorMsg = errRes.error.message;
              }
            } catch {
              // use default errorMsg
            }
            setIsUploading(false);
            setErrorMessage(errorMsg);
            if (onUploadError) onUploadError(errorMsg);
          }
        }
      };

      xhr.open('POST', uploadUrl, true);
      xhr.send(formData);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'An unexpected error occurred during image upload.';
      setIsUploading(false);
      setErrorMessage(msg);
      if (onUploadError) onUploadError(msg);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setUploadSuccess(false);
    setUploadProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClear) onClear();
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="product-image-upload-input"
        className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
      >
        Product Image
      </label>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id="product-image-upload-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        className="sr-only"
        aria-describedby="upload-requirements upload-status upload-error"
      />

      {/* Upload Zone / Preview Panel */}
      <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] p-4 transition-all">
        {previewUrl ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Image Preview Box */}
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0">
              <Image
                src={previewUrl}
                alt="Product image preview"
                fill
                sizes="128px"
                className="object-cover object-center"
                unoptimized={previewUrl.startsWith('blob:')}
              />
            </div>

            {/* Status & Action Controls */}
            <div className="flex-1 space-y-2 w-full">
              {isUploading ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                      Uploading to Cloudinary...
                    </span>
                    <span>{uploadProgress}%</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 dark:bg-purple-500 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : uploadSuccess ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Image ready for submission</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={disabled}
                      leftIcon={<RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />}
                    >
                      Replace Image
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                      disabled={disabled}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      leftIcon={<X className="w-3.5 h-3.5" aria-hidden="true" />}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          /* Empty Upload Dropzone Button */
          <div
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === 'Enter' || e.key === ' ') && !disabled && !isUploading) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-400 rounded-xl cursor-pointer transition-colors text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
              <Upload className="w-5 h-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Click to select image
            </p>
            <p id="upload-requirements" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Accepted: JPG, JPEG, PNG, WEBP &bull; Maximum size: 5 MB
            </p>
          </div>
        )}
      </div>

      {/* Accessible Live Region for Status & Errors */}
      <div id="upload-status" aria-live="polite" className="sr-only">
        {isUploading
          ? `Uploading image, ${uploadProgress} percent complete.`
          : uploadSuccess
          ? 'Image uploaded successfully.'
          : ''}
      </div>

      {errorMessage && (
        <div
          id="upload-error"
          role="alert"
          className="flex items-start gap-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-800/60"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
