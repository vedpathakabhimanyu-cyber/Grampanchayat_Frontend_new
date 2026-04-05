"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { ScrollArea } from "@/components/admin/ui/scroll-area";
import { Separator } from "@/components/admin/ui/separator";
import { infrastructureAPI } from "@/lib/admin/api";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface InfrastructureData {
  id?: string;
  subcategory: string;
  facility: string;
  count: string;
}

type GroupedData = {
  [key: string]: InfrastructureData[];
};

// ✅ Updated data with Marathi text
const INITIAL_DATA: InfrastructureData[] = [
  // Education
  {
    subcategory: "शिक्षण",
    facility: "अंगणवाडी केंद्रे",
    count: "1",
  },
  {
    subcategory: "शिक्षण",
    facility: "वाचनालय",
    count: "",
  },
  // Health
  {
    subcategory: "आरोग्य",
    facility: "प्राथमिक आरोग्य केंद्र",
    count: "",
  },
  {
    subcategory: "आरोग्य",
    facility: "खाजगी दवाखाने",
    count: "",
  },
  // Connectivity
  {
    subcategory: "कनेक्टिव्हिटी",
    facility: "डांबरी रस्ते",
    count: "",
  },
  {
    subcategory: "कनेक्टिव्हिटी",
    facility: "मोबाईल कव्हरेज",
    count: "",
  },
  // Water & Sanitation
  {
    subcategory: "पाणी आणि स्वच्छता",
    facility: "सार्वजनिक शौचालये",
    count: "",
  },
  {
    subcategory: "पाणी आणि स्वच्छता",
    facility: "कचरा व्यवस्थापन",
    count: "",
  },
  // Electricity
  {
    subcategory: "वीज",
    facility: "विद्युतीकरण",
    count: "",
  },
  {
    subcategory: "वीज",
    facility: "रस्त्यावरील दिवे",
    count: "",
  },
];

