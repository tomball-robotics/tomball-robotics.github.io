import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import AwardBanners from "@/components/AwardBanners";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteSettings, Event, Sponsor } from "@/types/supabase";
import Spinner from "@/components/Spinner"; // Import Spinner

const Index: React.FC = () => {
  const [homePageData, setHomePageData] = useState<WebsiteSettings | null>(null);
  const [latestEvents, setLatestEvents] = useState<Event[]>([]);
  const [featuredSponsors, setFeaturedSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: settingsData, error: settingsError } = await supabase
        .from("website_settings")
        .select("*")
        .limit(1)
        .single();

      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("year", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(3);

      const { data: sponsorsData, error: sponsorsError } = await supabase
        .from("sponsors")
        .select("*")
        .order("amount", { ascending: false })
        .limit(3);

      if (settingsError) {
        console.error("Error fetching website settings:", settingsError);
        setError("Failed to load home page settings.");
      } else if (eventsError) {
        console.error("Error fetching latest events:", eventsError);
        setError("Failed to load latest events.");
      } else if (sponsorsError) {
        console.error("Error fetching featured sponsors:", sponsorsError);
        setError("Failed to load featured sponsors.");
      } else {
        setHomePageData(settingsData);
        setLatestEvents(eventsData || []);
        setFeaturedSponsors(sponsorsData || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
    hidden: {},
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <Spinner text="Loading home page content..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !homePageData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <p className="text-lg text-red-600">{error || "Failed to load home page content."}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow overflow-hidden pt-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-[calc(100vh-4rem)] flex items-center justify-center bg-cover bg-center text-center"
          style={{ backgroundImage: `url('${homePageData.hero_background_image}')` }}
        >
          <AwardBanners />

          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative z-10 p-8 max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              {homePageData.hero_title}
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              {homePageData.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-[#d92507] hover:bg-[#b31f06] text-white text-lg px-8 py-4 rounded-full transition-colors group">
                <Link to="/about">
                  Learn More <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-[#0d2f60] text-lg px-8 py-4 rounded-full transition-colors group">
                <Link to="/donate">
                  Support Us <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* About Section Preview */}
        <motion.section
          className="py-20 bg-white"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-left"
              >
                <h2 className="text-4xl font-bold text-[#0d2f60] mb-6">{homePageData.about_preview_title}</h2>
                <p className="text-lg text-gray-700 mb-8">
                  {homePageData.about_preview_description}
                </p>
                <Button asChild size="lg" className="bg-[#0d2f60] hover:bg-[#0a244a] text-white group">
                  <Link to="/about">
                    Meet the Team <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <img
                  src={homePageData.about_preview_image_url}
                  alt="T3 Robotics Team"
                  className="rounded-lg shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Events Section Preview */}
        <motion.section
          className="py-20 bg-gray-50"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-[#0d2f60] mb-6">{homePageData.events_preview_title}</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10">
              {homePageData.events_preview_description}
            </p>
            <motion.div
              className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto mb-10"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {latestEvents.map((event) => (
                <motion.div key={event.id} className="w-full md:w-[45%] lg:w-[30%]" variants={itemVariants}>
                  <Card className="text-left shadow-lg bg-white flex flex-col h-full">
                    <CardHeader className="bg-[#d92507] text-white p-4">
                      <p className="font-semibold">{event.year}</p>
                      <CardTitle className="text-xl">{event.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      {event.awards && event.awards.length > 0 ? (
                        <>
                          <p className="font-semibold text-gray-800">🏆 Awards:</p>
                          <ul className="list-disc list-inside text-gray-600 mt-2 text-sm space-y-1">
                            {event.awards.map((award, i) => <li key={i}>{award}</li>)}
                          </ul>
                        </>
                      ) : (
                        <p className="text-gray-600 mt-2">No awards recorded for this event.</p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            <Button asChild size="lg" className="bg-[#d92507] hover:bg-[#b31f06] text-white group">
              <Link to="/events">
                View All Events <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.section>

        {/* Sponsors Section Preview */}
        <motion.section
          className="py-20 bg-white"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-[#0d2f60] mb-6">{homePageData.sponsors_preview_title}</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10">
              {homePageData.sponsors_preview_description}
            </p>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {featuredSponsors.map(sponsor => (
                <motion.div key={sponsor.id} variants={itemVariants}>
                  <Card className="text-center shadow-md hover:shadow-xl transition-shadow h-full">
                    <CardHeader>
                      {sponsor.image_url && (
                        <img src={sponsor.image_url} alt={sponsor.name} className="w-24 h-24 mx-auto object-contain mb-4" />
                      )}
                      <CardTitle className="text-xl text-[#d92507]">{sponsor.name}</CardTitle>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            <Button asChild size="lg" className="bg-[#0d2f60] hover:bg-[#0a244a] text-white group">
              <Link to="/sponsors">
                See All Sponsors <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;