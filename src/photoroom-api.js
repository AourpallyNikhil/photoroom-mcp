import fetch from 'node-fetch';
    import FormData from 'form-data';

    /**
     * Remove background from an image using Photoroom API
     * @param {string} imageUrl - URL of the image to process
     * @param {Object} options - Options for the API
     * @param {string} options.outputFormat - Output format (png or jpg)
     * @param {string} options.outputType - Output type (cutout, room, or product)
     * @param {boolean} options.crop - Whether to crop the image
     * @param {number} options.scale - Scale factor for the output image
     * @returns {Promise<Object>} - Result object with resultUrl
     */
    export async function removeBackground(imageUrl, options = {}) {
      const apiKey = process.env.PHOTOROOM_API_KEY;
      
      if (!apiKey) {
        throw new Error('PHOTOROOM_API_KEY not found in environment variables');
      }

      const {
        outputFormat = 'png',
        outputType = 'cutout',
        crop = false,
        scale = 1
      } = options;

      try {
        // Fetch the image from the URL
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
        }
        const imageBuffer = await imageResponse.buffer();

        // Create form data
        const formData = new FormData();
        formData.append('image_file', imageBuffer, {
          filename: 'image.jpg',
          contentType: imageResponse.headers.get('content-type')
        });

        // Set API parameters
        const apiUrl = `https://sdk.photoroom.com/v1/segment`;
        const params = new URLSearchParams();
        params.append('format', outputFormat);
        params.append('type', outputType);
        params.append('crop', crop.toString());
        params.append('scale', scale.toString());

        // Make API request
        const response = await fetch(`${apiUrl}?${params.toString()}`, {
          method: 'POST',
          headers: {
            'X-Api-Key': apiKey,
          },
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Photoroom API error (${response.status}): ${errorText}`);
        }

        // For simplicity, we'll convert the image to a data URL
        const resultBuffer = await response.buffer();
        const base64 = resultBuffer.toString('base64');
        const contentType = outputFormat === 'png' ? 'image/png' : 'image/jpeg';
        const resultUrl = `data:${contentType};base64,${base64}`;

        return {
          resultUrl,
          success: true
        };
      } catch (error) {
        console.error('Error in removeBackground:', error);
        throw error;
      }
    }
