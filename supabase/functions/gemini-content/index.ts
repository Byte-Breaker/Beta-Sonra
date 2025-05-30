import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API keys to cycle through
const GEMINI_API_KEYS = [
  "AIzaSyCCpXNnmBmEdN00DIk0fa5KlzG50xMR5ws",
  "AIzaSyDot13zZGmAT5JeJ1iqf8QkLL_VdkCXuDU",
  "AIzaSyDApobALV8x9iCYS_5hxGcyd8aLvmdKCq4",
  "AIzaSyARaoisCNKmh_mj2opMcwJ2-HSOiw5grVM",
  "AIzaSyCmyA1j9JQGIqOVOz_f4rIqcP4IJyO8OtI",
  "AIzaSyB62LlvH34UPVJdgicDFgSY3J_j8uMjC94"
];

// Get a random API key from the available ones
function getRandomApiKey() {
  const randomIndex = Math.floor(Math.random() * GEMINI_API_KEYS.length);
  return GEMINI_API_KEYS[randomIndex];
}

// Keep track of failed keys so we don't use them again in the same request session
const failedKeys = new Set();

// Reset failed keys after 10 minutes
setInterval(() => {
  failedKeys.clear();
}, 10 * 60 * 1000);

// Attempt to generate content with multiple API keys if needed
async function generateWithRetry(prompt, maxRetries = 3) {
  let attempts = 0;
  let lastError = null;
  
  while (attempts < maxRetries && failedKeys.size < GEMINI_API_KEYS.length) {
    // Get a key that hasn't failed yet
    let apiKey;
    let keysToTry = GEMINI_API_KEYS.filter(key => !failedKeys.has(key));
    
    if (keysToTry.length === 0) {
      throw new Error("Tüm API anahtarları kota limitine ulaştı. Lütfen daha sonra tekrar deneyin.");
    }
    
    apiKey = keysToTry[Math.floor(Math.random() * keysToTry.length)];
    
    try {
      console.log(`Generating content with API key: ${apiKey.substring(0, 8)}...`);
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      });
      
      const data = await response.json();
      
      // Check for API errors
      if (data.error) {
        console.error("API error:", data.error);
        
        // Check if this is a quota error
        if (data.error.code === 429) {
          failedKeys.add(apiKey);
          throw new Error("API kota sınırı aşıldı");
        }
        
        throw new Error(data.error.message || "API hatası");
      }
      
      // Extract the generated content
      if (data.candidates && data.candidates[0]?.content?.parts) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error("Unexpected API response structure:", data);
        throw new Error("İçerik oluşturulamadı");
      }
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      lastError = error;
      attempts++;
      
      // If we've tried this key and it failed, add to failed keys
      if (error.message.includes("kota") || error.message.includes("quota")) {
        failedKeys.add(apiKey);
      }
    }
  }
  
  // If we've exhausted all attempts
  throw lastError || new Error("İçerik oluşturulamadı, lütfen daha sonra tekrar deneyin");
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { title, category, type, language = "tr" } = await req.json();
    
    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Başlık gereklidir' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Prepare the prompt based on request type and language
    let prompt = '';
    
    if (type === 'seo') {
      if (language === 'tr') {
        prompt = `"${title}" başlıklı${category ? ` "${category}" kategorisindeki` : ''} bir blog yazısı için SEO meta verileri oluştur.
        
        Lütfen aşağıdakileri sağla:
        1. Meta başlık (60 karakterden az)
        2. Meta açıklama (160 karakterden az)
        3. Meta anahtar kelimeler (5-8 ilgili anahtar kelime, virgülle ayrılmış)
        
        Yanıtı aşağıdaki formatta ver:
        META_TITLE: [başlık buraya]
        META_DESCRIPTION: [açıklama buraya]
        META_KEYWORDS: [anahtar kelimeler buraya]`;
      } else {
        prompt = `Generate optimized SEO metadata for a blog post titled "${title}"${category ? ` in the category "${category}"` : ''}.
        
        Please provide:
        1. A meta title (under 60 characters)
        2. A meta description (under 160 characters)
        3. Meta keywords (5-8 relevant keywords, comma separated)
        
        Format the response exactly as follows:
        META_TITLE: [your title here]
        META_DESCRIPTION: [your description here]
        META_KEYWORDS: [your keywords here]`;
      }
      
      console.log(`Generating SEO metadata for title: "${title}" in ${language}`);
    } else {
      // Default to content generation
      if (language === 'tr') {
        prompt = `"${title}" başlıklı${category ? ` "${category}" kategorisinde` : ''} kapsamlı, SEO uyumlu bir blog yazısı yaz.
        
        Blog yazısı şunları içermeli:
        1. İlgi çekici bir giriş
        2. İlgili alt başlıklarla 3-5 ana bölüm
        3. SEO için doğal olarak yerleştirilmiş anahtar kelimeler
        4. 800-1000 kelimelik bir uzunluk
        5. Sonuç paragrafı
        6. Markdown formatında olmalı
        
        Yazıyı bilgilendirici, ilgi çekici ve arama motorları için optimize edilmiş şekilde hazırla.`;
      } else {
        prompt = `Write a comprehensive, SEO-optimized blog post with the title "${title}"${category ? ` in the category "${category}"` : ''}.
        
        The blog post should:
        1. Have an engaging introduction
        2. Include 3-5 main sections with relevant subheadings
        3. Incorporate keywords naturally for SEO
        4. Be around 800-1000 words
        5. End with a conclusion paragraph
        6. Be formatted in Markdown
        
        Make it informative, engaging, and optimized for search engines.`;
      }

      console.log(`Generating content for title: "${title}" in ${language}`);
    }
    
    // Generate content with retry mechanism
    const generatedContent = await generateWithRetry(prompt);
    
    // Process SEO metadata if requested
    if (type === 'seo') {
      const metaData = {
        meta_title: "",
        meta_description: "",
        meta_keywords: ""
      };
      
      // Parse the response to extract meta fields
      const lines = generatedContent.split('\n');
      for (const line of lines) {
        if (line.startsWith('META_TITLE:')) {
          metaData.meta_title = line.replace('META_TITLE:', '').trim();
        } else if (line.startsWith('META_DESCRIPTION:')) {
          metaData.meta_description = line.replace('META_DESCRIPTION:', '').trim();
        } else if (line.startsWith('META_KEYWORDS:')) {
          metaData.meta_keywords = line.replace('META_KEYWORDS:', '').trim();
        }
      }
      
      return new Response(
        JSON.stringify(metaData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }
    
    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Bir hata oluştu" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
