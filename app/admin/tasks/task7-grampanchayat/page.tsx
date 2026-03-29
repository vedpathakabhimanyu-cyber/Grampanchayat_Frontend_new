"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { grampanchayatAPI } from "@/lib/admin/api";
import { toast } from "sonner";

type GrampanchayatInfo = {
  grampanchayatName: string;
  talukaName: string;
  districtName: string;
  phone: string;
  email: string;
  address?: string;
  pincode?: string;
  website?: string;
};

export default function TaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<GrampanchayatInfo>({
    grampanchayatName: "",
    talukaName: "",
    districtName: "",
    phone: "",
    email: "",
  });

  // Load existing data from backend
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await grampanchayatAPI.get();
        if (response) {
          setInfo({
            grampanchayatName: response.grampanchayatName || "",
            talukaName: response.talukaName || "",
            districtName: response.districtName || "",
            phone: response.phone || "",
            email: response.email || "",
            address: response.address || "",
            pincode: response.pincode || "",
            website: response.website || "",
          });
        }
      } catch (error) {
        console.error("Error fetching grampanchayat info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingData();
  }, []);

  const handleChange = (field: keyof GrampanchayatInfo, value: string) => {
    setInfo({ ...info, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !info.grampanchayatName ||
      !info.talukaName ||
      !info.districtName ||
      !info.phone
    ) {
      toast.warning("कृपया सर्व आवश्यक माहिती भरा");
      return;
    }

    // Email validation
    if (info.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
      toast.error("कृपया वैध ईमेल पत्ता टाका");
      return;
    }

    try {
      // Save to backend - use camelCase as expected by the model
      const dataToSend = {
        grampanchayatName: info.grampanchayatName,
        talukaName: info.talukaName,
        districtName: info.districtName,
        phone: info.phone,
        email: info.email,
        address: info.address,
        pincode: info.pincode,
        website: info.website,
      };

      await grampanchayatAPI.save(dataToSend);

      // Also save to localStorage as backup
      localStorage.setItem("task7", JSON.stringify(info));
      const updateEvent = new Event("taskUpdate");
      window.dispatchEvent(updateEvent);

      toast.success("ग्रामपंचायत माहिती यशस्वीरित्या जतन केली!");

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 100);
    } catch (error: any) {
      console.error("Error saving data:", error);
      toast.error("त्रुटी: " + (error.message || "डेटा जतन करताना समस्या आली"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto font-inter">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800 text-center animate-fadeIn">
          कार्य 7: ग्रामपंचायत माहिती
        </h2>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">माहिती लोड होत आहे...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="p-3 sm:p-4 md:p-6 border rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg bg-white hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300 animate-slideIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                {/* Grampanchayat Name */}
                <div className="flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                    ग्रामपंचायत नाव <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={info.grampanchayatName}
                    onChange={(e) =>
                      handleChange("grampanchayatName", e.target.value)
                    }
                    className="w-full border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="ग्रामपंचायत नाव"
                    required
                  />
                </div>

                {/* Taluka Name */}
                <div className="flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                    तालुका नाव <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={info.talukaName}
                    onChange={(e) => handleChange("talukaName", e.target.value)}
                    className="w-full border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="तालुका नाव"
                    required
                  />
                </div>

                {/* District Name */}
                <div className="flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                    जिल्हा नाव <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={info.districtName}
                    onChange={(e) =>
                      handleChange("districtName", e.target.value)
                    }
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="जिल्हा नाव"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                    फोन नंबर <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={info.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="फोन नंबर"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                    ईमेल
                  </label>
                  <input
                    type="email"
                    value={info.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="ईमेल"
                  />
                </div>

                {/* Pincode */}
                <div className="flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                    पिन कोड
                  </label>
                  <input
                    type="text"
                    value={info.pincode || ""}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="पिन कोड"
                    maxLength={6}
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                    पत्ता
                  </label>
                  <textarea
                    value={info.address || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="संपूर्ण पत्ता"
                    rows={3}
                  />
                </div>

                {/* Website */}
                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                    वेबसाइट
                  </label>
                  <input
                    type="url"
                    value={info.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Contact Information - REMOVED, fields are now separate above */}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-all duration-200 hover:scale-105"
              >
                सबमिट करा
              </button>
            </div>
          </form>
        )}

        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.7s ease forwards;
          }
        `}
        </style>
      </div>
    </div>
  );
}
