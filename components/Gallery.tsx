"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaImage, FaImages } from "react-icons/fa";
import websiteAPI from "@/lib/api";

interface GalleryImage {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  category?: string;
  createdAt?: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await websiteAPI.getGallery();
        if (response.success && response.data) {
          // Only show first 4 images on homepage
          setImages(response.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section className="my-8 md:my-12 w-full">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1931]/95 to-[#1a2c55]/95 text-white px-4 sm:px-5 md:px-6 py-3 flex items-center justify-start space-x-2 sm:space-x-3 rounded-t-lg shadow-md backdrop-blur-md">
          <FaImages className="text-lg sm:text-xl md:text-2xl text-white flex-shrink-0" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide uppercase truncate">
            फोटो गॅलरी
          </h2>
        </div>

        {/* Gallery Grid */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8 bg-transparent">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
              <p className="mt-2 text-gray-600">लोड होत आहे...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-10">
              <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">फोटो उपलब्ध नाहीत</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(null)}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
                    <Image
                      src={image.imageUrl}
                      alt={image.title || "फोटो"}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <FaImage className="text-white text-2xl sm:text-3xl md:text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                  <div className="p-2 sm:p-3 md:p-4">
                    <h3 className="font-bold text-government-blue mb-0.5 sm:mb-1 line-clamp-1 text-sm sm:text-base md:text-lg">
                      {image.title || "फोटो"}
                    </h3>
                    {image.createdAt && (
                      <p className="text-xs sm:text-sm md:text-base text-gray-500">
                        {new Date(image.createdAt).toLocaleDateString("mr-IN")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View Full Button */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link href="/gallery">
              <button className="inline-block bg-[#0A1931] hover:bg-[#142b4a] text-white font-medium text-sm sm:text-base md:text-lg px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors duration-200">
                संपूर्ण गॅलरी पहा
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
