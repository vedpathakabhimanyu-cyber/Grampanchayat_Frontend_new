"use client";
// Deployment Trigger: Build v1.0.1 - Syncing local refinements to production.

import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/contexts/admin/PermissionContext";

type TaskCompletion = { [key: string]: number };
type TaskInfo = { name: string; description: string };

// Add Task3 info
const TASK_INFO: { [key: string]: TaskInfo } = {
  task1: {
    name: "मूलभूत माहिती",
    description: "मूलभूत माहिती भरा.",
  },
  task2: {
    name: "मुख्य आकडेवारी",
    description: "लोकसंख्या, साक्षरता आणि इतर महत्त्वाची आकडेवारी भरा.",
  },
  task3: {
    name: "प्रमाणपत्र तपशील",
    description: "प्रमाणपत्रे व आवश्यक कागदपत्रे जोडा.",
  },
  task4: {
    name: "फोटो गॅलरी",
    description: "गावातील विकासकामे आणि विशेष स्थळांच्या प्रतिमा अपलोड करा.",
  },
  task5: {
    name: "पायाभूत सुविधा",
    description: "पायाभूत सुविधांची माहिती भरा.",
  },
  task6: {
    name: "ऐतिहासिक माहिती",
    description: "ऐतिहासिक घटना आणि स्थळे जोडा.",
  },
  task7: {
    name: "ग्रामपंचायत तपशील",
    description: "ग्रामपंचायतीचे संपर्क आणि स्थानाची माहिती जोडा.",
  },
  task8: {
    name: "परिपत्रक / घोषणा व्यवस्थापन",
    description: "जाहिराती व परिपत्रके अपलोड करा.",
  },
  task9: {
    name: "मुख्य प्रतिमा",
    description: "मुख्यपृष्ठासाठी हिरो स्लायडर प्रतिमा अपलोड करा.",
  },
  task10: {
    name: "कर भरणी",
    description: "QR कोड आणि बँक तपशील व्यवस्थापित करा.",
  },
  task11: {
    name: "प्रकल्प / काम",
    description: "ग्रामपंचायतीचे प्रकल्प आणि कामांची माहिती व्यवस्थापित करा.",
  },
};

function DashboardContent() {
  const router = useRouter();
  const { hasPermission, loading: permissionsLoading, user } = usePermissions();
  const [taskCompletion, setTaskCompletion] = useState<TaskCompletion>({
    task1: 0,
    task2: 0,
    task3: 0,
    task4: 0,
    task5: 0,
    task6: 0,
    task7: 0,
    task8: 0,
    task9: 0,
    task10: 0,
    task11: 0,
  });

  const computeProgress = useCallback(() => {
    const newTaskCompletion: TaskCompletion = {
      task1: 0,
      task2: 0,
      task3: 0,
      task4: 0,
      task5: 0,
      task6: 0,
      task7: 0,
      task8: 0,
      task9: 0,
      task10: 0,
      task11: 0,
    };

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

      // Task9 - Hero Images
      const task9Data = JSON.parse(localStorage.getItem("task9") || "[]");
      if (Array.isArray(task9Data) && task9Data.length > 0) {
        // Progress based on number of images (max 3)
        newTaskCompletion.task9 = (task9Data.length / 3) * 100;
      } else {
        newTaskCompletion.task9 = 0;
      }

      // Task10 - Tax Payment
      const task10Data = JSON.parse(localStorage.getItem("task10") || "{}");
      if (Object.keys(task10Data).length > 0) {
        newTaskCompletion.task10 = 100;
      } else {
        newTaskCompletion.task10 = 0;
      }

      // Task11 - Projects
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

  const goToTask = (taskNumber: number) => {
    const routes: Record<number, string> = {
      1: "/admin/tasks/task1-basic-info",
      2: "/admin/tasks/task2-documents",
      3: "/admin/tasks/task3-certificates",
      4: "/admin/tasks/task4-email-verification",
      5: "/admin/tasks/task5-infrastructure",
      6: "/admin/tasks/task6-historical",
      7: "/admin/tasks/task7-grampanchayat",
      8: "/admin/tasks/task8-announcements",
      9: "/admin/tasks/task9-hero-images",
      10: "/admin/tasks/task10-tax-payment",
      11: "/admin/tasks/task11-projects",
    };

    if (routes[taskNumber]) {
      router.push(routes[taskNumber]);
    } else {
      console.error(`Invalid task number: ${taskNumber}`);
    }
  };

  // Filter tasks based on user permissions
  const allowedTasks = Object.entries(taskCompletion).filter(([task]) =>
    hasPermission(task)
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
          {allowedTasks.map(([task, progress], index) => {
            // Get the actual task number from the task key
            const taskNumber = parseInt(task.replace("task", ""));

            return (
              <Card
                key={task}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span className="line-clamp-1">
                      {TASK_INFO[task]?.name || task}
                    </span>

                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {TASK_INFO[task]?.description}
                  </p>
                  <Button
                    variant={progress === 100 ? "default" : "outline"}
                    onClick={() => goToTask(taskNumber)}
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
