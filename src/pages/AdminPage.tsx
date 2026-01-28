import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSupabase } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Settings, Calendar, Users, Handshake, Bot, Award, DollarSign, Image, Images, Info, Home, Newspaper, BookOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminSponsors from './admin/AdminSponsors';
import AdminTeamMembers from './admin/AdminTeamMembers';
import AdminSponsorshipTiers from './admin/AdminSponsorshipTiers';
import AdminRobots from './admin/AdminRobots';
import AdminAchievements from './admin/AdminAchievements';
import AdminBanners from './admin/AdminBanners';
import AdminSlideshowImages from './admin/AdminSlideshowImages';
import AdminFooterSettings from './admin/AdminFooterSettings';
import AdminUnitybotResources from './admin/AdminUnitybotResources';
import AdminUnitybotInitiatives from './admin/AdminUnitybotInitiatives';
import AdminNews from './admin/AdminNews';
import AdminEvents from './admin/AdminEvents';
import WebsiteHeroSettingsForm from '@/components/admin/WebsiteHeroSettingsForm';
import WebsiteAboutPreviewSettingsForm from '@/components/admin/WebsiteAboutPreviewSettingsForm';
import WebsiteEventsPreviewSettingsForm from '@/components/admin/WebsiteEventsPreviewSettingsForm';
import WebsiteSponsorsPreviewSettingsForm from '@/components/admin/WebsiteSponsorsPreviewSettingsForm';
import WebsiteCalendarSettingsForm from '@/components/admin/WebsiteCalendarSettingsForm';
import WebsiteDonateSettingsForm from '@/components/admin/WebsiteDonateSettingsForm'; // Import new form
import DashboardQuickLinks from '@/components/admin/DashboardQuickLinks';
import RefreshTBAButton from '@/components/admin/RefreshTBAButton';
import Spinner from '@/components/Spinner';
import { supabase } from '@/integrations/supabase/client';
import { WebsiteSettings } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AdminHelpAndDocs from './admin/AdminHelpAndDocs';
import { Helmet } from 'react-helmet-async';


interface AdminSection {
  value: string;
  label: string;
  icon: React.ElementType;
  subTabs: AdminSubTab[];
  component?: (onTabChange: (mainTab: string, subTab?: string) => void) => React.ReactNode;
}

interface AdminSubTab {
  value: string;
  label: string;
  icon: React.ElementType;
  // The component function now only needs to return the JSX,
  // as the props will be explicitly passed in renderContent
  component: React.FC<{ initialData?: WebsiteSettings, onSubmit?: (data: Partial<WebsiteSettings>) => Promise<void>, isLoading?: boolean }>;
}

const adminSections: AdminSection[] = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    component: (onTabChange) => (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-[#0d2f60]">Welcome to the Admin Dashboard!</h2>
        <p className="text-lg text-gray-700">Use the links below to manage your website content.</p>
        
        <Card className="p-6 shadow-md">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-[#0d2f60]">Event Data Synchronization</CardTitle>
            <CardDescription className="text-gray-700 mt-2">
              This button synchronizes your website's event data with The Blue Alliance (TBA). It fetches all past and current event details, including competition results, team rankings, alliance status, and awards for Team 7312. Existing event data in your database will be replaced with the latest information from TBA, ensuring your Events page and About page achievements are always up-to-date.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <RefreshTBAButton onRefreshComplete={() => console.log('TBA refresh completed from dashboard.')} />
          </CardContent>
        </Card>

        <DashboardQuickLinks onTabChange={onTabChange} />
      </div>
    ),
    subTabs: []
  },
  {
    value: 'home-page',
    label: 'Home',
    icon: Home,
    subTabs: [
      { value: 'hero-section', label: 'Hero Section', icon: Image, component: WebsiteHeroSettingsForm },
      { value: 'about-preview', label: 'About Preview', icon: Info, component: WebsiteAboutPreviewSettingsForm },
      { value: 'events-preview', label: 'Events Preview', icon: Calendar, component: WebsiteEventsPreviewSettingsForm },
      { value: 'sponsors-preview', label: 'Sponsors Preview', icon: Handshake, component: WebsiteSponsorsPreviewSettingsForm },
      { value: 'award-banners', label: 'Award Banners', icon: Image, component: AdminBanners },
      { value: 'slideshow-images', label: 'Slideshow Images', icon: Images, component: AdminSlideshowImages },
      { value: 'calendar-settings', label: 'Calendar Settings', icon: Calendar, component: WebsiteCalendarSettingsForm },
    ]
  },
  {
    value: 'about-page',
    label: 'About',
    icon: Info,
    subTabs: [
      { value: 'team-members', label: 'Team Members', icon: Users, component: AdminTeamMembers },
      { value: 'achievements', label: 'Achievements', icon: Award, component: AdminAchievements },
    ]
  },
  {
    value: 'events-page',
    label: 'Events',
    icon: Calendar,
    subTabs: [
      { value: 'events-list', label: 'Events List', icon: Calendar, component: AdminEvents },
    ]
  },
  {
    value: 'robots-page',
    label: 'Robots',
    icon: Bot,
    subTabs: [
      { value: 'robots-list', label: 'Robots List', icon: Bot, component: AdminRobots },
    ]
  },
  {
    value: 'sponsors-page',
    label: 'Sponsors',
    icon: Handshake,
    subTabs: [
      { value: 'sponsors-list', label: 'Sponsors List', icon: Handshake, component: AdminSponsors },
      { value: 'sponsorship-tiers', label: 'Sponsorship Tiers', icon: DollarSign, component: AdminSponsorshipTiers },
    ]
  },
  {
    value: 'unitybots-page',
    label: 'Unitybots',
    icon: Bot,
    subTabs: [
      { value: 'unitybot-resources', label: 'Unitybot Resources', icon: Bot, component: AdminUnitybotResources },
      { value: 'unitybot-initiatives', label: 'Unitybot Initiatives', icon: Bot, component: AdminUnitybotInitiatives },
    ]
  },
  {
    value: 'news-page',
    label: 'News',
    icon: Newspaper,
    subTabs: [
      { value: 'news-articles', label: 'News Articles', icon: Newspaper, component: AdminNews },
    ]
  },
  {
    value: 'global-settings',
    label: 'Settings',
    icon: Settings,
    subTabs: [
      { value: 'footer-settings', label: 'Footer Settings', icon: Info, component: AdminFooterSettings },
      { value: 'donate-page-settings', label: 'Donate Page Settings', icon: DollarSign, component: WebsiteDonateSettingsForm }, // New sub-tab
    ]
  },
  {
    value: 'help-docs',
    label: 'Help & Docs',
    icon: BookOpen,
    component: () => <AdminHelpAndDocs />,
    subTabs: []
  },
];

