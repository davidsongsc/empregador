"use client";

import { useEffect, useRef, useState } from "react";
import { useConsentStore } from "@/store/useConsentStore";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

const AdBanner = ({ 
  dataAdSlot, 
  dataAdFormat = "auto", 
  fullWidthResponsive = true,
  className = "",
}: AdBannerProps) => {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const { hasAccepted } = useConsentStore();
  const [hasAd, setHasAd] = useState<boolean | null>(null);
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    // SÓ EXECUTA SE O USUÁRIO ACEITOU OS COOKIES
    if (!hasAccepted || !adsenseId) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("AdSense: Erro ao registrar push.");
    }

    const observer = new MutationObserver(() => {
      if (adRef.current) {
        const status = adRef.current.getAttribute("data-ad-status");
        if (status === "unfilled") setHasAd(false);
        else if (status === "filled") setHasAd(true);
      }
    });

    if (adRef.current) {
      observer.observe(adRef.current, {
        attributes: true,
        attributeFilter: ["data-ad-status"],
      });
    }

    const timeout = setTimeout(() => {
      if (adRef.current && adRef.current.offsetHeight === 0) {
        setHasAd(false);
      }
    }, 3500);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [hasAccepted, adsenseId]); // Re-executa se o consentimento mudar

  // Se recusou cookies ou não tem ID, não renderiza o componente
  if (hasAccepted === false || !adsenseId) return null;

  return (
    <div 
      className={`
        ${hasAd === false ? "hidden" : "flex"} 
        my-6 overflow-hidden justify-center transition-all duration-300
        ${hasAd === null ? "min-h-[100px] opacity-0" : "opacity-100"} 
        ${className}
      `}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", minWidth: "250px" }}
        data-ad-client={adsenseId}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdBanner;