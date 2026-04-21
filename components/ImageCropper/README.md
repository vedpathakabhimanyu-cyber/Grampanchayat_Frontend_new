# Image Upload & Crop Feature - Complete Guide

## 📋 Overview

A production-ready image upload and cropping feature built with React, TypeScript, and HTML5 Canvas. Provides a professional image editing experience with drag-and-drop support, zoom, rotation, aspect ratio locking, circular crops, and full mobile support with touch gestures.

## ✨ Features

### Core Features

- ✅ **Drag-and-Drop Upload** - Click or drag files to upload
- ✅ **File Validation** - JPEG, PNG, WebP support with configurable size limits
- ✅ **Real-time Preview** - Instant preview with zoom and rotation
- ✅ **Interactive Crop Box** - Drag and resize with corner handles
- ✅ **Grid Guide Lines** - Rule-of-thirds overlay for composition
- ✅ **Canvas Export** - High-quality cropping using HTML5 Canvas
- ✅ **Download Support** - Export cropped images as JPEG

### Advanced Controls

- 🔍 **Zoom Control** - Range slider from 0.5x to 3x magnification
- 🔄 **Rotation** - 90° incremental rotation
- 📐 **Aspect Ratio Lock** - Maintain specific proportions (1:1, 16:9, etc.)
- 🖱️ **Move Crop Box** - Drag entire selection area
- 📍 **Resize from Corners** - All four corners for flexible adjustments

### New Features

- ⭕ **Circular Crop** - Create circular images for profile pictures
- 📱 **Mobile Touch Support** - Full touch gesture support
- 🤏 **Pinch to Zoom** - Multi-touch zoom on mobile devices
- 📲 **Responsive Layout** - Optimized for all screen sizes

### Accessibility & UX

- ♿ **Full Keyboard Support** - Navigate with keyboard only
- 🎯 **Touch-Friendly Targets** - 44px minimum tap targets on mobile
- 🎨 **Dark Mode Support** - Automatic dark mode detection
- 📝 **Marathi UI** - Localized error messages and labels
- ⚡ **High Performance** - Optimized canvas operations

## 🚀 Quick Start

### 1. Installation

The component is already set up in your project. Files are located at:

```
components/ImageCropper/
  ├── ImageUploadCropper.tsx    # Main component
  ├── imageCropper.css          # Styles
  ├── README.md                 # Documentation
  ├── EXAMPLES.tsx              # Usage examples
  └── SETUP.md                  # Setup guide
```

### 2. Basic Usage

```tsx
import ImageUploadCropper from "@/components/ImageCropper/ImageUploadCropper";

export default function MyComponent() {
  const handleCropComplete = (blob: Blob) => {
    console.log("Cropped image:", blob);
    // Upload to your server
    uploadImage(blob);
  };

  return (
    <ImageUploadCropper onCropComplete={handleCropComplete} maxFileSize={5} />
  );
}
```

### 3. Test the Demo

Navigate to: `http://localhost:3000/admin/image-cropper`

The demo page shows 4 different use cases:

- **Profile Picture** - Circular 1:1 crop
- **Hero Image** - 16:9 landscape crop
- **Square Image** - 1:1 square crop
- **Free Form** - Any aspect ratio

## 📖 API Reference

### Component Props

```typescript
interface ImageUploadCropperProps {
  // Callback when crop is complete
  onCropComplete?: (croppedImage: Blob) => void;

  // Maximum file size in MB
  maxFileSize?: number; // Default: 5

  // Lock to specific aspect ratio
  // Examples: 1 (square), 16/9 (widescreen), 9/16 (portrait)
  aspectRatio?: number;

  // Enable circular crop option
  enableCircularCrop?: boolean; // Default: false
}
```

### Usage Examples

#### Profile Picture (Circular, 1:1)

```tsx
<ImageUploadCropper
  onCropComplete={handleCropComplete}
  maxFileSize={2}
  aspectRatio={1}
  enableCircularCrop={true}
/>
```

#### Hero Banner (16:9 Landscape)

```tsx
<ImageUploadCropper
  onCropComplete={handleCropComplete}
  maxFileSize={5}
  aspectRatio={16 / 9}
/>
```

#### Social Media (1:1 Square)

```tsx
<ImageUploadCropper onCropComplete={handleCropComplete} aspectRatio={1} />
```

#### Free Form (No Aspect Lock)

```tsx
<ImageUploadCropper onCropComplete={handleCropComplete} />
```

