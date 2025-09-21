import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings, Calendar, Users, Handshake, Bot, Award, DollarSign, Image, Images, Info } from 'lucide-react';

interface DashboardQuickLinksProps {
  onTabChange: (tabValue: string) => void;
}

const quickLinks = [
  { name: 'Website Settings', value: 'website-settings', icon: Settings },
  { name: 'Footer Settings', value: 'footer-settings', icon: Info },
  { name: 'Manage Events', value: 'events', icon: Calendar },
  { name: 'Manage Sponsors', value: 'sponsors', icon: Handshake },
  { name: 'Manage Sponsorship Tiers', value: 'sponsorship-tiers', icon: DollarSign },
  { name: 'Manage Robots', value: 'robots', icon: Bot },
  { name: 'Manage Unitybots', value: 'unitybots', icon: Bot },
  { name: 'Manage Team Members', value: 'team-members', icon: Users },
  { name: 'Manage Achievements', value: 'achievements', icon: Award },
  { name: 'Manage Banners', value: 'banners', icon: Image },
  { name: 'Manage Slideshow Images', value: 'slideshow-images', icon: Images },
];

const DashboardQuickLinks: React.FC<DashboardQuickLinksProps> = ({ onTabChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          className="h-auto p-4 flex flex-col items-start text-left"
          onClick={() => onTabChange(link.value)} // Call onTabChange instead of using Link
        >
          <div className="flex items-center justify-between w-full mb-2">
            <link.icon className="h-6 w-6 text-[#0d2f60]" />
            <ArrowRight className="h-4 w-4 text-gray-500" />
          </div>
          <span className="text-lg font-semibold text-gray-800">{link.name}</span>
        </Button>
      ))}
    </div>
  );
};

export default DashboardQuickLinks;