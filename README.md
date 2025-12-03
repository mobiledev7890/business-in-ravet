# Business in Ravet

A full-stack app for discovering local businesses in Ravet, Pune.

- **Frontend**: React Native app (Expo) in `frontend/`
- **Backend**: Node.js/Express API with Prisma + PostgreSQL in `backend/`
- **Monorepo tooling**: Nx for running and organizing both apps

## 🚀 Features

- **Business Categories**: Browse businesses by category (Grocery, Salons, Hardware, Restaurants)
- **Business List & Details**: View stored businesses and their details
- **Cached Data**: Backend fetches from Google Places and stores in PostgreSQL
- **Contact & Directions**: Call businesses and open locations in Google Maps
- **Cross-Platform**: Frontend works on iOS, Android, and Web via Expo

## 🛠️ Tech Stack

- **Frontend**
  - React Native with Expo (in `frontend/`)
  - React Navigation
  - FontAwesome icons
  - Custom hooks for state management
- **Backend**
  - Node.js + Express
  - Prisma ORM
  - PostgreSQL (EDB instance)
  - `node-cron` for daily sync from Google Places
- **Tooling**
  - Nx monorepo (`nx.json`, `project.json`)
  - npm

## 📱 Screenshots

*Add screenshots here when available*

## 🏗️ High-Level Architecture

- **Backend flow**
  - `/categories` → serves the configured list of categories.
  - `/businesses?categoryId=...` → returns businesses from PostgreSQL.
  - `/businesses/refresh` (POST) → calls Google Places for each category, upserts data into DB.
  - A cron job runs `refreshBusinessesFromExternalApi` daily at 3 AM.
- **Frontend flow**
  - Loads categories from backend (with a small local fallback).
  - For a selected category, calls backend `/businesses` instead of Google directly.
  - Renders cards and detail views using cached data from your DB.

## 🚀 Getting Started (Monorepo)

### Prerequisites

- Node.js (v18+ recommended)
- npm
- Expo CLI (installed globally or via `npx`)
- PostgreSQL database (EDB or local)
- Google Places API key

### 1. Clone and install

```bash
git clone https://github.com/yourusername/business-in-ravet.git
cd business-in-ravet
npm install
```

Nx and all workspace dependencies are installed from the root.

### 2. Backend environment

Create `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/business_in_ravet?sslmode=require"
GOOGLE_PLACES_API_KEY=your_google_places_key
PORT=4000
```

Ensure your Postgres database exists and is reachable with that URL.

Run Prisma migrations and generate the client:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

Seed/sync businesses from Google Places into the DB (optional, can also be done via the HTTP endpoint):

```bash
cd backend
npx prisma db seed    # or POST /businesses/refresh from a client like Postman
```

### 3. Start backend via Nx

From the repo root:

```bash
npx nx start backend
```

Then test:

- `http://localhost:4000/health`
- `http://localhost:4000/categories`
- `http://localhost:4000/businesses`

### 4. Frontend environment

Create `frontend/.env` if you still use any frontend-only env vars (Google API is now used on the backend).

Install any frontend-specific tools (already covered by root `npm install`).

### 5. Start frontend via Nx

From the repo root:

```bash
npx nx start frontend
```

Expo will start using the code in `frontend/`:

- Web: press `w` or open the printed URL.
- iOS: press `i`.
- Android: press `a`.

### Getting a Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API** service
4. Create an API key in the Credentials section
5. Add the API key to your `.env` file

## 📁 Project Structure

```text
.
├── backend/
│   ├── index.js                # Express API + cron + routes
│   ├── categoriesConfig.js     # Category definitions used for sync + API
│   ├── placesService.js        # Google Places fetch helper
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma models (Category, Business)
│   │   └── seed.js             # Optional DB seed from Google Places
│   └── project.json            # Nx project config for backend
├── frontend/
│   ├── App.js
│   ├── app.json
│   ├── babel.config.js
│   ├── index.js
│   ├── assets/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── navigation/
│       └── screens/
├── nx.json                     # Nx workspace config
├── project.json                # Nx project config for frontend
├── package.json                # Workspace root dependencies
└── eas.json                    # Expo EAS configuration
```

## 🔧 Development

### Running the apps

- **Backend**: `npx nx start backend`
- **Frontend (Expo)**: `npx nx start frontend`

From the Expo terminal:

- Web: press `w` or open the provided URL.
- iOS Simulator: press `i`.
- Android Emulator: press `a`.
- Physical Device: scan the QR code with Expo Go.

### Useful Nx commands

- `npx nx graph` – visualize projects and dependencies.
- `npx nx run backend:prisma:migrate` – run migrations.
- `npx nx run backend:prisma:seed` – seed data.

## 🎯 Features in Detail

### Business Search
- Search businesses by category in Ravet, Pune.
- Data is fetched from the backend, which periodically syncs from Google Places.

### Business Details
- Complete business information
- Photos and reviews
- Opening hours
- Contact information
- Direct integration with phone and maps

### User Experience
- Clean, modern UI design
- Smooth navigation
- Loading states and error handling
- Retry functionality for failed requests

## 🔒 Security

- API keys and DB URLs are stored in environment variables (`backend/.env`)
- `.env` is excluded from version control
- Frontend never talks directly to Google Places; only backend uses the API key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Places API for business data
- Expo team for the amazing development platform
- React Native community for excellent documentation

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Built with ❤️ for the Ravet community**
