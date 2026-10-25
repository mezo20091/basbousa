/* =========================================
   ROMANTIC INTERACTIVE LOGIC FOR BASBOOSA 💕
   With Bahaa Sultan - Ana Mn Gherak (MP3)
   & 10 Sequential Journey Steps
========================================= */

// --- 1. Background Music: Bahaa Sultan - Ana Mn Gherak ---
const bgSong = document.getElementById('bgSong');
const audioBtn = document.getElementById('audioBtn');
let isSongPlaying = false;

function playSong() {
  if (!bgSong) return;
  bgSong.volume = 0.85;
  const promise = bgSong.play();
  if (promise !== undefined) {
    promise.then(() => {
      isSongPlaying = true;
      audioBtn.classList.add('playing');
    }).catch(err => {
      console.log('Autoplay prevented by browser:', err);
    });
  }
}

function pauseSong() {
  if (!bgSong) return;
  bgSong.pause();
  isSongPlaying = false;
  audioBtn.classList.remove('playing');
}

function toggleSong() {
  if (isSongPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

audioBtn.addEventListener('click', toggleSong);

// Start song automatically on first user touch/click
function handleFirstUserTouch() {
  playSong();
  window.removeEventListener('click', handleFirstUserTouch);
  window.removeEventListener('touchstart', handleFirstUserTouch);
}
window.addEventListener('click', handleFirstUserTouch, { once: true });
window.addEventListener('touchstart', handleFirstUserTouch, { once: true });


// --- 2. Ambient Floating Hearts Canvas Background ---
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let hearts = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class FloatingHeart {
  constructor(x, y, isBurst = false) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || canvas.height + 20;
    this.size = Math.random() * (isBurst ? 22 : 16) + (isBurst ? 12 : 8);
    this.speedY = isBurst ? (Math.random() * -6 - 2) : (Math.random() * -1.5 - 0.6);
    this.speedX = isBurst ? (Math.random() * 6 - 3) : (Math.random() * 1 - 0.5);
    this.opacity = isBurst ? 1 : Math.random() * 0.6 + 0.3;
    this.decay = isBurst ? Math.random() * 0.02 + 0.015 : 0.002;
    this.rotation = Math.random() * Math.PI;
    this.rotSpeed = (Math.random() - 0.5) * 0.03;
    const colors = ['#f472b6', '#ec4899', '#fb7185', '#fda4af', '#f43f5e'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.fillStyle = this.color;
    
    ctx.beginPath();
    const s = this.size;
    ctx.moveTo(0, -s / 2);
    ctx.bezierCurveTo(s / 2, -s, s, -s / 3, 0, s);
    ctx.bezierCurveTo(-s, -s / 3, -s / 2, -s, 0, -s / 2);
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;
    this.opacity -= this.decay;
  }
}

function spawnAmbientHearts() {
  if (hearts.length < 35 && Math.random() < 0.25) {
    hearts.push(new FloatingHeart());
  }
}

function animateHearts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spawnAmbientHearts();

  for (let i = hearts.length - 1; i >= 0; i--) {
    hearts[i].update();
    hearts[i].draw();
    if (hearts[i].opacity <= 0 || hearts[i].y < -40) {
      hearts.splice(i, 1);
    }
  }
  requestAnimationFrame(animateHearts);
}
animateHearts();

function burstHeartsAt(x, y, count = 15) {
  for (let i = 0; i < count; i++) {
    hearts.push(new FloatingHeart(x, y, true));
  }
}


// --- 3. Stage 1: The Pink Love Bar Logic (Press and Hold / Tap) ---
const loveBarContainer = document.getElementById('loveBarContainer');
const loveBarFill = document.getElementById('loveBarFill');
const barText = document.getElementById('barText');
const barStatusMessage = document.getElementById('barStatusMessage');

let fillProgress = 0;
let isHolding = false;
let holdTimer = null;
let lastInteractionPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

const statusMilestones = [
  { at: 0, text: "الحب يبدأ بلمسة منكِ 💕" },
  { at: 20, text: "يا روحي كملي.. في مفاجأة مستنياكِ 🌸" },
  { at: 45, text: "نص الطريق لقلبي عدا.. استمري 💖" },
  { at: 70, text: "نبض قلبي بيزيد كل ثانية.. قربتي! 🥰" },
  { at: 90, text: "ثواني ومفاجأتنا تنكشف كلها! ✨" },
  { at: 100, text: "اكتمل حبكِ في قلبي للأبد 💖💍" }
];

function updateBarStatus(progress) {
  for (let i = statusMilestones.length - 1; i >= 0; i--) {
    if (progress >= statusMilestones[i].at) {
      barStatusMessage.textContent = statusMilestones[i].text;
      break;
    }
  }
}

function renderProgress(value) {
  fillProgress = Math.min(100, Math.max(0, value));
  loveBarFill.style.width = fillProgress + '%';
  barText.textContent = Math.floor(fillProgress) + '%';
  updateBarStatus(fillProgress);

  if (fillProgress >= 100) {
    onBarCompleted();
  }
}

function startHolding(e) {
  e.preventDefault();
  isHolding = true;
  loveBarContainer.classList.add('pressing');
  playSong();

  if (e.touches && e.touches[0]) {
    lastInteractionPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else if (e.clientX) {
    lastInteractionPos = { x: e.clientX, y: e.clientY };
  }

  if (holdTimer) clearInterval(holdTimer);
  holdTimer = setInterval(() => {
    if (!isHolding || fillProgress >= 100) return;
    
    renderProgress(fillProgress + 2);
    
    if (Math.random() < 0.6) {
      burstHeartsAt(lastInteractionPos.x, lastInteractionPos.y, 2);
    }
  }, 40);
}

function stopHolding() {
  if (!isHolding) return;
  isHolding = false;
  loveBarContainer.classList.remove('pressing');
  clearInterval(holdTimer);

  if (fillProgress < 100) {
    const drainTimer = setInterval(() => {
      if (isHolding || fillProgress <= 0 || fillProgress >= 100) {
        clearInterval(drainTimer);
        return;
      }
      renderProgress(fillProgress - 0.8);
    }, 50);
  }
}

loveBarContainer.addEventListener('click', (e) => {
  if (fillProgress >= 100) return;
  playSong();
  const x = e.clientX || lastInteractionPos.x;
  const y = e.clientY || lastInteractionPos.y;
  burstHeartsAt(x, y, 6);
  renderProgress(fillProgress + 10);
});

loveBarContainer.addEventListener('mousedown', startHolding);
window.addEventListener('mouseup', stopHolding);

loveBarContainer.addEventListener('touchstart', startHolding, { passive: false });
window.addEventListener('touchend', stopHolding);
window.addEventListener('touchcancel', stopHolding);

function onBarCompleted() {
  clearInterval(holdTimer);
  isHolding = false;
  loveBarContainer.classList.remove('pressing');
  
  if (window.confetti) {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6584', '#ec4899', '#db2777', '#f43f5e']
    });
  }

  setTimeout(() => {
    goToStage('stage-lock');
  }, 800);
}


