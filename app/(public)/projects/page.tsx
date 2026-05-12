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
  Hammer,
} from "lucide-react";
import Image from "next/image";
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
  image?: string;
  image_url?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const getProjectImage = (project: Project) => project.image || project.image_url || "";

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
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 size={14} /> पूर्ण
          </span>
        );
      case "प्रगतीत":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
            <Clock size={14} /> प्रगतीत
          </span>
        );
      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
            <AlertCircle size={14} /> प्रस्तावित
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("mr-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(d);
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
              <h2 className="text-2xl font-bold text-gray-400">
                सध्या कोणतीही माहिती उपलब्ध नाही.
              </h2>
              <p className="text-gray-400 mt-2">कृपया लवकरच पुन्हा भेट द्या.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group overflow-hidden rounded-[2rem] bg-white flex flex-col h-full border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.08)] hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)] transition-all duration-300"
                >
                  <div className="relative h-64 md:h-72 w-full overflow-hidden bg-slate-100">
                    {getProjectImage(project) ? (
                      <Image
                        src={getProjectImage(project)}
                        alt={project.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_36%),linear-gradient(135deg,#eff6ff,#f8fafc_55%,#e2e8f0)] flex flex-col items-center justify-center text-slate-400">
                        <Building2 className="h-16 w-16 mb-4 opacity-60" />
                        <p className="text-sm font-semibold">छायाचित्र उपलब्ध नाही</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/15 to-transparent"></div>
                    <div className="absolute left-5 top-5">
                      <div className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                        {project.type || "प्रकल्प"}
                      </div>
                    </div>
                    <div className="absolute right-5 top-5">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>

                  <div className="p-8 pb-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded-2xl text-[#0A1931] group-hover:bg-[#0A1931] group-hover:text-white transition-colors duration-300 shrink-0">
                        <Building2 size={24} />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900 line-clamp-2 leading-tight">
                          {replaceWithMarathiDigits(project.name)}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {project.start_date
                            ? formatDate(project.start_date)
                            : "कालावधी नमूद नाही"}
                          {project.end_date
                            ? ` - ${formatDate(project.end_date)}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-0 flex-1 flex flex-col">
                    <div className="rounded-3xl bg-slate-50/90 border border-slate-100 px-5 py-4 mb-6">
                      <p className="text-slate-600 text-sm leading-7 italic line-clamp-4 min-h-[7rem]">
                        {project.description || "या प्रकल्पाचे वर्णन अद्याप उपलब्ध नाही."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-3 rounded-2xl bg-green-50/70 px-4 py-3">
                        <div className="bg-white p-2 rounded-xl text-green-600 shadow-sm">
                          <IndianRupee size={18} />
                        </div>
                        <div>
                          <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">
                            अंदाजपत्रकीय खर्च
                          </p>
                          <p className="font-extrabold text-slate-800 text-base">
                            {project.cost
                              ? `₹${formatMarathiNumber(project.cost)}`
                              : "नमुद नाही"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-2xl bg-orange-50/70 px-4 py-3">
                        <div className="bg-white p-2 rounded-xl text-orange-600 shadow-sm">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-xs uppercase font-bold text-slate-400 tracking-widest">
                            कालावधी
                          </p>
                          <p className="font-bold text-slate-700 text-xs leading-5">
                            {formatDate(project.start_date)} -{" "}
                            {project.end_date
                              ? formatDate(project.end_date)
                              : "चालू"}
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
