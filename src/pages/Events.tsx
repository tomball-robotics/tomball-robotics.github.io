import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { events } from "@/data/eventsData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Flag } from "lucide-react";

interface Event {
  year: number;
  name: string;
  location: string;
  awards: string[];
}

const Events: React.FC = () => {
  // Group events by year
  const eventsByYear = events.reduce((acc, event) => {
    const year = event.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, Event[]>);

  // Reverse the order of events within each year to show the most recent first
  for (const year in eventsByYear) {
    eventsByYear[year].reverse();
  }

  const sortedYears = Object.keys(eventsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-grow container mx-auto px-4 py-12 pt-24"
      >
        <h1 className="text-5xl font-extrabold text-[#0d2f60] text-center mb-12">Our Journey & Achievements</h1>

        <div className="relative max-w-4xl mx-auto">
          {/* The timeline's vertical line */}
          <div className="absolute left-4 md:left-1/2 top-10 h-[calc(100%-4rem)] w-0.5 bg-gray-200" />

          {sortedYears.map((year) => (
            <div key={year} className="mb-12">
              <motion.div variants={itemVariants} className="flex justify-center mb-8">
                <h2 className="text-4xl font-bold text-white bg-[#d92507] px-6 py-2 rounded-full z-10">
                  {year}
                </h2>
              </motion.div>

              {eventsByYear[year].map((event, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative mb-8"
                >
                  <div className="absolute top-3 left-4 md:left-1/2 w-4 h-4 bg-[#0d2f60] rounded-full -translate-x-1/2 border-4 border-white" />
                  <div
                    className={`w-[calc(100%-3rem)] md:w-1/2 ml-10 md:ml-0 ${
                      index % 2 === 0 ? "md:ml-[calc(50%+1.5rem)] md:pl-8" : "md:mr-[calc(50%+1.5rem)] md:pr-8 md:text-right"
                    }`}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-[#0d2f60]">{event.name}</CardTitle>
                        <p className={`flex items-center text-sm text-gray-500 ${index % 2 !== 0 && "md:justify-end"}`}>
                          <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                          {event.location}
                        </p>
                      </CardHeader>
                      {event.awards.length > 0 && (
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {event.awards.map((award, awardIndex) => (
                              <Badge key={awardIndex} variant="secondary" className="text-sm">
                                <Trophy className="mr-1.5 h-4 w-4 text-yellow-500" />
                                {award}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}

          {/* Team Founded Marker */}
          <motion.div
            variants={itemVariants}
            className="relative mt-8"
          >
            <div className="absolute top-3 left-4 md:left-1/2 w-4 h-4 bg-[#d92507] rounded-full -translate-x-1/2 border-4 border-white" />
            <div className="w-full text-center">
                <div className="inline-flex items-center bg-[#0d2f60] text-white text-xl font-bold px-6 py-2 rounded-full z-10 shadow-lg">
                    <Flag className="mr-2 h-5 w-5" />
                    Team Founded 2018
                </div>
            </div>
          </motion.div>
        </div>

        {events.length === 0 && (
          <p className="text-center text-gray-600 text-xl mt-8">No events to display yet. Check back soon!</p>
        )}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Events;