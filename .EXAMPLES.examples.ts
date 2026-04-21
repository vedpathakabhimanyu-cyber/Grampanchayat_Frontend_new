/**
 * Image Cropper Integration Examples
 * 
 * This file demonstrates various ways to use the ImageUploadCropper component
 * and the useImageCropper hook in your Grampanchayat project.
 */

// ============================================================================
// EXAMPLE 1: Basic Component Usage
// ============================================================================

import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export const BasicExample = () => {
  return (
    <ImageUploadCropper
      onCropComplete={(blob) => {
        console.log("Cropped image:", blob);
      }}
      maxFileSize={5}
    />
  );
};

// ============================================================================
// EXAMPLE 2: Profile Picture Upload
// ============================================================================

import { useState } from "react";

export const ProfilePictureUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleCropComplete = async (blob: Blob) => {
    setUploadStatus("अपलोड होत आहे...");

    try {
      const formData = new FormData();
      formData.append("file", blob, "profile.jpg");
      formData.append("userId", localStorage.getItem("userId") || "");

      const response = await fetch("/api/user/profile-picture", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("✓ प्रोफाइल छायाचित्र अपडेट झाले!");
        console.log("Upload result:", data);
      } else {
        setUploadStatus("✗ अपलोड अयशस्वी");
      }
    } catch (error) {
      setUploadStatus("✗ त्रुटी: " + (error as Error).message);
    }
  };

  return (
    <div>
      <ImageUploadCropper
        onCropComplete={handleCropComplete}
        maxFileSize={2}
        aspectRatio={1} // 1:1 square for profile pics
      />
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </div>
  );
};

// ============================================================================
// EXAMPLE 3: Hero Image Upload with 16:9 Aspect Ratio
// ============================================================================

export const HeroImageUpload = () => {
  const handleCropComplete = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", blob, "hero-image.jpg");
      formData.append("projectId", new URLSearchParams(location.search).get("projectId") || "");

      const response = await fetch("/api/projects/hero-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("हीरो छायाचित्र यशस्वीरित्या अपलोड झाले!");
        // Refresh project data
        window.location.reload();
      }
    } catch (error) {
      alert("त्रुटी: " + (error as Error).message);
    }
  };

  return (
    <ImageUploadCropper
      onCropComplete={handleCropComplete}
      maxFileSize={8}
      aspectRatio={16 / 9} // Widescreen for hero images
    />
  );
};

// ============================================================================
// EXAMPLE 4: Gallery Image Upload with Custom Aspect Ratio
// ============================================================================

interface GalleryUploadProps {
  onSuccess?: () => void;
}

