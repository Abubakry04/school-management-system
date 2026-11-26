import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTop Component
 * 1. Automatically resets scroll position to top (0, 0) upon any route navigation.
 * 2. Renders a smooth floating "Back to top" button when the user scrolls down.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Automatically scroll to top whenever the route pathname or query parameters change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  // Track window scroll position to toggle the floating button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Floating Back to Top Button */}
      <button
        type="button"
        onClick={handleScrollToTop}
        aria-label="Back to top"
        title="Back to top"
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 p-2.5 sm:p-3 rounded-full bg-[#153e31] text-white shadow-lg hover:bg-[#1a4a3b] hover:shadow-xl active:scale-95 transition-all duration-300 ease-in-out border border-emerald-800/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 flex items-center justify-center group ${
          isVisible
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      </button>
    </>
  );
};

export default ScrollToTop;
