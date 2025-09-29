import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Sirve tus archivos front-end

// Endpoint para chat
app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Falta la variable OPENAI_API_KEY en el servidor." });
    }

    const { messages, model } = req.body || {};

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "gpt-4o-mini",
        messages: messages || [{ role: "user", content: "Hola" }],
        temperature: 0.6,
      }),
    });

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content || "⚠️ Sin respuesta";
    return res.json({ text, raw: data });
  } catch (e) {
    console.error("Error en /api/chat:", e);
    res.status(500).json({ error: "Error en el servidor", detalle: String(e) });
  }
});

app.listen(PORT, () => console.log(`✅ Servidor escuchando en puerto ${PORT}`));
