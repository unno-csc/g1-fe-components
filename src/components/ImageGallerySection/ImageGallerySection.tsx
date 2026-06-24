import { Skeleton } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "../Button";
import { Title } from "../Title";
import { ImageWithSkeleton } from "../ImageWithSkeleton";
import { IImageGallerySectionProps } from "./ImageGallerySection.interface";
import { ReactNode } from "react";

export const ImageGallerySection = ({
  images,
  onAddImage,
  onRemoveImage,
  maxImages = 10,
  isLoadingImages = false,
  title = "Galería de Imágenes",
  emptyMessage = "No hay imágenes cargadas todavía.",
}: IImageGallerySectionProps) => {
  let imagesContent: ReactNode;

  if (isLoadingImages) {
    imagesContent = (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3 place-items-center p-2">
        {Array.from({ length: maxImages }).map((_, i) => (
          <div key={`skeleton-${i}`} className="w-full max-w-[220px] overflow-hidden rounded-md bg-gray-50 shadow-sm">
            <Skeleton.Image active style={{ width: "220px", height: "124px" }} />
          </div>
        ))}
      </div>
    );
  } else if (images.length > 0) {
    imagesContent = (
      <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-100 p-2">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-3 place-items-center">
          {images.map((imageItem, index) => (
            <div
              key={`${imageItem.id}-${index}`}
              className="group relative w-full max-w-[220px] overflow-hidden rounded-md bg-gray-50 shadow-sm"
            >
              <ImageWithSkeleton src={imageItem.previewUrl} alt={`Imagen ${index + 1}`} index={index} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-0 bg-black/60 px-2 py-1 text-[10px] text-white transition-transform duration-150 sm:translate-y-full sm:group-hover:translate-y-0">
                <span className="block truncate">{imageItem.label}</span>
              </div>
              <button
                type="button"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-gray-500 opacity-100 shadow-sm transition-opacity hover:bg-white hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                onClick={() => onRemoveImage(index)}
                aria-label={`Quitar imagen ${index + 1}`}
              >
                <DeleteOutlined style={{ fontSize: 11 }} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    imagesContent = (
      <div className="rounded-md border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-gray-250 p-4 rounded-md flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Title title={title} level={4} />
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <span className="text-xs text-gray-500">{images.length}/{maxImages} imágenes</span>
          <Button
            type="secondary"
            size="middle"
            label={
              <div className="flex items-center gap-2">
                <PlusOutlined />
                Subir imagen
              </div>
            }
            onClick={onAddImage}
          />
        </div>
      </div>
      {imagesContent}
    </div>
  );
};
