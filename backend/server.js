import express from "express";
import dotenv from "dotenv";
import createRagRoutes from "./routes/createRag.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import getAllBotsRoutes from "./routes/getAllBots.routes.js";
import morgan from "morgan";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();
dotenv.config();

app.use(clerkMiddleware());
// Middleware to parse JSON data from requests
app.use(express.json());

// ✅ Allow requests from your frontend (Vite)
const allowedOrigins = [
  "https://rags-bot.vercel.app", // Your actual Vercel deployment
  "http://localhost:5173", // Local development 
];

// Add any additional origins from environment variables
if (process.env.ALLOWED_ORIGINS) {
  allowedOrigins.push(...process.env.ALLOWED_ORIGINS.split(","));
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if the origin is in our allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // optional, if you use cookies/auth
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(morgan("dev"));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/create-rag", createRagRoutes);

app.use("/chat", chatRoutes);

app.use("/get-all-bots", getAllBotsRoutes);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});