"use client";

import React, { useState } from "react";
import ImageUploadCropperAdvanced from "@/components/ImageCropper/ImageUploadCropperAdvanced";

interface CropResult {
  type: string;
  blob: Blob | null;
  timestamp: Date;
}

export default function ImageCropperPage() {
  const [croppedResults, setCroppedResults] = useState<CropResult[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  const handleCropComplete = (type: string) => (blob: Blob) => {
    setCroppedResults([
      ...croppedResults,
      {
        type,
        blob,
        timestamp: new Date(),
      },
    ]);
    console.log(`Cropped image (${type}):`, blob);
  };

  const downloadResult = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const profiles = [
    {
      id: "profile",
      name: "प्रोफाइल चित्र",
      description: "वर्तुळाकार प्रोफाइल चित्रासाठी अनुकूलित",
      props: {
        enableCircularCrop: true,
        aspectRatio: 1,
        maxFileSize: 2,
      },
    },
    {
      id: "hero",
      name: "हीरो इमेज",
      description: "बँनर/हीरो सेक्शनसाठी 16:9 दर",
      props: {
        enableCircularCrop: false,
        aspectRatio: 16 / 9,
        maxFileSize: 5,
      },
    },
    {
      id: "square",
      name: "चौरस इमेज",
      description: "सोशल मीडिया पोस्टसाठी 1:1 दर",
      props: {
        enableCircularCrop: false,
        aspectRatio: 1,
        maxFileSize: 3,
      },
    },
    {
      id: "free",
      name: "मुक्त आकार",
      description: "कोणत्याही आकारात क्रॉप करा",
      props: {
        enableCircularCrop: false,
        aspectRatio: undefined,
        maxFileSize: 5,
      },
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            छायाचित्र अपलोड आणि काटा उपकरण
          </h1>
          <p className="text-gray-600 text-lg">
            विभिन्न वापरण्याचे प्रकार आणि आवश्यकतांसाठी अनुकूलित
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setActiveTab(profile.id)}
                className={`flex-shrink-0 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === profile.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {profile.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className={activeTab === profile.id ? "block" : "hidden"}
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profile.name}
                  </h2>
                  <p className="text-gray-600 mb-6">{profile.description}</p>

                  {/* Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">अधिकतम फाइल आकार</p>
                      <p className="font-semibold text-gray-900">
                        {profile.props.maxFileSize}MB
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">आस्पेक्ट रेशो</p>
                      <p className="font-semibold text-gray-900">
                        {profile.props.aspectRatio
                          ? profile.props.aspectRatio.toFixed(2)
                          : "मुक्त"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">वर्तुळाकार क्रॉप</p>
                      <p className="font-semibold text-gray-900">
                        {profile.props.enableCircularCrop ? "हो" : "नाही"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cropper Component */}
                <ImageUploadCropperAdvanced
                  onCropComplete={handleCropComplete(profile.id)}
                  {...(profile.props as any)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {croppedResults.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              काटलेली छायाचित्रे ({croppedResults.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {croppedResults.map((result, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gray-100 h-48 flex items-center justify-center">
                    {result.blob && (
                      <img
                        src={URL.createObjectURL(result.blob)}
                        alt={`Result ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-semibold">प्रकार:</span>{" "}
                      {result.type}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-semibold">आकार:</span>{" "}
                      {result.blob ? (result.blob.size / 1024).toFixed(2) : "0"}{" "}
                      KB
                    </p>
                    <button
                      onClick={() =>
                        downloadResult(
                          result.blob!,
                          `cropped-${result.type}-${index + 1}.jpg`,
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      डाउनलोड करा
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Results */}
            <button
              onClick={() => setCroppedResults([])}
              className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              सर्व साफ करा
            </button>
          </div>
        )}

        {/* Feature List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              मुख्य वैशिष्ट्ये
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>HTML5 Canvas वापरून उच्च-गुणवत्तेचे क्रॉपिंग</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>जूम, रोटेशन, आणि आस्पेक्ट रेशो नियंत्रण</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>वर्तुळाकार क्रॉप (प्रोफाइल चित्रासाठी)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>RSS-ऑफ ग्रिड लाइनसह संदर्भ</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>फाइल आकार आणि प्रकार सत्यापन</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              मोबाइल समर्थन
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>टच जेस्चर समर्थन (ड्रैग, पिंच जूम)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>प्रतिक्रियाशील डिजाइन सर्व स्क्रीन आकारांसाठी</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>बाधा-मुक्त पहुंच समर्थन</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>42px किमान स्पर्श लक्ष्य आकार</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <span>मार्हार अनुकूलित नियंत्रण</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-12 bg-indigo-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">त्वरित प्रारंभ करा</h3>
          <div className="bg-indigo-700 rounded p-4 font-mono text-sm overflow-x-auto">
            <pre>{`import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function MyComponent() {
  return (
    <ImageUploadCropper
      onCropComplete={(blob) => {
        // blob को सर्वरवर अपलोड करा
        uploadToServer(blob);
      }}
      maxFileSize={5}
      enableCircularCrop={true}
      aspectRatio={1}
    />
  );
}`}</pre>
          </div>
        </div>
      </div>
    </main>
  );
}
