import express from "express";
import mongoDB from "./config/db.js";
import cors from 'cors'
import authRoutes from "./routes/auth.route.js";
import userRoutes from './routes/user.route.js'
import chatRoutes from './routes/chat.route.js'
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);


app.get("/", (req, res) => {
  console.log("✅ Test route hit!");
  res.send("✅ Server is running");
});

const startServer = async () => {
  try {
    await mongoDB(); // ✅ Connect DB once here
    app.listen(PORT, () => {
      console.log(`✅ Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();
