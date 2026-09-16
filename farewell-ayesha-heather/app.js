// MRO GenAI Farewell Card Interactive Engine & Synthesizer

const CLOUD_SYNC_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a0ac57dc7620bc';
const LOCAL_STORAGE_KEY = 'mro_genai_farewell_notes_v2';

document.addEventListener('DOMContentLoaded', () => {
  initEmbers();
  initAudioSynthesizer();
  initCommunityNotes();
  initSceneHotspots();
  initSequenceAnimation();
});

/* ==========================================================================
   1. FLOATING AMBIENT EMBERS (Canvas Particle System)
   ========================================================================== */
function initEmbers() {
  const canvas = document.getElementById('ember-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const emberCount = 65;
  const embers = [];

  for (let i = 0; i < emberCount; i++) {
    embers.push(createEmber(true));
  }

  function createEmber(initial = false) {
    return {
      x: width * 0.5 + (Math.random() - 0.5) * (width * 0.5),
      y: initial ? Math.random() * height : height + 10,
      size: Math.random() * 2.8 + 1.2,
      speedY: Math.random() * 1.2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.7 + 0.3,
      fadeRate: Math.random() * 0.003 + 0.001,
      color: Math.random() > 0.3 ? '#f6c065' : '#ff8c42',
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.04 + 0.01
    };
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];
      e.y -= e.speedY;
      e.wobble += e.wobbleSpeed;
      e.x += e.speedX + Math.sin(e.wobble) * 0.5;
      e.opacity -= e.fadeRate;

      if (e.y < -10 || e.opacity <= 0) {
        embers[i] = createEmber(false);
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, e.opacity);
      ctx.shadowBlur = 8;
      ctx.shadowColor = e.color;
      ctx.fillStyle = e.color;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. PROCEDURAL ACOUSTIC GUITAR & PIANO SYNTHESIZER (Web Audio API)
   Folky, warm, uplifting fingerpicking progression in D Major / G Major
   ========================================================================== */
let audioCtx = null;
let isPlaying = false;
let sequenceTimer = null;

function initAudioSynthesizer() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  const btnLabel = document.getElementById('music-btn-label');
  const eqContainer = document.querySelector('.audio-controls');

  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!isPlaying) {
      isPlaying = true;
      toggleBtn.classList.add('playing');
      eqContainer.classList.add('playing');
      btnLabel.textContent = 'Pause Music';
      startFolkAcousticSong();
    } else {
      isPlaying = false;
      toggleBtn.classList.remove('playing');
      eqContainer.classList.remove('playing');
      btnLabel.textContent = 'Play Soundtrack';
      stopFolkAcousticSong();
    }
  });
}

function playPluckedString(freq, time, duration = 2.4, gainLevel = 0.18, isBass = false) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const oscHarmonic = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = isBass ? 'triangle' : 'sawtooth';
  osc.frequency.setValueAtTime(freq, time);

  oscHarmonic.type = 'sine';
  oscHarmonic.frequency.setValueAtTime(freq * 2, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(isBass ? 800 : 2200, time);
  filter.frequency.exponentialRampToValueAtTime(isBass ? 300 : 650, time + duration * 0.8);

  gainNode.gain.setValueAtTime(0.0001, time);
  gainNode.gain.linearRampToValueAtTime(gainLevel, time + 0.015);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(filter);
  oscHarmonic.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(time);
  oscHarmonic.start(time);
  osc.stop(time + duration);
  oscHarmonic.stop(time + duration);
}

function playWarmPianoChord(notes, time, duration = 3.5, gainLevel = 0.12) {
  if (!audioCtx) return;

  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time + idx * 0.02);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);

    gainNode.gain.setValueAtTime(0.0001, time);
    gainNode.gain.linearRampToValueAtTime(gainLevel / notes.length, time + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + duration);
  });
}

