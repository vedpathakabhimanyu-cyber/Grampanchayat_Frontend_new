import Hero from "@/components/Hero";
import Officials from "@/components/Officials";
import Schemes from "@/components/Schemes";
import Gallery from "@/components/Gallery";
import Helpline from "@/components/Helpline";
import ImportantLinks from "@/components/ImportantLinks";
import Dashboard from "@/components/Dashborad";
import ProjectsSection from "@/components/ProjectsSection";
import VisitorBadge from "@/components/Counter";

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Hero />
      <div className="w-screen px-4 py-8 space-y-12">
        {/* Full-width Officials + Departments */}
        <div className="my-8 md:my-12 px-4 sm:px-8 md:px-20">
          <Officials />
          <Dashboard />
          <ProjectsSection />
        </div>

        {/* Gallery */}
        <Gallery />
      </div>

      {/* 🧮 Fixed Visitor Counter at bottom-right corner */}
      <div className="fixed bottom-4 right-4 z-50">
        <VisitorBadge />
      </div>
    </main>
  );
}
