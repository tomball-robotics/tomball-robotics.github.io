import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnitybotResource } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UnitybotResourceForm from '@/components/admin/UnitybotResourceForm';
import { DataTable } from '@/components/admin/DataTable';
import Spinner from '@/components/Spinner';

const AdminUnitybotResources: React.FC = () => {
  const [resources, setResources] = useState<UnitybotResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<UnitybotResource | undefined>(undefined);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    setLoading(true);
    setError(null);

    const { data: resourcesData, error: resourcesError } = await supabase
      .from('unitybot_resources')
      .select('*')
      .order('created_at', { ascending: true });

    if (resourcesError) {
      console.error('Error fetching unitybot resources:', resourcesError);
      setError('Failed to load Unitybot resources.');
      showError('Failed to load Unitybot resources.');
    } else {
      setResources(resourcesData || []);
    }
    setLoading(false);
  };

  const handleAddResource = () => {
    setEditingResource(undefined);
    setIsFormOpen(true);
  };

  const handleEditResource = (resource: UnitybotResource) => {
    setEditingResource(resource);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<UnitybotResource>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving Unitybot resource...');

    let error;
    if (editingResource) {
      ({ error } = await supabase
        .from('unitybot_resources')
        .update(formData)
        .eq('id', editingResource.id));
    } else {
      ({ error } = await supabase
        .from('unitybot_resources')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving resource:', error);
      showError(`Failed to save resource: ${error.message}`);
    } else {
      showSuccess('Unitybot resource saved successfully!');
      setIsFormOpen(false);
      fetchResources();
    }
    setIsSubmitting(false);
  };

  const handleDeleteResource = async (id: string) => {
    const toastId = showLoading('Deleting Unitybot resource...');
    const { error } = await supabase
      .from('unitybot_resources')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting resource:', error);
      showError(`Failed to delete resource: ${error.message}`);
    } else {
      showSuccess('Unitybot resource deleted successfully!');
      fetchResources();
    }
  };

  const resourceColumns = [
    { key: 'title', header: 'Title' },
    { key: 'description', header: 'Description' },
    {
      key: 'image_url',
      header: 'Image',
      render: (resource: UnitybotResource) => (
        resource.image_url ? <img src={resource.image_url} alt={resource.title} className="h-12 w-12 object-contain" /> : 'N/A'
      ),
    },
    {
      key: 'links',
      header: 'Links',
      render: (resource: UnitybotResource) => (
        resource.links && resource.links.length > 0 ? (
          <ul className="list-disc list-inside">
            {resource.links.map((link, i) => (
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
        <Spinner text="Loading Unitybot resources..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchResources} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Unitybot Resources</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddResource} className="bg-[#d92507] hover:bg-[#b31f06]">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
              </DialogHeader>
              <UnitybotResourceForm
                initialData={editingResource}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          data={resources}
          columns={resourceColumns}
          onEdit={handleEditResource}
          onDelete={handleDeleteResource}
          getKey={(resource) => resource.id}
        />
      </div>
    </div>
  );
};

export default AdminUnitybotResources;