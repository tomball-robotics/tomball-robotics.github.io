import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Spinner from '@/components/Spinner';
import { Calendar, Users, Handshake, Bot, Award, DollarSign, Image, Images, LayoutDashboard, Link, BookOpen } from 'lucide-react';

interface StatCardProps {
  title: string;
  count: number | undefined;
  icon: React.ElementType;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon: Icon, isLoading }) => (
  <Card className="flex flex-col items-center justify-center p-4 text-center h-36">
    <CardHeader className="p-0 pb-2">
      <Icon className="h-8 w-8 text-[#0d2f60] mb-2" />
      <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {isLoading ? (
        <Spinner size={20} className="h-8" />
      ) : (
        <p className="text-3xl font-bold text-[#d92507]">{count !== undefined ? count : 'N/A'}</p>
      )}
    </CardContent>
  </Card>
);

const DashboardStatsCards: React.FC = () => {
  const fetchCount = async (tableName: string) => {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
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

  const { data: bannerCount, isLoading: isLoadingBanners } = useQuery({
    queryKey: ['bannerCount'],
    queryFn: () => fetchCount('banners'),
  });

  const { data: slideshowImageCount, isLoading: isLoadingSlideshowImages } = useQuery({
    queryKey: ['slideshowImageCount'],
    queryFn: () => fetchCount('slideshow_images'),
  });

  const { data: sponsorshipTierCount, isLoading: isLoadingSponsorshipTiers } = useQuery({
    queryKey: ['sponsorshipTierCount'],
    queryFn: () => fetchCount('sponsorship_tiers'),
  });

  const { data: unitybotResourceCount, isLoading: isLoadingUnitybotResources } = useQuery({
    queryKey: ['unitybotResourceCount'],
    queryFn: () => fetchCount('unitybot_resources'),
  });

  const { data: unitybotInitiativeCount, isLoading: isLoadingUnitybotInitiatives } = useQuery({
    queryKey: ['unitybotInitiativeCount'],
    queryFn: () => fetchCount('unitybot_initiatives'),
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <StatCard title="Total Events" count={eventCount} icon={Calendar} isLoading={isLoadingEvents} />
      <StatCard title="Total Sponsors" count={sponsorCount} icon={Handshake} isLoading={isLoadingSponsors} />
      <StatCard title="Total Team Members" count={teamMemberCount} icon={Users} isLoading={isLoadingTeamMembers} />
      <StatCard title="Total Robots" count={robotCount} icon={Bot} isLoading={isLoadingRobots} />
      <StatCard title="Total Achievements" count={achievementCount} icon={Award} isLoading={isLoadingAchievements} />
      <StatCard title="Total Banners" count={bannerCount} icon={Image} isLoading={isLoadingBanners} />
      <StatCard title="Total Slideshow Images" count={slideshowImageCount} icon={Images} isLoading={isLoadingSlideshowImages} />
      <StatCard title="Total Sponsorship Tiers" count={sponsorshipTierCount} icon={DollarSign} isLoading={isLoadingSponsorshipTiers} />
      <StatCard title="Unitybot Resources" count={unitybotResourceCount} icon={BookOpen} isLoading={isLoadingUnitybotResources} />
      <StatCard title="Unitybot Initiatives" count={unitybotInitiativeCount} icon={Link} isLoading={isLoadingUnitybotInitiatives} />
    </div>
  );
};

export default DashboardStatsCards;