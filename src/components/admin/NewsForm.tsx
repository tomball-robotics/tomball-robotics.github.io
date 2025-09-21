import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { NewsArticle } from '@/types/supabase';
import ImageArrayUploadField from './ImageArrayUploadField'; // Import the new component

const newsArticleFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  publish_date: z.string().min(1, "Publish date is required"), // Using string for date input
  content: z.string().min(1, "Content is required"),
  image_urls: z.array(z.string().url("Must be a valid URL")).optional(),
});

interface NewsArticleFormProps {
  initialData?: NewsArticle;
  onSubmit: (data: Partial<NewsArticle>) => Promise<void>;
  isLoading: boolean;
}

const NewsForm: React.FC<NewsArticleFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const form = useForm<z.infer<typeof newsArticleFormSchema>>({
    resolver: zodResolver(newsArticleFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      publish_date: initialData?.publish_date ? new Date(initialData.publish_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      content: initialData?.content || '',
      image_urls: initialData?.image_urls || [],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        publish_date: new Date(initialData.publish_date).toISOString().split('T')[0],
        content: initialData.content,
        image_urls: initialData.image_urls || [],
      });
    } else {
      form.reset({
        title: '',
        publish_date: new Date().toISOString().split('T')[0],
        content: '',
        image_urls: [],
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof newsArticleFormSchema>) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter news article title" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="publish_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publish Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your news article content here (Markdown supported)" {...field} disabled={isLoading} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageArrayUploadField
          form={form}
          name="image_urls"
          label="Images"
          bucketName="website-images"
          folderPath="news_articles"
        />

        <Button type="submit" disabled={isLoading} className="bg-[#d92507] hover:bg-[#b31f06]">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
};

export default NewsForm;