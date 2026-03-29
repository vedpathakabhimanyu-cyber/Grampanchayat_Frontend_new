"use client";

import React, { useState, useEffect } from "react";
import websiteAPI from "@/lib/api";
import {
  FaUsers,
  FaMapMarkedAlt,
  FaLeaf,
  FaTrophy,
  FaHistory,
  FaMapMarkerAlt,
  FaLandmark,
  FaCalendarAlt,
  FaAward,
} from "react-icons/fa";
import {
  BookOpen,
  Droplets,
  Home,
  Leaf,
  MessageSquare,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { formatMarathiNumber, replaceWithMarathiDigits } from "@/lib/utils";

interface DocumentData {
  id: string;
  title: string;
  description?: string;
  category: string;
  data: {
    value?: string;
    change?: string;
    icon?: string;
  };
  createdAt: string;
}

interface HistoricalAward {
  id: string;
  awardName: string;
  awardDescription?: string;
  year?: string;
}

interface InfrastructureItem {
  id: string;
  subcategory: string;
  facility: string;
  count: string;
}

interface HistoricalEvent {
  id: string;
  year: string;
  eventName: string;
  additionalInfo?: string;
  image?: string;
}

interface HistoricalPlace {
  id: string;
  placeName: string;
  placeInfo?: string;
  image?: string;
}

interface GrampanchayatInfo {
  id: string;
  grampanchayatName: string;
  talukaName?: string;
  districtName?: string;
  phone?: string;
  email?: string;
  address?: string;
  pincode?: string;
  website?: string;
}

const iconMap: Record<string, React.ReactElement> = {
  users: <Users className="text-blue-600 w-6 h-6" />,
  book: <BookOpen className="text-green-600 w-6 h-6" />,
  droplets: <Droplets className="text-sky-600 w-6 h-6" />,
  home: <Home className="text-teal-600 w-6 h-6" />,
  zap: <Zap className="text-yellow-500 w-6 h-6" />,
  leaf: <Leaf className="text-green-500 w-6 h-6" />,
  target: <Target className="text-purple-600 w-6 h-6" />,
  wallet: <Wallet className="text-rose-600 w-6 h-6" />,
  message: <MessageSquare className="text-cyan-600 w-6 h-6" />,
};

export default function IntroductionPage() {
  const [stats, setStats] = useState<DocumentData[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureItem[]>(
    []
  );
  const [timeline, setTimeline] = useState<HistoricalEvent[]>([]);
  const [historicalPlaces, setHistoricalPlaces] = useState<HistoricalPlace[]>(
    []
  );
  const [gpInfo, setGpInfo] = useState<GrampanchayatInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [historicalAwards, setHistoricalAwards] = useState<HistoricalAward[]>(
    []
  );

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      console.log("Starting to fetch all data for Introduction page...");

      // 1. Fetch Infrastructure
      try {
        const infraRes = await websiteAPI.getInfrastructure();
        console.log("Infrastructure API Response:", infraRes);
        
        if (infraRes && infraRes.success && Array.isArray(infraRes.data)) {
          const allInfraData = infraRes.data;

          // Statistics for dashboard (subcategory: "आकडेवारी")
          const statsData = allInfraData.filter(
            (item: InfrastructureItem) => item.subcategory === "आकडेवारी"
          );
          console.log("Filtered stats data:", statsData);

          const transformedStats = statsData.map((item: InfrastructureItem) => ({
            id: item.id,
            title: item.facility,
            data: {
              value: item.count,
              icon: getIconForFacility(item.facility),
            },
          }));

          setStats(transformedStats as any);

          // Other infrastructure
          const otherInfra = allInfraData.filter(
            (item: InfrastructureItem) => item.subcategory !== "आकडेवारी"
          );
          setInfrastructure(otherInfra);
        } else {
          console.warn("Infrastructure API returned unsuccessful or empty data:", infraRes);
        }
      } catch (error) {
        console.error("Failed to fetch infrastructure:", error);
      }

      // 2. Fetch Historical Data
      try {
        const histRes = await websiteAPI.getHistorical();
        console.log("Historical API Response:", histRes);
        if (histRes.success && histRes.data) {
          setTimeline(histRes.data.events || []);
          setHistoricalPlaces(histRes.data.places || []);
          setHistoricalAwards(histRes.data.awards || []);
        } else {
          console.warn("Historical API returned unsuccessful or empty data");
        }
      } catch (error) {
        console.error("Failed to fetch historical data:", error);
      }

      // 3. Fetch GP Info
      try {
        const gpRes = await websiteAPI.getGrampanchayatInfo();
        console.log("GP Info API Response:", gpRes);
        if (gpRes.success && gpRes.data) {
          setGpInfo(gpRes.data);
        } else {
          console.warn("GP Info API returned unsuccessful or empty data");
        }
      } catch (error) {
        console.error("Failed to fetch GP info:", error);
      }

      setLoading(false);
      console.log("Data fetching completed.");
    };

    fetchAllData();
  }, []);

  // Helper function to map facility names to icons
  const getIconForFacility = (facility: string): string => {
    const iconMapping: Record<string, string> = {
      लोकसंख्या: "users",
      "साक्षरता दर": "book",
      "स्वच्छता कव्हरेज": "droplets",
      "पाणी कनेक्शन": "droplets",
      "विद्युत पुरवठा": "zap",
      "वृक्ष लागवड": "leaf",
      "योजनेचे लाभार्थी": "target",
      "ग्रामनिधी वापर": "wallet",
      "तक्रार निराकरण": "message",
      "तक्रार निवारण": "message", // Support both spellings
    };
    return iconMapping[facility] || "users";
  };

  // Group infrastructure by subcategory
  const groupedInfrastructure = infrastructure.reduce((acc, item) => {
    if (!acc[item.subcategory]) {
      acc[item.subcategory] = [];
    }
    acc[item.subcategory].push(item);
    return acc;
  }, {} as Record<string, InfrastructureItem[]>);

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
              <h3 className="text-h6 font-bold tracking-wide font-marathi">
                परिचय आणि इतिहास
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700"></div>
                  <p className="mt-2 text-gray-600 text-sm sm:text-base font-marathi">
                    माहिती लोड होत आहे...
                  </p>
                </div>
              ) : (
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-marathi">
                  ग्रामपंचायत {gpInfo?.grampanchayatName || ""} मध्ये आपले
                  स्वागत आहे. आमच्या गावाला समृद्ध इतिहास आणि मजबूत सामुदायिक
                  भावना आहे.
                </p>
              )}
            </div>
          </section>

          {/* Infrastructure */}
          <section className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
              <h3 className="text-h6 font-bold tracking-wide font-marathi">
                मूलभूत पायाभूत सुविधा
              </h3>
            </div>

            {/* Content Section */}
            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
                  <p className="mt-3 text-gray-600 text-sm sm:text-base font-marathi">
                    लोड होत आहे...
                  </p>
                </div>
              ) : Object.keys(groupedInfrastructure).length === 0 ? (
                /* Empty State */
                <div className="text-center py-10">
                  <p className="text-gray-600 text-sm sm:text-base font-marathi">
                    पायाभूत सुविधा माहिती उपलब्ध नाही
                  </p>
                </div>
              ) : (
                /* Data Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(groupedInfrastructure).map(
                    ([subcategory, items], index) => {
                      const colors = [
                        "border-[#0A1931]",
                        "border-[#1A3D63]",
                        "border-[#4A7FA7]",
                        "border-[#0A1931]",
                        "border-[#1A3D63]",
                      ];
                      const colorClass = colors[index % colors.length];

                      return (
                        <div
                          key={subcategory}
                          className={`border-l-4 ${colorClass} pl-4 bg-gray-50 rounded-md p-4 hover:shadow-md transition-shadow duration-300`}
                        >
                          <h4 className="font-bold text-sm sm:text-base md:text-lg mb-2 text-[#0A1931] font-marathi">
                            {subcategory}
                          </h4>
                          <ul className="space-y-1 text-gray-700 text-sm sm:text-sm md:text-base font-marathi">
                            {items.map((item) => (
                              <li key={item.id}>
                                • {item.facility}: {replaceWithMarathiDigits(item.count)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Dashborad */}
          <section className="mb-10 mt-4">
            <div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
                  <TrendingUp className="text-lg sm:text-xl md:text-2xl mr-2" />
              <h3 className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-5 py-2.5 flex items-center justify-start space-x-3" style={{ marginBottom: "1px"
}}>
                    मुख्य आकडेवारी (माझे गाव, माझी प्रगती)
                  </h3>
                </div>
                <div className="p-4 sm:p-6">
                  {loading ? (
                    <div className="text-center py-10">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
                      <p className="mt-2 text-gray-600">लोड होत आहे...</p>
                    </div>
                  ) : stats.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-600">आकडेवारी उपलब्ध नाही</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                      {stats.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 rounded-lg p-3 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-0">
                            <div className="mb-1 sm:mb-0">
                              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                                {item.data?.value ? formatMarathiNumber(item.data.value) : replaceWithMarathiDigits("०")}
                              </h4>
                              <p className="text-sm sm:text-sm md:text-base text-gray-600">
                                {item.title}
                              </p>
                            </div>
                            {item.data?.icon && iconMap[item.data.icon] ? (
                              iconMap[item.data.icon]
                            ) : (
                              <TrendingUp className="text-blue-600 w-6 h-6" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          <div className="border-t pt-10 mt-10">
            {/* History Header */}
          {/* Page Header */}
          <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-1 flex items-center justify-start space-x-3 mb-2 mt-2">
              <h3 className="text-h6 font-bold tracking-wide font-marathi">
              इतिहास
            </h3>
          </div>

          {/* Introduction */}
          <section className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8 max-w-7xl mx-auto">
            {/* Section Content */}
            <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
              आमच्या गावाला समृद्ध ऐतिहासिक वारसा आहे. स्वातंत्र्य चळवळीत आमच्या
              गावाने महत्त्वाची भूमिका बजावली आणि आजही त्या वीर सैनिकांचे स्मरण
              केले जाते.
            </p>
          </section>

          {/* Timeline */}
          <section className="mb-10">
              <h3 className="text-h6 font-bold tracking-wide font-marathi">
              ऐतिहासिक कालखंड
            </h3>

            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
                <p className="mt-2 text-gray-600">लोड होत आहे...</p>
              </div>
            ) : timeline.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg">
                <p className="text-gray-600">ऐतिहासिक माहिती उपलब्ध नाही</p>
              </div>
            ) : (
              <div className="relative border-l-4 border-government-blue ml-6 pl-8 space-y-8 max-w-7xl mx-auto">
                {timeline.map((event, index) => {
                  const colors = [
                    "bg-orange-500",
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-red-500",
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <div key={event.id} className="relative">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[22px] top-3 w-4 h-4 rounded-full border-4 border-white shadow-md ${color}`}
                      ></div>

                      {/* Timeline Card */}
                      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 max-w-3xl w-full">
                        <div className="flex items-center mb-3">
                          <FaCalendarAlt
                            className={`text-lg sm:text-xl mr-2 ${color.replace(
                              "bg-",
                              "text-"
                            )}`}
                          />
                          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-government-blue">
                            {replaceWithMarathiDigits(event.year)}
                          </h3>
                        </div>

                        <h4 className="text-base sm:text-lg md:text-xl font-medium text-government-blue mb-2">
                          {event.eventName}
                        </h4>
                        {event.additionalInfo && (
                          <p className="text-gray-700 text-sm sm:text-sm md:text-base leading-relaxed">
                            {event.additionalInfo}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Historical Places */}
          <section className="mb-10">
              <h3 className="text-h6 font-bold tracking-wide font-marathi">
              ऐतिहासिक स्थळे
            </h3>

            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
                <p className="mt-2 text-gray-600">लोड होत आहे...</p>
              </div>
            ) : historicalPlaces.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg">
                <p className="text-gray-600">
                  ऐतिहासिक स्थळे माहिती उपलब्ध नाही
                </p>
              </div>
            ) : (
              <div className="relative border-l-4 border-government-blue ml-6 pl-8 space-y-8 max-w-3xl mx-auto">
                {historicalPlaces.map((place, index) => (
                  <div key={place.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[22px] top-3 w-4 h-4 rounded-full border-4 border-white shadow-md bg-[#0A1931]"></div>

                    {/* Timeline Card */}
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center mb-3">
                        <FaMapMarkerAlt className="text-lg sm:text-xl mr-2 text-[#0A1931]" />
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-government-blue">
                          {place.placeName}
                        </h3>
                      </div>
                      {place.placeInfo && (
                        <p className="text-gray-700 text-sm sm:text-sm md:text-base leading-relaxed">
                          {place.placeInfo}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Awards Section */}
          <section className="mb-10">
              <h3 className="text-h6 font-bold tracking-wide font-marathi">
              गावाचे पुरस्कार
            </h3>
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1931]"></div>
                <p className="mt-2 text-gray-600">पुरस्कार लोड होत आहेत...</p>
              </div>
            ) : historicalAwards.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-lg">
                <p className="text-gray-600">पुरस्कार उपलब्ध नाहीत.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-4xl mx-auto">
                {historicalAwards.map((award) => (
                  <div
                    key={award.id}
                    className="bg-white rounded-lg shadow p-4 border"
                  >
                    <div className="flex items-center mb-2">
                      {award.year && (
                        <span className="text-blue-600 font-bold mr-2">
                          {replaceWithMarathiDigits(award.year)}
                        </span>
                      )}
                      <span className="text-gray-800 font-semibold">
                        {award.awardName}
                      </span>
                    </div>
                    {award.awardDescription && (
                      <p className="text-gray-600 text-sm">
                        {award.awardDescription}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          </div>
        </div>
      </main>
    </>
  );
}
