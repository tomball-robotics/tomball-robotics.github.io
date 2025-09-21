import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Achievement, Event } from '@/types/supabase'; // Import Event type
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AchievementForm from '@/components/admin/AchievementForm';
import { DataTable } from '@/components/admin/DataTable';
import Spinner from '@/components/Spinner';
import { Badge } from '@/components/ui/badge'; // Import Badge

interface CombinedAchievement {
  id: string;
  year: string;
  description: string;
  source: 'manual' | 'tba';
  originalManualId?: string; // To link back to the original manual achievement if applicable
  originalEventId?: string; // To link back to the original event if applicable for TBA awards
}

const AdminAchievements: React.FC = () => {
  const [combinedAchievements, setCombinedAchievements] = useState<CombinedAchievement[]>([]);
  const [manualAchievements, setManualAchievements] = useState<Achievement[]>([]); // Keep original manual data for editing
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | undefined>(undefined); // Form expects Achievement type

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setLoading(true);
    setError(null);

    // Fetch manual achievements
    const { data: manualAchievementsData, error: manualError } = await supabase
      .from('achievements')
      .select('*');

    // Fetch events to get TBA awards
    const { data: eventsData, error: eventsError } = await supabase
      .from('events')
      .select('id, event_date, awards');

    if (manualError) {
      console.error('Error fetching manual achievements:', manualError);
      setError('Failed to load manual achievements.');
      showError('Failed to load manual achievements.');
      setLoading(false);
      return;
    }
    if (eventsError) {
      console.error('Error fetching event awards:', eventsError);
      setError('Failed to load event awards.');
      showError('Failed to load event awards.');
      setLoading(false);
      return;
    }

    setManualAchievements(manualAchievementsData || []); // Store original manual data

    const processedManualAchievements: CombinedAchievement[] = (manualAchievementsData || []).map(a => ({
      id: a.id,
      year: a.year,
      description: a.description,
      source: 'manual',
      originalManualId: a.id,
    }));

    const tbaAwards: CombinedAchievement[] = [];
    (eventsData || []).forEach(event => {
      const year = new Date(event.event_date).getFullYear().toString();
      event.awards?.forEach((award, index) => {
        tbaAwards.push({
          id: `${event.id}-${index}-${award.replace(/\s/g, '-')}`, // Create a unique ID for TBA awards
          year: year,
          description: award,
          source: 'tba',
          originalEventId: event.id,
        });
      });
    });

    const combined = [...processedManualAchievements, ...tbaAwards];

    combined.sort((a, b) => {
      const yearA = parseInt(a.year, 10);
      const yearB = parseInt(b.year, 10);
      if (yearA !== yearB) {
        return yearB - yearA;
      }
      return a.description.localeCompare(b.description);
    });

    setCombinedAchievements(combined);
    setLoading(false);
  };

  const handleAddAchievement = () => {
    setEditingAchievement(undefined); // Clear for new entry
    setIsFormOpen(true);
  };

  const handleEditAchievement = (achievement: CombinedAchievement) => {
    if (achievement.source === 'manual') {
      // Find the original manual achievement data to pass to the form
      const originalManualData = manualAchievements.find(a => a.id === achievement.originalManualId);
      setEditingAchievement(originalManualData); // This will be of type Achievement
      setIsFormOpen(true);
    } else {
      showError("TBA-synced awards can only be edited via the 'Events List' section.");
    }
  };

  const handleSubmit = async (formData: Partial<Achievement>) => { // formData is always for manual Achievement
    setIsSubmitting(true);
    const toastId = showLoading('Saving manual achievement...');

    let error;
    if (editingAchievement) { // editingAchievement is of type Achievement
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
      showSuccess('Manual achievement saved successfully!');
      setIsFormOpen(false);
      fetchAchievements();
    }
    setIsSubmitting(false);
  };

  const handleDeleteAchievement = async (id: string) => {
    const achievementToDelete = combinedAchievements.find(a => a.id === id);
    if (!achievementToDelete) return;

    if (achievementToDelete.source === 'manual' && achievementToDelete.originalManualId) {
      const toastId = showLoading('Deleting manual achievement...');
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', achievementToDelete.originalManualId);

      dismissToast(toastId);
      if (error) {
        console.error('Error deleting manual achievement:', error);
        showError(`Failed to delete achievement: ${error.message}`);
      } else {
        showSuccess('Manual achievement deleted successfully!');
        fetchAchievements();
      }
    } else {
      showError("TBA-synced awards cannot be deleted directly from here. Manage them in the 'Events List' section.");
    }
  };

  const achievementColumns = [
    { key: 'year', header: 'Year' },
    { key: 'description', header: 'Description' },
    {
      key: 'source',
      header: 'Source',
      render: (item: CombinedAchievement) => (
        <Badge variant={item.source === 'manual' ? 'default' : 'secondary'}>
          {item.source === 'manual' ? 'Manual' : 'TBA Sync'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: CombinedAchievement) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditAchievement(item)}
            disabled={item.source === 'tba'}
            title={item.source === 'tba' ? "Edit via Events List" : "Edit achievement"}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={item.source === 'tba'}
                title={item.source === 'tba' ? "Delete via Events List" : "Delete achievement"}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
              </DialogHeader>
              <p>This action cannot be undone. This will permanently delete this item.</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={() => handleDeleteAchievement(item.id)}>
                  Continue
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ),
    },
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
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Achievements</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddAchievement} className="bg-[#d92507] hover:bg-[#b31f06]">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Manual Achievement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingAchievement ? 'Edit Manual Achievement' : 'Add New Manual Achievement'}</DialogTitle>
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
          data={combinedAchievements}
          columns={achievementColumns}
          getKey={(item) => item.id}
        />
      </div>
    </div>
  );
};

export default AdminAchievements;