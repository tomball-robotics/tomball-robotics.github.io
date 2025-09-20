import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TeamMemberForm from '@/components/admin/TeamMemberForm';
import { DataTable } from '@/components/admin/DataTable';
import Spinner from '@/components/Spinner'; // Import Spinner

const AdminTeamMembers: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | undefined>(undefined);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching team members:', error);
      setError('Failed to load team members.');
      showError('Failed to load team members.');
    } else {
      setTeamMembers(data || []);
    }
    setLoading(false);
  };

  const handleAddTeamMember = () => {
    setEditingTeamMember(undefined);
    setIsFormOpen(true);
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<TeamMember>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving team member...');

    let error;
    if (editingTeamMember) {
      ({ error } = await supabase
        .from('team_members')
        .update(formData)
        .eq('id', editingTeamMember.id));
    } else {
      ({ error } = await supabase
        .from('team_members')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving team member:', error);
      showError(`Failed to save team member: ${error.message}`);
    } else {
      showSuccess('Team member saved successfully!');
      setIsFormOpen(false);
      fetchTeamMembers();
    }
    setIsSubmitting(false);
  };

  const handleDeleteTeamMember = async (id: string) => {
    const toastId = showLoading('Deleting team member...');
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting team member:', error);
      showError(`Failed to delete team member: ${error.message}`);
    } else {
      showSuccess('Team member deleted successfully!');
      fetchTeamMembers();
    }
  };

  const teamMemberColumns = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
    {
      key: 'image_url',
      header: 'Image',
      render: (member: TeamMember) => (
        member.image_url ? <img src={member.image_url} alt={member.name} className="h-12 w-12 object-cover rounded-full" /> : 'N/A'
      ),
    },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner text="Loading team members..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchTeamMembers} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Team Members</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddTeamMember} className="bg-[#d92507] hover:bg-[#b31f06]">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
            </DialogHeader>
            <TeamMemberForm
              initialData={editingTeamMember}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={teamMembers}
        columns={teamMemberColumns}
        onEdit={handleEditTeamMember}
        onDelete={handleDeleteTeamMember}
        getKey={(member) => member.id}
      />
    </div>
  );
};

export default AdminTeamMembers;