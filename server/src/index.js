import http from "http";
import express from "express";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import { v4 as uuid } from "uuid";

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

const app = express();
const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

const donations = [];

io.on("connection", (socket) => {
  socket.emit("donation:init", donations);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/donations", (_req, res) => {
  res.json(donations);
});

app.post("/api/donations", (req, res) => {
  const { donorCountry, recipientCountry, amount, message } = req.body ?? {};

  if (
    typeof donorCountry !== "string" ||
    typeof recipientCountry !== "string" ||
    donorCountry.trim() === "" ||
    recipientCountry.trim() === ""
  ) {
    return res.status(400).json({
      error: "donorCountry and recipientCountry are required string fields.",
    });
  }

  const donation = {
    id: uuid(),
    donorCountry: donorCountry.trim(),
    recipientCountry: recipientCountry.trim(),
    amount: typeof amount === "number" ? amount : null,
    message: typeof message === "string" && message.trim() ? message.trim() : null,
    createdAt: new Date().toISOString(),
  };

  donations.push(donation);
  io.emit("donation:new", donation);

  res.status(201).json(donation);
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
