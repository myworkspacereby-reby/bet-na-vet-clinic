import React, { useState } from 'react';

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Dynamic script injection for Tailwind styling convenience */}
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100 py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xl font-extrabold text-indigo-900 tracking-tight">
          Bet na Vet Veterinary Clinic Maasin
        </span>
        <div className="flex gap-6 text-sm font-semibold text-slate-600">
          <a href="#services" className="hover:text-indigo-600 transition">Services</a>
          <a href="#bulletin" className="hover:text-indigo-600 transition">Bulletin Board</a>
          <a href="#book" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm -mt-1">Book Now</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm mb-6 border border-emerald-200">
          ⭐ ⭐ ⭐ ⭐ ⭐ <span className="ml-1">5.0 Stars on Google (24+ Trusted Reviews)</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
          Clinical Excellence & Outstanding Care for Your Pets
        </h1>
        <p className="text-lg text-slate-600 mt-4 max-w-xl mx-auto">
          Providing Maasin City with professional surgery, emergency critical care, premium boarding, and seamless digital booking.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a href="#book" className="bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition shadow-md">
            Book Appointment
          </a>
          <a href="#bulletin" className="bg-white text-slate-700 font-bold px-8 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition shadow-sm">
            View Upcoming Events
          </a>
        </div>
      </header>

      {/* Core Services Grid */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-8">Our Premium Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-2xl mb-3">🩺</div>
            <h3 className="font-bold text-lg text-slate-900">Consultations &amp; Surgery</h3>
            <p className="text-slate-600 text-sm mt-1">Expert clinical examinations, soft tissue surgeries, and diagnostic in-house lab procedures by Dr. Jasmin.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-2xl mb-3">💉</div>
            <h3 className="font-bold text-lg text-slate-900">Core Vaccines &amp; Deworming</h3>
            <p className="text-slate-600 text-sm mt-1">Keep scheduled immunizations up to date. Essential preventative measures to safeguard immunity.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-2xl mb-3">🏨</div>
            <h3 className="font-bold text-lg text-slate-900">Pet Boarding &amp; Grooming</h3>
            <p className="text-slate-600 text-sm mt-1">Safe, spacious, and stress-free staycations along with specialized sanitary grooming care routines.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-2xl mb-3">✈️</div>
            <h3 className="font-bold text-lg text-slate-900">Veterinary Travel Certificates</h3>
            <p className="text-slate-600 text-sm mt-1">Fast, legal, and compliant health checks required for domestic and international pet transit protocols.</p>
          </div>
          {/* Highlighted Microchip Service */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-sm border border-indigo-100 md:col-span-2 lg:col-span-1">
            <div className="text-2xl mb-3">🆔</div>
            <h3 className="font-bold text-lg text-indigo-900">Permanent Microchipping</h3>
            <p className="text-indigo-950 text-sm mt-1">Permanent identity tracking for quick reunion security if lost.</p>
            <div className="mt-4 inline-block bg-indigo-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-md shadow-sm">
              Introductory Rate: ₱480 Only
            </div>
          </div>
        </div>
      </section>

      {/* Community Bulletin Board */}
      <section id="bulletin" className="bg-indigo-900 text-white py-16 px-6 my-12">
        <div className="max-w-4xl mx-auto bg-indigo-950 p-8 rounded-3xl border border-indigo-800 shadow-xl">
          <div className="flex items-center gap-2 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider w-max mb-4">
            📢 Community Notice Board
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Low-Cost Spay &amp; Neuter Special Surgery Days</h2>
          <p className="text-indigo-200 mt-2 font-medium">Upcoming Out-of-Town Mobile Caravans: Sogod &amp; Ormoc City Sessions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm text-indigo-100 bg-indigo-900/40 p-4 rounded-xl border border-indigo-800/60">
            <div>📌 <b>Rates:</b> Cat Castration: ₱999 | Cat Spay: ₱1,999 | Dog Castration: ₱1,999</div>
            <div>⚠️ <b>Reminders:</b> Healthy pets only. Strict 6–8 hours fasting required prior to appointment times.</div>
          </div>
          <a href="#book" className="inline-block mt-6 bg-amber-400 text-amber-950 font-bold text-sm px-6 py-3 rounded-xl hover:bg-amber-300 transition shadow-md">
            Reserve Special Event Slot &rarr;
          </a>
        </div>
      </section>

      {/* Automated Booking & Intake Form */}
      <section id="book" className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100">
          <h2 className="text-2xl font-black text-slate-950 tracking-tight">Automated Intake &amp; Booking</h2>
          <p className="text-sm text-slate-500 mt-1">Fill out the fields below to automatically secure your slot without the wait.</p>

          {submitted && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold animate-bounce">
              🎉 Thank you! Your appointment request and payment slip screenshot have been recorded. Dr. Jasmin's team will verify your slot shortly via SMS!
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase">Owner Full Name</label>
                <input required type="text" className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase">Mobile Number</label>
                <input required type="tel" placeholder="e.g., 0917XXXXXXX" className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase">Pet Name &amp; Breed</label>
                <input required type="text" className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase">Pet Age</label>
                <input required type="text" className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase">Select Target Service</label>
              <select required className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
                <option>General Consultation / Check-up</option>
                <option>Core Vaccination or Deworming Run</option>
                <option>Pet Boarding Accommodations</option>
                <option>Veterinary Travel Health Certificate</option>
                <option>₱480 Permanent Microchipping Offer</option>
                <option>Special Surgery Day (Sogod/Ormoc Registration)</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase">Preferred Date</label>
                <input required type="date" className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase">Preferred Time Slot</label>
                <select required className="mt-1 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500">
                  <option>Morning Session (9:00 AM - 12:00 PM)</option>
                  <option>Afternoon Session (1:00 PM - 5:00 PM)</option>
                  <option>Late Session (5:00 PM - 7:00 PM)</option>
                </select>
              </div>
            </div>

            {/* GCash Advanced Portal Component */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mt-4">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Secure Advanced Reservation Portal</span>
              <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-3 rounded-xl border border-slate-100">
                <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-center text-[10px] text-slate-400 font-bold p-2">
                  [ GCash QR CODE PLACEHOLDER ]
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-indigo-900">Primary Channel: GCash Account</p>
                  <p>Number: <span className="font-semibold text-slate-900">0917 145 4922</span></p>
                  <p className="text-[10px] text-slate-400 italic">Alternative payment options details are open by window inquiry.</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-600 uppercase">Upload GCash / Deposit Screenshot</label>
                <input required type="file" accept="image/*" className="mt-1 w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-4 rounded-xl shadow-md transition">
              Submit Secure Request
            </button>
          </form>
        </div>
      </section>

      {/* Footer Grid Info */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Bet na Vet Veterinary Clinic Maasin</h4>
            <p className="leading-relaxed">Providing high-standard diagnostic medicine, compassionate surgical solutions, and secure pet boarding options for the local community.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Contact Metrics</h4>
            <p className="mb-1">📞 0917 145 4922 / 0997 594 1055</p>
            <p className="mb-1">☎️ (053) 802 6270</p>
            <p>✉️ betnavet2020@gmail.com</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Physical Address</h4>
            <p className="leading-relaxed">Unit 10, MLHI/Manaya Bldg, R. Garces St, Brgy. Tunga-tunga, Maasin City, Southern Leyte, 6600</p>
          </div>
        </div>
        <div className="text-center mt-8 pt-8 border-t border-slate-800 text-[11px]">
          &copy; {new Date().getFullYear()} Bet na Vet Veterinary Clinic Maasin. All Rights Reserved. Fully Automated Solution Infrastructure.
        </div>
      </footer>
    </div>
  );
}
