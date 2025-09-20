import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
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
      className="w-full" // Removed max-w-5xl mx-auto to allow full width
    >
      <CarouselContent>
        {teamPhotos.map((photo, index) => (
          <CarouselItem key={index}>
            <div className="p-0"> {/* Removed p-1 for full width */}
              <Card className="border-none shadow-lg rounded-lg"> {/* Keep card rounded */}
                <CardContent className="flex aspect-video items-center justify-center p-0">
                  <img
                    src={photo}
                    alt={`Team Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg" // Image fills and matches card's top corners
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4" />
      <CarouselNext className="absolute right-4" />
    </Carousel>
  );
};

export default TeamCarousel;