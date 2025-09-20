import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const teamPhotos = [
  "/indexcollage.jpg",
  "/hero-background.jpeg",
  "/RobotTeamPhoto.jpg", // Assuming this image exists in public
  // Add more team photos here
];

const TeamCarousel: React.FC = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 4000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full h-full absolute inset-0" // Make carousel fill its parent container
    >
      <CarouselContent className="h-full">
        {teamPhotos.map((photo, index) => (
          <CarouselItem key={index} className="h-full relative overflow-hidden"> {/* Added relative and overflow-hidden */}
            <img
              src={photo}
              alt={`Team Photo ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover" // Image fills the item, cropping as needed
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