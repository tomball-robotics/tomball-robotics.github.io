import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, X, Music } from "lucide-react"; // X is for Twitter, Music for TikTok

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d2f60] text-white py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">Tomball T3 Robotics</h3>
          <p className="text-sm">&copy; {new Date().getFullYear()} Team 7312. All rights reserved.</p>
        </div>

        <div className="flex space-x-6">
          {/* Social Media Links */}
          <a
            href="https://www.facebook.com/people/T3-Robotics/100061038300043/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://www.instagram.com/frc7312/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://www.youtube.com/@FRC7312?app=desktop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="YouTube"
          >
            <Youtube size={24} />
          </a>
          <a
            href="https://twitter.com/frc7312"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="X (Twitter)"
          >
            <X size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@t3team7312"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[#d92507] transition-colors"
            aria-label="TikTok"
          >
            <Music size={24} />
          </a>
        </div>

        <div className="text-center md:text-right text-sm space-y-1">
          <p>30330 Quinn Road, Tomball, Texas</p>
          <p>
            <a href="mailto:t3teamad@gmail.com" className="hover:underline">
              t3teamad@gmail.com
            </a>
          </p>
          <Link to="/donate" className="text-[#d92507] hover:underline mt-1 block">Support Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;