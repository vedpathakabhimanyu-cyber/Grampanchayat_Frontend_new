"use client";

import React from "react";
import Link from "next/link";
import { FaFileAlt } from "react-icons/fa";

const Schemes = () => {
  const schemes = [
    {
      id: 1,
      name: "प्रधानमंत्री आवास योजना",
      description: "गरीब कुटुंबांना घर उपलब्ध करून देण्यासाठी",
    },
    {
      id: 2,
      name: "मनरेगा योजना",
      description: "ग्रामीण भागातील रोजगार हमी योजना",
    },
    {
      id: 3,
      name: "स्वच्छ भारत अभियान",
      description: "स्वच्छता आणि शौचालय बांधकाम योजना",
    },
    {
      id: 4,
      name: "पीएम किसान सन्मान निधी",
      description: "शेतकऱ्यांसाठी थेट आर्थिक मदत योजना",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-5 py-3 flex items-center justify-start space-x-3">
        <FaFileAlt className="text-xl md:text-2xl mr-3" />
        <h2 className="text-h2 font-semibold tracking-wide">
          योजना व लाभार्थी
        </h2>
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {schemes.map((scheme) => (
            <li
              key={scheme.id}
              className="border-b border-gray-200 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors duration-200 cursor-pointer"
            >
              <h3 className="font-semibold text-government-blue text-base md:text-lg">
                {scheme.name}
              </h3>
              <p className="text-base text-gray-600">
                {scheme.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Schemes;