function startFolkAcousticSong() {
  const noteFreqs = {
    D3: 146.83,
    A3: 220.00,
    D4: 293.66,
    Fs4: 369.99,
    A4: 440.00,
    Cs3: 138.59,
    E4: 329.63,
    B2: 123.47,
    B3: 246.94,
    G2: 98.00,
    G3: 196.00,
    G4: 392.00
  };

  const chords = [
    { bass: noteFreqs.D3, arpeggio: [noteFreqs.A3, noteFreqs.D4, noteFreqs.Fs4, noteFreqs.A4], pad: [noteFreqs.D4, noteFreqs.Fs4, noteFreqs.A4] },
    { bass: noteFreqs.Cs3, arpeggio: [noteFreqs.A3, noteFreqs.Cs4, noteFreqs.E4, noteFreqs.A4], pad: [noteFreqs.Cs4, noteFreqs.E4, noteFreqs.A4] },
    { bass: noteFreqs.B2, arpeggio: [noteFreqs.Fs4, noteFreqs.B3, noteFreqs.D4, noteFreqs.Fs4], pad: [noteFreqs.B3, noteFreqs.D4, noteFreqs.Fs4] },
    { bass: noteFreqs.G2, arpeggio: [noteFreqs.G3, noteFreqs.B3, noteFreqs.D4, noteFreqs.Fs4], pad: [noteFreqs.G3, noteFreqs.B3, noteFreqs.D4] }
  ];

  let step = 0;
  const beatInterval = 480;

  function scheduleMeasure() {
    if (!isPlaying || !audioCtx) return;

    const chord = chords[Math.floor(step / 8) % chords.length];
    const subBeat = step % 8;
    const now = audioCtx.currentTime;

    if (subBeat === 0) {
      playPluckedString(chord.bass, now, 3.2, 0.22, true);
      playWarmPianoChord(chord.pad, now, 3.5, 0.14);
    }

    const arpegIndex = subBeat % chord.arpeggio.length;
    const note = chord.arpeggio[arpegIndex];
    playPluckedString(note, now, 1.8, 0.12, false);

    if (subBeat === 4) {
      playPluckedString(noteFreqs.A4, now + 0.05, 2.0, 0.09, false);
    }

    step++;
    sequenceTimer = setTimeout(scheduleMeasure, beatInterval);
  }

  scheduleMeasure();
}

function stopFolkAcousticSong() {
  if (sequenceTimer) {
    clearTimeout(sequenceTimer);
    sequenceTimer = null;
  }
}

/* ==========================================================================
   3. COMMUNITY PINBOARD & REAL-TIME CLOUD SYNC
   Cleared out for fresh team messages, synced across all browsers
   ========================================================================== */
let activeNotes = [];

async function initCommunityNotes() {
  const pinboard = document.getElementById('notes-pinboard');
  const openModalBtn = document.getElementById('open-note-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('cancel-modal-btn');
  const modalOverlay = document.getElementById('note-modal-overlay');
  const noteForm = document.getElementById('new-note-form');

  if (!pinboard) return;

  // 1. Initial Load: Try Local Cache first for instant render
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) activeNotes = JSON.parse(raw);
  } catch (e) {
    console.warn("Local storage unavailable", e);
  }
  renderNotes(activeNotes, pinboard);

  // 2. Fetch latest shared notes from Cloud
  await fetchCloudNotes(pinboard);

  // 3. Periodic background sync every 25 seconds
  setInterval(() => {
    fetchCloudNotes(pinboard, true);
  }, 25000);

  // Modal handlers
  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', () => {
      modalOverlay.classList.add('active');
      document.getElementById('note-author-input')?.focus();
    });

    const closeModal = () => modalOverlay.classList.remove('active');
    closeModalBtn?.addEventListener('click', closeModal);
    cancelModalBtn?.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    noteForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = noteForm.querySelector('button[type="submit"]');
      const origText = submitBtn.textContent;
      submitBtn.textContent = 'Pinning...';
      submitBtn.disabled = true;

      const author = document.getElementById('note-author-input').value.trim();
      const role = document.getElementById('note-role-input').value.trim() || 'MRO GenAI Family';
      const message = document.getElementById('note-message-input').value.trim();
      const color = document.getElementById('note-color-select').value;

      if (!author || !message) {
        submitBtn.textContent = origText;
        submitBtn.disabled = false;
        return;
      }

      const newNote = {
        id: 'note_' + Date.now(),
        author,
        role,
        message,
        color,
        timestamp: new Date().toISOString(),
        tilt: (Math.random() - 0.5) * 6
      };

      activeNotes.push(newNote);

      // Save locally
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeNotes));
      } catch (err) {}

      renderNotes(activeNotes, pinboard);

      // Push to shared cloud store
      await saveCloudNotes(activeNotes);

      submitBtn.textContent = origText;
      submitBtn.disabled = false;
      noteForm.reset();
      closeModal();
      showToast("Pinned to the hearth! 🎉");
    });
  }
}

