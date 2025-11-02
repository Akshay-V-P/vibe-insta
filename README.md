# Vibe Insta — Express + HBS + MongoDB Scaffold

This scaffold gives you a starting point for building an Instagram-like app using:
- Express
- Handlebars (HBS)
- MongoDB / Mongoose (Atlas-ready)
- Tailwind (placeholder css file included)
- Multer for image uploads

How to run

1. Copy `.env.example` to `.env` and fill `MONGO_URI` with your Atlas connection string.
2. Install dependencies:

```powershell
cd "C:\Users\aksha\Desktop\vibe-insta"
npm install
```

3. Start the app:

```powershell
npm run dev
```

Notes
- Tailwind needs to be built (via PostCSS or CDN). The scaffold includes a `public/css/tailwind.css` placeholder.
- Add your static uploads and configure Multer storage when ready.
