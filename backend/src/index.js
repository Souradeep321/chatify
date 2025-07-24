import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/connection.js';
import { app, server } from './lib/socket.js';
import path from "path";
import { fileURLToPath } from 'url';


dotenv.config({
    path: './.env',
    quiet: true
});

const port = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
console.log(__filename);
console.log(process.env.NODE_ENV);



app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
);
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";


// middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/messages", messageRoutes);

app.use((err, req, res, next) => {
    console.error("Error middleware caught:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});


    app.use(express.static(path.join(__dirname, "../../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
    });



connectDB()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server running on port http://localhost:${port}`);
        });
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    });
