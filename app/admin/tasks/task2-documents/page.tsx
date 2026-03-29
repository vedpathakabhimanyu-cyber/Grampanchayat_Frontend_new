"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { infrastructureAPI } from "@/lib/admin/api";
import { toast } from "sonner";

type ExtraField = {
  title: string;
  value: string;
};

interface Task2Data {
  population: string;
  literacyRate: string;
  sanitationCoverage: string;
  waterConnection: string;
  electricitySupply: string;
  treePlantation: string;
  schemeBeneficiaries: string[];
  gramNidhiUsage: string;
  complaintResolution: string;
  extraFields: ExtraField[];
}

export default function Task2Form() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<Task2Data>({
    population: "",
    literacyRate: "",
    sanitationCoverage: "",
    waterConnection: "",
    electricitySupply: "",
    treePlantation: "",
    schemeBeneficiaries: [""],
    gramNidhiUsage: "",
    complaintResolution: "",
    extraFields: [],
  });

  // Load existing data from backend
  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const response = await infrastructureAPI.getBySubcategory("आकडेवारी");
        if (response.success && response.data && response.data.length > 0) {
          // Transform infrastructure data back to form format
          const transformedData: Task2Data = {
            population: "",
            literacyRate: "",
            sanitationCoverage: "",
            waterConnection: "",
            electricitySupply: "",
            treePlantation: "",
            schemeBeneficiaries: [""],
            gramNidhiUsage: "",
            complaintResolution: "",
            extraFields: [],
          };

          const fieldMapping: { [key: string]: keyof Task2Data } = {
            लोकसंख्या: "population",
            "साक्षरता दर": "literacyRate",
            "स्वच्छता कव्हरेज": "sanitationCoverage",
            "पाणी कनेक्शन": "waterConnection",
            "विद्युत पुरवठा": "electricitySupply",
            "वृक्ष लागवड": "treePlantation",
            "ग्रामनिधी वापर": "gramNidhiUsage",
            "तक्रार निराकरण": "complaintResolution",
          };

          response.data.forEach((item: any) => {
            const field = fieldMapping[item.facility];
            if (field) {
              transformedData[field] = item.count || "";
            } else {
              // Extra field
              transformedData.extraFields.push({
                title: item.facility,
                value: item.count || "",
              });
            }
          });

          setData(transformedData);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingData();
  }, []);

  const handleChange = (field: keyof Task2Data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSchemeBeneficiaryChange = (index: number, value: string) => {
    const newArr = [...data.schemeBeneficiaries];
    newArr[index] = value;
    setData((prev) => ({ ...prev, schemeBeneficiaries: newArr }));
  };

  const addExtraField = () => {
    const title = prompt("शीर्षक भरा:");
    if (!title) return;
    const value = prompt(`"${title}" साठी मूल्य भरा:`) || "";

    setData((prev) => ({
      ...prev,
      extraFields: [...prev.extraFields, { title, value }],
    }));
  };

  const removeExtraField = (index: number) => {
    const newArr = [...data.extraFields];
    newArr.splice(index, 1);
    setData((prev) => ({ ...prev, extraFields: newArr }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare data for backend - transform to infrastructure format
      const infrastructureData = [
        {
          subcategory: "आकडेवारी",
          facility: "लोकसंख्या",
          count: data.population,
        },
        {
          subcategory: "आकडेवारी",
          facility: "साक्षरता दर",
          count: data.literacyRate,
        },
        {
          subcategory: "आकडेवारी",
          facility: "स्वच्छता कव्हरेज",
          count: data.sanitationCoverage,
        },
        {
          subcategory: "आकडेवारी",
          facility: "पाणी कनेक्शन",
          count: data.waterConnection,
        },
        {
          subcategory: "आकडेवारी",
          facility: "विद्युत पुरवठा",
          count: data.electricitySupply,
        },
        {
          subcategory: "आकडेवारी",
          facility: "वृक्ष लागवड",
          count: data.treePlantation,
        },
        {
          subcategory: "आकडेवारी",
          facility: "ग्रामनिधी वापर",
          count: data.gramNidhiUsage,
        },
        {
          subcategory: "आकडेवारी",
          facility: "तक्रार निराकरण",
          count: data.complaintResolution,
        },
        ...data.extraFields.map((field) => ({
          subcategory: "आकडेवारी",
          facility: field.title,
          count: field.value,
        })),
      ].filter((item) => item.count); // Only include filled fields

      // Save to backend with subcategory to replace only "आकडेवारी" items
      await infrastructureAPI.save(infrastructureData, "आकडेवारी");

      // Also save to localStorage as backup
      const existing = localStorage.getItem("task2");
      let parsed: Task2Data[] = [];
      if (existing) {
        try {
          parsed = JSON.parse(existing);
        } catch {
          parsed = [];
        }
      }
      parsed.push(data);
      localStorage.setItem("task2", JSON.stringify(parsed));
      window.dispatchEvent(new Event("taskUpdate"));

      console.log("✅ Task 2 saved");
      toast.success("आकडेवारी यशस्वीरित्या जतन केली!");
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("❌ Failed to save Task 2:", err);
      toast.error("त्रुटी: " + (err.message || "डेटा जतन करताना समस्या आली"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto font-inter">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">
          कार्य 2: मुख्य आकडेवारी (Statistics)
        </h1>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">माहिती लोड होत आहे...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            {[
              { field: "population", label: "लोकसंख्या" },
              { field: "literacyRate", label: "साक्षरता दर" },
              { field: "sanitationCoverage", label: "स्वच्छता कव्हरेज" },
              { field: "waterConnection", label: "नळजोडणी" },
              { field: "electricitySupply", label: "वीजपुरवठा" },
              { field: "treePlantation", label: "वृक्षारोपण" },
              { field: "gramNidhiUsage", label: "ग्रामनिधी वापर" },
              { field: "complaintResolution", label: "तक्रार निराकरण" },
            ].map(({ field, label }) => (
              <div
                key={field}
                className="border rounded-lg p-3 sm:p-4 shadow-sm"
              >
                <div className="flex flex-col">
                  <label className="mb-1 text-xs sm:text-sm md:text-base font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={(data as any)[field]}
                    onChange={(e) =>
                      handleChange(field as keyof Task2Data, e.target.value)
                    }
                    className="border rounded-md px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder={`${label} भरा`}
                  />
                </div>
              </div>
            ))}

            {/* Scheme Beneficiaries */}
            <div className="border p-3 sm:p-4 rounded-lg">
              <h3 className="text-sm sm:text-base font-semibold mb-3 text-gray-700">
                योजना लाभार्थी
              </h3>

              {(data.schemeBeneficiaries || []).map((b, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="text"
                    value={b}
                    onChange={(e) =>
                      handleSchemeBeneficiaryChange(index, e.target.value)
                    }
                    placeholder={`लाभार्थी ${index + 1}`}
                    className="border rounded-md px-3 py-1.5 sm:py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none w-full"
                  />
                </div>
              ))}
            </div>

            {/* Extra Fields */}
            {data.extraFields.length > 0 && (
              <div className="border p-3 sm:p-4 rounded-lg bg-gray-50">
                <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  अतिरिक्त माहिती
                </h4>
                {data.extraFields.map((f, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border p-2 rounded-md bg-white mb-2"
                  >
                    <div className="text-xs sm:text-sm">
                      <strong>{f.title}:</strong> {f.value}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExtraField(i)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <button
                type="button"
                onClick={addExtraField}
                className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 w-full sm:w-auto"
              >
                अतिरिक्त फील्ड जोडा
              </button>

              <button
                type="submit"
                className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 w-full sm:w-auto"
              >
                कार्य 2 सबमिट करा
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
