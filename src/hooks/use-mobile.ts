import { useEffect, useState } from "react";

export function useIsMobile(query = "(max-width: 768px)") {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
      if (typeof window === "undefined") return;
  
      const mediaQuery = window.matchMedia(query);
      const update = () => setIsMobile(mediaQuery.matches);
  
      update();
      mediaQuery.addEventListener("change", update);
  
      return () => mediaQuery.removeEventListener("change", update);
    }, [query]);
  
    return isMobile;
  }
  