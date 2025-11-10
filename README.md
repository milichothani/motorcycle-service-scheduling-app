# 🏍️ Corner Tuned Motorcycles – Service Management & AI Assistant

A modern motorcycle workshop management application with **AI-powered diagnostics**, **voice-enabled chat**, **image analysis**, and **customer service tools**.  
Built with **React + Vite**, **Tailwind CSS**, and **Groq AI**.

---

## 🚀 Features

### 🧰 Workshop Management
- Customer & vehicle management  
- Booking & service scheduling  
- Dashboard with quick stats  
- Mobile-friendly interface  

### 🤖 AI-Powered Mechanic Assistant
- Ask mechanical questions and get clear solutions  
- Troubleshooting focused answers (causes + fixes + safety notes)  
- Chat history saved locally  
- Auto-scrolling chat UI  
- Message bubbles with mechanic avatar (optional)  


### 📱 PWA Support
- Installable app  
- Offline fallback  
- Works like a native mobile application  

---

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **PWA support**

### AI
- **Groq API** (`kimi-k2-instruct-0905` or latest model)
- Supports text chat & (optional) multimodal analysis

### Build & Deploy
- **Vercel** (recommended)
- Optional: Netlify / Firebase

---

## 📂 Project Structure

src/
├── components/
│ ├── TechSuggestions.tsx # AI chat assistant
│ ├── ImageDiagnosis.tsx # AI image analysis
│ ├── Articles.tsx # AI maintenance articles
│ └── icons.tsx
├── services/
│ └── geminiService.ts # AI API wrapper using Groq
├── hooks/
│ └── useOnlineStatus.ts # online/offline detection
├── App.tsx
└── main.tsx


---

## 🔧 Installation & Setup

### 1. Clone the project

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

2. Install dependencies
npm install

3. Create your .env file
VITE_GROQ_API_KEY=your_api_key_here

4. Start development server
npm run dev

Your app runs at:
http://localhost:3000

🧪 API Used (Groq)
example request:
const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "kimi-k2-instruct-0905",
    messages
  })
});

---

## 🔮 Future Scope

The platform is designed to evolve with more smart, technician-grade capabilities.  
Upcoming enhancements include:

### 🖼️ 1. Advanced Image Diagnosis (AI Vision Upgrade)
Extend the image diagnosis feature using a full multimodal vision model to:
- Detect worn-out brake pads  
- Identify chain slack & lubrication issues  
- Recognize rust, cracks, and oil leakage  
- Analyze tyre wear, puncture risks, and tread depth  
- Automatically label components on the motorcycle photo  

This will allow customers to simply upload a picture and get a detailed, mechanic-level inspection report.

### 🎤 2. Voice Issue Diagnosis
Enhance the voice assistant to:
- Understand customer complaints through natural speech  
- Detect motorcycle issue keywords from audio  
- Provide hands-free troubleshooting while riding or repairing  
- Support voice notes (upload recorded engine noise, exhaust sound, etc.)

The goal is to let users “talk to their bike mechanic AI” naturally, without typing.

### 🔊 3. Engine Sound Analysis (Audio AI)
A planned feature where users upload a short audio recording of engine noise.  
AI will analyze:
- Knocking  
- Misfiring  
- Tappet noise  
- Exhaust leaks  
- Bearing wear  

This creates an end-to-end smart diagnosis system.

### 📱 4. Full Mobile App Version
Convert the PWA into a full Android/iOS app with:
- Push notifications  
- Offline mode  
- Background sync for bookings  

### 🧑‍🔧 5. Mechanic Avatar with Personality
Introduce an AI mechanic avatar with:
- Animated expressions  
- Voice output (text-to-speech)  
- Step-by-step repair workflows  

---

