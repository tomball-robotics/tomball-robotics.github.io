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

const MIN_TIER_AMOUNT = 500; // Define the threshold for "Other Sponsors"

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
        .order("amount", { ascending: false }); // Order by amount for tiering

      const { data: tiersData, error: tiersError } = await supabase
        .from("sponsorship_tiers")
        .select("*"); // Fetch without DB sorting, will sort client-side

      if (sponsorsError) {
        console.error("Error fetching sponsors:", sponsorsError);
        setError("Failed to load sponsors.");
      } else if (tiersError) {
        console.error("Error fetching sponsorship tiers:", tiersError);
        setError("Failed to load sponsorship tiers.");
      } else {
        setSponsors(sponsorsData || []);
        // Client-side sort tiers by numeric price in descending order
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
    for (const tier of sponsorshipTiers) {
      // Extract numeric value from price string (e.g., "$50,000" -> 50000)
      const threshold = parseInt(tier.price.replace(/[^0-9]/g, ''), 10);
      if (amount >= threshold) {
        return tier.tier_id;
      }
    }
    return ""; // Default if no tier matches
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

  const renderSponsors = (filteredSponsors: Sponsor[], sectionTitle: string, titleColorClass: string) => {
    if (filteredSponsors.length === 0) return null;

    return (
      <motion.div
        className="mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className={`text-4xl font-bold text-center mb-8 ${titleColorClass}`}>
          {sectionTitle}
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
              <Card className="h-full flex flex-col items-center text-center p-0 shadow-lg rounded-lg bg-white overflow-hidden">
                {sponsor.image_url && (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-t-lg border-b-4 border-[#0d2f60]"> {/* Removed p-4 here */}
                    <img
                      src={sponsor.image_url}
                      alt={sponsor.name}
                      className={
                        sponsor.image_fit === 'cover'
                          ? 'w-full h-full object-cover'
                          : 'max-h-full max-w-full object-contain p-4' // Added p-4 here for 'contain' only
                      }
                    />
                  </div>
                )}
                <CardHeader className="p-4 text-center">
                  <CardTitle className="text-2xl font-bold text-[#d92507]">{sponsor.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow flex flex-col justify-between">
                  <div>
                    {sponsor.description && <p className="text-gray-700">{sponsor.description}</p>}
                    {sponsor.notes && <p className="text-gray-500 text-sm mt-2">({sponsor.notes})</p>}
                  </div>
                  {sponsor.website_url && (
                    <Button asChild className="mt-4 bg-[#0d2f60] hover:bg-[#0a244a] text-white">
                      <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer">
                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 pt-24 text-center">
          <p className="text-lg text-gray-600">Loading sponsors...</p>
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

  // Separate sponsors into tiered and other
  const tieredSponsors = sponsors.filter(s => s.amount >= MIN_TIER_AMOUNT);
  const otherSponsors = sponsors.filter(s => s.amount < MIN_TIER_AMOUNT);

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

        {tierOrder.map(tierId => {
          const filteredSponsors = tieredSponsors.filter(s => getTierForAmount(s.amount) === tierId);
          const tierName = sponsorshipTiers.find(t => t.tier_id === tierId)?.name || tierId;
          return renderSponsors(filteredSponsors, `${tierName} Sponsors`, tierStyles[tierId]);
        })}

        {renderSponsors(otherSponsors, "Other Sponsors", "text-gray-700")}

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