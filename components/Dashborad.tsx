"use client";
import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import websiteAPI from "@/lib/api";
import { formatMarathiNumber, replaceWithMarathiDigits } from "@/lib/utils";

interface InfrastructureItem {
  id: string;
  subcategory: string;
  facility: string;
  count: string;
}

interface StatData {
  id: string;
  title: string;
  data: {
    value: string;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await websiteAPI.getInfrastructure();

        if (response.success && response.data) {
          // Filter only 'आकडेवारी'
          const statsData = response.data.filter(
            (item: InfrastructureItem) => item.subcategory === "आकडेवारी",
          );

          const transformedStats = statsData.map(
            (item: InfrastructureItem) => ({
              id: item.id,
              title: item.facility,
              data: {
                value: item.count,
              },
            }),
          );

          setStats(transformedStats);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="mb-8 md:mb-12 mt-4 w-full">
      <div>
        {/* Latest Stats Section - Full Width */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-4 sm:px-5 md:px-6 py-2.5 flex items-center space-x-2 sm:space-x-3">
            <TrendingUp className="text-lg sm:text-xl md:text-2xl flex-shrink-0" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide truncate">
              मुख्य आकडेवारी (माझे गाव, माझी प्रगती)
            </h2>
          </div>

          <div className="p-4 sm:p-5 md:p-6 lg:p-8">
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
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {stats.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 sm:p-4 md:p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center">
                      {item.data?.value
                        ? formatMarathiNumber(item.data.value)
                        : replaceWithMarathiDigits("०")}
                    </h4>
                    <p className="text-xs sm:text-sm md:text-base text-center text-gray-600 mt-1 sm:mt-2 font-medium">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 sm:mt-8 text-center">
              <Link
                href="/about/introduction"
                className="inline-block bg-[#0A1931] hover:bg-[#142b4a] text-white font-medium text-sm sm:text-base md:text-lg px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-colors duration-200"
              >
                अधिक माहिती
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
