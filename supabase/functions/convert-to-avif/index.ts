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
    console.log(`[Edge Function] Downloading image from: ${imageUrl}`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image from ${imageUrl}: ${response.statusText}`);
    }
    const imageBuffer = await response.arrayBuffer(); // Get as ArrayBuffer for potential processing

    // 2. *** ACTUAL AVIF CONVERSION LOGIC GOES HERE ***
    // This is the most challenging part due to Deno's current ecosystem for image processing.
    //
    // Conceptual steps for a real conversion:
    // a. Decode the input image (e.g., JPEG, PNG) from `imageBuffer` into raw pixel data.
    // b. (Optional) Perform any desired resizing, cropping, or other manipulations on the pixel data.
    // c. Encode the raw pixel data into AVIF format, resulting in a new binary buffer.
    //
    // --- Practical Approaches for AVIF Conversion in a Serverless/Edge Environment ---
    //
    // Option A (Recommended for simplicity and robustness): Use a third-party image optimization API.
    //    Instead of doing the conversion directly in this function, you would send the `imageUrl`
    //    to a service like Cloudinary, Imgix, or imgproxy. These services are highly optimized
    //    for image transformations and can return an AVIF version of your image.
    //
    //    Example (conceptual, using a hypothetical external API):
    //    const externalApiUrl = `https://api.imageoptimizer.com/convert?url=${encodeURIComponent(imageUrl)}&format=avif`;
    //    const externalApiResponse = await fetch(externalApiUrl);
    //    if (!externalApiResponse.ok) {
    //      throw new Error('External image conversion failed.');
    //    }
    //    const avifOutputBuffer = await externalApiResponse.arrayBuffer();
    //
    // Option B (Advanced): Integrate a WebAssembly (Wasm) compiled image library.
    //    You could compile a C/C++ image library (like `libavif` or a subset of `ImageMagick`)
    //    to WebAssembly and load/run it within this Deno function. This is a complex setup
    //    involving Wasm compilation, module loading, and careful memory management.
    //
    // --- Current Placeholder Implementation ---
    // For now, the function will simply take the original image buffer and rename its extension
    // to `.avif`. This will NOT actually convert the image data to AVIF format, but it allows
    // the frontend button and URL update logic to function.
    console.warn("[Edge Function] AVIF conversion is currently a placeholder. Actual image processing library integration is required here for true AVIF encoding.");
    const avifOutputBuffer = imageBuffer; // In a real scenario, this would be the AVIF encoded buffer

    const newFileName = originalFileName.split('.').slice(0, -1).join('.') + '.avif';
    const newFilePath = `${folderPath}/${newFileName}`;

    // 3. Upload the (simulated) converted AVIF image
    console.log(`[Edge Function] Uploading AVIF image to: ${bucketName}/${newFilePath}`);
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from(bucketName)
      .upload(newFilePath, avifOutputBuffer, {
        contentType: 'image/avif', // Ensure correct content type for the *intended* AVIF file
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

    console.log(`[Edge Function] AVIF image uploaded. Public URL: ${publicUrlData.publicUrl}`);
    return new Response(JSON.stringify({ avifUrl: publicUrlData.publicUrl }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('[Edge Function] Error in convert-to-avif function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});