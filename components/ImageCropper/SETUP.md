# Image Cropper Setup Guide

## 📋 File Structure

The image cropper feature includes the following files:

```
components/
├── ImageCropper/
│   ├── ImageUploadCropper.tsx      # Main component
│   ├── imageCropper.css            # Styling
│   ├── README.md                   # Component documentation
│   └── EXAMPLES.tsx                # Usage examples
hooks/
└── useImageCropper.ts              # Custom hook utilities
app/
└── admin/
    └── image-cropper/
        └── page.tsx                # Demo page
```

## 🚀 Quick Start

### 1. Files Are Already in Place

All necessary files have been created in your project:
- ✅ `components/ImageCropper/ImageUploadCropper.tsx`
- ✅ `components/ImageCropper/imageCropper.css`
- ✅ `hooks/useImageCropper.ts`
- ✅ `app/admin/image-cropper/page.tsx`
- ✅ Documentation files

### 2. Test the Demo

Visit `http://localhost:3000/admin/image-cropper` to see the feature in action.

### 3. Import and Use

```tsx
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function MyComponent() {
  return (
    <ImageUploadCropper
      onCropComplete={(blob) => console.log(blob)}
      maxFileSize={5}
    />
  );
}
```

## 📦 Dependencies

The component uses only React standard libraries and built-in browser APIs:

- React 18+ (Already in your project)
- TypeScript (Already in your project)
- lucide-react (For icons - Already in your project)
- HTML5 Canvas API (Built-in)

**No additional npm packages needed!**

## 🎯 Integration Examples

### Example 1: Hero Image Upload

```tsx
// app/admin/hero-image/page.tsx

import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function HeroImageUpload() {
  const handleCropComplete = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob);

    await fetch("/api/hero-image", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <ImageUploadCropper
      onCropComplete={handleCropComplete}
      maxFileSize={8}
      aspectRatio={16 / 9}
    />
  );
}
```

### Example 2: Profile Picture Upload

```tsx
// components/ProfilePictureUploader.tsx

import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function ProfilePictureUploader() {
  const handleCropComplete = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob);
    formData.append("userId", getUserId());

    const response = await fetch("/api/user/profile-picture", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("प्रोफाइल छायाचित्र अपडेट झाले!");
    }
  };

  return (
    <ImageUploadCropper
      onCropComplete={handleCropComplete}
      maxFileSize={2}
      aspectRatio={1} // 1:1 square
    />
  );
}
```

### Example 3: Gallery Image Upload

```tsx
// app/admin/gallery/upload/page.tsx

"use client";

import { useState } from "react";
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function GalleryUpload() {
  const [uploading, setUploading] = useState(false);

  const handleCropComplete = async (blob: Blob) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("title", "नवीन गॅलरी छायाचित्र");

      const response = await fetch("/api/gallery", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("गॅलरी छायाचित्र यशस्वीरित्या अपलोड झाले!");
        window.location.href = "/admin/gallery";
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">गॅलरीमध्ये छायाचित्र जोडा</h1>
      <ImageUploadCropper
        onCropComplete={handleCropComplete}
        maxFileSize={10}
      />
    </div>
  );
}
```

### Example 4: Using the Hook

```tsx
// components/CustomImageProcessor.tsx

"use client";

import { useImageCropper } from "@/hooks/useImageCropper";
import { useRef } from "react";

export default function CustomImageProcessor() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    originalImage,
    croppedImage,
    uploadImage,
    cropImage,
    downloadImage,
  } = useImageCropper();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handleCrop = async () => {
    if (!originalImage) return;
    const blob = await cropImage(originalImage, {
      x: 0,
      y: 0,
      width: 400,
      height: 400,
    });
    if (blob) {
      downloadImage(blob, "my-image.jpg");
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/*"
      />

      {originalImage && (
        <>
          <img src={originalImage} alt="Original" className="max-w-md" />
          <button onClick={handleCrop}>छायाचित्र काटा</button>
        </>
      )}

      {croppedImage && (
        <img src={croppedImage} alt="Cropped" className="max-w-md" />
      )}
    </div>
  );
}
```

## 🔌 API Integration

### Backend Endpoint Example (Node.js + Express)

```typescript
// routes/images.ts

import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload and save image
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "फाइल आवश्यक आहे" });
    }

    // Validate file type
    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: "अमान्य फाइल प्रकार" });
    }

    // Save file to disk or cloud
    const filename = `${Date.now()}-${req.file.originalname}`;
    const filepath = path.join("uploads", filename);

    await sharp(req.file.buffer)
      .metadata() // Verify it's a valid image
      .toFile(filepath);

    res.json({
      success: true,
      filename,
      url: `/uploads/${filename}`,
      size: req.file.size,
    });
  } catch (error) {
    res.status(500).json({ error: "अपलोड अयशस्वी" });
  }
});

// Delete image
router.delete("/delete/:filename", (req, res) => {
  try {
    const filepath = path.join("uploads", req.params.filename);
    fs.unlinkSync(filepath);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "हटवणे अयशस्वी" });
  }
});

export default router;
```

### Backend Endpoint Example (Python + Flask)

