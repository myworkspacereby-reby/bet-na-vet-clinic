import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set up server middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Data file configuration
const DATA_STORE_PATH = path.join(process.cwd(), "clinic-data-store.json");

interface Appointment {
  id: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  petName: string;
  petType: string;
  petAge: string;
  clinicService: string;
  appointmentDate: string;
  appointmentTime: string;
  receiptScreenshot?: string; // base64 encoded
  status: "Pending" | "Approved" | "Declined" | "Completed";
  notes?: string;
  createdAt: string;
}

interface BulletinPost {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  badge: string;
  locations?: string;
  medicalReminders?: string[];
  eventDates?: string[];
  createdAt: string;
}

// Initial defaults
const defaultData = {
  appointments: [
    {
      id: "apt-1",
      ownerName: "Maria Santos",
      ownerPhone: "09171234567",
      petName: "Bella",
      petType: "Dog",
      petAge: "2 Years",
      clinicService: "ISO Microchipping (Promo)",
      appointmentDate: "2026-06-15",
      appointmentTime: "09:00 AM - 11:00 AM",
      status: "Approved",
      notes: "Promo rate confirmed for Sogod mission. Standard ISO Microchip prepared.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "apt-2",
      ownerName: "Juan dela Cruz",
      ownerPhone: "09187654321",
      petName: "Rocky",
      petType: "Cat",
      petAge: "1 Year",
      clinicService: "Surgical Procedure",
      appointmentDate: "2026-06-15",
      appointmentTime: "11:00 AM - 01:00 PM",
      status: "Pending",
      notes: "Sogod Day low-cost spay reservation. Waiting to verify GCash deposit receipt.",
      createdAt: new Date().toISOString(),
    }
  ] as Appointment[],
  bulletin: [
    {
      id: "post-1",
      title: "Low-Cost Spay & Neuter Special Surgery Days",
      subtitle: "Decreasing stray animal distress and securing domestic controls",
      content: "Join our upcoming out-of-town surgery missions aimed to decrease stray animal distress and secure domestic breeding controls in Southern Leyte and Leyte province.",
      badge: "Next Run: Sogod & Ormoc City",
      locations: "Sogod & Ormoc City",
      medicalReminders: [
        "Strict 6-8 hours fasting (No food or water) before surgical intervention.",
        "Pets must be clinically healthy, alert, and active.",
        "Must carry safe transport crate or appropriate carrier basket."
      ],
      eventDates: [
        "Sogod Special Days: June 15-16, 2026",
        "Ormoc Special Days: June 28-29, 2026",
        "Registration fee must be completed before booking is activated."
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: "post-2",
      title: "Rainy Season Veterinary Preparedness & Parvo Preventive Alert",
      subtitle: "Crucial clinic vaccine check guidelines",
      content: "As the monsoon season registers higher moisture levels, parvo infection risks increase significantly. We recommend ensuring your puppies receive complete core vaccine boosters (DHPPi/5-in-1). Avoid exposing unvaccinated puppies to public soils.",
      badge: "Clinical Alert",
      locations: "All Sub-Municipalities",
      medicalReminders: [
        "Schedule puppy 5-in-1 vaccines at 6, 9, and 12 weeks of age.",
        "Regularly sanitize kennels with veterinarian-approved solutions.",
        "Deworming acts as an immune catalyst - do not skip!"
      ],
      eventDates: [
        "Regular clinic checkups open Mon-Sat, 9:00 AM - 5:00 PM",
        "Free veterinary consult updates available via AI Desk chatbot."
      ],
      createdAt: new Date().toISOString(),
    }
  ] as BulletinPost[]
};

// Help helper for reading and writing database
function loadStore() {
  try {
    if (fs.existsSync(DATA_STORE_PATH)) {
      const raw = fs.readFileSync(DATA_STORE_PATH, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading data store, reverting to defaults", err);
  }
  // Write default store if missing
  saveStore(defaultData);
  return defaultData;
}

function saveStore(data: typeof defaultData) {
  try {
    fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing data store", err);
  }
}

// Lazy init for Google Gen AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    // We will initialize GoogleGenAI with the standard user-agent parameter
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_IF_UNDEFINED",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST APIs
// Notification Dispatch Utility Functions
async function sendNotificationEmail(to: string, subject: string, htmlContent: string) {
  console.log("======================================================================");
  console.log(`[EMAIL DISPATCH INITIATED]`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content Preview:`);
  console.log(htmlContent.replace(/<[^>]+>/g, ' ').substring(0, 300).trim() + "...");
  console.log("======================================================================");

  // If a standard RESEND_API_KEY is found in the Environment configuration, perform a live email dispatch
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "MY_RESEND_API_KEY") {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Bet na Vet Booking <onboarding@resend.dev>",
          to: [to],
          subject: subject,
          html: htmlContent,
        }),
      });
      const data = await response.json();
      console.log("[LIVE EMAIL SUCCESS via Resend]:", response.status, data);
    } catch (err) {
      console.error("[LIVE EMAIL ERROR via Resend]:", err);
    }
  } else {
    console.log("[EMAIL NOTE]: Real email dispatch skipped. Place 'RESEND_API_KEY' in the Secrets Panel to unlock livesize deliveries.");
  }
}

async function sendNotificationSMS(phone: string, textContent: string) {
  console.log("======================================================================");
  console.log(`[SMS DISPATCH INITIATED]`);
  console.log(`Phone target: ${phone}`);
  console.log(`SMS Payload: ${textContent}`);
  console.log("======================================================================");

  // If Twilio settings are configured, perform a live real-world SMS dispatch
  if (
    process.env.TWILIO_ACCOUNT_SID && 
    process.env.TWILIO_AUTH_TOKEN && 
    process.env.TWILIO_PHONE_NUMBER &&
    process.env.TWILIO_ACCOUNT_SID !== "MY_TWILIO_SID"
  ) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: process.env.TWILIO_PHONE_NUMBER,
          To: phone,
          Body: textContent,
        }).toString(),
      });
      const data = await response.json();
      console.log("[LIVE SMS SUCCESS via Twilio]:", response.status, data);
    } catch (err) {
      console.error("[LIVE SMS ERROR via Twilio]:", err);
    }
  } else {
    console.log("[SMS NOTE]: Real SMS dispatch skipped. Setup 'TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', and 'TWILIO_PHONE_NUMBER' to perform actual global mobile deliveries.");
  }
}

// 1. Get all appointments
app.get("/api/appointments", (req, res) => {
  const data = loadStore();
  // Sort freshest appointments first
  res.json(data.appointments);
});

// 2. Submit new appointment
app.post("/api/appointments", async (req, res) => {
  try {
    const {
      ownerName,
      ownerPhone,
      ownerEmail,
      petName,
      petType,
      petAge,
      clinicService,
      appointmentDate,
      appointmentTime,
      receiptScreenshot,
    } = req.body;

    if (!ownerName || !ownerPhone || !petName || !petType || !clinicService || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "Missing required booking demographics or parameters" });
    }

    const data = loadStore();
    const newApt: Appointment = {
      id: "apt-" + Math.random().toString(36).substring(2, 9),
      ownerName,
      ownerPhone,
      ownerEmail: ownerEmail || undefined,
      petName,
      petType,
      petAge: petAge || "Unspecified",
      clinicService,
      appointmentDate,
      appointmentTime,
      receiptScreenshot,
      status: "Pending",
      notes: "Online submission from clinic portal. Pending administrator verification.",
      createdAt: new Date().toISOString(),
    };

    data.appointments.unshift(newApt);
    saveStore(data);

    // Fire notifications asynchronously so we don't slow down client submission
    // 1. INTERNAL NOTIFICATION to betnavet2020@gmail.com
    const internalMailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; color: #1e1b4b;">
        <h2 style="color: #312e81; border-bottom: 2px solid #5b21b6; padding-bottom: 12px; margin-top: 0;">🐾 [INTERNAL NOTICE] New Appointment Booked</h2>
        <p>A new clinic appointment reservation has been registered via the web terminal.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 18px 0;">
          <tr style="background: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Location ID</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><code>${newApt.id}</code></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Pet Owner</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${newApt.ownerName}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Owner Contact</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">Phone: ${newApt.ownerPhone} ${newApt.ownerEmail ? `<br/>Email: ${newApt.ownerEmail}` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Pet Patient</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${newApt.petName} (${newApt.petType}, ${newApt.petAge})</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Selected Service</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;"><strong>${newApt.clinicService}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Target Slot</td>
            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${newApt.appointmentDate} @ ${newApt.appointmentTime}</td>
          </tr>
        </table>
        
        <p style="margin-bottom: 0;">Please review the clinic logs or access the Admin console to verify and approve this slot.</p>
      </div>
    `;

    sendNotificationEmail(
      "betnavet2020@gmail.com", 
      `🐾 [BET NA VET] New Appointment Reservation Received: ${newApt.petName} (${newApt.ownerName})`, 
      internalMailHtml
    ).catch(e => console.error("Internal Notification Error:", e));

    // 2. EXTERNAL NOTIFICATION to Pet Owner (SMS & Email if configured)
    const externalMailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; color: #1e1b4b; background-color: #fafafa;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4f46e5; margin: 0 0 4px 0;">Bet na Vet Veterinary Clinic</h2>
          <p style="color: #64748b; font-size: 13px; margin: 0;">T. Oppus Street, Maasin City, Southern Leyte</p>
        </div>
        
        <h3 style="color: #1e1b4b; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">Hello ${newApt.ownerName}!</h3>
        <p>We are delighted to inform you that we have received your clinical slot reservation request for <strong>${newApt.petName}</strong>.</p>
        
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
          <h4 style="color: #4f46e5; margin-top: 0; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Reservation Details:</h4>
          <ul style="list-style-type: none; padding: 0; margin: 0; line-height: 1.6;">
            <li><strong>Reservation ID:</strong> ${newApt.id}</li>
            <li><strong>Service Type:</strong> ${newApt.clinicService}</li>
            <li><strong>Requested Date:</strong> ${newApt.appointmentDate}</li>
            <li><strong>Requested Schedule:</strong> ${newApt.appointmentTime}</li>
            <li><strong>Status:</strong> <span style="background-color: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: bold;">Pending Review</span></li>
          </ul>
        </div>

        ${
          (newApt.clinicService.toLowerCase().includes("surg") || 
           newApt.clinicService.toLowerCase().includes("spay") || 
           newApt.clinicService.toLowerCase().includes("neut")) 
          ? `
          <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <h4 style="color: #dc2626; margin-top: 0; margin-bottom: 6px; font-size: 13px; text-transform: uppercase; font-weight: 800;">⚠️ STICKY PRE-SURGERY FASTING REQUIREMENT:</h4>
            <p style="color: #7f1d1d; margin: 0; font-size: 12px; line-height: 1.5;">
              As mandated by Dr. Jasmin Marie Gerona, DVM, your pet must undergo <strong>strict fasting of 6-8 consecutive hours (absolutely NO food, water, snacks, or treats)</strong> before undergoing anesthesia. Failing to comply can post serious choking hazards during the procedure. Checkups, vaccines, and microchipping do not require fasting.
            </p>
          </div>
          ` : ""
        }

        <p style="font-size: 13px; color: #475569; line-height: 1.5;">
          Our medical staff is currently validating your requested timeslot. You will receive a direct phone update/SMS confirmation once Dr. Jasmin or our front desk approves your slot.
        </p>

        <p style="font-size: 12px; color: #64748b; margin-top: 24px; border-t: 1px solid #e2e8f0; padding-top: 15px; text-align: center;">
          Need immediate assistance? Speak with our Direct Desk Hotline: <strong>+63 917 145 4922</strong><br/>
          Map Link: <a href="https://maps.app.goo.gl/H1RCsqMTgn1eWeCw6" style="color: #4f46e5; text-decoration: underline;">https://maps.app.goo.gl/H1RCsqMTgn1eWeCw6</a>
        </p>
      </div>
    `;

    // 2a. Send External Email if the user provided one
    if (newApt.ownerEmail) {
      sendNotificationEmail(
        newApt.ownerEmail, 
        `🏥 [BET NA VET] Your Appointment Reservation is Pending Review (${newApt.petName})`, 
        externalMailHtml
      ).catch(e => console.error("External Email Notification Error:", e));
    }

    // 2b. Send External SMS to mobile number
    const fastingNote = (newApt.clinicService.toLowerCase().includes("surg") || 
                         newApt.clinicService.toLowerCase().includes("spay") || 
                         newApt.clinicService.toLowerCase().includes("neut")) 
      ? " *REMINDER: Strict 6-8 hrs pre-surgery fasting required! No food or water." 
      : "";
    
    const smsMessage = `Bet na Vet: Hello ${newApt.ownerName}! Your booking request for ${newApt.petName} (${newApt.clinicService}) on ${newApt.appointmentDate} at ${newApt.appointmentTime} is under clinical review. ID: ${newApt.id}.${fastingNote} Contact us at +63 917 145 4922. Maps: https://maps.app.goo.gl/H1RCsqMTgn1eWeCw6`;

    sendNotificationSMS(newApt.ownerPhone, smsMessage)
      .catch(e => console.error("External SMS Notification Error:", e));

    res.status(201).json(newApt);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to process appointment reservation." });
  }
});

// 3. Update appointment (status, notes)
app.put("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const { status, notes, appointmentDate, appointmentTime } = req.body;

  const data = loadStore();
  const index = data.appointments.findIndex((a: Appointment) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Appointment not found." });
  }

  const updated = {
    ...data.appointments[index],
    ...(status && { status }),
    ...(notes !== undefined && { notes }),
    ...(appointmentDate && { appointmentDate }),
    ...(appointmentTime && { appointmentTime }),
  };

  data.appointments[index] = updated;
  saveStore(data);
  res.json(updated);
});

// 4. Delete appointment
app.delete("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  const data = loadStore();
  const filtered = data.appointments.filter((a: Appointment) => a.id !== id);

  if (filtered.length === data.appointments.length) {
    return res.status(404).json({ error: "Appointment not found" });
  }

  data.appointments = filtered;
  saveStore(data);
  res.json({ success: true, id });
});

