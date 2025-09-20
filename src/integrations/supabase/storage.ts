import { supabase } from './client';

export const uploadFile = async (bucket: string, filePath: string, file: File): Promise<string | null> => {
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: '3600',
    upsert: true, // Overwrite if file exists
  });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  // Construct the public URL
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return publicUrlData.publicUrl;
};

export const deleteFile = async (bucket: string, filePath: string): Promise<boolean> => {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }
  return true;
};