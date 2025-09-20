import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings, Calendar, Users, Handshake, Bot, Award, DollarSign, Image, Images, Info } from 'lucide-react'; // Added Info icon

const quickLinks = [
  { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  { name: 'Footer Settings', path: '/admin/footer', icon: Info }, // New quick link for Footer Settings
  { name: 'Manage Events', path: '/admin/events', icon: Calendar },
  { name: 'Manage Sponsors', path: '/admin/sponsors', icon: Handshake },
  { name: 'Manage Sponsorship Tiers', path: '/admin/sponsorship-tiers', icon: DollarSign },
  { name: 'Manage Robots', path: '/admin/robots', icon: Bot },
  { name: 'Manage Unitybots', path: '/admin/unitybots', icon: Bot },
  { name: 'Manage Team Members', path: '/admin/team-members', icon: Users },
  { name: 'Manage Achievements', path: '/admin/achievements', icon: Award },
  { name: 'Manage Banners', path: '/admin/banners', icon: Image },
  { name: 'Manage Slideshow Images', path: '/admin/slideshow-images', icon: Images },
];

const DashboardQuickLinks: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {quickLinks.map((link) => (
        <Button asChild key={link.name} variant="outline" className="h-auto p-4 flex flex-col items-start text-left">
          <Link to={link.path} className="w-full">
            <div className="flex items-center justify-between w-full mb-2">
              <link.icon className="h-6 w-6 text-[#0d2f60]" />
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </div>
            <span className="text-lg font-semibold text-gray-800">{link.name}</span>
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default DashboardQuickLinks;