// 5. Get bulletin posts
app.get("/api/bulletin", (req, res) => {
  const data = loadStore();
  res.json(data.bulletin);
});

// 6. Submit new bulletin post
app.post("/api/bulletin", (req, res) => {
  const { title, subtitle, content, badge, locations, medicalReminders, eventDates } = req.body;

  if (!title || !content || !badge) {
    return res.status(400).json({ error: "Title, badge, and content are required." });
  }

  const data = loadStore();
  const newPost: BulletinPost = {
    id: "post-" + Math.random().toString(36).substring(2, 9),
    title,
    subtitle: subtitle || "",
    content,
    badge,
    locations: locations || "Maasin Clinic Core",
    medicalReminders: Array.isArray(medicalReminders) ? medicalReminders : [],
    eventDates: Array.isArray(eventDates) ? eventDates : [],
    createdAt: new Date().toISOString(),
  };

  data.bulletin.unshift(newPost);
  saveStore(data);
  res.status(201).json(newPost);
});

// 7. Delete bulletin post
app.delete("/api/bulletin/:id", (req, res) => {
  const { id } = req.params;
  const data = loadStore();
  const filtered = data.bulletin.filter((b: BulletinPost) => b.id !== id);

  if (filtered.length === data.bulletin.length) {
    return res.status(404).json({ error: "Bulletin post not found" });
  }

  data.bulletin = filtered;
  saveStore(data);
  res.json({ success: true, id });
});

