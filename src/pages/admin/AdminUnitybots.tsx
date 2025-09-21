import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UnitybotResource, UnitybotInitiative } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UnitybotResourceForm from '@/components/admin/UnitybotResourceForm';
import UnitybotInitiativeForm from '@/components/admin/UnitybotInitiativeForm';
import { DataTable } from '@/components/admin/DataTable';
import { Separator } from '@/components/ui/separator';
import Spinner from '@/components/Spinner';

const AdminUnitybots: React.FC = () => {
  const [resources, setResources] = useState<UnitybotResource[]>([]);
  const [initiatives, setInitiatives] = useState<UnitybotInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittingResource, setIsSubmittingResource] = useState(false);
  const [isSubmittingInitiative, setIsSubmittingInitiative] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isResourceFormOpen, setIsResourceFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<UnitybotResource | undefined>(undefined);

  const [isInitiativeFormOpen, setIsInitiativeFormOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<UnitybotInitiative | undefined>(undefined);

  useEffect(() => {
    fetchUnitybotData();
  }, []);

  const fetchUnitybotData = async () => {
    setLoading(true);
    setError(null);

    const { data: resourcesData, error: resourcesError } = await supabase
      .from('unitybot_resources')
      .select('*')
      .order('created_at', { ascending: true });

    const { data: initiativesData, error: initiativesError } = await supabase
      .from('unitybot_initiatives')
      .select('*')
      .order('created_at', { ascending: true });

    if (resourcesError) {
      console.error('Error fetching unitybot resources:', resourcesError);
      setError('Failed to load Unitybot resources.');
      showError('Failed to load Unitybot resources.');
    } else {
      setResources(resourcesData || []);
    }

    if (initiativesError) {
      console.error('Error fetching unitybot initiatives:', initiativesError);
      setError('Failed to load Unitybot initiatives.');
      showError('Failed to load Unitybot initiatives.');
    } else {
      setInitiatives(initiativesData || []);
    }
    setLoading(false);
  };

  // --- Resource Handlers ---
  const handleAddResource = () => {
    setEditingResource(undefined);
    setIsResourceFormOpen(true);
  };

  const handleEditResource = (resource: UnitybotResource) => {
    setEditingResource(resource);
    setIsResourceFormOpen(true);
  };

  const handleSubmitResource = async (formData: Partial<UnitybotResource>) => {
    setIsSubmittingResource(true);
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
      setIsResourceFormOpen(false);
      fetchUnitybotData();
    }
    setIsSubmittingResource(false);
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
      fetchUnitybotData();
    }
  };

  // --- Initiative Handlers ---
  const handleAddInitiative = () => {
    setEditingInitiative(undefined);
    setIsInitiativeFormOpen(true);
  };

  const handleEditInitiative = (initiative: UnitybotInitiative) => {
    setEditingInitiative(initiative);
    setIsInitiativeFormOpen(true);
  };

  const handleSubmitInitiative = async (formData: Partial<UnitybotInitiative>) => {
    setIsSubmittingInitiative(true);
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
      setIsInitiativeFormOpen(false);
      fetchUnitybotData();
    }
    setIsSubmittingInitiative(false);
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
      fetchUnitybotData();
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
        <Spinner text="Loading Unitybot content..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchUnitybotData} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg"> {/* Removed max-w-6xl mx-auto */}
      {/* Unitybot Resources Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Unitybot Resources</h2>
          <Dialog open={isResourceFormOpen} onOpenChange={setIsResourceFormOpen}>
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
                onSubmit={handleSubmitResource}
                isLoading={isSubmittingResource}
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

      <Separator className="my-8" />

      {/* Unitybot Initiatives Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Unitybot Initiatives</h2>
          <Dialog open={isInitiativeFormOpen} onOpenChange={setIsInitiativeFormOpen}>
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
                onSubmit={handleSubmitInitiative}
                isLoading={isSubmittingInitiative}
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

export default AdminUnitybots;