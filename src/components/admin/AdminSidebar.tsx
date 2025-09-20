import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Calendar, Users, Handshake, Bot, Award, DollarSign, LayoutDashboard, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  { name: 'Events', path: '/admin/events', icon: Calendar },
  { name: 'Sponsors', path: '/admin/sponsors', icon: Handshake },
  { name: 'Sponsorship Tiers', path: '/admin/sponsorship-tiers', icon: DollarSign },
  { name: 'Robots', path: '/admin/robots', icon: Bot },
  { name: 'Unitybots', path: '/admin/unitybots', icon: Bot }, // Added Unitybots link
  { name: 'Team Members', path: '/admin/team-members', icon: Users },
  { name: 'Achievements', path: '/admin/achievements', icon: Award },
  { name: 'Banners', path: '/admin/banners', icon: Image },
];

const AdminSidebar: React.FC = () => {
  const getNavLinkClasses = (isActive: boolean) =>
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
      isActive && "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
    );

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {adminNavLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) => getNavLinkClasses(isActive)}
          end={link.path === '/admin'} // 'end' prop for exact match on dashboard
        >
          <link.icon className="h-4 w-4" />
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminSidebar;