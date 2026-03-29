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
            (item: InfrastructureItem) => item.subcategory === "आकडेवारी"
          );

          const transformedStats = statsData.map(
            (item: InfrastructureItem) => ({
              id: item.id,
              title: item.facility,
              data: {
                value: item.count,
              },
            })
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
    <section className="mb-10 mt-4">
      <div>
        {/* Latest Stats Section - Full Width */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-5 py-2.5 flex items-center space-x-3">
          <TrendingUp className="text-lg sm:text-xl md:text-2xl" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
            मुख्य आकडेवारी (माझे गाव, माझी प्रगती)
          </h2>
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
                    className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
                      {item.data?.value ? formatMarathiNumber(item.data.value) : replaceWithMarathiDigits("०")}
                    </h4>
                    <p className="text-base sm:text-lg text-center text-gray-600 mt-1">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 text-center">
              <Link
                href="/about/introduction"
                className="inline-block bg-[#0A1931] hover:bg-[#142b4a] text-white font-medium text-base md:text-lg px-5 py-2 rounded-lg transition-colors duration-200"
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
