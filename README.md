

🚀 LeadMind AI

🤖 AI-Powered Lead & Sales Intelligence Platform

A full-stack CRM application with Generative AI for smarter lead management and sales intelligence.

<br/>








</div>

✨ Overview

LeadMind AI is a full-stack CRM application designed to help sales teams manage leads, track the sales pipeline, analyze sales performance, and use Generative AI for lead intelligence and follow-up assistance.

The project combines a React frontend, Node.js/Express REST API, MongoDB, and a local LLM powered by Ollama.

🌟 Key Features

🔐 Authentication & Authorization

👤 User signup and login

🔢 OTP verification

🔑 JWT-based authentication

🛡️ Role-based access control

👑 Admin and Sales Executive roles

👥 Lead Management

➕ Create leads

👀 View individual and all leads

✏️ Update leads

🗑️ Delete leads

🔎 Search leads

🎯 Filter by status

↕️ Sort leads

📄 Pagination

📊 Kanban Sales Pipeline

Track leads through a visual sales journey:

🆕 New
  ↓
📞 Contacted
  ↓
💡 Interested
  ↓
🤝 Negotiation
  ↓
🏆 Won / ❌ Lost

🤖 Generative AI

LeadMind AI uses an LLM to provide:

🎯 AI-powered lead scoring

🚦 AI priority classification

💡 AI-generated lead insights

🧭 AI next-best-action suggestions

✉️ AI-generated follow-up messages

🧠 Local LLM integration using Ollama

📈 Analytics

👥 Total leads

🏆 Won leads

📊 Conversion rate

💰 Revenue

📌 Pipeline statistics

📋 Dashboard analytics

🛡️ Security

Helmet

JWT authentication

Role-based authorization

Rate limiting

Request validation

Centralized error handling

🧰 Tech Stack

🎨 Frontend

React.js

Redux Toolkit

React Router

Axios

Tailwind CSS

⚙️ Backend

Node.js

Express.js

MongoDB

Mongoose

JWT

bcrypt

Ollama

🏗️ Application Architecture

                    ┌──────────────────┐
                    │  React Frontend  │
                    └────────┬─────────┘
                             │
                           Axios
                             ↓
                    ┌──────────────────┐
                    │ Express REST API │
                    └────────┬─────────┘
                             │
                  Authentication / RBAC
                             ↓
                    ┌──────────────────┐
                    │   Controllers    │
                    └────────┬─────────┘
                             │
                    Services / Models
                       ↙           ↘
                      ↓             ↓
                MongoDB        AI Service
                                  ↓
                              Ollama / LLM

📁 Project Structure

LeadMind-AI/
│
├── 📂 Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middileware/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── 📂 Frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── 📂 screenshots/
│
└── 📄 README.md

🧠 AI Integration

The AI workflow follows:

Lead Data
    ↓
AI Controller
    ↓
AI Service
    ↓
Ollama / LLM
    ↓
AI Analysis / Generated Content
    ↓
API Response / Lead Data

The AI service receives relevant lead information and uses the LLM to generate or determine:

Lead score

Priority

Insights/reasoning

Next best action

Follow-up content

The AI logic is kept in a separate service layer, making it easier to change the LLM infrastructure later.

⚠️ Production Note

The current AI setup uses Ollama for local LLM inference.

For production deployment, Ollama and the selected model would need to run on suitable server infrastructure, or the AI service can be configured to use a hosted LLM/API provider.

🚀 Getting Started

1️⃣ Clone the repository

git clone <your-github-repository-url>
cd LeadMind-AI

2️⃣ Backend Setup

cd Backend
npm install

Create a .env file inside the Backend folder.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Add the remaining environment variables required by your local configuration.

3️⃣ Frontend Setup

cd Frontend
npm install

Start the frontend using the project's configured development command.

Frontend and backend integrated

Authentication and authorization implemented

Lead management implemented

Kanban pipeline implemented

Analytics implemented

Generative AI features integrated

Local Ollama-based LLM inference configured

🔮 Future Deployment

The application can be adapted for production by using suitable LLM hosting infrastructure or a hosted AI provider.

💡 What I Learned

Through this project, I worked with:

REST API architecture

Authentication and authorization

Role-based access control

MongoDB/Mongoose data modeling

API integration with React

Redux state management

AI/LLM integration

Prompt-based Generative AI workflows

Backend security and error handling

Analytics using MongoDB aggregation

👩‍💻 Author

LeadMind AI

Built as a Full-Stack Generative AI CRM project.

<div align="center">

⭐ If you found this project interesting, consider giving it a star!

Built with ❤️ and AI

</div>
