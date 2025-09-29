// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Detecta carpeta /public si existe
const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const hasPublic = fs.existsSync(publicDir);
const rootIndex = path.join(rootDir, "index.html");
const publicIndex = path.join(publicDir, "index.html");

// Servir estáticos de /public si existe
if (hasPublic) {
  app.use(express.static(publicDir));
}

// Healthcheck simple
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "BotPedia Chile", env: process.env.NODE_ENV || "production" });
});

// Home: sirve index.html desde /public o desde la raíz
app.get("/", (_req, res) => {
  if (hasPublic && fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  }
  if (fs.existsSync(rootIndex)) {
    return res.sendFile(rootIndex);
  }
  res.type("text").send("BotPedia Chile: servidor activo (no se encontró index.html).");
});

// 404 genérico (opcional)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found", path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`✅ BotPedia Chile servidor escuchando en puerto ${PORT}`);
});