async function fetchCloudNotes(pinboard, silent = false) {
  try {
    const res = await fetch(CLOUD_SYNC_URL);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.notes)) {
        // Merge or replace if different length or content
        if (JSON.stringify(data.data.notes) !== JSON.stringify(activeNotes)) {
          activeNotes = data.data.notes;
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeNotes));
          } catch (e) {}
          renderNotes(activeNotes, pinboard);
        }
      }
    }
  } catch (err) {
    if (!silent) console.warn("Cloud notes sync offline, relying on local storage", err);
  }
}

async function saveCloudNotes(notes) {
  try {
    await fetch(CLOUD_SYNC_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "mro_genai_ayesha_heather_farewell",
        data: { notes: notes }
      })
    });
  } catch (err) {
    console.error("Failed to sync notes to cloud", err);
  }
}

function renderNotes(notes, container) {
  container.innerHTML = '';

  if (!notes || notes.length === 0) {
    container.innerHTML = `
      <div class="empty-hearth-notice">
        <div class="empty-hearth-icon">✨</div>
        <p class="empty-hearth-title">The hearth is warm and ready for your well-wishes!</p>
        <p class="empty-hearth-sub">Be the first to pin a heartfelt note, memory, or inside joke for Ayesha and Heather.</p>
        <button class="empty-hearth-btn" onclick="document.getElementById('open-note-modal-btn').click()">
          💌 Pin the First Note
        </button>
      </div>
    `;
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement('div');
    card.className = `sticky-note sticky-${note.color || 'amber'}`;
    card.style.transform = `rotate(${note.tilt || 0}deg)`;

    card.innerHTML = `
      <div class="note-pin"></div>
      <p class="note-message">“${escapeHtml(note.message)}”</p>
      <div class="note-author-box">
        <span class="note-author">${escapeHtml(note.author)}</span>
        <span class="note-role">${escapeHtml(note.role)}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

function showToast(msg) {
  let toast = document.getElementById('hearth-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'hearth-toast';
    toast.className = 'hearth-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

/* ==========================================================================
   4. SCENE HOTSPOTS & INTERACTIVE FOCUS
   ========================================================================== */
function initSceneHotspots() {
  const hotspots = document.querySelectorAll('.hotspot');

  hotspots.forEach(spot => {
    spot.addEventListener('click', () => {
      const type = spot.dataset.type;
      highlightSceneFeature(type);
    });
  });

  const replayBtn = document.getElementById('replay-animation-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      initSequenceAnimation();
    });
  }
}

function highlightSceneFeature(type) {
  if (type === 'champions') {
    const lines = document.getElementById('constellation-lines');
    if (lines) pulseElement(lines, '#facc15');
  } else if (type === 'gears') {
    const gears = document.getElementById('tech-gears-group');
    if (gears) pulseElement(gears, '#38bdf8');
  } else if (type === 'heather-path') {
    const path = document.getElementById('heather-light-path');
    if (path) pulseElement(path, '#fde047');
  } else if (type === 'ayesha-bridge') {
    const bridge = document.getElementById('ayesha-bridge-orbit');
    if (bridge) pulseElement(bridge, '#38bdf8');
  }
}

function pulseElement(el, glowColor) {
  el.style.transition = 'filter 0.3s ease, opacity 0.3s ease';
  el.style.filter = `drop-shadow(0 0 15px ${glowColor})`;
  el.style.opacity = '1';
  setTimeout(() => {
    el.style.filter = 'none';
  }, 1200);
}

/* ==========================================================================
   5. TIMELINE CINEMATIC ANIMATION SEQUENCE
   ========================================================================== */
function initSequenceAnimation() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline();

  gsap.set('#scene-showcase', { opacity: 0, y: 30 });
  gsap.set('#tribute-narrative-card', { opacity: 0, y: 30 });
  gsap.set('.personal-card', { opacity: 0, y: 20 });
  gsap.set('#heather-light-path', { strokeDashoffset: 300 });
  gsap.set('#ayesha-bridge-orbit', { strokeDashoffset: 400 });

  tl.to('#scene-showcase', { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' })
    .to('#heather-light-path', { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, '-=0.5')
    .to('#ayesha-bridge-orbit', { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' }, '-=1.8')
    .to('#tribute-narrative-card', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.8')
    .to('.personal-card', { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.4)' }, '-=0.5');
}
