"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import websiteAPI from "@/lib/api";

interface GrampanchayatInfo {
  grampanchayatName?: string;
  talukaName?: string;
  districtName?: string;
  phone?: string;
  email?: string;
}

const Header = () => {
  const [gpInfo, setGpInfo] = useState<GrampanchayatInfo | null>(null);

  useEffect(() => {
    const fetchGPInfo = async () => {
      try {
        const response = await websiteAPI.getGrampanchayatInfo();
        if (response.success && response.data) {
          setGpInfo(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch GP info:", error);
      }
    };

    fetchGPInfo();
  }, []);

  return (
    <header className="bg-white w-full border-b border-gray-200 shadow-sm">
      <div className="section-padding">
        <div className="grid grid-cols-[auto_1fr_auto] items-center py-4 sm:py-6 gap-2">
          {/* Left Logo */}
          <div className="flex justify-start items-center">
            <Link
              href="/"
              className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
            >
              <Image
                src="/images/Emblem.png"
                alt="ग्रामपंचायत"
                fill
                priority
                sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, 80px"
                className="object-contain"
              />
            </Link>
          </div>

          {/* Title Section */}
          <div className="text-center flex flex-col items-center justify-center px-1 sm:px-2">
            <h1
              className="text-h2 md:text-h1 font-black text-[#0A1931] tracking-tighter font-marathi"
              style={{ lineHeight: "0.1" }}
            >
              ग्रामपंचायत {gpInfo?.grampanchayatName || "..."}
            </h1>

            <p
              className="text-sm md:text-base lg:text-lg font-medium text-[#0A1931] font-marathi"
              style={{ lineHeight: "1.4" }}
            >
              {gpInfo ? (
                <>
                  तालुका: {gpInfo.talukaName} जिल्हा: {gpInfo.districtName}
                </>
              ) : (
                "..."
              )}
            </p>
          </div>

          {/* Right Logo */}
          <div className="flex justify-end items-center">
            <div className="relative w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20">
              <Image
                src="/images/Seal_of_Maharashtra.svg.png"
                alt="महाराष्ट्र शासन"
                fill
                priority
                sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, 80px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
