import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { UnitybotResource, UnitybotInitiative } from "@/types/supabase"; // Import new types

const Unitybots: React.FC = () => {
  const [resources, setResources] = useState<UnitybotResource[]>([]);
  const [initiatives, setInitiatives] = useState<UnitybotInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: resourcesData, error: resourcesError } = await supabase
        .from("unitybot_resources")
        .select("*")
        .order("created_at", { ascending: true });

      const { data: initiativesData, error: initiativesError } = await supabase
        .from("unitybot_initiatives")
        .select("*")
        .order("created_at", { ascending: true });

      if (resourcesError) {
        console.error("Error fetching unitybot resources:", resourcesError);
        setError("Failed to load Unitybot resources.");
      } else if (initiativesError) {
        console.error("Error fetching unitybot initiatives:", initiativesError);
        setError("Failed to load Unitybot initiatives.");
      } else {
        setResources(resourcesData || []);
        setInitiatives(initiativesData || []);
      }
      setLoading(false);
    };

    fetchData();
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
          <p className="text-lg text-gray-600">Loading Unity Bots content...</p>
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-12 pt-24"
      >
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-[#0d2f60] mb-6">Unity Bots</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            The Unity Bots Project is aimed at fostering inclusion and diversity in FIRST through partnership and advocacy.
          </p>
          <p className="text-xl font-bold text-[#d92507] mt-4">Our mission is to unite FIRST.</p>
        </div>

        {/* Resources Section */}
        <motion.section
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-[#d92507] text-center mb-8">Our Resources</h2>
          <motion.div
            className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto"
            variants={listVariants}
          >
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                variants={itemVariants}
                className="w-full md:w-[calc(50%-1rem)]"
              >
                <Card className="h-full flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
                  <CardHeader className="bg-[#0d2f60] text-white p-6">
                    <CardTitle className="text-2xl font-bold">{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <p className="text-gray-700 mb-4 flex-grow">{resource.description}</p>
                    <div className="space-y-2 mt-auto">
                      {resource.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-[#d92507] hover:bg-[#b31f06] text-white text-center py-2 px-4 rounded-md transition-colors"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          {resources.length === 0 && (
            <p className="text-center text-gray-600 text-xl mt-8">No resources to display yet.</p>
          )}
        </motion.section>

        {/* Initiatives Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-[#0d2f60] text-center mb-8">Community Initiatives</h2>
          <motion.div
            className="flex flex-wrap justify-center gap-8"
            variants={listVariants}
          >
            {initiatives.map((initiative) => (
              <motion.div
                key={initiative.id}
                variants={itemVariants}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]"
              >
                <Card className="h-full flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
                  {initiative.image_url && (
                    <div className="h-48 flex justify-center items-center bg-gray-50 p-4">
                      <img
                        src={initiative.image_url}
                        alt={initiative.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <CardHeader className="bg-[#0d2f60] text-white p-6">
                    <CardTitle className="text-2xl font-bold">{initiative.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <p className="text-gray-700 mb-4 flex-grow">{initiative.description}</p>
                    <div className="space-y-2 mt-auto">
                      {initiative.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-[#d92507] hover:bg-[#b31f06] text-white text-center py-2 px-4 rounded-md transition-colors"
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          {initiatives.length === 0 && (
            <p className="text-center text-gray-600 text-xl mt-8">No initiatives to display yet.</p>
          )}
        </motion.section>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Unitybots;