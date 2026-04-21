import { useCallback, useRef, useState } from "react";

interface CropperOptions {
  maxFileSize?: number;
  aspectRatio?: number;
  quality?: number;
}

interface CropperState {
  originalImage: string | null;
  croppedImage: string | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

/**
 * Custom hook for image upload and cropping functionality
 * Provides utilities for handling image processing without UI components
 */
export const useImageCropper = (options: CropperOptions = {}) => {
  const {
    maxFileSize = 5,
    aspectRatio,
    quality = 0.95,
  } = options;

  const [state, setState] = useState<CropperState>({
    originalImage: null,
    croppedImage: null,
    isLoading: false,
    error: null,
    success: null,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Convert file to base64
  const fileToBase64 = useCallback(
    (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          reject(new Error("केवळ JPEG, PNG, किंवा WebP फाइलें समर्थित आहेत"));
          return;
        }

        if (file.size > maxFileSize * 1024 * 1024) {
          reject(
            new Error(
              `फाइल आकार ${maxFileSize}MB पेक्षा कमी असणे आवश्यक आहे`
            )
          );
          return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("फाइल वाचनामध्ये त्रुटी"));
        reader.readAsDataURL(file);
      });
    },
    [maxFileSize]
  );

  // Validate and upload image
  const uploadImage = useCallback(
    async (file: File) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const base64 = await fileToBase64(file);
        setState((prev) => ({
          ...prev,
          originalImage: base64,
          croppedImage: null,
          isLoading: false,
          success: null,
        }));
        return true;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "अज्ञात त्रुटी",
          isLoading: false,
        }));
        return false;
      }
    },
    [fileToBase64]
  );

  // Crop image using canvas
  const cropImage = useCallback(
    async (
      imageUrl: string,
      cropArea: { x: number; y: number; width: number; height: number },
      rotation: number = 0,
      zoom: number = 1
    ): Promise<Blob | null> => {
      return new Promise((resolve) => {
        const canvas = canvasRef.current || document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          setState((prev) => ({
            ...prev,
            error: "Canvas संदर्भ प्राप्त करणे अशक्य",
          }));
          resolve(null);
          return;
        }

        const image = new Image();
        image.crossOrigin = "anonymous";

        image.onload = () => {
          try {
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;

            canvas.width = cropArea.width * scaleX;
            canvas.height = cropArea.height * scaleY;

            // Apply rotation
            if (rotation !== 0) {
              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate((rotation * Math.PI) / 180);
              ctx.translate(-canvas.width / 2, -canvas.height / 2);
            }

            // Draw cropped image
            ctx.drawImage(
              image,
              cropArea.x * scaleX,
              cropArea.y * scaleY,
              cropArea.width * scaleX,
              cropArea.height * scaleY,
              0,
              0,
              cropArea.width * scaleX,
              cropArea.height * scaleY
            );

            // Convert to blob
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const croppedUrl = URL.createObjectURL(blob);
                  setState((prev) => ({
                    ...prev,
                    croppedImage: croppedUrl,
                    success: "छायाचित्र यशस्वीरित्या काटले गेले!",
                  }));
                  resolve(blob);
                } else {
                  setState((prev) => ({
                    ...prev,
                    error: "छायाचित्र काटणे अशक्य",
                  }));
                  resolve(null);
                }
              },
              "image/jpeg",
              quality
            );
          } catch (err) {
            setState((prev) => ({
              ...prev,
              error: err instanceof Error ? err.message : "काटणे अशक्य",
            }));
            resolve(null);
          }
        };

        image.onerror = () => {
          setState((prev) => ({
            ...prev,
            error: "छायाचित्र लोड करणे अशक्य",
          }));
          resolve(null);
        };

        image.src = imageUrl;
      });
    },
    [quality]
  );

  // Download cropped image
  const downloadImage = useCallback(
    (blob: Blob, filename = "cropped-image.jpg") => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    []
  );

  // Upload to server
  const uploadToServer = useCallback(
    async (blob: Blob, endpoint: string): Promise<any> => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
      }));

      try {
        const formData = new FormData();
        formData.append("file", blob, "cropped-image.jpg");

        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("सर्व्हरवर अपलोड अयशस्वी");
        }

        const data = await response.json();
        setState((prev) => ({
          ...prev,
          isLoading: false,
          success: "छायाचित्र यशस्वीरित्या अपलोड झाले!",
        }));
        return data;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "अपलोड अयशस्वी",
        }));
        throw err;
      }
    },
    []
  );

  // Reset state
  const reset = useCallback(() => {
    setState({
      originalImage: null,
      croppedImage: null,
      isLoading: false,
      error: null,
      success: null,
    });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Clear success
  const clearSuccess = useCallback(() => {
    setState((prev) => ({
      ...prev,
      success: null,
    }));
  }, []);

  return {
    // State
    ...state,

    // Methods
    uploadImage,
    cropImage,
    downloadImage,
    uploadToServer,
    reset,
    clearError,
    clearSuccess,

    // Refs
    canvasRef,
  };
};

/**
 * Utility function to get image dimensions
 */
export const getImageDimensions = (
  imageUrl: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      reject(new Error("छायाचित्र लोड करणे अशक्य"));
    };

    image.src = imageUrl;
  });
};

/**
 * Utility function to compress image
 */
export const compressImage = (
  blob: Blob,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve(blob);
      return;
    }

    const image = new Image();
    image.onload = () => {
      let { width, height } = image;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (compressedBlob) => {
          resolve(compressedBlob || blob);
        },
        "image/jpeg",
        quality
      );
    };

    image.src = URL.createObjectURL(blob);
  });
};

/**
 * Utility function to validate image file
 */
export const validateImageFile = (
  file: File,
  options: {
    maxSize?: number; // in MB
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } => {
  const {
    maxSize = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  } = options;

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `समर्थित फाइल प्रकार: ${allowedTypes.join(", ")}`,
    };
  }

  if (file.size > maxSize * 1024 * 1024) {
    return {
      valid: false,
      error: `फाइल आकार ${maxSize}MB पेक्षा कमी असणे आवश्यक आहे`,
    };
  }

  return { valid: true };
};

export default useImageCropper;
