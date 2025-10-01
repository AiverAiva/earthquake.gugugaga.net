
# 🌏 Earthquake Visualization Project

A web app that visualizes earthquake data in Taiwan using **Next.js** + **PostgreSQL/PostGIS**.  
It fetches live earthquake catalog data from the Central Weather Administration (CWA) and renders it on an interactive map.  

---

## ✨ Inspiration
- [smc.peering.tw](https://smc.peering.tw/)  
- [water.futa.gg](https://water.futa.gg/)  

This project takes inspiration from those projects’ style of presenting geographic/real-time data.  

---

## 🗺️ Map
- **Component:** adapted from [smc.peering.tw](https://smc.peering.tw/)  
- **Map source:** [exptech.dev](https://exptech.dev/)  

---

## 📊 Data
- **Earthquake data:** [Central Weather Administration (CWA)](https://opendata.cwa.gov.tw/)  

---

## 🎨 Icons
- Dancing cow icon from Giphy: [link](https://giphy.com/stickers/dance-cow-polish-VYpiZGacbgObhovwIF)  

---

## 🚀 Features
- Interactive map showing earthquake epicenters.  
- Data sourced live from CWA’s open data API.  
- PostgreSQL + PostGIS backend for storing and querying quakes.  
- Shadcn UI components + Sonner for UI feedback.  
- Info dialog with GitHub project links.  

---

## 🛠️ Tech Stack
- **Frontend:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)  
- **DB:** [PostgreSQL](https://www.postgresql.org/) + [PostGIS](https://postgis.net/)  
- **Data:** [CWA Open Data](https://opendata.cwa.gov.tw/)  

---

## ⚡ Getting Started

Clone the repository and set up the environment:

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env
# Then open .env and fill in your DB credentials & API keys

# Start dev server
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📂 Environment Variables

Make sure to configure your `.env` file:

```
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
```

---

## 🤝 Contributing

Pull requests and issues are welcome!

---

## 📜 License

This project is MIT licensed.



