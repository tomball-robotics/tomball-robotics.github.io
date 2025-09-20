import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Spinner from '@/components/Spinner';
import { Clock } from 'lucide-react';
import { format } = from 'date-fns';

interface LatestUpdateInfo {
  table: string;
  id: string;
  name: string;
  updated_at: Date;
}

const DashboardInsights: React.FC = () => {
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
        name = `${data.year}: ${data.description.substring(0, 50)}${data.description.length > 50 ? '...' : ''}`;
      } else if (tableName === 'slideshow_images') {
        const filename = data.image_url.split('/').pop();
        name = `Slideshow Image (${filename ? decodeURIComponent(filename) : 'N/A'})`;
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
    <div className="flex justify-center w-full"> {/* Centering the card */}
      <Card className="flex flex-col items-center justify-center p-4 text-center h-36 w-full max-w-md"> {/* Added max-w-md for better sizing */}
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