# 🚀 LeadMind AI

## 🤖 AI-Powered Lead & Sales Intelligence Platform

LeadMind AI is a full-stack CRM application designed to help sales teams manage leads, track the sales pipeline, analyze sales performance, and use Generative AI for lead intelligence and follow-up assistance.

---

## ✨ Features

### 🔐 Authentication & Authorization

- 👤 User Signup & Login
- 🔢 OTP Verification
- 🔑 JWT-based Authentication
- 🛡️ Role-Based Access Control
- 👑 Admin & Sales Executive Roles

### 👥 Lead Management

- ➕ Create Leads
- 👀 View Leads
- ✏️ Update Leads
- 🗑️ Delete Leads
- 🔎 Search & Filtering
- ↕️ Sorting
- 📄 Pagination

### 📊 Kanban Sales Pipeline

Leads move through the following sales stages:

**🆕 New → 📞 Contacted → 💡 Interested → 🤝 Negotiation → 🏆 Won / ❌ Lost**

### 🤖 Generative AI

- 🎯 AI-powered Lead Scoring
- 🚦 AI Priority Classification
- 💡 AI-generated Lead Insights
- 🧭 AI Next-Best-Action Suggestions
- ✉️ AI-generated Follow-up Messages
- 🧠 Local LLM Integration using Ollama

### 📈 Analytics

- 👥 Total Leads
- 🏆 Won Leads
- 📊 Conversion Rate
- 💰 Revenue
- 📌 Pipeline Statistics
- 📋 Dashboard Analytics

### 🛡️ Security

- 🔒 Helmet
- 🔑 JWT Authentication
- 👮 Role-Based Authorization
- 🚦 Rate Limiting
- ✅ Request Validation
- ⚠️ Centralized Error Handling

---

## 🧰 Tech Stack

### 🎨 Frontend

- React.js
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

### ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Ollama

---

## 🏗️ Application Architecture

The application follows a layered full-stack architecture:

**React Frontend**  
↓  
**Axios**  
↓  
**Express REST API**  
↓  
**Authentication & Authorization Middleware**  
↓  
**Controllers**  
↓  
**Services / Models**  
↓  
**MongoDB**

### 🤖 AI Flow

**Lead Data**  
↓  
**AI Controller**  
↓  
**AI Service**  
↓  
**Ollama / LLM**  
↓  
**AI Analysis / Generated Content**  
↓  
**API Response / Lead Data**

---

## 📁 Project Structure

- 📂 `Backend/`
  - `controllers/`
  - `models/`
  - `routes/`
  - `services/`
  - `middileware/`
  - `app.js`
  - `server.js`
  - `package.json`
  - `.gitignore`

- 📂 `Frontend/`
  - `src/`
  - `public/`
  - `package.json`

- 📂 `screenshots/`

- 📄 `README.md`

---

## 🧠 Generative AI Integration

LeadMind AI uses a Large Language Model through Ollama for AI-powered lead intelligence.

The AI service processes relevant lead information to provide:

- 🎯 Lead Score
- 🚦 Lead Priority
- 💡 Lead Insights & Reasoning
- 🧭 Next Best Action
- ✉️ Follow-up Content

The AI logic is separated into an AI service layer so that the LLM infrastructure can be changed later without restructuring the complete application.

### ⚠️ Production Note

The current AI setup uses **Ollama for local LLM inference**.

For production deployment, Ollama and the selected model would need to run on suitable server infrastructure, or the AI service can be configured to use a hosted LLM/API provider.

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone <your-github-repository-url>
cd LeadMind-AI
```

### 2️⃣ Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` folder.

Example environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add the remaining environment variables required by your local configuration.

### 3️⃣ Frontend Setup

```bash
cd Frontend
npm install
```

Start the frontend using the configured development command.

---

## 🖼️ Screenshots

### 👥 Leads and 🗂️ Kanban Pipeline

<img width="1325" height="706" alt="leads" src="https://github.com/user-attachments/assets/cf83e646-256c-4f8d-a9b1-0a4c72b8b2f4" />


### 📊 Statusboard
With Drag and Drop Feature

<img width="1366" height="712" alt="Status Board" src="https://github.com/user-attachments/assets/10d53a32-0de0-4730-a669-3be69688337c" />

### 📈 Analytics
<img width="1347" height="723" alt="Analytics" src="https://github.com/user-attachments/assets/93a24504-b810-48d3-b721-c2dff88f5e93" />


### ✅ Core Application Implemented

- ✅ Frontend and Backend integrated
- ✅ Authentication & Authorization
- ✅ Lead Management
- ✅ Kanban Sales Pipeline
- ✅ Search, Filter, Sort & Pagination
- ✅ Analytics APIs
- ✅ Generative AI Integration
- ✅ Local Ollama-based LLM Integration
- ✅ Backend Security & Error Handling

### 🔮 Future Deployment

The application can be adapted for production by using suitable LLM hosting infrastructure or a hosted AI provider.

---

## 💡 What I Learned

Through this project, I worked with:

- REST API Architecture
- Authentication & Authorization
- Role-Based Access Control
- MongoDB & Mongoose Data Modeling
- React & REST API Integration
- Redux State Management
- AI / LLM Integration
- Generative AI Workflows
- Backend Security
- Error Handling
- MongoDB Aggregation for Analytics

---

## 👩‍💻 Author

**LeadMind AI**

Built as a Full-Stack Generative AI CRM Project.

---

⭐ If you found this project interesting, consider giving it a star!
