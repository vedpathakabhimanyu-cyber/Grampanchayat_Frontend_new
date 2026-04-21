"use client";

import { useState, useEffect, ChangeEvent, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import Image from "next/image";
import { GetCroppedImg } from "./GetCroppedImg";
import { useRouter } from "next/navigation";
import { imagesAPI } from "@/lib/admin/api";
import { toast } from "sonner";
import { RotateCcw, RotateCw, Trash2 } from "lucide-react";

interface Photo {
  id: string;
  title: string;
  description: string;
  file?: File;
  croppedFile?: File;
  preview?: string;
  imageUrl?: string;
  date: string;
}

export default function PhotoGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [existingPhotos, setExistingPhotos] = useState<Photo[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<Photo>({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    createNewPhoto();
    fetchExistingPhotos();
  }, []);

  const fetchExistingPhotos = async () => {
    try {
      const response = await imagesAPI.getAll("gallery");
      if (response.success && response.data) {
        setExistingPhotos(response.data);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await imagesAPI.delete(deletingId);
      setExistingPhotos(
        existingPhotos.filter((photo) => photo.id !== deletingId),
      );
      toast.success("फोटो यशस्वीरित्या हटवला!");
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("त्रुटी: फोटो हटवताना समस्या आली");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const createNewPhoto = () => {
    setCurrentPhoto({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    setIsCropping(false);
    setShowOptions(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setCurrentPhoto((prev) => ({ ...prev, file }));
      setIsCropping(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const handleCropConfirm = async () => {
    if (!currentPhoto.file || !croppedAreaPixels) return;
    try {
      const blob = await GetCroppedImg(
        currentPhoto.file,
        croppedAreaPixels,
        rotation,
      );
      const croppedFile = new File([blob], currentPhoto.file.name, {
        type: currentPhoto.file.type,
      });
      const preview = URL.createObjectURL(blob);
      setCurrentPhoto((prev) => ({ ...prev, croppedFile, preview }));
      setIsCropping(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitPhoto = () => {
    if (
      !currentPhoto.croppedFile ||
      !currentPhoto.title ||
      !currentPhoto.description
    ) {
      toast.warning("कृपया सर्व फील्ड पूर्ण करा आणि इमेज क्रॉप करा.");
      return;
    }

    setPhotos((prev) => [...prev, currentPhoto]);
    setShowOptions(true);
  };

  const handleAddMore = () => {
    createNewPhoto();
  };

  const handleCompleteTask = async () => {
    try {
      for (const photo of photos) {
        if (photo.croppedFile) {
          await imagesAPI.upload(
            photo.croppedFile,
            photo.title,
            photo.description,
            "gallery",
          );
        }
      }

      localStorage.setItem("task4", JSON.stringify(photos));

      toast.success("सर्व फोटो यशस्वीरित्या अपलोड केले!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Error uploading photos:", error);
      toast.error(
        "त्रुटी: " + (error.message || "फोटो अपलोड करताना समस्या आली"),
      );
    }
  };

  if (!currentPhoto) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          फोटो अपलोड
        </h2>

        {existingPhotos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              सध्याचे फोटो ({existingPhotos.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {existingPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        photo.imageUrl || photo.preview || "/placeholder.jpg"
                      }
                      alt={photo.title || "Photo"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-sm text-gray-800 truncate">
                      {photo.title || "शीर्षक नाही"}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                      {photo.description || "वर्णन नाही"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    title="फोटो हटवा"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
          <h3 className="text-base sm:text-lg font-semibold text-blue-800">
            नवीन फोटो जोडा
          </h3>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg md:text-xl">
              फोटो अपलोड करा
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <Input
                placeholder="शीर्षक"
                value={currentPhoto.title}
                onChange={(e) =>
                  setCurrentPhoto((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />

              <Textarea
                placeholder="वर्णन"
                value={currentPhoto.description}
                onChange={(e) =>
                  setCurrentPhoto((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />

              <Input
                type="date"
                value={currentPhoto.date}
                onChange={(e) =>
                  setCurrentPhoto((prev) => ({ ...prev, date: e.target.value }))
                }
              />
              <Input type="file" accept="image/*" onChange={handleFileChange} />

              {currentPhoto.preview && (
                <div className="relative w-full h-48 sm:h-56 md:h-64 mt-4 group">
                  <Image
                    src={currentPhoto.preview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPhoto((prev) => ({
                        ...prev,
                        file: undefined,
                        croppedFile: undefined,
                        preview: undefined,
                      }));
                      setImageSrc(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="फोटो काढा"
                  >
                    <span className="text-lg sm:text-xl font-bold">
                      &times;
                    </span>
                  </button>
                </div>
              )}

              {!showOptions && (
                <Button
                  onClick={handleSubmitPhoto}
                  disabled={!currentPhoto.croppedFile}
                >
                  फोटो सबमिट करा
                </Button>
              )}

              {showOptions && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleAddMore}>आणखी जोडा</Button>
                  <Button onClick={handleCompleteTask}>कार्य पूर्ण करा</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {isCropping && imageSrc && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg w-full max-w-[95vw] sm:max-w-[600px] h-[85vh] sm:h-[80vh] flex flex-col">
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                फोटो क्रॉप करा
              </h3>
              <div className="relative flex-1 bg-gray-200 rounded-md overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 min-w-[60px]">
                    झूम:
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 min-w-[60px]">
                    फिरवा:
                  </label>
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => prev - 90)}
                    className="h-9 w-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    title="डावीकडे फिरवा"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={((rotation % 360) + 360) % 360}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="min-w-[56px] text-xs sm:text-sm text-gray-700 text-right">
                    {Math.round(rotation)}°
                  </span>
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => prev + 90)}
                    className="h-9 w-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                    title="उजवीकडे फिरवा"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => {
                      setIsCropping(false);
                      setImageSrc(null);
                      setRotation(0);
                      setCurrentPhoto((prev) => ({ ...prev, file: undefined }));
                    }}
                    variant="outline"
                    className="text-sm sm:text-base"
                  >
                    रद्द करा
                  </Button>
                  <Button
                    onClick={handleCropConfirm}
                    className="text-sm sm:text-base"
                  >
                    क्रॉप करा
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              फोटो हटवायचा?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              हा फोटो कायमचा हटवला जाईल. आपण खात्रीशीर आहात का?
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                हो, हटवा
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                रद्द करा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
