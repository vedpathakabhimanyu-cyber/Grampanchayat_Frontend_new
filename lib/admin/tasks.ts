export interface AdminTask {
  id: string;
  name: string;
  description: string;
  route: string;
}

export const ADMIN_TASKS: AdminTask[] = [
  {
    id: "task1",
    name: "मूलभूत माहिती",
    description: "प्रतिनिधींचे नाव, मोबाईल आणि पद यासारखी मूलभूत माहिती भरा.",
    route: "/admin/tasks/task1-basic-info",
  },
  {
    id: "task2",
    name: "मुख्य आकडेवारी",
    description: "लोकसंख्या, साक्षरता आणि इतर महत्त्वाची आकडेवारी भरा.",
    route: "/admin/tasks/task2-documents",
  },
  {
    id: "task3",
    name: "प्रमाणपत्र तपशील",
    description: "प्रमाणपत्रे व आवश्यक कागदपत्रे जोडा.",
    route: "/admin/tasks/task3-certificates",
  },
  {
    id: "task4",
    name: "फोटो गॅलरी",
    description: "गावातील विकासकामे आणि विशेष स्थळांच्या प्रतिमा अपलोड करा.",
    route: "/admin/tasks/task4-email-verification",
  },
  {
    id: "task5",
    name: "पायाभूत सुविधा",
    description: "पायाभूत सुविधांची माहिती भरा.",
    route: "/admin/tasks/task5-infrastructure",
  },
  {
    id: "task6",
    name: "ऐतिहासिक माहिती",
    description: "ऐतिहासिक घटना आणि स्थळे जोडा.",
    route: "/admin/tasks/task6-historical",
  },
  {
    id: "task7",
    name: "ग्रामपंचायत तपशील",
    description: "ग्रामपंचायतीचे संपर्क आणि स्थानाची माहिती जोडा.",
    route: "/admin/tasks/task7-grampanchayat",
  },
  {
    id: "task8",
    name: "परिपत्रक / घोषणा व्यवस्थापन",
    description: "जाहिराती व परिपत्रके अपलोड करा.",
    route: "/admin/tasks/task8-announcements",
  },
  {
    id: "task9",
    name: "मुख्य प्रतिमा",
    description: "मुख्यपृष्ठासाठी हिरो स्लायडर प्रतिमा अपलोड करा.",
    route: "/admin/tasks/task9-hero-images",
  },
  {
    id: "task10",
    name: "कर भरणी",
    description: "QR कोड आणि बँक तपशील व्यवस्थापित करा.",
    route: "/admin/tasks/task10-tax-payment",
  },
  {
    id: "task11",
    name: "प्रकल्प / काम",
    description: "ग्रामपंचायतीचे प्रकल्प आणि कामांची माहिती व्यवस्थापित करा.",
    route: "/admin/tasks/task11-projects",
  },
];
