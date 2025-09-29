const chatBox = document.querySelector("#chat");
const input = document.querySelector("#mensaje");
const sendBtn = document.querySelector("#enviar");

async function enviarMensaje() {
  const texto = input.value.trim();
  if (!texto) return;

  agregarMensaje("Tú", texto);
  input.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Eres BotPedia Chile, tono educativo en español chileno." },
          { role: "user", content: texto }
        ]
      })
    });

    const data = await res.json();
    agregarMensaje("BotPedia", data.text);
  } catch (e) {
    agregarMensaje("BotPedia", "⚠️ Error de conexión con el servidor.");
    console.error(e);
  }
}

function agregarMensaje(usuario, texto) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${usuario}:</strong> ${texto}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", enviarMensaje);
