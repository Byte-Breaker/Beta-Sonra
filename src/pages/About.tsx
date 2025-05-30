import React from "react";
import Layout from "../components/Layout";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAboutContent } from "@/hooks/use-about-content";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const About: React.FC = () => {
  const { t } = useLanguage();
  const { sections, loading } = useAboutContent();
  const navigate = useNavigate();

  const getSection = (key: string) => sections.find((s) => s.section_key === key);
  const getFeatures = (key: string) => getSection(key)?.features || [];

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-2 py-8 flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const heroSection = getSection("hero");
  const designJerseySection = getSection("design_jersey");
  const whyImportantSection = getSection("why_important");
  const advantagesSection = getSection("advantages");
  const orderProcessSection = getSection("order_process");
  const featuresSection = getSection("features");
  const deliverySection = getSection("delivery");
  const affordableSection = getSection("affordable");
  const differenceSection = getSection("difference");
  const ctaSection = getSection("cta");

  const customSections = sections
    .filter((s) => s.section_key.startsWith("custom_section_") && s.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <Layout>
      <div className="container mx-auto px-2 max-w-5xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group hover:bg-primary/10 transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 text-primary group-hover:text-primary/80 transition-colors" />
            <span className="text-sm text-primary group-hover:text-primary/80">
              {t("back_to_home") || "Back to Home"}
            </span>
          </Button>
        </div>

        {/* Hero Section */}
        {heroSection && (
          <div className="mb-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{heroSection.displayTitle}</h1>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {heroSection.displayDescription}
            </p>
            {heroSection.image_url && (
              <div className="mt-6 max-w-xl mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={heroSection.image_url}
                    alt={heroSection.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
          </div>
        )}

        {/* Design Jersey Section */}
        {designJerseySection && (
          <div className="grid md:grid-cols-2 gap-8 mb-16 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">{designJerseySection.displayTitle}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {designJerseySection.displayDescription}
              </p>
              <Link to="/design">
                <Button className="bg-galaxy-gradient hover:opacity-90 transition-all duration-300 text-sm">
                  {t("design_jersey")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="glass-card rounded-xl overflow-hidden shadow-lg">
              <img
                src={designJerseySection.image_url || "/placeholder.svg"}
                alt={designJerseySection.displayTitle}
                className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        )}

        {/* Why Important Section */}
        {whyImportantSection && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">{whyImportantSection.displayTitle}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center max-w-2xl mx-auto leading-relaxed">
              {whyImportantSection.displayDescription}
            </p>
            {whyImportantSection.image_url && (
              <div className="mb-6 max-w-2xl mx-auto">
                <AspectRatio ratio={3/2} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={whyImportantSection.image_url}
                    alt={whyImportantSection.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {getFeatures("why_important").map((feature) => (
                <div
                  key={feature.id}
                  className="glass-card rounded-xl p-5 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  {feature.image_url && (
                    <div className="mb-3">
                      <AspectRatio ratio={1/1} className="bg-muted rounded-lg overflow-hidden w-12 h-12 mx-auto">
                        <img
                          src={feature.image_url}
                          alt={feature.displayTitle}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-2">{feature.displayTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.displayDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advantages Section */}
        {advantagesSection && (
          <div className="mb-16 glass-card rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">{advantagesSection.displayTitle}</h2>
            {advantagesSection.image_url && (
              <div className="mb-6 max-w-xl mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={advantagesSection.image_url}
                    alt={advantagesSection.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {getFeatures("advantages").map((feature) => (
                <div key={feature.id} className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold mb-1 text-sm">{feature.displayTitle}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.displayDescription}
                    </p>
                    {feature.image_url && (
                      <div className="mt-2">
                        <img
                          src={feature.image_url}
                          alt={feature.displayTitle}
                          className="rounded-md max-w-full h-auto max-h-20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Process Section */}
        {orderProcessSection && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">{orderProcessSection.displayTitle}</h2>
            {orderProcessSection.image_url && (
              <div className="mb-6 max-w-3xl mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={orderProcessSection.image_url}
                    alt={orderProcessSection.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {getFeatures("order_process").map((process, index) => (
                <div
                  key={process.id}
                  className="relative glass-card rounded-xl p-5 pt-8 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="absolute -top-3 left-5 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    {index + 1}
                  </div>
                  {process.image_url && (
                    <div className="mb-3">
                      <AspectRatio ratio={4/3} className="bg-muted rounded-lg overflow-hidden">
                        <img
                          src={process.image_url}
                          alt={process.displayTitle}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        />
                      </AspectRatio>
                    </div>
                  )}
                  <h3 className="text-base font-semibold mb-2">{process.displayTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {process.displayDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        {featuresSection && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">{featuresSection.displayTitle}</h2>
            {featuresSection.image_url && (
              <div className="mb-6 max-w-3xl mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={featuresSection.image_url}
                    alt={featuresSection.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {getFeatures("features").map((feature) => (
                <div
                  key={feature.id}
                  className="glass-card rounded-xl p-5 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  {feature.image_url && (
                    <div className="mb-3">
                      <AspectRatio ratio={4/3} className="bg-muted rounded-lg overflow-hidden">
                        <img
                          src={feature.image_url}
                          alt={feature.displayTitle}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        />
                      </AspectRatio>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-2">{feature.displayTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.displayDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Section */}
        {deliverySection && (
          <div className="mb-16">
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">{deliverySection.displayTitle}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center leading-relaxed">
                {deliverySection.displayDescription}
              </p>
              {deliverySection.image_url && (
                <div className="max-w-xl mx-auto">
                  <AspectRatio ratio={4/3} className="bg-muted rounded-xl overflow-hidden shadow-md">
                    <img
                      src={deliverySection.image_url}
                      alt={deliverySection.displayTitle}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    />
                  </AspectRatio>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Affordable Section */}
        {affordableSection && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-4 text-center">{affordableSection.displayTitle}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center max-w-3xl mx-auto leading-relaxed">
              {affordableSection.displayDescription}
            </p>
            {affordableSection.image_url && (
              <div className="max-w-xl mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={affordableSection.image_url}
                    alt={affordableSection.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
          </div>
        )}

        {/* Difference Section */}
        {differenceSection && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">{differenceSection.displayTitle}</h2>
            {differenceSection.image_url && (
              <div className="mb-6 max-w-xl mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={differenceSection.image_url}
                    alt={differenceSection.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-6">
              {getFeatures("difference").map((feature) => (
                <div
                  key={feature.id}
                  className="glass-card rounded-xl p-5 text-center hover:shadow-lg transition-shadow duration-200"
                >
                  {feature.image_url && (
                    <div className="mb-3">
                      <AspectRatio ratio={1/1} className="bg-muted rounded-lg overflow-hidden w-12 h-12 mx-auto">
                        <img
                          src={feature.image_url}
                          alt={feature.displayTitle}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-2">{feature.displayTitle}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.displayDescription}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections.map((section) => (
          <div key={section.id} className="mb-16">
            <h2 className="text-2xl font-bold mb-4 text-center">{section.displayTitle}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center max-w-3xl mx-auto leading-relaxed">
              {section.displayDescription}
            </p>
            {section.image_url && (
              <div className="mb-6 max-w-xl mx-auto">
                <AspectRatio ratio={4/3} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={section.image_url}
                    alt={section.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
            {getFeatures(section.section_key).length > 0 && (
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {getFeatures(section.section_key).map((feature) => (
                  <div
                    key={feature.id}
                    className="glass-card rounded-xl p-5 text-center hover:shadow-lg transition-shadow duration-200"
                  >
                    {feature.image_url && (
                      <div className="mb-3">
                        <AspectRatio ratio={4/3} className="bg-muted rounded-lg overflow-hidden">
                          <img
                            src={feature.image_url}
                            alt={feature.displayTitle}
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                          />
                        </AspectRatio>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold mb-2">{feature.displayTitle}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.displayDescription}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* CTA Section */}
        {ctaSection && (
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">{ctaSection.displayTitle}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 max-w-lg mx-auto leading-relaxed">
              {ctaSection.displayDescription}
            </p>
            {ctaSection.image_url && (
              <div className="mb-6 max-w-xs mx-auto">
                <AspectRatio ratio={1/1} className="bg-muted rounded-xl overflow-hidden shadow-md">
                  <img
                    src={ctaSection.image_url}
                    alt={ctaSection.displayTitle}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
            )}
            <Button
              onClick={() => window.open("https://wa.me/905543428442", "_blank")}
              className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white hover:opacity-95 transition-all duration-300 shadow-md"
              size="lg"
            >
              {t("contact_via_whatsapp")}
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2.5L4.5 8L2 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default About;