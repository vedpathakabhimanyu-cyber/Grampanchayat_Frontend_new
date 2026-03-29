"use client";

import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { replaceWithMarathiDigits } from "@/lib/utils";

const Helpline = () => {
  const helplines = [
    { name: "आपत्कालीन सेवा", number: "112" },
    { name: "रुग्णवाहिका", number: "102" },
    { name: "पोलीस", number: "100" },
    { name: "अग्निशमन", number: "101" },
    { name: "महिला हेल्पलाईन", number: "1091" },
    { name: "बाल हेल्पलाईन", number: "1098" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-red-600 text-white px-5 py-2.5 flex items-center justify-start space-x-3">
        <FaPhoneAlt className="text-lg sm:text-xl md:text-2xl" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
          आपत्कालीन हेल्पलाईन
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-2">
          {helplines.map((helpline, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded transition-colors duration-200"
            >
              <span className="text-base sm:text-lg md:text-xl text-gray-700">
                {helpline.name}
              </span>
              <span className="font-bold text-base sm:text-lg md:text-xl text-government-blue">
                {replaceWithMarathiDigits(helpline.number)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Helpline;
