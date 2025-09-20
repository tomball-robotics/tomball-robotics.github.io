import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { sponsorsData } from "@/data/sponsorsData";
import { sponsorshipTiers } from "@/data/sponsorshipTiers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Sponsors: React.FC = () => {
  const tierOrder = ["diamond", "sapphire", "platinum", "gold", "silver", "bronze"];
  const tierStyles: { [key: string]: string } = {
    diamond: "text-cyan-400",
    sapphire: "text-blue-500",
    platinum: "text-slate-400",
    gold: "text-yellow-500",
    silver: "text-gray-500",
    bronze: "text-orange-700",
  };

  // Helper function to determine tier from amount
  const getTierForAmount = (amount: number): string => {
    // sponsorshipTiers is already sorted from highest to lowest price
    for (const tier of sponsorshipTiers) {
      const threshold = parseInt(tier.price.replace(/[^0-9]/g, ''), 10);
      if (amount >= threshold) {
        return tier.tierId;
      }
    }
    return "";
  };

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

  const renderSponsorsByTier = (tier: string) => {
    const filteredSponsors = sponsorsData.filter(s => getTierForAmount(s.amount) === tier);
    if (filteredSponsors.length === 0) return null;

    return (
      <motion.div
        className="mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className={`text-4xl font-bold text-center mb-8 ${tierStyles[tier]}`}>
          {tier.charAt(0).toUpperCase() + tier.slice(1)} Sponsors
        </h2>
        <motion.div
          className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto"
          variants={listVariants}
        >
          {filteredSponsors.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              variants={itemVariants}
              className="w-full sm:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2.666rem)]"
            >
              <Card className="h-full flex flex-col items-center text-center p-6 shadow-lg rounded-lg bg-white">
                <img
                  src={sponsor.imageUrl}
                  alt={sponsor.name}
                  className="w-32 h-32 object-contain mb-4"
                />
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-2xl font-bold text-[#d92507]">{sponsor.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <p className="text-gray-700">{sponsor.description}</p>
                  {sponsor.notes && <p className="text-gray-500 text-sm mt-2">({sponsor.notes})</p>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    );
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
        <h1 className="text-5xl font-extrabold text-[#0d2f60] text-center mb-12">Our Valued Sponsors</h1>

        {tierOrder.map(tier => renderSponsorsByTier(tier))}

        {sponsorsData.length === 0 && (
          <p className="text-center text-gray-600 text-xl mt-8">
            We are actively seeking sponsors for the current season. 
            Your support can make a huge difference!
          </p>
        )}

        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-4">
            Interested in becoming a sponsor and supporting the next generation of STEM leaders?
          </p>
          <Link
            to="/donate"
            className="inline-block bg-[#d92507] hover:bg-[#b31f06] text-white text-lg px-8 py-3 rounded-full transition-colors"
          >
            Learn How to Support Us
          </Link>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Sponsors;