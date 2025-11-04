import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageUp } from 'lucide-react';
import { showSuccess, showError, showLoading, dismissToast } from '@/utils/toast';
import { supabase } from '@/integrations/supabase/client';
import {
  NewsArticle, UnitybotResource, UnitybotInitiative, WebsiteSettings,
  Robot, Sponsor, TeamMember, SlideshowImage
} from '@/types/supabase';

interface OptimizeImagesButtonProps {
  onOptimizationComplete?: () => void;
}

const OptimizeImagesButton: React.FC<OptimizeImagesButtonProps> = ({ onOptimizationComplete }) => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const processImage = async (
    imageUrl: string,
    bucketName: string,
    folderPath: string,
    originalFileName: string
  ): Promise<string | null> => {
    if (!imageUrl || imageUrl.toLowerCase().endsWith('.avif')) {
      return imageUrl; // Already AVIF or invalid URL
    }

    try {
      const { data, error } = await supabase.functions.invoke('convert-to-avif', {
        body: JSON.stringify({
          imageUrl,
          bucketName,
          folderPath,
          originalFileName,
        }),
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.avifUrl) {
        return data.avifUrl;
      } else {
        throw new Error("Conversion failed: No AVIF URL returned.");
      }
    } catch (err: any) {
      console.error(`Error converting image ${imageUrl} to AVIF:`, err);
      showError(`Failed to convert image to AVIF: ${originalFileName}. ${err.message || 'Unknown error'}`);
      return null;
    }
  };

  const extractSupabasePathDetails = (url: string, bucket: string) => {
    const pathSegments = url.split(`/public/${bucket}/`);
    if (pathSegments.length > 1) {
      const filePathInBucket = pathSegments[1];
      const fileNameWithExtension = filePathInBucket.split('/').pop() || '';
      const folderPath = filePathInBucket.substring(0, filePathInBucket.length - fileNameWithExtension.length - 1);
      return { folderPath, originalFileName: fileNameWithExtension };
    }
    return null;
  };

  const handleOptimizeAllImages = async () => {
    setIsOptimizing(true);
    const toastId = showLoading('Optimizing all images to AVIF...');
    let overallSuccess = true;
    let convertedCount = 0;
    let skippedCount = 0;

    const imageSources = [
      { table: 'news_articles', field: 'image_urls', isArray: true, bucket: 'website-images', folderPrefix: 'news_articles' },
      { table: 'unitybot_resources', field: 'image_url', isArray: false, bucket: 'website-images', folderPrefix: 'unitybot_resources' },
      { table: 'unitybot_initiatives', field: 'image_url', isArray: false, bucket: 'website-images', folderPrefix: 'unitybot_initiatives' },
      { table: 'website_settings', field: 'hero_background_image', isArray: false, bucket: 'website-images', folderPrefix: 'website_settings/hero_background' },
      { table: 'website_settings', field: 'about_preview_image_url', isArray: false, bucket: 'website-images', folderPrefix: 'website_settings/about_preview' },
      { table: 'robots', field: 'image_url', isArray: false, bucket: 'website-images', folderPrefix: 'robots' },
      { table: 'sponsors', field: 'image_url', isArray: false, bucket: 'website-images', folderPrefix: 'sponsors' },
      { table: 'team_members', field: 'image_url', isArray: false, bucket: 'website-images', folderPrefix: 'team_members' },
      { table: 'slideshow_images', field: 'image_url', isArray: false, bucket: 'website-images', folderPrefix: 'slideshow_images' },
    ];

    for (const source of imageSources) {
      const { data: records, error: fetchError } = await supabase
        .from(source.table)
        .select('id, ' + source.field);

      if (fetchError) {
        console.error(`Error fetching records from ${source.table}:`, fetchError);
        showError(`Failed to fetch images from ${source.table}.`);
        overallSuccess = false;
        continue;
      }

      if (!records || records.length === 0) continue;

      for (const record of records) {
        if (source.isArray) {
          const currentUrls: string[] = record[source.field] || [];
          const newUrls: string[] = [];
          for (const url of currentUrls) {
            if (url && !url.toLowerCase().endsWith('.avif')) {
              const pathDetails = extractSupabasePathDetails(url, source.bucket);
              if (pathDetails) {
                const newUrl = await processImage(url, source.bucket, pathDetails.folderPath, pathDetails.originalFileName);
                if (newUrl) {
                  newUrls.push(newUrl);
                  convertedCount++;
                } else {
                  newUrls.push(url); // Keep original if conversion failed
                  overallSuccess = false;
                }
              } else {
                newUrls.push(url); // Keep original if path details couldn't be extracted
                overallSuccess = false;
              }
            } else {
              newUrls.push(url);
              skippedCount++;
            }
          }
          if (JSON.stringify(currentUrls) !== JSON.stringify(newUrls)) { // Only update if changes were made
            const { error: updateError } = await supabase
              .from(source.table)
              .update({ [source.field]: newUrls })
              .eq('id', record.id);
            if (updateError) {
              console.error(`Error updating ${source.table} record ${record.id}:`, updateError);
              showError(`Failed to update image URLs for ${source.table} record ${record.id}.`);
              overallSuccess = false;
            }
          }
        } else {
          const currentUrl: string | null = record[source.field];
          if (currentUrl && !currentUrl.toLowerCase().endsWith('.avif')) {
            const pathDetails = extractSupabasePathDetails(currentUrl, source.bucket);
            if (pathDetails) {
              const newUrl = await processImage(currentUrl, source.bucket, pathDetails.folderPath, pathDetails.originalFileName);
              if (newUrl) {
                const { error: updateError } = await supabase
                  .from(source.table)
                  .update({ [source.field]: newUrl })
                  .eq('id', record.id);
                if (updateError) {
                  console.error(`Error updating ${source.table} record ${record.id}:`, updateError);
                  showError(`Failed to update image URL for ${source.table} record ${record.id}.`);
                  overallSuccess = false;
                } else {
                  convertedCount++;
                }
              } else {
                overallSuccess = false;
              }
            } else {
              overallSuccess = false;
            }
          } else {
            skippedCount++;
          }
        }
      }
    }

    dismissToast(toastId);
    if (overallSuccess) {
      showSuccess(`All images processed! Converted ${convertedCount}, skipped ${skippedCount}.`);
    } else {
      showError(`Image optimization completed with some errors. Converted ${convertedCount}, skipped ${skippedCount}.`);
    }
    setIsOptimizing(false);
    onOptimizationComplete?.();
  };

  return (
    <Button onClick={handleOptimizeAllImages} disabled={isOptimizing} className="bg-[#0d2f60] hover:bg-[#0a244a]">
      <ImageUp className="mr-2 h-4 w-4" /> {isOptimizing ? 'Optimizing...' : 'Optimize All Images to AVIF'}
    </Button>
  );
};

export default OptimizeImagesButton;