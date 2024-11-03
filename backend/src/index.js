import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import userRouter from "./routes/userRoute.js";
import { setupWebSocketServer } from "./websocket.js";
import { WebSocketServer } from "ws";

const app = express();

app.use(express.json());
app.use("/api/users", userRouter);

const server = createServer(app);
const wss = new WebSocketServer({ server });
setupWebSocketServer(wss);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
