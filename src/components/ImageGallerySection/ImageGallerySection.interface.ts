import { IGenericLocalImage } from "../UploadImageCompressor";

export interface IImageGallerySectionProps {
  images: IGenericLocalImage[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  isLoadingImages?: boolean;
  title?: string;
  emptyMessage?: string;
}