export default function InfrastructurePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [existingData, setExistingData] = useState<InfrastructureData[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState("");
  const [data, setData] = useState<InfrastructureData[]>(INITIAL_DATA);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [newEntry, setNewEntry] = useState<InfrastructureData>({
    subcategory: "",
    facility: "",
    count: "",
  });
  const [editedItems, setEditedItems] = useState<Set<number>>(new Set());
  const [savingItems, setSavingItems] = useState<Set<number>>(new Set());

  // Load data from backend and merge with INITIAL_DATA
  useEffect(() => {
    const fetchAndMergeData = async () => {
      try {
        const response = await infrastructureAPI.getAll();
        if (response && Array.isArray(response.data)) {
          // Filter out "आकडेवारी" subcategory (handled by Task 2)
          const dbData = response.data.filter(
            (item: any) => item.subcategory !== "आकडेवारी",
          );

          setExistingData(dbData);

          // Merge dbData into INITIAL_DATA
          const merged = [...INITIAL_DATA];

          dbData.forEach((dbItem: any) => {
            const index = merged.findIndex(
              (m) =>
                m.facility === dbItem.facility &&
                m.subcategory === dbItem.subcategory,
            );

            if (index !== -1) {
              // Update existing template item with DB data (including ID)
              merged[index] = { ...dbItem };
            } else {
              // Add new item from DB that wasn't in template
              merged.push(dbItem);
            }
          });

          setData(merged);
        }
      } catch (error) {
        console.error("Error fetching infrastructure data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMergeData();
  }, []);

  // Load saved form data
  useEffect(() => {
    const savedData = localStorage.getItem("task5");
    if (savedData) setData(JSON.parse(savedData));
  }, []);

  // Delete infrastructure item
  const handleDelete = (id: string, name: string) => {
    setDeletingId(id);
    setDeletingName(name);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await infrastructureAPI.delete(deletingId);
      setExistingData(existingData.filter((item) => item.id !== deletingId));
      setData(data.filter((item) => item.id !== deletingId));
      toast.success("सुविधा यशस्वीरित्या हटवली!");
    } catch (error: any) {
      console.error("Error deleting infrastructure:", error);
      toast.error("त्रुटी: सुविधा हटवताना समस्या आली");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      setDeletingName("");
    }
  };

  // Save individual infrastructure item
  const handleSaveItem = async (index: number) => {
    const item = data[index];
    if (!item.subcategory || !item.facility || !item.count) {
      toast.error("कृपया सर्व फील्ड भरा");
      return;
    }

    setSavingItems((prev) => new Set([...prev, index]));

    try {
      const itemToSave = {
        id: item.id,
        subcategory: item.subcategory,
        facility: item.facility,
        count: item.count,
      };

      await infrastructureAPI.save([itemToSave]);
      setEditedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      toast.success("सुविधा यशस्वीरित्या जतन केली!");
    } catch (error: any) {
      console.error("Error saving item:", error);
      toast.error("त्रुटी: " + (error.message || "आयटम जतन करताना समस्या आली"));
    } finally {
      setSavingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  type GroupedDataItem = {
    item: InfrastructureData;
    originalIndex: number;
  };

  const groupedData = data.reduce(
    (acc: { [key: string]: GroupedDataItem[] }, item, index) => {
      if (!acc[item.subcategory]) acc[item.subcategory] = [];
      acc[item.subcategory].push({ item, originalIndex: index });
      return acc;
    },
    {},
  );

  useEffect(() => {
    localStorage.setItem("task5", JSON.stringify(data));
    window.dispatchEvent(new Event("taskUpdate"));
  }, [data]);

  const handleChange = (
    index: number,
    field: keyof InfrastructureData,
    value: string,
  ) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    setData(updated);
    setEditedItems((prev) => new Set([...prev, index]));
  };

  const addNewEntry = () => {
    if (newEntry.subcategory && newEntry.facility) {
      setData([...data, { ...newEntry, count: newEntry.count || "0" }]);
      setNewEntry({
        subcategory: "",
        facility: "",
        count: "",
      });
      setExpandedSections(new Set([...expandedSections, newEntry.subcategory]));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <form className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          मूलभूत पायाभूत सुविधा
        </h2>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">माहिती लोड होत आहे...</p>
          </div>
        ) : (
          <>
            {/* Info Alert */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <p className="text-sm text-green-800">
                <strong>टीप:</strong> खालील यादीतील संख्या बदलून तुम्ही माहिती
                अपडेट करू शकता. नवीन सुविधा जोडण्यासाठी खाली दिलेला "नवीन
                पायाभूत सुविधा जोडा" विभाग वापरा.
              </p>
            </div>

            {/* Add New Section Header */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h3 className="text-base sm:text-lg font-semibold text-blue-800">
                नवीन पायाभूत सुविधा जोडा
              </h3>
            </div>

            {/* Data Entry */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  पायाभूत सुविधा तपशील
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] sm:h-[500px] md:h-[600px] w-full rounded-md border p-2 sm:p-3 md:p-4">
                  <div className="space-y-4 sm:space-y-6">
                    {Object.entries(groupedData).map(([subcategory, items]) => (
                      <div key={subcategory} className="space-y-2">
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full flex items-center justify-between p-2 text-sm sm:text-base md:text-lg font-semibold hover:bg-gray-100"
                          onClick={() => {
                            const newExpanded = new Set(expandedSections);
                            if (newExpanded.has(subcategory))
                              newExpanded.delete(subcategory);
                            else newExpanded.add(subcategory);
                            setExpandedSections(newExpanded);
                          }}
                        >
                          <span>{subcategory}</span>
                          <span>
                            {expandedSections.has(subcategory) ? "▼" : "▶"}
                          </span>
                        </Button>

                        {expandedSections.has(subcategory) && (
                          <div className="pl-4 space-y-3">
                            {items.map(({ item, originalIndex }, idx) => {
                              return (
                                <div
                                  key={idx}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-white p-3 rounded-md border border-gray-100 hover:border-blue-200 transition-colors"
                                >
                                  <div className="flex justify-between items-center">
                                    <p className="font-medium">
                                      {item.facility}
                                    </p>
                                    {item.id && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDelete(item.id!, item.facility)
                                        }
                                        className="text-red-400 hover:text-red-600 p-1"
                                        title="हटवा"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-600 shrink-0">
                                      संख्या:
                                    </p>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={item.count}
                                      onChange={(e) =>
                                        handleChange(
                                          originalIndex,
                                          "count",
                                          e.target.value,
                                        )
                                      }
                                      className="h-9 focus:ring-blue-500"
                                      placeholder="संख्या"
                                    />
                                    {editedItems.has(originalIndex) && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSaveItem(originalIndex)
                                        }
                                        disabled={savingItems.has(
                                          originalIndex,
                                        )}
                                        className="ml-2 px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded text-sm font-medium whitespace-nowrap"
                                      >
                                        {savingItems.has(originalIndex)
                                          ? "जतन होत आहे..."
                                          : "जतन करा"}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <Separator className="mt-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Add New Entry */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>नवीन पायाभूत सुविधा जोडा</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="उपवर्ग"
                    value={newEntry.subcategory}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, subcategory: e.target.value })
                    }
                  />
                  <Input
                    placeholder="सुविधा"
                    value={newEntry.facility}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, facility: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    min="0"
                    placeholder="संख्या"
                    value={newEntry.count}
                    onChange={(e) =>
                      setNewEntry({ ...newEntry, count: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="button"
                  onClick={addNewEntry}
                  className="mt-4 w-full"
                >
                  नवीन नोंद जोडा
                </Button>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card className="w-full">
              <CardContent className="pt-6">
                <div className="flex justify-between gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      router.push("/admin/tasks/task4-email-verification")
                    }
                  >
                    मागील कार्य
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      try {
                        // Only save items that have count values (filled items)
                        // This prevents duplicates from re-saving pre-filled template data
                        const infrastructureData = data
                          .filter(
                            (item) =>
                              item.count !== undefined &&
                              item.count !== null &&
                              String(item.count).trim() !== "",
                          )
                          .map((item) => ({
                            id: item.id,
                            subcategory: item.subcategory,
                            facility: item.facility,
                            count: item.count,
                          }));

                        if (infrastructureData.length === 0) {
                          toast.warning("कृपया किमान एक सुविधेची माहिती भरा");
                          return;
                        }

                        await infrastructureAPI.save(infrastructureData);
                        toast.success(
                          "पायाभूत सुविधा यशस्वीरित्या जतन केल्या!",
                        );
                        router.push("/admin/dashboard");
                      } catch (error: any) {
                        console.error("Error saving infrastructure:", error);
                        toast.error(
                          "त्रुटी: " +
                            (error.message || "डेटा जतन करताना समस्या आली"),
                        );
                      }
                    }}
                  >
                    कार्य पूर्ण करा
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </form>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              सुविधा हटवायची?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              "{deletingName}" ही सुविधा कायमची हटवली जाईल. आपण खात्रीशीर आहात
              का?
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
