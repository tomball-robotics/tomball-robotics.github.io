import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { teamMembers, achievements } from "@/data/aboutData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Users, Flag } from "lucide-react"; // Added Users and Flag icons

import TeamCarousel from "@/components/TeamCarousel"; // Import the new carousel component

const About: React.FC = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-12 pt-24"
      >
        <h1 className="text-5xl font-extrabold text-[#0d2f60] text-center mb-12">About Tomball T3 Robotics</h1>

        {/* Mission Section */}
        <motion.section
          className="mb-16 text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-[#d92507] mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            Tomball T3 Robotics, FRC Team 7312, is dedicated to inspiring young minds in science, technology,
            engineering, and mathematics (STEM) through participation in the FIRST Robotics Competition.
            We aim to build not just robots, but also future leaders, innovators, and problem-solvers,
            fostering a culture of teamwork, Gracious Professionalism, and Coopertition.
          </p>
        </motion.section>

        {/* Team Photos Slideshow */}
        <motion.section
          className="mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-[#0d2f60] text-center mb-8">Team Highlights</h2>
          <TeamCarousel />
        </motion.section>

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
                <Card className="w-full flex flex-col items-center text-center p-6 shadow-lg rounded-lg bg-white hover:shadow-xl transition-shadow">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-[#0d2f60] shadow-md"
                  />
                  <CardHeader className="p-0 mb-1">
                    <CardTitle className="text-xl font-bold text-[#0d2f60]">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow">
                    <p className="text-gray-600 text-sm">{member.role}</p>
                  </CardContent>
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
      </motion.main>
      <Footer />
    </div>
  );
};

export default About;