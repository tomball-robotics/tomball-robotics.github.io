import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Instagram, Youtube, X, LogIn, LogOut } from "lucide-react";
import { useSupabase } from "@/components/SessionContextProvider";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteSettings } from "@/types/supabase";

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
        .select('footer_address, footer_email, facebook_url, instagram_url, youtube_url, x_url')
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
  const defaultFacebook = "https://www.facebook.com/people/T3-Robotics/100061038300043/";
  const defaultInstagram = "https://www.instagram.com/frc7312/";
  const defaultYoutube = "https://www.youtube.com/@FRC7312?app=desktop";
  const defaultX = "https://twitter.com/frc7312";

  return (
    <footer className="bg-[#0d2f60] text-white py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">Tomball T3 Robotics</h3>
          <p className="text-sm">&copy; {currentYear} Team 7312. All rights reserved.</p>
        </div>

        <div className="flex space-x-6">
          {/* Social Media Links */}
          <a
            href={footerSettings?.facebook_url || defaultFacebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href={footerSettings?.instagram_url || defaultInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href={footerSettings?.youtube_url || defaultYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="YouTube"
          >
            <Youtube size={24} />
          </a>
          <a
            href={footerSettings?.x_url || defaultX}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="X (Twitter)"
          >
            <X size={24} />
          </a>
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