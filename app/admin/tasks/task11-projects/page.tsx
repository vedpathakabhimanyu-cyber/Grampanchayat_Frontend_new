"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { toast } from "sonner";
import { projectsAPI } from "@/lib/admin/api";
import Cropper from "react-easy-crop";
import { GetCroppedImg } from "../task4-email-verification/GetCroppedImg";
import Image from "next/image";
import {
  Building2,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  FileText,
  X,
} from "lucide-react";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

const displayDate = (dateStr: string) => {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("mr-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch (e) {
    return dateStr;
  }
};

interface Project {
  id?: string;
  name: string;
  type: string;
  description: string;
  cost: number | string;
  start_date: string;
  end_date: string;
  status: string;
  created_at?: string;
  image?: File | string | null;
  croppedImage?: File | null;
  imagePreview?: string;
  imageUrl?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);

  // Image cropping state
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Project>({
    name: "",
    type: "",
    description: "",
    cost: "",
    start_date: formatDate(new Date().toISOString()),
    end_date: "",
    status: "प्रगतीत",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      if (response.success) {
        setProjects(response.data);
        localStorage.setItem("task11", JSON.stringify(response.data));
        window.dispatchEvent(new Event("taskUpdate"));
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("प्रकल्प लोड करताना त्रुटी आली.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    const existingImage =
      typeof project.image === "string" ? project.image : project.imageUrl || "";

    setSelectedProject(project);
    setFormData({
      name: project.name || "",
      type: project.type || "",
      description: project.description || "",
      cost: project.cost ? String(project.cost) : "",
      start_date: project.start_date ? formatDate(project.start_date) : "",
      end_date: project.end_date ? formatDate(project.end_date) : "",
      status: project.status || "प्रगतीत",
      imageUrl: existingImage,
      imagePreview: existingImage,
      id: project.id,
    });
    setIsCropping(false);
    setCropIndex(null);
    setIsModalOpen(true);
  };

  const handleChange = (field: keyof Project, value: string | File | null) => {
    if (field === "image" && value instanceof File) {
      // Handle image file
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result as string);
        setCropIndex(0);
        setIsCropping(true);
        setFormData({ ...formData, image: value });
      };
      reader.readAsDataURL(value);
    } else {
      // Handle other fields - ensure string values are never null
      const stringValue =
        value === null || value === undefined ? "" : String(value);
      setFormData({ ...formData, [field]: stringValue as never });
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedPixels: any) => {
      setCroppedAreaPixels(croppedPixels);
    },
    [],
  );

  const handleCropConfirm = async () => {
    if (!(formData.image instanceof File) || !croppedAreaPixels) return;

    try {
      const blob = await GetCroppedImg(formData.image, croppedAreaPixels);
      const croppedFile = new File([blob], formData.image.name, {
        type: formData.image.type,
      });

      setFormData({
        ...formData,
        croppedImage: croppedFile,
        imagePreview: URL.createObjectURL(blob),
      });

      setIsCropping(false);
      setCurrentImage(null);
      setCropIndex(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (error) {
      console.error(error);
      toast.error("इमेज क्रॉप करताना त्रुटी आली");
    }
  };

  const handleCropCancel = () => {
    setFormData({ ...formData, image: null });
    setIsCropping(false);
    setCurrentImage(null);
    setCropIndex(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject?.id) return;
    try {
      const response = await projectsAPI.delete(selectedProject.id);
      if (response.success) {
        toast.success("प्रकल्प यशस्वीरित्या हटवला.");
        fetchProjects();
      }
    } catch (error) {
      toast.error("प्रकल्प हटवताना त्रुटी आली.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const basePayload = {
        id: selectedProject?.id,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        cost: formData.cost === "" ? "" : String(formData.cost),
        start_date: formData.start_date || "",
        end_date: formData.end_date || "",
        status: formData.status || "",
        image: formData.imageUrl || "",
      };

      let payload: FormData | typeof basePayload = basePayload;

      if (formData.croppedImage) {
        const multipartPayload = new FormData();
        Object.entries(basePayload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            multipartPayload.append(key, String(value));
          }
        });
        multipartPayload.append("image", formData.croppedImage);
        payload = multipartPayload;
      }

      const response = await projectsAPI.save(payload);
      if (response.success) {
        toast.success(
          selectedProject ? "प्रकल्प अपडेट केला." : "नवीन प्रकल्प जोडला.",
        );
        setIsModalOpen(false);
        fetchProjects();
        resetForm();
      }
    } catch (error) {
      toast.error("माहिती जतन करताना त्रुटी आली.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      cost: "",
      start_date: formatDate(new Date().toISOString()),
      end_date: "",
      status: "प्रगतीत",
      imageUrl: "",
      imagePreview: "",
    });
    setSelectedProject(null);
    setIsCropping(false);
    setCropIndex(null);
    setCurrentImage(null);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "पूर्ण":
        return (
          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 size={12} /> पूर्ण
          </span>
        );
      case "प्रगतीत":
        return (
          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock size={12} /> प्रगतीत
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <AlertCircle size={12} /> प्रस्तावित
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1931]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[#0A1931] rounded-2xl shadow-xl text-white p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
                <Building2 className="h-10 w-10 text-blue-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">प्रकल्प / काम व्यवस्थापन</h1>
                <p className="text-blue-100 mt-1">
                  गावातील विकासकामे आणि प्रकल्पांची माहिती व्यवस्थापित करा
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="bg-white text-[#0A1931] hover:bg-blue-50 font-bold px-6 py-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={20} />
              नवीन प्रकल्प जोडा
            </Button>
          </div>
        </div>

        {/* Stats & Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-3 shadow-sm border-none bg-white">
            <CardContent className="p-4 flex items-center gap-3">
              <Search className="text-gray-400" />
              <Input
                placeholder="प्रकल्पाचे नाव किंवा प्रकार शोधा..."
                className="border-none shadow-none focus-visible:ring-0 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-[#0A1931] text-white">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{projects.length}</span>
              <span className="text-xs text-blue-200 uppercase tracking-wider font-bold">
                एकूण प्रकल्प
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Projects List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredProjects.length === 0 ? (
            <Card className="border-dashed border-2 bg-gray-50/50">
              <CardContent className="py-20 text-center text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-medium">
                  कोणताही प्रकल्प सापडला नाही
                </p>
                <p className="text-sm mt-1">
                  नवीन प्रकल्प जोडण्यासाठी 'नवीन प्रकल्प जोडा' वर क्लिक करा.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="group hover:shadow-md transition-all border-l-4 border-l-[#0A1931] overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row gap-5 flex-1 min-w-0">
                      <div className="relative h-40 sm:h-32 lg:h-36 sm:w-48 lg:w-56 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                        {typeof project.image === "string" && project.image ? (
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[linear-gradient(135deg,#eff6ff,#f8fafc_55%,#e2e8f0)] flex flex-col items-center justify-center text-slate-400">
                            <Building2 className="h-10 w-10 mb-2 opacity-60" />
                            <p className="text-xs font-semibold">छायाचित्र नाही</p>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
                      </div>

                      <div className="space-y-3 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">
                          {project.name}
                        </h3>
                        {getStatusBadge(project.status)}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5 font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                            {project.type}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <IndianRupee size={14} className="text-green-600" />
                            <span className="font-bold text-gray-700">
                              {project.cost
                                ? Number(project.cost).toLocaleString("en-IN")
                                : "नमुद नाही"}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {project.start_date
                              ? displayDate(project.start_date)
                              : "-"}
                            {project.end_date &&
                              ` ते ${displayDate(project.end_date)}`}
                          </span>
                        </div>
                        <p className="text-gray-600 line-clamp-3 text-sm max-w-3xl italic">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 lg:self-center shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="hover:bg-blue-50 border-blue-100 text-blue-700"
                      >
                        <Edit2 size={16} className="mr-1" /> एडिट
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(project)}
                        className="hover:bg-red-50 border-red-100 text-red-600"
                      >
                        <Trash2 size={16} className="mr-1" /> हटवा
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
            <CardHeader className="bg-[#0A1931] text-white py-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  {selectedProject ? <Edit2 size={20} /> : <Plus size={20} />}
                </div>
                {selectedProject ? "प्रकल्प अपडेट करा" : "नवीन प्रकल्प जोडा"}
              </CardTitle>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/10 p-1.5 rounded-full transition-colors text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </CardHeader>
            <CardContent className="p-8">
              {/* Image Cropping Modal */}
              {isCropping && currentImage && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
                  <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 w-full max-w-2xl mx-2">
                    <div className="relative h-64 sm:h-80 md:h-96 mb-3 sm:mb-4">
                      <Cropper
                        image={currentImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={16 / 9}
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Section */}
                <div className="space-y-2 md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                    प्रकल्पाचा फोटो अपलोड करा
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleChange(
                          "image",
                          e.target.files ? e.target.files[0] : null,
                        )
                      }
                      className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all w-full"
                    />
                    {(formData.imagePreview || formData.imageUrl) && (
                      <div className="relative h-40 w-full group">
                        <Image
                          src={formData.imagePreview || formData.imageUrl || ""}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        {/* Remove Image Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              image: null,
                              croppedImage: null,
                              imagePreview: "",
                              imageUrl: "",
                            });
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      कामाचे नाव
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="उदा. नवीन रस्ता बांधकाम"
                      className="h-12 border-gray-200 focus:border-[#0A1931] transition-all"
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      कामाचा प्रकार
                    </label>
                    <Input
                      required
                      value={formData.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                      placeholder="उदा. सार्वजनिक बांधकाम"
                      className="h-12 border-gray-200 focus:border-[#0A1931] transition-all"
                    />
                  </div>

                  {/* Cost */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                      कामाचा खर्च{" "}
                      <span className="text-xs text-gray-400 capitalize">
                        (रुपये)
                      </span>
                    </label>
                    <div className="relative">
                      <IndianRupee
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <Input
                        type="number"
                        value={formData.cost}
                        onChange={(e) => handleChange("cost", e.target.value)}
                        placeholder="उदा. 50000"
                        className="h-12 pl-10 border-gray-200 focus:border-[#0A1931] transition-all"
                      />
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      काम सुरू दिनांक
                    </label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        handleChange("start_date", e.target.value)
                      }
                      className="h-12 border-gray-200 focus:border-[#0A1931] transition-all"
                    />
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      काम संपण्याचा दिनांक
                    </label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => handleChange("end_date", e.target.value)}
                      className="h-12 border-gray-200 focus:border-[#0A1931] transition-all"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      कामाची स्थिती
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                      className="w-full h-12 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0A1931] focus:border-[#0A1931] transition-all"
                    >
                      <option value="प्रस्तावित">प्रस्तावित (Proposed)</option>
                      <option value="प्रगतीत">प्रगतीत (In Progress)</option>
                      <option value="पूर्ण">पूर्ण (Completed)</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      कामाचे तपशील
                    </label>
                    <Textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      placeholder="कामाबद्दल अधिक माहिती लिहा..."
                      className="border-gray-200 focus:border-[#0A1931] transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-12 text-gray-500 hover:bg-gray-100 font-bold"
                  >
                    रद्द करा
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 h-12 bg-[#0A1931] hover:bg-[#11264d] text-white font-bold shadow-lg shadow-blue-100"
                  >
                    {saving
                      ? "जतन होत आहे..."
                      : selectedProject
                        ? "बदल जतन करा"
                        : "प्रकल्प जतन करा"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-red-50 ring-opacity-50">
                <Trash2 size={40} className="animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                कायमचे हटवायचे?
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                तुम्हाला खात्री आहे की '
                <span className="font-bold text-gray-800">
                  {selectedProject?.name}
                </span>
                ' हटवू इच्छिता? ही प्रक्रिया परत करता येणार नाही.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  रद्द करा
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
                >
                  हो, हटवा
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
