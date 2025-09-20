import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Spinner from '@/components/Spinner';
import { Calendar, Users, Handshake, Bot, Award, Image, DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface InsightCardProps {
  title: string;
  count: number | undefined;
  icon: React.ElementType;
  loading: boolean;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, count, icon: Icon, loading }) => (
  <Card className="flex flex-col items-center justify-center p-4 text-center h-36">
    <CardHeader className="p-0 pb-2">
      <Icon className="h-8 w-8 text-[#0d2f60] mb-2" />
      <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {loading ? (
        <Spinner size={20} className="h-8" />
      ) : (
        <p className="text-3xl font-bold text-[#d92507]">{count !== undefined ? count : 'N/A'}</p>
      )}
    </CardContent>
  </Card>
);

interface LatestUpdateInfo {
  table: string;
  id: string;
  name: string;
  updated_at: Date;
}

const DashboardInsights: React.FC = () => {
  const fetchCount = async (tableName: string) => {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  };

  const fetchLatestUpdate = async (tableName: string, displayField: string) => {
    const { data, error } = await supabase
      .from(tableName)
      .select(`id, ${displayField}, updated_at`)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine
      console.error(`Error fetching latest update for ${tableName}:`, error);
      return null;
    }
    if (data) {
      let name = data[displayField];
      if (tableName === 'achievements') {
        name = `${data.year}: ${data.description.substring(0, 30)}${data.description.length > 30 ? '...' : ''}`;
      } else if (tableName === 'slideshow_images') {
        name = `Slideshow Image (${data.image_url.split('/').pop()})`;
      } else if (tableName === 'website_settings') {
        name = 'Website Settings'; // Static name for settings
      }
      return {
        table: tableName,
        id: data.id,
        name: name,
        updated_at: new Date(data.updated_at),
      };
    }
    return null;
  };

  // --- Counts ---
  const { data: eventsCount, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['eventsCount'],
    queryFn: () => fetchCount('events'),
  });

  const { data: sponsorsCount, isLoading: isLoadingSponsors } = useQuery({
    queryKey: ['sponsorsCount'],
    queryFn: () => fetchCount('sponsors'),
  });

  const { data: teamMembersCount, isLoading: isLoadingTeamMembers } = useQuery({
    queryKey: ['teamMembersCount'],
    queryFn: () => fetchCount('team_members'),
  });

  const { data: robotsCount, isLoading: isLoadingRobots } = useQuery({
    queryKey: ['robotsCount'],
    queryFn: () => fetchCount('robots'),
  });

  const { data: unitybotResourcesCount, isLoading: isLoadingUnitybotResources } = useQuery({
    queryKey: ['unitybotResourcesCount'],
    queryFn: () => fetchCount('unitybot_resources'),
  });

  const { data: unitybotInitiativesCount, isLoading: isLoadingUnitybotInitiatives } = useQuery({
    queryKey: ['unitybotInitiativesCount'],
    queryFn: () => fetchCount('unitybot_initiatives'),
  });

  const { data: achievementsCount, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['achievementsCount'],
    queryFn: () => fetchCount('achievements'),
  });

  const { data: bannersCount, isLoading: isLoadingBanners } = useQuery({
    queryKey: ['bannersCount'],
    queryFn: () => fetchCount('banners'),
  });

  const { data: slideshowImagesCount, isLoading: isLoadingSlideshowImages } = useQuery({
    queryKey: ['slideshowImagesCount'],
    queryFn: () => fetchCount('slideshow_images'),
  });

  const { data: sponsorshipTiersCount, isLoading: isLoadingSponsorshipTiers } = useQuery({
    queryKey: ['sponsorshipTiersCount'],
    queryFn: () => fetchCount('sponsorship_tiers'),
  });

  // --- Latest Updates ---
  const { data: latestEvent, isLoading: isLoadingLatestEvent } = useQuery({
    queryKey: ['latestEvent'],
    queryFn: () => fetchLatestUpdate('events', 'name'),
  });
  const { data: latestSponsor, isLoading: isLoadingLatestSponsor } = useQuery({
    queryKey: ['latestSponsor'],
    queryFn: () => fetchLatestUpdate('sponsors', 'name'),
  });
  const { data: latestSponsorshipTier, isLoading: isLoadingLatestSponsorshipTier } = useQuery({
    queryKey: ['latestSponsorshipTier'],
    queryFn: () => fetchLatestUpdate('sponsorship_tiers', 'name'),
  });
  const { data: latestTeamMember, isLoading: isLoadingLatestTeamMember } = useQuery({
    queryKey: ['latestTeamMember'],
    queryFn: () => fetchLatestUpdate('team_members', 'name'),
  });
  const { data: latestRobot, isLoading: isLoadingLatestRobot } = useQuery({
    queryKey: ['latestRobot'],
    queryFn: () => fetchLatestUpdate('robots', 'name'),
  });
  const { data: latestUnitybotResource, isLoading: isLoadingLatestUnitybotResource } = useQuery({
    queryKey: ['latestUnitybotResource'],
    queryFn: () => fetchLatestUpdate('unitybot_resources', 'title'),
  });
  const { data: latestUnitybotInitiative, isLoading: isLoadingLatestUnitybotInitiative } = useQuery({
    queryKey: ['latestUnitybotInitiative'],
    queryFn: () => fetchLatestUpdate('unitybot_initiatives', 'title'),
  });
  const { data: latestAchievement, isLoading: isLoadingLatestAchievement } = useQuery({
    queryKey: ['latestAchievement'],
    queryFn: () => fetchLatestUpdate('achievements', 'description'), // 'description' is used to construct the name
  });
  const { data: latestBanner, isLoading: isLoadingLatestBanner } = useQuery({
    queryKey: ['latestBanner'],
    queryFn: () => fetchLatestUpdate('banners', 'text'),
  });
  const { data: latestSlideshowImage, isLoading: isLoadingLatestSlideshowImage } = useQuery({
    queryKey: ['latestSlideshowImage'],
    queryFn: () => fetchLatestUpdate('slideshow_images', 'image_url'), // 'image_url' is used to construct the name
  });
  const { data: latestWebsiteSettings, isLoading: isLoadingLatestWebsiteSettings } = useQuery({
    queryKey: ['latestWebsiteSettings'],
    queryFn: () => fetchLatestUpdate('website_settings', 'hero_title'), // Using hero_title as a dummy field, name is static
  });

  const allLatestUpdates = [
    latestEvent, latestSponsor, latestSponsorshipTier, latestTeamMember, latestRobot,
    latestUnitybotResource, latestUnitybotInitiative, latestAchievement, latestBanner,
    latestSlideshowImage, latestWebsiteSettings
  ].filter(Boolean) as LatestUpdateInfo[];

  const latestEditedItem = allLatestUpdates.reduce((latest, current) => {
    if (!latest) return current;
    return current.updated_at > latest.updated_at ? current : latest;
  }, null as LatestUpdateInfo | null);

  const isLoadingLatestEditedItem = isLoadingLatestEvent || isLoadingLatestSponsor || isLoadingLatestSponsorshipTier ||
                                   isLoadingLatestTeamMember || isLoadingLatestRobot || isLoadingLatestUnitybotResource ||
                                   isLoadingLatestUnitybotInitiative || isLoadingLatestAchievement || isLoadingLatestBanner ||
                                   isLoadingLatestSlideshowImage || isLoadingLatestWebsiteSettings;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <InsightCard title="Events" count={eventsCount} icon={Calendar} loading={isLoadingEvents} />
      <InsightCard title="Sponsors" count={sponsorsCount} icon={Handshake} loading={isLoadingSponsors} />
      <InsightCard title="Sponsorship Tiers" count={sponsorshipTiersCount} icon={DollarSign} loading={isLoadingSponsorshipTiers} />
      <InsightCard title="Team Members" count={teamMembersCount} icon={Users} loading={isLoadingTeamMembers} />
      <InsightCard title="Robots" count={robotsCount} icon={Bot} loading={isLoadingRobots} />
      <InsightCard title="Achievements" count={achievementsCount} icon={Award} loading={isLoadingAchievements} />
      <InsightCard title="Banners" count={bannersCount} icon={Image} loading={isLoadingBanners} />
      <InsightCard title="Slideshow Images" count={slideshowImagesCount} icon={Image} loading={isLoadingSlideshowImages} />
      <InsightCard title="Unitybot Resources" count={unitybotResourcesCount} icon={Bot} loading={isLoadingUnitybotResources} />
      <InsightCard title="Unitybot Initiatives" count={unitybotInitiativesCount} icon={Bot} loading={isLoadingUnitybotInitiatives} />

      <Card className="flex flex-col items-center justify-center p-4 text-center h-36 col-span-full sm:col-span-2 lg:col-span-2 xl:col-span-2">
        <CardHeader className="p-0 pb-2">
          <Clock className="h-8 w-8 text-[#0d2f60] mb-2" />
          <CardTitle className="text-lg font-semibold text-gray-700">Last Edited Item</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingLatestEditedItem ? (
            <Spinner size={20} className="h-8" />
          ) : latestEditedItem ? (
            <>
              <p className="text-xl font-bold text-[#d92507]">{latestEditedItem.name}</p>
              <p className="text-sm text-gray-600 capitalize">{latestEditedItem.table.replace(/_/g, ' ')}</p>
              <p className="text-xs text-gray-500">{format(latestEditedItem.updated_at, 'PPP p')}</p>
            </>
          ) : (
            <p className="text-lg text-gray-500">No recent edits</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardInsights;