import React from 'react';
import DashboardInsights from '@/components/admin/DashboardInsights';
import DashboardQuickLinks from '@/components/admin/DashboardQuickLinks';
import { Separator } from '@/components/ui/separator';

const AdminDashboardContent: React.FC = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#0d2f60]">Dashboard Overview</h2>
      
      <section>
        <h3 className="text-2xl font-semibold text-[#d92507] mb-4">Key Insights</h3>
        <DashboardInsights />
      </section>

      <Separator />

      <section>
        <h3 className="text-2xl font-semibold text-[#0d2f60] mb-4">Quick Links</h3>
        <DashboardQuickLinks />
      </section>
    </div>
  );
};

export default AdminDashboardContent;