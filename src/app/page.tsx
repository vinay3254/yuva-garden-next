import Preloader from "@/components/Preloader";
import CursorBubble from "@/components/CursorBubble";
import BackgroundShader from "@/components/BackgroundShader";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import CinematicZoom from "@/components/CinematicZoom";
import NurserySection from "@/components/NurserySection";
import SeasonsSection from "@/components/SeasonsSection";
import SelectedWork from "@/components/SelectedWork";
import ContactSection from "@/components/ContactSection";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import Footer from "@/components/Footer";
import GardenMotion from "@/components/motion/GardenMotion";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#f4f1ea] text-[#1b2a1f]">
      <GardenMotion />
      {/* Luxury Opening Reveal Preloader */}
      <Preloader />

      {/* Interactive Cursor Follower Bubble */}
      <CursorBubble />

      {/* Interactive WebGL Organic Ambient Canvas */}
      <BackgroundShader />

      {/* Top Scroll Indicator */}
      <ScrollProgressBar />

      {/* Fixed Header */}
      <Header />

      {/* Main Content Stream */}
      <div className="relative z-10">
        <Hero />
        <div data-garden-showcase className="garden-showcase">
          <Intro />
          <SelectedWork />
        </div>
        <CinematicZoom />
        <NurserySection />
        <SeasonsSection />
        <ContactSection />
        <Footer />
      </div>

      {/* Floating Sticky Actions */}
      <WhatsAppFAB />
    </main>
  );
}
