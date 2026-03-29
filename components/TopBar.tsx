"use client";

import React, { useState, useEffect } from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import websiteAPI from "@/lib/api";
import { replaceWithMarathiDigits } from "@/lib/utils";

const TopBar = () => {
  const [mounted, setMounted] = useState(false);
  const [gpInfo, setGpInfo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchGpInfo();
  }, []);

  const fetchGpInfo = async () => {
    try {
      const response = await websiteAPI.getGrampanchayatInfo();
      if (response.success && response.data) {
        setGpInfo(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch GP info:", error);
    }
  };

  if (!mounted) return null;

  // Use data from database or fallback to defaults
  const content = {
    phone: replaceWithMarathiDigits(gpInfo?.phone) || "+९१-९९२१४१७००९",
    email: gpInfo?.email || "",
  };

  return (
    <div className="bg-[#0A1931] py-1.5 sm:py-2">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Mobile-first: flex row for mobile, flex-row for desktop */}
        <div className="flex flex-row justify-between items-center gap-2">
          {/* Government Button / Logo */}
          <div className="flex items-center">
            <button
              onClick={() =>
                window.open("https://maharashtra.gov.in/", "_blank")
              }
              className="text-white text-base font-semibold hover:underline transition-all flex item-center gap-2"
            >
              <span>महाराष्ट्र सरकार</span>
            </button>
          </div>

          {/* Contact Info */}
          <div className="flex flex-row items-center gap-2 text-base font-semibold text-white">
            {/* Phone */}
            <a
              href={`tel:${content.phone}`}
              className="flex items-center gap-1 hover:text-gray-200 transition-colors"
            >
              <FaPhone className="h-4 w-4 rotate-90 sm:rotate-90" />
              <span className="hidden sm:inline">{content.phone}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${content.email}`}
              className="flex items-center gap-1 hover:text-gray-200 transition-colors truncate"
            >
              <FaEnvelope className="h-4 w-4" />
              <span className="hidden sm:inline">{content.email}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
