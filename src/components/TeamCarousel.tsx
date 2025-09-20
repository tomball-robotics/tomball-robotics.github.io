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
  // Removed "/RobotTeamPhoto.jpg" as it was not found in the public directory.
  // If you have a 'RobotTeamPhoto.jpg' or other team photos, please add them to the public directory
  // and then you can add their paths here, e.g., "/RobotTeamPhoto.jpg".
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
          <CarouselItem key={index} className="h-full relative overflow-hidden">
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