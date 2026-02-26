"use client";

import { useEffect } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  fullWidthResponsive?: boolean;
}

const AdBanner = ({ 
  dataAdSlot, 
  dataAdFormat = "auto", 
  fullWidthResponsive = true 
}: AdBannerProps) => {
  
  // Acessando a variável de ambiente
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Silencia erros em desenvolvimento (comum quando o script não carrega em localhost)
      console.warn("AdSense: Bloco de anúncio não carregado.");
    }
  }, []);

  if (!adsenseId) return null;

  return (
    <div className="my-6 overflow-hidden flex justify-center min-h-[100px]">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdBanner;