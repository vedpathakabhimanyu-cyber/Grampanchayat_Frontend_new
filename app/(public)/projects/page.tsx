"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Hammer
} from "lucide-react";
import websiteAPI from "@/lib/api";
import { formatMarathiNumber, replaceWithMarathiDigits } from "@/lib/utils";

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await websiteAPI.getProjects();
        if (response.success) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "पूर्ण":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm"><CheckCircle2 size={14}/> पूर्ण</span>;
      case "प्रगतीत":
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm"><Clock size={14}/> प्रगतीत</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm"><AlertCircle size={14}/> प्रस्तावित</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat('mr-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A1931]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
        
         <div className="bg-[#0A1931] rounded-lg shadow-md text-white px-5 py-2.5 flex items-center justify-start space-x-3 mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-wide">
प्रकल्प / काम
          </h2>
        </div>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border-2 border-dashed border-gray-200 p-20 text-center">
            <FileText className="h-20 w-20 text-gray-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-400">सध्या कोणतीही माहिती उपलब्ध नाही.</h2>
            <p className="text-gray-400 mt-2">कृपया लवकरच पुन्हा भेट द्या.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group overflow-hidden border-none shadow-md hover:shadow-2xl transition-all duration-300 rounded-3xl bg-white flex flex-col h-full border border-gray-100">
                <div className="h-2 bg-[#0A1931] w-full transform origin-left group-hover:scale-x-105 transition-transform duration-500"></div>
                
                <div className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-[#0A1931] group-hover:bg-[#0A1931] group-hover:text-white transition-colors duration-300">
                      <Building2 size={24} />
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 leading-tight min-h-[4rem]">
                    {replaceWithMarathiDigits(project.name)}
                  </h3>
                </div>

                <div className="p-8 pt-4 flex-1 space-y-6">
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed italic line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg uppercase tracking-wider">
                      {project.type}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-50 p-2 rounded-xl text-green-600">
                        <IndianRupee size={18} />
                      </div>
                      <div>
                        <p className="text-sm uppercase font-bold text-gray-400 tracking-widest">अंदाजपत्रकीय खर्च</p>
                        <p className="font-extrabold text-gray-800 text-lg">
                          {project.cost ? `₹${formatMarathiNumber(project.cost)}` : 'नमुद नाही'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-orange-50 p-2 rounded-xl text-orange-600">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm uppercase font-bold text-gray-400 tracking-widest">कालावधी</p>
                        <p className="font-bold text-gray-700 text-sm">
                          {formatDate(project.start_date)} - {project.end_date ? formatDate(project.end_date) : 'चालू'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
    </main>
  );
}
