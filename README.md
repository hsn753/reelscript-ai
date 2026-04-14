# ReelScript AI

AI-powered Instagram Reel script writer. Analyze any public creator's reels, extract their style, and generate new scripts in their voice.

## Stack
- **Frontend**: React + Vite + TailwindCSS → Vercel
- **Backend**: Node.js + Express → Staging server

## Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your keys
npm run dev            # runs on :3001
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:3001
npm run dev            # runs on :5173
```

## Environment Variables

### Backend (`backend/.env`)
```
OPENAI_API_KEY=...
APIFY_API_TOKEN=...
PORT=3001
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=https://your-backend-url.com
```

## Deployment

### Backend (Hassan's staging server)
```bash
cd backend
npm install --production
node server.js
# or with PM2:
pm2 start server.js --name reelscript-api
```

### Frontend (Vercel)
1. Push to GitHub
2. Import repo in Vercel
3. Set root directory to `frontend`
4. Add env var: `VITE_API_URL=https://your-backend-url.com`
5. Deploy

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /analyze | Scrape & analyze reels |
| POST | /generate | Generate a new script |

### POST /analyze
```json
{ "username": "garyvee", "maxReels": 30 }
```

### POST /generate
```json
{ "styleAnalysis": {...}, "topic": "why consistency beats talent", "additionalInstructions": "under 60 seconds" }
```
