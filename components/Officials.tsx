"use client";

import React, { useEffect, useState } from "react";
import { FaUserTie } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import websiteAPI from "@/lib/api";
import { replaceWithMarathiDigits } from "@/lib/utils";

interface Official {
  id: string;
  name: string;
  position: string;
  mobile?: string;
  image?: string;
}

const Officials = () => {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const response = await websiteAPI.getOfficials();
        if (response.success && response.data) {
          // Filter to show only Sarpanch, Upsarpanch, and Grampanchayat Adhikari
          const keyPositions = ["सरपंच", "उपसरपंच", "ग्रामपंचायत अधिकारी"];
          const filteredOfficials = response.data.filter((official: Official) =>
            keyPositions.some((position) =>
              official.position.toLowerCase().includes(position.toLowerCase()),
            ),
          );
          setOfficials(filteredOfficials.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch officials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficials();
  }, []);

  return (
    <section className="mb-8 md:mb-12 mt-4 w-full">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-4 sm:px-5 md:px-6 py-2.5 flex items-center justify-start space-x-2 sm:space-x-3">
          <FaUserTie className="text-lg sm:text-xl md:text-2xl flex-shrink-0" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide truncate">
            प्रतिनिधी
          </h2>
        </div>

        {/* Officials Grid */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
              <p className="mt-2 text-gray-600">लोड होत आहे...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {officials.map((official) => (
                <div
                  key={official.id}
                  className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-0.5 sm:hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full"
                >
                  {/* Modern Image Container */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-3 sm:mb-4 md:mb-6 group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1931] to-[#1A3D63] rounded-lg sm:rounded-2xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
                    <div className="relative w-full h-full rounded-lg sm:rounded-2xl overflow-hidden border-3 sm:border-4 border-white shadow-md bg-gray-50 flex items-center justify-center">
                      {official.image ? (
                        <Image
                          src={official.image}
                          alt={official.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <FaUserTie className="text-3xl sm:text-4xl md:text-5xl text-gray-200" />
                      )}
                    </div>
                  </div>

                  {/* Identification Badge */}
                  <div className="inline-block px-2 sm:px-3 py-1 bg-blue-50 text-[#1A3D63] text-xs font-bold rounded-full uppercase tracking-wider mb-2 sm:mb-3">
                    {official.position}
                  </div>

                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#0A1931] mb-2 leading-tight flex-1">
                    {official.name}
                  </h3>

                  <div className="pt-3 sm:pt-4 border-t border-gray-50 mt-auto w-full">
                    {official.mobile && (
                      <div className="flex items-center justify-center gap-1 sm:gap-2 text-gray-500 hover:text-[#0A1931] transition-colors">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs sm:text-sm">
                          <FaUserTie className="rotate-0" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium tracking-wide">
                          {replaceWithMarathiDigits(official.mobile)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Enhanced "See All" Card */}
              <div className="group bg-gray-50 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center text-center h-full hover:border-[#0A1931] hover:bg-white transition-all duration-300">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg sm:rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3 sm:mb-6 group-hover:scale-110 group-hover:text-[#0A1931] transition-all">
                  <FaUserTie className="text-2xl sm:text-3xl text-gray-300 group-hover:text-[#0A1931]" />
                </div>
                <p className="text-[#0A1931] font-bold text-xs sm:text-sm md:text-base mb-4 sm:mb-6 leading-snug">
                  ग्रामपंचायतीचे सर्व निवडून आलेले प्रतिनिधी पहा
                </p>
                <Link
                  href="/about/administration"
                  className="w-full bg-[#0A1931] text-white font-bold py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-[#142b4a] shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
                >
                  सर्व सदस्य
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Officials;
