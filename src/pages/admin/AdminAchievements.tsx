import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Achievement } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AchievementForm from '@/components/admin/AchievementForm';
import { DataTable } from '@/components/admin/DataTable';
import Spinner from '@/components/Spinner';

const AdminAchievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | undefined>(undefined);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('year', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to load achievements.');
      showError('Failed to load achievements.');
    } else {
      setAchievements(data || []);
    }
    setLoading(false);
  };

  const handleAddAchievement = () => {
    setEditingAchievement(undefined);
    setIsFormOpen(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<Achievement>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving achievement...');

    let error;
    if (editingAchievement) {
      ({ error } = await supabase
        .from('achievements')
        .update(formData)
        .eq('id', editingAchievement.id));
    } else {
      ({ error } = await supabase
        .from('achievements')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving achievement:', error);
      showError(`Failed to save achievement: ${error.message}`);
    } else {
      showSuccess('Achievement saved successfully!');
      setIsFormOpen(false);
      fetchAchievements();
    }
    setIsSubmitting(false);
  };

  const handleDeleteAchievement = async (id: string) => {
    const toastId = showLoading('Deleting achievement...');
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting achievement:', error);
      showError(`Failed to delete achievement: ${error.message}`);
    } else {
      showSuccess('Achievement deleted successfully!');
      fetchAchievements();
    }
  };

  const achievementColumns = [
    { key: 'year', header: 'Year' },
    { key: 'description', header: 'Description' },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner text="Loading achievements..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchAchievements} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg"> {/* Removed max-w-6xl mx-auto */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Achievements</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddAchievement} className="bg-[#d92507] hover:bg-[#b31f06]">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>
            </DialogHeader>
            <AchievementForm
              initialData={editingAchievement}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={achievements}
        columns={achievementColumns}
        onEdit={handleEditAchievement}
        onDelete={handleDeleteAchievement}
        getKey={(achievement) => achievement.id}
      />
    </div>
  );
};

export default AdminAchievements;