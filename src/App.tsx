import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import HeroSection from "./components/herosection";
import ServicesSection from "./components/service";
import Footer from "./components/footer";
import About from "./pages/about";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import HomeIntro from "./components/HomeIntro";
import TestimonialsSection from "./components/Testimonial";
import ServiceSection from "./components/ServiceSection";
import VideoSection from "./components/VideoSection";
import UpcomingEvents from "./components/UpComingEvent";
import DonateSection from "./pages/Donation";
import VolunteersPage from "./pages/VolunteerPage";
import ScrollToTop from "./ScrollToTop";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
function Home() {
  return (
    <>
      <HeroSection />
      <UpcomingEvents />
      <ServicesSection />
      <HomeIntro />
      <ServiceSection />
      <VideoSection />
      <TestimonialsSection />
    </>
  );
}
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Donation" element={<DonateSection />} />
        <Route path="/VolunteerPage" element={<VolunteersPage />} />
        <Route path="/Volunteers" element={<VolunteersPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
      <Footer />
      <FloatingWhatsApp />
    </BrowserRouter>
  );
}
export default App;