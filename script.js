document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [
  { x: 194.5, y: 19.5 },
  { x: 197.5, y: 39.5 },
  { x: 205.5, y: 47.5 },
  { x: 28.5, y: 21.5 },
  { x: 28.5, y: 38.5 },
  { x: 110, y: 50 },
  { x: 26.5, y: 47.5 },
  { x: 191.5, y: 27.5 },
  { x: 227.5, y: 11.5 },
  { x: 222.5, y: 28.5 },
  { x: 215.5, y: 43.5 },
  { x: 114.5, y: 18.5 },
  { x: 100.5, y: 3.5 },
  { x: 82.5, y: 2.5 },
  { x: 65.5, y: 10.5 },
  { x: 64.5, y: 41.5 },
  { x: 78.5, y: 64.5 },
  { x: 94.5, y: 77.5 },
  { x: 112.5, y: 90.5 },
  { x: 129.5, y: 21.5 },
  { x: 139.5, y: 5.5 },
  { x: 155.5, y: 4.5 },
  { x: 168.5, y: 10.5 },
  { x: 168.5, y: 38.5 },
  { x: 156.5, y: 62.5 },
  { x: 146.5, y: 76.5 },
  { x: 133.5, y: 88.5 },
  { x: 122.5, y: 100.5 },
  { x: 70.5, y: 62.5 },
  { x: 167.5, y: 60.5 },
  { x: 99.5, y: 87.5 },
  ];
  let audioContext;
  let analyser;
  let microphone;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 40; //
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");
          blownOut++;
        }
      });
    }

    if (blownOut > 0) {
      updateCandleCount();
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});

window.onload = () => {
  for (let i = 0; i < candles.length; i++) {
    addCandle(candles[i].x, candles[i].y);
  }
};
