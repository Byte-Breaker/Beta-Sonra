import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { HomepageContent } from "@/types/blog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SketchfabEmbed from "@/components/design/SketchfabEmbed";

// No direct import of @google/model-viewer
// The model-viewer script should be loaded in HTML
// We're using our local type definition from src/types/model-viewer.d.ts

interface HeroSettings extends Partial<HomepageContent> {
  customer_count?: number;
  rating_value?: number;
  rating_count?: number;
  show_ratings?: boolean;
  image_url?: string | null;
  model_url?: string | null;
  sketchfab_id?: string | null;
}

const HeroSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [content, setContent] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [is3DSupported, setIs3DSupported] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if WebGL is supported for 3D models
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    setIs3DSupported(!!gl);
  }, []);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("homepage_content")
          .select("*")
          .eq("section", "hero")
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (data) {
          setContent(data as HeroSettings);
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  const title = content
    ? language === "tr"
      ? content.title_tr
      : content.title_en
    : t("hero_title") || "Premium Toptancılar İçin Formalar";

  const description = content
    ? language === "tr"
      ? content.description_tr
      : content.description_en
    : t("hero_description") ||
      "Toptan dağıtım için tasarlanmış özel forma koleksiyonumuzu keşfedin. Modern tasarım araçlarımızla envanterinizi özelleştirin.";

  const customerCount = content?.customer_count || 2000;
  const ratingValue = content?.rating_value || 4.9;
  const ratingCount = content?.rating_count || 5;
  const showRatings = content?.show_ratings !== undefined ? content.show_ratings : true;

  const profileImages = [
    "https://lh3.googleusercontent.com/a-/ALV-UjUJZI0913EvwBZLcBpzt-5n3SuVOeguBY3dJRsxMXOmIE2pXISu=s120-c-rp-mo-br100",
    "https://lh3.googleusercontent.com/a-/ALV-UjXg4zWa0wCnfcFDMFRRnfqtJ2X_uwPc4MZCeIrtRU4Ygv3kThcl=s120-c-rp-mo-br100",
    "https://lh3.googleusercontent.com/a-/ALV-UjU7MqiQMJWbikumzamS4RzKy85rjebBObphBrMwYT872sP97ow=s120-c-rp-mo-br100",
    "https://lh3.googleusercontent.com/a-/ALV-UjWgiePys3809FuU_zTDtfxBjf871PIN7jPhScN4P2l-hhW913E7=s120-c-rp-mo-ba2-br100",
  ];

  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <p key={i} className="mb-2">
        {line}
      </p>
    ));
  };

  const whatsappLink = "https://wa.me/905543428442";

  const [modelLoaded, setModelLoaded] = useState(false);

  const render3DModel = () => {
    if (!is3DSupported) {
      return (
        <div className="sketchfab-embed-wrapper">
          <iframe
            title="Kendi Formanı Tasarla"
            frameBorder="0"
            allowFullScreen={true}
            data-mozallowfullscreen="true"
            data-webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            data-xr-spatial-tracking
            data-execution-while-out-of-viewport
            data-execution-while-not-rendered
            data-web-share
            src="https://sketchfab.com/models/27edb3cbc7274564ad2c12acc3f11653/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_animations=0&ui_inspector=0&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_hint=0&ui_ar=0&ui_fadeout=0"
            className="w-full h-full"
          ></iframe>
        </div>
      );
    }

    if (content?.model_url) {
      return (
        <model-viewer
          src={content.model_url}
          alt={t("jersey_preview") || "Forma önizleme"}
          camera-controls
          auto-rotate
          ar
          ar-modes="webxr scene-viewer quick-look"
          style={{ width: "100%", height: "100%" }}
          className="model-viewer"
        >
          <div className="loading-overlay">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </model-viewer>
      );
    }

    if (content?.sketchfab_id) {
      return (
        <div className="sketchfab-embed-wrapper">
          <iframe
            title="Siz Tasarlayın Biz Üretelim"
            frameBorder="0"
            allowFullScreen={true}
            data-mozallowfullscreen="true"
            data-webkitallowfullscreen="true"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            data-xr-spatial-tracking
            data-execution-while-out-of-viewport
            data-execution-while-not-rendered
            data-web-share
            src={`https://sketchfab.com/models/${content.sketchfab_id}/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_animations=0&ui_inspector=0&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_hint=0&ui_ar=0&ui_fadeout=0`}
            className="w-full h-full"
          ></iframe>
        </div>
      );
    }

    return (
      <div className="sketchfab-embed-wrapper">
        <iframe
          title="Siz tasarlayın biz üretelim"
          frameBorder="0"
          allowFullScreen={true}
          data-mozallowfullscreen="true"
          data-webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          data-xr-spatial-tracking
          data-execution-while-out-of-viewport
          data-execution-while-not-rendered
          data-web-share
          src="https://sketchfab.com/models/27edb3cbc7274564ad2c12acc3f11653/embed?autospin=1&autostart=1&preload=1&transparent=1&ui_animations=0&ui_inspector=0&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_hint=0&ui_ar=0&ui_fadeout=0"
          className="w-full h-full"
        ></iframe>
      </div>
    );
  };

  return (
    <section className="relative pt-16 md:pt-28 pb-12 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-galaxy-blue/10 via-galaxy-purple/10 to-transparent dark:from-galaxy-purple/15 -z-10" />

      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[#8B5CF6]/30 to-[#D946EF]/20 rounded-full blur-[80px] animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite] opacity-80 -z-10" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-[#F97316]/20 to-[#0EA5E9]/30 rounded-full blur-[70px] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite] [animation-delay:2s] opacity-80 -z-10" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-tr from-[#D946EF]/15 to-[#0EA5E9]/10 rounded-full blur-[60px] animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite] [animation-delay:1.5s] opacity-70 -z-10" />

      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 text-left px-2 md:px-4 lg:pl-8">
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-12 w-3/4 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse"></div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-galaxy-blue via-galaxy-purple to-galaxy-neon leading-tight">
                    {formatText(title)}
                  </h1>
                  <div className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-xl">
                    {formatText(description)}
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/gallery">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-galaxy-blue to-galaxy-purple hover:opacity-90 transition-all duration-300 group w-full sm:w-auto"
                  >
                    {t("explore_gallery") || "Galeriyi Keşfet"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white border-none hover:opacity-90 transition-all duration-300 w-full sm:w-auto"
                  >
                    {language === "tr"
                      ? "Özel Tasarım Forma Yaptırmak İçin Bilgi Al"
                      : "Get Information To Customize Your Jersey Design"}
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </a>
              </div>

              {showRatings && (
                <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex -space-x-3">
                    {profileImages.map((image, i) => (
                      <Avatar
                        key={i}
                        className="w-10 h-10 border-2 border-white dark:border-gray-900 shadow-md transform transition-transform hover:scale-110 hover:z-10"
                      >
                        <AvatarImage src={image} alt={`Customer ${i + 1}`} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                          {String.fromCharCode(65 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium flex items-center">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
                        alt="Google"
                        className="mr-2 h-5 w-5"
                      />
                      <span className="text-galaxy-blue font-semibold">{customerCount}+</span>
                      <span className="ml-1">{t("trusted_wholesalers") || "toptancı tarafından tercih edildi"}</span>
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(ratingCount)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm ml-1 font-medium">{ratingValue}/5</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-start lg:justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-full blur-3xl opacity-30 animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
              <div className="relative rounded-3xl overflow-hidden p-2 sm:p-4 md:p-6 lg:p-8 h-full flex items-center justify-center shadow-xl bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-800/80 dark:to-gray-900/40 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 transform transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl">
                {render3DModel()}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-tr from-white/60 via-transparent to-transparent dark:from-white/5 dark:via-transparent pointer-events-none" />
              </div>

              {!isMobile && (
                <>
                  <div
                    className="absolute -right-5 top-10 py-2 px-4 rounded-full shadow-lg animate-float [animation-delay:1s] transform transition-all duration-500 hover:scale-110 hover:shadow-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-gray-700/40"
                    style={{ animation: "float 4s ease-in-out infinite" }}
                  >
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]">
                      {t("top_quality") || "Üstün Kalite"}
                    </span>
                  </div>

                  <div
                    className="absolute -left-5 bottom-10 py-2 px-4 rounded-full shadow-lg animate-float [animation-delay:1.5s] transform transition-all duration-500 hover:scale-110 hover:shadow-xl backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/40 dark:border-gray-700/40"
                    style={{ animation: "float 4s ease-in-out infinite", animationDelay: "2s" }}
                  >
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#D946EF] to-[#0EA5E9]">
                      {t("customizable") || "Özelleştirilebilir"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
        model-viewer {
          --progress-bar-color: #8B5CF6;
          --poster-color: transparent;
          width: 100%;
          height: 100%;
          position: relative;
          transition: opacity 0.3s ease-in-out;
        }
        
        model-viewer::part(default-progress-bar) {
          height: 3px;
          background-color: #8B5CF6;
        }

        model-viewer::part(default-ar-button) {
          display: none;
        }

        model-viewer::part(default-progress-mask) {
          display: none;
        }
        
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          z-index: 10;
        }
        
        .model-fallback {
          width: 100%;
          height: 100%;
          position: relative;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        `}
      </style>
    </section>
  );
};

export default HeroSection;
