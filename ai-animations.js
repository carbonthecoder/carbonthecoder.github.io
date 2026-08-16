/**
 * ai-animations.js
 * Injects advanced Vanta Neural Network backgrounds, AOS scroll animations, 
 * and Hacker-Glassmorphism styles dynamically into the portfolio.
 */

(function initAIAnimations() {
  console.log("Initializing AI Whisperer Animations...");

  // 1. Inject Styles
  const style = document.createElement("style");
  style.innerHTML = `
    /* AOS Styles */
    @import url('https://unpkg.com/aos@2.3.1/dist/aos.css');

    /* Vanta Background Container */
    #vanta-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -2; /* Behind the grid and content */
      pointer-events: none;
    }

    /* Glassmorphism Upgrades */
    .project-card, .modal-box {
      background: rgba(10, 10, 15, 0.6) !important;
      backdrop-filter: blur(12px) saturate(150%);
      -webkit-backdrop-filter: blur(12px) saturate(150%);
      border: 1px solid rgba(0, 255, 255, 0.15) !important;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
    }

    .project-card:hover {
      border-color: rgba(0, 255, 255, 0.8) !important;
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 15px rgba(0, 255, 255, 0.1);
      transform: translateY(-8px) scale(1.02) !important;
    }

    /* Titles Glitch on Hover */
    h1:hover, h2:hover, .glitch:hover {
      animation: textGlitch 0.3s infinite;
      color: #00ffff;
      text-shadow: 2px 0 #ff007f, -2px 0 #00ffff;
    }

    @keyframes textGlitch {
      0% { transform: translate(0) }
      20% { transform: translate(-2px, 1px) }
      40% { transform: translate(-1px, -1px) }
      60% { transform: translate(2px, 1px) }
      80% { transform: translate(1px, -1px) }
      100% { transform: translate(0) }
    }
  `;
  document.head.appendChild(style);

  // 2. Create Vanta Container
  const vantaContainer = document.createElement("div");
  vantaContainer.id = "vanta-bg";
  document.body.prepend(vantaContainer);

  // Hide the old canvas if it exists to let Vanta shine
  const oldCanvas = document.getElementById("bgCanvas");
  if (oldCanvas) {
    oldCanvas.style.opacity = "0.2"; // Keep it faint or hide it
  }

  // 3. Load Scripts Dynamically
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  async function loadAnimations() {
    // Load AOS
    await loadScript("https://unpkg.com/aos@2.3.1/dist/aos.js");
    
    // Dynamically add data-aos attributes to elements
    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card, i) => {
      card.setAttribute("data-aos", "fade-up");
      card.setAttribute("data-aos-delay", (i % 3) * 100);
      card.setAttribute("data-aos-duration", "800");
    });

    const sections = document.querySelectorAll("section, .timeline-item");
    sections.forEach((sec) => {
      if(!sec.hasAttribute("data-aos")) {
        sec.setAttribute("data-aos", "fade-right");
        sec.setAttribute("data-aos-duration", "1000");
      }
    });

    // Initialize AOS
    AOS.init({
      once: false,
      mirror: true,
      offset: 50
    });

    // Load Three.js and Vanta.NET
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js");

    // Initialize Vanta Neural Network
    VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x00ffff, // Cyan AI Color
      backgroundColor: 0x050505,
      points: 12.00,
      maxDistance: 22.00,
      spacing: 18.00,
      showDots: true
    });
  }

  loadAnimations();
})();
