import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Flag, CalendarDays, Users, Handshake, Award, GitPullRequestArrow, ListOrdered, ShieldCheck } from "lucide-react";
import { Event } from "@/types/supabase";
import Spinner from "@/components/Spinner";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventsFromSupabase = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) {
        console.error('Error fetching events from Supabase:', error);
        setError('Failed to load events from database.');
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEventsFromSupabase();
  }, []);

  // Group events by year (derived from event_date) and sort by event_date within each year
  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.event_date).getFullYear();
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
                  className="relative mb-8 flex"
                >
                  {/* Timeline dot */}
                  <div className="absolute top-3 left-1/2 w-5 h-5 bg-[#0d2f60] rounded-full -translate-x-1/2 border-4 border-white z-10" />
                  
                  {/* Event card container */}
                  <div
                    className={`w-[calc(50%-1.5rem)] ${
                      index % 2 === 0
                        ? "pr-4 text-right"
                        : "pl-4 text-left ml-auto"
                    }`}
                  >
                    <Card className="shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="p-4 border-b border-gray-200">
                        <CardTitle className="text-lg sm:text-2xl font-bold text-[#0d2f60] mb-1">{event.name}</CardTitle>
                        <p className={`text-xs sm:text-sm text-gray-500 ${index % 2 !== 0 ? "text-left" : "text-right"}`}>
                          {new Date(event.event_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className={`flex items-center text-xs sm:text-sm text-gray-500 ${index % 2 !== 0 ? "justify-start" : "justify-end"}`}>
                          <MapPin className="mr-1 sm:mr-2 h-4 w-4 flex-shrink-0" />
                          {event.location}
                        </p>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1" className="border-none">
                            <AccordionTrigger className="px-4 py-3 text-sm sm:text-base text-[#d92507] hover:no-underline hover:text-[#b31f06]">
                              More Details
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 text-gray-700 text-sm space-y-3">
                              {event.overall_status_str && (
                                <p className="flex items-start space-x-2 text-left"> {/* Added text-left here */}
                                  <CalendarDays className="h-4 w-4 text-[#0d2f60] flex-shrink-0 mt-1" />
                                  <span className="font-semibold">Overall Status:&nbsp;</span> {event.overall_status_str.replace(/<[^>]*>/g, '')}
                                </p>
                              )}
                              {event.qual_rank !== null && (
                                <p className="flex items-center space-x-2">
                                  <ListOrdered className="h-4 w-4 text-[#0d2f60]" />
                                  <span className="font-semibold">Qualification Rank:&nbsp;</span> {event.qual_rank}
                                </p>
                              )}
                              {event.record_wins !== null && event.record_losses !== null && event.record_ties !== null && (
                                <p className="flex items-center space-x-2">
                                  <Trophy className="h-4 w-4 text-[#0d2f60]" />
                                  <span className="font-semibold">Record:&nbsp;</span> {event.record_wins}-{event.record_losses}-{event.record_ties}
                                </p>
                              )}
                              {event.alliance_status && (
                                <p className="flex items-center space-x-2">
                                  <GitPullRequestArrow className="h-4 w-4 text-[#0d2f60]" />
                                  <span className="font-semibold">Alliance:&nbsp;</span> {event.alliance_status}
                                </p>
                              )}
                              {event.playoff_status && (
                                <p className="flex items-center space-x-2">
                                  <ShieldCheck className="h-4 w-4 text-[#0d2f60]" />
                                  <span className="font-semibold">Playoff Status:&nbsp;</span> {event.playoff_status.charAt(0).toUpperCase() + event.playoff_status.slice(1)}
                                </p>
                              )}
                              {event.awards && event.awards.length > 0 && (
                                <div className="mt-2">
                                  <p className="font-semibold text-[#0d2f60] mb-1">Awards:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {event.awards.map((award, awardIndex) => (
                                      <Badge key={awardIndex} variant="secondary" className="text-xs px-2 py-1">
                                        <Trophy className="mr-1 h-3 w-3 text-yellow-500" />
                                        {award}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {!event.overall_status_str && event.qual_rank === null && event.record_wins === null && !event.alliance_status && !event.playoff_status && (!event.awards || event.awards.length === 0) && (
                                <p className="text-gray-500">No additional details available.</p>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
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