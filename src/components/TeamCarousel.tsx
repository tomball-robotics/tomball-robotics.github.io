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
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent>
        {teamPhotos.map((photo, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="border-none shadow-lg">
                <CardContent className="flex aspect-video items-center justify-center p-0">
                  <img
                    src={photo}
                    alt={`Team Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
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