let candles = [
  { x: 37, y: 164 },
  { x: 46, y: 155 },
  { x: 58, y: 145 },
  { x: 68, y: 139 },
  { x: 80, y: 134 },
  { x: 92, y: 130 },
  { x: 105, y: 125 },
  { x: 120, y: 120 },
  { x: 130, y: 120 },
  { x: 145, y: 123 },
  { x: 160, y: 128 },
  { x: 173, y: 132 },
  { x: 187, y: 139 },
  { x: 199, y: 145 },
  { x: 210, y: 153 },
  { x: 222, y: 161 },
  { x: 232, y: 170 },
  { x: 241, y: 179 },
  { x: 250, y: 190 },
  { x: 255, y: 202 },
  { x: 260, y: 215 },
  { x: 262, y: 228 },
  { x: 262, y: 240 },
  { x: 259, y: 252 },
  { x: 254, y: 263 },
  { x: 246, y: 273 },
  { x: 236, y: 280 },
  { x: 225, y: 285 },
  { x: 213, y: 289 },
  { x: 200, y: 292 }
];

function addCandle(x, y) {
  const cake = document.querySelector(".cake");
  const candle = document.createElement("div");
  candle.className = "candle";
  candle.style.left = `${x}px`;
  candle.style.top = `${y}px`;

  const flame = document.createElement("div");
  flame.className = "flame";

  const wick = document.createElement("div");
  wick.className = "wick";

  candle.appendChild(flame);
  candle.appendChild(wick);
  cake.appendChild(candle);
}

function updateCandleCount() {
  const counter = document.getElementById("candleCount");
  const flames = document.querySelectorAll(".flame:not(.blown-out)");
  counter.textContent = flames.length;
}

window.onload = () => {
  for (const candle of candles) {
    addCandle(candle.x, candle.y);
  }
  updateCandleCount();

  // Re-enable microphone blowing detection if defined
  if (typeof initBlowDetection === "function") {
    initBlowDetection();
  }
};

function initBlowDetection() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    microphone.connect(analyser);
    analyser.fftSize = 256;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);
      let values = 0;
      for (const val of dataArray) {
        values += val;
      }
      const average = values / dataArray.length;

      if (average > 50) {
        blowOutCandles();
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();
  });
}

function blowOutCandles() {
  const flames = document.querySelectorAll(".flame:not(.blown-out)");
  flames.forEach((flame) => {
    flame.classList.add("blown-out");
    flame.style.opacity = 0;
  });
  updateCandleCount();
}
