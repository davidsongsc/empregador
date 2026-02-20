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
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Erro ao carregar AdSense:", err);
    }
  }, []);

  return (
    <div className="my-6 overflow-hidden flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXX" // Seu ID aqui
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdBanner;