import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useSupabase } from '@/components/SessionContextProvider';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard, Settings, Calendar, Users, Handshake, Bot, Award, DollarSign, Image, Images, Info, Home } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminEvents from './admin/AdminEvents';
import AdminSponsors from './admin/AdminSponsors';
import AdminTeamMembers from './admin/AdminTeamMembers';
import AdminSponsorshipTiers from './admin/AdminSponsorshipTiers';
import AdminRobots from './admin/AdminRobots';
import AdminAchievements from './admin/AdminAchievements';
import AdminBanners from './admin/AdminBanners';
import AdminSlideshowImages from './admin/AdminSlideshowImages';
import AdminFooterSettings from './admin/AdminFooterSettings';
import AdminUnitybotResources from './admin/AdminUnitybotResources'; // New import
import AdminUnitybotInitiatives from './admin/AdminUnitybotInitiatives'; // New import
import WebsiteHeroSettingsForm from '@/components/admin/WebsiteHeroSettingsForm'; // New import
import WebsiteAboutPreviewSettingsForm from '@/components/admin/WebsiteAboutPreviewSettingsForm'; // New import
import WebsiteEventsPreviewSettingsForm from '@/components/admin/WebsiteEventsPreviewSettingsForm'; // New import
import WebsiteSponsorsPreviewSettingsForm from '@/components/admin/WebsiteSponsorsPreviewSettingsForm'; // New import
import DashboardQuickLinks from '@/components/admin/DashboardQuickLinks';
import Spinner from '@/components/Spinner';
import { supabase } from '@/integrations/supabase/client';
import { WebsiteSettings } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';


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
  component: (settings?: WebsiteSettings) => React.ReactNode; // Pass settings to relevant forms
}

const adminSections: AdminSection[] = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    component: (onTabChange) => <DashboardQuickLinks onTabChange={onTabChange} />,
    subTabs: []
  },
  {
    value: 'home-page',
    label: 'Home Page Content',
    icon: Home,
    subTabs: [
      { value: 'hero-section', label: 'Hero Section', icon: Image, component: (settings) => settings ? <WebsiteHeroSettingsForm initialData={settings} onSubmit={() => {}} isLoading={false} /> : <Spinner /> },
      { value: 'about-preview', label: 'About Preview', icon: Info, component: (settings) => settings ? <WebsiteAboutPreviewSettingsForm initialData={settings} onSubmit={() => {}} isLoading={false} /> : <Spinner /> },
      { value: 'events-preview', label: 'Events Preview', icon: Calendar, component: (settings) => settings ? <WebsiteEventsPreviewSettingsForm initialData={settings} onSubmit={() => {}} isLoading={false} /> : <Spinner /> },
      { value: 'sponsors-preview', label: 'Sponsors Preview', icon: Handshake, component: (settings) => settings ? <WebsiteSponsorsPreviewSettingsForm initialData={settings} onSubmit={() => {}} isLoading={false} /> : <Spinner /> },
      { value: 'award-banners', label: 'Award Banners', icon: Image, component: () => <AdminBanners /> },
      { value: 'slideshow-images', label: 'Slideshow Images', icon: Images, component: () => <AdminSlideshowImages /> },
    ]
  },
  {
    value: 'about-page',
    label: 'About Page Content',
    icon: Info,
    subTabs: [
      { value: 'team-members', label: 'Team Members', icon: Users, component: () => <AdminTeamMembers /> },
      { value: 'achievements', label: 'Achievements', icon: Award, component: () => <AdminAchievements /> },
    ]
  },
  {
    value: 'events-page',
    label: 'Events Page Content',
    icon: Calendar,
    subTabs: [
      { value: 'events-list', label: 'Events List', icon: Calendar, component: () => <AdminEvents /> },
    ]
  },
  {
    value: 'robots-page',
    label: 'Robots Page Content',
    icon: Bot,
    subTabs: [
      { value: 'robots-list', label: 'Robots List', icon: Bot, component: () => <AdminRobots /> },
    ]
  },
  {
    value: 'sponsors-page',
    label: 'Sponsors Page Content',
    icon: Handshake,
    subTabs: [
      { value: 'sponsors-list', label: 'Sponsors List', icon: Handshake, component: () => <AdminSponsors /> },
      { value: 'sponsorship-tiers', label: 'Sponsorship Tiers', icon: DollarSign, component: () => <AdminSponsorshipTiers /> },
    ]
  },
  {
    value: 'unitybots-page',
    label: 'Unitybots Page Content',
    icon: Bot,
    subTabs: [
      { value: 'unitybot-resources', label: 'Unitybot Resources', icon: Bot, component: () => <AdminUnitybotResources /> },
      { value: 'unitybot-initiatives', label: 'Unitybot Initiatives', icon: Bot, component: () => <AdminUnitybotInitiatives /> },
    ]
  },
  {
    value: 'global-settings',
    label: 'Global Settings',
    icon: Settings,
    subTabs: [
      { value: 'footer-settings', label: 'Footer Settings', icon: Info, component: (settings) => settings ? <AdminFooterSettings initialData={settings} onSubmit={() => {}} isLoading={false} /> : <Spinner /> },
    ]
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
      setActiveSubTab(undefined); // No sub-tab for sections without them (e.g., Dashboard)
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

    if (error) {
      console.error('Error fetching website settings:', error);
      setSettingsError('Failed to load website settings. Please ensure there is exactly one entry in the "website_settings" table.');
      setWebsiteSettings(null);
    } else {
      setWebsiteSettings(data);
    }
    setSettingsLoading(false);
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
      fetchWebsiteSettings(); // Re-fetch to ensure UI is up-to-date
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

  const currentSection = adminSections.find(section => section.value === activeMainTab);
  const currentSubTabComponent = currentSection?.subTabs.find(subTab => subTab.value === activeSubTab)?.component;

  const renderSubpanelContent = () => {
    if (activeMainTab === 'dashboard') {
      return currentSection?.component?.(handleQuickLinkChange);
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
          <p className="text-lg text-gray-600">No website settings found. Please ensure an initial entry exists in your Supabase `website_settings` table.</p>
        </div>
      );
    }

    if (currentSubTabComponent) {
      // For forms that edit WebsiteSettings, pass initialData and onSubmit
      if (['hero-section', 'about-preview', 'events-preview', 'sponsors-preview', 'footer-settings'].includes(activeSubTab!)) {
        const FormComponent = currentSubTabComponent as React.FC<{ initialData: WebsiteSettings, onSubmit: (data: Partial<WebsiteSettings>) => Promise<void>, isLoading: boolean }>;
        return (
          <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <FormComponent initialData={websiteSettings} onSubmit={handleWebsiteSettingsSubmit} isLoading={isSubmittingSettings} />
          </div>
        );
      }
      // For other admin components (e.g., AdminEvents, AdminTeamMembers)
      return currentSubTabComponent(websiteSettings);
    }
    return null;
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
                    {renderSubpanelContent()}
                  </TabsContent>
                </Tabs>
              ) : (
                // Render content directly for sections without sub-tabs (e.g., Dashboard)
                renderSubpanelContent()
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