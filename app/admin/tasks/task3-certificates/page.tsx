"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { certificatesAPI } from "@/lib/admin/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Task3Data = {
  id?: string;
  certificateName: string;
  certificateDescription: string;
  requiredDocuments: string[];
  applyOnlineUrl?: string;
};

export default function Task3Form() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [existingCertificates, setExistingCertificates] = useState<Task3Data[]>(
    []
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [current, setCurrent] = useState<Task3Data>({
    certificateName: "",
    certificateDescription: "",
    requiredDocuments: ["", "", ""],
    applyOnlineUrl: "",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Load existing certificates
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificatesAPI.getAll();
        if (response.success && response.data) {
          setExistingCertificates(response.data);
        }
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await certificatesAPI.delete(deletingId);
      setExistingCertificates(
        existingCertificates.filter((cert) => cert.id !== deletingId)
      );
      toast.success("दाखला यशस्वीरित्या हटवला!");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("त्रुटी: दाखला हटवताना समस्या आली");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleFieldChange = (field: keyof Task3Data, value: string) => {
    setCurrent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentChange = (index: number, value: string) => {
    const newDocs = [...current.requiredDocuments];
    newDocs[index] = value;
    setCurrent((prev) => ({ ...prev, requiredDocuments: newDocs }));
  };

  const addDocument = () => {
    setCurrent((prev) => ({
      ...prev,
      requiredDocuments: [...prev.requiredDocuments, ""],
    }));
  };

  const removeDocument = (index: number) => {
    const newDocs = [...current.requiredDocuments];
    newDocs.splice(index, 1);
    setCurrent((prev) => ({ ...prev, requiredDocuments: newDocs }));
  };

  const startEdit = (cert: Task3Data) => {
    setSelectedId(cert.id || null);
    setCurrent({
      certificateName: cert.certificateName,
      certificateDescription: cert.certificateDescription,
      requiredDocuments:
        cert.requiredDocuments.length > 0
          ? [...cert.requiredDocuments]
          : ["", "", ""],
      applyOnlineUrl: cert.applyOnlineUrl || "",
    });
    // Scroll to form
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setSelectedId(null);
    setCurrent({
      certificateName: "",
      certificateDescription: "",
      requiredDocuments: ["", "", ""],
      applyOnlineUrl: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !current.certificateName.trim() ||
      !current.certificateDescription.trim()
    ) {
      toast.warning("कृपया दाखल्याचे नाव आणि वर्णन भरा!");
      return;
    }

    try {
      // Prepare single certificate data for backend
      const certificateData = {
        id: selectedId,
        certificateName: current.certificateName,
        certificateDescription: current.certificateDescription,
        requiredDocuments: current.requiredDocuments.filter((doc: string) =>
          doc.trim()
        ),
        applyOnlineUrl: current.applyOnlineUrl || null,
        isActive: true,
      };

      // Save to backend (sends as array with one item)
      await certificatesAPI.save([certificateData]);

      toast.success("दाखला यशस्वीरित्या जतन केला!");

      // Refresh the existing certificates list from database
      const refreshResponse = await certificatesAPI.getAll();
      if (refreshResponse.success && refreshResponse.data) {
        setExistingCertificates(refreshResponse.data);
        localStorage.setItem("task3", JSON.stringify(refreshResponse.data));
        window.dispatchEvent(
          new CustomEvent("taskUpdate", { detail: "task3" })
        );
      }

      // Clear the form
      setSelectedId(null);
      setCurrent({
        certificateName: "",
        certificateDescription: "",
        requiredDocuments: ["", "", ""],
        applyOnlineUrl: "",
      });
    } catch (error: any) {
      console.error("Error saving certificate:", error);
      toast.error("त्रुटी: " + (error.message || "दाखला जतन करताना समस्या आली"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
          कार्य 3: दाखला तपशील
        </h2>

        {/* Existing Certificates Section */}
        {existingCertificates.length > 0 && (
          <div className="mb-6 space-y-3">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              सध्याचे दाखले ({existingCertificates.length})
            </h3>
            {existingCertificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                      {cert.certificateName}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {cert.certificateDescription}
                    </p>
                    {cert.applyOnlineUrl && (
                      <div className="mb-2">
                        <a
                          href={cert.applyOnlineUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs sm:text-sm bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition-colors"
                        >
                          ऑनलाइन अर्ज करा →
                        </a>
                      </div>
                    )}
                    <div className="text-xs sm:text-sm text-gray-500">
                      <span className="font-medium">आवश्यक कागदपत्रे:</span>
                      <ul className="list-disc list-inside mt-1 ml-2">
                        {(cert.requiredDocuments || []).map(
                          (doc: string, idx: number) => (
                            <li key={idx}>{doc}</li>
                          )
                        )}
                      </ul>
                    </div>
                    </div>
                    <div className="ml-3 flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(cert)}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-600 transition-colors"
                      >
                        संपादित करा
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cert.id!)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition-colors"
                      >
                        हटवा
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        )}

        {/* Add New Certificate Form */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-blue-800">
            {selectedId ? "दाखला संपादित करा" : "नवीन दाखला जोडा"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Certificate Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
              दाखल्याचे नाव
            </label>
            <input
              type="text"
              value={current.certificateName}
              onChange={(e) =>
                handleFieldChange("certificateName", e.target.value)
              }
              className="border rounded-md px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="दाखल्याचे नाव लिहा"
            />
          </div>

          {/* Certificate Description */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
              दाखल्याचे वर्णन
            </label>
            <textarea
              value={current.certificateDescription}
              onChange={(e) =>
                handleFieldChange("certificateDescription", e.target.value)
              }
              className="border rounded-md px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              placeholder="दाखल्याचे वर्णन लिहा"
            />
          </div>

          {/* Apply Online URL */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-600">
              ऑनलाइन अर्ज लिंक (Optional)
            </label>
            <input
              type="url"
              value={current.applyOnlineUrl || ""}
              onChange={(e) =>
                handleFieldChange("applyOnlineUrl", e.target.value)
              }
              className="border rounded-md px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://example.com/apply"
            />
            <p className="text-xs text-gray-500 mt-1">
              जर हा दाखला ऑनलाइन मिळू शकत असेल तर लिंक भरा
            </p>
          </div>

          {/* Required Documents */}
          <div className="flex flex-col">
            <label className="mb-2 text-xs sm:text-sm md:text-base font-medium text-gray-600">
              आवश्यक कागदपत्रे
            </label>
            {current.requiredDocuments.map((doc, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={doc}
                  onChange={(e) => handleDocumentChange(idx, e.target.value)}
                  className="flex-1 border rounded-md px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={`कागदपत्र #${idx + 1}`}
                />
                <button
                  type="button"
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded shrink-0"
                  onClick={() => removeDocument(idx)}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDocument}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors w-full sm:w-auto"
            >
              कागदपत्र जोडा
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex-1 sm:flex-none"
            >
              {selectedId ? "बदल जतन करा" : "दाखला जतन करा"}
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors flex-1 sm:flex-none"
              >
                रद्द करा
              </button>
            )}
          </div>
        </form>

        {/* Back to Dashboard Button */}
        <div className="mt-6">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            डॅशबोर्डवर परत जा
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">दाखला हटवायचा?</h3>
            <p className="text-gray-500 text-sm mb-6">हा दाखला कायमचा हटवला जाईल. आपण खात्रीशीर आहात का?</p>
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
