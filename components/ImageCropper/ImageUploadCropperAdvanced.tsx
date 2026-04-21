"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Crop,
  Download,
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
  Check,
  Circle,
  FlipHorizontal,
  FlipVertical,
  RefreshCw,
} from "lucide-react";
import "./imageCropper.css";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropPreset {
  name: string;
  ratio: number | null;
  label: string;
}

interface ImageUploadCropperProps {
  onCropComplete?: (croppedImage: Blob) => void;
  maxFileSize?: number;
  aspectRatio?: number;
  enableCircularCrop?: boolean;
}

// Predefined crop presets
const CROP_PRESETS: CropPreset[] = [
  { name: "square", ratio: 1, label: "चौरस (1:1)" },
  { name: "landscape", ratio: 16 / 9, label: "लँडस्केप (16:9)" },
  { name: "portrait", ratio: 4 / 5, label: "पोर्ट्रेट (4:5)" },
  { name: "story", ratio: 9 / 16, label: "स्टोरी (9:16)" },
  { name: "freeform", ratio: null, label: "मुक्त स्वरूप" },
];

const ImageUploadCropperAdvanced: React.FC<ImageUploadCropperProps> = ({
  onCropComplete,
  maxFileSize = 5,
  aspectRatio,
  enableCircularCrop = false,
}) => {
  // State management
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fineRotation, setFineRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 50,
    y: 50,
    width: 200,
    height: 200,
  });
  const [customWidth, setCustomWidth] = useState<number>(200);
  const [customHeight, setCustomHeight] = useState<number>(200);
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(!!aspectRatio);
  const [isCircularCrop, setIsCircularCrop] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("freeform");
  const [exportFormat, setExportFormat] = useState<"jpeg" | "png">("jpeg");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("केवळ JPEG, PNG, किंवा WebP फाइलें आपलोड करा");
      return;
    }

    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`फाइल आकार ${maxFileSize}MB पेक्षा कमी असणे आवश्यक आहे`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      setCroppedImage(null);
      setError(null);
      setSuccess(null);
      setZoom(1);
      setRotation(0);
      setFineRotation(0);
      setFlipH(false);
      setFlipV(false);
      setSelectedPreset("freeform");

      const defaultSize = 200;
      setCropArea({
        x: 50,
        y: 50,
        width: defaultSize,
        height: defaultSize,
      });
      setCustomWidth(defaultSize);
      setCustomHeight(defaultSize);
    };
    reader.readAsDataURL(file);
  };

  // Apply crop preset
  const applyPreset = (presetName: string) => {
    const preset = CROP_PRESETS.find((p) => p.name === presetName);
    if (!preset) return;

    setSelectedPreset(presetName);

    if (preset.ratio === null) {
      setMaintainAspectRatio(false);
    } else {
      setMaintainAspectRatio(true);
      const newWidth = 200;
      const newHeight = newWidth / preset.ratio;
      setCropArea({
        x: 50,
        y: 50,
        width: newWidth,
        height: newHeight,
      });
      setCustomWidth(newWidth);
      setCustomHeight(newHeight);
    }
  };

  // Apply custom dimensions
  const applyCustomDimensions = () => {
    if (customWidth < 50 || customHeight < 50) {
      setError("न्यूनतम आकार 50x50 पिक्सेल आहे");
      return;
    }

    const container = cropContainerRef.current;
    if (!container) return;

    const maxWidth = container.clientWidth - 100;
    const maxHeight = container.clientHeight - 100;

    const width = Math.min(customWidth, maxWidth);
    const height = Math.min(customHeight, maxHeight);

    setCropArea({
      x: Math.max(0, Math.min(50, container.clientWidth - width)),
      y: Math.max(0, Math.min(50, container.clientHeight - height)),
      width,
      height,
    });
    setError(null);
  };

  // Flip handlers
  const toggleFlipHorizontal = () => setFlipH(!flipH);
  const toggleFlipVertical = () => setFlipV(!flipV);

  // Reset all edits
  const resetAllEdits = () => {
    setZoom(1);
    setRotation(0);
    setFineRotation(0);
    setFlipH(false);
    setFlipV(false);
    setSelectedPreset("freeform");
    const defaultSize = 200;
    setCropArea({
      x: 50,
      y: 50,
      width: defaultSize,
      height: defaultSize,
    });
  };

  // Mouse and touch handlers
  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    handle: string,
  ) => {
    setIsDragging(true);
    setDragHandle(handle);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStart({ x: touch.clientX, y: touch.clientY });
      setIsDragging(true);
      setDragHandle("move");
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY,
      );
      setTouchStart({ x: distance, y: 0 });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart) return;

    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      const container = cropContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const deltaX = touch.clientX - rect.left - cropArea.x;
      const deltaY = touch.clientY - rect.top - cropArea.y;

      let newCropArea = { ...cropArea };

      if (dragHandle === "move") {
        newCropArea.x += deltaX;
        newCropArea.y += deltaY;
        newCropArea.x = Math.max(
          0,
          Math.min(newCropArea.x, rect.width - newCropArea.width),
        );
        newCropArea.y = Math.max(
          0,
          Math.min(newCropArea.y, rect.height - newCropArea.height),
        );
      }

      setCropArea(newCropArea);
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY,
      );
      const previousDistance = touchStart.x;
      const scale = distance / previousDistance;
      const newZoom = Math.max(0.5, Math.min(3, zoom * scale));
      setZoom(newZoom);
      setTouchStart({ x: distance, y: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragHandle) return;

    const container = cropContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const deltaX = e.clientX - rect.left - cropArea.x;
    const deltaY = e.clientY - rect.top - cropArea.y;

    let newCropArea = { ...cropArea };

    if (dragHandle === "move") {
      newCropArea.x += deltaX;
      newCropArea.y += deltaY;
      newCropArea.x = Math.max(
        0,
        Math.min(newCropArea.x, rect.width - newCropArea.width),
      );
      newCropArea.y = Math.max(
        0,
        Math.min(newCropArea.y, rect.height - newCropArea.height),
      );
    } else if (dragHandle === "se") {
      newCropArea.width += deltaX;
      newCropArea.height += deltaY;
      if (maintainAspectRatio && aspectRatio) {
        newCropArea.height = newCropArea.width / aspectRatio;
      }
    } else if (dragHandle === "sw") {
      newCropArea.x += deltaX;
      newCropArea.width -= deltaX;
      newCropArea.height += deltaY;
      if (maintainAspectRatio && aspectRatio) {
        newCropArea.height = newCropArea.width / aspectRatio;
      }
    } else if (dragHandle === "ne") {
      newCropArea.y += deltaY;
      newCropArea.width += deltaX;
      newCropArea.height -= deltaY;
      if (maintainAspectRatio && aspectRatio) {
        newCropArea.height = newCropArea.width / aspectRatio;
      }
    } else if (dragHandle === "nw") {
      newCropArea.x += deltaX;
      newCropArea.y += deltaY;
      newCropArea.width -= deltaX;
      newCropArea.height -= deltaY;
      if (maintainAspectRatio && aspectRatio) {
        newCropArea.height = newCropArea.width / aspectRatio;
      }
    }

    newCropArea.width = Math.max(50, newCropArea.width);
    newCropArea.height = Math.max(50, newCropArea.height);
    newCropArea.x = Math.max(
      0,
      Math.min(newCropArea.x, rect.width - newCropArea.width),
    );
    newCropArea.y = Math.max(
      0,
      Math.min(newCropArea.y, rect.height - newCropArea.height),
    );

    setCropArea(newCropArea);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragHandle(null);
  };

  // Perform crop with all transformations
  const performCrop = () => {
    if (!uploadedImage || !imageRef.current || !canvasRef.current) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = cropArea.width * scaleX;
    canvas.height = cropArea.height * scaleY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);

    if (flipH) ctx.scale(-1, 1);
    if (flipV) ctx.scale(1, -1);

    const totalRotation = rotation + fineRotation;
    ctx.rotate((totalRotation * Math.PI) / 180);

    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(
      image,
      cropArea.x * scaleX,
      cropArea.y * scaleY,
      cropArea.width * scaleX,
      cropArea.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    ctx.restore();

    if (isCircularCrop) {
      const radius = Math.min(canvas.width, canvas.height) / 2;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      if (tempCtx) {
        tempCtx.beginPath();
        tempCtx.arc(
          canvas.width / 2,
          canvas.height / 2,
          radius,
          0,
          Math.PI * 2,
        );
        tempCtx.clip();
        tempCtx.drawImage(canvas, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
      }
    }

    const mimeType = exportFormat === "png" ? "image/png" : "image/jpeg";
    const quality = exportFormat === "png" ? undefined : 0.95;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedUrl = URL.createObjectURL(blob);
          setCroppedImage(croppedUrl);
          setSuccess("छायाचित्र यशस्वीरित्या काटले गेले!");

          if (onCropComplete) {
            onCropComplete(blob);
          }
        }
      },
      mimeType,
      quality,
    );
  };

  // Download handler
  const downloadCroppedImage = () => {
    if (!croppedImage) return;

    const extension = exportFormat === "png" ? "png" : "jpg";
    const link = document.createElement("a");
    link.href = croppedImage;
    link.download = `cropped-image-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset all
  const handleReset = () => {
    setUploadedImage(null);
    setCroppedImage(null);
    setError(null);
    setSuccess(null);
    setZoom(1);
    setRotation(0);
    setFineRotation(0);
    setFlipH(false);
    setFlipV(false);
    setSelectedPreset("freeform");
  };

  return (
    <div className="image-cropper-container">
      <div className="cropper-card">
        <h2 className="cropper-title">उन्नत छायाचित्र संपादन</h2>

        {error && (
          <div className="alert alert-error">
            <X size={20} />
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <Check size={20} />
            {success}
          </div>
        )}

        {!uploadedImage && (
          <div className="upload-section">
            <label className="upload-label">
              <div className="upload-box">
                <Upload size={48} />
                <p>छायाचित्र निवडण्यासाठी क्लिक करा किंवा आकर्षण करा</p>
                <span className="file-info">
                  JPEG, PNG, WebP (कमाल {maxFileSize}MB)
                </span>
              </div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                className="file-input"
              />
            </label>
          </div>
        )}

        {uploadedImage && !croppedImage && (
          <div className="crop-editor">
            {/* Quick Rotate Toolbar - TOP PRIORITY */}
            <div className="quick-rotate-toolbar">
              <div className="rotate-toolbar-content">
                <button
                  onClick={() => setRotation((rotation - 90 + 360) % 360)}
                  className="btn-quick-rotate btn-rotate-left"
                  title="90° डावीकडे फिरवा"
                >
                  <RotateCcw size={24} />
                  <span>डावीकडे</span>
                </button>

                <div className="rotation-display">
                  <div className="rotation-value">
                    <span className="rotation-angle">
                      {rotation + fineRotation}°
                    </span>
                    <span className="rotation-label">फिरवणे</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={fineRotation}
                    onChange={(e) =>
                      setFineRotation(parseFloat(e.target.value))
                    }
                    className="rotation-slider"
                    title="सूक्ष्म फिरवणे (-180° ते +180°)"
                  />
                </div>

                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="btn-quick-rotate btn-rotate-right"
                  title="90° उजवीकडे फिरवा"
                >
                  <RotateCw size={24} />
                  <span>उजवीकडे</span>
                </button>
              </div>
            </div>

            {/* Crop Presets */}
            <div className="presets-section">
              <h3 className="section-title">प्रीसेट आकार</h3>
              <div className="presets-grid">
                {CROP_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.name)}
                    className={`preset-btn ${selectedPreset === preset.name ? "active" : ""}`}
                    title={preset.label}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dimensions */}
            <div className="custom-dimensions-section">
              <h3 className="section-title">कस्टम आकार</h3>
              <div className="dimension-inputs">
                <div className="input-group">
                  <label>रुंदी (पिक्सेल)</label>
                  <input
                    type="number"
                    min="50"
                    value={customWidth}
                    onChange={(e) =>
                      setCustomWidth(parseFloat(e.target.value) || 0)
                    }
                    className="dimension-input"
                  />
                </div>
                <div className="input-group">
                  <label>उंची (पिक्सेल)</label>
                  <input
                    type="number"
                    min="50"
                    value={customHeight}
                    onChange={(e) =>
                      setCustomHeight(parseFloat(e.target.value) || 0)
                    }
                    className="dimension-input"
                  />
                </div>
                <button
                  onClick={applyCustomDimensions}
                  className="btn-icon apply-dimensions-btn"
                >
                  <Check size={18} />
                  लागू करा
                </button>
              </div>
            </div>

            {/* Transform Controls */}
            <div className="controls-section">
              {/* Zoom */}
              <div className="control-group">
                <label>जूम: {zoom.toFixed(2)}x</label>
                <div className="control-buttons">
                  <button
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
                    className="btn-icon"
                    title="Zoom Out"
                  >
                    <ZoomOut size={20} />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="range-slider"
                  />
                  <button
                    onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                    className="btn-icon"
                    title="Zoom In"
                  >
                    <ZoomIn size={20} />
                  </button>
                </div>
              </div>

              {/* Rotation */}
              <div className="control-group">
                <label>रोटेशन: {rotation + fineRotation}°</label>
                <div className="rotation-controls">
                  <button
                    onClick={() => setRotation((rotation - 90 + 360) % 360)}
                    className="btn-icon"
                    title="Rotate Left"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="1"
                    value={fineRotation}
                    onChange={(e) =>
                      setFineRotation(parseFloat(e.target.value))
                    }
                    className="range-slider"
                    title="Fine Rotation"
                  />
                  <button
                    onClick={() => setRotation((rotation + 90) % 360)}
                    className="btn-icon"
                    title="Rotate Right"
                  >
                    <RotateCw size={20} />
                  </button>
                </div>
              </div>

              {/* Flip Controls */}
              <div className="control-group">
                <label>फ्लिप उपकरण</label>
                <div className="flip-controls">
                  <button
                    onClick={toggleFlipHorizontal}
                    className={`btn-flip ${flipH ? "active" : ""}`}
                    title="Flip Horizontally"
                  >
                    <FlipHorizontal size={20} />
                    क्षैतिज
                  </button>
                  <button
                    onClick={toggleFlipVertical}
                    className={`btn-flip ${flipV ? "active" : ""}`}
                    title="Flip Vertically"
                  >
                    <FlipVertical size={20} />
                    उर्ध्व
                  </button>
                </div>
              </div>

              {/* Export Format */}
              <div className="control-group">
                <label>निर्यात प्रारूप</label>
                <div className="format-selector">
                  <button
                    onClick={() => setExportFormat("jpeg")}
                    className={`format-btn ${exportFormat === "jpeg" ? "active" : ""}`}
                  >
                    JPEG
                  </button>
                  <button
                    onClick={() => setExportFormat("png")}
                    className={`format-btn ${exportFormat === "png" ? "active" : ""}`}
                  >
                    PNG
                  </button>
                </div>
              </div>

              {/* Reset All */}
              <button
                onClick={resetAllEdits}
                className="btn-reset"
                title="Reset all edits"
              >
                <RefreshCw size={18} />
                सर्व रीसेट करा
              </button>

              {aspectRatio && (
                <div className="control-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    />
                    आस्पेक्ट रेशो राखा ({aspectRatio.toFixed(2)})
                  </label>
                </div>
              )}

              {enableCircularCrop && (
                <div className="control-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={isCircularCrop}
                      onChange={(e) => setIsCircularCrop(e.target.checked)}
                    />
                    <Circle
                      size={16}
                      style={{ display: "inline", marginRight: "0.5rem" }}
                    />
                    वर्तुळाकार काट (प्रोफाइल चित्रासाठी)
                  </label>
                </div>
              )}
            </div>

            {/* Crop Preview */}
            <div className="preview-section">
              <div
                className={`crop-container ${isCircularCrop ? "circular-crop" : ""}`}
                ref={cropContainerRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={uploadedImage}
                  alt="Upload preview"
                  className="crop-image"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation + fineRotation}deg) scaleX(${
                      flipH ? -1 : 1
                    }) scaleY(${flipV ? -1 : 1})`,
                  }}
                />

                {/* Crop Box */}
                <div
                  className={`crop-box ${isCircularCrop ? "circular" : ""}`}
                  style={{
                    left: `${cropArea.x}px`,
                    top: `${cropArea.y}px`,
                    width: `${cropArea.width}px`,
                    height: `${cropArea.height}px`,
                    borderRadius: isCircularCrop ? "50%" : "0",
                  }}
                  onMouseDown={(e) => handleMouseDown(e, "move")}
                  onTouchStart={handleTouchStart}
                >
                  {/* Resize Handles */}
                  <div
                    className="resize-handle nw"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "nw");
                    }}
                  />
                  <div
                    className="resize-handle ne"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "ne");
                    }}
                  />
                  <div
                    className="resize-handle sw"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "sw");
                    }}
                  />
                  <div
                    className="resize-handle se"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleMouseDown(e, "se");
                    }}
                  />

                  {/* Grid Lines */}
                  <div className="grid-line grid-line-h1" />
                  <div className="grid-line grid-line-h2" />
                  <div className="grid-line grid-line-v1" />
                  <div className="grid-line grid-line-v2" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="button-group">
              <button onClick={handleReset} className="btn btn-secondary">
                <X size={20} />
                रद्द करा
              </button>
              <button onClick={performCrop} className="btn btn-primary">
                <Crop size={20} />
                छायाचित्र काटा
              </button>
            </div>
          </div>
        )}

        {/* Cropped Image Preview */}
        {croppedImage && (
          <div className="result-section">
            <div className="result-preview">
              <h3>काटलेले छायाचित्र</h3>
              <img src={croppedImage} alt="Cropped" className="result-image" />
            </div>

            <div className="button-group">
              <button onClick={handleReset} className="btn btn-secondary">
                <Upload size={20} />
                नवीन छायाचित्र अपलोड करा
              </button>
              <button
                onClick={downloadCroppedImage}
                className="btn btn-primary"
              >
                <Download size={20} />
                डाउनलोड करा ({exportFormat.toUpperCase()})
              </button>
            </div>
          </div>
        )}

        {/* Hidden canvas for cropping */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default ImageUploadCropperAdvanced;
