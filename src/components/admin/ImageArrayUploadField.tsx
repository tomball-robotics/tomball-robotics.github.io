import React, { useRef } from 'react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle, ImageUp } from 'lucide-react'; // Import ImageUp icon
import { uploadFile, deleteFile } from '@/integrations/supabase/storage';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client

interface ImageArrayUploadFieldProps {
  form: UseFormReturn<any>;
  name: string; // e.g., 'image_urls'
  label: string; // e.g., 'Images'
  bucketName: string;
  folderPath: string; // e.g., 'news_articles'
}

const ImageArrayUploadField: React.FC<ImageArrayUploadFieldProps> = ({ form, name, label, bucketName, folderPath }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = showLoading(`Uploading ${label} image...`);
    const filePath = `${folderPath}/${file.name}`;
    const publicUrl = await uploadFile(bucketName, filePath, file);

    dismissToast(toastId);
    if (publicUrl) {
      form.setValue(`${name}.${index}`, publicUrl, { shouldValidate: true });
      showSuccess(`${label} image uploaded successfully!`);
    } else {
      showError(`Failed to upload ${label} image.`);
    }
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = ''; // Clear the file input
    }
  };

  const handleRemoveImage = async (index: number) => {
    const currentUrl = form.getValues(`${name}.${index}`);
    if (!currentUrl) {
      remove(index); // Just remove from form if no URL
      return;
    }

    const confirmRemove = window.confirm("Are you sure you want to remove this image? This will also delete it from Supabase Storage.");
    if (!confirmRemove) return;

    const toastId = showLoading(`Removing ${label} image...`);

    // Extract file path from Supabase public URL
    const pathSegments = currentUrl.split(`/public/${bucketName}/`);
    if (pathSegments.length > 1) {
      const filePathInBucket = pathSegments[1];
      const success = await deleteFile(bucketName, filePathInBucket);

      if (success) {
        remove(index);
        showSuccess(`${label} image removed successfully!`);
      } else {
        showError(`Failed to remove ${label} image from storage.`);
      }
    } else {
      // If it's not a Supabase URL, just clear the field
      remove(index);
      showSuccess(`${label} URL cleared.`);
    }
    dismissToast(toastId);
  };

  const handleConvertToAvif = async (index: number) => {
    const currentUrl = form.getValues(`${name}.${index}`);
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

    const toastId = showLoading(`Converting ${label} image to AVIF...`);
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
        form.setValue(`${name}.${index}`, data.avifUrl, { shouldValidate: true });
        showSuccess(`${label} image successfully converted to AVIF!`);
      } else {
        throw new Error("Conversion failed: No AVIF URL returned.");
      }
    } catch (err: any) {
      console.error("Error converting to AVIF:", err);
      showError(`Failed to convert ${label} image to AVIF: ${err.message || 'Unknown error'}`);
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <div className="space-y-4">
        {fields.map((field, index) => {
          const currentImageUrl = form.watch(`${name}.${index}`);
          const isAvif = currentImageUrl?.toLowerCase().endsWith('.avif');

          return (
            <div key={field.id} className="flex flex-col sm:flex-row items-end sm:items-center gap-2 p-3 border rounded-md bg-gray-50">
              <div className="flex-grow w-full">
                {currentImageUrl && (
                  <div className="relative w-full h-32 mb-2 rounded-md overflow-hidden border border-gray-200">
                    <img
                      src={currentImageUrl}
                      alt={`${label} ${index + 1}`}
                      className="w-full h-full object-cover"
                      width={400} // Example width, adjust as needed
                      height={128} // h-32 = 128px
                    />
                  </div>
                )}
                <FormField
                  control={form.control}
                  name={`${name}.${index}`}
                  render={({ field: itemField }) => (
                    <FormControl>
                      <Input
                        type="file"
                        ref={(el) => (fileInputRefs.current[index] = el)}
                        onChange={(e) => handleFileUpload(e, index)}
                        className="cursor-pointer"
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                  )}
                />
                {currentImageUrl && (
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500 break-all">Current URL: {currentImageUrl}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleConvertToAvif(index)}
                      disabled={form.formState.isSubmitting || !currentImageUrl || isAvif}
                      className="ml-2 flex-shrink-0"
                    >
                      <ImageUp className="h-4 w-4 mr-2" />
                      {isAvif ? 'Already AVIF' : 'Convert to AVIF'}
                    </Button>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveImage(index)}
                disabled={form.formState.isSubmitting}
                className="flex-shrink-0"
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          );
        })}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append('')} // Append an empty string for a new image slot
          disabled={form.formState.isSubmitting}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add {label.toLowerCase().slice(0, -1)}
        </Button>
      </div>
      <FormMessage />
    </FormItem>
  );
};

export default ImageArrayUploadField;