// --- 4. Stage Transitions ---
function goToStage(stageId) {
  const currentActive = document.querySelector('.stage.active');
  if (currentActive) {
    currentActive.classList.remove('active');
  }
  
  const nextStage = document.getElementById(stageId);
  if (nextStage) {
    nextStage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}


// --- 5. Stage 2: Password Validation Logic ---
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');
const passForm = document.getElementById('passForm');
const lockIcon = document.getElementById('lockIcon');

function sanitizePassword(str) {
  if (!str) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let clean = str.trim();
  for (let i = 0; i < 10; i++) {
    clean = clean.split(arabicDigits[i]).join(i.toString());
  }
  clean = clean.replace(/[\/\-\.\s_]/g, '');
  return clean;
}

function verifyPassword() {
  playSong();
  const raw = passwordInput.value;
  const clean = sanitizePassword(raw);

  if (clean === '1582026' || clean === '15082026') {
    errorMsg.style.display = 'none';
    lockIcon.classList.remove('fa-lock');
    lockIcon.classList.add('fa-lock-open');
    lockIcon.style.color = '#10b981';

    if (window.confetti) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f472b6', '#ec4899', '#f59e0b', '#ffffff']
      });
    }

    setTimeout(() => {
      goToStage('stage-gallery');
      goToStep(1);
    }, 900);
  } else {
    errorMsg.style.display = 'block';
    passForm.classList.add('shake');
    setTimeout(() => {
      passForm.classList.remove('shake');
    }, 500);
  }
}

unlockBtn.addEventListener('click', verifyPassword);
passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    verifyPassword();
  }
});


// --- 6. Stage 3: Step-by-Step Memories Journey Logic (10 Steps) ---
let currentStep = 1;
const totalSteps = 10;

