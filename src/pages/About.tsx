import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import SimpleImageCarousel from "@/components/SimpleImageCarousel";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember, Achievement, SlideshowImage } from "@/types/supabase"; // Import new types

const About: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [carouselImages, setCarouselImages] = useState<string[]>([]); // State for carousel images
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: membersData, error: membersError } = await supabase
        .from("team_members")
        .select("*")
        .order("created_at", { ascending: true }); // Order for consistent display

      const { data: achievementsData, error: achievementsError } = await supabase
        .from("achievements")
        .select("*")
        .order("year", { ascending: false }) // Order by year descending
        .order("created_at", { ascending: false }); // Consistent order for same year

      const { data: slideshowImagesData, error: slideshowImagesError } = await supabase
        .from("slideshow_images")
        .select("image_url")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (membersError) {
        console.error("Error fetching team members:", membersError);
        setError("Failed to load team members.");
      } else if (achievementsError) {
        console.error("Error fetching achievements:", achievementsError);
        setError("Failed to load achievements.");
      } else if (slideshowImagesError) {
        console.error("Error fetching slideshow images:", slideshowImagesError);
        setError("Failed to load slideshow images for carousel.");
      }
      else {
        setTeamMembers(membersData || []);
        setAchievements(achievementsData || []);
        setCarouselImages(slideshowImagesData?.map(img => img.image_url) || []);
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
        type: "spring",
        duration: 1,
        bounce: 0.3,
      },
    },
  };

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
    hidden: {},
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
          <p className="text-lg text-gray-600">Loading About page content...</p>
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
      <main className="flex-grow overflow-hidden pt-16">
        {/* Hero Section for About Page */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-center"
        >
          {/* Simple Image Carousel as Background */}
          <SimpleImageCarousel images={carouselImages} className="absolute inset-0 z-0" />
          <div className="absolute inset-0 bg-black bg-opacity-70 z-10" /> {/* Dark overlay - changed to 70% opacity */}

          {/* Content over the slideshow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute inset-0 z-20 p-8 max-w-3xl mx-auto flex flex-col items-center justify-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              About Tomball T3 Robotics
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Tomball T3 Robotics, FRC Team 7312, is dedicated to inspiring young minds in science, technology,
              engineering, and mathematics (STEM) through participation in the FIRST Robotics Competition.
              We aim to build not just robots, but also future leaders, innovators, and problem-solvers,
              fostering a culture of teamwork, Gracious Professionalism, and Coopertition.
            </p>
          </motion.div>
        </motion.div>

        <div className="container mx-auto px-4 py-12"> {/* Main content container */}
          {/* Meet the Team Section */}
          <motion.section
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-[#d92507] text-center mb-8">Meet the Team</h2>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
              variants={listVariants}
            >
              {teamMembers.map((member) => (
                <motion.div
                  key={member.id}
                  variants={itemVariants}
                  className="flex"
                >
                  <Card className="w-full flex flex-col shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow overflow-hidden">
                    {member.image_url && (
                      <img
                        src={member.image_url}
                        alt={member.name}
                        className="w-full h-48 object-cover rounded-t-lg border-b-4 border-[#0d2f60]"
                      />
                    )}
                    <CardHeader className="p-4 text-center">
                      <CardTitle className="text-xl font-bold text-[#0d2f60]">{member.name}</CardTitle>
                      <p className="text-gray-600 text-sm">{member.role}</p>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            {teamMembers.length === 0 && (
              <p className="text-center text-gray-600 text-xl mt-8">No team members to display yet.</p>
            )}
          </motion.section>

          {/* Achievements Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-[#0d2f60] text-center mb-8">Our Achievements</h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
              variants={listVariants}
            >
              {achievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  variants={itemVariants}
                  className="flex"
                >
                  <Card className="w-full p-5 shadow-lg rounded-lg bg-white flex items-center space-x-4 border-l-4 border-[#d92507] hover:shadow-xl transition-shadow">
                    <div className="flex-shrink-0 text-[#0d2f60]">
                      <Trophy className="h-8 w-8" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-semibold text-gray-500">{achievement.year}</p>
                      <p className="text-lg text-gray-700 font-medium">{achievement.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            {achievements.length === 0 && (
              <p className="text-center text-gray-600 text-xl mt-8">No achievements to display yet.</p>
            )}
          </motion.section>
        </div> {/* End of main content container */}
      </main>
      <Footer />
    </div>
  );
};

export default About;