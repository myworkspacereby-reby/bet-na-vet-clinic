import React, { useState, useEffect } from "react";
import { 
  Heart, Sparkles, MapPin, Phone, Clock, ShieldAlert, Award, Star, 
  ChevronRight, CalendarDays, ClipboardCheck, BriefcaseMedical, Check,
  Bot, LayoutDashboard, Database, HelpCircle, FileCheck, ArrowRight,
  ShieldCheck, ArrowUpRight, Wrench, Cpu
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import Navbar from "./components/Navbar";
import AiAssistant from "./components/AiAssistant";
import AiConsultationDesk from "./components/AiConsultationDesk";
import BookingForm from "./components/BookingForm";
import Faqs from "./components/Faqs";
import BulletinBoard from "./components/BulletinBoard";
import { Appointment } from "./types";
import smilingPetsAi from "./assets/images/smiling_pets_ai_1779355333824.png";

export default function App() {
  const [selectedService, setSelectedService] = useState("");
  const [recentApt, setRecentApt] = useState<Appointment | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpandCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Auto scroll utility
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleServiceSelect = (serviceName: string) => {
    setSelectedService(serviceName);
    scrollToSection("booking");
  };

  const handleBookingSuccess = (newApt: Appointment) => {
    setRecentApt(newApt);
    setRefreshTrigger(prev => prev + 1);
    
    // Write client phone details to localStorage
    if (newApt.ownerPhone) {
      localStorage.setItem("betnavet_recent_phone", newApt.ownerPhone);
    }
    
    scrollToSection("faqs");
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen flex flex-col antialiased selection:bg-indigo-900 selection:text-white custom-scrollbar">
      
      {/* Dynamic Header & Navigation */}
      <Navbar 
        isAdmin={false} 
        setIsAdmin={() => {}} 
        onNavigate={scrollToSection} 
      />

      <main className="flex-grow">
        
        {/* Standard Client Hub */}
        <>
            
            {/* HERO LANDING SECTION */}
            <section id="hero" className="relative bg-indigo-950 text-white overflow-hidden py-20 sm:py-28 lg:py-32">
              
              {/* Blurred Organic Ambient Backdrops */}
              <div className="absolute inset-0 opacity-25">
                <div className="absolute -top-16 -left-16 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-3xl"></div>
                <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl"></div>
              </div>

              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
                  
                  {/* Left Side: Medical Copywriting */}
                  <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-8">
                    
                    {/* Badge */}
                    <div className="inline-flex self-start items-center bg-teal-400 text-indigo-950 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md">
                      ⭐⭐⭐⭐⭐  5.0 Google Rating
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tighter text-white uppercase font-display">
                      Loved Pets. <br />
                      <span className="text-teal-400">Main Mission.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-200 max-w-2xl font-light leading-relaxed">
                      Welcome to <strong className="text-white font-bold">Bet na Vet Veterinary Clinic Maasin</strong>. Led by <strong className="text-white font-semibold">Dr. Jasmin Marie Cillo Gerona, DVM</strong>, we provide sterile surgeries, ISO microchipping, and compassionate clinical tracking for Southern Leyte.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                      <button 
                        onClick={() => scrollToSection("booking")}
                        className="w-full sm:w-auto px-8 py-4 bg-teal-400 text-indigo-950 text-xs font-black uppercase tracking-widest rounded-full hover:bg-teal-300 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer shadow-md"
                      >
                        Book Appointment
                      </button>
                      <button 
                        onClick={() => scrollToSection("bulletin")}
                        className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-slate-400 hover:border-white text-xs font-black uppercase tracking-widest rounded-full transition-all duration-300 text-center cursor-pointer"
                      >
                        View Public Bulletins
                      </button>
                    </div>

                    {/* Status marker */}
                    <div className="pt-2 flex items-center space-x-3 text-xs">
                      <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse inline-block" />
                      <span className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Led by Dr. Jasmin Marie Cillo Gerona, DVM</span>
                    </div>

                  </div>

                  {/* Right Side: Visual Credentials Board with Happy smiling dogs, cats & AI illustration */}
                  <div className="lg:col-span-5 flex flex-col space-y-6 relative py-4">
                    
                    {/* Brand Illustration Frame containing custom generated smiling pets & AI */}
                    <div className="bg-white/10 p-3 rounded-[32px] border border-white/20 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md shadow-md animate-pulse">
                        Active Assistant
                      </div>
                      <img 
                        src={smilingPetsAi}
                        alt="Smiling Dog, Cat and Friendly AI Helper at Bet na Vet" 
                        className="w-full h-auto rounded-[24px] object-cover hover:scale-[1.02] transition-transform duration-500 shadow-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Quick Microchip Outreach Voucher (compact info widget) */}
                    <div className="bg-white text-slate-800 rounded-3xl p-6 shadow-xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-0.5 bg-amber-50 text-amber-500 text-[9px] font-black uppercase tracking-widest rounded-md border border-amber-200">
                          Outreach Promo
                        </span>
                        <h4 className="text-sm font-black text-indigo-950 font-display uppercase tracking-tight">ISO Standard Microchips</h4>
                        <p className="text-[11px] text-slate-500">Legal sea/air travel tracking & registration.</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] block text-slate-400 font-mono">Special Fee</span>
                        <span className="text-xl font-black text-teal-500 font-display">₱480</span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

            </section>

            {/* QUICK CONTACT INFORMATION BAR */}
            <section className="bg-white border-b border-indigo-100 py-6 scroll-mt-20">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-600 text-xs">
                  
                  <a 
                    href="https://maps.app.goo.gl/H1RCsqMTgn1eWeCw6"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Bet na Vet on Google Maps"
                    className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-indigo-50/70 transition-all duration-300 group border border-transparent hover:border-indigo-100/50"
                  >
                    <div className="h-10 w-10 bg-indigo-950 group-hover:bg-teal-500 group-hover:text-indigo-950 text-indigo-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-indigo-950 text-[10px] uppercase tracking-widest font-sans group-hover:text-teal-600 transition-colors">Clinic location</p>
                      <p className="text-slate-700 mt-0.5 font-semibold group-hover:underline decoration-teal-400 decoration-2">T. Oppus Street, Maasin, Southern Leyte ↗</p>
                    </div>
                  </a>

                  <a 
                    href="https://maps.app.goo.gl/H1RCsqMTgn1eWeCw6"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Bet na Vet Open Hours"
                    className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-indigo-50/70 transition-all duration-300 group border border-transparent hover:border-indigo-100/50"
                  >
                    <div className="h-10 w-10 bg-indigo-950 group-hover:bg-teal-500 group-hover:text-indigo-950 text-indigo-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-indigo-950 text-[10px] uppercase tracking-widest font-sans group-hover:text-teal-600 transition-colors">Working schedules</p>
                      <p className="text-slate-700 mt-0.5 font-semibold group-hover:underline decoration-teal-400 decoration-2">Monday - Saturday (9:00 AM - 5:00 PM) ↗</p>
                    </div>
                  </a>

                  <div className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-indigo-50/50 transition-colors">
                    <div className="h-10 w-10 bg-indigo-950 text-indigo-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black text-indigo-950 text-[10px] uppercase tracking-widest font-sans">Direct desk hotline</p>
                      <a 
                        href="tel:+639171454922" 
                        title="Click to call direct desk hotline" 
                        className="text-indigo-600 mt-0.5 font-extrabold font-mono text-sm block hover:underline"
                      >
                        +63 917 145 4922
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* SERVICES COMPLEMENTS GRID */}
            <section id="services" className="py-20 sm:py-24 bg-white scroll-mt-20">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                
                {/* Header text */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-900 text-[10px] font-black uppercase tracking-widest rounded-md">
                    Clinical Offerings
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-indigo-950 uppercase tracking-tighter font-display leading-[0.95]">
                    Our Core Veterinary Services
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                    Under Dr. Jasmin Gerona's professional leadership, we practice complete clinical sterilization and compassionate therapy standards, ensuring patient stability.
                  </p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {/* Card 1 */}
                  <div className="p-6 bg-slate-50 border border-slate-100 hover:border-indigo-150 hover:bg-slate-50/25 rounded-3xl duration-305 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="h-12 w-12 bg-indigo-900 text-white rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors shrink-0">
                          <BriefcaseMedical className="h-6 w-6" />
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleExpandCard("surgery")}
                          className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors text-[10px] font-bold text-indigo-950 uppercase rounded-xl tracking-wider inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                        >
                          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-indigo-650" />
                          {expandedCards["surgery"] ? "Close Info ▲" : "Learn More ▼"}
                        </button>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <h3 className="text-base font-extrabold text-indigo-950">Consultations & Surgery</h3>
                        <p className="text-slate-600 leading-relaxed font-light">
                          Evaluation, diagnosis, spaying, neutering, and emergency soft-tissue surgeries under complete aseptic layouts.
                        </p>
                      </div>

                      <AnimatePresence initial={false}>
                        {expandedCards["surgery"] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-3 bg-indigo-50/40 border border-indigo-100/60 rounded-2xl text-[11px] text-slate-700 space-y-2">
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-955 flex items-center gap-1 font-mono">
                                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                  Clinical Safety:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-650">
                                  100% sterile autoclave tools check, intra-operative heart-monitoring, and a sub-0.05% post-op infection rate.
                                </span>
                              </div>
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-955 flex items-center gap-1 font-mono">
                                  <Wrench className="h-3.5 w-3.5 text-teal-650 shrink-0" />
                                  Equipment Used:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-650">
                                  High-Frequency Electrocautery Pen, Steam Autoclave Chamber, and Digital Multiparameter Anesthetic Monitor.
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button 
                      onClick={() => handleServiceSelect("Clinical Consultation & Treatment")}
                      className="pt-4 border-t border-slate-100 mt-5 flex items-center text-[11px] font-black uppercase text-indigo-900 group-hover:text-teal-600 transition-colors w-full cursor-pointer text-left"
                    >
                      Select Consultations & Book →
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="p-6 bg-slate-50 border border-slate-100 hover:border-indigo-150 hover:bg-slate-50/25 rounded-3xl duration-305 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="h-12 w-12 bg-indigo-900 text-white rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors shrink-0">
                          <FileCheck className="h-6 w-6" />
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleExpandCard("vaccines")}
                          className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors text-[10px] font-bold text-indigo-950 uppercase rounded-xl tracking-wider inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                        >
                          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-indigo-650" />
                          {expandedCards["vaccines"] ? "Close Info ▲" : "Learn More ▼"}
                        </button>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <h3 className="text-base font-extrabold text-indigo-950">Core Vaccines & Deworming</h3>
                        <p className="text-slate-600 leading-relaxed font-light">
                          Full life-stage immunization logs (Rabies, DHPPi 5-in-1, Tricat) with persistent clinical advice alerts.
                        </p>
                      </div>

                      <AnimatePresence initial={false}>
                        {expandedCards["vaccines"] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-3 bg-indigo-50/40 border border-indigo-100/60 rounded-2xl text-[11px] text-slate-700 space-y-2">
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-955 flex items-center gap-1 font-mono">
                                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                  Clinical Safety:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-650">
                                  Continuous strict active cold-chain logistics (2°C to 8°C vaccine stability), combined with standard retractable single-use syringes.
                                </span>
                              </div>
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-955 flex items-center gap-1 font-mono">
                                  <Wrench className="h-3.5 w-3.5 text-teal-650 shrink-0" />
                                  Equipment Used:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-650">
                                  Digital Temperature-Controlled Vaccine Refrigerator, live thermocouple sensors, and Terumo Low-Dead-Space needles.
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button 
                      onClick={() => handleServiceSelect("Vaccination Calendar")}
                      className="pt-4 border-t border-slate-100 mt-5 flex items-center text-[11px] font-black uppercase text-indigo-900 group-hover:text-teal-600 transition-colors w-full cursor-pointer text-left"
                    >
                      Select Vaccines & Book →
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="p-6 bg-slate-50 border border-slate-100 hover:border-indigo-150 hover:bg-slate-50/25 rounded-3xl duration-305 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="h-12 w-12 bg-indigo-900 text-white rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors shrink-0">
                          <Heart className="h-6 w-6" />
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleExpandCard("grooming")}
                          className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors text-[10px] font-bold text-indigo-950 uppercase rounded-xl tracking-wider inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                        >
                          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-indigo-650" />
                          {expandedCards["grooming"] ? "Close Info ▲" : "Learn More ▼"}
                        </button>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <h3 className="text-base font-extrabold text-indigo-950">Pet Lodging & Grooming</h3>
                        <p className="text-slate-600 leading-relaxed font-light">
                          Cosy temperature-controlled lodging with dedicated caregivers, medicated baths, dematting, and aesthetic grooming.
                        </p>
                      </div>

                      <AnimatePresence initial={false}>
                        {expandedCards["grooming"] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-3 bg-indigo-50/40 border border-indigo-100/60 rounded-2xl text-[11px] text-slate-700 space-y-2">
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-955 flex items-center gap-1 font-mono">
                                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                  Clinical Safety:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-650">
                                  Separate feline and canine ventilation loops, eco-friendly hospital disinfectants between visits, and slip-free bath security rails.
                                </span>
                              </div>
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-955 flex items-center gap-1 font-mono">
                                  <Wrench className="h-3.5 w-3.5 text-teal-650 shrink-0" />
                                  Equipment Used:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-650">
                                  Direct HVAC HEPA Active Air Flow Exchanger, Stepless Pro Variable-Speed Dryer, and custom sanitizable groomers tubs.
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button 
                      onClick={() => handleServiceSelect("Lodging & Grooming")}
                      className="pt-4 border-t border-slate-100 mt-5 flex items-center text-[11px] font-black uppercase text-indigo-900 group-hover:text-teal-600 transition-colors w-full cursor-pointer text-left"
                    >
                      Select Grooming & Book →
                    </button>
                  </div>

                  {/* Card 4 */}
                  <div className="p-6 bg-slate-50 border border-slate-100 hover:border-indigo-150 hover:bg-slate-50/25 rounded-3xl duration-305 flex flex-col justify-between group shadow-sm hover:shadow-lg transition-all">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="h-12 w-12 bg-indigo-900 text-white rounded-xl flex items-center justify-center group-hover:bg-teal-600 transition-colors shrink-0">
                          <Award className="h-6 w-6" />
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleExpandCard("travel")}
                          className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors text-[10px] font-bold text-indigo-950 uppercase rounded-xl tracking-wider inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                        >
                          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-indigo-650" />
                          {expandedCards["travel"] ? "Close Info ▲" : "Learn More ▼"}
                        </button>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <h3 className="text-base font-extrabold text-indigo-950">Travel Permits & Certificates</h3>
                        <p className="text-slate-600 leading-relaxed font-light">
                          Hassle-free maritime and flight transport veterinary inspection clearances and BAI clinical certifications.
                        </p>
                      </div>

                      <AnimatePresence initial={false}>
                        {expandedCards["travel"] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-3 bg-indigo-50/40 border border-indigo-100/60 rounded-2xl text-[11px] text-slate-700 space-y-2">
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-955 flex items-center gap-1 font-mono">
                                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                  Clinical Safety:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-650">
                                  Direct cross-match checks with current Bureau of Animal Industry (BAI) guidelines, air-cargo cage verification, and transit hydration checks.
                                </span>
                              </div>
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-wider text-indigo-955 flex items-center gap-1 font-mono">
                                  <Wrench className="h-3.5 w-3.5 text-teal-650 shrink-0" />
                                  Equipment Used:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-650">
                                  Direct Networked BAI Portal Uplink, high-precision digital weight meters, and professional ISO-Standard microchip scanners.
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <button 
                      onClick={() => handleServiceSelect("Travel Documents")}
                      className="pt-4 border-t border-slate-100 mt-5 flex items-center text-[11px] font-black uppercase text-indigo-900 group-hover:text-teal-600 transition-colors w-full cursor-pointer text-left"
                    >
                      Select Permits & Book →
                    </button>
                  </div>

                  {/* Highlighted Microchip Card: Spans 2 cols */}
                  <div className="md:col-span-2 p-6 sm:p-8 bg-indigo-950 border border-indigo-900/40 hover:border-teal-400 rounded-3xl shadow-xl duration-300 text-white flex flex-col justify-between group relative overflow-hidden transition-all">

                    <div className="space-y-6 relative z-10 text-xs text-white">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                          <div className="h-12 w-12 bg-teal-400 text-indigo-950 rounded-xl flex items-center justify-center shrink-0">
                            <Database className="h-6 w-6" />
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleExpandCard("microchipping")}
                            className="sm:hidden px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-colors text-[10px] font-bold text-teal-300 uppercase rounded-xl tracking-wider inline-flex items-center gap-1.5 cursor-pointer focus:outline-none"
                          >
                            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-teal-400" />
                            {expandedCards["microchipping"] ? "Close Detail ▲" : "Learn More ▼"}
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => toggleExpandCard("microchipping")}
                            className="hidden sm:inline-flex px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 transition-colors text-[10px] font-bold text-teal-300 uppercase rounded-xl tracking-wider items-center gap-1.5 cursor-pointer focus:outline-none"
                          >
                            <HelpCircle className="h-3.5 w-3.5 shrink-0 text-teal-400" />
                            {expandedCards["microchipping"] ? "Close Detail ▲" : "Learn More ▼"}
                          </button>
                          <span className="inline-flex items-center bg-teal-500/15 border border-teal-400/25 px-3 py-1 rounded-full text-[10px] font-bold text-teal-300 uppercase tracking-wide">
                            Traceable Security
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-extrabold font-display leading-tight">
                          ISO-Standard Pet Microchipping
                        </h3>
                        <p className="text-indigo-100 leading-relaxed font-light max-w-xl text-xs">
                          Inoculate your pet with a tiny, ISO 11784/11785 international tracker transponder. Absolutely required for permanent identification and legally demanded during sea/air transit logs or overseas relocations.
                        </p>
                      </div>

                      <AnimatePresence initial={false}>
                        {expandedCards["microchipping"] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 p-3.5 bg-white/5 border border-white/10 rounded-2xl text-[11px] text-indigo-100 space-y-2">
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-widest text-teal-300 flex items-center gap-1 font-mono">
                                  <ShieldCheck className="h-3.5 w-3.5 text-teal-450 shrink-0" />
                                  Clinical Safety:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-200">
                                  Pre-sterilized individual safety trocar needle setup, along with thorough pre- and post-implantation frequency signal verification scans.
                                </span>
                              </div>
                              <div>
                                <span className="font-extrabold uppercase text-[9px] tracking-widest text-teal-300 flex items-center gap-1 font-mono">
                                  <Cpu className="h-3.5 w-3.5 text-teal-450 shrink-0" />
                                  Equipment Used:
                                </span>
                                <span className="font-medium leading-relaxed block text-[11px] pl-4.5 mt-0.5 text-slate-200">
                                  Bio-compatible RFID microglass microchips (ISO 11784/11785 protocol), custom ergonomic injection shooters, and wide-beam multi-frequency scanning wands.
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="pt-8 mt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                      <div>
                        <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Outreach Promotional promo</span>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-3xl font-black text-teal-400">₱480</span>
                          <span className="text-xs font-bold text-teal-150">Only (Dr. Jasmin Professional Fee Included)</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleServiceSelect("ISO Microchipping (Promo)")}
                        className="px-5 py-3 bg-white text-indigo-950 font-black uppercase text-[10px] tracking-wider rounded-xl border border-indigo-150/10 hover:bg-teal-400 hover:text-indigo-950 transition-all cursor-pointer shadow-sm text-center"
                      >
                        Select Microchip & Book →
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </section>

            {/* BULLETIN ANNOUNCEMENTS SYSTEM */}
            <section id="bulletin" className="py-20 sm:py-24 bg-slate-550/10 border-t border-b border-indigo-50/50 scroll-mt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Visual Bulletin Panel components */}
                <BulletinBoard />

              </div>
            </section>

            {/* VIRTUAL AI CONSULTATION DESK */}
            <section id="ai-chat" className="py-20 sm:py-24 bg-slate-50 border-b border-indigo-50/50 scroll-mt-20">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-900 text-[10px] font-black uppercase tracking-widest rounded-md">
                    Instant Clinical Dialogue
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-indigo-950 uppercase tracking-tighter font-display leading-[0.95]">
                    Virtual AI Consultation Desk
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                    Have any instant veterinary concerns? Type directly into our interactive consultant below to receive instant clinical guidance, pre-surgery fasting instructions, and vaccine timetables.
                  </p>
                </div>

                <AiConsultationDesk />

              </div>
            </section>

            {/* DIRECT ONLINE BOOKING DESK */}
            <section id="booking" className="py-20 sm:py-24 bg-white scroll-mt-20">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                
                {/* Scheduler header content */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="inline-block px-3 py-1 bg-teal-100 text-teal-900 text-[10px] font-black uppercase tracking-widest rounded-md">
                    Administrative Desk
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-indigo-950 uppercase tracking-tighter font-display leading-[0.95]">
                    Schedule Your Pet's Wellness Slot
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                    Select your desired service, slot target, and complete your basic booking details. Dr. Jasmin and staff will review and approve your clinical registration directly.
                  </p>
                </div>

                {/* Main Client Slot Uploader Form Wrapper */}
                <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-205 rounded-3xl p-6 sm:p-10 shadow-xl">
                  <BookingForm 
                    onSuccess={handleBookingSuccess} 
                    preSelectedService={selectedService}
                  />
                </div>

              </div>
            </section>

            {/* FREQUENTLY ANSWERED QUESTIONS (FAQS) SECTION */}
            <section id="faqs" className="py-20 sm:py-24 bg-slate-50 border-t border-slate-150/50 scroll-mt-20">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                <Faqs />
              </div>
            </section>

          </>

      </main>

      {/* FOOTER */}
      <footer className="bg-indigo-950 text-white border-t border-indigo-900 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Col 1: Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="h-9 w-9 bg-teal-400 rounded-xl flex items-center justify-center text-indigo-950 font-bold shrink-0">
                  <BriefcaseMedical className="h-5 w-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold tracking-tight leading-none text-white">BET NA VET</span>
                  <span className="text-[9px] text-teal-300 tracking-wider font-bold">Maasin Veterinary Desk</span>
                </div>
              </div>
              <p className="text-indigo-200 leading-relaxed font-semibold">
                Committed to delivering professional clinical care, microchips, and regional spay outreaches across Leyte.
              </p>
              
              <div className="pt-2">
                <a 
                  href="https://www.facebook.com/betnavetmaasin" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-900 hover:bg-teal-500 hover:text-indigo-950 text-indigo-100 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border border-indigo-805/70 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Visit Official Facebook
                </a>
              </div>
            </div>

            {/* Col 2: Services shortcuts */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Clinical Focus</h4>
              <ul className="space-y-1.5 text-indigo-200 font-semibold">
                <li>• ISO 11784/11785 Microchips</li>
                <li>• Spaying & Sterile Surgery</li>
                <li>• DHPPi & Triple Cat Immunizations</li>
                <li>• Pet Lodging Accommodations</li>
                <li>• Local National BAI Certificates</li>
              </ul>
            </div>

            {/* Col 3: Direct info */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Clinic Hours</h4>
              <ul className="space-y-1.5 text-indigo-200 font-semibold leading-normal">
                <li>• <strong className="text-white font-extrabold">Monday - Saturday:</strong> 9:00 AM - 5:00 PM</li>
                <li>• <strong className="text-white font-extrabold">Sunday:</strong> Emergency Cases Only</li>
                <li>• <strong className="text-white font-extrabold">Doctor License:</strong> Dr. Jasmin M. C. Gerona, DVM</li>
                <li>• <strong className="text-white font-extrabold">Clinic Code:</strong> Region VIII - Southern Leyte</li>
              </ul>
            </div>

            {/* Col 4: Urgent Notice */}
            <div className="space-y-3">
              <span className="inline-flex items-center bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 rounded-md text-[9px] font-bold text-rose-300 uppercase tracking-widest mb-1">
                Emergency Alert
              </span>
              <p className="text-indigo-200 leading-relaxed font-semibold">
                For active clinical emergencies after standard working hours, reach the Doctor's direct triage desk:
              </p>
              
              <div className="mt-2 space-y-1.5">
                <a 
                  href="tel:+639171454922" 
                  title="Click to call emergency hotline directly"
                  className="inline-flex items-center gap-1.5 text-md font-extrabold font-mono text-amber-400 hover:text-amber-300 hover:underline transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  +63 917 145 4922
                </a>
                <span className="block text-[10px] text-indigo-300 font-medium italic">Click either phone number to dial instantly</span>
              </div>
            </div>

          </div>

          <div className="border-t border-indigo-900 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-indigo-200 font-semibold text-[11px] gap-4">
            <p>© {new Date().getFullYear()} Bet na Vet Veterinary Clinic Maasin. All rights reserved.</p>
            <div className="flex space-x-4">
              <span>Dr. Jasmin Marie Cillo Gerona, DVM</span>
              <span className="text-indigo-700">|</span>
              <span>Southern Leyte, Philippines</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Dynamic Floating AI Clinical Helper */}
      <AiAssistant />

    </div>
  );
}