// 8. AI Chatbot Integration route using @google/genai
async function notifyConsultationInquiry(messagesHistory: any[]) {
  try {
    const userMessages = messagesHistory.filter((m: any) => m.role === "user");
    if (userMessages.length === 0) return;

    const latestUserQuery = userMessages[userMessages.length - 1]?.content || "No query text specified";

    const dialogHistoryHtml = messagesHistory.map((m: any) => {
      const isUser = m.role === "user";
      const sender = isUser ? "Pet Parent" : "AI Consultation Desk";
      const bg = isUser ? "#f8fafc" : "#f0fdfa";
      const border = isUser ? "#e2e8f0" : "#ccfbf1";
      const color = isUser ? "#1e1b4b" : "#0d9488";
      return `
        <div style="background-color: ${bg}; padding: 12px 16px; border-radius: 12px; margin-bottom: 8px; border: 1px solid ${border};">
          <strong style="color: ${color}; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 4px;">● ${sender}</strong>
          <p style="margin: 0; font-size: 11.5px; line-height: 1.5; color: #334155; white-space: pre-wrap;">${m.content}</p>
        </div>
      `;
    }).join("");

    const internalConsultationHtml = `
      <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; color: #1e1b4b; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #0d9488; padding-bottom: 12px; margin-top: 0; margin-bottom: 16px;">
          <h2 style="color: #1e1b4b; margin: 0 0 4px 0; font-size: 18px; text-transform: uppercase; letter-spacing: 0.5px;">🐾 [AI Ask Desk] Interaction Alert</h2>
          <span style="background-color: #f0fdfa; color: #0d9488; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold; border: 1px solid #ccfbf1;">Live Virtual Consultation Channel</span>
        </div>
        
        <p style="font-size: 12.5px; color: #475569; line-height: 1.5; margin-bottom: 18px;">
          A pet parent is consulting with Dr. Jasmin Gerona's Virtual AI Consultation terminal. Here is the latest conversation transcript from their inquiry session:
        </p>
        
        <div style="background-color: #faf5ff; border: 1px solid #f3e8ff; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
          <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #5b21b6; width: 130px;">Latest Inquiry:</td>
              <td style="padding: 4px 0; color: #1e1b4b;">"${latestUserQuery.substring(0, 110)}${latestUserQuery.length > 110 ? '...' : ''}"</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: bold; color: #5b21b6;">Inquiry Time:</td>
              <td style="padding: 4px 0; color: #1e1b4b;"><code>${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} (UTC)</code></td>
            </tr>
          </table>
        </div>

        <h4 style="font-size: 11px; color: #1e1b4b; text-transform: uppercase; letter-spacing: 0.8px; margin-top: 20px; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 6px;">Dialogue Thread Transcript:</h4>
        <div style="max-height: 380px; overflow-y: auto; background-color: #fafafa; border: 1px solid #f1f5f9; border-radius: 12px; padding: 14px;">
          ${dialogHistoryHtml}
        </div>

        <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 14px; text-align: center; line-height: 1.4;">
          Bet na Vet Veterinary Clinic • Direct Reception Hotline: <strong>+63 917 145 4922</strong><br/>
          T. Oppus Street, Maasin City, Southern Leyte.
        </p>
      </div>
    `;

    await sendNotificationEmail(
      "betnavet2020@gmail.com",
      `🐾 [AI ASK DESK INQUIRY] Pet Consultation Interaction: "${latestUserQuery.substring(0, 35)}${latestUserQuery.length > 35 ? '...' : ''}"`,
      internalConsultationHtml
    );
  } catch (err) {
    console.error("Failed to process AI Consultation Desk email notification:", err);
  }
}

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Valid chat messages history array is required." });
  }

  try {
    const isMockMode = !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY";

    if (isMockMode) {
      // Return a simulated high-quality veterinary response loaded with clinical wisdom
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let mockReply = "";

      if (lastMessage.includes("fast") || lastMessage.includes("diet") || lastMessage.includes("eat") || lastMessage.includes("food")) {
        mockReply = "**Pre-operative Fasting Protocol Notice:**\nFor all pets booked for surgery (including our upcoming Low-Cost Spay & Neuter Mission Days in Sogod or Ormoc), Dr. Jasmin Marie Gerona, DVM requires a strict **6-8 hours fasting** of absolute food or water before their slotted time. Fasting avoids gastric reflux and related surgery complications under anesthesia. Let us know if your pet has separate health complications.";
      } else if (lastMessage.includes("microchip") || lastMessage.includes("chip") || lastMessage.includes("gps") || lastMessage.includes("identification")) {
        mockReply = "**ISO Pet Microchipping Standard Information:**\nWe offer ISO-Standard certified microchipping (ISO 11784/11785 international standard transponders) at our introductory clinic promotional rate of **₱480 Only**, which strictly includes Dr. Jasmin's professional clinical injection fee. It provides lifetime traceable security and complies with maritime, air terminal, or overseas transit rules. It is injected quickly under the species skin, similarly to a regular vaccination booster injection.";
      } else if (lastMessage.includes("vacc") || lastMessage.includes("deworm") || lastMessage.includes("parvo") || lastMessage.includes("rabies")) {
        mockReply = "**Prevention & Immunization Schedule Guidelines:**\nWe support full lifesize immunization schedules including Rabies vaccine, DHPPi (5-in-1) for dogs, and Tricat vaccines for cats. Zoonotic deworming should generally occur every 3-6 months. Parvo immunity is especially critical as moisture levels elevate during Southern Leyte's rainy periods.";
      } else if (lastMessage.includes("sogod") || lastMessage.includes("ormoc") || lastMessage.includes("event") || lastMessage.includes("mission") || lastMessage.includes("bulletin")) {
        mockReply = "**Leyte Veterinary Community Mission Schedule:**\nOur upcoming Regional Outreach Calendar is as follows:\n- **Sogod Outreach Days:** June 15-16, 2026\n- **Ormoc City Outreach Days:** June 28-29, 2026\n*Important notes:* Ensure pre-operative fasting is complete, and submit your reservation deposit to lock in your priority slot!";
      } else {
        mockReply = `Warm greetings from **Bet na Vet Veterinary Clinic Maasin** under Dr. Jasmin Marie Gerona! 🐾 I am your specialized Vet Clinical AI Helper.\n\nAsk me anything regarding:\n1. **Pre-surgery Fasting Guidelines** (6-8 hours zero food/water)\n2. **₱480 ISO-Standard Microchipping Promo**\n3. **Low-Cost Outreach days** (Sogod on June 15-16; Ormoc on June 28-29, 2026)\n4. **Core Immunization programs** (DHPPi, Rabies vaccines, deworming calendars)\n\n*General clinical tip:* Keep your pet in a supportive carrier box during travel to reduce clinic stress! How can Bella or Rocky be guided today?`;
      }

      // Add slight delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Asynchronously trigger the internal consultation email alert
      const fullHistory = [...messages, { role: "assistant", content: mockReply }];
      notifyConsultationInquiry(fullHistory).catch(e => console.error("Consultation notification failed:", e));

      return res.json({ text: mockReply });
    }

    // Actual GenAI lookup using the gemini-3.5-flash model
    const client = getGeminiClient();
    
    // Convert message structure to format expected by GenerateContentParameters.
    // System instruction sets the veterinary context, specific clinic specs, rates, and fasting workflows.
    const systemInstruction = 
      "You are Dr. Jasmin Marie Cillo Gerona's Specialized Virtual Vet Clinical Assistant for 'Bet na Vet Veterinary Clinic Maasin', located in Southern Leyte, Philippines." +
      "\n- Always speak under Dr. Jasmin Gerona's guidance: professional, reassuring, deeply compassionate, and clinically authoritative." +
      "\n- Core Services & Specific Clinical Details to reference:" +
      "\n  1. Core Consultations, Labs, and sterile Surgery." +
      "\n  2. Core Immunization (Rabies, DHPPi 5-in-1, Tricat) and regular veterinarian-guided Deworming." +
      "\n  3. Temperature-controlled Pet Lodging and Aesthetic Grooming (medicated baths, de-mating, nail clip)." +
      "\n  4. Out-of-town Veterinary Certificates (local transport, BAI sea/air permits)." +
      "\n  5. PROMOTIONAL EVENT: ISO-Standard Pet Microchipping (complies with ISO 11784/11785 international tracker standards) for ONLY ₱480, which completely includes the Doctor's Professional Fee!" +
      "\n- Regional Outreach Bulletin Calendar:" +
      "\n  - Sogod Special low-cost spay/neuter surgery days: June 15-16, 2026" +
      "\n  - Ormoc City Special low-cost spay/neuter surgery days: June 28-29, 2026" +
      "\n- Strict Pre-operative FASTING PROTOCOL:" +
      "\n  - If the user asks about surgery, spaying, neutering, anesthesia, or outpatient prep, always emphasize: strict ZERO FOOD AND WATER for 6-8 hours before scheduled surgery. No exceptions!" +
      "\n- Emergency mobile number is: 0917 145 4922" +
      "\n- Landbank core account is SA 5312-3422-41" +
      "\n- Keep your instructions organized, using bullet points and bold key phrases. Always write concise human answers, avoiding excessive clinical jargon.";

    // Map history to parts format
    const contentParts = messages.map((m: any) => {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      };
    });

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contentParts,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Asynchronously trigger the internal consultation email alert with the live text response
    const fullHistory = [...messages, { role: "assistant", content: response.text }];
    notifyConsultationInquiry(fullHistory).catch(e => console.error("Consultation notification failed:", e));

    return res.json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API backend error:", err);
    res.status(500).json({ error: "The Vet Assistant encountered an unexpected error. Please retry or consult our direct clinic help desk." });
  }
});

// Configure Vite or Static Files
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    // Production static serving from compiled 'dist'
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from /dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bet na Vet Server running on http://localhost:${PORT}`);
  });
}

setupServer();
