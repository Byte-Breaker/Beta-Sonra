
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Globe, RefreshCw, Save, Upload, Download } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const AdminAutoTranslate: React.FC = () => {
  const { t, language, bulkTranslateAndSave, translateAndSave, refreshTranslations } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [batchKey, setBatchKey] = useState("");
  const [batchTextTr, setBatchTextTr] = useState("");
  const [batchTextEn, setBatchTextEn] = useState("");
  const [componentScanResults, setComponentScanResults] = useState<string[]>([]);
  
  // Function to scan components for translation keys
  const scanComponents = async () => {
    setLoading(true);
    try {
      // In a real app, this would involve parsing component files
      // Here we'll simulate with some common keys from our components
      const commonKeys = [
        { key: "home", textTr: "Anasayfa" },
        { key: "gallery", textTr: "Galeri" },
        { key: "design", textTr: "Tasarla" },
        { key: "blog", textTr: "Blog" },
        { key: "about", textTr: "Hakkımızda" },
        { key: "contact", textTr: "İletişim" },
        { key: "popular_jerseys", textTr: "En Popüler Formalar" },
        { key: "latest_jerseys", textTr: "Yeni Formalar" },
        { key: "featured_jerseys", textTr: "Öne Çıkan Formalar" },
        { key: "view_all", textTr: "Tümünü Gör" },
        { key: "buy_now", textTr: "Hemen Satın Al" },
        { key: "min_order", textTr: "Min. Sipariş" },
        { key: "pieces", textTr: "Adet" },
        { key: "colors", textTr: "Renkler" },
        { key: "per_piece", textTr: "Parça Başına" },
        { key: "filters", textTr: "Filtreler" },
        { key: "reset_filters", textTr: "Filtreleri Sıfırla" },
        { key: "jersey_type", textTr: "Forma Tipi" },
        { key: "price_range", textTr: "Fiyat Aralığı" },
        { key: "minimum_order", textTr: "Minimum Sipariş" },
        { key: "new_arrivals", textTr: "Yeni Gelenler" },
        { key: "popular_items", textTr: "Popüler Ürünler" },
        { key: "all_types", textTr: "Tüm Tipler" },
        { key: "any", textTr: "Tümü" },
        { key: "hero_title", textTr: "Premium Toptancılar İçin Formalar" },
        { key: "hero_description", textTr: "Toptan dağıtım için tasarlanmış özel forma koleksiyonumuzu keşfedin. Modern tasarım araçlarımızla envanterinizi özelleştirin." },
        { key: "explore_gallery", textTr: "Galeriyi Keşfet" },
        { key: "design_your_jersey", textTr: "Formanızı Tasarlayın" },
        { key: "trusted_by_wholesalers", textTr: "2000+ toptancı tarafından tercih edildi" },
        { key: "jersey_preview", textTr: "Forma önizleme" },
        { key: "top_quality", textTr: "Üstün Kalite" },
        { key: "customizable", textTr: "Özelleştirilebilir" },
        { key: "features_title", textTr: "Neden Bizi Tercih Etmelisiniz" },
        { key: "features_description", textTr: "Toptancılar için özel olarak tasarlanmış premium hizmetlerimiz ve avantajlarımız." },
        { key: "custom_design", textTr: "Özel Tasarım" },
        { key: "custom_design_description", textTr: "Kendi özel tasarımınızı oluşturun veya profesyonel tasarımcılarımızla çalışın." },
        { key: "fast_delivery", textTr: "Hızlı Teslimat" },
        { key: "fast_delivery_description", textTr: "Siparişlerinizi en hızlı şekilde hazırlayıp kapınıza kadar gönderiyoruz." },
        { key: "premium_quality", textTr: "Premium Kalite" },
        { key: "premium_quality_description", textTr: "En kaliteli kumaşları ve baskı tekniklerini kullanıyoruz." },
        { key: "team_orders", textTr: "Takım Siparişleri" },
        { key: "team_orders_description", textTr: "Tüm takım üyeleriniz için özelleştirilmiş formalar." },
        { key: "quick_setup", textTr: "Hızlı Kurulum" },
        { key: "quick_setup_description", textTr: "Kolay ve hızlı tasarım süreci ile vakit kaybetmeyin." },
        { key: "wholesale_pricing", textTr: "Toptan Fiyatlandırma" },
        { key: "wholesale_pricing_description", textTr: "Toptancılar için özel indirimli fiyatlar sunuyoruz." },
        { key: "popular_jerseys_description", textTr: "Dünya çapındaki müşteriler tarafından sevilen en çok satan toptan formalarımızı keşfedin." },
        { key: "latest_jerseys_description", textTr: "Toptan forma koleksiyonumuza en son eklenen ürünlere göz atın." },
        { key: "featured_jerseys_description", textTr: "Toptan dağıtım için tasarlanmış özel yüksek kaliteli forma koleksiyonumuzu keşfedin." },
        { key: "no_products_found", textTr: "Hiç ürün bulunamadı" },
        { key: "no_new_jerseys_found", textTr: "Yeni ürün bulunamadı" },
        { key: "no_popular_jerseys_found", textTr: "Popüler ürün bulunamadı" },
        { key: "error_fetching_products", textTr: "Ürünler yüklenirken hata oluştu" },
        { key: "cta_title", textTr: "Özel Formanızı Tasarlayın" },
        { key: "cta_description", textTr: "Takımınız için profesyonel ve özelleştirilmiş formalar tasarlayın. Modern tasarım araçlarımızla kendi benzersiz formanızı oluşturun." },
        { key: "start_designing", textTr: "Tasarlamaya Başla" },
        { key: "contact_us", textTr: "Bizimle İletişime Geç" },
        { key: "whatsapp_order", textTr: "WhatsApp Siparişi" },
        { key: "whatsapp_redirect", textTr: "WhatsApp'a yönlendiriliyorsunuz" },
        { key: "loading_filters", textTr: "Filtreler yükleniyor..." },
        { key: "select_jersey_type", textTr: "Forma tipi seçin" },
        { key: "select_minimum_order", textTr: "Minimum sipariş seçin" },
        { key: "privacy_policy", textTr: "Gizlilik Politikası" },
        { key: "terms_of_use", textTr: "Kullanım Koşulları" },
        { key: "all_rights_reserved", textTr: "Tüm Hakları Saklıdır" },
        { key: "search", textTr: "Ara" },
        { key: "search_placeholder", textTr: "Aramak istediğiniz kelimeyi yazın..." },
        { key: "search_coming_soon", textTr: "Arama özelliği yakında geliyor!" },
        { key: "popular_searches", textTr: "Popüler Aramalar" },
        { key: "search_results", textTr: "Arama Sonuçları" },
        { key: "404_title", textTr: "Sayfa Bulunamadı" },
        { key: "404_description", textTr: "Aradığınız sayfa mevcut değil veya taşınmış olabilir." },
        { key: "back_to_home", textTr: "Anasayfaya Dön" }
      ];
      
      setComponentScanResults(commonKeys.map(item => `${item.key}: ${item.textTr}`));
      
      toast.success(language === 'tr' ? 'Bileşenler tarandı' : 'Components scanned');
    } catch (error) {
      console.error("Error scanning components:", error);
      toast.error(language === 'tr' ? 'Bileşenler taranırken hata oluştu' : 'Error scanning components');
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-translate and save all scanned components
  const processScannedComponents = async () => {
    setProcessing(true);
    try {
      const keys = componentScanResults.map(result => {
        const [key, value] = result.split(': ');
        return { key, textTr: value };
      });
      
      const savedCount = await bulkTranslateAndSave(keys);
      
      // Clear the scan results after processing
      if (savedCount > 0) {
        setComponentScanResults([]);
      }
    } catch (error) {
      console.error("Error processing translations:", error);
      toast.error(
        language === 'tr' 
          ? 'Çeviriler işlenirken hata oluştu'
          : 'Error processing translations'
      );
    } finally {
      setProcessing(false);
    }
  };
  
  // Handle manual batch translation
  const handleSaveBatch = async () => {
    if (!batchKey || !batchTextTr) {
      toast.error(
        language === 'tr'
          ? 'Anahtar ve Türkçe metin gereklidir'
          : 'Key and Turkish text are required'
      );
      return;
    }
    
    setProcessing(true);
    try {
      await translateAndSave(batchKey, batchTextTr, batchTextEn || undefined);
      
      // Clear form after successful save
      setBatchKey('');
      setBatchTextTr('');
      setBatchTextEn('');
      
      toast.success(
        language === 'tr'
          ? 'Çeviri başarıyla kaydedildi'
          : 'Translation successfully saved'
      );
    } catch (error) {
      console.error("Error saving batch translation:", error);
    } finally {
      setProcessing(false);
    }
  };
  
  // Export translations to JSON
  const exportTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*');
        
      if (error) throw error;
      
      // Format data as JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = 'translations.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(
        language === 'tr'
          ? 'Çeviriler dışa aktarıldı'
          : 'Translations exported'
      );
    } catch (error) {
      console.error("Error exporting translations:", error);
      toast.error(
        language === 'tr'
          ? 'Çeviriler dışa aktarılırken hata oluştu'
          : 'Error exporting translations'
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {language === 'tr' ? 'Otomatik Çeviri' : 'Automatic Translation'}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshTranslations}
            disabled={loading || processing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {language === 'tr' ? 'Yenile' : 'Refresh'}
          </Button>
          <Button 
            onClick={exportTranslations}
            variant="outline"
            disabled={loading || processing}
          >
            <Download className="mr-2 h-4 w-4" />
            {language === 'tr' ? 'Dışa Aktar' : 'Export'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="auto">
        <TabsList>
          <TabsTrigger value="auto">
            {language === 'tr' ? 'Otomatik Çeviri' : 'Auto Translation'}
          </TabsTrigger>
          <TabsTrigger value="manual">
            {language === 'tr' ? 'Manuel Çeviri' : 'Manual Translation'}
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="auto">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'tr' ? 'Bileşenleri Tara ve Çevir' : 'Scan & Translate Components'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Button 
                  onClick={scanComponents}
                  disabled={loading || processing}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === 'tr' ? 'Taranıyor...' : 'Scanning...'}
                    </>
                  ) : (
                    <>
                      <Globe className="mr-2 h-4 w-4" />
                      {language === 'tr' ? 'Bileşenleri Tara' : 'Scan Components'}
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={processScannedComponents}
                  disabled={processing || componentScanResults.length === 0}
                  variant="default"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === 'tr' ? 'İşleniyor...' : 'Processing...'}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {language === 'tr' ? 'Tümünü Çevir ve Kaydet' : 'Translate & Save All'}
                    </>
                  )}
                </Button>
              </div>
              
              {componentScanResults.length > 0 ? (
                <div className="border rounded-md p-4 h-96 overflow-auto">
                  <p className="mb-2 text-muted-foreground">
                    {language === 'tr' 
                      ? `${componentScanResults.length} çeviri anahtarı bulundu:`
                      : `Found ${componentScanResults.length} translation keys:`}
                  </p>
                  <pre className="text-sm">
                    {componentScanResults.join('\n')}
                  </pre>
                </div>
              ) : (
                <div className="border rounded-md p-8 text-center text-muted-foreground">
                  {language === 'tr' 
                    ? 'Tarama sonuçları burada görünecek'
                    : 'Scan results will appear here'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'tr' ? 'Manuel Çeviri Ekle' : 'Add Manual Translation'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="key">
                    {language === 'tr' ? 'Çeviri Anahtarı' : 'Translation Key'}
                  </Label>
                  <Input
                    id="key"
                    value={batchKey}
                    onChange={(e) => setBatchKey(e.target.value)}
                    placeholder="home, about_us, etc."
                    disabled={processing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="turkish">
                    {language === 'tr' ? 'Türkçe Metin' : 'Turkish Text'}
                  </Label>
                  <Textarea
                    id="turkish"
                    value={batchTextTr}
                    onChange={(e) => setBatchTextTr(e.target.value)}
                    placeholder="Türkçe çeviri..."
                    disabled={processing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="english">
                    {language === 'tr' ? 'İngilizce Metin (Opsiyonel)' : 'English Text (Optional)'}
                  </Label>
                  <Textarea
                    id="english"
                    value={batchTextEn}
                    onChange={(e) => setBatchTextEn(e.target.value)}
                    placeholder="English translation..."
                    disabled={processing}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === 'tr' 
                      ? 'Boş bırakırsanız, otomatik olarak çevrilecektir'
                      : 'If left empty, it will be automatically translated'}
                  </p>
                </div>
                
                <Button 
                  onClick={handleSaveBatch}
                  disabled={processing || !batchKey || !batchTextTr}
                  className="w-full"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === 'tr' ? 'Kaydediliyor...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {language === 'tr' ? 'Çeviriyi Kaydet' : 'Save Translation'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAutoTranslate;