const AdminPage: React.FC = () => {
  const { supabase: clientSupabase } = useSupabase();
  const navigate = useNavigate();
  const [activeMainTab, setActiveMainTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [isSubmittingSettings, setIsSubmittingSettings] = useState(false);


  useEffect(() => {
    fetchWebsiteSettings();
  }, []);

  // Effect to set initial sub-tab when main tab changes
  useEffect(() => {
    const currentSection = adminSections.find(section => section.value === activeMainTab);
    if (currentSection && currentSection.subTabs.length > 0 && !activeSubTab) {
      setActiveSubTab(currentSection.subTabs[0].value);
    } else if (currentSection && currentSection.subTabs.length === 0) {
      setActiveSubTab(undefined); // No sub-tab for sections without them (e.g., Dashboard, Help & Docs)
    }
  }, [activeMainTab, activeSubTab]);


  const fetchWebsiteSettings = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code === 'PGRST116') { // No rows found
      console.warn('No website settings found. Initializing default settings.');
      await initializeDefaultWebsiteSettings();
    } else if (error) {
      console.error('Error fetching website settings:', error);
      setSettingsError('Failed to load website settings. Please ensure there is exactly one entry in the "website_settings" table.');
      setWebsiteSettings(null);
    } else {
      setWebsiteSettings(data);
    }
    setSettingsLoading(false);
  };

  const initializeDefaultWebsiteSettings = async () => {
    const defaultSettings: Partial<WebsiteSettings> = {
      hero_title: "Welcome to Tomball Robotics",
      hero_subtitle: "Building the future of STEM, one robot at a time.",
      hero_background_image: "/images/general/hero-background.jpeg",
      about_preview_title: "About Our Team",
      about_preview_description: "Tomball T3 Robotics, FRC Team 7312, is dedicated to inspiring young minds in science, technology, engineering, and mathematics (STEM) through participation in the FIRST Robotics Competition.",
      about_preview_image_url: "/images/general/indexcollage.jpg",
      events_preview_title: "Our Latest Events",
      events_preview_description: "Discover our recent competitions, awards, and community outreach activities.",
      sponsors_preview_title: "Our Valued Sponsors",
      sponsors_preview_description: "We are grateful for the generous support of our sponsors who make our mission possible.",
      footer_address: "30330 Quinn Road, Tomball, Texas",
      footer_email: "t3teamad@gmail.com",
      social_media_links: [
        { type: 'facebook', url: "https://www.facebook.com/people/T3-Robotics/100061038300043/" },
        { type: 'instagram', url: "https://www.instagram.com/frc7312/" },
        { type: 'youtube', url: "https://www.youtube.com/@FRC7312?app=desktop" },
        { type: 'x', url: "https://twitter.com/frc7312" },
      ],
      calendar_embed_url: "https://calendar.google.com/calendar/embed?src=c_1c19550a800e65db313120e4fbd5f807a1a4ee37818794cefd2f920ca14dbf7b%40group.calendar.google.com&ctz=America%2FChicago", // Default calendar URL
      donate_button_text: "Donate to Tomball Robotics with PayPal", // Default donate button text
      donate_button_url: "https://www.paypal.com/ncp/payment/WRGGJGFCNSYTA", // Default donate button URL
    };

    const toastId = showLoading('Initializing default website settings...');
    const { data, error } = await supabase
      .from('website_settings')
      .insert([defaultSettings])
      .select()
      .single();

    dismissToast(toastId);
    if (error) {
      console.error('Error inserting default website settings:', error);
      showError(`Failed to initialize default settings: ${error.message}`);
      setSettingsError('Failed to initialize default website settings.');
    } else {
      showSuccess('Default website settings initialized!');
      setWebsiteSettings(data);
    }
  };

  const handleWebsiteSettingsSubmit = async (formData: Partial<WebsiteSettings>) => {
    setIsSubmittingSettings(true);
    const toastId = showLoading('Saving website settings...');

    if (!websiteSettings) {
      showError('No settings found to update. Please ensure an initial entry exists and is correctly fetched.');
      dismissToast(toastId);
      setIsSubmittingSettings(false);
      return;
    }

    const { error } = await supabase
      .from('website_settings')
      .update(formData)
      .eq('id', websiteSettings.id);

    dismissToast(toastId);
    if (error) {
      console.error('Error updating website settings:', error);
      showError(`Failed to save website settings: ${error.message}`);
    } else {
      showSuccess('Website settings saved successfully!');
      await fetchWebsiteSettings(); // Re-fetch to ensure UI is up-to-date
    }
    setIsSubmittingSettings(false);
  };

  const handleMainTabChange = (value: string) => {
    setActiveMainTab(value);
    const section = adminSections.find(s => s.value === value);
    if (section && section.subTabs.length > 0) {
      setActiveSubTab(section.subTabs[0].value);
    } else {
      setActiveSubTab(undefined);
    }
  };

  const handleQuickLinkChange = (mainTabValue: string, subTabValue?: string) => {
    setActiveMainTab(mainTabValue);
    setActiveSubTab(subTabValue);
  };

  const handleLogout = async () => {
    await clientSupabase.auth.signOut();
    navigate('/login');
  };

  const renderContent = () => {
    const currentSection = adminSections.find(section => section.value === activeMainTab);
    const currentSubTab = currentSection?.subTabs.find(subTab => subTab.value === activeSubTab);

    if (activeMainTab === 'dashboard') {
      return currentSection?.component?.(handleQuickLinkChange);
    }

    if (activeMainTab === 'help-docs') {
      return <AdminHelpAndDocs />;
    }

    if (settingsLoading) {
      return <Spinner text="Loading website settings..." />;
    }

    if (settingsError) {
      return (
        <div className="text-center p-4">
          <p className="text-lg text-red-600">{settingsError}</p>
          <Button onClick={fetchWebsiteSettings} className="mt-4">Retry Loading</Button>
        </div>
      );
    }

    if (!websiteSettings) {
      return (
        <div className="text-center p-4">
          <p className="text-lg text-gray-600 mb-4">No website settings found. Please ensure an initial entry exists in your Supabase `website_settings` table.</p>
          <Button onClick={initializeDefaultWebsiteSettings} className="bg-[#d92507] hover:bg-[#b31f06]">
            Initialize Website Settings
          </Button>
        </div>
      );
    }

    if (currentSubTab) {
      const ComponentToRender = currentSubTab.component;
      
      // Check if the component is one of the WebsiteSettings forms
      const isWebsiteSettingsForm = [
        WebsiteHeroSettingsForm,
        WebsiteAboutPreviewSettingsForm,
        WebsiteEventsPreviewSettingsForm,
        WebsiteSponsorsPreviewSettingsForm,
        WebsiteCalendarSettingsForm,
        WebsiteDonateSettingsForm, // Include new form here
        AdminFooterSettings, // AdminFooterSettings also uses WebsiteSettings
      ].includes(ComponentToRender as any); // Using 'any' for type comparison

      if (isWebsiteSettingsForm) {
        return (
          <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <ComponentToRender
              initialData={websiteSettings}
              onSubmit={handleWebsiteSettingsSubmit}
              isLoading={isSubmittingSettings}
            />
          </div>
        );
      } else {
        // For other admin components that manage their own data (e.g., AdminTeamMembers, AdminNews)
        return <ComponentToRender />;
      }
    }

    return null;
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Admin Panel - Tomball T3 Robotics</title>
        <meta name="description" content="Manage website content for Tomball T3 Robotics, FRC Team 7312." />
      </Helmet>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-4xl font-extrabold text-[#0d2f60]">Admin Panel</h1>
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        <Tabs value={activeMainTab} onValueChange={handleMainTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto flex-wrap justify-start mb-4">
            {adminSections.map((section) => (
              <TabsTrigger key={section.value} value={section.value} className="flex items-center gap-2 p-2">
                <section.icon className="h-4 w-4" />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {adminSections.map((section) => (
            <TabsContent key={section.value} value={section.value} className="mt-0">
              {section.subTabs.length > 0 ? (
                <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto flex-wrap justify-start mb-4">
                    {section.subTabs.map((subTab) => (
                      <TabsTrigger key={subTab.value} value={subTab.value} className="flex items-center gap-2 p-2">
                        <subTab.icon className="h-4 w-4" />
                        {subTab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value={activeSubTab || ''} className="mt-0">
                    {renderContent()}
                  </TabsContent>
                </Tabs>
              ) : (
                renderContent()
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;