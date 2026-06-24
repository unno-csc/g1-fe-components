import { useState, useCallback, useEffect } from "react";
import { generateLocalImageId } from "../utils/imageUtils";
import { IGenericLocalImage } from "../components/UploadImageCompressor/UploadImageCompressor.interface";

export const useImageUploadManager = () => {
  const [images, setImages] = useState<IGenericLocalImage[]>([]);

  const addImages = useCallback((files: File[]) => {
    const newImages = files.map((file) => ({
      id: generateLocalImageId(file),
      file,
      previewUrl: URL.createObjectURL(file),
      label: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      const imageToRemove = newImages[index];
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  const clearImages = useCallback(() => {
    setImages((prev) => {
      prev.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      return [];
    });
  }, []);

  useEffect(() => {
    return () => {
      setImages((currentImages) => {
        currentImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
        return [];
      });
    };
  }, []);

  return {
    images,
    addImages,
    removeImage,
    clearImages,
  };
};
