# Image Cropper - Complete Integration Guide

## Table of Contents

1. [Installation](#installation)
2. [Basic Integration](#basic-integration)
3. [Use Case Examples](#use-case-examples)
4. [API Integration](#api-integration)
5. [Error Handling](#error-handling)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)

---

## Installation

### Step 1: Files Already in Place

The component files are already in your project:

```
components/ImageCropper/
├── ImageUploadCropper.tsx      # Main component
├── imageCropper.css            # Styles
├── README.md                   # Full documentation
├── SETUP.md                    # Setup instructions
├── EXAMPLES.tsx                # Code examples
└── INTEGRATION_GUIDE.md       # This file
```

### Step 2: Verify Dependencies

The component uses only standard React libraries and lucide-react icons:

```json
{
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "lucide-react": "latest"
}
```

### Step 3: Import and Use

```tsx
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function MyPage() {
  return (
    <ImageUploadCropper
      onCropComplete={(blob) => {
        // Handle cropped image
      }}
    />
  );
}
```

---

## Basic Integration

### Minimal Example

```tsx
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function SimpleUpload() {
  const handleCropComplete = (blob: Blob) => {
    console.log("Image cropped:", blob);
    // blob is ready to upload or process
  };

  return <ImageUploadCropper onCropComplete={handleCropComplete} />;
}
```

### With Configuration

```tsx
<ImageUploadCropper
  onCropComplete={handleCropComplete}
  maxFileSize={5} // 5 MB max
  aspectRatio={16 / 9} // Force 16:9 landscape
  enableCircularCrop={false} // Optional circular crop
/>
```

---

## Use Case Examples

### 1. Profile Picture Upload

**Requirements**: Circular image, 1:1 aspect ratio, small file size

```tsx
"use client";

import { useState } from "react";
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function ProfilePictureUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCropComplete = async (blob: Blob) => {
    setLoading(true);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("file", blob, "profile.jpg");
      formData.append("userId", getUserId());

      // Upload to server
      const response = await fetch("/api/user/profile-picture", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Profile picture updated:", data.url);

      // Update UI or redirect
      window.location.reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <ImageUploadCropper
        onCropComplete={handleCropComplete}
        maxFileSize={2} // 2 MB for profile pics
        aspectRatio={1} // 1:1 square
        enableCircularCrop={true} // Show circular crop option
      />

      {loading && (
        <div className="mt-4 text-center">
          <p>अपलोड होत आहे...</p>
        </div>
      )}
    </div>
  );
}

function getUserId(): string {
  // Get from localStorage, auth context, etc.
  return localStorage.getItem("userId") || "";
}
```

### 2. Hero/Banner Image Upload

**Requirements**: 16:9 landscape, larger file size, for web display

```tsx
"use client";

import { useState } from "react";
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function HeroImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);
  const projectId = new URLSearchParams(location.search).get("id");

  const handleCropComplete = async (blob: Blob) => {
    // Show preview
    setPreview(URL.createObjectURL(blob));

    // Upload
    const formData = new FormData();
    formData.append("file", blob, "hero-image.jpg");
    formData.append("projectId", projectId || "");

    const response = await fetch("/api/projects/hero-image", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Hero image updated:", data.url);
    }
  };

  return (
    <div className="space-y-8">
      <ImageUploadCropper
        onCropComplete={handleCropComplete}
        maxFileSize={8} // 8 MB for hero images
        aspectRatio={16 / 9} // Landscape format
      />

      {preview && (
        <div className="mt-8">
          <h3>Preview:</h3>
          <img src={preview} alt="Hero preview" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
}
```

### 3. Gallery Image Upload

**Requirements**: Multiple images, flexible aspect ratio, batch processing

```tsx
"use client";

import { useState } from "react";
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

interface UploadedImage {
  id: string;
  blob: Blob;
  preview: string;
  status: "pending" | "uploading" | "done" | "error";
}

export default function GalleryUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleCropComplete = (blob: Blob) => {
    const id = Date.now().toString();
    const preview = URL.createObjectURL(blob);

    setImages((prev) => [
      ...prev,
      {
        id,
        blob,
        preview,
        status: "pending",
      },
    ]);
  };

  const uploadAll = async () => {
    for (const image of images) {
      if (image.status !== "pending") continue;

      try {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: "uploading" } : img,
          ),
        );

        const formData = new FormData();
        formData.append("file", image.blob, `gallery-${image.id}.jpg`);
        formData.append("galleryId", getGalleryId());

        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id ? { ...img, status: "done" } : img,
            ),
          );
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        setImages((prev) =>
          prev.map((img) =>
            img.id === image.id ? { ...img, status: "error" } : img,
          ),
        );
      }
    }
  };

  return (
    <div className="space-y-8">
      <ImageUploadCropper onCropComplete={handleCropComplete} maxFileSize={5} />

      {images.length > 0 && (
        <div>
          <div className="grid grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.preview}
                  alt="Gallery"
                  className="w-full h-40 object-cover rounded"
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded text-sm text-white ${
                    image.status === "done"
                      ? "bg-green-600"
                      : image.status === "uploading"
                        ? "bg-blue-600"
                        : image.status === "error"
                          ? "bg-red-600"
                          : "bg-gray-600"
                  }`}
                >
                  {image.status}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={uploadAll}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
          >
            सर्व अपलोड करा
          </button>
        </div>
      )}
    </div>
  );
}

function getGalleryId(): string {
  return new URLSearchParams(location.search).get("galleryId") || "";
}
```

### 4. Document/Certificate Image Upload

**Requirements**: High quality, optimal for OCR, size constraints

```tsx
"use client";

