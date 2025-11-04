import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sponsor, SponsorshipTier } from "@/types/supabase";
import Spinner from "@/components/Spinner";
import { Helmet } from 'react-helmet-async'; // Import Helmet

const tierConfig: { [key: string]: { cardClass: string; imageContainerClass: string; showDescription: boolean; showName: boolean; showWebsiteButton: boolean } } = {
  diamond: { cardClass: 'w-full md:w-3/4 lg:w-2/3', imageContainerClass: 'h-64', showDescription: true, showName: true, showWebsiteButton: true },
  sapphire: { cardClass: 'w-full md:w-[calc(50%-1rem)]', imageContainerClass: 'h-56', showDescription: true, showName: true, showWebsiteButton: true },
  platinum: { cardClass: 'w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)]', imageContainerClass: 'h-48', showDescription: true, showName: true, showWebsiteButton: true },
  gold: { cardClass: 'w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.333rem)] lg:w-[calc(25%-1.5rem)]', imageContainerClass: 'h-40', showDescription: false, showName: true, showWebsiteButton: true },
  silver: { cardClass: 'w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(25%-1.5rem)] lg:w-[calc(20%-1.6rem)]', imageContainerClass: 'h-32', showDescription: false, showName: true, showWebsiteButton: false },
  bronze: { cardClass: 'w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(25%-1.5rem)] lg:w-[calc(20%-1.6rem)]', imageContainerClass: 'h-24', showDescription: false, showName: true, showWebsiteButton: false },
};

const MIN_TIER_AMOUNT = 500;

const Sponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorshipTiers, setSponsorshipTiers] = useState<SponsorshipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: sponsorsData, error: sponsorsError } = await supabase
        .from("sponsors")
        .select("*")
        .order("amount", { ascending: false });

      const { data: tiersData, error: tiersError } = await supabase
        .from("sponsorship_tiers")
        .select("*");

      if (sponsorsError) {
        console.error("Error fetching sponsors:", sponsorsError);
        setError("Failed to load sponsors.");
      } else if (tiersError) {
        console.error("Error fetching sponsorship tiers:", tiersError);
        setError("Failed to load sponsorship tiers.");
      } else {
        setSponsors(sponsorsData || []);
        const sortedTiers = (tiersData || []).sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10);
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10);
          return priceB - priceA;
        });
        setSponsorshipTiers(sortedTiers);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const getTierForAmount = (amount: number): SponsorshipTier | null => {
    for (const tier of sponsorshipTiers) {
      const threshold = parseInt(tier.price.replace(/[^0-9]/g, ''), 10);
      if (amount >= threshold) {
        return tier;
      }
    }
    return null;
  };

  const listVariants = {
    visible: { transition: { staggerChildren: 0.1 } },
    hidden: {},
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.8 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <Spinner text="Loading sponsors..." />
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

  const tieredSponsors = sponsors.filter(s => s.amount >= MIN_TIER_AMOUNT);
  const otherSponsors = sponsors.filter(s => s.amount < MIN_TIER_AMOUNT);

  const sponsorsByTier = tieredSponsors.reduce((acc, sponsor) => {
    const tier = getTierForAmount(sponsor.amount);
    if (tier) {
      if (!acc[tier.tier_id]) {
        acc[tier.tier_id] = [];
      }
      acc[tier.tier_id].push(sponsor);
    }
    return acc;
  }, {} as Record<string, Sponsor[]>);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Our Sponsors - Tomball T3 Robotics</title>
        <meta name="description" content="Meet the generous sponsors who support Tomball T3 Robotics, FRC Team 7312, and learn how you can contribute." />
      </Helmet>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-4 py-12 pt-24"
      >
        <h1 className="text-5xl font-extrabold text-[#0d2f60] text-center mb-12">Our Valued Sponsors</h1>

        {sponsorshipTiers.map(tier => {
          const sponsorsInTier = sponsorsByTier[tier.tier_id];
          if (!sponsorsInTier || sponsorsInTier.length === 0) return null;

          const config = tierConfig[tier.tier_id] || tierConfig.gold; // Default to gold style

          return (
            <motion.div
              key={tier.id}
              className="mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className={`text-4xl font-bold text-center mb-8 ${tier.color}`}>
                {tier.name} Sponsors
              </h2>
              <motion.div
                className="flex flex-wrap justify-center items-stretch gap-4"
                variants={listVariants}
              >
                {sponsorsInTier.map(sponsor => (
                  <motion.div
                    key={sponsor.id}
                    variants={itemVariants}
                    className={config.cardClass}
                  >
                    <Card className="h-full flex flex-col items-center text-center p-0 shadow-lg rounded-lg bg-white overflow-hidden">
                      {sponsor.image_url && (
                        <div className={`w-full flex items-center justify-center bg-gray-50 rounded-t-lg border-b-4 border-[#0d2f60] ${config.imageContainerClass}`}>
                          <img
                            src={sponsor.image_url}
                            alt={`Logo for ${sponsor.name}`}
                            className={
                              sponsor.image_fit === 'cover'
                                ? 'w-full h-full object-cover'
                                : 'max-h-full max-w-full object-contain p-4'
                            }
                            width={200} // Example width, adjust as needed
                            height={config.imageContainerClass.includes('h-64') ? 256 : config.imageContainerClass.includes('h-56') ? 224 : config.imageContainerClass.includes('h-48') ? 192 : config.imageContainerClass.includes('h-40') ? 160 : config.imageContainerClass.includes('h-32') ? 128 : 96} // Dynamic height based on class
                            loading="lazy" // Lazy load sponsor images
                          />
                        </div>
                      )}
                      <CardContent className="p-4 pt-2 flex-grow flex flex-col justify-between w-full">
                        <div>
                          {config.showName && (
                            !config.showWebsiteButton && sponsor.website_url ? (
                              <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                <CardTitle className="text-2xl font-bold text-[#d92507] mt-2">{sponsor.name}</CardTitle>
                              </a>
                            ) : (
                              <CardTitle className="text-2xl font-bold text-[#d92507] mt-2">{sponsor.name}</CardTitle>
                            )
                          )}
                          {config.showDescription && sponsor.description && <p className="text-gray-700 mt-2">{sponsor.description}</p>}
                          {config.showDescription && sponsor.notes && <p className="text-gray-500 text-sm mt-2">({sponsor.notes})</p>}
                        </div>
                        {config.showWebsiteButton && sponsor.website_url && (
                          <Button asChild className="mt-4 bg-[#0d2f60] hover:bg-[#0a244a] text-white">
                            <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                              Visit {sponsor.name}'s Website <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Other Sponsors */}
        {otherSponsors.length > 0 && (
          <motion.div
            className="mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-700">
              Other Sponsors
            </h2>
            <motion.div
              className="max-w-4xl mx-auto"
              variants={listVariants}
            >
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
                    {otherSponsors.map((sponsor) => (
                      <motion.div key={sponsor.id} variants={itemVariants} className="text-lg text-gray-800 font-medium">
                        {sponsor.website_url ? (
                          <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="text-[#d92507] hover:underline">
                            {sponsor.name}
                          </a>
                        ) : (
                          sponsor.name
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {sponsors.length === 0 && (
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