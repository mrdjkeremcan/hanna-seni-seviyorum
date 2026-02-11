// --- CONFIGURATION ---
const PASSWORD = "snackbar";
const LOVE_START = new Date(2025, 9, 7, 0, 0, 0); // Oct 7, 2025
const VALENTINE_DATE = new Date(2026, 1, 14, 0, 0, 0); // Feb 14, 2026

const REASONS = [
    "Because your smile lights up my world.",
    "Because of your beautiful eyes.",
    "Because your voice is my favorite melody.",
    "Because of your boobs (🙈).",
    "Because of your cute 🍑.",
    "Because you are my best friend.",
    "Because I can be myself with you.",
    "Because you support my dreams.",
    "Because even silence with you is comfortable.",
    "Because you have the kindest heart.",
    "Because of how you look at me.",
    "Because you make me laugh like no one else.",
    "Because you are incredibly smart.",
    "Because of your warmth.",
    "Because I miss you every second we are apart.",
    "Because you are my home.",
    "Because of our inside jokes.",
    "Because you inspire me to be better.",
    "Because your hugs heal me.",
    "Because you are beautiful inside and out.",
    "Because of your passion.",
    "Because you care so deeply.",
    "Because we are a perfect team.",
    "Because of the way you say my name.",
    "Because you make ordinary days special.",
    "Because you act cute when you're mad.",
    "Because of your long late-night talks.",
    "Because I trust you with my life.",
    "Because you are my safe place.",
    "Because of your style.",
    "Because you understand me without words.",
    "Because every love song reminds me of you.",
    "Because looking at you brings me peace.",
    "Because of your gentleness.",
    "Because you are strong.",
    "Because I can't imagine a future without you.",
    "Because you accept me as I am.",
    "Because of the way you hold my hand.",
    "Because your happiness is my happiness.",
    "Because loving you is the easiest thing I've ever done."
];

// --- DOM ELEMENTS ---
const elements = {
    s1: document.getElementById("s1"),
    s2: document.getElementById("s2"),
    s3: document.getElementById("s3"),
    s4: document.getElementById("s4"),
    s5: document.getElementById("s5"),
    env: document.getElementById("env"),
    pw: document.getElementById("pw"),
    musicBtn: document.getElementById("musicBtn"),
    song: document.getElementById("song"),
    whoosh: document.getElementById("whoosh"),
    toast: document.getElementById("toast"),
    touchLayer: document.getElementById("touchLayer"),
    canvas: document.getElementById("fx")
};

// --- STATE ---
let musicStarted = false;
let isPlaying = false;
let intervalCounter = null;

// --- UTILS ---
function pad(n) { return String(n).padStart(2, "0"); }

function show(hideEl, showEl) {
    hideEl.classList.remove("active");
    showEl.classList.add("active");
}

function toast(msg, duration = 2500) {
    const el = elements.toast;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), duration);
}

// --- MUSIC CONTROL (Feature 4) ---
async function startMusic() {
    if (musicStarted && !elements.song.paused) return;
    try {
        await elements.song.play();
        musicStarted = true;
        isPlaying = true;
        updateMusicBtn();
    } catch (e) {
        // Autoplay blocked
        isPlaying = false;
        updateMusicBtn();
    }
}

function toggleMusic() {
    if (elements.song.paused) {
        elements.song.play().then(() => {
            musicStarted = true;
            isPlaying = true;
            updateMusicBtn();
            toast("Music playing 🎵");
        }).catch(() => toast("Tap anywhere else first!"));
    } else {
        elements.song.pause();
        isPlaying = false;
        updateMusicBtn();
        toast("Music paused ⏸️");
    }
}

function updateMusicBtn() {
    const btn = elements.musicBtn;
    if (isPlaying) {
        btn.classList.add("playing");
        btn.innerHTML = "🔊"; // Speaker high
    } else {
        btn.classList.remove("playing");
        btn.innerHTML = "🔇"; // Speaker off
    }
}

elements.musicBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMusic();
});

// Global Unlock for Audio
function firstGesture() {
    startMusic();
    window.removeEventListener("pointerdown", firstGesture);
    window.removeEventListener("keydown", firstGesture);
}
window.addEventListener("pointerdown", firstGesture, { once: false });
window.addEventListener("keydown", firstGesture, { once: false });


