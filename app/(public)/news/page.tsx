"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaNewspaper,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { replaceWithMarathiDigits } from "@/lib/utils";

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "सर्व बातम्या" },
    { id: "schemes", name: "योजना" },
    { id: "events", name: "कार्यक्रम" },
    { id: "announcements", name: "घोषणा" },
    { id: "achievements", name: "उपलब्धी" },
  ];

  const newsItems = [
    {
      id: 1,
      category: "schemes",
      title: "प्रधानमंत्री आवास योजना अंतर्गत नवीन घरांचे वाटप",
      summary:
        "गावातील ५० पात्र कुटुंबांना प्रधानमंत्री आवास योजनेअंतर्गत घरे मिळणार आहेत. यादी ग्रामपंचायत कार्यालयात उपलब्ध.",
      date: "2025-01-05",
      author: "Admin",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
      featured: true,
    },
    {
      id: 2,
      category: "events",
      title: "प्रजासत्ताक दिनाचा भव्य कार्यक्रम आयोजित",
      summary:
        "26 जानेवारीला गावात प्रजासत्ताक दिनाचा भव्य कार्यक्रम आयोजित करण्यात आला. ध्वजारोहण, परेड आणि सांस्कृतिक कार्यक्रमांचे आयोजन.",
      date: "2025-01-03",
      author: "Admin",
      image:
        "https://images.unsplash.com/photo-1611329532752-8f0f81e0be1a?w=800",
      featured: true,
    },
    {
      id: 3,
      category: "announcements",
      title: "पाणीपुरवठा सुधारणा कामे सुरू",
      summary:
        "गावातील पाणीपुरवठा सुधारण्यासाठी नवीन पाईपलाइन बसवण्याचे काम सुरू झाले आहे. कामे १५ दिवसांत पूर्ण होतील.",
      date: "2025-01-02",
      author: "पाणीपुरवठा विभाग",
      image: "https://images.unsplash.com/photo-1548690596-a39d5a3b6ea8?w=800",
      featured: false,
    },
    {
      id: 4,
      category: "achievements",
      title: "स्वच्छ भारत अभियानात राज्यस्तरीय पुरस्कार",
      summary:
        "गावाला स्वच्छता अभियानात उत्कृष्ट कामगिरी बदल राज्यस्तरीय पुरस्काराने गौरवण्यात आले.",
      date: "2024-12-28",
      author: "Admin",
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
      featured: false,
    },
    {
      id: 5,
      category: "schemes",
      title: "मोफत आरोग्य तपासणी शिबीर",
      summary:
        "15 जानेवारीला गावात मोफत आरोग्य तपासणी शिबीराचे आयोजन करण्यात आले. सर्व नागरिकांना उपस्थित राहण्याचे आवाहन.",
      date: "2024-12-25",
      author: "आरोग्य विभाग",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
      featured: false,
    },
    {
      id: 6,
      category: "events",
      title: "शेतकऱ्यांसाठी प्रशिक्षण कार्यक्रम",
      summary:
        "आधुनिक शेती तंत्रज्ञान आणि सेंद्रिय शेतीवर शेतकऱ्यांसाठी तीन दिवसीय प्रशिक्षण कार्यक्रम.",
      date: "2024-12-22",
      author: "कृषी विभाग",
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      featured: false,
    },
    {
      id: 7,
      category: "announcements",
      title: "मालमत्ता कर भरण्याची अंतिम तारीख",
      summary:
        "मालमत्ता कर भरण्याची अंतिम तारीख 31 जानेवारी. वेळेत कर भरा आणि सवलतीचा लाभ घ्या.",
      date: "2024-12-20",
      author: "महसूल विभाग",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
      featured: false,
    },
    {
      id: 8,
      category: "achievements",
      title: "गावातील विद्यार्थ्यांनी मिळवले राष्ट्रीय पुरस्कार",
      summary:
        "गावातील ३ विद्यार्थ्यांना विज्ञान स्पर्धेत राष्ट्रीय पुरस्कार प्राप्त झाले. गावासाठी अभिमानाची बाब.",
      date: "2024-12-18",
      author: "शिक्षण विभाग",
      image:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
      featured: false,
    },
  ];

  const filteredNews =
    selectedCategory === "all"
      ? newsItems
      : newsItems.filter((item) => item.category === selectedCategory);

  const featuredNews = newsItems.filter((item) => item.featured);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
          <h3 className="text-h6 font-bold tracking-wide">
            ताज्या बातम्या
          </h3>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-8">
          <p className="text-sm sm:text-base md:text-lg opacity-90 text-gray-700">
            ग्रामपंचायत मधील सर्व महत्त्वाच्या बातम्या, कार्यक्रम, योजना आणि
            घोषणांची माहिती येथे मिळवा.
          </p>
        </div>

        {/* Featured News */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-government-blue mb-6">
            मुख्य बातम्या
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredNews.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-[#0A1931] text-white px-3 py-1 rounded-full text-sm sm:text-sm font-semibold">
                    मुख्य
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap items-center gap-3 text-sm sm:text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {new Date(news.date).toLocaleDateString("mr-IN")}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUser />
                      {news.author}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-government-blue mb-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-700 mb-4 text-sm sm:text-base">
                    {replaceWithMarathiDigits(news.summary)}
                  </p>
                  <button className="flex items-center gap-2 text-[#0A1931] hover:text-[#1A3D63] font-semibold transition-colors duration-200 text-sm sm:text-base">
                    अधिक वाचा
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                  selectedCategory === category.id
                    ? "bg-[#0A1931] text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* All News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt />
                    {new Date(news.date).toLocaleDateString("mr-IN")}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUser />
                    {news.author}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-government-blue mb-2 line-clamp-2">
                  {replaceWithMarathiDigits(news.title)}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-3 text-sm sm:text-sm">
                  {replaceWithMarathiDigits(news.summary)}
                </p>
                <button className="flex items-center gap-2 text-government-orange hover:text-government-blue font-semibold transition-colors text-sm">
                  अधिक वाचा
                  <FaArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 bg-[#01A3D6] text-white rounded-lg p-6 sm:p-8">
          <div className="max-w-3xl mx-auto text-center">
            <FaNewspaper className="text-5xl sm:text-6xl mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              वृत्तपत्र सदस्यता घ्या
            </h2>
            <p className="text-base sm:text-lg mb-6 opacity-90">
              सर्व ताज्या बातम्या आणि अपडेट्स तुमच्या ईमेलवर मिळवा
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="तुमचा ईमेल पत्ता"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-government-orange px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                सदस्यता घ्या
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
