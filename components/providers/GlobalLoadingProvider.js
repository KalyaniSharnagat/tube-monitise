"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

const GlobalLoadingContext = createContext({ activeRequests: 0 });

export function useGlobalLoading() {
  return useContext(GlobalLoadingContext);
}

export default function GlobalLoadingProvider({ children }) {
  const [activeRequests, setActiveRequests] = useState(0);
  const originalFetchRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!originalFetchRef.current) {
      originalFetchRef.current = window.fetch.bind(window);
    }

    const originalFetch = originalFetchRef.current;

    const wrappedFetch = async (...args) => {
      setActiveRequests((prev) => prev + 1);
      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        setActiveRequests((prev) => Math.max(0, prev - 1));
      }
    };

    window.fetch = wrappedFetch;

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const value = useMemo(() => ({ activeRequests }), [activeRequests]);

  return (
    <GlobalLoadingContext.Provider value={value}>{children}</GlobalLoadingContext.Provider>
  );
}

export function GlobalLoadingOverlay() {
  const { activeRequests } = useGlobalLoading();
  const [isVisible, setIsVisible] = useState(false);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const lastShownAtRef = useRef(0);

  useEffect(() => {
    const showDelayMs = 200; // delay before showing
    const minVisibleMs = 500; // keep visible at least this long

    if (activeRequests > 0) {
      // clear pending hide timers
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      if (!isVisible && !showTimerRef.current) {
        showTimerRef.current = setTimeout(() => {
          setIsVisible(true);
          lastShownAtRef.current = Date.now();
          showTimerRef.current = null;
        }, showDelayMs);
      }
    } else {
      // no active requests
      if (showTimerRef.current) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }

      if (isVisible && !hideTimerRef.current) {
        const elapsed = Date.now() - lastShownAtRef.current;
        const remaining = Math.max(0, minVisibleMs - elapsed);
        hideTimerRef.current = setTimeout(() => {
          setIsVisible(false);
          hideTimerRef.current = null;
        }, remaining);
      }
    }

    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      showTimerRef.current = null;
      hideTimerRef.current = null;
    };
  }, [activeRequests, isVisible]);

  if (!isVisible) return null;

  // Centered overlay spinner
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/40 border-t-white" />
    </div>
  );
}