// --- STAGE 1: ENVELOPE ---
function openEnvelope() {
    elements.env.classList.add("open");
    elements.whoosh.play().catch(() => { });
    startMusic();

    // Disable interaction
    elements.env.style.pointerEvents = "none";

    setTimeout(() => {
        show(elements.s1, elements.s2);
        elements.pw.focus();
    }, 900);
}
elements.env.addEventListener("click", openEnvelope);


// --- STAGE 2: PASSWORD ---
function unlock() {
    const val = (elements.pw.value || "").trim().toLowerCase();
    if (val === PASSWORD) {
        show(elements.s2, elements.s3);
    } else {
        elements.pw.value = "";
        elements.pw.focus();
        toast("Wrong password… try the hint 💭");
        // Shake animation could go here
    }
}
document.getElementById("unlockBtn").addEventListener("click", unlock);
elements.pw.addEventListener("keydown", (e) => {
    if (e.key === "Enter") unlock();
});


// --- STAGE 3: YES/NO ---
const noBtn = document.getElementById("noBtn");
function dodgeNo() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dx = (Math.random() * 300 - 150);
    const dy = (Math.random() * 200 - 100);

    // Keep within bounds roughly
    noBtn.style.transform = `translate(${dx}px, ${dy}px) scale(0.9)`;
}
noBtn.addEventListener("pointerenter", dodgeNo);
noBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); dodgeNo(); });

document.getElementById("yesBtn").addEventListener("click", async () => {
    startMusic();
    show(elements.s3, elements.s4);
    await runTyping();
    setTimeout(goFinal, 1000);
});


// --- STAGE 4: TYPING ---
const typeLines = [
    document.getElementById("type1"),
    document.getElementById("type2"),
    document.getElementById("type3")
];

function typeText(el, text) {
    return new Promise((resolve) => {
        el.innerHTML = `<span class="cursor"></span>`;
        const cursor = el.querySelector(".cursor");
        let i = 0;

        function char() {
            if (i < text.length) {
                cursor.insertAdjacentText("beforebegin", text.charAt(i));
                i++;
                setTimeout(char, 30 + Math.random() * 30);
            } else {
                cursor.remove();
                resolve();
            }
        }
        setTimeout(char, 400); // Initial delay
    });
}

async function runTyping() {
    typeLines.forEach(l => l.innerText = "");
    await typeText(typeLines[0], "No matter the distance…");
    await typeText(typeLines[1], "No matter the time…");
    await typeText(typeLines[2], "I’m still here. I’m still yours.");
}

function goFinal() {
    show(elements.s4, elements.s5);
    startHeartFireworks(true);
    toast("💗");
    startLoveCounter();
}
document.getElementById("waitCard").addEventListener("click", goFinal);


// --- STAGE 5: FINAL & FEATURES ---
function startLoveCounter() {
    const counterEl = document.getElementById("counterText");
    if (intervalCounter) clearInterval(intervalCounter);

    function update() {
        const now = new Date();
        const diff = Math.max(0, now - LOVE_START);

        const sec = Math.floor(diff / 1000);
        const days = Math.floor(sec / 86400);
        const hours = Math.floor((sec % 86400) / 3600);
        const mins = Math.floor((sec % 3600) / 60);
        const secs = sec % 60;

        counterEl.textContent = `${days} days · ${pad(hours)}h · ${pad(mins)}m · ${pad(secs)}s`;
    }
    update();
    intervalCounter = setInterval(update, 1000);
}

// Feature 2: Why I Love You (Updated with random, expansive list)
let lastReasonIndex = -1;
window.showReason = function () {
    let index;
    do {
        index = Math.floor(Math.random() * REASONS.length);
    } while (index === lastReasonIndex && REASONS.length > 1);
    lastReasonIndex = index;

    const reason = REASONS[index];
    toast("💌 " + reason, 3500);

    // Also visual burst
    try {
        spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2, 1.0);
    } catch (e) { }
};


// --- PARTICLE SYSTEM (Feature 5: Custom Text) ---
// OPTIMIZED: Reduced density and limited DPR
const ctx = elements.canvas.getContext("2d");
let W = 0, H = 0, dpr = 1;

