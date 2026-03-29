"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import { GetCroppedImg } from "../task4-email-verification/GetCroppedImg";
import Image from "next/image";
import { representativesAPI } from "@/lib/admin/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Representative = {
  id?: string;
  name: string;
  mobile: string;
  position: string;
  image?: File | null;
  croppedImage?: File | null;
  imagePreview?: string;
  imageUrl?: string;
  fixed?: boolean;
};

export default function TaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [existingData, setExistingData] = useState<any[]>([]);

  const [representatives, setRepresentatives] = useState<Representative[]>([
    {
      name: "",
      mobile: "",
      position: "सरपंच",
      fixed: true,
    },
    {
      name: "",
      mobile: "",
      position: "उपसरपंच",
      fixed: true,
    },
    {
      name: "",
      mobile: "",
      position: "ग्रामपंचायत अधिकारी",
      fixed: true,
    },
  ]);

  // Cropping state
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  // Load existing data
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await representativesAPI.getAll();
        if (response.success && response.data) {
          setExistingData(response.data);
          // Map existing data to representatives format if available
          if (response.data.length > 0) {
            const mappedData = response.data.map((item: any) => ({
              id: item.id,
              name: item.name || "",
              mobile: item.mobile || "",
              position: item.position || "",
              imagePreview: item.image || undefined,
              imageUrl: item.image || undefined,
              fixed:
                item.position === "सरपंच" ||
                item.position === "उपसरपंच" ||
                item.position === "ग्रामपंचायत अधिकारी",
            }));
            setRepresentatives(mappedData);
          }
        }
      } catch (error) {
        console.error("Error fetching representatives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingData();
  }, []);

  const handleChange = (
    index: number,
    field: keyof Representative,
    value: string | File | null
  ) => {
    if (field === "image" && value instanceof File) {
      // Handle image file
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result as string);
        setCropIndex(index);
        setIsCropping(true);
        const newReps = [...representatives];
        newReps[index].image = value;
        setRepresentatives(newReps);
      };
      reader.readAsDataURL(value);
    } else {
      // Handle other fields
      const newReps = [...representatives];
      newReps[index][field] = value as never;
      setRepresentatives(newReps);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  const handleCropConfirm = async () => {
    if (
      cropIndex === null ||
      !representatives[cropIndex].image ||
      !croppedAreaPixels
    )
      return;

    try {
      const blob = await GetCroppedImg(
        representatives[cropIndex].image,
        croppedAreaPixels
      );
      const croppedFile = new File(
        [blob],
        representatives[cropIndex].image.name,
        {
          type: representatives[cropIndex].image.type,
        }
      );

      const newReps = [...representatives];
      newReps[cropIndex].croppedImage = croppedFile;
      newReps[cropIndex].imagePreview = URL.createObjectURL(blob);
      setRepresentatives(newReps);

      setIsCropping(false);
      setCurrentImage(null);
      setCropIndex(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCropCancel = () => {
    if (cropIndex === null) return;

    const newReps = [...representatives];
    newReps[cropIndex].image = null;
    setRepresentatives(newReps);

    setIsCropping(false);
    setCurrentImage(null);
    setCropIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const addRepresentative = () => {
    setRepresentatives([
      ...representatives,
      {
        name: "",
        mobile: "",
        position: "",
        fixed: false,
        image: null,
      },
    ]);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await representativesAPI.delete(deletingId);
      setRepresentatives(representatives.filter((r) => r.id !== deletingId));
      setExistingData(existingData.filter((r) => r.id !== deletingId));
      toast.success("माहिती यशस्वीरित्या हटवली!");
    } catch (error) {
      console.error("Error deleting representative:", error);
      toast.error("त्रुटी: माहिती हटवताना समस्या आली");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    for (let i = 0; i < representatives.length; i++) {
      const rep = representatives[i];
      if (!rep.name || !rep.mobile || !rep.position) {
        toast.warning(`कृपया प्रतिनिधी #${i + 1} साठी सर्व आवश्यक माहिती भरा`);
        setSaving(false);
        return;
      }
    }

    try {
      // Prepare data to send to backend
      const dataToSend = await Promise.all(
        representatives.map(async (rep) => {
          let imageUrl = rep.imageUrl || null; // Keep existing image if no new one

          // Upload image if cropped image exists
          if (rep.croppedImage) {
            try {
              const uploadResult = await representativesAPI.uploadImage(
                rep.croppedImage,
                "officials"
              );
              imageUrl = uploadResult.data?.imageUrl || null;
            } catch (error) {
              console.error("Image upload failed:", error);
            }
          }

          return {
            id: rep.id, // Include ID for update
            name: rep.name,
            mobile: rep.mobile,
            position: rep.position,
            image: imageUrl,
            fixed: rep.fixed || false,
          };
        })
      );

      // Save to backend
      const saveResponse = await representativesAPI.save(dataToSend);

      // Update representatives with IDs from response
      if (saveResponse.success && saveResponse.data) {
        const savedReps = saveResponse.data.map((savedRep: any) => ({
          id: savedRep.id,
          name: savedRep.name,
          mobile: savedRep.mobile,
          position: savedRep.position,
          imageUrl: savedRep.image,
          imagePreview: savedRep.image,
          fixed: savedRep.fixed,
        }));
        setRepresentatives(savedReps);
        setExistingData(saveResponse.data);
      }

      // Also save to localStorage as backup
      localStorage.setItem("task1", JSON.stringify(representatives));
      window.dispatchEvent(new Event("taskUpdate"));

      toast.success("प्रतिनिधी माहिती यशस्वीरित्या जतन केली!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      console.error("Error saving representatives:", error);
      toast.error("त्रुटी: " + (error.message || "डेटा जतन करताना समस्या आली"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto font-inter">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800 text-center animate-fadeIn">
          कार्य 1: प्रतिनिधी माहिती फॉर्म
        </h2>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">माहिती लोड होत आहे...</p>
          </div>
        ) : (
          <>
            {/* Existing Representatives Display */}
            {existingData.length > 0 && (
              <div className="mb-6 bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  सध्याचे प्रतिनिधी ({existingData.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {existingData.map((rep: any) => (
                    <div
                      key={rep.id}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start space-x-3">
                            {rep.imageUrl && (
                              <div className="shrink-0">
                                <Image
                                  src={rep.imageUrl}
                                  alt={rep.name}
                                  width={60}
                                  height={60}
                                  className="rounded-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-base">
                                {rep.name}
                              </h4>
                              <p className="text-sm text-blue-600 font-medium">
                                {rep.position}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                📱 {rep.mobile}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(rep.id!)}
                          className="shrink-0 ml-2 text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                          title="हटवा"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Representative Section Header */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800">
                नवीन प्रतिनिधी जोडा
              </h3>
            </div>

            {/* Image Cropping Modal */}
            {isCropping && currentImage && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
                <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 w-full max-w-2xl mx-2">
                  <div className="relative h-64 sm:h-80 md:h-96 mb-3 sm:mb-4">
                    <Cropper
                      image={currentImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={handleCropCancel}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                      रद्द करा
                    </button>
                    <button
                      type="button"
                      onClick={handleCropConfirm}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      क्रॉप करा आणि जतन करा
                    </button>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {representatives.map((rep, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 md:p-6 border rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg bg-white hover:shadow-xl sm:hover:shadow-2xl transition-shadow duration-300 animate-slideIn relative"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 text-gray-700 pr-8">
                    {rep.fixed ? rep.position : `प्रतिनिधी ${index + 1}`}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {/* Name */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                        नाव <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={rep.name}
                        onChange={(e) =>
                          handleChange(index, "name", e.target.value)
                        }
                        className="border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:scale-[1.01]"
                        placeholder="नाव भरा"
                        required
                      />
                    </div>

                    {/* Mobile */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                        मोबाईल क्रमांक <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={rep.mobile}
                        onChange={(e) =>
                          handleChange(index, "mobile", e.target.value)
                        }
                        className="border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:scale-[1.01]"
                        placeholder="मोबाईल क्रमांक भरा"
                        required
                      />
                    </div>

                    {/* Position */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                        पद <span className="text-red-500">*</span>
                      </label>
                      {rep.fixed ? (
                        <input
                          type="text"
                          value={rep.position}
                          disabled
                          className="border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-100 cursor-not-allowed"
                        />
                      ) : (
                        <input
                          type="text"
                          value={rep.position}
                          onChange={(e) =>
                            handleChange(index, "position", e.target.value)
                          }
                          className="border rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:scale-[1.01]"
                          placeholder="पद भरा (उदा. सदस्य, सहायक इ.)"
                          required
                        />
                      )}
                    </div>

                    {/* Upload Image (optional) */}
                    <div className="flex flex-col">
                      <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
                        फोटो अपलोड करा
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleChange(
                              index,
                              "image",
                              e.target.files ? e.target.files[0] : null
                            )
                          }
                          className="border rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 hover:scale-[1.01] w-full"
                        />
                        {rep.imagePreview && (
                          <div className="relative h-24 w-24 sm:h-32 sm:w-32 group">
                            <Image
                              src={rep.imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                            {/* Remove Image Button */}
                            <button
                              type="button"
                              onClick={() => {
                                const newReps = [...representatives];
                                newReps[index].image = null;
                                newReps[index].croppedImage = null;
                                newReps[index].imagePreview = undefined;
                                setRepresentatives(newReps);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              title="फोटो काढा"
                            >
                              <span className="text-sm sm:text-base font-bold">
                                &times;
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!rep.fixed && (
                    <button
                      type="button"
                      onClick={() => {
                        if (rep.id) {
                          handleDelete(rep.id);
                        } else {
                          setRepresentatives(representatives.filter((_, i) => i !== index));
                        }
                      }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200"
                    >
                      <span className="text-lg sm:text-xl font-bold">
                        &times;
                      </span>
                    </button>
                  )}
                </div>
              ))}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  type="button"
                  onClick={addRepresentative}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-yellow-500 text-white font-semibold rounded-lg shadow hover:bg-yellow-600 transition-all duration-200 hover:scale-105 w-full sm:w-auto"
                >
                  आणखी जोडा
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-all duration-200 hover:scale-105 w-full sm:w-auto disabled:opacity-50"
                >
                  {saving ? "जतन होत आहे..." : "सबमिट करा"}
                </button>
              </div>
            </form>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">माहिती हटवायची?</h3>
            <p className="text-gray-500 text-sm mb-6">ही माहिती कायमची हटवली जाईल. आपण खात्रीशीर आहात का?</p>
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

            <style>
              {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            .font-inter { font-family: 'Inter', sans-serif; }
            @keyframes slideIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-slideIn { animation: slideIn 0.5s ease forwards; }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .animate-fadeIn { animation: fadeIn 0.7s ease forwards; }
          `}
            </style>
          </>
        )}
      </div>
    </div>
  );
}
