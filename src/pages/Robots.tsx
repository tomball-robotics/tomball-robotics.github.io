import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { robots } from "@/data/robotsData";

const Robots: React.FC = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
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
                <img
                  src={robot.imageUrl}
                  alt={robot.name}
                  className="w-full h-96 object-cover"
                />
                <CardHeader className="p-4">
                  <CardTitle className="text-2xl font-bold text-[#d92507]">{robot.name}</CardTitle>
                  <CardDescription className="text-gray-600">{robot.year} Robot</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                  <p className="text-gray-700 mb-3">
                    <span className="font-semibold text-[#0d2f60]">Specs:</span> {robot.specs}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-[#0d2f60]">Awards:</span> {robot.awards}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {robots.length === 0 && (
          <p className="text-center text-gray-600 text-xl mt-8">No robots to display yet. Check back soon!</p>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Robots;