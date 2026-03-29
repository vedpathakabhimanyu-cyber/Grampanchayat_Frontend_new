"use client";

import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const ImportantLinks = () => {
  const links = [
    { name: "India.gov.in", url: "https://india.gov.in" },
    { name: "Maharashtra Government", url: "https://maharashtra.gov.in" },
    { name: "Digital India", url: "https://digitalindia.gov.in" },
    { name: "MyGov", url: "https://mygov.in" },
    { name: "PM India", url: "https://pmindia.gov.in" },
    { name: "Make in India", url: "https://makeinindia.com" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-5 py-2.5 flex items-center justify-start space-x-3">
        <FaExternalLinkAlt className="text-xl sm:text-2xl" />
        <h2 className="text-xl sm:text-2xl font-bold">महत्वाचे दुवे</h2>
      </div>
      <div className="p-6">
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors duration-200 text-lg text-government-blue hover:text-government-orange"
              >
                <span className="text-sm">{link.name}</span>
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ImportantLinks;
