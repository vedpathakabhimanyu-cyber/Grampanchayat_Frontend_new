"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Hammer, Calendar, IndianRupee, ArrowRight } from "lucide-react";
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

  if (loading && projects.length === 0) return null;
  if (!loading && projects.length === 0) return null;

  return (
    <section className="my-12 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0A1931] rounded-t-lg shadow-md text-white px-5 py-2.5 flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3">
            <Hammer className="text-lg sm:text-xl md:text-2xl" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">प्रकल्प आणि कामे</h2>
          </div>
          <Link href="/projects" className="text-base hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
            सर्व पहा <ArrowRight size={14} />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow bg-gray-50 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-base font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    project.status === 'पूर्ण' ? 'bg-green-100 text-green-700' : 
                    project.status === 'प्रगतीत' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-sm font-medium text-gray-500">{project.type}</span>
                </div>
                
                <h3 className="text-lg font-bold text-[#0A1931] mb-2 line-clamp-1">{project.name}</h3>
                <p className="text-gray-600 text-base mb-4 flex-1 line-clamp-2 italic">{project.description}</p>
                
                <div className="pt-4 border-t border-gray-200 mt-auto space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-500"><Calendar size={14}/> {formatMarathiDate(project.start_date)}</span>
                    <span className="flex items-center gap-1 font-bold text-green-700">
                      <IndianRupee size={14}/> {project.cost ? formatMarathiNumber(project.cost) : formatMarathiNumber(0)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
