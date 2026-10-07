// Micrófono del navegador (Web Speech API). Escribe lo que la persona dice.

let active = null;

function recognitionConstructor() {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function stopDictation() {
  if (!active) return;
  active.onend = null;
  active.onerror = null;
  active.onresult = null;
  try {
    active.stop();
  } catch {
    // The browser had already stopped.
  }
  active = null;
}

export function startDictation({ base, onText, onEnd, onError }) {
  stopDictation();
  const Recognition = recognitionConstructor();
  if (!Recognition) {
    onError("Microphone is not available in this browser. Type in the box.");
    return false;
  }

  const recognition = new Recognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;
  active = recognition;

  recognition.onresult = (event) => {
    let finalText = "";
    let interim = "";
    for (let index = 0; index < event.results.length; index += 1) {
      const transcript = event.results[index][0].transcript;
      if (event.results[index].isFinal) finalText += transcript;
      else interim += transcript;
    }
    const spoken = `${finalText}${interim}`.replace(/\s+/g, " ").trim();
    if (!spoken) return;
    const prefix = base.trim() ? `${base.trimEnd()} ` : "";
    onText(`${prefix}${spoken}`);
  };

  recognition.onerror = (event) => {
    if (event.error === "aborted" || event.error === "no-speech") return;
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      onError("Allow the microphone to dictate.");
      return;
    }
    onError("Microphone is not available in this browser. Type in the box.");
  };

  recognition.onend = () => {
    if (active === recognition) active = null;
    onEnd();
  };

  try {
    recognition.start();
  } catch {
    active = null;
    onError("Microphone is not available in this browser. Type in the box.");
    return false;
  }

  return true;
}
