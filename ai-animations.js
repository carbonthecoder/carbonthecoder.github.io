/**
 * ai-animations.js
 * Injects modern "Generative AI" Minimalist aesthetics:
 * - Deep black backgrounds with cinematic noise/grain.
 * - Blurred, smooth Aurora orbs (glow).
 * - Smooth AOS scroll animations.
 * - Elegant Token-Streaming typing effects.
 */

(function initGenerativeAIAesthetics() {
  console.log("Initializing Generative AI Aesthetics...");

  // 1. Inject Premium AI Styles
  const style = document.createElement("style");
  style.innerHTML = `
    /* AOS Styles */
    @import url('https://unpkg.com/aos@2.3.1/dist/aos.css');

    body {
      background-color: #050505 !important;
      color: #eaeaea !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif !important;
    }

    /* Cinematic Noise Grain Overlay */
    .noise-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.04;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    /* Aurora Orbs */
    .aurora-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -2;
      overflow: hidden;
      background: #050505;
    }

    .aurora-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: float 20s infinite ease-in-out alternate;
    }

    .orb-1 {
      top: -10%; left: 20%;
      width: 50vw; height: 50vw;
      background: radial-gradient(circle, rgba(120, 0, 255, 0.2) 0%, transparent 70%);
      animation-delay: 0s;
    }

    .orb-2 {
      bottom: -10%; right: 10%;
      width: 60vw; height: 60vw;
      background: radial-gradient(circle, rgba(0, 200, 255, 0.15) 0%, transparent 70%);
      animation-delay: -5s;
    }

    @keyframes float {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(10vw, 5vh) scale(1.1); }
    }

    /* Minimalist Glass Cards */
    .project-card, .modal-box {
      background: rgba(20, 20, 25, 0.4) !important;
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.05) !important;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease !important;
    }

    .project-card:hover {
      border-color: rgba(255, 255, 255, 0.2) !important;
      transform: translateY(-4px) !important;
    }

    /* Token Streaming Typography */
    .ai-stream-text {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      border-right: 2px solid rgba(255, 255, 255, 0.8);
      animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
    }

    @keyframes typing {
      from { width: 0 }
      to { width: 100% }
    }
    @keyframes blink-caret {
      from, to { border-color: transparent }
      50% { border-color: rgba(255, 255, 255, 0.8) }
    }
  `;
  document.head.appendChild(style);

  // 2. Add Background Elements
  const noise = document.createElement("div");
  noise.className = "noise-overlay";
  document.body.prepend(noise);

  const aurora = document.createElement("div");
  aurora.className = "aurora-bg";
  aurora.innerHTML = `
    <div class="aurora-orb orb-1"></div>
    <div class="aurora-orb orb-2"></div>
  `;
  document.body.prepend(aurora);

  // Hide the old gamey canvas
  const oldCanvas = document.getElementById("bgCanvas");
  if (oldCanvas) {
    oldCanvas.style.display = "none";
  }

  // Hide vanta-bg if it exists from previous iteration
  const oldVanta = document.getElementById("vanta-bg");
  if(oldVanta) {
    oldVanta.style.display = "none";
  }

  // 3. Load AOS Dynamically
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  async function loadAnimations() {
    await loadScript("https://unpkg.com/aos@2.3.1/dist/aos.js");
    
    // Add AOS attributes to cards cleanly
    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card, i) => {
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-delay", (i % 3) * 100);
      card.setAttribute("data-aos-duration", "800");
    });

    const sections = document.querySelectorAll("section, .timeline-item");
    sections.forEach((sec) => {
      if(!sec.hasAttribute("data-aos")) {
        sec.setAttribute("data-aos", "fade-up");
        sec.setAttribute("data-aos-duration", "1000");
      }
    });

    AOS.init({ once: false, mirror: true, offset: 50 });
  }

  loadAnimations();
})();
