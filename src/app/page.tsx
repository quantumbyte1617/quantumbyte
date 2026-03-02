import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AppsSection from "@/components/sections/AppsSection";
import NotifySection from "@/components/sections/NotifySection";
import PlaygroundSection from "@/components/sections/PlaygroundSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <div className="section-glow-divider" />
        <AppsSection />
        <NotifySection />
        <PlaygroundSection />
        <div className="section-glow-divider" />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
