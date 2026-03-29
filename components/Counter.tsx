"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Eye, Users } from "lucide-react"; // Added icons
import { replaceWithMarathiDigits } from "@/lib/utils";

export default function VisitorBadge() {
  const [totalVisits, setTotalVisits] = useState(0);
  const [activeVisitors, setActiveVisitors] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const storedCount = localStorage.getItem("pageVisits");
    const initialCount = storedCount ? Number(storedCount) : 0;
    const newCount = initialCount + 1;
    setTotalVisits(newCount);
    localStorage.setItem("pageVisits", newCount.toString());

    // Simulate active visitors
    setActiveVisitors(Math.max(1, Math.floor(Math.random() * newCount)));

    // Detect mobile screen
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = () => {
    if (isMobile) {
      setShowTooltip((prev) => !prev);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="relative w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-lg border border-gray-300 select-none"
        onHoverStart={() => !isMobile && setShowTooltip(true)}
        onHoverEnd={() => !isMobile && setShowTooltip(false)}
        onClick={handleClick}
        whileHover={{ scale: 1.15 }}
      >
        <User className="w-6 h-6 text-black" />

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute bottom-full right-0 mb-4 translate-x-4 bg-white text-indigo-700 px-4 py-2 rounded-xl shadow-lg font-semibold text-sm flex items-center space-x-4 whitespace-nowrap border border-gray-200"
              initial={{ opacity: 0, y: 10, x: 10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 10, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {isMobile ? (
                // 🔹 Compact mobile view — icons + numbers only
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    <span>{replaceWithMarathiDigits(totalVisits)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>{replaceWithMarathiDigits(activeVisitors)}</span>
                  </div>
                </div>
              ) : (
                // 💬 Desktop view — text labels
                <>
                  <span>एकूण: {replaceWithMarathiDigits(totalVisits)}</span>
                  <div className="w-px h-4 bg-indigo-300"></div>
                  <span>सक्रिय: {replaceWithMarathiDigits(activeVisitors)}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
