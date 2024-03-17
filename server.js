import express from "express";
import authRoute from "./routes/authRoute.js";
import taskRoute from "./routes/tasksRoute.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet"; 
import { authRequired } from "./middleware/validateToken.js";
import cors from "cors";
dotenv.config();

const PORT = process.env.PORT || 4242;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());


app.use("/auth", authRoute);
app.use("/api", authRequired, taskRoute);


app.listen(PORT, () => {
    console.log("[+] Servidor conectado al puerto: " + PORT);
})