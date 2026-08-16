/**
 * mind-blower.js
 * Injects highly advanced, physics-based UI mechanics:
 * 1. VanillaTilt for 3D Glass Cards with glare
 * 2. Custom Glowing Magnetic Cursor
 */

(function initMindBlower() {
  console.log("Initializing Mind-Blowing Interactivity...");

  // 1. Inject Styles for Custom Cursor and Tilt
  const style = document.createElement("style");
  style.innerHTML = `
    /* Hide Default Cursor */
    body, a, button, [onclick], .magnetic-btn, .project-card {
      cursor: none !important;
    }

    /* Custom Cursor Dot */
    #cursor-dot {
      width: 8px;
      height: 8px;
      background-color: #00e5ff;
      border-radius: 50%;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 100001;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, background-color 0.2s;
      box-shadow: 0 0 10px #00e5ff, 0 0 20px #00e5ff;
    }

    /* Custom Cursor Ring */
    #cursor-ring {
      width: 40px;
      height: 40px;
      border: 2px solid rgba(0, 229, 255, 0.4);
      border-radius: 50%;
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 100000;
      transform: translate(-50%, -50%);
      transition: width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s;
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.2);
    }

    /* Hover States for Cursor */
    body.cursor-hovering #cursor-dot {
      width: 0px;
      height: 0px;
      opacity: 0;
    }
    
    body.cursor-hovering #cursor-ring {
      width: 60px;
      height: 60px;
      background-color: rgba(0, 229, 255, 0.1);
      border-color: #00e5ff;
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
    }
  `;
  document.head.appendChild(style);

  // 2. Create Custom Cursor Elements
  const cursorDot = document.createElement("div");
  cursorDot.id = "cursor-dot";
  document.body.appendChild(cursorDot);

  const cursorRing = document.createElement("div");
  cursorRing.id = "cursor-ring";
  document.body.appendChild(cursorRing);

  // 3. Cursor Physics Logic
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  });

  // Ring follows with easing (smooth physics)
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorRing.style.left = ringX + "px";
    cursorRing.style.top = ringY + "px";
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // 4. Hover & Magnetic Logic
  function addMagneticEffect() {
    const interactables = document.querySelectorAll("a, button, .project-card, [onclick]");
    
    interactables.forEach((el) => {
      // Hover effects
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hovering"));
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hovering");
        el.style.transform = ""; // Reset magnetic pull
      });

      // Magnetic Pull
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const elCenterX = rect.left + rect.width / 2;
        const elCenterY = rect.top + rect.height / 2;
        
        // Calculate distance from center of element to mouse
        const distX = e.clientX - elCenterX;
        const distY = e.clientY - elCenterY;
        
        // Pull element slightly towards mouse (only for small items like buttons/links)
        if (el.tagName === 'A' || el.tagName === 'BUTTON') {
          el.style.transform = `translate(${distX * 0.2}px, ${distY * 0.2}px)`;
        }
      });
    });
  }

  // 5. Load VanillaTilt for 3D Cards
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  }

  async function loadTilt() {
    // Load VanillaTilt from unpkg
    await loadScript("https://unpkg.com/vanilla-tilt@1.8.1/dist/vanilla-tilt.min.js");
    
    // Apply 3D Tilt to all Project Cards
    VanillaTilt.init(document.querySelectorAll(".project-card"), {
      max: 15,
      speed: 400,
      glare: true,
      "max-glare": 0.2,
      scale: 1.02,
      perspective: 1000
    });

    addMagneticEffect();
  }

  // Ensure DOM is ready, then load
  setTimeout(loadTilt, 500);

})();
