let candles = [
  { x: 34, y: 2.5 },
  { x: 34, y: 19.5 },
  { x: 34, y: 37.5 },
  { x: 187.5, y: 4.5 },
  { x: 221.5, y: 7.5 },
  { x: 186.5, y: 23.5 },
  { x: 197.5, y: 40.5 },
  { x: 128.5, y: 12.5 },
  { x: 98.5, y: 3.5 },
  { x: 114.5, y: 3.5 },
  { x: 86.5, y: 7.5 },
  { x: 52.5, y: 29.5 },
  { x: 85.5, y: 40.5 },
  { x: 90.5, y: 50.5 },
  { x: 98.5, y: 58.5 },
  { x: 106.5, y: 63.5 },
  { x: 115.5, y: 67.5 },
  { x: 123.5, y: 75.5 },
  { x: 129.5, y: 79.5 },
  { x: 138.5, y: 12.5 },
  { x: 150.5, y: 5.5 },
  { x: 163.5, y: 2.5 },
  { x: 172.5, y: 11.5 },
  { x: 178.5, y: 26.5 },
  { x: 174.5, y: 48.5 },
  { x: 167.5, y: 59.5 },
  { x: 159.5, y: 70.5 },
  { x: 150.5, y: 79.5 },
  { x: 137.5, y: 88.5 },
  { x: 200, y: 292 }
];

function addCandle(x, y) {
  const cake = document.querySelector(".cake");
  const candle = document.createElement("div");
  candle.className = "candle";
  candle.style.left = x + "px";
  candle.style.top = y + "px";

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

function blowOutCandles() {
  const flames = document.querySelectorAll(".flame:not(.blown-out)");
  flames.forEach((flame) => {
    flame.classList.add("blown-out");
    flame.style.opacity = 0;
  });
  updateCandleCount();
}

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
  }).catch(() => {
    console.warn("Mic permission denied or not available");
  });
}

window.onload = () => {
  for (const candle of candles) {
    addCandle(candle.x, candle.y);
  }
  updateCandleCount();

    // ✅ Activate microphone blowing
  if (window.initBlowDetection) {
    initBlowDetection();
  }
};
