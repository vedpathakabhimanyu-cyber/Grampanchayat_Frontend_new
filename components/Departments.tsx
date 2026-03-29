"use client";

import React from "react";
import Link from "next/link";
import {
  FaSeedling,
  FaHeartbeat,
  FaFileAlt,
  FaPaw,
  FaRegBuilding,
} from "react-icons/fa";

const Departments = () => {
  const departments = [
    {
      id: 1,
      name: "कृषी विभाग",
      icon: FaSeedling,
      color: "from-green-400 to-green-600",
      description: "शेती आणि कृषी विकास",
      link: "/departments",
    },
    {
      id: 2,
      name: "आरोग्य विभाग",
      icon: FaHeartbeat,
      color: "from-red-400 to-red-600",
      description: "सार्वजनिक आरोग्य सेवा",
      link: "/departments",
    },
    {
      id: 3,
      name: "पशुसंवर्धन",
      icon: FaPaw,
      color: "from-blue-400 to-blue-600",
      description: "पशुपालन आणि दुग्धव्यवसाय",
      link: "/departments",
    },
    {
      id: 4,
      name: "ग्रामसेवक कार्यालय",
      icon: FaFileAlt,
      color: "from-yellow-400 to-yellow-600",
      description: "महसूल आणि प्रशासकीय कामे",
      link: "/departments",
    },
  ];

  return (
    <section className="mb-10 mt-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-5 py-3 flex items-center space-x-3">
          <FaRegBuilding className="text-xl md:text-2xl" />
          <h2 className="text-h2 font-bold">विभाग</h2>
        </div>

        {/* Departments Grid */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <Link href={dept.link} key={dept.id}>
                  <div className="group cursor-pointer flex sm:flex-col items-center sm:items-center justify-start sm:justify-center bg-gray-50 border border-gray-100 rounded-lg p-3 sm:p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${dept.color} flex items-center justify-center text-white shadow-sm sm:shadow-md`}
                    >
                      <Icon className="text-lg sm:text-3xl" />
                    </div>

                    {/* Text */}
                    <div className="ml-3 sm:ml-0 sm:mt-3 flex-1 sm:text-center">
                      <h3 className="text-[#0A1931] font-semibold text-base sm:text-lg">
                        {dept.name}
                      </h3>
                      {/* Description hidden on mobile */}
                      <p className="hidden sm:block text-gray-600 text-base mt-1">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Departments;
