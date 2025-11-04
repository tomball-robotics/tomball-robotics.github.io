import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Robot } from "@/types/supabase";
import Spinner from "@/components/Spinner"; // Import Spinner
import { Helmet } from 'react-helmet-async'; // Import Helmet

const Robots: React.FC = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRobots = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("robots")
        .select("*")
        .order("year", { ascending: false });

      if (error) {
        console.error("Error fetching robots:", error);
        setError("Failed to load robots.");
      } else {
        setRobots(data || []);
      }
      setLoading(false);
    };

    fetchRobots();
  }, []);

  const listVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    hidden: {},
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
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
          <Spinner text="Loading robots..." />
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
      <Helmet>
        <title>Our Robots - Tomball T3 Robotics</title>
        <meta name="description" content="Discover the robots built by Tomball T3 Robotics, FRC Team 7312, through the years, including their specifications and awards." />
      </Helmet>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-12 pt-24"
      >
        <h1 className="text-5xl font-extrabold text-[#0d2f60] text-center mb-12">Our Robots</h1>

        <motion.div
          className="flex flex-wrap justify-center gap-8"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {robots.map((robot) => (
            <motion.div
              key={robot.id}
              variants={itemVariants}
              className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
            >
              <Card className="h-full flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
                {robot.image_url && (
                  <img
                    src={robot.image_url}
                    alt={`Image of ${robot.name}`}
                    className="w-full h-96 object-cover"
                    width={400} // Example width, adjust as needed
                    height={384} // Example height (h-96 = 384px)
                  />
                )}
                <CardHeader className="p-4">
                  <CardTitle className="text-2xl font-bold text-[#d92507]">{robot.name}</CardTitle>
                  <CardDescription className="text-gray-600">{robot.year} Robot</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  {robot.specs && (
                    <p className="text-gray-700 mb-3">
                      <span className="font-semibold text-[#0d2f60]">Specs:</span> {robot.specs}
                    </p>
                  )}
                  {robot.awards && (
                    <p className="text-gray-700">
                      <span className="font-semibold text-[#0d2f60]">Awards:</span> {robot.awards}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {robots.length === 0 && (
          <p className="text-center text-gray-600 text-xl mt-8">No robots to display yet. Check back soon!</p>
        )}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Robots;