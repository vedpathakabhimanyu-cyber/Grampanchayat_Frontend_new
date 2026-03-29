"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { announcementsAPI } from "@/lib/admin/api";
import { toast } from "sonner";
import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
  FaImage,
  FaTrash,
  FaUpload,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

type AnnouncementData = {
  id?: string;
  title: string;
  filePath: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  category: string;
};

export default function Task8AnnouncementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [existingAnnouncements, setExistingAnnouncements] = useState<
    AnnouncementData[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementData | null>(null);
  const [deletingItem, setDeletingItem] = useState<AnnouncementData | null>(null);

  const [currentAnnouncement, setCurrentAnnouncement] =
    useState<AnnouncementData>({
      title: "",
      filePath: "",
      fileType: "",
      fileSize: "",
      category: "इतर",
      uploadDate: new Date().toISOString().split("T")[0],
    });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);

  // Load existing announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementsAPI.getAll();
        if (response.success && response.data) {
          setExistingAnnouncements(response.data);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("कृपया फक्त PDF, Word, Excel किंवा फोटो फाइल निवडा");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("फाइलचा आकार 10MB पेक्षा कमी असावा");
      return;
    }

    setSelectedFile(file);

    // Get file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    let fileType = "pdf";
    if (["doc", "docx"].includes(fileExtension)) fileType = "docx";
    else if (["xls", "xlsx"].includes(fileExtension)) fileType = "xlsx";
    else if (["jpg", "jpeg", "png", "webp"].includes(fileExtension)) fileType = "image";

    if (isEditModalOpen && editingItem) {
      setEditingItem({
        ...editingItem,
        fileType,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });
    } else {
      setCurrentAnnouncement({
        ...currentAnnouncement,
        fileType,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  };

  const handleAddToList = async () => {
    if (!currentAnnouncement.title.trim()) {
      toast.error("कृपया शीर्षक भरा");
      return;
    }

    if (!selectedFile) {
      toast.error("कृपया फाइल निवडा");
      return;
    }

    setUploading(true);

    try {
      const uploadResponse = await announcementsAPI.uploadDocument(
        selectedFile,
        "documents"
      );

      if (uploadResponse.success && uploadResponse.data) {
        const newAnnouncement = {
          ...currentAnnouncement,
          filePath: uploadResponse.data.filePath,
        };

        setAnnouncements([...announcements, newAnnouncement]);

        // Reset form
        setCurrentAnnouncement({
          title: "",
          filePath: "",
          fileType: "",
          fileSize: "",
          category: "इतर",
          uploadDate: new Date().toISOString().split("T")[0],
        });
        setSelectedFile(null);

        // Reset file input
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        toast.success("घोषणा यादीत जोडली!");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      toast.error("त्रुटी: फाइल अपलोड करताना समस्या आली");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFromList = (index: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  const handleEditSave = async () => {
    if (!editingItem || !editingItem.title.trim()) {
      toast.error("कृपया शीर्षक भरा");
      return;
    }

    setUploading(true);
    try {
      let filePath = editingItem.filePath;
      let { fileType, fileSize } = editingItem;

      if (selectedFile) {
        const uploadResponse = await announcementsAPI.uploadDocument(
          selectedFile,
          "documents"
        );
        if (uploadResponse.success && uploadResponse.data) {
          filePath = uploadResponse.data.filePath;
          const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase() || "";
          fileType = "pdf";
          if (["doc", "docx"].includes(fileExtension)) fileType = "docx";
          else if (["xls", "xlsx"].includes(fileExtension)) fileType = "xlsx";
          else if (["jpg", "jpeg", "png", "webp"].includes(fileExtension)) fileType = "image";
          fileSize = `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`;
        }
      }

      const updatedData = {
        ...editingItem,
        filePath,
        fileType,
        fileSize,
      };

      await announcementsAPI.save([updatedData]);
      
      const response = await announcementsAPI.getAll();
      if (response.success && response.data) {
        setExistingAnnouncements(response.data);
      }

      setIsEditModalOpen(false);
      setEditingItem(null);
      setSelectedFile(null);
      toast.success("घोषणा यशस्वीरित्या अपडेट केली!");
    } catch (error) {
      console.error("Error updating announcement:", error);
      toast.error("त्रुटी: अपडेट करताना समस्या आली");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem || !deletingItem.id) return;

    try {
      await announcementsAPI.delete(deletingItem.id);
      setExistingAnnouncements(
        existingAnnouncements.filter((item) => item.id !== deletingItem.id)
      );
      setIsDeleteModalOpen(false);
      setDeletingItem(null);
      toast.success("घोषणा यशस्वीरित्या हटवली!");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("त्रुटी: घोषणा हटवताना समस्या आली");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (announcements.length === 0) {
      toast.warning("कृपया किमान एक घोषणा जोडा");
      return;
    }

    try {
      await announcementsAPI.save(announcements);
      toast.success("घोषणा यशस्वीरित्या जतन केल्या!");
      
      const response = await announcementsAPI.getAll();
      if (response.success && response.data) {
        setExistingAnnouncements(response.data);
      }
      setAnnouncements([]);
      setTimeout(() => router.push("/admin/dashboard"), 100);
    } catch (error: any) {
      console.error("Error saving announcements:", error);
      toast.error("त्रुटी: " + (error.message || "घोषणा जतन करताना समस्या आली"));
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FaFilePdf className="text-red-600 text-2xl" />;
      case "docx":
        return <FaFileWord className="text-blue-600 text-2xl" />;
      case "xlsx":
        return <FaFileExcel className="text-green-600 text-2xl" />;
      case "image":
        return <FaImage className="text-purple-600 text-2xl" />;
      default:
        return <FaFileAlt className="text-gray-600 text-2xl" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
          कार्य 8: परिपत्रक / घोषणा व्यवस्थापन
        </h2>

        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">माहिती लोड होत आहे...</p>
          </div>
        ) : (
          <>
            {/* List Section */}
            {existingAnnouncements.length > 0 && (
              <div className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
                  <h3 className="text-white font-bold text-lg">सध्याच्या घोषणा</h3>
                </div>
                <div className="p-6">
                  {["जमा-खर्च", "अर्जांचे नमुने", "दाखले", "स्वयंघोषणापत्रे", "इतर"].map((cat) => {
                    const mainCategories = ["जमा-खर्च", "अर्जांचे नमुने", "दाखले", "स्वयंघोषणापत्रे"];
                    const catItems = existingAnnouncements.filter(a => 
                      a.category === cat || 
                      (cat === "इतर" && (!a.category || !mainCategories.includes(a.category)))
                    );
                    if (catItems.length === 0) return null;
                    
                    return (
                      <div key={cat} className="mb-8 last:mb-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
                          <h4 className="text-lg font-bold text-blue-800">{cat}</h4>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
                            {catItems.length}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {catItems.map((announcement) => (
                            <div
                              key={announcement.id}
                              className="group border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-start space-x-3 flex-1 min-w-0">
                                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                    {getFileIcon(announcement.fileType)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 text-base truncate pr-2">
                                      {announcement.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
                                      <span className="bg-gray-200 px-2 py-0.5 rounded uppercase">{announcement.fileSize}</span>
                                      <span>•</span>
                                      <span>{new Date(announcement.uploadDate).toLocaleDateString("mr-IN")}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingItem({...announcement});
                                      setIsEditModalOpen(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="संपादित करा"
                                  >
                                    <FaEdit size={18} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDeletingItem(announcement);
                                      setIsDeleteModalOpen(true);
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="हटवा"
                                  >
                                    <FaTrash size={18} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden mb-8">
              <div className="bg-blue-50 px-6 py-4 flex items-center justify-between border-b border-blue-100">
                <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
                  <FaUpload /> नवीन घोषणा अपलोड करा
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">घोषणेचे शीर्षक *</label>
                    <input
                      type="text"
                      value={currentAnnouncement.title}
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 transition-colors outline-none bg-gray-50"
                      placeholder="उदा: नवीन पाणीपुरवठा योजना नियमावली"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">वर्गवारी निवडा *</label>
                    <select
                      value={currentAnnouncement.category}
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, category: e.target.value })}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none bg-gray-50"
                    >
                      <option value="जमा-खर्च">जमा-खर्च</option>
                      <option value="अर्जांचे नमुने">अर्जांचे नमुने</option>
                      <option value="दाखले">दाखले</option>
                      <option value="स्वयंघोषणापत्रे">स्वयंघोषणापत्रे</option>
                      <option value="इतर">इतर</option>
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">अपलोड दिनांक</label>
                    <input
                      type="date"
                      value={currentAnnouncement.uploadDate}
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, uploadDate: e.target.value })}
                      className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-blue-500 outline-none bg-gray-50"
                    />
                  </div>

                  {/* File */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">फाइल अपलोड करा (PDF, Photo, etc.) *</label>
                    <div className="relative group">
                      <input
                        id="file-input"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label 
                        htmlFor="file-input"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50 cursor-pointer group-hover:border-blue-400 group-hover:bg-blue-50 transition-all"
                      >
                        <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          <FaUpload className="text-blue-500 text-2xl" />
                        </div>
                        <p className="text-gray-600 font-bold">
                          {selectedFile ? selectedFile.name : "फाइल निवडण्यासाठी येथे क्लिक करा"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 uppercase font-medium">
                          PDF, Word, Excel, JPG, PNG (कमाल 10MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      onClick={handleAddToList}
                      disabled={uploading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-100 disabled:opacity-50"
                    >
                      <FaUpload /> {uploading ? "अपलोड होत आहे..." : "यादीत जोडा"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Pending List */}
              {announcements.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="bg-blue-600 w-2 h-2 rounded-full"></span> 
                    जतन करण्यासाठी तयार ({announcements.length})
                  </h4>
                  <div className="space-y-3">
                    {announcements.map((ann, idx) => (
                      <div key={idx} className="bg-white border border-green-100 rounded-xl p-4 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="text-green-600">{getFileIcon(ann.fileType)}</div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{ann.title}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{ann.fileSize} • {ann.category}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveFromList(idx)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all transform hover:scale-[1.01]"
                  >
                    सर्व घोषणा पोर्टलवर जतन करा
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-xl flex items-center gap-2"><FaEdit /> माहिती सुधारणे</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white/80 hover:text-white"><FaTimes size={20}/></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">शीर्षक</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">वर्गवारी</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="जमा-खर्च">जमा-खर्च</option>
                  <option value="अर्जांचे नमुने">अर्जांचे नमुने</option>
                  <option value="दाखले">दाखले</option>
                  <option value="स्वयंघोषणापत्रे">स्वयंघोषणापत्रे</option>
                  <option value="इतर">इतर</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">दिनांक</label>
                  <input
                    type="date"
                    value={editingItem.uploadDate}
                    onChange={(e) => setEditingItem({ ...editingItem, uploadDate: e.target.value })}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">नवीन फाइल (पर्यायी)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
                  onChange={handleFileSelect}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={handleEditSave}
                disabled={uploading}
                className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold transition-all hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "साठवत आहे..." : "बदल जतन करा"}
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                रद्द करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && deletingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-10 text-center">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-red-100 ring-opacity-50">
                <FaTrash size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">कायमचे हटवायचे?</h3>
              <p className="text-gray-500 text-base leading-relaxed mb-10 font-medium">
                तुम्हाला खात्री आहे की <strong>"{deletingItem.title}"</strong> हटवू इच्छिता? ही प्रक्रिया परत करता येणार नाही.
              </p>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleDeleteConfirm}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-red-200 transition-all active:scale-95"
                >
                  हो, हटवा
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full text-gray-400 py-2 font-bold hover:text-gray-600 transition-colors"
                >
                  नको, राहू द्या
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
