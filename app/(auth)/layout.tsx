"use client";

import { CompanySelectorModal } from "@/components/Modal/CompanySelectorModal";

import { Building2 } from "lucide-react";

export default function GuestLayout({ children }: { children: React.ReactNode }) {


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {children}
    </div>
  );
}