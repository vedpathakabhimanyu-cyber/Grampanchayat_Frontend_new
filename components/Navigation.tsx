"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    { name: "मुख्यपृष्ठ", href: "/", hasDropdown: false },
    {
      name: "आमच्याबद्दल",
      href: "/about",
      hasDropdown: true,
      dropdownItems: [
        { name: "परिचय आणि इतिहास", href: "/about/introduction" },
        { name: "प्रशासन", href: "/about/administration" },
      ],
    },
    { name: "सेवा", href: "/services", hasDropdown: false },
    { name: "परिपत्रक / आदेश", href: "/announcements", hasDropdown: false },
    { name: "गॅलरी", href: "/gallery", hasDropdown: false },
    { name: "प्रकल्प / काम", href: "/projects", hasDropdown: false },
    { name: "कर भरणी", href: "/tax-payment", hasDropdown: false },
    { name: "संपर्क", href: "/contact", hasDropdown: false },
    { name: "प्रशासन लॉगिन", href: "/admin/login", hasDropdown: false, isAdmin: true },
  ];

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <nav className="bg-[#0A1931] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="hidden md:flex space-x-1 w-full justify-center text-base lg:text-lg font-medium">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() =>
                  item.hasDropdown && setActiveDropdown(item.name)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`px-3 py-1.5 transition-colors duration-200 flex items-center space-x-1 rounded ${
                    item.isAdmin 
                      ? "bg-[#1A3D63] border border-[#4A7FA7] hover:bg-[#2A5068] font-bold text-white ml-2" 
                      : "hover:bg-[#11264d]"
                  }`}
                >
                  <span>{item.name}</span>
                  {item.hasDropdown && <FaChevronDown className="text-sm" />}
                </Link>
                {item.hasDropdown && activeDropdown === item.name && (
                  <div className="absolute left-0 mt-0 w-56 bg-[#e6ecf8] text-[#0A1931] rounded-md shadow-lg overflow-hidden">
                    {item.dropdownItems?.map((dropItem) => (
                      <Link
                        key={dropItem.name}
                        href={dropItem.href}
                        className="block px-4 py-2 hover:bg-[#d8e1f3] border-b border-[#cfd8eb] last:border-0 text-base"
                      >
                        {dropItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="md:hidden flex justify-center items-center w-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden pb-3">
            {menuItems.map((item) => (
              <div key={item.name}>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (!item.hasDropdown) setIsOpen(false);
                        else setActiveDropdown(null);
                      }}
                      className="flex-1 px-4 py-2 hover:bg-[#11264d] text-sm transition-colors duration-200 text-left"
                    >
                      {item.name}
                    </Link>
                    {item.hasDropdown && (
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="px-4 py-2 focus:outline-none"
                      >
                        {activeDropdown === item.name ? (
                          <FaChevronUp className="text-sm" />
                        ) : (
                          <FaChevronDown className="text-sm" />
                        )}
                      </button>
                    )}
                  </div>
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div className="pl-6 bg-[#09152f]/70">
                      {item.dropdownItems?.map((dropItem) => (
                        <Link
                          key={dropItem.name}
                          href={dropItem.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-[#11264d] transition-colors"
                        >
                          {dropItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
