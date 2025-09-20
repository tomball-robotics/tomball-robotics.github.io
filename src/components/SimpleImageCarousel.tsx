import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SimpleImageCarouselProps {
  images: string[];
  interval?: number; // Time in ms for image change
  className?: string;
}

const SimpleImageCarousel: React.FC<SimpleImageCarouselProps> = ({
  images,
  interval = 4000,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return; // No need for carousel if 0 or 1 image

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images, interval]);

  if (images.length === 0) {
    return <div className={cn("w-full h-full bg-gray-200 flex items-center justify-center text-gray-500", className)}>No images to display</div>;
  }

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slideshow image ${index + 1}`}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
    </div>
  );
};

export default SimpleImageCarousel;