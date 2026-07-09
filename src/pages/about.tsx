import AboutHero from "../components/AboutHero";
import AboutIntro from "../components/AboutIntro";
import FAQ from "../components/FAQ";
import MissionSection from "../components/MissionSection";
import TestimonialsSection from "../components/Testimonial";
import VolunteersSection from "../components/VolunteerSection";


export default function About() {
  return (
    <>
      <AboutHero />
      <AboutIntro />
      <MissionSection/>
      <TestimonialsSection/>
      <VolunteersSection/>
      <FAQ/>

    </>
  );
}