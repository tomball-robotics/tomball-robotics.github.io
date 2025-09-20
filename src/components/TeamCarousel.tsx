import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils"; // Import cn utility

const teamPhotos = [
  "/indexcollage.jpg",
  "/hero-background.jpeg",
];

interface TeamCarouselProps {
  className?: string;
}

const TeamCarousel: React.FC<TeamCarouselProps> = ({ className }) => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className={cn("w-full h-full absolute inset-0", className)}
    >
      <CarouselContent className="h-full">
        {teamPhotos.map((photo, index) => (
          <CarouselItem key={index} className="h-full relative overflow-hidden">
            <img
              src={photo}
              alt={`Team Photo ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Navigation buttons for the carousel */}
      <CarouselPrevious className="absolute left-4 z-20" />
      <CarouselNext className="absolute right-4 z-20" />
    </Carousel>
  );
};

export default TeamCarousel;