
import { supabase } from "./client";
import { toast } from "sonner";

export const ensureBucketsExist = async () => {
  try {
    console.log("Checking if storage buckets exist...");
    
    // Check if buckets exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error listing buckets:", listError);
      toast.error("Failed to check storage buckets. Please try again later.");
      return { data: null, error: listError };
    }
    
    const storyImagesBucketExists = buckets?.some(bucket => bucket.name === 'story_images');
    const homepageImagesBucketExists = buckets?.some(bucket => bucket.name === 'homepage_images');
    
    // Create story_images bucket if it doesn't exist
    if (!storyImagesBucketExists) {
      console.log("Creating 'story_images' bucket...");
      const { error: createError } = await supabase.storage.createBucket('story_images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error("Error creating 'story_images' bucket:", createError);
        // Continue anyway, as the bucket might already exist
      } else {
        console.log("Successfully created 'story_images' bucket");
      }
    } else {
      console.log("Storage bucket 'story_images' found.");
    }
    
    // Create homepage_images bucket if it doesn't exist
    if (!homepageImagesBucketExists) {
      console.log("Creating 'homepage_images' bucket...");
      const { error: createError } = await supabase.storage.createBucket('homepage_images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error("Error creating 'homepage_images' bucket:", createError);
        // Continue anyway, as the bucket might already exist
      } else {
        console.log("Successfully created 'homepage_images' bucket");
      }
    } else {
      console.log("Storage bucket 'homepage_images' found.");
    }
    
    return { data: { buckets }, error: null };
  } catch (error) {
    console.error("Error checking buckets:", error);
    return { data: null, error };
  }
};

// Function to check if a bucket exists
export const checkBucketExists = async (bucketName: string) => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.error("Error checking bucket:", error);
      return false;
    }
    
    return buckets.some(bucket => bucket.name === bucketName);
  } catch (error) {
    console.error("Error checking bucket:", error);
    return false;
  }
};
