import React, { useRef, useState } from "react";
import { useMediaPipe } from "./useMediaPipe"; // tu hook

const VOWELS = ["A", "E", "I", "O", "U"];

export default function GesturesTrainer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [currentVowel, setCurrentVowel] = useState(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [samples, setSamples] = useState({
    A: [],
    E: [],
    I: [],
    O: [],
    U: []
  });

  const handleLandmarks = (points, vowel) => {
    // Aquí decides cuántos puntos guardar
    setSamples((prev) => ({
      ...prev,
      [vowel]: [...prev[vowel], points]
    }));
  };

  const { isInitialized, error } = useMediaPipe({
    videoRef,
    canvasRef,
    isCollecting,
    currentVowel,
    isModelTrained: false,
    isPredicting: false,
    onLandmarks: handleLandmarks,
    onPredict: null
  });

  const startCollecting = (vowel) => {
    // 🔑 Primero detener lo que hubiera
    setIsCollecting(false);
    setCurrentVowel(null);

    // 🔑 Arrancar con la nueva vocal después de un pequeño delay
    setTimeout(() => {
      setCurrentVowel(vowel);
      setIsCollecting(true);
    }, 100);
  };

  const stopCollecting = () => {
    setIsCollecting(false);
    setCurrentVowel(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Reconocimiento de Vocales</h1>

      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

      <div style={{ display: "flex", gap: "20px" }}>
        <video ref={videoRef} style={{ display: "none" }} />
        <canvas
          ref={canvasRef}
          style={{ border: "1px solid #ccc", borderRadius: "10px" }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        {VOWELS.map((vowel) => (
          <button
            key={vowel}
            onClick={() => startCollecting(vowel)}
            disabled={isCollecting && currentVowel === vowel}
            style={{
              marginRight: 10,
              backgroundColor:
                currentVowel === vowel && isCollecting ? "green" : "#007bff",
              color: "white",
              padding: "10px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {isCollecting && currentVowel === vowel
              ? `Recolectando ${vowel}...`
              : `Recolectar ${vowel}`}
          </button>
        ))}

        <button
          onClick={stopCollecting}
          style={{
            marginLeft: 10,
            backgroundColor: "red",
            color: "white",
            padding: "10px 15px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Detener
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Progreso</h3>
        {VOWELS.map((vowel) => (
          <p key={vowel}>
            {vowel}: {samples[vowel].length} muestras
          </p>
        ))}
      </div>
    </div>
  );
}
