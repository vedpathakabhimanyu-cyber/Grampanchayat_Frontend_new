"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Hammer, Calendar, IndianRupee, Building2 } from "lucide-react";
import websiteAPI from "@/lib/api";
import { formatMarathiNumber, formatMarathiDate } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  type: string;
  description: string;
  cost: number | string;
  start_date: string;
  end_date: string;
  status: string;
  image?: string;
  image_url?: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await websiteAPI.getProjects();
        if (response.success && response.data) {
          // Show only top 3 projects on home page
          setProjects(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getProjectImage = (project: Project) => project.image || project.image_url || "";

  if (loading && projects.length === 0) return null;
  if (!loading && projects.length === 0) return null;

  return (
    <section className="my-8 md:my-12 w-full">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-4 sm:px-5 md:px-6 py-2.5 flex items-center justify-start space-x-2 sm:space-x-3">
          <Hammer className="text-lg sm:text-xl md:text-2xl flex-shrink-0" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">
            प्रकल्प आणि कामे
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all bg-white flex flex-col h-full hover:-translate-y-0.5"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  {getProjectImage(project) ? (
                    <Image
                      src={getProjectImage(project)}
                      alt={project.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#eff6ff,#f8fafc_55%,#e2e8f0)] flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 backdrop-blur">
                      {project.type || "प्रकल्प"}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
                    <span
                      className={`text-xs sm:text-sm font-bold px-2 py-0.5 rounded-md uppercase tracking-wider whitespace-nowrap ${
                        project.status === "पूर्ण"
                          ? "bg-green-100 text-green-700"
                          : project.status === "प्रगतीत"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0A1931] mb-1 sm:mb-2 line-clamp-2 min-h-[3.5rem]">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 flex-1 line-clamp-2 italic">
                    {project.description || "या प्रकल्पाची माहिती पाहण्यासाठी सर्व प्रकल्प पृष्ठ उघडा."}
                  </p>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200 mt-auto space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1 text-xs sm:text-sm">
                      <span className="flex items-center gap-0.5 sm:gap-1 text-gray-500">
                        <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />{" "}
                        {formatMarathiDate(project.start_date)}
                      </span>
                      <span className="flex items-center gap-0.5 sm:gap-1 font-bold text-green-700">
                        <IndianRupee size={12} className="sm:w-3.5 sm:h-3.5" />{" "}
                        {project.cost
                          ? formatMarathiNumber(project.cost)
                          : formatMarathiNumber(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Enhanced "See All" Card */}
            <div className="group bg-gray-50 rounded-lg sm:rounded-xl border-2 border-dashed border-gray-200 p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center text-center h-full hover:border-[#0A1931] hover:bg-white transition-all duration-300">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-lg sm:rounded-xl bg-white shadow-sm flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 group-hover:text-[#0A1931] transition-all">
                <Hammer className="text-2xl sm:text-3xl text-gray-300 group-hover:text-[#0A1931]" />
              </div>
              <p className="text-[#0A1931] font-bold text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-snug">
                ग्रामपंचायतीचे सर्व प्रकल्प आणि कामे पहा
              </p>
              <Link
                href="/projects"
                className="w-full bg-[#0A1931] text-white font-bold py-2 sm:py-2.5 rounded-lg sm:rounded-lg hover:bg-[#142b4a] shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
              >
                सर्व प्रकल्प पहा
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
