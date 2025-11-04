import React, { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { uploadFile, deleteFile } from '@/integrations/supabase/storage';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';

interface ImageUploadFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  bucketName: string;
  folderPath: string; // e.g., 'robots' or 'team_members'
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ form, name, label, bucketName, folderPath }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = showLoading(`Uploading ${label}...`);
    const filePath = `${folderPath}/${file.name}`;
    const publicUrl = await uploadFile(bucketName, filePath, file);

    dismissToast(toastId);
    if (publicUrl) {
      form.setValue(name, publicUrl, { shouldValidate: true });
      showSuccess(`${label} uploaded successfully!`);
    } else {
      showError(`Failed to upload ${label}.`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const handleRemoveImage = async () => {
    const currentUrl = form.getValues(name);
    if (!currentUrl) return;

    const confirmRemove = window.confirm("Are you sure you want to remove this image? This will also delete it from Supabase Storage.");
    if (!confirmRemove) return;

    const toastId = showLoading(`Removing ${label}...`);

    // Extract file path from Supabase public URL
    // Example: https://iuxotivoerhdhinhbysj.supabase.co/storage/v1/object/public/website-images/robots/image.jpg
    const pathSegments = currentUrl.split(`/public/${bucketName}/`);
    if (pathSegments.length > 1) {
      const filePathInBucket = pathSegments[1];
      const success = await deleteFile(bucketName, filePathInBucket);

      if (success) {
        form.setValue(name, '', { shouldValidate: true });
        showSuccess(`${label} removed successfully!`);
      } else {
        showError(`Failed to remove ${label} from storage.`);
      }
    } else {
      // If it's not a Supabase URL, just clear the field
      form.setValue(name, '', { shouldValidate: true });
      showSuccess(`${label} URL cleared.`);
    }
    dismissToast(toastId);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {field.value && (
                <div className="relative w-48 h-32 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={field.value}
                    alt={label}
                    className="w-full h-full object-cover"
                    width={192} // w-48 = 192px
                    height={128} // h-32 = 128px
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </div>
              )}
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="cursor-pointer"
                disabled={form.formState.isSubmitting}
              />
              {field.value && (
                <p className="text-sm text-gray-500 break-all mt-2">Current URL: {field.value}</p>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ImageUploadField;