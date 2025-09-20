import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Banner } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import BannerForm from '@/components/admin/BannerForm';
import { DataTable } from '@/components/admin/DataTable';

const AdminBanners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>(undefined);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('year', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching banners:', error);
      setError('Failed to load banners.');
      showError('Failed to load banners.');
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  const handleAddBanner = () => {
    setEditingBanner(undefined);
    setIsFormOpen(true);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<Banner>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving banner...');

    let error;
    if (editingBanner) {
      // Update existing banner
      ({ error } = await supabase
        .from('banners')
        .update(formData)
        .eq('id', editingBanner.id));
    } else {
      // Add new banner
      ({ error } = await supabase
        .from('banners')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving banner:', error);
      showError(`Failed to save banner: ${error.message}`);
    } else {
      showSuccess('Banner saved successfully!');
      setIsFormOpen(false);
      fetchBanners();
    }
    setIsSubmitting(false);
  };

  const handleDeleteBanner = async (id: string) => {
    const toastId = showLoading('Deleting banner...');
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting banner:', error);
      showError(`Failed to delete banner: ${error.message}`);
    } else {
      showSuccess('Banner deleted successfully!');
      fetchBanners();
    }
  };

  const bannerColumns = [
    { key: 'year', header: 'Year' },
    { key: 'text', header: 'Text' },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading banners...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchBanners} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Banners</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddBanner} className="bg-[#d92507] hover:bg-[#b31f06]">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
            </DialogHeader>
            <BannerForm
              initialData={editingBanner}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={banners}
        columns={bannerColumns}
        onEdit={handleEditBanner}
        onDelete={handleDeleteBanner}
        getKey={(banner) => banner.id}
      />
    </div>
  );
};

export default AdminBanners;