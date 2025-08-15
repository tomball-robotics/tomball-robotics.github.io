import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { teamMembers, achievements } from "@/data/aboutData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About: React.FC = () => {
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
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-[#d92507] mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            Tomball T3 Robotics, FRC Team 7312, is dedicated to inspiring young minds in science, technology,
            engineering, and mathematics (STEM) through participation in the FIRST Robotics Competition.
            We aim to build not just robots, but also future leaders, innovators, and problem-solvers,
            fostering a culture of teamwork, Gracious Professionalism, and Coopertition.
          </p>
        </section>

        {/* Team Members Section */}
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-[#0d2f60] text-center mb-8">Meet the Team</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)]"
              >
                <Card className="h-full flex flex-col items-center justify-center text-center p-6 shadow-lg rounded-lg bg-white">
                  <CardHeader className="p-0 mb-1">
                    <CardTitle className="text-xl font-bold text-[#0d2f60]">{member.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow">
                    <p className="text-gray-600 text-sm">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          {teamMembers.length === 0 && (
            <p className="text-center text-gray-600 text-xl mt-8">No team members to display yet.</p>
          )}
        </section>

        {/* Achievements Section */}
        <section>
          <h2 className="text-4xl font-bold text-[#d92507] text-center mb-8">Our Achievements</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="w-full md:w-[calc(50%-0.75rem)]"
              >
                <Card className="p-5 shadow-lg rounded-lg bg-white flex items-center space-x-4">
                  <div className="flex-shrink-0 text-3xl font-extrabold text-[#0d2f60]">
                    {achievement.year}
                  </div>
                  <div className="flex-grow">
                    <p className="text-lg text-gray-700">{achievement.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          {achievements.length === 0 && (
            <p className="text-center text-gray-600 text-xl mt-8">No achievements to display yet.</p>
          )}
        </section>
      </motion.main>
      <Footer />
    </div>
  );
};

export default About;