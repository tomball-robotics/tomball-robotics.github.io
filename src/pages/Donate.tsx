import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SponsorshipTier, WebsiteSettings } from "@/types/supabase"; // Import WebsiteSettings
import Spinner from "@/components/Spinner"; // Import Spinner
import { Helmet } from 'react-helmet-async'; // Import Helmet

const Donate: React.FC = () => {
  const [sponsorshipTiers, setSponsorshipTiers] = useState<SponsorshipTier[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null); // State for website settings
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: tiersData, error: tiersError } = await supabase
        .from("sponsorship_tiers")
        .select("*");

      const { data: settingsData, error: settingsError } = await supabase // Fetch website settings
        .from("website_settings")
        .select("donate_button_text, donate_button_url")
        .limit(1)
        .single();

      if (tiersError) {
        console.error("Error fetching sponsorship tiers:", tiersError);
        setError("Failed to load sponsorship tiers.");
      } else if (settingsError) {
        console.error("Error fetching website settings:", settingsError);
        setError("Failed to load website settings for donate page.");
      } else {
        const sortedTiers = (tiersData || []).sort((a, b) => {
          const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10);
          const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10);
          return priceB - priceA;
        });
        setSponsorshipTiers(sortedTiers);
        setWebsiteSettings(settingsData); // Set website settings
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
          <Spinner text="Loading sponsorship tiers..." />
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

  const donateButtonText = websiteSettings?.donate_button_text || "Donate to Tomball Robotics with PayPal";
  const donateButtonUrl = websiteSettings?.donate_button_url || "https://www.paypal.com/ncp/payment/WRGGJGFCNSYTA";

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Donate & Sponsor - Tomball T3 Robotics</title>
        <meta name="description" content="Become a sponsor of Tomball T3 Robotics, FRC Team 7312, and support STEM education. View our sponsorship tiers and donation options." />
      </Helmet>
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
              key={tier.id}
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
                    {tier.benefits && tier.benefits.map((benefit, i) => (
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
              <a href={donateButtonUrl} target="_blank" rel="noopener noreferrer">
                {donateButtonText}
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