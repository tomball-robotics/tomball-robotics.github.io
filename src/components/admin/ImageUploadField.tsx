import React, { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XCircle, ImageUp } from 'lucide-react'; // Import ImageUp icon
import { uploadFile, deleteFile } from '@/integrations/supabase/storage';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client

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

  const handleConvertToAvif = async () => {
    const currentUrl = form.getValues(name);
    if (!currentUrl) {
      showError("No image URL found to convert.");
      return;
    }

    const url = new URL(currentUrl);
    const pathParts = url.pathname.split('/');
    const originalFileNameWithExtension = pathParts[pathParts.length - 1];
    const originalFileName = originalFileNameWithExtension.split('.').slice(0, -1).join('.');
    const fileExtension = originalFileNameWithExtension.split('.').pop()?.toLowerCase();

    if (fileExtension === 'avif') {
      showSuccess("Image is already in AVIF format.");
      return;
    }

    const confirmConvert = window.confirm("This will convert the current image to AVIF format and update its URL. The original image will remain in storage. Do you want to proceed?");
    if (!confirmConvert) return;

    const toastId = showLoading(`Converting ${label} to AVIF...`);
    try {
      const { data, error } = await supabase.functions.invoke('convert-to-avif', {
        body: JSON.stringify({
          imageUrl: currentUrl,
          bucketName: bucketName,
          folderPath: folderPath,
          originalFileName: originalFileNameWithExtension,
        }),
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.avifUrl) {
        form.setValue(name, data.avifUrl, { shouldValidate: true });
        showSuccess(`${label} successfully converted to AVIF!`);
      } else {
        throw new Error("Conversion failed: No AVIF URL returned.");
      }
    } catch (err: any) {
      console.error("Error converting to AVIF:", err);
      showError(`Failed to convert ${label} to AVIF: ${err.message || 'Unknown error'}`);
    } finally {
      dismissToast(toastId);
    }
  };

  const currentImageUrl = form.watch(name);
  const isAvif = currentImageUrl?.toLowerCase().endsWith('.avif');

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
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500 break-all">Current URL: {field.value}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleConvertToAvif}
                    disabled={form.formState.isSubmitting || !field.value || isAvif}
                    className="ml-2 flex-shrink-0"
                  >
                    <ImageUp className="h-4 w-4 mr-2" />
                    {isAvif ? 'Already AVIF' : 'Convert to AVIF'}
                  </Button>
                </div>
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