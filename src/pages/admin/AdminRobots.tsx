import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Robot } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RobotForm from '@/components/admin/RobotForm';
import { DataTable } from '@/components/admin/DataTable';

const AdminRobots: React.FC = () => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRobot, setEditingRobot] = useState<Robot | undefined>(undefined);

  useEffect(() => {
    fetchRobots();
  }, []);

  const fetchRobots = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('robots')
      .select('*')
      .order('year', { ascending: false });

    if (error) {
      console.error('Error fetching robots:', error);
      setError('Failed to load robots.');
      showError('Failed to load robots.');
    } else {
      setRobots(data || []);
    }
    setLoading(false);
  };

  const handleAddRobot = () => {
    setEditingRobot(undefined);
    setIsFormOpen(true);
  };

  const handleEditRobot = (robot: Robot) => {
    setEditingRobot(robot);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<Robot>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving robot...');

    let error;
    if (editingRobot) {
      // Update existing robot
      ({ error } = await supabase
        .from('robots')
        .update(formData)
        .eq('id', editingRobot.id));
    } else {
      // Add new robot
      ({ error } = await supabase
        .from('robots')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving robot:', error);
      showError(`Failed to save robot: ${error.message}`);
    } else {
      showSuccess('Robot saved successfully!');
      setIsFormOpen(false);
      fetchRobots();
    }
    setIsSubmitting(false);
  };

  const handleDeleteRobot = async (id: string) => {
    const toastId = showLoading('Deleting robot...');
    const { error } = await supabase
      .from('robots')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting robot:', error);
      showError(`Failed to delete robot: ${error.message}`);
    } else {
      showSuccess('Robot deleted successfully!');
      fetchRobots();
    }
  };

  const robotColumns = [
    { key: 'name', header: 'Name' },
    { key: 'year', header: 'Year' },
    {
      key: 'image_url',
      header: 'Image',
      render: (robot: Robot) => (
        robot.image_url ? <img src={robot.image_url} alt={robot.name} className="h-12 w-12 object-cover" /> : 'N/A'
      ),
    },
    { key: 'specs', header: 'Specifications' },
    { key: 'awards', header: 'Awards' },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading robots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchRobots} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Robots</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddRobot} className="bg-[#d92507] hover:bg-[#b31f06]">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Robot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingRobot ? 'Edit Robot' : 'Add New Robot'}</DialogTitle>
            </DialogHeader>
            <RobotForm
              initialData={editingRobot}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={robots}
        columns={robotColumns}
        onEdit={handleEditRobot}
        onDelete={handleDeleteRobot}
        getKey={(robot) => robot.id}
      />
    </div>
  );
};

export default AdminRobots;