const stepPoems = [
  "أحبكِ حباً لو يفضّ يسيره على الخلق، مات الخلق من شدّة الحبِّ",
  "وكان اللقاءُ أماناً لقلبي.. كأنَّ الزمانَ ابتدأ من هنا 🌸",
  "والبحرُ يشهدُ أنني بكِ هائمٌ.. وموجُ قلبي لا يهدأ إلا بقربكِ 🌊",
  "يا فتنةَ النّور في خِمارِ الحياء.. زادكِ اللهُ بهاءً على بهاء ✨",
  "كلُّ الوردِ يذبلُ يا أميرتي.. إلا ورداً لمستهُ يداكِ فخلُد 🌹",
  "بجواركِ تمضي الدقائقُ كأنها جنة.. وبكِ تُبنى كلُّ أماني الغد 🎬",
  "رسمتُ حرفكِ فوق ثوبي معلناً.. أن الهوى في مهجتي عنوانُكِ ✍️",
  "معكِ كلُّ الطرقاتِ أمانٌ.. وكلُّ الأوقاتِ ربيعٌ لا ينتهي 🌸",
  "أنتِ سندي وأولُ من آمنَ بي.. ونجاحي لا يكتمل نوره إلا بابتسامتكِ 🌟",
  "وكلُّ يومٍ معكِ هو عيدٌ جديد.. وقربكِ هو نعمةُ العمرِ المديد 💖",
  "يا سكرَ الأيامِ والكونِ الفسيح.. يا من ببسمتها يطيبُ ويستريحُ 💍"
];

function updateStepUI(stepNum) {
  currentStep = stepNum;

  const stepCounterText = document.getElementById('stepCounterText');
  if (stepCounterText) {
    stepCounterText.textContent = `المرحلة ${stepNum} من ${totalSteps}`;
  }

  const journeyMiniPoem = document.getElementById('journeyMiniPoem');
  if (journeyMiniPoem && stepPoems[stepNum]) {
    journeyMiniPoem.style.opacity = 0;
    setTimeout(() => {
      journeyMiniPoem.textContent = `"${stepPoems[stepNum]}"`;
      journeyMiniPoem.style.opacity = 1;
    }, 200);
  }

  const dots = document.querySelectorAll('.p-dot');
  dots.forEach((dot, idx) => {
    const dotStep = idx + 1;
    dot.classList.remove('active', 'completed');
    if (dotStep === stepNum) {
      dot.classList.add('active');
      dot.textContent = (dotStep === 10) ? '💍' : '💖';
    } else if (dotStep < stepNum) {
      dot.classList.add('completed');
      dot.textContent = '💕';
    } else {
      dot.textContent = (dotStep === 10) ? '💍' : '🤍';
    }
  });
}

function revealStep(stepNum) {
  playSong();
  const stepEl = document.getElementById(`step-${stepNum}`);
  if (stepEl) {
    const rect = stepEl.getBoundingClientRect();
    burstHeartsAt(rect.left + rect.width / 2, rect.top + 100, 25);

    if (window.confetti && stepNum === 10) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#ec4899', '#f59e0b', '#ffffff']
      });
    }

    stepEl.classList.add('revealed');
  }
}

function goToStep(targetStep) {
  playSong();
  if (targetStep < 1 || targetStep > totalSteps) return;

  document.querySelectorAll('.memory-step').forEach(step => {
    step.classList.remove('active');
  });

  const nextStepEl = document.getElementById(`step-${targetStep}`);
  if (nextStepEl) {
    nextStepEl.classList.add('active');
    updateStepUI(targetStep);
    
    window.scrollTo({
      top: nextStepEl.offsetTop - 80,
      behavior: 'smooth'
    });

    burstHeartsAt(window.innerWidth / 2, 200, 10);
  }
}


// --- 7. Fullscreen Lightbox Logic ---
const lightbox = document.getElementById('lightboxModal');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

function openLightbox(src, caption) {
  lightboxImg.src = src;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('active');
  burstHeartsAt(window.innerWidth / 2, window.innerHeight / 2, 10);
}

function closeLightbox(e) {
  if (e.target === lightbox || e.target.closest('.close-lightbox')) {
    lightbox.classList.remove('active');
  }
}


// --- 8. Step 10: Proposal Celebration Logic ---
function celebrateLove(btn) {
  const celebrationMsg = document.getElementById('celebrationMsg');

  if (window.confetti) {
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#f472b6', '#ec4899', '#db2777', '#f59e0b', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

  celebrationMsg.style.display = 'block';
  btn.style.transform = 'scale(1.06)';
  btn.style.boxShadow = '0 0 25px #ec4899';
}

// Expose globals for onclick handlers
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.revealStep = revealStep;
window.goToStep = goToStep;
window.celebrateLove = celebrateLove;