## 🎨 Customization

### Image Size & Quality

The cropped image is generated with:

- **Format**: JPEG
- **Quality**: 95%
- **Dimensions**: Based on crop area selection

### Modify Styling

Edit `imageCropper.css`:

```css
/* Primary color */
--primary-color: #0a1931;

/* Accent color for crop handles */
--accent-color: #4a7fa7;

/* Background and text colors */
```

### Theme Colors

```css
/* Light theme (default) */
.image-cropper-container {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Dark theme (auto-detected) */
@media (prefers-color-scheme: dark) {
  .image-cropper-container {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }
}
```

## 📤 Server Integration

### Upload Cropped Image

```typescript
const handleCropComplete = async (blob: Blob) => {
  const formData = new FormData();
  formData.append("file", blob, "cropped-image.jpg");
  formData.append("userId", getCurrentUserId());

  try {
    const response = await fetch("/api/upload/profile-picture", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Upload successful:", result);
    } else {
      console.error("Upload failed");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### Backend Example (Node.js)

```javascript
app.post("/api/upload/profile-picture", async (req, res) => {
  const file = req.files.file;
  const userId = req.body.userId;

  // Save to your storage (S3, local, etc.)
  const filename = `profile-${userId}-${Date.now()}.jpg`;

  // Update user in database
  await User.updateOne({ _id: userId }, { profileImage: filename });

  res.json({
    success: true,
    filename,
    url: `/uploads/${filename}`,
  });
});
```

## 📱 Mobile Features

### Touch Gestures

1. **Single Touch Drag** - Move crop box around
2. **Pinch Zoom** - Two-finger pinch to zoom (0.5x - 3x)
3. **Tap Buttons** - All controls optimized for touch

### Responsive Breakpoints

```
Desktop:  1024px+ (standard desktop experience)
Tablet:   768px - 1023px (optimized layout)
Mobile:   < 768px (mobile-optimized UI)
```

### Mobile Optimization

- Larger buttons (44px minimum tap targets)
- Full-width layout on small screens
- Touch-friendly control spacing
- Optimized canvas size for performance

## 🎯 Browser Support

| Browser       | Version | Support |
| ------------- | ------- | ------- |
| Chrome        | Latest  | ✅ Full |
| Firefox       | Latest  | ✅ Full |
| Safari        | Latest  | ✅ Full |
| Edge          | Latest  | ✅ Full |
| iOS Safari    | Latest  | ✅ Full |
| Chrome Mobile | Latest  | ✅ Full |

## ⚙️ Implementation Details

### File Validation

```typescript
// Supported formats
const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

// Max size (configurable)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
```

### Canvas Operations

The component uses HTML5 Canvas for:

1. Image scaling and rotation
2. Crop area extraction
3. Circular mask application (for circular crops)
4. JPEG compression and export

```typescript
// Canvas dimensions match actual image resolution
canvas.width = cropArea.width * scaleX;
canvas.height = cropArea.height * scaleY;

// Rotation applied with context transforms
ctx.rotate((rotation * Math.PI) / 180);

