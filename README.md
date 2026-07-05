#  PahadiStay AI

> *Connecting travellers with authentic Uttarakhand homestays — powered by AI.*

PahadiStay AI is a full-stack web platform that helps travellers discover and book verified homestays across Uttarakhand, while giving local homestay owners a commission-free digital presence and AI-driven business insights.

Built as part of **TBI-GEU SIP 2026** | Author: **Sonali Upadhyay**

---

##  What This Platform Does

Most Uttarakhand homestays are hidden behind high-commission OTAs. PahadiStay AI changes that — travellers get personalised itineraries and direct access to local hosts, while owners keep 100% of their earnings and gain AI-powered review analytics to grow their business.

---

##  Core Modules

| Module | Description |
|---|---|
| 🏡 **Homestay Discovery** | Browse and filter verified Pahadi homestays by location, budget, and travel type |
| 🗺️ **AI Trip Planner** | Generate day-wise personalised itineraries using the Gemini API |
| 🤖 **AI Recommender** | Preference-based homestay matching with natural-language explanations |
| 📅 **Direct Booking** | Commission-free inquiry system via email and WhatsApp |
| 💬 **Travel Chatbot** | Conversational assistant for Uttarakhand travel queries |
| ⭐ **Review System** | Verified guest reviews with multi-dimensional ratings |
| 📊 **AI Review Analyzer** | Sentiment analysis, theme detection, and suggested owner replies |
| 📈 **Owner Dashboard** | Booking trends, occupancy data, and AI-generated performance summaries |

---

## 🛠️ Tech Stack

```
Frontend     →  React.js + Tailwind CSS + Axios + React Router
Backend      →  Node.js + Express.js
Database     →  MongoDB Atlas
AI           →  Google Gemini API
```

---

## 📁 Project Structure

```
pahadistay-ai/
│
├── client/                         # React.js Frontend
│   ├── public/
│   │   └── assets/                 # Static images, icons, brand assets
│   │
│   └── src/
│       ├── components/
│       │   ├── ui/                 # Reusable UI primitives (Button, Card, etc.)
│       │   ├── layout/             # Navbar, Footer, Sidebar
│       │   ├── homestay/           # HomestayCard, FilterPanel, Gallery
│       │   ├── planner/            # PlannerForm, ItineraryCard, DayCard
│       │   ├── chatbot/            # ChatWidget, MessageThread, TypingIndicator
│       │   ├── booking/            # BookingForm, AvailabilityCalendar
│       │   ├── review/             # ReviewForm, ReviewCard, RatingStars
│       │   └── dashboard/          # StatsCard, BookingTable, Charts
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Homestays.jsx       # Listing grid
│       │   ├── HomestayDetail.jsx  # Single property page
│       │   ├── Planner.jsx         # AI Trip Planner
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── dashboard/
│       │       ├── Overview.jsx
│       │       ├── Bookings.jsx
│       │       ├── Reviews.jsx
│       │       └── Analytics.jsx
│       │
│       ├── hooks/                  # Custom React hooks
│       │   ├── useAuth.js
│       │   ├── useHomestays.js
│       │   └── useBooking.js
│       │
│       ├── context/                # React Context (Auth, Chat state)
│       │   ├── AuthContext.jsx
│       │   └── ChatContext.jsx
│       │
│       ├── services/               # Axios API call functions
│       │   ├── api.js              # Axios instance + interceptors
│       │   ├── homestayService.js
│       │   ├── bookingService.js
│       │   ├── reviewService.js
│       │   └── aiService.js
│       │
│       ├── utils/                  # Shared utility functions
│       │   └── helpers.js
│       │
│       ├── styles/
│       │   └── index.css           # Tailwind base + custom tokens
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── server/                         # Node.js + Express.js Backend
│   ├── config/
│   │   ├── db.js                   # MongoDB Atlas connection
│   │   └── gemini.js               # Gemini API client setup
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── homestayController.js
│   │   ├── bookingController.js
│   │   ├── reviewController.js
│   │   ├── plannerController.js    # AI trip planner logic
│   │   ├── chatController.js       # Chatbot + streaming
│   │   └── dashboardController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── homestayRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── plannerRoutes.js
│   │   ├── chatRoutes.js
│   │   └── dashboardRoutes.js
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js
│   │   ├── Homestay.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   └── Review.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── roleMiddleware.js       # Owner / Traveller / Admin roles
│   │   └── errorHandler.js
│   │
│   ├── services/
│   │   ├── geminiService.js        # All Gemini API calls
│   │   ├── mailService.js          # Nodemailer / Brevo SMTP
│   │   ├── reviewAnalysisService.js
│   │   └── recommendationService.js
│   │
│   ├── prompts/                    # Gemini prompt templates
│   │   ├── tripPlannerPrompt.js
│   │   ├── recommendationPrompt.js
│   │   ├── reviewAnalysisPrompt.js
│   │   └── monthlySummaryPrompt.js
│   │
│   ├── utils/
│   │   └── helpers.js
│   │
│   ├── .env                        # Environment variables (gitignored)
│   └── index.js                    # Express app entry point
├── .gitignore
├── README.md
└── package.json                    # Root-level scripts (optional monorepo)
```

---

## 🚀 Getting Started

