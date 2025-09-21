import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/supabase";
import Spinner from "@/components/Spinner"; // Import Spinner

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false }); // Order solely by event_date

      if (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events.");
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // Group events by year (derived from event_date) and sort by event_date within each year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.event_date).getFullYear(); // Derive year from event_date
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(event);
    return acc;
  }, {} as Record<number, Event[]>);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.8,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <Spinner text="Loading events..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <p className="text-lg text-red-600">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

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
          {/* The timeline's vertical line - always centered */}
          <div className="absolute left-1/2 top-10 h-[calc(100%-4rem)] w-0.5 bg-gray-200 -translate-x-1/2" />

          {sortedYears.map((year) => (
            <div key={year} className="mb-12">
              <motion.div variants={itemVariants} className="flex justify-center mb-8">
                <h2 className="text-4xl font-bold text-white bg-[#d92507] px-6 py-2 rounded-full z-10">
                  {year}
                </h2>
              </motion.div>

              {eventsByYear[year].map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  className="relative mb-8 flex" // Added flex to control alignment
                >
                  {/* Timeline dot */}
                  <div className="absolute top-3 left-1/2 w-4 h-4 bg-[#0d2f60] rounded-full -translate-x-1/2 border-4 border-white z-10" />
                  
                  {/* Event card container */}
                  <div
                    className={`w-[calc(50%-1rem)] ${
                      index % 2 === 0
                        ? "pr-4 text-right" // Left side
                        : "pl-4 text-left ml-auto" // Right side
                    }`}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="p-3 sm:p-4">
                        <CardTitle className="text-base sm:text-xl font-bold text-[#0d2f60]">{event.name}</CardTitle>
                        <p className={`text-xs sm:text-sm text-gray-500 ${index % 2 !== 0 ? "text-left" : "text-right"}`}>
                          {new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                        <p className={`flex items-center text-xs sm:text-sm text-gray-500 ${index % 2 !== 0 ? "justify-start" : "justify-end"}`}>
                          <MapPin className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          {event.location}
                        </p>
                      </CardHeader>
                      {event.awards && event.awards.length > 0 && (
                        <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
                          <div className={`flex flex-wrap gap-1 sm:gap-2 mt-2 ${index % 2 !== 0 ? "justify-start" : "justify-end"}`}>
                            {event.awards.map((award, awardIndex) => (
                              <Badge key={awardIndex} variant="secondary" className="text-xs sm:text-sm px-2 py-1">
                                <Trophy className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
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
            <div className="w-full text-center">
                <div className="inline-flex items-center bg-[#0d2f60] text-white text-base sm:text-xl font-bold px-4 py-2 rounded-full shadow-lg">
                    <Flag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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