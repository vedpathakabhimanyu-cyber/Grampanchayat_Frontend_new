"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import websiteAPI from "@/lib/api";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface HeroImage {
  id: string;
  image_url: string;
  order: number;
}

interface Suggestion {
  title: string;
  title_mr: string;
  url: string;
}

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [villageName, setVillageName] = useState("...");
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);

  // Fetch grampanchayat info
  useEffect(() => {
    const fetchGrampanchayatInfo = async () => {
      try {
        const response = await websiteAPI.getGrampanchayatInfo();
        console.log("Grampanchayat API Response:", response); // Debug log
        if (response.success && response.data) {
          // Check for both villageName and grampanchayatName
          const name =
            response.data.villageName || response.data.grampanchayatName;
          if (name) {
            setVillageName(name);
            console.log("Village name set to:", name); // Debug log
          }
        }
      } catch (error) {
        console.error("Failed to fetch grampanchayat info:", error);
      }
    };

    fetchGrampanchayatInfo();
  }, []);

  // Fetch hero images
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await websiteAPI.getHeroImages();

        if (response.success && Array.isArray(response.data)) {
          setHeroImages(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch hero images:", error);
        // On error, set empty array to use default images
        setHeroImages([]);
      }
    };

    fetchHeroImages();
  }, []);

  // Generate slides based on hero images
  useEffect(() => {
    const defaultSlides: Slide[] = [
      {
        id: 1,
        title: `ग्रामपंचायत ${villageName} मध्ये आपले स्वागत!`,
        description: "आपल्या गावाचा विकास, आपली जबाबदारी",
        image: "/images/hero1.jpg",
      },
      {
        id: 2,
        title: "डिजिटल ग्रामपंचायत",
        description: "तंत्रज्ञानाद्वारे पारदर्शकता आणि कार्यक्षमता",
        image: "/images/hero1.jpg",
      },
      {
        id: 3,
        title: "नागरिक सेवा",
        description: "सर्व सेवा एकाच ठिकाणी उपलब्ध",
        image: "/images/hero1.jpg",
      },
    ];

    if (heroImages.length === 0) {
      // No hero images uploaded, use default
      setSlides(defaultSlides);
    } else if (heroImages.length === 1) {
      // 1 image: same image on all 3 slides
      const image = heroImages[0].image_url;
      setSlides(
        defaultSlides.map((slide) => ({
          ...slide,
          image: image,
        }))
      );
    } else if (heroImages.length === 2) {
      // 2 images: first on slides 1 & 2, second on slide 3
      const image1 = heroImages[0].image_url;
      const image2 = heroImages[1].image_url;
      setSlides([
        { ...defaultSlides[0], image: image1 },
        { ...defaultSlides[1], image: image1 },
        { ...defaultSlides[2], image: image2 },
      ]);
    } else {
      // 3 images: each slide gets unique image
      const image1 = heroImages[0].image_url;
      const image2 = heroImages[1].image_url;
      const image3 = heroImages[2].image_url;
      setSlides([
        { ...defaultSlides[0], image: image1 },
        { ...defaultSlides[1], image: image2 },
        { ...defaultSlides[2], image: image3 },
      ]);
    }
  }, [heroImages, villageName]);

  const pages: Suggestion[] = [
    { title: "Home", title_mr: "मुख्यपृष्ठ", url: "/" },
    {
      title: "About the Gram Panchayat",
      title_mr: "ग्रामपंचायतबद्दल",
      url: "/about",
    },
    {
      title: "Schemes & Beneficiaries",
      title_mr: "योजना व लाभार्थी",
      url: "/schemes",
    },
    {
      title: "Village Development",
      title_mr: "गाव विकास",
      url: "/development",
    },
    { title: "Contact Us", title_mr: "संपर्क करा", url: "/contact" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = pages.filter(
      (page) =>
        page.title.toLowerCase().includes(query) ||
        page.title_mr.toLowerCase().includes(query)
    );
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (url: string) => {
    window.location.href = url;
  };

  // Don't render until slides are ready
  if (slides.length === 0) {
    return (
      <div className="relative h-[400px] md:h-[500px] bg-gray-200 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/50 z-10"></div>

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-h1 font-bold mb-4 animate-fade-in uppercase tracking-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-2xl mx-auto opacity-90">
            {slides[currentSlide].description}
          </p>

          <div className="flex flex-row justify-center gap-3 mb-4 w-full max-w-xs sm:max-w-none sm:flex-row sm:gap-4">
            <Link href="/about" className="flex-1 sm:flex-initial">
              <button className="w-full bg-[#0A1931] hover:bg-[#142b4a] text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
                आमच्याबद्दल
              </button>
            </Link>
            <Link href="/contact" className="flex-1 sm:flex-initial">
              <button className="w-full bg-white hover:bg-gray-100 text-[#0A1931] px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
                संपर्क साधा
              </button>
            </Link>
          </div>

          <div className="w-full max-w-lg relative mt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="शोधा..."
              className="w-full border border-[#f7f7f8] bg-white/50 text-black rounded-full py-2 sm:py-3 px-4 sm:px-5 pr-10 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-[#87898e] shadow-md placeholder-black text-base"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#0A1931] hover:text-black"
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {suggestions.length > 0 && (
              <div className="absolute mt-2 w-full bg-white/20 backdrop-blur-md shadow-lg rounded-lg overflow-hidden z-30 border border-white/30">
                {suggestions.map((s, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(s.url)}
                    className="px-4 py-2 hover:bg-white/30 cursor-pointer"
                  >
                    <p className="text-white font-medium text-sm sm:text-base">
                      {s.title_mr}
                    </p>
                    <p className="text-gray-200 text-sm sm:text-sm">
                      {s.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-orange-500 w-8"
                  : "bg-white/50"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
