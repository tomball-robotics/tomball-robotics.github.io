import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Spinner from '@/components/Spinner';
import { Calendar, Users, Handshake, Bot, Award, Image, DollarSign } from 'lucide-react';

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

const DashboardInsights: React.FC = () => {
  const fetchCount = async (tableName: string) => {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  };

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
    </div>
  );
};

export default DashboardInsights;