import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function DocumentUpload() {
  const handleCropComplete = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob, "document.jpg");
    formData.append("documentType", "certificate");
    formData.append("quality", "high"); // For OCR

    const response = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Document uploaded:", data.documentId);
  };

  return (
    <div>
      <h2>प्रमाणपत्र अपलोड करा</h2>
      <p className="text-gray-600 mb-4">
        स्पष्ट प्रमाणपत्र छायाचित्र अपलोड करा
      </p>

      <ImageUploadCropper
        onCropComplete={handleCropComplete}
        maxFileSize={10} // Higher for document quality
      />
    </div>
  );
}
```

---

## API Integration

### Complete Upload Flow

```typescript
async function uploadCroppedImage(
  blob: Blob,
  options: {
    endpoint: string;
    metadata?: Record<string, string>;
    onProgress?: (progress: number) => void;
  },
): Promise<{ success: boolean; url?: string; error?: string }> {
  const formData = new FormData();
  formData.append("file", blob, "image.jpg");

  // Add metadata
  if (options.metadata) {
    Object.entries(options.metadata).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  try {
    const response = await fetch(options.endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Upload failed",
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

// Usage
const handleCropComplete = async (blob: Blob) => {
  const result = await uploadCroppedImage(blob, {
    endpoint: "/api/upload",
    metadata: {
      userId: getUserId(),
      type: "profile",
    },
  });

  if (result.success) {
    console.log("Image uploaded:", result.url);
  } else {
    console.error("Upload failed:", result.error);
  }
};
```

### Express Backend Example

```javascript
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Optimize image
    const optimized = await sharp(req.file.buffer)
      .resize(1920, 1080, {
        fit: "cover",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Save to file system or cloud storage
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const filepath = path.join(__dirname, "uploads", filename);

    // fs.writeFileSync(filepath, optimized);
    // Or upload to S3, Azure, etc.

    res.json({
      success: true,
      filename,
      url: `/uploads/${filename}`,
      size: optimized.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

---

## Error Handling

### Component-Level Errors

The component handles these automatically:

- Invalid file types
- File size exceeded
- Canvas errors
- Browser compatibility

### Application-Level Error Handling

```tsx
import { useState } from "react";
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function SafeUpload() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCropComplete = async (blob: Blob) => {
    try {
      setError(null);
      setSuccess(false);

      // Validate blob
      if (blob.size === 0) {
        throw new Error("खाली छायाचित्र");
      }

      if (blob.size > 5 * 1024 * 1024) {
        throw new Error("छायाचित्र खूप मोठा आहे");
      }

      // Upload
      const result = await uploadImage(blob);

      if (!result.success) {
        throw new Error(result.error);
      }

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          त्रुटी: {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          छायाचित्र यशस्वीरित्या अपलोड झाले!
        </div>
      )}

      <ImageUploadCropper onCropComplete={handleCropComplete} />
    </div>
  );
}
```

---

## Advanced Features

### State Management with Context

```tsx
import { createContext, ReactNode, useState } from "react";

interface ImageContextType {
  images: Map<string, Blob>;
  addImage: (key: string, blob: Blob) => void;
  getImage: (key: string) => Blob | undefined;
  clearImages: () => void;
}

export const ImageContext = createContext<ImageContextType | null>(null);

export function ImageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState(new Map<string, Blob>());

  const addImage = (key: string, blob: Blob) => {
    setImages((prev) => new Map(prev).set(key, blob));
  };

  const getImage = (key: string) => images.get(key);

  const clearImages = () => setImages(new Map());

  return (
    <ImageContext.Provider value={{ images, addImage, getImage, clearImages }}>
      {children}
    </ImageContext.Provider>
  );
}

// Usage
import { useContext } from "react";

export default function MyComponent() {
  const imageContext = useContext(ImageContext);

  const handleCropComplete = (blob: Blob) => {
    imageContext?.addImage("profile", blob);
  };

  return <ImageUploadCropper onCropComplete={handleCropComplete} />;
}
```

### Batch Processing

```tsx
async function processImages(blobs: Blob[]): Promise<string[]> {
  const urls: string[] = [];

  for (const blob of blobs) {
    try {
      const formData = new FormData();
      formData.append("file", blob);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      urls.push(data.url);
    } catch (error) {
      console.error("Failed to process image:", error);
    }
  }

  return urls;
}
```

---

## Troubleshooting

### Common Issues

| Issue                        | Solution                                                  |
| ---------------------------- | --------------------------------------------------------- |
| **Canvas is null**           | Ensure component is mounted before calling performCrop    |
| **Blob is empty**            | Check image loaded successfully, crop area is visible     |
| **Mobile touch not working** | Verify browser supports touch events, test on real device |
| **Image stretched**          | Check aspectRatio setting matches expected format         |
| **Upload fails 413**         | Increase maxFileSize prop or server limit                 |
| **CORS error**               | Add proper headers to backend response                    |

### Debugging

```tsx
const handleCropComplete = (blob: Blob) => {
  // Log blob details
  console.log("Blob type:", blob.type);
  console.log("Blob size:", blob.size);
  console.log("Blob constructor:", blob.constructor.name);

  // Create object URL for inspection
  const url = URL.createObjectURL(blob);
  console.log("Preview URL:", url);

  // Check blob content
  const reader = new FileReader();
  reader.onload = (e) => {
    console.log("Data URL:", e.target?.result);
  };
  reader.readAsDataURL(blob);
};
```

---

## Next Steps

1. **Test in Demo** - Visit `/admin/image-cropper`
2. **Copy Example** - Use an example from above
3. **Customize** - Adjust colors and styles in CSS
4. **Integrate** - Connect to your backend
5. **Deploy** - Test on production

---

**Last Updated**: April 2026
**Version**: 2.0
