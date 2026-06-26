export interface IGenericLocalImage {
  id: string;
  file: File;
  previewUrl: string;
  label: string;
}

export interface IUploadImageCompressorProps {
  onSaveSuccess: (compressedFiles: File[]) => void;
  onCancel: () => void;
  currentImageCount: number;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedFormats?: string;
}
