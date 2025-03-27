import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import {app,server} from "./lib/socket.js"

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()

// Middleware
app.use(express.json({ limit: "50mb" })); // ✅ Increased payload limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // ✅ Increased URL-encoded data limit
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname, "../frontend","dist","index.html"))
    })
}

// Connect to MongoDB FIRST before starting the server
const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