// Export as optimized JPEG (95% quality)
canvas.toBlob(
  (blob) => {
    onCropComplete(blob);
  },
  "image/jpeg",
  0.95,
);
```

## 🐛 Error Handling

The component handles:

- Invalid file types → Error message in Marathi
- File size exceeded → Shows limit and actual size
- Canvas errors → Graceful fallback
- Missing browser support → Clear user message

## 🎓 Advanced Usage

### Aspect Ratio Examples

```typescript
// Common aspect ratios
const ASPECT_RATIOS = {
  square: 1, // 1:1
  landscape: 16 / 9, // 16:9
  portrait: 9 / 16, // 9:16
  instagram: 4 / 5, // Instagram post
  story: 9 / 20, // Instagram story
  youtube: 16 / 9, // YouTube thumbnail
  banner: 3 / 1, // Wide banner
};
```

### Custom Callback Logic

```typescript
const handleCropComplete = (blob: Blob) => {
  // Get image dimensions
  const img = new Image();
  img.onload = () => {
    console.log("Cropped size:", img.width, "x", img.height);
  };
  img.src = URL.createObjectURL(blob);

  // Convert to different formats
  canvas.toBlob((blob) => handleWebP(blob), "image/webp", 0.8);
};
```

## 📊 Performance Optimization

- Canvas operations optimized for large images
- Event debouncing on mouse/touch move
- Lazy loading for crop preview
- Efficient memory usage with blob cleanup

## 📄 License

Built for Grampanchayat Project. Adapted for your needs.

## 🆘 Troubleshooting

### Crop not working

- Check browser console for errors
- Verify Canvas API is supported
- Check file size is within limit

### Image appears stretched

- Check aspectRatio prop
- Verify zoom level
- Clear browser cache

### Touch not working on mobile

- Check browser supports touch events
- Verify mobile optimization CSS is loaded
- Test on actual device (not browser emulation)

## 📞 Support

For issues or questions:

1. Check demo at `/admin/image-cropper`
2. Review example implementations
3. Check browser console for errors
4. Verify all required props are provided

---

**Last Updated**: April 2026
**Version**: 2.0 (Enhanced with circular crop & mobile gestures)

### Internationalization

Replace Marathi text with your language:

```tsx
// In ImageUploadCropper.tsx, replace text strings:
// "छायाचित्र अपलोड आणि काटा" -> Your title
// "छायाचित्र निवडण्यासाठी..." -> Your message
```

## Performance Optimization

### Canvas Rendering

- Uses native Canvas API for high performance
- Optimized image scaling
- Efficient memory usage

### File Handling

- Progressive file reading
- Blob-based processing (avoids large string conversion)
- Automatic cleanup of object URLs

### Large Image Support

- Handles images up to canvas limits
- Automatic scaling preserves quality
- Efficient rotation and zoom

## Browser Compatibility

| Browser | Support | Notes                     |
| ------- | ------- | ------------------------- |
| Chrome  | ✅ Full | All features supported    |
| Firefox | ✅ Full | All features supported    |
| Safari  | ✅ Full | All features supported    |
| Edge    | ✅ Full | All features supported    |
| IE      | ❌ Not  | Use fallback or polyfills |

## Troubleshooting

### Issue: Image not displaying

**Solution**: Check file format and CORS headers if loading from external source.

```tsx
// Ensure cross-origin images have proper headers
<img src="https://..." crossOrigin="anonymous" />
```

### Issue: Cropped image quality degraded

**Solution**: Increase JPEG quality in the canvas export:

```tsx
// In performCrop() function:
canvas.toBlob(
  (blob) => {
    // Change 0.95 to higher value for better quality
  },
  "image/jpeg",
  0.99,
);
```

### Issue: Crop area not moving

**Solution**: This is a feature - ensure mouse is on the crop box itself, not the handles.

## Advanced Usage

### Custom Crop Area

```tsx
// Access crop area from component ref
const cropperRef = useRef<HTMLDivElement>(null);

// Programmatically set crop area
const setCropArea = (x: number, y: number, width: number, height: number) => {
  // Implement via component props if needed
};
```

### Server-Side Processing

After client-side crop, you can apply additional processing:

```tsx
// Backend endpoint example (Node.js with Sharp)
app.post("/api/crop", async (req, res) => {
  const blob = req.files.file;

  const image = sharp(blob.data);
  const metadata = await image.metadata();

  // Apply AI upscaling, watermark, etc.
  const result = await image.toFormat("jpeg").toBuffer();

  res.send(result);
});
```

## Security Considerations

1. **File Validation**: Always validate on backend
2. **File Size**: Enforce limits on server
3. **MIME Type**: Check actual content, not just extension
4. **Virus Scanning**: Use antivirus service for uploaded files
5. **Storage**: Store outside web root

```tsx
// Backend validation example
function validateImage(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (file.size > maxSize) throw new Error("File too large");
  if (!allowedTypes.includes(file.type)) throw new Error("Invalid type");

  return true;
}
```

## Examples

### Profile Picture Upload

```tsx
<ImageUploadCropper
  aspectRatio={1}
  maxFileSize={2}
  onCropComplete={async (blob) => {
    // Save as profile picture
    const formData = new FormData();
    formData.append("file", blob, "profile.jpg");
    await fetch("/api/user/profile-picture", {
      method: "POST",
      body: formData,
    });
  }}
/>
```

### Project Banner Upload

```tsx
<ImageUploadCropper
  aspectRatio={16 / 9}
  maxFileSize={8}
  onCropComplete={async (blob) => {
    // Save as project banner
    const formData = new FormData();
    formData.append("file", blob, "banner.jpg");
    await fetch("/api/project/banner", {
      method: "POST",
      body: formData,
    });
  }}
/>
```

## License

This component is part of the Grampanchayat template.

## Support

For issues or feature requests, contact the development team.
