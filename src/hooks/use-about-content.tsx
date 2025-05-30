
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

export type AboutSection = {
  id: string;
  section_key: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
  displayTitle?: string;
  displayDescription?: string;
  features?: AboutFeature[];
};

export type AboutFeature = {
  id: string;
  section_key: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
  displayTitle?: string;
  displayDescription?: string;
};

export const useAboutContent = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setLoading(true);
        
        // Fetch sections
        const { data: sectionsData, error: sectionsError } = await supabase
          .from('about_sections')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (sectionsError) throw sectionsError;
        
        if (!sectionsData || sectionsData.length === 0) {
          setLoading(false);
          return;
        }
        
        // Fetch features for all sections
        const { data: featuresData, error: featuresError } = await supabase
          .from('about_features')
          .select('*')
          .eq('is_active', true)
          .order('display_order');
          
        if (featuresError) throw featuresError;

        // Map and organize data
        const formattedSections = sectionsData.map(section => {
          // Find features for this section
          const sectionFeatures = featuresData?.filter(
            feature => feature.section_key === section.section_key
          ) || [];
          
          // Format features with display properties for current language
          const formattedFeatures = sectionFeatures.map(feature => ({
            ...feature,
            displayTitle: language === 'tr' ? feature.title_tr : feature.title_en,
            displayDescription: language === 'tr' ? feature.description_tr : feature.description_en
          }));

          // Return section with display properties and features
          return {
            ...section,
            displayTitle: language === 'tr' ? section.title_tr : section.title_en,
            displayDescription: language === 'tr' ? section.description_tr : section.description_en,
            features: formattedFeatures
          };
        });

        setSections(formattedSections);
      } catch (error) {
        console.error("Error fetching about content:", error);
        toast({
          title: "Hata",
          description: "İçerik yüklenirken bir hata oluştu",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, [language, toast]);

  return {
    sections,
    loading,
  };
};
