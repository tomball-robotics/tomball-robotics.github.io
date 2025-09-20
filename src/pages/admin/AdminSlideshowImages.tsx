import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SlideshowImage } from '@/types/supabase';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SlideshowImageForm from '@/components/admin/SlideshowImageForm';
import { DataTable } from '@/components/admin/DataTable';

const AdminSlideshowImages: React.FC = () => {
  const [slideshowImages, setSlideshowImages] = useState<SlideshowImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SlideshowImage | undefined>(undefined);

  useEffect(() => {
    fetchSlideshowImages();
  }, []);

  const fetchSlideshowImages = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('slideshow_images')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true }); // Consistent order for same sort_order

    if (error) {
      console.error('Error fetching slideshow images:', error);
      setError('Failed to load slideshow images.');
      showError('Failed to load slideshow images.');
    } else {
      setSlideshowImages(data || []);
    }
    setLoading(false);
  };

  const handleAddImage = () => {
    setEditingImage(undefined);
    setIsFormOpen(true);
  };

  const handleEditImage = (image: SlideshowImage) => {
    setEditingImage(image);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: Partial<SlideshowImage>) => {
    setIsSubmitting(true);
    const toastId = showLoading('Saving slideshow image...');

    let error;
    if (editingImage) {
      // Update existing image
      ({ error } = await supabase
        .from('slideshow_images')
        .update(formData)
        .eq('id', editingImage.id));
    } else {
      // Add new image
      ({ error } = await supabase
        .from('slideshow_images')
        .insert(formData));
    }

    dismissToast(toastId);
    if (error) {
      console.error('Error saving slideshow image:', error);
      showError(`Failed to save slideshow image: ${error.message}`);
    } else {
      showSuccess('Slideshow image saved successfully!');
      setIsFormOpen(false);
      fetchSlideshowImages();
    }
    setIsSubmitting(false);
  };

  const handleDeleteImage = async (id: string) => {
    const toastId = showLoading('Deleting slideshow image...');
    const imageToDelete = slideshowImages.find(img => img.id === id);

    if (imageToDelete && imageToDelete.image_url) {
      // Attempt to delete from storage first
      const pathSegments = imageToDelete.image_url.split('/public/website-images/');
      if (pathSegments.length > 1) {
        const filePathInBucket = pathSegments[1];
        const storageDeleteSuccess = await supabase.storage.from('website-images').remove([filePathInBucket]);
        if (storageDeleteSuccess.error) {
          console.error('Error deleting image from storage:', storageDeleteSuccess.error);
          showError(`Failed to delete image from storage: ${storageDeleteSuccess.error.message}`);
          dismissToast(toastId);
          return; // Stop if storage deletion fails
        }
      }
    }

    const { error } = await supabase
      .from('slideshow_images')
      .delete()
      .eq('id', id);

    dismissToast(toastId);
    if (error) {
      console.error('Error deleting slideshow image:', error);
      showError(`Failed to delete slideshow image: ${error.message}`);
    } else {
      showSuccess('Slideshow image deleted successfully!');
      fetchSlideshowImages();
    }
  };

  const slideshowImageColumns = [
    {
      key: 'image_url',
      header: 'Image',
      render: (image: SlideshowImage) => (
        image.image_url ? <img src={image.image_url} alt="Slideshow" className="h-16 w-24 object-cover rounded-md" /> : 'N/A'
      ),
    },
    { key: 'sort_order', header: 'Sort Order' },
    { key: 'actions', header: 'Actions' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Loading slideshow images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchSlideshowImages} className="mt-4">Retry Loading</Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#0d2f60]">Manage Slideshow Images</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddImage} className="bg-[#d92507] hover:bg-[#b31f06]">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingImage ? 'Edit Slideshow Image' : 'Add New Slideshow Image'}</DialogTitle>
            </DialogHeader>
            <SlideshowImageForm
              initialData={editingImage}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        data={slideshowImages}
        columns={slideshowImageColumns}
        onEdit={handleEditImage}
        onDelete={handleDeleteImage}
        getKey={(image) => image.id}
      />
    </div>
  );
};

export default AdminSlideshowImages;