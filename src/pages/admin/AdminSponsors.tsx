import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sponsor } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SponsorForm from '@/components/admin/SponsorForm';
import { DataTable } from '@/components/admin/DataTable';
import Spinner from '@/components/Spinner'; // Import Spinner

const AdminSponsors: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | undefined>(undefined);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('amount', { ascending: false });

    if (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to load sponsors.');
      showError('Failed to load sponsors.');
    } else {
      setSponsors(data || []);
    }
    setLoading(false);
  };

  const handleAddSponsor = () => {
    setEditingSponsor(undefined);
    setIsFormOpen(true);
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<Sponsor>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving sponsor...');

    let error;
    if (editingSponsor) {
      ({ error } = await supabase
        .from('sponsors')
        .update(formData)
        .eq('id', editingSponsor.id));
    } else {
      ({ error } = await supabase
        .from('sponsors')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving sponsor:', error);
      showError(`Failed to save sponsor: ${error.message}`);
    } else {
      showSuccess('Sponsor saved successfully!');
      setIsFormOpen(false);
      fetchSponsors();
    }
    setIsSubmitting(false);
  };

  const handleDeleteSponsor = async (id: string) => {
    const toastId = showLoading('Deleting sponsor...');
    const { error } = await supabase
      .from('sponsors')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting sponsor:', error);
      showError(`Failed to delete sponsor: ${error.message}`);
    } else {
      showSuccess('Sponsor deleted successfully!');
      fetchSponsors();
    }
  };

  const sponsorColumns = [
    { key: 'name', header: 'Name' },
    {
      key: 'image_url',
      header: 'Logo',
      render: (sponsor: Sponsor) => (
        sponsor.image_url ? <img src={sponsor.image_url} alt={sponsor.name} className="h-12 w-12 object-contain" /> : 'N/A'
      ),
    },
    { key: 'description', header: 'Description' },
    { key: 'amount', header: 'Amount', render: (sponsor: Sponsor) => `$${sponsor.amount.toLocaleString()}` },
    { key: 'notes', header: 'Notes' },
    {
      key: 'website_url',
      header: 'Website',
      render: (sponsor: Sponsor) => (
        sponsor.website_url ? (
          <a href={sponsor.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[150px] block">
            {new URL(sponsor.website_url).hostname}
          </a>
        ) : 'N/A'
      ),
    },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner text="Loading sponsors..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchSponsors} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Sponsors</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddSponsor} className="bg-[#d92507] hover:bg-[#b31f06]">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Sponsor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}</DialogTitle>
            </DialogHeader>
            <SponsorForm
              initialData={editingSponsor}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={sponsors}
        columns={sponsorColumns}
        onEdit={handleEditSponsor}
        onDelete={handleDeleteSponsor}
        getKey={(sponsor) => sponsor.id}
      />
    </div>
  );
};

export default AdminSponsors;