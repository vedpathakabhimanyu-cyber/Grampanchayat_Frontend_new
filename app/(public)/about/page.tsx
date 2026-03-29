"use client";

import React from "react";
import Link from "next/link";
import {
  FaHistory,
  FaUsers,
  FaAward,
  FaInfoCircle,
  FaUserTie,
  FaArrowRight,
} from "react-icons/fa";

export default function AboutPage() {
  const subPages = [
    {
      title: "परिचय आणि इतिहास",
      description: "ग्रामपंचायत चा इतिहास, भूगोल आणि सांस्कृतिक वारसा",
      icon: FaInfoCircle,
      link: "/about/introduction",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "प्रशासन",
      description: "ग्रामपंचायत प्रशासन, निवडून आलेले प्रतिनिधी आणि कर्मचारी",
      icon: FaUserTie,
      link: "/about/administration",
      color: "from-orange-400 to-orange-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl rounded-lg mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-[#0A1931] text-white px-5 py-2.5 flex items-center justify-start space-x-3 rounded-lg shadow-md mb-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
            आमच्याबद्दल
          </h3>
        </div>

        {/* Sub-Pages Navigation */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-government-blue mb-6 mt-5"></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subPages.map((page, index) => {
              return (
                <Link href={page.link} key={index}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
                    <div
                      className={`bg-gradient-to-br bg-[#0A1931] text-white flex items-center space-x-2  p-2`}
                    >
                      <h4 className="text-xl sm:text-2xl md:text-2xl font-bold" style={{marginBottom:'-5px', paddingLeft:'10px'}}>
                        {page.title}
                      </h4>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-700 text-sm sm:text-sm md:text-base mb-4">
                        {page.description}
                      </p>
                      <div className="flex items-center text-government-orange font-semibold text-sm sm:text-base">
                        <span className="mr-2">अधिक वाचा</span>
                        <FaArrowRight />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Vision & Mission */}
        <section className="bg-[#B3CFE5] text-[#0A1931] rounded-lg p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4 gap-3">
                <FaAward className="text-xl sm:text-2xl md:text-3xl" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                  आमची दृष्टी
                </h2>
              </div>
              <p className="text-sm sm:text-sm md:text-base leading-relaxed">
                स्वच्छ, समृद्ध आणि आत्मनिर्भर गाव निर्माण करणे हे आमचे ध्येय
                आहे.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-4 gap-3">
                <FaUsers className="text-xl sm:text-2xl md:text-3xl" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                  आमचे ध्येय
                </h2>
              </div>
              <p className="text-sm sm:text-sm md:text-base leading-relaxed">
                सर्व नागरिकांना मूलभूत सुविधा पुरवणे आणि गावाचा सर्वांगीण विकास
                साधणे.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
