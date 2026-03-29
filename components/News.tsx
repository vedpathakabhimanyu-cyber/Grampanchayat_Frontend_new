"use client";

import React from "react";
import Link from "next/link";
import { FaNewspaper, FaCalendar } from "react-icons/fa";

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: "स्वच्छता अभियान आयोजन",
      description:
        "आगामी रविवारी गावभर स्वच्छता मोहीम राबवण्यात येणार आहे. सर्व नागरिकांना सहभागी होण्याचे आवाहन.",
      date: "10 मार्च, 2025",
      category: "सामाजिक कार्यक्रम",
    },
    {
      id: 2,
      title: "मुलींसाठी आत्मरक्षण प्रशिक्षण",
      description:
        "गावातील मुलींसाठी मोफत आत्मरक्षण प्रशिक्षण वर्ग सुरू करण्यात आले आहेत. नोंदणी सुरू आहे.",
      date: "8 मार्च, 2025",
      category: "शैक्षणिक",
    },
    {
      id: 3,
      title: "शेतकरी मेळावा",
      description:
        "सेंद्रिय शेती आणि नवीन तंत्रज्ञानावर शेतकरी मेळावा आयोजित करण्यात आला आहे.",
      date: "5 मार्च, 2025",
      category: "शेती",
    },
    {
      id: 4,
      title: "नवीन शाळा इमारत उद्घाटन",
      description:
        "गावातील नवीन प्राथमिक शाळेच्या इमारतीचे उद्घाटन मा. आमदार यांच्या हस्ते होणार आहे.",
      date: "1 मार्च, 2025",
      category: "विकास",
    },
  ];

  return (
    <section className="mb-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-6 py-4 flex items-center">
          <FaNewspaper className="text-lg sm:text-xl md:text-2xl mr-3" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            ताज्या बातम्या आणि घोषणा
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {newsItems.map((news) => (
              <div
                key={news.id}
                className="border-l-4 border-[#0A1931] pl-4 py-3 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base sm:text-lg md:text-xl text-government-blue mb-1">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-base md:text-lg mb-2">
                      {news.description}
                    </p>
                    <div className="flex items-center space-x-4 text-base text-gray-500">
                      <span className="flex items-center">
                        <FaCalendar className="mr-1" />
                        {news.date}
                      </span>
                      <span className="bg-[#0A1931]/10 text-[#0A1931] px-2 py-1 rounded">
                        {news.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/news">
              <button className="text-[#0A1931] hover:text-[#1A3D63] font-semibold transition-colors duration-200 text-base md:text-lg">
                सर्व बातम्या पहा
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
