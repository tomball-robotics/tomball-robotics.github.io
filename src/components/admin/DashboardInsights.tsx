import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Spinner from '@/components/Spinner';
import { Calendar, Handshake, Users, Bot, Award, Images } from 'lucide-react';
import InsightCard from './InsightCard'; // Import the new InsightCard component

const DashboardInsights: React.FC = () => {
  const fetchCount = async (tableName: string) => {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true }); // Use head: true for performance
    if (error) {
      console.error(`Error fetching count for ${tableName}:`, error);
      return 0; // Return 0 on error
    }
    return count || 0;
  };

  const { data: eventCount, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['eventCount'],
    queryFn: () => fetchCount('events'),
  });

  const { data: sponsorCount, isLoading: isLoadingSponsors } = useQuery({
    queryKey: ['sponsorCount'],
    queryFn: () => fetchCount('sponsors'),
  });

  const { data: teamMemberCount, isLoading: isLoadingTeamMembers } = useQuery({
    queryKey: ['teamMemberCount'],
    queryFn: () => fetchCount('team_members'),
  });

  const { data: robotCount, isLoading: isLoadingRobots } = useQuery({
    queryKey: ['robotCount'],
    queryFn: () => fetchCount('robots'),
  });

  const { data: achievementCount, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['achievementCount'],
    queryFn: () => fetchCount('achievements'),
  });

  const { data: slideshowImageCount, isLoading: isLoadingSlideshowImages } = useQuery({
    queryKey: ['slideshowImageCount'],
    queryFn: () => fetchCount('slideshow_images'),
  });

  const isLoadingAny = isLoadingEvents || isLoadingSponsors || isLoadingTeamMembers ||
                       isLoadingRobots || isLoadingAchievements || isLoadingSlideshowImages;

  if (isLoadingAny) {
    return (
      <div className="flex justify-center items-center h-36">
        <Spinner text="Loading insights..." />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <InsightCard
        title="Total Events"
        value={eventCount}
        icon={Calendar}
        isLoading={isLoadingEvents}
      />
      <InsightCard
        title="Total Sponsors"
        value={sponsorCount}
        icon={Handshake}
        isLoading={isLoadingSponsors}
      />
      <InsightCard
        title="Total Team Members"
        value={teamMemberCount}
        icon={Users}
        isLoading={isLoadingTeamMembers}
      />
      <InsightCard
        title="Total Robots"
        value={robotCount}
        icon={Bot}
        isLoading={isLoadingRobots}
      />
      <InsightCard
        title="Total Achievements"
        value={achievementCount}
        icon={Award}
        isLoading={isLoadingAchievements}
      />
      <InsightCard
        title="Total Slideshow Images"
        value={slideshowImageCount}
        icon={Images}
        isLoading={isLoadingSlideshowImages}
      />
    </div>
  );
};

export default DashboardInsights;