import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, bucketName, folderPath, originalFileName } = await req.json();

    if (!imageUrl || !bucketName || !folderPath || !originalFileName) {
      return new Response(JSON.stringify({ error: 'Missing required parameters: imageUrl, bucketName, folderPath, originalFileName' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // 1. Download the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image from ${imageUrl}: ${response.statusText}`);
    }
    const imageBlob = await response.blob();

    // 2. *** Placeholder for AVIF Conversion Logic ***
    // In a real-world scenario, you would integrate a robust image processing library here
    // to convert `imageBlob` to AVIF format.
    // For Deno, this might involve using a WebAssembly-based library or an external service.
    // For now, we'll simulate a conversion by just renaming the file and assuming it's AVIF.
    // This part needs to be replaced with actual conversion code.
    console.warn("AVIF conversion is a placeholder. Implement actual image processing here.");
    const avifBlob = imageBlob; // Simulate conversion: for now, just use the original blob
    // const avifBlob = await convertToAvif(imageBlob); // This function would need to be implemented

    const newFileName = originalFileName.split('.').slice(0, -1).join('.') + '.avif';
    const newFilePath = `${folderPath}/${newFileName}`;

    // 3. Upload the converted AVIF image
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(bucketName)
      .upload(newFilePath, avifBlob, {
        contentType: 'image/avif',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload AVIF image: ${uploadError.message}`);
    }

    // 4. Get the public URL of the new AVIF image
    const { data: publicUrlData, error: publicUrlError } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(newFilePath);

    if (publicUrlError) {
      throw new Error(`Failed to get public URL for AVIF image: ${publicUrlError.message}`);
    }

    return new Response(JSON.stringify({ avifUrl: publicUrlData.publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in convert-to-avif function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});