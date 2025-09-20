import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import Spinner from '@/components/Spinner';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  title: string;
  value: number | string | undefined;
  icon: LucideIcon;
  isLoading: boolean;
  className?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, value, icon: Icon, isLoading, className }) => {
  return (
    <Card className={cn("flex flex-col items-center justify-center p-4 text-center", className)}>
      <CardHeader className="p-0 pb-2">
        <Icon className="h-8 w-8 text-[#0d2f60] mb-2" />
        <CardTitle className="text-lg font-semibold text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 py-2">
        {isLoading ? (
          <Spinner size={20} className="h-8" />
        ) : (
          <p className="text-3xl font-bold text-[#d92507]">{value !== undefined ? value : 'N/A'}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default InsightCard;