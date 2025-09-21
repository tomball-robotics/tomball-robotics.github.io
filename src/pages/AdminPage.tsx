import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSupabase } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Settings, Calendar, Users, Handshake, Bot, Award, DollarSign, Image, Images, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminWebsiteSettings from './admin/AdminWebsiteSettings';
import AdminEvents from './admin/AdminEvents';
import AdminSponsors from './admin/AdminSponsors';
import AdminTeamMembers from './admin/AdminTeamMembers';
import AdminSponsorshipTiers from './admin/AdminSponsorshipTiers';
import AdminRobots from './admin/AdminRobots';
import AdminUnitybots from './admin/AdminUnitybots';
import AdminAchievements from './admin/AdminAchievements';
import AdminBanners from './admin/AdminBanners';
import AdminSlideshowImages from './admin/AdminSlideshowImages';
import AdminFooterSettings from './admin/AdminFooterSettings';
import DashboardQuickLinks from '@/components/admin/DashboardQuickLinks';

const adminTabs = [
  { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: <DashboardQuickLinks /> },
  { value: 'website-settings', label: 'Website Settings', icon: Settings, component: <AdminWebsiteSettings /> },
  { value: 'footer-settings', label: 'Footer Settings', icon: Info, component: <AdminFooterSettings /> },
  { value: 'events', label: 'Events', icon: Calendar, component: <AdminEvents /> },
  { value: 'sponsors', label: 'Sponsors', icon: Handshake, component: <AdminSponsors /> },
  { value: 'sponsorship-tiers', label: 'Sponsorship Tiers', icon: DollarSign, component: <AdminSponsorshipTiers /> },
  { value: 'robots', label: 'Robots', icon: Bot, component: <AdminRobots /> },
  { value: 'unitybots', label: 'Unitybots', icon: Bot, component: <AdminUnitybots /> },
  { value: 'team-members', label: 'Team Members', icon: Users, component: <AdminTeamMembers /> },
  { value: 'achievements', label: 'Achievements', icon: Award, component: <AdminAchievements /> },
  { value: 'banners', label: 'Banners', icon: Image, component: <AdminBanners /> },
  { value: 'slideshow-images', label: 'Slideshow Images', icon: Images, component: <AdminSlideshowImages /> },
];

const AdminPage: React.FC = () => {
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard'); // Default active tab

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-[#0d2f60]">Admin Panel</h1>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 h-auto flex-wrap justify-start">
            {adminTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2 p-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {adminTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;