"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import websiteAPI from "@/lib/api";
import { replaceWithMarathiDigits } from "@/lib/utils";

interface GalleryImage {
  id: string;
  imagePath: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  category?: string;
  createdAt?: string;
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: "सर्व फोटो" },
    { id: "events", name: "कार्यक्रम" },
    { id: "development", name: "विकास" },
    { id: "schemes", name: "योजना" },
    { id: "festivals", name: "सण" },
    { id: "office", name: "कार्यालय" },
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await websiteAPI.getGallery();
        if (response.success && response.data) {
          setImages(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
          <h3 className="text-h6 font-bold tracking-wide">
            फोटो गॅलरी
          </h3>
        </div>

        {/* Stats */}

        {/* Image Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1931]"></div>
            <p className="mt-4 text-gray-600 text-lg">लोड होत आहे...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">फोटो उपलब्ध नाहीत</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image.id)}
                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <Image
                    src={image.imageUrl || image.imagePath}
                    alt={image.title || image.description || "फोटो"}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <FaImage className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-government-blue mb-1 line-clamp-1 text-sm sm:text-base">
                    {replaceWithMarathiDigits(image.title || image.description || "फोटो")}
                  </h3>
                  {image.createdAt && (
                    <p className="text-sm text-gray-500">
                      {new Date(image.createdAt).toLocaleDateString("mr-IN")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white text-2xl sm:text-3xl md:text-4xl hover:text-government-orange transition-colors z-10 bg-black/50 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
              onClick={() => setSelectedImage(null)}
            >
              <FaTimes />
            </button>
            {images
              .filter((img) => img.id === selectedImage)
              .map((image) => (
                <div
                  key={image.id}
                  className="max-w-5xl w-full my-auto mx-2 sm:mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative w-full max-h-[60vh] sm:max-h-[70vh] overflow-hidden rounded-t-lg">
                    <Image
                      src={image.imageUrl || image.imagePath}
                      alt={image.title || image.description || "फोटो"}
                      width={1200}
                      height={800}
                      className="w-full h-full object-contain shadow-2xl"
                    />
                  </div>
                  <div className="bg-white p-3 sm:p-4 md:p-6 rounded-b-lg">
                    <h2 className="text-base sm:text-xl md:text-2xl font-bold text-government-blue mb-1 sm:mb-2 break-words">
                      {replaceWithMarathiDigits(image.title || "फोटो")}
                    </h2>
                    {image.description && (
                      <p className="text-sm sm:text-sm text-gray-600 mb-1 sm:mb-2 break-words">
                        {replaceWithMarathiDigits(image.description)}
                      </p>
                    )}
                    {image.createdAt && (
                      <p className="text-sm sm:text-sm text-gray-500">
                        {new Date(image.createdAt).toLocaleDateString("mr-IN")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Upload Section */}
        {/* <div className="mt-12 bg-[#01A3D6] text-white rounded-lg p-6 sm:p-8">
          <div className="max-w-3xl mx-auto text-center">
            <FaImage className="text-5xl sm:text-6xl mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t("gallery.sharePhotos")}
            </h2>
            <p className="text-base sm:text-lg mb-6 opacity-90">
              {t("gallery.shareDescription")}
            </p>
            <button className="bg-white text-government-orange px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
              {t("gallery.uploadPhotos")}
            </button>
          </div>
        </div> */}
      </div>
    </main>
  );
}
