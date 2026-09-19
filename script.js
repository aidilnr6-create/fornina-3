/* =========================================================
   SURAT UNTUK NINA
   - Efek hujan ungu pakai canvas
   - Tombol buka surat (wajib diklik biar musik bisa jalan)
   - Paragraf muncul satu per satu saat di-scroll
   - Tombol play/pause musik di pojok kanan atas
   ========================================================= */

/* ====== 1. EFX HUJAN UNGU ====== */
const canvas = document.getElementById('rain');
const ctx = canvas.getContext('2d');
let drops = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createDrops();
}

function createDrops() {
  // kepadatan hujan menyesuaikan lebar layar
  const count = Math.min(180, Math.floor(canvas.width / 7));
  drops = [];
  for (let i = 0; i < count; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: 8 + Math.random() * 18,
      speed: 0.8 + Math.random() * 2.4,
      alpha: 0.08 + Math.random() * 0.35
    });
  }
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  for (const d of drops) {
    ctx.strokeStyle = `rgba(235, 140, 195, ${d.alpha})`;
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x - 0.4, d.y + d.len);
    ctx.stroke();

    d.y += d.speed;
    if (d.y > canvas.height) {
      d.y = -d.len;
      d.x = Math.random() * canvas.width;
      d.alpha = 0.08 + Math.random() * 0.35;
    }
  }
  requestAnimationFrame(drawRain);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawRain();

/* ====== 2. BUKA SURAT + MULAI MUSIK ====== */
const intro        = document.getElementById('intro');
const letter       = document.getElementById('letter');
const openBtn      = document.getElementById('openBtn');
const music        = document.getElementById('music');
const musicToggle  = document.getElementById('musicToggle');
const replayBtn    = document.getElementById('replayBtn');

openBtn.addEventListener('click', () => {
  // fade out layar pembuka
  intro.classList.add('hidden');

  // mainkan musik (harus dari interaksi user)
  music.volume = 0;
  music.play().then(() => {
    fadeVolume(music, 0.75, 1500); // naik pelan ke 75%
  }).catch(err => {
    console.warn('Musik tidak bisa diputar otomatis:', err);
  });

  // tampilkan surat setelah transisi pembuka
  setTimeout(() => {
    letter.classList.remove('hidden');
    musicToggle.classList.add('show');
  }, 700);
});

/* ====== 3. REVEAL PARAGRAF SAAT DI-SCROLL ====== */
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => observer.observe(el));

/* ====== 4. TOMBOL PLAY / PAUSE MUSIK ====== */
musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play().catch(() => {});
    musicToggle.textContent = '⏸';
  } else {
    music.pause();
    musicToggle.textContent = '▶';
  }
});

/* ====== 5. TOMBOL "BACA LAGI" ====== */
replayBtn.addEventListener('click', () => {
  // scroll ke atas surat
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // reset semua reveal biar muncul lagi
  reveals.forEach(el => el.classList.remove('visible'));
  // trigger ulang setelah scroll selesai
  setTimeout(() => {
    reveals.forEach(el => observer.observe(el));
  }, 900);
});

/* ====== 6. FADE VOLUME MUSIK ====== */
function fadeVolume(audio, targetVol, duration) {
  const steps = 30;
  const stepTime = duration / steps;
  const startVol = audio.volume;
  const diff = targetVol - startVol;
  let i = 0;
  const timer = setInterval(() => {
    i++;
    audio.volume = Math.min(1, Math.max(0, startVol + (diff * i / steps)));
    if (i >= steps) clearInterval(timer);
  }, stepTime);
}