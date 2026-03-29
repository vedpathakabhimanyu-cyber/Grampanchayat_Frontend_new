"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { toast } from "sonner";
import { taxPaymentAPI } from "@/lib/admin/api";
import Image from "next/image";
import { Upload, X, Landmark, FileText, QrCode, Trash2 } from "lucide-react";

interface TaxPaymentData {
  id?: string;
  qrFileUrl?: string;
  taxInfo: string;
  bankName: string;
  accountName: string;
  accountNo: string;
  ifscCode: string;
}

export default function TaxPaymentPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [data, setData] = useState<TaxPaymentData>({
    taxInfo: "",
    bankName: "State Bank of India",
    accountName: "Grampanchayat Karvat",
    accountNo: "12345678901",
    ifscCode: "SBIN0001234",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await taxPaymentAPI.get();
      if (response.success && response.data) {
        setData((prev) => ({
          ...prev,
          ...response.data,
        }));
        if (response.data.qrFileUrl) {
          setPreviewUrl(response.data.qrFileUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching tax info:", error);
      toast.error("माहिती लोड करताना त्रुटी आली.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleReset = () => {
    setData({
      taxInfo: "",
      bankName: "",
      accountName: "",
      accountNo: "",
      ifscCode: "",
    });
    setSelectedFile(null);
    setPreviewUrl(data.qrFileUrl || null);
    toast.info("फॉर्म रिसेट केला आहे.");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await taxPaymentAPI.delete();
      toast.success("सर्व माहिती यशस्वीरित्या हटवण्यात आली.");
      
      // Clear local state
      setData({
        taxInfo: "",
        bankName: "",
        accountName: "",
        accountNo: "",
        ifscCode: "",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      
      localStorage.removeItem("task10");
      window.dispatchEvent(new Event("taskUpdate"));
    } catch (error) {
      console.error("Error deleting tax info:", error);
      toast.error("माहिती हटवताना त्रुटी आली.");
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await taxPaymentAPI.deleteImage();
      toast.success("इमेज यशस्वीरित्या हटवण्यात आली.");
      setPreviewUrl(null);
      setSelectedFile(null);
      setData(prev => ({ ...prev, qrFileUrl: undefined }));
      fetchData(); // Refresh data from server
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("इमेज हटवताना त्रुटी आली.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Save text data
      await taxPaymentAPI.save(data);

      // 2. Upload file if selected
      if (selectedFile) {
        await taxPaymentAPI.upload(selectedFile);
      }

      toast.success("माहिती यशस्वीरित्या जतन केली!");
      localStorage.setItem("task10", JSON.stringify({ completed: true }));
      // Trigger update for dashboard
      window.dispatchEvent(new Event("taskUpdate"));
      
      // Refresh to get new URL if uploaded
      fetchData();
    } catch (error) {
      console.error("Error saving tax payment info:", error);
      toast.error("माहिती जतन करताना त्रुटी आली.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 relative">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[#0A1931] rounded-xl shadow-lg text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <Landmark className="h-8 w-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">कर भरणी (Kar Bharani)</h1>
              <p className="text-blue-100 text-sm">QR कोड, कर माहिती आणि बँक तपशील व्यवस्थापित करा</p>
            </div>
          </div>
          
          {data.id && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-red-500/20 hover:bg-red-500 border border-red-500/50 text-white flex items-center gap-2"
            >
              <Trash2 size={18} />
              माहिती हटवा
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Top Section: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Box: Upload QR */}
            <Card className="shadow-md border-t-4 border-t-[#0A1931] overflow-hidden">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg flex items-center gap-2 text-[#0A1931]">
                  <QrCode className="h-5 w-5" />
                  QR कोड / दस्तऐवज अपलोड करा
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative min-h-[300px]">
                  {previewUrl ? (
                    <div className="relative w-full h-64">
                      {previewUrl.toLowerCase().endsWith(".pdf") || selectedFile?.type === "application/pdf" ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <FileText className="h-24 w-24 text-red-500 mb-2" />
                          <p className="text-sm font-medium text-gray-700">PDF दस्तऐवज निवडला आहे</p>
                          <p className="text-xs text-gray-500">कव्हर पेज म्हणून दाखवला जाईल</p>
                        </div>
                      ) : (
                        <Image
                          src={previewUrl}
                          alt="QR Code Preview"
                          fill
                          className="object-contain rounded-lg"
                        />
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreviewUrl(data.qrFileUrl || null);
                        }}
                        className="absolute -top-2 -right-2 bg-gray-500 text-white p-1.5 rounded-full shadow-lg hover:bg-gray-600 transition-all z-10"
                        title="निवड रद्द करा"
                      >
                        <X size={16} />
                      </button>

                      {data.qrFileUrl && !selectedFile && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("तुम्हाला खात्री आहे की ही इमेज सर्व्हरवरून हटवायची आहे?")) {
                              handleDeleteImage();
                            }
                          }}
                          className="absolute -bottom-2 -right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all z-10"
                          title="सर्व्हरवरून इमेज हटवा"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm font-medium text-gray-600">JPG, PNG किंवा PDF निवडा</p>
                      <p className="text-xs text-gray-400 mt-1">जास्तीत जास्त १० MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Right Box: Tax Information */}
            <Card className="shadow-md border-t-4 border-t-[#0A1931]">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg flex items-center gap-2 text-[#0A1931]">
                  <FileText className="h-5 w-5" />
                  कर माहिती (Tax Information)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    तपशील लिहा
                  </label>
                  <Textarea
                    placeholder="कर माहिती, संदर्भ क्रमांक, महत्त्वाच्या सूचना इ. प्रविष्ट करा..."
                    rows={11}
                    className="resize-none"
                    value={data.taxInfo}
                    onChange={(e) => setData({ ...data, taxInfo: e.target.value })}
                  />
                  <p className="text-xs text-gray-400 italic">
                    सूचना: ही माहिती नागरिकांना कर भरताना मार्गदर्शक ठरेल.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section: Bank Details */}
          <Card className="shadow-md border-t-4 border-t-[#0A1931]">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg flex items-center gap-2 text-[#0A1931]">
                <Landmark className="h-5 w-5" />
                बँक तपशील (Bank Details)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">बँकेचे नाव</label>
                  <Input
                    value={data.bankName}
                    onChange={(e) => setData({ ...data, bankName: e.target.value })}
                    className="font-medium"
                    placeholder="उदा. State Bank of India"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">खाते नाव</label>
                  <Input
                    value={data.accountName}
                    onChange={(e) => setData({ ...data, accountName: e.target.value })}
                    className="font-medium"
                    placeholder="उदा. ग्रामपंचायत कर्वत"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">खाते क्रमांक</label>
                  <Input
                    value={data.accountNo}
                    onChange={(e) => setData({ ...data, accountNo: e.target.value })}
                    className="font-medium"
                    placeholder="उदा. 12345678901"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">IFSC कोड</label>
                  <Input
                    value={data.ifscCode}
                    onChange={(e) => setData({ ...data, ifscCode: e.target.value })}
                    className="font-medium uppercase"
                    placeholder="उदा. SBIN0001234"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-8 border-gray-300 hover:bg-gray-100"
            >
              रिसेट करा
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="px-12 bg-[#0A1931] hover:bg-[#11264d] text-white font-bold"
            >
              {saving ? "जतन होत आहे..." : data.id ? "बदल जतन करा" : "माहिती जतन करा"}
            </Button>
          </div>
        </form>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-red-50 ring-opacity-50">
                <Trash2 size={40} className="animate-bounce" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">कायमचे हटवायचे?</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                तुम्हाला खात्री आहे की सर्व कर माहिती हटवू इच्छिता? ही प्रक्रिया परत करता येणार नाही आणि वेबसाइटवरून माहिती निघून जाईल.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
                >
                  रद्द करा
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {deleting ? "हटवत आहे..." : "हो, हटवा"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
