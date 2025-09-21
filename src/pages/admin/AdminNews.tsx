import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsArticle } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NewsForm from '@/components/admin/NewsForm';
import { DataTable } from '@/components/admin/DataTable';
import Spinner from '@/components/Spinner';

const AdminNews: React.FC = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | undefined>(undefined);

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const fetchNewsArticles = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('publish_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching news articles:', error);
      setError('Failed to load news articles.');
      showError('Failed to load news articles.');
    } else {
      setNewsArticles(data || []);
    }
    setLoading(false);
  };

  const handleAddArticle = () => {
    setEditingArticle(undefined);
    setIsFormOpen(true);
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<NewsArticle>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving news article...');

    let error;
    if (editingArticle) {
      ({ error } = await supabase
        .from('news_articles')
        .update(formData)
        .eq('id', editingArticle.id));
    } else {
      ({ error } = await supabase
        .from('news_articles')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving news article:', error);
      showError(`Failed to save news article: ${error.message}`);
    } else {
      showSuccess('News article saved successfully!');
      setIsFormOpen(false);
      fetchNewsArticles();
    }
    setIsSubmitting(false);
  };

  const handleDeleteArticle = async (id: string) => {
    const toastId = showLoading('Deleting news article...');
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting news article:', error);
      showError(`Failed to delete news article: ${error.message}`);
    } else {
      showSuccess('News article deleted successfully!');
      fetchNewsArticles();
    }
  };

  const newsArticleColumns = [
    { key: 'title', header: 'Title' },
    {
      key: 'publish_date',
      header: 'Date',
      render: (article: NewsArticle) => new Date(article.publish_date).toLocaleDateString(),
    },
    {
      key: 'content',
      header: 'Content Preview',
      render: (article: NewsArticle) => (
        <p className="max-w-xs truncate">{article.content}</p>
      ),
    },
    {
      key: 'image_urls',
      header: 'Images',
      render: (article: NewsArticle) => (
        article.image_urls && article.image_urls.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {article.image_urls.map((url, i) => (
              <img key={i} src={url} alt={`Image ${i + 1}`} className="h-12 w-12 object-cover rounded-md" />
            ))}
          </div>
        ) : 'N/A'
      ),
    },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner text="Loading news articles..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchNewsArticles} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#0d2f60]">Manage News Articles</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddArticle} className="bg-[#d92507] hover:bg-[#b31f06]">
                <PlusCircle className="mr-2 h-4 w-4" /> Add News Article
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>{editingArticle ? 'Edit News Article' : 'Add New News Article'}</DialogTitle>
              </DialogHeader>
              <NewsForm
                initialData={editingArticle}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
        <DataTable
          data={newsArticles}
          columns={newsArticleColumns}
          onEdit={handleEditArticle}
          onDelete={handleDeleteArticle}
          getKey={(article) => article.id}
        />
      </div>
    </div>
  );
};

export default AdminNews;