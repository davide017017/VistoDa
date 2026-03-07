# 🎬 VistoDa

> Track movies and series you've watched — minimal, fast, clean.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-vistoda.netlify.app-00C7B7?style=for-the-badge&logo=netlify)](https://vistoda.netlify.app/)

---

## Stack

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-D71F00)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JS-ESModules-F7DF1E?logo=javascript&logoColor=black)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify&logoColor=white)

---

## Features

- 🔐 JWT Authentication
- 👀 Demo read-only mode — try it instantly, no signup
- 🧩 Modular frontend (Vanilla JS + ES Modules)
- ⚙️ Environment-based config
- 🌐 Production-ready CORS

---

<!-- Screenshot preview — replace with actual image path after upload -->

![Preview](./screenshot.png)

---

## Try the Demo

👉 **[https://vistoda.netlify.app/](https://vistoda.netlify.app/)**

Use the **Demo** login on the homepage — no account needed.

---

## Local Development

```bash
# Backend
uvicorn app.main:app --reload

# Frontend
# Open with Live Server (VSCode)
```

---

## Project Structure

```

├── app/          # FastAPI backend
│   ├── main.py
│   ├── models/
│   ├── routes/
│   └── auth/
└── frontend/     # Vanilla JS frontend
    ├── index.html
    ├── js/
    └── css/
```