function resize() {
    dpr = Math.min(1.5, window.devicePixelRatio || 1); // Cap DPR at 1.5 for performance
    W = elements.canvas.width = window.innerWidth * dpr;
    H = elements.canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    elements.canvas.style.width = window.innerWidth + "px";
    elements.canvas.style.height = window.innerHeight + "px";
}
window.addEventListener("resize", resize);

const particles = [];

// Spawn function now handles both BURST (firework) and RAIN types
function spawnHeartBurst(cx, cy, density = 1) {
    const n = Math.floor(40 * density);

    for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2) * (i / n);
        const speed = (2 + Math.random() * 3);

        const isText = Math.random() < 0.05;
        const textContent = (Math.random() < 0.5) ? "K&H" : "14.02";

        particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed * (0.5 + Math.random()),
            vy: Math.sin(angle) * speed * (0.5 + Math.random()) - 2,
            life: 1.0,
            decay: 0.015 + Math.random() * 0.02,
            type: isText ? "text" : "heart",
            text: textContent,
            size: isText ? (16 + Math.random() * 10) : (5 + Math.random() * 8),
            color: (Math.random() < 0.5) ? "#ff4d7d" : "#e11d48",
            behavior: "burst"
        });
    }
}

function spawnRainHeart() {
    const isText = Math.random() < 0.04;
    particles.push({
        x: Math.random() * (W / dpr),
        y: -20,
        vx: 0,
        vy: 1 + Math.random() * 2, // Falling speed
        life: 1.0,
        decay: 0, // Rain doesn't fade by life, it falls off screen
        type: isText ? "text" : "heart",
        text: (Math.random() < 0.5) ? "K&H" : "14.02",
        size: isText ? (14 + Math.random() * 8) : (6 + Math.random() * 10),
        color: (Math.random() < 0.5) ? "#ff4d7d" : "#e11d48",
        behavior: "rain",
        wobble: Math.random() * Math.PI * 2
    });
}

function startHeartFireworks() {
    elements.canvas.classList.add("show");
    resize();

    function loop() {
        ctx.clearRect(0, 0, W / dpr, H / dpr);

        // Spawn Rain linearly
        // Mobile optimization: spawn less frequently on small screens
        const isMobile = window.innerWidth < 800;
        const rainChance = isMobile ? 0.08 : 0.15;

        if (Math.random() < rainChance) {
            spawnRainHeart();
        }

        // Spawn Bursts randomly
        // Mobile optimization: less bursts
        const burstChance = isMobile ? 0.01 : 0.02;
        if (Math.random() < burstChance) {
            spawnHeartBurst(
                Math.random() * (W / dpr),
                Math.random() * (H / dpr) * 0.6,
                0.6
            );
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            if (p.behavior === "rain") {
                // RAIN LOGIC
                p.y += p.vy;
                p.wobble += 0.05;
                p.x += Math.sin(p.wobble) * 0.5; // Slight sway

                // Remove if off screen
                if (p.y > (H / dpr) + 50) {
                    particles.splice(i, 1);
                    continue;
                }
            } else {
                // BURST LOGIC
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.life -= p.decay;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
            }

            ctx.globalAlpha = (p.behavior === "rain") ? 0.85 : p.life;
            ctx.fillStyle = p.color;
            ctx.font = "bold " + p.size + "px sans-serif";

            if (p.type === "text") {
                ctx.fillText(p.text, p.x, p.y);
            } else {
                ctx.font = p.size + "px serif";
                ctx.fillText("❤️", p.x, p.y);
            }
        }

        requestAnimationFrame(loop);
    }
    loop();
}

// --- COUNTDOWN (Stage 1) ---
const valEl = document.getElementById("valCountdown");
function updateValCountdown() {
    const now = new Date();
    let diff = VALENTINE_DATE - now;
    if (diff <= 0) {
        valEl.textContent = "It’s today. It’s us. ❤️";
        return;
    }
    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    valEl.textContent = `Valentine’s Day in ${days} days · ${pad(hours)}h · ${pad(mins)}m · ${pad(secs)}s`;
}
setInterval(updateValCountdown, 1000);
updateValCountdown();
