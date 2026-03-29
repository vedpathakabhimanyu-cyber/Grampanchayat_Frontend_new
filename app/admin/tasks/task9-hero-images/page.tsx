"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { Upload, Trash2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { heroImagesAPI as api } from "@/lib/admin/api";
import { toast } from "sonner";

interface HeroImage {
  id: string;
  image_url: string;
  image_path: string;
  order: number;
  created_at: string;
}

export default function Task9HeroImages() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await api.getAll();
      setHeroImages(response.data || []);

      // Update localStorage for dashboard progress tracking
      localStorage.setItem("task9", JSON.stringify(response.data || []));
      window.dispatchEvent(new Event("taskUpdate"));
    } catch (error) {
      console.error("Failed to fetch hero images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if already have 3 images
    if (heroImages.length >= 3) {
      toast.warning("Maximum 3 hero images allowed. Please delete an existing image first.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      await api.upload(file);
      toast.success("Hero image uploaded successfully!");
      fetchHeroImages();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await api.delete(deletingId);
      toast.success("Hero image deleted successfully!");
      fetchHeroImages();
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete image");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Task 9: Hero Images</h1>
        <p className="text-gray-600">
          Upload up to 3 images for the homepage slider
        </p>
      </div>

      {/* Instructions */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Upload 1 image: Same image will show on all 3 slides</li>
              <li>
                Upload 2 images: First image on slides 1 & 2, second image on
                slide 3
              </li>
              <li>Upload 3 images: Each slide gets a unique image</li>
            </ul>
            <p className="mt-2">
              Maximum file size: 5MB | Recommended size: 1920x500px
            </p>
          </div>
        </div>
      </Card>

      {/* Upload Section */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Hero Images ({heroImages.length}/3)
          </h2>

          {heroImages.length < 3 && (
            <div>
              <input
                type="file"
                id="hero-upload"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
              <label htmlFor="hero-upload">
                <Button className="cursor-pointer" disabled={uploading} asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Uploading..." : "Upload Image"}
                  </span>
                </Button>
              </label>
            </div>
          )}
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : heroImages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">No hero images uploaded yet</p>
            <p className="text-sm text-gray-500">
              Upload your first hero image to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroImages.map((image, index) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={image.image_url}
                    alt={`Hero ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                    Image {index + 1}
                  </div>
                </div>
                <div className="p-3 flex items-center justify-between bg-white">
                  <div className="text-xs text-gray-500">
                    Order: {image.order}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Preview Info */}
      <Card className="p-4 bg-gray-50">
        <h3 className="font-semibold mb-2 text-sm">Current Configuration:</h3>
        <p className="text-sm text-gray-600">
          {heroImages.length === 0 &&
            "No images - default placeholder will be shown"}
          {heroImages.length === 1 && "1 image - Will display on all 3 slides"}
          {heroImages.length === 2 &&
            "2 images - First image on slides 1-2, second on slide 3"}
          {heroImages.length === 3 &&
            "3 images - Each slide has a unique image"}
        </p>
      </Card>

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Hero Image?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. Are you sure?</p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
