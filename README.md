# 💬 SnapChat - Real-Time Chat Application

![Chat App UI](https://res.cloudinary.com/dw00x1zos/image/upload/v1754138151/Screenshot_2025-08-02_175548_r08ji2.png)

![Chat App UI](https://res.cloudinary.com/dw00x1zos/image/upload/v1754138125/Screenshot_2025-08-02_175501_jxnscf.png)

![Chat App UI](https://res.cloudinary.com/dw00x1zos/image/upload/v1754138157/Screenshot_2025-08-02_175713_dp9rpk.png)

<sub>*(Replace the above image path with your actual screenshot)*</sub>

---

## ✨ Features

- 🔐 Secure user authentication using JWT
- 💬 Real-time messaging powered by **Socket.IO**
- 👫 One-to-one chat support
- 🖼️ Image sharing support (optional)
- ⌨️ online status tracking
- 📱 Responsive user interface built with **React + Tailwind CSS**
- 🤯 Provided multiple themes 
---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** folder and add the following:

## 🔐 Environment Variables

You will need to set up the following **`.env`** files:

### 📦 Backend `.env`

```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=development
```

# Backend setup
```
cd ../backend
npm install
```

# Frontend setup
```
cd ../frontend
npm install
```

# ▶️ Run the Project
### in the root folder
```
npm run dev
```
### Start Frontend (in a new terminal)
```
cd frontend
npm run dev
```