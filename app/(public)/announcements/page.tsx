"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { websiteAPI } from "@/lib/api";
import { replaceWithMarathiDigits } from "@/lib/utils";
import {
  FaBell,
  FaCalendarAlt,
  FaClipboardList,
  FaClock,
  FaDownload,
  FaEye,
  FaFileExcel,
  FaFilePdf,
  FaFileWord,
  FaImage,
} from "react-icons/fa";

const sections = [
  {
    id: "meetings",
    icon: FaClipboardList,
    color: "blue",
    link: "/announcements/meetings",
    count: 5,
    title: "बैठक सूचना",
    description: "नवीनतम बैठक वेळापत्रक आणि कार्यसूची",
  },
  {
    id: "downloads",
    icon: FaDownload,
    color: "purple",
    link: "/announcements/downloads",
    count: 12,
    title: "डाउनलोड / कॅलेंडर",
    description: "महत्त्वाची कागदपत्रे आणि कार्यक्रम कॅलेंडर",
  },
];

const recentAnnouncements = [
  {
    id: 1,
    date: "2025-10-25",
    title: "मासिक ग्रामसभा बैठक",
    type: "meetings",
  },
  {
    id: 2,
    date: "2025-10-23",
    title: "नवीन जलसंवर्धन मार्गदर्शक तत्त्वे",
    type: "circulars",
  },
  {
    id: 3,
    date: "2025-10-20",
    title: "कर भरणा अंतिम दिनांक",
    type: "deadlines",
  },
];

interface Document {
  id: string;
  title: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  filePath: string;
  category?: string;
}

export default function AnnouncementsPage() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await websiteAPI.getAnnouncements();
        if (response.success && Array.isArray(response.data)) {
          setDocuments(response.data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const getFileIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("pdf")) {
      return <FaFilePdf className="text-red-600" />;
    } else if (lowerType.includes("doc")) {
      return <FaFileWord className="text-blue-600" />;
    } else if (lowerType.includes("xls") || lowerType.includes("excel")) {
      return <FaFileExcel className="text-green-600" />;
    } else if (lowerType.includes("image") || ["jpg", "jpeg", "png", "webp"].some(ext => lowerType.includes(ext))) {
       return <FaImage className="text-purple-600" />;
    }
    return <FaDownload className="text-gray-600" />;
  };

  // Build viewer URL (Google Docs for Word/Excel)
  const getViewerUrl = (doc: Document) => {
    const fileType = doc.fileType.toLowerCase();
    if (fileType.includes("pdf") || fileType.includes("image")) return doc.filePath;
    const fullUrl = doc.filePath.startsWith("http")
      ? doc.filePath
      : `${window.location.origin}${doc.filePath}`;
    return `https://docs.google.com/gview?url=${fullUrl}&embedded=true`;
  };

  // Format date to DD-MM-YYYY
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return replaceWithMarathiDigits(`${day}-${month}-${year}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ------------------ HERO SECTION ------------------ */}
          <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
            <h3 className="text-h6 font-bold tracking-wide">
              परिपत्रक / आदेश
            </h3>
          </div>

          {/* ------------------ DOCUMENTS SECTION ------------------ */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6 space-y-4">
              <p className="text-md font-bold opacity-90">
                परिपत्रक, घोषणा आणि डाउनलोड करण्यायोग्य दस्तऐवज एका ठिकाणी.
              </p>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                  <p className="text-gray-500">माहिती लोड होत आहे...</p>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">कोणतीही घोषणा उपलब्ध नाही.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {["जमा-खर्च", "अर्जांचे नमुने", "दाखले", "स्वयंघोषणापत्रे", "इतर"].map((cat) => {
                    const mainCategories = ["जमा-खर्च", "अर्जांचे नमुने", "दाखले", "स्वयंघोषणापत्रे"];
                    const catDocs = documents.filter(d => 
                      d.category === cat || 
                      (cat === "इतर" && (!d.category || !mainCategories.includes(d.category)))
                    );
                    if (catDocs.length === 0) return null;

                    return (
                      <div key={cat} className="animate-fadeIn">
                        <div className="flex items-center space-x-3 mb-4 border-b pb-2">
                          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                          <h2 className="text-lg font-bold text-[#0A1931]">
                            {cat}
                          </h2>
                          <span className="bg-orange-100 text-orange-600 text-sm px-2 py-1 rounded-full font-semibold">
                            {replaceWithMarathiDigits(catDocs.length)} दस्तऐवज
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {catDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all group"
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                                <div className="flex items-start sm:items-center space-x-4 flex-1">
                                  <div className="p-3 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    {getFileIcon(doc.fileType)}
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {doc.title}
                                    </h3>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <FaCalendarAlt className="text-sm text-gray-400" />
                                      <p className="text-sm text-gray-500">
                                        {formatDate(doc.uploadDate)}
                                      </p>
                                      <span className="text-gray-300">•</span>
                                      <p className="text-sm text-gray-400 font-medium uppercase">
                                        {replaceWithMarathiDigits(doc.fileSize)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2 justify-start sm:justify-end">
                                  <button
                                    onClick={() => setSelectedDoc(doc)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
                                  >
                                    <FaEye />
                                    <span>पहा</span>
                                  </button>

                                  <a
                                    href={doc.filePath}
                                    download
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0A1931] text-white rounded-lg hover:bg-orange-600 transition-all shadow-md"
                                  >
                                    <FaDownload />
                                    <span>डाउनलोड</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ------------------ DOCUMENT VIEWER MODAL ------------------ */}
        {selectedDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 rounded-lg overflow-hidden shadow-xl">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">{selectedDoc.title}</h3>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="p-4">
                {selectedDoc.fileType.toLowerCase().includes("image") ? (
                  <div className="flex justify-center bg-gray-100 p-2 rounded-lg">
                    <img 
                      src={selectedDoc.filePath} 
                      alt={selectedDoc.title} 
                      className="max-w-full max-h-[70vh] object-contain shadow-inner"
                    />
                  </div>
                ) : (
                  <iframe
                    src={getViewerUrl(selectedDoc)}
                    className="w-full h-[70vh]"
                    title={selectedDoc.title}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
