"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/admin/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Input } from "@/components/admin/ui/input";
import { Button } from "@/components/admin/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);

      if (response.success && response.data.token) {
        // Token is already saved in authAPI.login
        toast.success("लॉगिन यशस्वी!");
        router.push("/admin/dashboard");
      } else {
        const msg = "लॉगिन अयशस्वी. कृपया पुन्हा प्रयत्न करा.";
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const msg = err.message || "लॉगिन करताना त्रुटी आली";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-xl border-0">
          <CardHeader className="space-y-3 px-4 sm:px-6 pt-6 pb-4">
            <div className="flex justify-center mb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-linear-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl text-center font-bold text-gray-800 leading-tight">
              ग्रामपंचायत प्रशासन प्रणाली
            </CardTitle>
            <p className="text-center text-xs sm:text-sm md:text-base text-gray-600">
              कृपया लॉगिन करा
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  ईमेल
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@grampanchayat.gov.in"
                  required
                  disabled={loading}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  पासवर्ड
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm sm:text-base shadow-md hover:shadow-lg transition-all"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    लॉगिन करत आहे...
                  </span>
                ) : (
                  "लॉगिन करा"
                )}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
