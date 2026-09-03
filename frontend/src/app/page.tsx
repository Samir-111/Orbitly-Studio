import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../sections/HeroSection';
import { ServicesSection } from '../sections/ServicesSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { BlogSection } from '../sections/BlogSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { ContactSection } from '../sections/ContactSection';
import { Footer } from '../components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-slate-100 flex flex-col justify-between">
      <Navbar />
      <div className="flex-1">
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <BlogSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
      <Footer />
    </main>
  );
}
