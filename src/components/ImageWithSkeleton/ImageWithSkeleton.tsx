import { Skeleton, Image } from "antd";
import { memo } from "react";

export interface IImageWithSkeletonProps {
  src: string;
  alt: string;
  index?: number;
  width?: string | number;
  height?: string | number;
}

export const ImageWithSkeleton = memo(({ 
  src, 
  alt, 
  index = 0,
  width = "220px",
  height = "124px"
}: IImageWithSkeletonProps) => {

  if (!src) {
    return (
      <div className="relative w-full" style={{ height }}>
        <Skeleton.Image active style={{ width, height }} />
      </div>
    );
  }

  const isPriority = index === 0;

  return (
    <div className="relative w-full overflow-hidden rounded-md" style={{ height }}>
      <Image
        src={src}
        alt={alt}
        placeholder={
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Skeleton.Image active style={{ width, height }} />
          </div>
        }
        style={{
          width,
          height,
          objectFit: "cover",
        }}
        preview={{ mask: "Ver imagen" }}
        loading={isPriority ? "eager" : "lazy"}
        decoding={isPriority ? "sync" : "async"}
        fetchPriority={isPriority ? "high" : "low"}
      />
    </div>
  );
});