```python
# routes/images.py

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
import os
from datetime import datetime

images_bp = Blueprint("images", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"jpeg", "jpg", "png", "webp"}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@images_bp.route("/upload", methods=["POST"])
def upload_image():
    if "file" not in request.files:
        return jsonify({"error": "फाइल आवश्यक आहे"}), 400

    file = request.files["file"]

    if not allowed_file(file.filename):
        return jsonify({"error": "अमान्य फाइल प्रकार"}), 400

    try:
        # Validate image
        image = Image.open(file)
        image.verify()

        # Save file
        filename = f"{datetime.now().timestamp()}-{secure_filename(file.filename)}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        file.seek(0)
        file.save(filepath)

        return jsonify({
            "success": True,
            "filename": filename,
            "url": f"/uploads/{filename}",
            "size": os.path.getsize(filepath)
        })
    except Exception as e:
        return jsonify({"error": "अपलोड अयशस्वी"}), 500

@images_bp.route("/delete/<filename>", methods=["DELETE"])
def delete_image(filename):
    try:
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": "हटवणे अयशस्वी"}), 500
```

## 🎨 Customization

### Change Color Theme

Edit `imageCropper.css`:

```css
/* Find and update primary color */
:root {
  --primary-color: #0a1931; /* Change this */
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, #1a3d63 100%);
}
```

### Change Language (Marathi to English)

Create a `useImageCropperLocale` hook:

```tsx
// hooks/useImageCropperLocale.ts

export const locales = {
  en: {
    title: "Upload and Crop Image",
    selectImage: "Click or drag to select image",
    fileInfo: "JPEG, PNG, WebP",
    zoom: "Zoom",
    rotation: "Rotation",
    fileTooLarge: "File size exceeds limit",
    invalidFileType: "Invalid file type",
    cropSuccess: "Image cropped successfully",
  },
  mr: {
    title: "छायाचित्र अपलोड आणि काटा",
    selectImage: "छायाचित्र निवडण्यासाठी क्लिक करा किंवा आकर्षण करा",
    fileInfo: "JPEG, PNG, WebP",
    zoom: "जूम",
    rotation: "रोटेशन",
    fileTooLarge: "फाइल आकार सीमा ओलांडतो",
    invalidFileType: "अमान्य फाइल प्रकार",
    cropSuccess: "छायाचित्र यशस्वीरित्या काटले गेले",
  },
};

export const useImageCropperLocale = (lang: "en" | "mr" = "en") => {
  return locales[lang];
};
```

## 📊 Performance Tips

### 1. Compress Large Images

```tsx
import { compressImage } from "@/hooks/useImageCropper";

const handleCropComplete = async (blob: Blob) => {
  // Compress before upload
  const compressed = await compressImage(blob, 1920, 1080, 0.8);
  // Upload compressed blob
};
```

### 2. Progressive Loading

```tsx
// Show placeholder while loading
{isLoading && <Skeleton />}
{!isLoading && <ImageUploadCropper ... />}
```

### 3. Lazy Load Component

```tsx
import dynamic from "next/dynamic";

const ImageCropper = dynamic(
  () => import("@/components/ImageCropper/ImageUploadCropper"),
  { ssr: false }
);
```

## 🔒 Security Checklist

- [x] File type validation (client-side)
- [x] File size limit (client-side)
- [ ] Server-side file validation
- [ ] Antivirus scanning (optional)
- [ ] Store files outside web root
- [ ] Use signed URLs for files
- [ ] Implement CORS properly
- [ ] Rate limiting on upload endpoint

## 🐛 Troubleshooting

### Issue: "Canvas context is null"

**Solution**: Check if canvas ref is properly initialized.

```tsx
// Make sure canvas ref is not null
const canvasRef = useRef<HTMLCanvasElement>(null);
if (!canvasRef.current) {
  canvasRef.current = document.createElement("canvas");
}
```

### Issue: Cropped image quality is poor

**Solution**: Increase JPEG quality (edit in performCrop method):

```tsx
canvas.toBlob((blob) => {
  // Change 0.95 to 0.99 for better quality
}, "image/jpeg", 0.99);
```

### Issue: Touch gestures not working

**Solution**: Ensure touch event listeners are added:

```tsx
const handleTouchMove = (e: React.TouchEvent) => {
  const touch = e.touches[0];
  // Handle touch
};
```

## 📱 Testing

### Desktop Testing

```bash
# Test in Chrome, Firefox, Safari, Edge
npm run dev
```

### Mobile Testing

```bash
# Test on real devices or emulators
# iOS: Safari DevTools
# Android: Chrome DevTools

# Using ngrok for remote testing
npx ngrok http 3000
```

### Unit Testing

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

describe("ImageUploadCropper", () => {
  it("should display upload area", () => {
    render(<ImageUploadCropper />);
    expect(screen.getByText(/निवडण्यासाठी/i)).toBeInTheDocument();
  });

  it("should handle file upload", async () => {
    const onCropComplete = jest.fn();
    render(<ImageUploadCropper onCropComplete={onCropComplete} />);

    const input = screen.getByRole("button");
    fireEvent.click(input);
    // Assert...
  });
});
```

## 📚 Further Reading

- [Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [File API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [Blob API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [React Hooks Documentation](https://react.dev/reference/react/hooks)

## 🆘 Support

For issues or questions:
1. Check the [README.md](./README.md)
2. Review [EXAMPLES.tsx](./EXAMPLES.tsx)
3. Check browser console for error messages
4. Verify file permissions on server

---

**Version**: 1.0.0  
**Last Updated**: April 2026  
**Compatibility**: React 18+, Next.js 13+
