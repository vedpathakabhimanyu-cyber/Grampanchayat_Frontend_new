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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
          <h3 className="text-h6 font-bold tracking-wide">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {certificates.map((certificate) => {
              return (
                <div
                  key={certificate.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className={`bg-[#0A1931] opacity-95 p-2 sm:p-3 text-white`}
                  >
                    <div className="flex items-center gap-4">
                      <FaCertificate className="text-2xl" />
                      <div>
                        <h2 className="text-base sm:text-lg md:text-xl font-bold">
                          {certificate.certificateName}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <p className="text-gray-700 mb-4 text-sm sm:text-sm md:text-base">
                      {replaceWithMarathiDigits(certificate.certificateDescription)}
                    </p>

                    {certificate.requiredDocuments &&
                      certificate.requiredDocuments.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-bold text-government-blue mb-2 text-sm sm:text-base md:text-lg">
                            आवश्यक कागदपत्रे
                          </h3>
                          <ul className="space-y-1">
                            {certificate.requiredDocuments.map((doc, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2 text-sm sm:text-sm md:text-base text-gray-700"
                              >
                                <span className="w-1.5 h-1.5 bg-government-orange rounded-full"></span>
                                {replaceWithMarathiDigits(doc)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                    <div className="flex justify-center">
                      <Link
                        href={
                          certificate.applyOnlineUrl ||
                          "https://aaplesarkar.mahaonline.gov.in/en/Login/Login"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0A1931] hover:bg-[#1A3D63] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-sm md:text-base"
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
