import React from 'react';
import HeroSection from '../components/herosection';
import ServicesSection from '../components/service';
import ServiceSection from '../components/ServiceSection';
import VideoSection from '../components/VideoSection';
import TestimonialsSection from '../components/Testimonial';
import HomeIntro from '../components/HomeIntro';
import UpcomingEvents from '../components/UpComingEvent';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
     <HeroSection />
     <UpcomingEvents />
     <ServicesSection/>
     <HomeIntro/>
     <ServiceSection/>
     <VideoSection/>
     <TestimonialsSection/>
    </div>
  );
};
export default Home;