> Full setup instructions will be added once initial scaffolding is complete.

```bash
# Clone the repository
git clone https://github.com/your-username/pahadistay-ai.git
cd pahadistay-ai

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

Create a `.env` file in `/server` with the following keys:

```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
SMTP_HOST=smtp.brevo.com
SMTP_USER=your_brevo_user
SMTP_PASS=your_brevo_password
```

---
## ⚡ How to Run Backend Locally (Week 5)

The backend uses **Node.js + Express + Mongoose**. It runs against **MongoDB Atlas** when `MONGO_URI` is set, and automatically falls back to in-memory data when it's not — so the app never hard-crashes if the DB is unreachable.

### Prerequisites
- Node.js v18+
- npm v9+
- A free MongoDB Atlas cluster (see below)

### Steps

```bash
# 1. Navigate to the server directory
cd server

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Paste your MongoDB Atlas connection string into MONGO_URI

# 4. (First time only) Seed the database from the Kaggle dataset
npm run import:kaggle

# 5. Start the dev server (with auto-reload)
npm run dev

# Or start without nodemon:
npm start
```

The API will be available at **http://localhost:5000**

---
## 🗄️ Database (Week 5)

### Why MongoDB (via Mongoose + Atlas)

PahadiStay AI's core data — homestays, reviews, bookings, users — is document-shaped rather than strictly relational: homestays have a variable number of amenities/images, reviews have an optional nested `dimensions` object, and none of the entities need multi-table joins. MongoDB's flexible schema fits this better than forcing it into rigid relational tables, and MongoDB Atlas's free M0 tier is enough for a project of this size.

### Schema / Data Model

Four collections, modeled with Mongoose schemas in `server/models/`:

| Collection | Key fields | Relationships |
|---|---|---|
| **User** | name, email (unique), passwordHash, role (`traveller`/`owner`/`admin`), phone | referenced by `Homestay.owner` |
| **Homestay** | name, village, district, pricePerNight, propertyType, category, amenities[], averageRating, owner | 1 User → many Homestays; 1 Homestay → many Reviews/Bookings |
| **Review** | homestayId, guestName, rating (1-5), comment, date, dimensions{} | belongs to 1 Homestay |
| **Booking** | homestayId, guestName/Email/Phone, checkIn/checkOut, nights, totalAmount, status | belongs to 1 Homestay |

Full diagram: [`W5_SchemaDiagram_[InternID].pdf`](./W5_SchemaDiagram_InternID.pdf)

![Schema Diagram](./docs/schema-diagram.png)

### Set Up the Database

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) and create a free account.
2. Create a new project → build a free **M0** cluster.
3. Under **Database Access**, add a database user with a username/password.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) so it works from both your machine and Render.
5. Click **Connect → Drivers**, copy the connection string, and replace `<password>` with your database user's password.
6. Paste it into `server/.env` as `MONGO_URI=...` (locally) and into Render's environment variables (for production).

### Importing Data

`npm run import:kaggle` (from `/server`) clears the `Homestay` and `Review` collections and re-imports them from `server/data/Uttarakhand_HomeStay_Reviews.csv` — the Kaggle "Uttarakhand HomeStay Reviews" dataset (3,500 reviews across 15 homestays). See `server/scripts/importKaggleReviews.js` for the full transform logic and the assumptions it makes about fields the raw dataset doesn't provide.

`npm run seed` still works and seeds the original 8 hand-written demo homestays from `server/data/seed.js`, if you ever want to reset to that smaller dataset instead.

---


### Available Endpoints (Week 4)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/homestays` | List all homestays (filter by `district`, `type`, `minPrice`, `maxPrice`) |
| GET | `/api/homestays/search?q=` | Full-text search |
| GET | `/api/homestays/:id` | Single homestay with reviews |
| POST | `/api/homestays` | Create new listing |
| PUT | `/api/homestays/:id` | Update listing |
| DELETE | `/api/homestays/:id` | Delete listing |
| GET | `/api/homestays/:id/reviews` | Get reviews for a homestay |
| POST | `/api/homestays/:id/reviews` | Add a review |
| GET | `/api/bookings` | List all bookings |
| POST | `/api/bookings` | Create booking enquiry |
| GET | `/api/stats` | Platform-level stats |

### Running the Frontend

```bash
# In a separate terminal
cd client
npm install
npm run dev
```

Frontend: **http://localhost:5173** (proxies `/api` calls to port 5000 automatically)

### API Testing (Postman)

Import `W4_APICollection_SIP2026.json` into Postman or Thunder Client. Set the `base_url` variable to `http://localhost:5000/api`. All 11 endpoints have saved example responses.

---

## 🗺️ Development Roadmap

- **Phase 1 — MVP** (Weeks 1–3): Auth, Homestay Discovery, Basic Booking, Owner Dashboard
- **Phase 2 — AI Features** (Weeks 4–6): Trip Planner, Recommender, Chatbot, Reviews
- **Phase 3 — Intelligence Layer** (Weeks 7–9): Review Analyzer, Analytics Dashboard, Monthly AI Summaries

---

## 📄 License

This project is developed as part of the TBI-GEU Summer Internship Programme 2026. Academic use only.

---

<p align="center">Made with ☕ and love for the mountains 🏔️</p>
