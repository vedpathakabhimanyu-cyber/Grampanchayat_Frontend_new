"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import websiteAPI from "@/lib/api";
import { replaceWithMarathiDigits } from "@/lib/utils";
import {
  FaUserTie,
  FaUsers,
  FaClipboardList,
  FaBalanceScale,
  FaPhoneAlt,
  FaEnvelope,
  FaUserCircle,
} from "react-icons/fa";

interface Official {
  id: string;
  name: string;
  position: string;
  mobile?: string;
  image?: string;
}

export default function AdministrationPage() {
  const [electedMembers, setElectedMembers] = useState<Official[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const response = await websiteAPI.getOfficials();
        if (response.success && response.data) {
          setElectedMembers(response.data);
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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-2.5 flex items-center justify-start space-x-3 mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
            प्रशासन
          </h2>
        </div>

        {/* Introduction */}
        <section className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
            आमची ग्रामपंचायत लोकशाही तत्त्वांवर चालते आणि निवडून आलेले प्रतिनिधी
            गावाच्या विकासासाठी कार्यरत आहेत.
          </p>
        </section>

        {/* Elected Members */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-government-blue mb-6" style={{marginBottom:'20px'}}>
            निवडून आलेले प्रतिनिधी
          </h2>
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
              <p className="mt-2 text-gray-600">लोड होत आहे...</p>
            </div>
          ) : electedMembers.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg">
              <p className="text-gray-600">प्रतिनिधी उपलब्ध नाहीत</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 bg-transparent">
              {electedMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full"
                >
                  {/* Modern Image Container */}
                  <div className="relative w-32 h-32 md:w-36 md:h-36 mb-6 group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0A1931] to-[#1A3D63] rounded-2xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500"></div>
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-md bg-gray-50 flex items-center justify-center">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-5xl text-gray-200" />
                      )}
                    </div>
                  </div>

                  {/* Identification Badge */}
                  <div className="inline-block px-3 py-1 bg-blue-50 text-[#1A3D63] text-xs font-bold rounded-full uppercase tracking-wider mb-3">
                    {member.position}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-[#0A1931] mb-2 leading-tight flex-1">
                    {member.name}
                  </h3>

                  <div className="pt-4 border-t border-gray-50 mt-auto w-full">
                    {member.mobile && (
                      <div className="flex items-center justify-center gap-2 text-gray-500 hover:text-[#0A1931] transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm">
                          <FaUserTie className="rotate-0" />
                        </div>
                        <span className="text-sm font-medium tracking-wide">
                          {replaceWithMarathiDigits(member.mobile)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
