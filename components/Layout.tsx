
import React, { useState, useEffect, memo, lazy, Suspense } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingContactButtons from "./FloatingContactButtons";
import { Loader2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

// Using memo to prevent unnecessary re-renders
const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  const [isInteractive, setIsInteractive] = useState(false);
  
  useEffect(() => {
    // Track if component is mounted to avoid memory leaks
    let isMounted = true;
    
    // Only load non-critical resources after initial render and main content is ready
    if (isMounted) {
      // Mark as interactive after initial content is loaded
      const markInteractive = () => {
        if (isMounted) setIsInteractive(true);
      };
      
      // Use requestIdleCallback for non-critical initialization
      if ('requestIdleCallback' in window) {
        // Use requestIdleCallback when browser is idle
        window.requestIdleCallback(markInteractive, { timeout: 2000 });
      } else {
        // Fallback to setTimeout for browsers without requestIdleCallback
        setTimeout(markInteractive, 1000);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
      <FloatingContactButtons />
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
