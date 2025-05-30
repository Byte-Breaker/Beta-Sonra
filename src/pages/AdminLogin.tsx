
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Navigate, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, LogIn } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

const AdminLogin: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        // Clear any problematic auth state
        cleanupAuthState();
      }
    };
    
    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      // Clean up existing auth state to prevent conflicts
      cleanupAuthState();

      // Try global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors from signout, we'll proceed with signin anyway
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(t("login_success") || "Başarıyla giriş yapıldı");
        // Force full page refresh for clean state
        window.location.href = '/admin';
      }
    } catch (error: any) {
      toast.error(t("login_error") || "Giriş yapılırken bir hata oluştu");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{t("admin_login") || "Yönetici Girişi"} | FormaYaptırma</title>
      </Helmet>
      
      <div className="flex min-h-screen">
        {/* Left panel with image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-galaxy-blue via-galaxy-purple to-galaxy-neon relative">
          <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent opacity-70"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white text-center space-y-6">
              <div className="w-24 h-24 mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse"></div>
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  className="w-full h-full object-contain relative z-10" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = "/favicon.ico";
                  }}
                />
              </div>
              <h1 className="text-4xl font-bold">{t("admin_portal") || "Yönetici Portalı"}</h1>
              <p className="text-lg opacity-80 max-w-md">
                {t("admin_login_description") || "Sitenizi yönetmek ve içeriğinizi düzenlemek için giriş yapın"}
              </p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        </div>
        
        {/* Right panel with login form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 bg-white dark:bg-gray-900">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="lg:hidden flex justify-center mb-8">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                  <img 
                    src="/logo.svg" 
                    alt="Logo" 
                    className="w-full h-full object-contain relative" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; 
                      target.src = "/favicon.ico";
                    }}
                  />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-galaxy-blue to-galaxy-purple">
                {t("admin_login_title") || "Yönetici Paneline Giriş"}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {t("enter_credentials") || "Lütfen bilgilerinizi girin"}
              </p>
            </div>
            
            <div className="bg-card shadow-lg rounded-xl p-8 dark:bg-gray-800/50">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email") || "E-posta"}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ornek@email.com" 
                            type="email" 
                            autoComplete="email"
                            className="h-11"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("password") || "Şifre"}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••" 
                            type="password" 
                            autoComplete="current-password"
                            className="h-11"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-gradient-to-r from-galaxy-blue to-galaxy-purple hover:opacity-90 transition-opacity"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <LogIn className="h-5 w-5 mr-2" />
                    )}
                    {t("sign_in") || "Giriş Yap"}
                  </Button>
                </form>
              </Form>
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              {t("forgot_password_contact") || "Şifrenizi mi unuttunuz? Lütfen yönetici ile iletişime geçin."}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
