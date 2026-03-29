import Header from "@/components/Header";
import TopBar from "@/components/TopBar";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <TopBar />
      <Header />
      <Navigation />
      {children}
      <Footer />
    </LanguageProvider>
  );
}
