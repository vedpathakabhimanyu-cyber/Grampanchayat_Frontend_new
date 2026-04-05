"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import websiteAPI from "@/lib/api";
import {
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Counter from "@/components/Counter";
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

const Footer = () => {
  const [currentDate, setCurrentDate] = useState("");
  const [gpInfo, setGpInfo] = useState<GrampanchayatInfo | null>(null);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("mr-IN"));

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
    <footer className="bg-gradient-to-b from-navy-darkest to-navy-deep text-white mt-12">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-h3 font-bold mb-4 text-navy-light">
              आमच्याबद्दल
            </h3>
            <p className="text-navy-light text-base leading-relaxed opacity-90">
              ग्रामपंचायत {gpInfo?.grampanchayatName || "..."} हे{" "}
              {gpInfo?.talukaName || "..."} तालुक्यातील एक प्रगतिशील गाव आहे.
              आम्ही गावाच्या विकासासाठी आणि नागरिकांच्या कल्याणासाठी कार्यरत
              आहोत.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-h3 font-bold mb-4 text-navy-light">
              द्रुत दुवे
            </h3>
            <ul className="space-y-2 text-base">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  आमच्याबद्दल
                </Link>
              </li>
              <li>
                <Link
                  href="/departments"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  विभाग
                </Link>
              </li>
              <li>
                <Link
                  href="/schemes"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  योजना
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  सेवा
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  संपर्क
                </Link>
              </li>
            </ul>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-h3 font-bold mb-4 text-navy-light">
              महत्वाचे दुवे
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://india.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  India.gov.in
                </a>
              </li>
              <li>
                <a
                  href="https://maharashtra.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Maharashtra Government
                </a>
              </li>
              <li>
                <a
                  href="https://digitalindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Digital India
                </a>
              </li>
              <li>
                <a
                  href="https://mygov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  MyGov
                </a>
              </li>
              <li>
                <a
                  href="https://pmindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  PM India
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-h3 font-bold mb-4 text-navy-light">
              आमच्याशी संपर्क साधा
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-navy-light mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  {gpInfo?.address || (
                    <>
                      ग्रामपंचायत कार्यालय {gpInfo?.grampanchayatName || "..."}
                      <br />
                      तालुका: {gpInfo?.talukaName || "..."}, जिल्हा:{" "}
                      {gpInfo?.districtName || "..."}
                    </>
                  )}
                  {gpInfo?.pincode && (
                    <>
                      <br />
                      पिनकोड: {replaceWithMarathiDigits(gpInfo.pincode)}
                    </>
                  )}
                </span>
              </li>
              {gpInfo?.phone && (
                <li className="flex items-center gap-2">
                  <FaPhone className="text-navy-light rotate-90" />
                  <span className="text-gray-400">
                    {replaceWithMarathiDigits(gpInfo.phone)}
                  </span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-navy-light" />
                <span className="text-gray-400">{gpInfo?.email || "..."}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-base text-gray-400 text-center md:text-left">
              <p>
                © {replaceWithMarathiDigits("2026")}{" "}
                {gpInfo?.grampanchayatName || "..."}. सर्व हक्क राखीव.
              </p>
              <p className="mt-1">
                वेबसाइट निर्माण:{" "}
                <a
                  href="https://ascentaconsulting.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-navy-light text-base hover:text-white"
                >
                  Ascenta consulting
                </a>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.digitalindia.gov.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-sm text-gray-400 hover:text-white">
                  Digital India
                </span>
              </a>
              <span className="text-gray-600">|</span>
              <span className="text-sm text-gray-400">
                शेवटचे अद्यतन: {currentDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
