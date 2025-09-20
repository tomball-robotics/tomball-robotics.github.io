import { supabase } from './client';

export const uploadFile = async (bucket: string, filePath: string, file: File): Promise<string | null> => {
  console.log(`[Supabase Storage] Attempting to upload file to bucket: ${bucket}, path: ${filePath}`);
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true, // Overwrite if file exists
  });

  if (error) {
    console.error('[Supabase Storage] Error uploading file:', error.message, error);
    return null;
  }

  // Construct the public URL
  const { data: publicUrlData, error: publicUrlError } = supabase.storage.from(bucket).getPublicUrl(filePath);
  
  if (publicUrlError) {
    console.error('[Supabase Storage] Error getting public URL after upload:', publicUrlError.message, publicUrlError);
    // Even if we can't get the public URL, the file might still be uploaded.
    // For now, we'll return null to indicate failure to get a usable URL.
    return null; 
  }

  console.log(`[Supabase Storage] File uploaded successfully. Public URL: ${publicUrlData.publicUrl}`);
  return publicUrlData.publicUrl;
};

export const deleteFile = async (bucket: string, filePath: string): Promise<boolean> => {
  console.log(`[Supabase Storage] Attempting to delete file from bucket: ${bucket}, path: ${filePath}`);
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    console.error('[Supabase Storage] Error deleting file:', error.message, error);
    return false;
  }
  console.log(`[Supabase Storage] File deleted successfully from bucket: ${bucket}, path: ${filePath}`);
  return true;
};