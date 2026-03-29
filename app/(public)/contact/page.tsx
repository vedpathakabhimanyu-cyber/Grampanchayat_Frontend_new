"use client";

import React, { useState, useEffect } from "react";
import websiteAPI from "@/lib/api";
import { toast } from "sonner";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPaperPlane,
} from "react-icons/fa";
import Link from "next/link";
import { replaceWithMarathiDigits } from "@/lib/utils";

interface GrampanchayatInfo {
  grampanchayatName?: string;
  talukaName?: string;
  districtName?: string;
  phone?: string;
  email?: string;
  address?: string;
  pincode?: string;
  website?: string;
}

export default function ContactPage() {
  const [gpInfo, setGpInfo] = useState<GrampanchayatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const fetchGPInfo = async () => {
      try {
        const response = await websiteAPI.getGrampanchayatInfo();
        if (response.success && response.data) {
          setGpInfo(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch GP info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGPInfo();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    toast.success("तुमचा संदेश पाठवला गेला आहे. आम्ही लवकरच तुमच्याशी संपर्क साधू.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
          <h3 className="text-h6 font-bold tracking-wide">
            आमच्याशी संपर्क साधा
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {loading ? (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
                <p className="mt-2 text-gray-600 text-sm">
                  माहिती लोड होत आहे...
                </p>
              </div>
            ) : (
              <>
                {/* Office Address */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-50 text-[#0A1931] w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-government-blue text-h3">
                        पत्ता
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-sm md:text-base">
                        {gpInfo?.address || (
                          <>
                            {gpInfo?.grampanchayatName || "..."}
                            <br />
                            तालुका: {gpInfo?.talukaName || "..."}, जिल्हा:{" "}
                            {gpInfo?.districtName || "..."}
                          </>
                        )}
                        <br />
                        पिनकोड: {replaceWithMarathiDigits(gpInfo?.pincode) || "..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                {gpInfo?.phone && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-50 text-[#059669] w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-green-100">
                        <FaPhone className="text-xl rotate-90" />
                      </div>
                      <div>
                        <h3 className="font-bold text-government-blue text-base sm:text-lg md:text-xl">
                          दूरध्वनी
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-sm md:text-base">
                          {replaceWithMarathiDigits(gpInfo.phone)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start gap-4">
                      <div className="bg-orange-50 text-[#f97316] w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-orange-100">
                        <FaEnvelope className="text-xl" />
                      </div>
                    <div>
                      <h3 className="font-bold text-government-blue text-h3">
                        ईमेल
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-sm md:text-base break-all">
                        {gpInfo?.email || "..."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-start gap-4">
                      <div className="bg-red-50 text-[#ef4444] w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-red-100">
                        <FaClock className="text-xl" />
                      </div>
                    <div>
                      <h3 className="font-bold text-government-blue text-base sm:text-lg md:text-xl">
                        कार्यालयीन वेळ
                      </h3>
                      <p className="text-gray-700 text-sm sm:text-sm md:text-base">
                        सोमवार ते शनिवार
                        <br />
                        सकाळी ९:४५ ते संध्याकाळी ६:१५
                        <br />
                        <span className="text-red-500 font-semibold">
                          रविवार आणि सुट्टीच्या दिवशी बंद
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
              <h2 className="text-h2 font-bold text-government-blue mb-15" style={{marginBottom:"15px"}}>
दाखला मागणी, सूचना / तक्रार साठी  संदेश पाठवा              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                      संपूर्ण नाव <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-government-blue focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="तुमचे नाव टाका"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                      ईमेल <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-government-blue focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="तुमचा ईमेल टाका"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                      दूरध्वनी क्रमांक <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-government-blue focus:outline-none transition-colors text-sm sm:text-base"
                      placeholder="तुमचा फोन नंबर टाका"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                      विषय <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-government-blue focus:outline-none transition-colors text-sm sm:text-base"
                    >
                      <option value="">विषय निवडा</option>
                      <option value="general">सामान्य चौकशी</option>
                      <option value="complaint">तक्रार</option>
                      <option value="suggestion">सूचना</option>
                      <option value="certificate">प्रमाणपत्र</option>
                      <option value="scheme">योजना</option>
                      <option value="other">इतर</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                    संदेश <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-government-blue focus:outline-none transition-colors resize-none text-sm sm:text-base"
                    placeholder="तुमचा संदेश लिहा"
                  ></textarea>
                </div>

                <Link
                  type="submit"
                  href={`mailto:${gpInfo?.email || ""}`}
                  className="w-full bg-[#0A1931] hover:bg-[#1A3D63] text-white px-6 py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg transition-colors duration-200 flex items-center justify-center gap-3"
                >
                  <FaPaperPlane />
                  दाखला मागणी, सूचना / तक्रार साठी  संदेश पाठवा
                </Link>
              </form>
            </div>
          </div>
        </div>
        {/* Map Section */}
        {/* <div className="w-full px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 bg-[#0A1931] text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                स्थान नकाशा
              </h3>
            </div>
            <div className="w-full aspect-[3/2] bg-gray-200 relative overflow-hidden">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1931]"></div>
                </div>
              ) : (
                <iframe
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${gpInfo?.grampanchayatName || ""} ${
                      gpInfo?.talukaName || ""
                    } ${gpInfo?.districtName || ""} Maharashtra`
                  )}&t=m&z=15&output=embed&iwloc=near`}
                  title={`${gpInfo?.grampanchayatName || ""} ${
                    gpInfo?.talukaName || ""
                  } ${gpInfo?.districtName || ""} Maharashtra`}
                  aria-label={`${gpInfo?.grampanchayatName || ""} ${
                    gpInfo?.talukaName || ""
                  } ${gpInfo?.districtName || ""} Maharashtra`}
                  className="absolute top-0 left-0 w-full h-full border-0"
                ></iframe>
              )}
            </div>
          </div>
        </div> */}
        {/* Emergency Contact */}
        {/* <div className="mt-8 bg-red-500 text-white rounded-lg p-6 sm:p-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t("contact.emergencyContact")}
            </h2>
            <p className="text-base sm:text-lg mb-6">
              {t("contact.emergencyText") ||
                "For urgent matters, please call our emergency helpline"}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-xl sm:text-2xl font-bold">
              <FaPhone className="text-3xl sm:text-4xl rotate-90" />
              <span>1800-XXX-XXXX ({t("contact.tollFree")})</span>
            </div>
          </div>
        </div> */}
      </div>
    </main>
  );
}
