import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Youtube, X, LogIn, LogOut, Linkedin, Github, Globe } from "lucide-react";
import { useSupabase } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteSettings, SocialMediaLink } from "@/types/supabase";

// Map social media types to Lucide icons
const socialMediaIcons: { [key: string]: React.ElementType } = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  x: X,
  linkedin: Linkedin,
  github: Github,
  website: Globe,
  custom: Globe, // Default icon for custom or unknown types
};

const Footer: React.FC = () => {
  const { session, supabase: clientSupabase } = useSupabase(); // Renamed supabase to clientSupabase to avoid conflict
  const navigate = useNavigate();
  const [footerSettings, setFooterSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('website_settings')
        .select('footer_address, footer_email, social_media_links') // Select the new column
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching footer settings:', error);
        // Fallback to default values or handle error gracefully
      } else {
        setFooterSettings(data);
      }
      setLoading(false);
    };

    fetchFooterSettings();
  }, []);

  const handleLogout = async () => {
    await clientSupabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <footer className="bg-[#0d2f60] text-white py-8 mt-auto text-center">
        <p className="text-sm">Loading footer...</p>
      </footer>
    );
  }

  const currentYear = new Date().getFullYear();
  const defaultAddress = "30330 Quinn Road, Tomball, Texas";
  const defaultEmail = "t3teamad@gmail.com";

  // Default social media links if none are configured in Supabase
  const defaultSocialMediaLinks: SocialMediaLink[] = [
    { type: 'facebook', url: "https://www.facebook.com/people/T3-Robotics/100061038300043/" },
    { type: 'instagram', url: "https://www.instagram.com/frc7312/" },
    { type: 'youtube', url: "https://www.youtube.com/@FRC7312?app=desktop" },
    { type: 'x', url: "https://twitter.com/frc7312" },
  ];

  const socialLinksToRender = footerSettings?.social_media_links && footerSettings.social_media_links.length > 0
    ? footerSettings.social_media_links
    : defaultSocialMediaLinks;

  return (
    <footer className="bg-[#0d2f60] text-white py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">Tomball T3 Robotics</h3>
          <p className="text-sm">&copy; {currentYear} Team 7312. All rights reserved.</p>
        </div>

        <div className="flex space-x-6 justify-center"> {/* Added justify-center here */}
          {socialLinksToRender.map((link, index) => {
            const Icon = socialMediaIcons[link.type] || socialMediaIcons.custom;
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#d92507] transition-colors flex items-center justify-center" // Added flex items-center justify-center here
                aria-label={link.type}
              >
                <Icon size={24} />
              </a>
            );
          })}
        </div>

        <div className="text-center md:text-right text-sm space-y-1">
          <p>{footerSettings?.footer_address || defaultAddress}</p>
          <p>
            <a href={`mailto:${footerSettings?.footer_email || defaultEmail}`} className="hover:underline">
              {footerSettings?.footer_email || defaultEmail}
            </a>
          </p>
          <Link to="/donate" className="text-[#d92507] hover:underline mt-1 block">Support Us</Link>
          {session ? (
            <button onClick={handleLogout} className="text-[#d92507] hover:underline mt-1 block w-full text-center md:text-right">
              <LogOut className="inline-block h-4 w-4 mr-1" /> Logout
            </button>
          ) : (
            <Link to="/login" className="text-[#d92507] hover:underline mt-1 block">
              <LogIn className="inline-block h-4 w-4 mr-1" /> Login
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;