import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnitybotInitiative } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UnitybotInitiativeForm from '@/components/admin/UnitybotInitiativeForm';
import { DataTable } from '@/components/admin/DataTable';
import Spinner from '@/components/Spinner';

const AdminUnitybotInitiatives: React.FC = () => {
  const [initiatives, setInitiatives] = useState<UnitybotInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<UnitybotInitiative | undefined>(undefined);

  useEffect(() => {
    fetchInitiatives();
  }, []);

  const fetchInitiatives = async () => {
    setLoading(true);
    setError(null);

    const { data: initiativesData, error: initiativesError } = await supabase
      .from('unitybot_initiatives')
      .select('*')
      .order('created_at', { ascending: true });

    if (initiativesError) {
      console.error('Error fetching unitybot initiatives:', initiativesError);
      setError('Failed to load Unitybot initiatives.');
      showError('Failed to load Unitybot initiatives.');
    } else {
      setInitiatives(initiativesData || []);
    }
    setLoading(false);
  };

  const handleAddInitiative = () => {
    setEditingInitiative(undefined);
    setIsFormOpen(true);
  };

  const handleEditInitiative = (initiative: UnitybotInitiative) => {
    setEditingInitiative(initiative);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<UnitybotInitiative>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving Unitybot initiative...');

    let error;
    if (editingInitiative) {
      ({ error } = await supabase
        .from('unitybot_initiatives')
        .update(formData)
        .eq('id', editingInitiative.id));
    } else {
      ({ error } = await supabase
        .from('unitybot_initiatives')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving initiative:', error);
      showError(`Failed to save initiative: ${error.message}`);
    } else {
      showSuccess('Unitybot initiative saved successfully!');
      setIsFormOpen(false);
      fetchInitiatives();
    }
    setIsSubmitting(false);
  };

  const handleDeleteInitiative = async (id: string) => {
    const toastId = showLoading('Deleting Unitybot initiative...');
    const { error } = await supabase
      .from('unitybot_initiatives')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting initiative:', error);
      showError(`Failed to delete initiative: ${error.message}`);
    } else {
      showSuccess('Unitybot initiative deleted successfully!');
      fetchInitiatives();
    }
  };

  const initiativeColumns = [
    { key: 'title', header: 'Title' },
    { key: 'description', header: 'Description' },
    {
      key: 'image_url',
      header: 'Image',
      render: (initiative: UnitybotInitiative) => (
        initiative.image_url ? <img src={initiative.image_url} alt={initiative.title} className="h-12 w-12 object-contain" /> : 'N/A'
      ),
    },
    {
      key: 'links',
      header: 'Links',
      render: (initiative: UnitybotInitiative) => (
        initiative.links && initiative.links.length > 0 ? (
          <ul className="list-disc list-inside">
            {initiative.links.map((link, i) => (
              <li key={i}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link.text}</a></li>
            ))}
          </ul>
        ) : 'N/A'
      ),
    },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner text="Loading Unitybot initiatives..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchInitiatives} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Unitybot Initiatives</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddInitiative} className="bg-[#d92507] hover:bg-[#b31f06]">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Initiative
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingInitiative ? 'Edit Initiative' : 'Add New Initiative'}</DialogTitle>
              </DialogHeader>
              <UnitybotInitiativeForm
                initialData={editingInitiative}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          data={initiatives}
          columns={initiativeColumns}
          onEdit={handleEditInitiative}
          onDelete={handleDeleteInitiative}
          getKey={(initiative) => initiative.id}
        />
      </div>
    </div>
  );
};

export default AdminUnitybotInitiatives;