export const GalleryImageUpload: React.FC<GalleryUploadProps> = ({
  onSuccess,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleCropComplete = async (blob: Blob) => {
    setIsUploading(true);

    try {
      // Compress image before upload
      const compressedBlob = await compressImage(blob, 1920, 1080, 0.85);

      const formData = new FormData();
      formData.append("file", compressedBlob, "gallery-image.jpg");
      formData.append("title", "नवीन छायाचित्र");
      formData.append("categoryId", "");

      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (response.ok) {
        alert("गॅलरी छायाचित्र अपलोड झाले!");
        if (onSuccess) onSuccess();
      } else {
        alert("अपलोड अयशस्वी");
      }
    } catch (error) {
      alert("त्रुटी: " + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <ImageUploadCropper
        onCropComplete={handleCropComplete}
        maxFileSize={10}
        // No aspect ratio - free crop
      />
      {isUploading && <p className="text-center mt-4">अपलोड होत आहे...</p>}
    </div>
  );
};

// ============================================================================
// EXAMPLE 5: Using the useImageCropper Hook
// ============================================================================

import { useImageCropper, compressImage } from "@/hooks/useImageCropper";

export const HookExample = () => {
  const {
    originalImage,
    croppedImage,
    error,
    success,
    isLoading,
    uploadImage,
    cropImage,
    downloadImage,
    uploadToServer,
    reset,
  } = useImageCropper({
    maxFileSize: 5,
    aspectRatio: 1,
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handleCrop = async () => {
    if (!originalImage) return;

    const cropArea = { x: 50, y: 50, width: 200, height: 200 };
    const blob = await cropImage(originalImage, cropArea, 0, 1);

    if (blob) {
      // Option 1: Download locally
      downloadImage(blob, "my-cropped-image.jpg");

      // Option 2: Upload to server
      try {
        const result = await uploadToServer(blob, "/api/images");
        console.log("Upload result:", result);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">छायाचित्र व्यवस्थापन</h2>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
      {success && <div className="p-3 bg-green-100 text-green-700 rounded mb-4">{success}</div>}

      {!originalImage ? (
        <label className="block p-8 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <input
            type="file"
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <p className="text-center text-gray-600">
            छायाचित्र निवडण्यासाठी क्लिक करा किंवा आकर्षण करा
          </p>
        </label>
      ) : (
        <div className="space-y-4">
          <img
            src={originalImage}
            alt="Original"
            className="w-full rounded border"
          />
          <button
            onClick={handleCrop}
            disabled={isLoading}
            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "प्रक्रिया होत आहे..." : "छायाचित्र काटा"}
          </button>
        </div>
      )}

      {croppedImage && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">काटलेले छायाचित्र</h3>
          <img src={croppedImage} alt="Cropped" className="w-full rounded border" />
        </div>
      )}

      <button
        onClick={reset}
        className="mt-4 p-2 text-gray-600 hover:text-gray-900"
      >
        रिसेट करा
      </button>
    </div>
  );
};

// ============================================================================
// EXAMPLE 6: Admin Dashboard - Multiple Image Types
// ============================================================================

interface AdminImageManagerProps {
  imageType: "profile" | "hero" | "gallery" | "document";
}

export const AdminImageManager: React.FC<AdminImageManagerProps> = ({
  imageType,
}) => {
  interface AspectRatioConfig {
    profile: number;
    hero: number;
    gallery: number;
    document: number;
  }

  const aspectRatios: AspectRatioConfig = {
    profile: 1, // 1:1 square
    hero: 16 / 9, // Widescreen
    gallery: 4 / 3, // Standard
    document: 8.5 / 11, // A4 letter
  };

  const fileSizes = {
    profile: 2,
    hero: 8,
    gallery: 5,
    document: 10,
  };

  const handleCropComplete = async (blob: Blob) => {
    const endpoint = {
      profile: "/api/admin/profile-image",
      hero: "/api/admin/hero-image",
      gallery: "/api/admin/gallery-image",
      document: "/api/admin/document-image",
    };

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("type", imageType);

    try {
      const response = await fetch(endpoint[imageType], {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}`,
        },
      });

      if (response.ok) {
        alert(`${imageType} छायाचित्र यशस्वीरित्या अपलोड झाले!`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <ImageUploadCropper
      onCropComplete={handleCropComplete}
      maxFileSize={fileSizes[imageType]}
      aspectRatio={
        imageType !== "gallery" ? aspectRatios[imageType] : undefined
      }
    />
  );
};

// ============================================================================
// EXAMPLE 7: Form Integration with Formik/React Hook Form
// ============================================================================

import { useForm } from "react-hook-form";

interface ProjectFormData {
  title: string;
  description: string;
  image: File | Blob | null;
}

export const FormWithImageUpload = () => {
  const { register, handleSubmit, setValue } = useForm<ProjectFormData>({
    defaultValues: {
      image: null,
    },
  });

  const handleImageCrop = (blob: Blob) => {
    // Set the cropped image in form state
    setValue("image", blob);
  };

  const onSubmit = async (data: ProjectFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image, "project-image.jpg");
    }

    const response = await fetch("/api/projects", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("प्रकल्प यशस्वीरित्या तयार झाला!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("title")}
        placeholder="प्रकल्प शीर्षक"
        className="w-full p-2 border rounded"
      />

      <textarea
        {...register("description")}
        placeholder="वर्णन"
        className="w-full p-2 border rounded h-24"
      />

      <ImageUploadCropper
        onCropComplete={handleImageCrop}
        maxFileSize={5}
        aspectRatio={16 / 9}
      />

      <button
        type="submit"
        className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
      >
        प्रकल्प जमा करा
      </button>
    </form>
  );
};

// ============================================================================
// EXAMPLE 8: Utility Functions Usage
// ============================================================================

import { validateImageFile, compressImage as compressImageUtil } from "@/hooks/useImageCropper";

export const UtilityFunctionsExample = async () => {
  // Validate image file
  const file = /* file from input */ new File([], "test.jpg", {
    type: "image/jpeg",
  });

  const validation = validateImageFile(file, {
    maxSize: 5,
    allowedTypes: ["image/jpeg", "image/png"],
  });

  if (!validation.valid) {
    console.error(validation.error);
    return;
  }

  // Compress image
  const blob = await compressImageUtil(file, 1920, 1080, 0.8);
  console.log(`Original: ${file.size}, Compressed: ${blob.size}`);

  // Upload compressed blob
  const formData = new FormData();
  formData.append("file", blob, "compressed-image.jpg");

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
};

// ============================================================================
// EXAMPLE 9: Modal/Dialog Integration
// ============================================================================

import { useState } from "react";

export const ImageCropperModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCropComplete = (blob: Blob) => {
    console.log("Image cropped:", blob);
    setIsOpen(false);
    // Handle the blob - save to state, upload, etc.
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 bg-blue-600 text-white rounded"
      >
        छायाचित्र अपलोड करा
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">छायाचित्र काटा</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <ImageUploadCropper
                onCropComplete={(blob) => {
                  handleCropComplete(blob);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================================================
// EXPORT ALL EXAMPLES
// ============================================================================

export {
  BasicExample,
  ProfilePictureUpload,
  HeroImageUpload,
  GalleryImageUpload,
  HookExample,
  AdminImageManager,
  FormWithImageUpload,
  UtilityFunctionsExample,
  ImageCropperModal,
};
