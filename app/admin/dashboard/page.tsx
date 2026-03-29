"use client";
// Deployment Trigger: Build v1.0.1 - Syncing local refinements to production.

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/contexts/admin/PermissionContext";
import { ADMIN_TASKS } from "@/lib/admin/tasks";

type TaskCompletion = { [key: string]: number };

function DashboardContent() {
  const router = useRouter();
  const { hasPermission, loading: permissionsLoading, user } = usePermissions();
  
  // Initialize from centralized tasks
  const [taskCompletion, setTaskCompletion] = useState<TaskCompletion>(
    ADMIN_TASKS.reduce((acc, task) => ({ ...acc, [task.id]: 0 }), {})
  );

  const computeProgress = useCallback(() => {
    const newTaskCompletion: TaskCompletion = ADMIN_TASKS.reduce(
      (acc, task) => ({ ...acc, [task.id]: 0 }), 
      {}
    );

    try {
      // Task1
      const task1Raw = localStorage.getItem("task1");
      if (task1Raw) {
        const task1Data = JSON.parse(task1Raw);
        if (Array.isArray(task1Data) && task1Data.length > 0) {
          const total = task1Data.length;
          const filled = task1Data.filter(
            (rep: any) => rep.name && rep.mobile && rep.position
          ).length;
          newTaskCompletion.task1 = (filled / total) * 100;
        }
      }

      // Task2
      const task2Data = JSON.parse(localStorage.getItem("task2") || "[]");
      if (Array.isArray(task2Data) && task2Data.length > 0) {
        const total = task2Data.length;
        const filled = task2Data.filter((row: any) =>
          Object.values(row).every(Boolean)
        ).length;
        newTaskCompletion.task2 = (filled / total) * 100;
      }

      // Task3
      const task3Data = JSON.parse(localStorage.getItem("task3") || "[]");
      if (Array.isArray(task3Data) && task3Data.length > 0) {
        const total = task3Data.length;
        const filled = task3Data.filter((d: any) => {
          const namesFilled = d.certificateName?.trim() !== "";
          const descriptionFilled = d.certificateDescription?.trim() !== "";
          const documentsFilled =
            Array.isArray(d.requiredDocuments) &&
            d.requiredDocuments.length > 0 &&
            d.requiredDocuments.every((doc: string) => doc?.trim() !== "");
          return namesFilled && descriptionFilled && documentsFilled;
        }).length;

        newTaskCompletion.task3 = (filled / total) * 100;
      }

      // Task4
      const task4Data = JSON.parse(localStorage.getItem("task4") || "[]");
      if (Array.isArray(task4Data) && task4Data.length > 0) {
        const total = task4Data.length;
        const filled = task4Data.filter(
          (d: any) => d.title && d.description && d.croppedFile
        ).length;
        newTaskCompletion.task4 = (filled / total) * 100;
      }

      // Task5
      const task5Data = JSON.parse(localStorage.getItem("task5") || "[]");
      if (Array.isArray(task5Data) && task5Data.length > 0) {
        const total = task5Data.length;
        const filled = task5Data.filter(
          (d: any) => d.count.trim() !== ""
        ).length;
        newTaskCompletion.task5 = (filled / total) * 100;
      }

      // Task6
      const task6Data = JSON.parse(localStorage.getItem("task6") || "{}");
      if (task6Data.events?.length > 0 || task6Data.places?.length > 0) {
        const eventsTotal = task6Data.events?.length || 0;
        const placesTotal = task6Data.places?.length || 0;
        const eventsFilled =
          task6Data.events?.filter((e: any) => e.year && e.eventName).length ||
          0;
        const placesFilled =
          task6Data.places?.filter((p: any) => p.placeName).length || 0;

        const total = eventsTotal + placesTotal;
        const filled = eventsFilled + placesFilled;
        newTaskCompletion.task6 = total > 0 ? (filled / total) * 100 : 0;
      }

      // Task7
      const task7Data = JSON.parse(localStorage.getItem("task7") || "{}");
      const requiredFields = [
        "grampanchayatName",
        "talukaName",
        "districtName",
        "phone",
      ];

      if (Object.keys(task7Data).length > 0) {
        const filledFields = requiredFields.filter(
          (field) => task7Data[field] && task7Data[field].trim() !== ""
        );
        newTaskCompletion.task7 =
          (filledFields.length / requiredFields.length) * 100;
      } else {
        newTaskCompletion.task7 = 0;
      }

      // Task8
      const task8Data = JSON.parse(localStorage.getItem("task8") || "[]");
      if (Array.isArray(task8Data) && task8Data.length > 0) {
        newTaskCompletion.task8 = 100;
      } else {
        newTaskCompletion.task8 = 0;
      }

      // Task9
      const task9Data = JSON.parse(localStorage.getItem("task9") || "[]");
      if (Array.isArray(task9Data) && task9Data.length > 0) {
        newTaskCompletion.task9 = (task9Data.length / 3) * 100;
      } else {
        newTaskCompletion.task9 = 0;
      }

      // Task10
      const task10Data = JSON.parse(localStorage.getItem("task10") || "{}");
      if (Object.keys(task10Data).length > 0) {
        newTaskCompletion.task10 = 100;
      } else {
        newTaskCompletion.task10 = 0;
      }

      // Task11
      const task11Data = JSON.parse(localStorage.getItem("task11") || "[]");
      if (Array.isArray(task11Data) && task11Data.length > 0) {
        newTaskCompletion.task11 = 100;
      } else {
        newTaskCompletion.task11 = 0;
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
    }

    setTaskCompletion(newTaskCompletion);
  }, []);

  useEffect(() => computeProgress(), [computeProgress]);

  useEffect(() => {
    const handleTaskUpdate = () => computeProgress();
    window.addEventListener("taskUpdate", handleTaskUpdate);
    return () => window.removeEventListener("taskUpdate", handleTaskUpdate);
  }, [computeProgress]);

  const goToTask = (taskId: string) => {
    const task = ADMIN_TASKS.find(t => t.id === taskId);
    if (task) {
      router.push(task.route);
    } else {
      console.error(`Invalid task ID: ${taskId}`);
    }
  };

  // Filter tasks based on user permissions
  const allowedTasks = ADMIN_TASKS.filter((task) =>
    hasPermission(task.id)
  );

  if (permissionsLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600">लोड करत आहे...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          डॅशबोर्ड
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {user?.role === "admin"
            ? "सर्व कार्ये पहा"
            : `तुमच्या ${allowedTasks.length} कार्ये`}
        </p>
      </div>

      {allowedTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">
              तुम्हाला कोणत्याही कार्यासाठी परवानगी नाही
            </p>
            <p className="text-sm text-gray-500 mt-2">
              कृपया प्रशासकाशी संपर्क साधा
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {allowedTasks.map((task) => {
            const progress = taskCompletion[task.id] || 0;

            return (
              <Card
                key={task.id}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span className="line-clamp-1">
                      {task.name}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                  <Button
                    variant={progress === 100 ? "default" : "outline"}
                    onClick={() => goToTask(task.id)}
                    className={`mt-2 w-full ${
                      progress === 100 ? "bg-green-600 hover:bg-green-700" : ""
                    }`}
                  >
                    {"माहिती भरा"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
