import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings, Calendar, Users, Handshake, Bot, Award, DollarSign, Image, Images, Info, Home, Newspaper } from 'lucide-react'; // Added Newspaper icon

interface DashboardQuickLinksProps {
  onTabChange: (mainTabValue: string, subTabValue?: string) => void;
}

const quickLinks = [
  { name: 'Hero Section', mainTab: 'home-page', subTab: 'hero-section', icon: Home },
  { name: 'About Page Preview', mainTab: 'home-page', subTab: 'about-preview', icon: Info },
  { name: 'Events Page Preview', mainTab: 'home-page', subTab: 'events-preview', icon: Calendar },
  { name: 'Sponsors Page Preview', mainTab: 'home-page', subTab: 'sponsors-preview', icon: Handshake },
  { name: 'Award Banners', mainTab: 'home-page', subTab: 'award-banners', icon: Image },
  { name: 'Slideshow Images', mainTab: 'home-page', subTab: 'slideshow-images', icon: Images },
  { name: 'News Articles', mainTab: 'news-page', subTab: 'news-articles', icon: Newspaper },
  { name: 'Team Members', mainTab: 'about-page', subTab: 'team-members', icon: Users },
  { name: 'Achievements', mainTab: 'about-page', subTab: 'achievements', icon: Award },
  { name: 'Events List', mainTab: 'events-page', subTab: 'events-list', icon: Calendar }, // New quick link
  { name: 'Robots List', mainTab: 'robots-page', subTab: 'robots-list', icon: Bot },
  { name: 'Sponsors List', mainTab: 'sponsors-page', subTab: 'sponsors-list', icon: Handshake },
  { name: 'Sponsorship Tiers', mainTab: 'sponsors-page', subTab: 'sponsorship-tiers', icon: DollarSign },
  { name: 'Unitybot Resources', mainTab: 'unitybots-page', subTab: 'unitybot-resources', icon: Bot },
  { name: 'Unitybot Initiatives', mainTab: 'unitybots-page', subTab: 'unitybot-initiatives', icon: Bot },
  { name: 'Footer Settings', mainTab: 'global-settings', subTab: 'footer-settings', icon: Settings },
];

const DashboardQuickLinks: React.FC<DashboardQuickLinksProps> = ({ onTabChange }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            className="h-auto p-4 flex flex-col items-start text-left"
            onClick={() => onTabChange(link.mainTab, link.subTab)}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <link.icon className="h-6 w-6 text-[#0d2f60]" />
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </div>
            <span className="text-lg font-semibold text-gray-800">{link.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DashboardQuickLinks;