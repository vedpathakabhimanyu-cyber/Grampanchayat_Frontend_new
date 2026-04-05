"use client";

import React, { useState, useEffect } from "react";
import { websiteAPI } from "@/lib/api";
import Image from "next/image";
import {
  Landmark,
  FileText,
  QrCode,
  Download,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { replaceWithMarathiDigits } from "@/lib/utils";

interface TaxPaymentData {
  qrFileUrl?: string;
  taxInfo: string;
  bankName: string;
  accountName: string;
  accountNo: string;
  ifscCode: string;
  upiId?: string;
}

interface GrampanchayatInfo {
  grampanchayatName?: string;
  talukaName?: string;
  districtName?: string;
}

export default function TaxPaymentPublicPage() {
  const [data, setData] = useState<TaxPaymentData | null>(null);
  const [gpInfo, setGpInfo] = useState<GrampanchayatInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taxResponse, gpResponse] = await Promise.all([
          websiteAPI.getTaxPayment(),
          websiteAPI.getGrampanchayatInfo(),
        ]);

        if (taxResponse.success && taxResponse.data) {
          setData(taxResponse.data);
        }

        if (gpResponse.success && gpResponse.data) {
          setGpInfo(gpResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch tax payment info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1931]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-12 mt-5">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
          <h3 className="text-h6 font-bold tracking-wide">कर भरणी</h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <p className="text-blue-900/70 text-sm md:text-base">
            तुमचा ग्रामपंचायत कर ऑनलाइन भरण्यासाठी खालील माहितीचा वापर करा.
            डिजिटल इंडिया मोहिमेला साथ द्या.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: QR Code Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-24">
              <div className="bg-[#0A1931] p-5 text-white flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <QrCode size={24} />
                  स्कॅन करून पैसे भरा
                </h2>
              </div>
              <div className="p-8 flex flex-col items-center">
                {data?.qrFileUrl ? (
                  <div className="relative w-full aspect-square bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-inner group transition-all duration-300 hover:shadow-lg">
                    {data.qrFileUrl.toLowerCase().endsWith(".pdf") ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <FileText className="h-24 w-24 text-red-500 mb-4" />
                        <p className="text-sm font-semibold text-gray-700 text-center">
                          PDF माहिती दस्तऐवज
                        </p>
                        <a
                          href={data.qrFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 bg-[#0A1931] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition-colors"
                        >
                          <Download size={18} /> फाईल पहा
                        </a>
                      </div>
                    ) : (
                      <>
                        <Image
                          src={data.qrFileUrl}
                          alt="Tax Payment QR Code"
                          fill
                          className="object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl backdrop-blur-[2px]">
                          <a
                            href={data.qrFileUrl}
                            download
                            className="bg-white text-[#0A1931] px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                          >
                            <Download size={18} /> डाऊनलोड करा
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full aspect-square bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                    <QrCode size={64} className="mb-4 opacity-20" />
                    <p className="text-sm">QR कोड उपलब्ध नाही</p>
                  </div>
                )}

                <div className="mt-8 w-full">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <ShieldCheck className="text-blue-600 flex-shrink-0" />
                    <p className="text-sm text-blue-800 font-medium">
                      कृपया स्कॅन करताना {data?.upiId && `(${data.upiId})`} हे
                      नाव असल्याची खात्री करा.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tax Info & Bank Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tax Info Box */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-[#0A1931] p-5 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText size={20} />
                  कर देयकासंबंधी महत्त्वाची माहिती
                </h2>
              </div>
              <div className="p-8">
                {data?.taxInfo ? (
                  <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-base md:text-lg italic font-medium border-l-4 border-[#0A1931] pl-6 bg-gray-50 py-4 rounded-r-lg">
                    {data.taxInfo}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">माहिती उपलब्ध नाही.</p>
                )}
              </div>
            </div>

            {/* Bank Details Box */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-[#0A1931] p-5 text-white">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Landmark size={20} />
                  बँक खाते तपशील (NEFT/RTGS साठी)
                </h2>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                      <div className="bg-blue-50 p-3 rounded-lg text-[#0A1931]">
                        <Landmark size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                          बँकेचे नाव
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {data?.bankName || "माहिती उपलब्ध नाही"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                      <div className="bg-blue-50 p-3 rounded-lg text-[#0A1931]">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                          खाते नाव
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {data?.accountName || "माहिती उपलब्ध नाही"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                      <div className="bg-blue-50 p-3 rounded-lg text-[#0A1931]">
                        <FileText size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                          खाते क्रमांक
                        </p>
                        <p className="text-xl font-black text-gray-900 tracking-wider font-mono bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
                          {replaceWithMarathiDigits(data?.accountNo) || "..."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                      <div className="bg-blue-50 p-3 rounded-lg text-[#0A1931]">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">
                          IFSC कोड
                        </p>
                        <p className="text-xl font-black text-gray-900 tracking-wider font-mono bg-gray-100 px-3 py-1 rounded-md border border-gray-200">
                          {data?.ifscCode || "..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
