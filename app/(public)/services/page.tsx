"use client";

import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaIdCard,
  FaHome,
  FaUserTie,
  FaBaby,
  FaHeart,
  FaCertificate,
  FaMoneyBill,
  FaLaptop,
  FaBuilding,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import websiteAPI from "@/lib/api";
import { replaceWithMarathiDigits } from "@/lib/utils";

interface Certificate {
  id: string;
  certificateName: string;
  certificateDescription: string;
  requiredDocuments?: string[];
  applyOnlineUrl?: string;
  isActive?: boolean;
}

export default function ServicesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await websiteAPI.getCertificates();
        if (response.success && response.data) {
          setCertificates(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-start space-x-2 sm:space-x-3 mb-4 mt-2">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide truncate">
            आमच्या सेवा
          </h3>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
            <p className="mt-2 text-gray-600">लोड होत आहे...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg">
            <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">सेवा उपलब्ध नाहीत</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-8">
            {certificates.map((certificate) => {
              return (
                <div
                  key={certificate.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                >
                  <div
                    className={`bg-[#0A1931] opacity-95 p-3 sm:p-4 md:p-5 text-white`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                      <FaCertificate className="text-xl sm:text-2xl md:text-2xl flex-shrink-0" />
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold truncate">
                          {certificate.certificateName}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                    <p className="text-gray-700 mb-4 text-xs sm:text-sm md:text-base leading-relaxed">
                      {replaceWithMarathiDigits(
                        certificate.certificateDescription,
                      )}
                    </p>

                    {certificate.requiredDocuments &&
                      certificate.requiredDocuments.length > 0 && (
                        <div className="mb-4 flex-1">
                          <h3 className="font-bold text-government-blue mb-2 sm:mb-3 text-sm md:text-base">
                            आवश्यक कागदपत्रे
                          </h3>
                          <ul className="space-y-1 sm:space-y-1.5">
                            {certificate.requiredDocuments.map((doc, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-xs sm:text-sm md:text-base text-gray-700"
                              >
                                <span className="w-1.5 h-1.5 bg-government-orange rounded-full flex-shrink-0 mt-1.5"></span>
                                <span>{replaceWithMarathiDigits(doc)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div className="flex justify-center mt-auto pt-4">
                      <Link
                        href={
                          certificate.applyOnlineUrl ||
                          "https://aaplesarkar.mahaonline.gov.in/en/Login/Login"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0A1931] hover:bg-[#1A3D63] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-colors duration-200 text-xs sm:text-sm md:text-base whitespace-nowrap"
                      >
                        ऑनलाइन अर्ज करा
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Help Section */}
      </div>
    </main>
  );
}
