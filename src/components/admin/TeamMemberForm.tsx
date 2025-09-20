import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { TeamMember } from '@/types/supabase';
import ImageUploadField from './ImageUploadField'; // Reusable component for image uploads

const teamMemberFormSchema = z.object({
  name: z.string().min(1, "Team member name is required"),
  role: z.string().min(1, "Role is required"),
  image_url: z.string().url("Must be a valid URL or upload an image").or(z.literal("")).optional(),
});

interface TeamMemberFormProps {
  initialData?: TeamMember;
  onSubmit: (data: Partial<TeamMember>) => Promise<void>;
  isLoading: boolean;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof teamMemberFormSchema>>({
    resolver: zodResolver(teamMemberFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      role: initialData?.role || '',
      image_url: initialData?.image_url || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        role: initialData.role,
        image_url: initialData.image_url || '',
      });
    } else {
      form.reset({
        name: '',
        role: '',
        image_url: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof teamMemberFormSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter team member's name" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Enter role (e.g., Lead Mentor, Programming)" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUploadField
          form={form}
          name="image_url"
          label="Profile Image"
          bucketName="website-images"
          folderPath="team_members"
        />

        <Button type="submit" disabled={isLoading} className="bg-[#d92507] hover:bg-[#b31f06]">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default TeamMemberForm;