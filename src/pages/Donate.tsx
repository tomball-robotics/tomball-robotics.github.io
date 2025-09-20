import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { sponsorshipTiers } from "@/data/sponsorshipTiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Donate: React.FC = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-12 text-center pt-24"
      >
        <h1 className="text-5xl font-extrabold text-[#0d2f60] mb-6">Become a Sponsor</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
          T3 Tomball Robotics is searching for valuable sponsors to help keep our team running. 
          T3 Robotics strives to empower young leaders in the Tomball community and teaches the 
          necessary skills needed for future success.
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {sponsorshipTiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={itemVariants}
              className="flex"
            >
              <Card className="w-full flex flex-col bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow">
                <CardHeader className="p-0 mb-4 text-center">
                  <CardTitle className={`text-3xl font-bold ${tier.color}`}>{tier.name} Tier</CardTitle>
                  <p className="text-2xl font-semibold text-gray-800">{tier.price}</p>
                </CardHeader>
                <CardContent className="p-0 flex-grow text-left">
                  <ul className="space-y-2 text-gray-600">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-gray-100 p-8 rounded-lg shadow-inner max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#d92507] mb-4">Ready to Support Us?</h2>
          <p className="text-gray-700 text-lg mb-6">
            Choose your preferred way to contribute and help us build the future of STEM!
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <Button asChild size="lg" className="bg-[#00457C] hover:bg-[#003057] text-white font-bold py-3 px-6 rounded-lg">
              <a href="https://www.paypal.com/ncp/payment/WRGGJGFCNSYTA" target="_blank" rel="noopener noreferrer">
                Donate with PayPal
              </a>
            </Button>
            <div className="text-center">
              <p className="text-gray-700">For other arrangements, please email:</p>
              <a href="mailto:t3teamad@gmail.com" className="font-semibold text-[#0d2f60] hover:underline">
                t3teamad@gmail.com
              </a>
            </div>
          </div>
          <p className="text-gray-600 mt-8 text-sm">
            Sponsorships update every year on May 31st.
          </p>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Donate;