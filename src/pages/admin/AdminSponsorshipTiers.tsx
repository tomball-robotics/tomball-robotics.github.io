import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SponsorshipTier } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SponsorshipTierForm from '@/components/admin/SponsorshipTierForm';
import { DataTable } from '@/components/admin/DataTable';

const AdminSponsorshipTiers: React.FC = () => {
  const [sponsorshipTiers, setSponsorshipTiers] = useState<SponsorshipTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<SponsorshipTier | undefined>(undefined);

  useEffect(() => {
    fetchSponsorshipTiers();
  }, []);

  const fetchSponsorshipTiers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('sponsorship_tiers')
      .select('*'); // Fetch without DB sorting, will sort client-side

    if (error) {
      console.error('Error fetching sponsorship tiers:', error);
      setError('Failed to load sponsorship tiers.');
      showError('Failed to load sponsorship tiers.');
    } else {
      // Client-side sort tiers by numeric price in descending order
      const sortedTiers = (data || []).sort((a, b) => {
        const priceA = parseInt(a.price.replace(/[^0-9]/g, ''), 10);
        const priceB = parseInt(b.price.replace(/[^0-9]/g, ''), 10);
        return priceB - priceA;
      });
      setSponsorshipTiers(sortedTiers);
    }
    setLoading(false);
  };

  const handleAddTier = () => {
    setEditingTier(undefined);
    setIsFormOpen(true);
  };

  const handleEditTier = (tier: SponsorshipTier) => {
    setEditingTier(tier);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<SponsorshipTier>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving sponsorship tier...');

    let error;
    if (editingTier) {
      // Update existing tier
      ({ error } = await supabase
        .from('sponsorship_tiers')
        .update(formData)
        .eq('id', editingTier.id));
    } else {
      // Add new tier
      ({ error } = await supabase
        .from('sponsorship_tiers')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving sponsorship tier:', error);
      showError(`Failed to save sponsorship tier: ${error.message}`);
    } else {
      showSuccess('Sponsorship tier saved successfully!');
      setIsFormOpen(false);
      fetchSponsorshipTiers();
    }
    setIsSubmitting(false);
  };

  const handleDeleteTier = async (id: string) => {
    const toastId = showLoading('Deleting sponsorship tier...');
    const { error } = await supabase
      .from('sponsorship_tiers')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting sponsorship tier:', error);
      showError(`Failed to delete sponsorship tier: ${error.message}`);
    } else {
      showSuccess('Sponsorship tier deleted successfully!');
      fetchSponsorshipTiers();
    }
  };

  const sponsorshipTierColumns = [
    { key: 'name', header: 'Name' },
    { key: 'tier_id', header: 'Tier ID' },
    { key: 'price', header: 'Price' },
    {
      key: 'benefits',
      header: 'Benefits',
      render: (tier: SponsorshipTier) => (tier.benefits && tier.benefits.length > 0 ? tier.benefits.join(', ') : 'N/A'),
    },
    { key: 'color', header: 'Color Class' },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading sponsorship tiers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchSponsorshipTiers} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Sponsorship Tiers</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddTier} className="bg-[#d92507] hover:bg-[#b31f06]">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Tier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingTier ? 'Edit Sponsorship Tier' : 'Add New Sponsorship Tier'}</DialogTitle>
            </DialogHeader>
            <SponsorshipTierForm
              initialData={editingTier}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={sponsorshipTiers}
        columns={sponsorshipTierColumns}
        onEdit={handleEditTier}
        onDelete={handleDeleteTier}
        getKey={(tier) => tier.id}
      />
    </div>
  );
};

export default AdminSponsorshipTiers;