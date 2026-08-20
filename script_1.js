
      /* ── SWITCH PROJECTS TAB ── */
      /* Safe localStorage wrapper to prevent crashes on local file:// protocol */
      const safeStorage = {
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch (e) {
            return null;
          }
        },
        setItem: (key, val) => {
          try {
            localStorage.setItem(key, val);
          } catch (e) {}
        },
      };

      /* ── SWITCH PROJECTS TAB ── */
      function switchProjTab(type) {
        const tabAI = document.getElementById("tabAI");
        const tabSelf = document.getElementById("tabSelf");
        const contentAI = document.getElementById("projContentAI");
        const contentSelf = document.getElementById("projContentSelf");

        if (type === "ai") {
          tabAI.className = "brutal-solid";
          tabAI.style.background = "var(--accent-color)";
          tabAI.style.color = "#000";
          tabAI.style.borderColor = "var(--accent-color)";

          tabSelf.className = "brutal-border";
          tabSelf.style.background = "transparent";
          tabSelf.style.color = "rgba(255,255,255,0.5)";
          tabSelf.style.borderColor = "var(--border-color)";

          contentAI.style.display = "block";
          contentSelf.style.display = "none";
        } else {
          tabSelf.className = "brutal-solid";
          tabSelf.style.background = "var(--accent-color)";
          tabSelf.style.color = "#000";
          tabSelf.style.borderColor = "var(--accent-color)";

          tabAI.className = "brutal-border";
          tabAI.style.background = "transparent";
          tabAI.style.color = "rgba(255,255,255,0.5)";
          tabAI.style.borderColor = "var(--border-color)";

          contentSelf.style.display = "block";
          contentAI.style.display = "none";
        }
      }
      /* ── MUSIC ENGINE ── */
      const tracklist = [
        { title: "After Dark", src: "After dark.mp3" },
        { title: "Elevate", src: "Elevate.mp3" },
      ];
      let currentTrackIndex = 0;
      const bgMusic = new Audio(tracklist[currentTrackIndex].src);
      bgMusic.volume = 0.5;
      let isPlaying = false;

      function formatTime(secs) {
        if (isNaN(secs)) return "0:00";
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60)
          .toString()
          .padStart(2, "0");
        return `${m}:${s}`;
      }

      bgMusic.addEventListener("timeupdate", () => {
        document.querySelectorAll(".track-time").forEach((el) => {
          el.innerText = `${formatTime(bgMusic.currentTime)} / ${formatTime(bgMusic.duration)}`;
        });
      });

      bgMusic.addEventListener("ended", () => {
        nextTrack();
      });

      function loadTrack(index) {
        currentTrackIndex = index;
        bgMusic.src = tracklist[currentTrackIndex].src;
        document.querySelectorAll(".track-name").forEach((el) => {
          el.innerText = tracklist[currentTrackIndex].title;
        });
        const mpTrack = document.getElementById("mpTrackName");
        if (mpTrack) mpTrack.innerText = tracklist[currentTrackIndex].title;
        if (isPlaying) {
          bgMusic.play();
        }
      }

      function nextTrack() {
        let idx = currentTrackIndex + 1;
        if (idx >= tracklist.length) idx = 0;
        loadTrack(idx);
      }

      function prevTrack() {
        let idx = currentTrackIndex - 1;
        if (idx < 0) idx = tracklist.length - 1;
        loadTrack(idx);
      }

      function updateVolume(val) {
        bgMusic.volume = parseFloat(val);
      }

      function mbToggle() {
        const playIcons = document.querySelectorAll(".play-icon");
        const statusTexts = document.querySelectorAll(".play-icon-status");
        const mpPlayIcon = document.getElementById("mpPlayIcon");

        const dVis = document.getElementById("desktopVisualizer");
        const mVis = document.getElementById("mobileVisualizer");

        if (isPlaying) {
          bgMusic.pause();
          isPlaying = false;
          if (dVis) dVis.classList.remove("active");
          if (mVis) mVis.classList.remove("active");
          playIcons.forEach((icon) => {
            icon.className = "fa-solid fa-play play-icon";
            icon.style.color = "";
          });
          if (mpPlayIcon) {
            mpPlayIcon.className = "fa-solid fa-play";
            mpPlayIcon.style.color = "";
          }
          const mobIcon = document.getElementById("mobileMusicIcon");
          if (mobIcon) {
            mobIcon.className = "fa-solid fa-compact-disc";
          }
          statusTexts.forEach((txt) => (txt.innerText = "OFF"));
        } else {
          bgMusic
            .play()
            .then(() => {
              isPlaying = true;
              if (dVis) dVis.classList.add("active");
              if (mVis) mVis.classList.add("active");
              playIcons.forEach((icon) => {
                icon.className = "fa-solid fa-pause play-icon";
                icon.style.color = "var(--accent-color)";
              });
              if (mpPlayIcon) {
                mpPlayIcon.className = "fa-solid fa-pause";
                mpPlayIcon.style.color = "var(--accent-color)";
              }
              const mobIcon = document.getElementById("mobileMusicIcon");
              if (mobIcon) {
                mobIcon.className = "fa-solid fa-compact-disc fa-spin";
              }
              statusTexts.forEach((txt) => (txt.innerText = "ON"));
            })
            .catch((e) => {
              alert("Click anywhere on the page first, then toggle music!");
            });
        }
      }

      let mobilePlayerTimeout;
      let _mobilePlayerListenerAttached = false;
      function toggleMobilePlayer(e) {
        if (e) e.preventDefault();
        const mp = document.getElementById("miniPlayer");
        if (!mp) return;

        const isOpen = mp.classList.contains("show-mobile");
        if (isOpen) {
          mp.classList.remove("show-mobile");
          return;
        }

        // Hide tooltip notification when disc is clicked
        const tooltip = document.getElementById('mobileMusicTooltip');
        if (tooltip) tooltip.style.opacity = '0';

        mp.classList.add("show-mobile");
        clearTimeout(mobilePlayerTimeout);
        mobilePlayerTimeout = setTimeout(() => {
          mp.classList.remove("show-mobile");
        }, 10000);

        // Only attach ONE close-on-outside-click listener at a time
        if (!_mobilePlayerListenerAttached) {
          _mobilePlayerListenerAttached = true;
          setTimeout(() => {
            function closeMenu(e) {
              if (!mp.contains(e.target) && e.target.id !== 'mobileMusicBtn' && !e.target.closest('#mobileMusicBtn')) {
                mp.classList.remove("show-mobile");
                document.removeEventListener('click', closeMenu);
                _mobilePlayerListenerAttached = false;
              }
            }
            document.addEventListener('click', closeMenu);
          }, 10);
        }
      }

      function launchPortfolio() {
        // Prevent multiple clicks
        const boot = document.getElementById("bootScreen");
        if (boot) boot.removeAttribute("onclick");

        // Start the 8-second bruh timer
        window.bruhTimerActive = true;
        setTimeout(() => {
          window.bruhTimerActive = false;
        }, 8000);

        // Play randomly selected preloaded boot sound
        if (window.bootSounds && window.bootSounds.length > 0) {
          const randomIndex = Math.floor(Math.random() * window.bootSounds.length);
          const sfx = window.bootSounds[randomIndex];
          sfx.currentTime = 0;
          sfx.play().catch((e) => console.log("Audio blocked"));
        }

        // Fade out the black screen
        if (boot) {
          boot.classList.add("done");
          // Hide it completely after fade
          setTimeout(() => {
            boot.style.display = "none";
            const mp = document.getElementById("miniPlayer");
            if (mp) mp.style.display = "flex";
          }, 800);
        }

        // Show the music prompt
        const prompt = document.getElementById("musicPromptOverlay");
        if (prompt) {
          prompt.style.display = "flex";
          // Small delay to allow CSS transition if any
          setTimeout(() => {
            prompt.style.opacity = "1";
          }, 50);
        }
      }

      function confirmLaunch(enableMusic) {
        // Unlock scroll after answering the prompt
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        
        // Hide the music prompt
        const prompt = document.getElementById("musicPromptOverlay");
        if (prompt) {
          prompt.style.opacity = "0";
          setTimeout(() => {
            prompt.style.display = "none";
          }, 400);
        }

        sfx.init();

        if (enableMusic && !isPlaying) {
          mbToggle();
        }

        // Show Mini Player tooltip based on their choice
        const tooltip = document.getElementById("musicTooltip");
        const tooltipText = document.getElementById("musicTooltipText");
        const mobTooltip = document.getElementById("mobileMusicTooltip");
        const mobTooltipText = document.getElementById("mobileMusicTooltipText");
        
        let msg = enableMusic ? "Check out another song!" : "Check out the mini player and turn on music!";
        
        if (tooltip && tooltipText) {
          tooltipText.innerText = msg;
          tooltip.style.opacity = "1";
          setTimeout(() => {
            tooltip.style.opacity = "0";
          }, 10000);
        }
        if (mobTooltip && mobTooltipText) {
          mobTooltipText.innerText = msg;
          // Only pop up mobile tooltip if on a narrow screen
          if (window.innerWidth <= 768) {
            mobTooltip.style.opacity = "1";
            setTimeout(() => {
              mobTooltip.style.opacity = "0";
            }, 10000);
          }
        }
      }

      // Preload the punch sound so it syncs perfectly for all normal punches
      window.punchSfx = new Audio("https://www.myinstants.com/media/sounds/strongpunch_1.mp3");
      window.punchSfx.volume = 0.03;
      window.punchSfx.preload = "auto";
      window.punchSfx.load();
      window.punchSfx.preload = "none";

      // Preload array of epic boot sounds for random selection on the start screen
      window.bootSounds = [
        "https://www.myinstants.com/media/sounds/strongpunch_1.mp3",
        "https://www.myinstants.com/media/sounds/anime-shine-sound-effect_QP4mAaX.mp3",
        "https://www.myinstants.com/media/sounds/goku-teleport-sound.mp3",
        "https://www.myinstants.com/media/sounds/tuturu_1.mp3",
        "https://www.myinstants.com/media/sounds/minecraft-explosion-green-screen.mp3"
      ].map(url => {
        let audio = new Audio(url);
        audio.volume = 0.3;
        audio.preload = "none";
        return audio;
      });

      // Preload the among us sound
      window.amongUsSfx = new Audio("https://www.myinstants.com/media/sounds/among-us-roundstart.mp3");
      window.amongUsSfx.volume = 0.3;
      window.amongUsSfx.preload = "auto";
      window.amongUsSfx.load();

      // Preload the Hehe Boi sound
      window.heheBoiSfx = new Audio("https://www.myinstants.com/media/sounds/ainsley_harriott_and_his_spicy_meatconverttoaudio.mp3");
      window.heheBoiSfx.volume = 0.48;
      window.heheBoiSfx.preload = "auto";
      window.heheBoiSfx.load();

      // Preload the Anime WOW sound
      window.wowSfx = new Audio("https://www.myinstants.com/media/sounds/wow-1e00daf5-468a-4381-b636-e7fd3f595187.mp3");
      window.wowSfx.volume = 0.42;
      window.wowSfx.preload = "auto";
      window.wowSfx.load();

      // Preload the aww darn it ended sound
      window.endSfx = new Audio("https://www.myinstants.com/media/sounds/it-ended.mp3");
      window.endSfx.volume = 0.3;
      window.endSfx.preload = "none";

      // Preload extra easter egg sounds
      const extraSfx = {
        zaWarudo: "https://www.myinstants.com/media/sounds/hd-stardust-crusaders-za-warudo_1.mp3",
        mario1Up: "https://www.myinstants.com/media/sounds/smb_1-up.mp3",
        shadowClone: "https://www.myinstants.com/media/sounds/naruto-shadow-clone-jutsu-sound-effect.mp3",
        dio: "https://www.myinstants.com/media/sounds/it-was-me-dio_1.mp3",
        ahShit: "https://www.myinstants.com/media/sounds/gta-san-andreas-ah-shit-here-we-go-again.mp3",
        bloodSlash: "https://www.myinstants.com/media/sounds/sword_slash-ab22fe02-3826-345a-80ad-dc22261a9127.mp3",
        glitch: "https://www.myinstants.com/media/sounds/error-glitch.mp3",
        creeper: "https://www.myinstants.com/media/sounds/creeper-explosion.mp3",
        chaChing: "https://www.myinstants.com/media/sounds/audiojoiner120623175716.mp3",
        pipe: "https://www.myinstants.com/media/sounds/super-mario-bros.mp3",
        ultraInstinct: "https://www.myinstants.com/media/sounds/ultra-instinct-theme-official-version.mp3",
        djAirhorn: "https://www.myinstants.com/media/sounds/dj-airhorn-sound-effect-kingbeatz_1.mp3",
        nani: "https://www.myinstants.com/media/sounds/nani_Pmxf5n3.mp3",
        fundAww: "https://www.myinstants.com/media/sounds/aww-sound-effect_OII2eTh.mp3",
        animeAhh: "https://www.myinstants.com/media/sounds/anime-ahh.mp3",
        chicken: "https://www.myinstants.com/media/sounds/chicken-on-tree-screaming.mp3"
      };
      window.extraAudio = {};
      Object.keys(extraSfx).forEach(key => {
        let audio = new Audio(extraSfx[key]);
        audio.volume = 0.4;
        audio.preload = "none";
        window.extraAudio[key] = audio;
      });
      window.playExtra = function(key) {
        if(window.extraAudio[key]){
          window.extraAudio[key].currentTime=0;
          window.extraAudio[key].play().catch(()=>{});
        }
      }

      /* ── THEME PALETTE ENGINE ── */
      const themeConfigs = {
        default: {
          bg: "#000000",
          text: "#ffffff",
          accent: "#FF3300",
          glitch: "#00FFFF",
          border: "rgba(255, 51, 0, 0.4)",
          hover: "rgba(255, 51, 0, 0.08)",
          grid: "rgba(255, 255, 255, 0.08)",
        },
        nether: {
          bg: "#05020a",
          text: "#ffffff",
          accent: "#FF007F",
          glitch: "#8400ff",
          border: "rgba(255, 0, 127, 0.45)",
          hover: "rgba(255, 0, 127, 0.08)",
          grid: "rgba(132, 0, 255, 0.1)",
        },
        cyber: {
          bg: "#000000",
          text: "#ffffff",
          accent: "#00f5ff",
          glitch: "#ff0055",
          border: "rgba(0, 245, 255, 0.5)",
          hover: "rgba(0, 245, 255, 0.1)",
          grid: "rgba(0, 245, 255, 0.1)",
        },
        retro: {
          bg: "#000000",
          text: "#ffffff",
          accent: "#D000FF",
          glitch: "#FFea00",
          border: "rgba(208, 0, 255, 0.6)",
          hover: "rgba(208, 0, 255, 0.15)",
          grid: "rgba(255, 234, 0, 0.12)",
        },
        toxic: {
          bg: "#000200",
          text: "#ffffff",
          accent: "#39FF14",
          glitch: "#00ffff",
          border: "rgba(57, 255, 20, 0.6)",
          hover: "rgba(57, 255, 20, 0.15)",
          grid: "rgba(0, 255, 65, 0.12)",
        },
        sakura: {
          bg: "#050005",
          text: "#ffffff",
          accent: "#FF1493",
          glitch: "#00f5ff",
          border: "rgba(255, 20, 147, 0.6)",
          hover: "rgba(255, 20, 147, 0.15)",
          grid: "rgba(0, 255, 255, 0.12)",
        },
        frost: {
          bg: "#000000",
          text: "#ffffff",
          accent: "#00e5ff",
          glitch: "#ffffff",
          border: "rgba(0, 229, 255, 0.6)",
          hover: "rgba(0, 229, 255, 0.15)",
          grid: "rgba(0, 229, 255, 0.12)",
        }
      };

      function setTheme(themeKey) {
        if (window.playExtra) {
          if (themeKey === 'blood') window.playExtra('bloodSlash');
          else if (themeKey === 'matrix' || themeKey === 'cyber') window.playExtra('glitch');
          else if (themeKey === 'toxic') window.playExtra('creeper');
        }
        
        const config = themeConfigs[themeKey] || themeConfigs.default;
        const root = document.documentElement;

        // Trigger screen flash glitch animation
        const flash = document.getElementById("themeGlitchFlash");
        if (flash) {
          flash.classList.remove("flash-active");
          void flash.offsetWidth; // trigger reflow
          flash.classList.add("flash-active");
        }

        // Set CSS custom variables dynamically
        root.style.setProperty("--bg-color", config.bg);
        root.style.setProperty("--text-color", config.text);
        root.style.setProperty("--accent-color", config.accent);
        root.style.setProperty("--accent-glitch", config.glitch);
        root.style.setProperty("--border-color", config.border);
        root.style.setProperty("--hover-bg", config.hover);
        root.style.setProperty("--grid-dot-color", config.grid);

        // Close palette dropdown menu
        const pDropdown = document.getElementById("paletteDropdown");
        if (pDropdown) {
          pDropdown.classList.remove("show");
        }

        // Update canvas color cache
        window.currentAccentHex = config.accent;

        // Update GitHub SVG calendar color dynamically
        if (window.renderGithubHeatmap && window.currentGithubYear) {
          window.renderGithubHeatmap(window.currentGithubYear);
        }

        // Save selected theme key to localStorage safely
        safeStorage.setItem("selectedTheme", themeKey);
      }

      // Load saved theme on boot immediately
      const savedTheme = safeStorage.getItem("selectedTheme") || "default";
      setTheme(savedTheme);

      // Interactive UI elements binding for palette dropdown menu toggles
      const pBtn = document.getElementById("paletteBtn");
      const pDropdown = document.getElementById("paletteDropdown");
      pBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        pDropdown.classList.toggle("show");
      });
      document.addEventListener("click", () =>
        pDropdown.classList.remove("show"),
      );

      /* ── SCROLL PROGRESS ── */
      window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = (scrollTop / docHeight) * 100;
        document.getElementById("scrollProgress").style.width = pct + "%";
      });

      /* ── SCROLL ANIMATIONS ── */
      const _scrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        _scrollObserver.observe(el);
      });

      /* ── LIVE METRICS ── */
      let uptimeSec = 0;
      setInterval(() => {
        uptimeSec++;
        const h = String(Math.floor(uptimeSec / 3600)).padStart(2, "0");
        const m = String(Math.floor((uptimeSec % 3600) / 60)).padStart(2, "0");
        const s = String(uptimeSec % 60).padStart(2, "0");
        document.getElementById("uptimeMetric").textContent = `${h}:${m}:${s}`;
        document.getElementById("footerUptime").textContent =
          `UPTIME: ${h}:${m}:${s}`;
        document.getElementById("cpuMetric").textContent = Math.floor(
          2 + Math.random() * 15,
        );
        document.getElementById("ramMetric").textContent = Math.floor(
          420 + Math.random() * 200,
        );
      }, 1000);

      /* ── COMMAND PALETTE ── */
      let cmdOpen = true;
      let cmdSelected = 0;
      const cmdItems = document.querySelectorAll(".cmd-item");

      document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
          e.preventDefault();
          toggleCmd();
        }
        if (cmdOpen) {
          if (e.key === "Escape") toggleCmd();
          if (e.key === "ArrowDown") {
            e.preventDefault();
            cmdSelected = (cmdSelected + 1) % cmdItems.length;
            updateCmdSelection();
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            cmdSelected = (cmdSelected - 1 + cmdItems.length) % cmdItems.length;
            updateCmdSelection();
          }
          if (e.key === "Enter") {
            executeCmd(cmdItems[cmdSelected].dataset.action);
          }
        }
      });

      function toggleCmd() {
        cmdOpen = !cmdOpen;
        const pal = document.getElementById("cmdPalette");
        pal.classList.toggle("on", cmdOpen);
        if (cmdOpen) {
          document.getElementById("cmdInput").value = "";
          setTimeout(() => document.getElementById("cmdInput").focus(), 50);
          cmdSelected = 0;
          updateCmdSelection();
        }
      }

      function updateCmdSelection() {
        cmdItems.forEach((item, i) =>
          item.classList.toggle("selected", i === cmdSelected),
        );
      }

      cmdItems.forEach((item, i) => {
        item.addEventListener("mouseenter", () => {
          cmdSelected = i;
          updateCmdSelection();
        });
        item.addEventListener("click", () => executeCmd(item.dataset.action));
      });

      function executeCmd(action) {
        toggleCmd();
        switch (action) {
          case "home":
            scrollToSection("home");
            break;
          case "about":
            scrollToSection("about");
            break;
          case "skills":
            scrollToSection("skills");
            break;
          case "projects":
            scrollToSection("projects");
            break;
          case "contact":
            scrollToSection("contact");
            break;
          case "toggleMusic":
            mbToggle();
            break;
          case "secret":
            document.body.classList.toggle("secret-ayan");
            break;
            




          case "konami":
            document.body.style.filter = "invert(1)";
            setTimeout(() => (document.body.style.filter = ""), 800);
            break;
        }
      }

      /* ── CLOCK ── */
      function tick() {
        const t = new Date().toLocaleTimeString("en-IN", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        const navClock = document.getElementById("navClock");
        if (navClock) navClock.textContent = t;
      }
      tick();
      setInterval(tick, 1000);

      /* ── SCROLL NAV ── */
      function scrollToSection(id, delay) {
        if(window.playExtra) window.playExtra('glitch');
        setTimeout(() => {
          if (typeof window.showSection === 'function') {
            window.showSection(id);
          }
        }, delay || 50);
      }

      /* ── CANVAS PARTICLES ── */
      const canvas = document.getElementById("bgCanvas");
      const ctx = canvas.getContext("2d");
      let W = (canvas.width = window.innerWidth);
      let H = (canvas.height = window.innerHeight);
      const isSecret = () => document.body.classList.contains("secret-ayan");

      const particles = [];
      const NPARTICLES = window.innerWidth < 700 ? 30 : 65;
      const mouse = { x: null, y: null, radius: 100 };

      window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      });
      window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
      });
      window.addEventListener("touchmove", (e) => {
        if (e.touches.length) {
          mouse.x = e.touches[0].clientX;
          mouse.y = e.touches[0].clientY;
        }
      });
      window.addEventListener("touchend", () => {
        mouse.x = null;
        mouse.y = null;
      });
      window.addEventListener("resize", () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        particles.length = 0;
        initP();
      });

      class Particle {
        constructor() {
          this.reset();
        }
        reset() {
          this.x = Math.random() * W;
          this.y = Math.random() * H;
          this.size = Math.random() * 1.5 + 0.5;
          this.vx = (Math.random() - 0.5) * 0.3;
          this.vy = (Math.random() - 0.5) * 0.3;
          this.op = Math.random() * 0.25 + 0.05;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > W) this.vx *= -1;
          if (this.y < 0 || this.y > H) this.vy *= -1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

          // Dynamically convert the current accent color hex to RGB for the canvas
          const hex = window.currentAccentHex || "#00FF41";
          let r = parseInt(hex.slice(1, 3), 16) || 0;
          let g = parseInt(hex.slice(3, 5), 16) || 255;
          let b = parseInt(hex.slice(5, 7), 16) || 65;

          ctx.fillStyle = isSecret()
            ? `rgba(0,255,65,${this.op})`
            : `rgba(${r},${g},${b},${this.op})`;
          ctx.fill();
        }
      }
      function initP() {
        for (let i = 0; i < NPARTICLES; i++) particles.push(new Particle());
      }
      initP();

      function animateCanvas() {
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = isSecret()
                ? `rgba(0,255,65,${0.1 - (dist / 100) * 0.1})`
                : `rgba(255,255,255,${0.15 - (dist / 100) * 0.15})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
          if (mouse.x != null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = isSecret()
                ? `rgba(0,255,65,${0.4 - (dist / mouse.radius) * 0.4})`
                : `rgba(255,69,0,${0.4 - (dist / mouse.radius) * 0.4})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(animateCanvas);
      }
      animateCanvas();

      /* ── MODAL ── */
      function openArchive() {
        document.getElementById("archiveModal").classList.add("on");
        if (window.heheBoiSfx) {
          window.heheBoiSfx.currentTime = 0;
          window.heheBoiSfx.play().catch(e => console.log(e));
        }
      }
      function closeArchive() {
        document.getElementById("archiveModal").classList.remove("on");
      }
      document
        .getElementById("archiveModal")
        .addEventListener("click", function (e) {
          if (e.target === this) closeArchive();
        });

      /* ── LANG BARS ── */
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              document.querySelectorAll(".lang-fill").forEach((bar) => {
                bar.style.width = "0%";
                requestAnimationFrame(() =>
                  requestAnimationFrame(() => {
                    bar.style.width = (bar.dataset.pct || 0) + "%";
                  }),
                );
              });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.3 },
      );
      const langSection = document.getElementById("langBars");
      if (langSection) observer.observe(langSection);

      /* ── 3D TILT CARDS ── */
      if (window.innerWidth > 700) {
        document.addEventListener("mousemove", function (e) {
          document
            .querySelectorAll(
              "#mainToolsGrid > div, #skills .brutal-border, #projects .project-card, #statsGrid > div",
            )
            .forEach((card) => {
              const r = card.getBoundingClientRect();
              if (!r.width) return;
              const x = e.clientX - r.left,
                y = e.clientY - r.top;
              if (x >= 0 && x <= r.width && y >= 0 && y <= r.height) {
                const rx = ((y - r.height / 2) / (r.height / 2)) * -5;
                const ry = ((x - r.width / 2) / (r.width / 2)) * 5;
                card.style.transition = "transform 0.05s";
                card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
              } else {
                card.style.transition = "transform 0.3s";
                card.style.transform =
                  "perspective(700px) rotateX(0) rotateY(0) scale3d(1,1,1)";
              }
            });
        });
      }
      if (window.DeviceOrientationEvent && window.innerWidth <= 700) {
        window.addEventListener("deviceorientation", function (e) {
          let tiltX = e.beta;
          let tiltY = e.gamma;
          if (tiltX === null || tiltY === null) return;
          tiltX = Math.max(-15, Math.min(15, tiltX));
          tiltY = Math.max(-15, Math.min(15, tiltY));
          const rx = tiltX * 0.4;
          const ry = tiltY * 0.4;
          document
            .querySelectorAll(
              "#mainToolsGrid > div, #skills .brutal-border, #projects .project-card, #statsGrid > div",
            )
            .forEach((card) => {
              card.style.transition = "transform 0.1s ease-out";
              card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
            });
        });
      }

      /* ── MAGNETIC BUTTONS ── */
      if (window.innerWidth > 700) {
        document.querySelectorAll(".magnetic-btn").forEach((btn) => {
          btn.addEventListener("mousemove", (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
          });
          btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translate(0,0)";
          });
        });
      }

      /* ── AI TYPING BIO ── */
      const bioFull =
        "Hi! I'm a 16 y/o developer who genuinely loves bringing ideas to life through code. I'm a frontend and backend enthusiast, but at heart, I'm a total backend and AI nerd. Lately, I've been spending most of my time writing Python and C, and diving deep into how the latest AI tools actually work under the hood.\n\nMy ultimate goal is to build scalable, AI-driven infrastructure that solves real-world problems. When I actually force myself to step away from the keyboard, I'm usually exploring the internet, trying out new things, or just listening to good music and learning as much as I can.\n\nI'm always open to chatting about AI, brainstorming ideas, or collaborating on cool projects, so feel free to hit me up. Thanks for checking out my little corner of the internet!";
      let bioTyped = false;
      function startBioTyping() {
        if (bioTyped) return;
        bioTyped = true;
        const tgt = document.getElementById("aiBioTarget");
        const cur = document.getElementById("bioCursor");
        const hContainer = document.getElementById("hobbiesContainer");

        if (cur) cur.style.display = "none";
        if (hContainer) {
          hContainer.style.opacity = "1";
          hContainer.style.pointerEvents = "all";
        }
      }
      const bioObserver = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !bioTyped) startBioTyping();
        },
        { threshold: 0.1 },
      );
      const aboutSec = document.getElementById("about");
      if (aboutSec) bioObserver.observe(aboutSec);

      function checkBucketListPasscode() {
        const bl = document.getElementById('bucketList');
        const hl = document.getElementById('hobbiesList');
        
        if (bl.classList.contains('show-hobbies')) {
          bl.classList.remove('show-hobbies');
          return;
        }

        const pass = prompt("[ SYSTEM ALERT ] This file is encrypted. Enter passcode:");
        if (pass === null) return;

        const cleanPass = pass.toLowerCase().replace(/[^a-z]/g, '');
        if (cleanPass === "ilovetech") {
          bl.classList.add('show-hobbies');
          if (hl) hl.classList.remove('show-hobbies');
        } else {
          alert("Access Denied! Nice try though. Hint: What's the one thing that connects us? (3 words)");
        }
      }

      /* ── QUOTE ROTATOR ── */
      const quotes = [
        {
          text: "The best way to predict the future is to invent it.",
          author: "Alan Kay",
        },
        { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
        {
          text: "First, solve the problem. Then, write the code.",
          author: "John Johnson",
        },
        {
          text: "Any sufficiently advanced technology is indistinguishable from magic.",
          author: "Arthur C. Clarke",
        },
        {
          text: "Code is like humor. When you have to explain it, it's bad.",
          author: "Cory House",
        },
        {
          text: "Simplicity is the soul of efficiency.",
          author: "Austin Freeman",
        },
      ];

      /* ── SCROLL REVEAL OBSERVER ── */
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("animate-in");
        revealObserver.unobserve(el); // Reset state
        revealObserver.observe(el);
      });
      /* ── MOBILE MENU BINDINGS ── */
      const mobileMenuBtn = document.getElementById("mobileMenuBtn");
      const mobileMenuDropdown = document.getElementById("mobileMenuDropdown");
      const mobileThemesContainer = document.getElementById(
        "mobileThemesContainer",
      );

      function toggleMobileMenu(e) {
        if (e) e.preventDefault();
        // Get the computed style to avoid first-click failures if it was hidden via CSS classes initially
        const isHidden = window.getComputedStyle(mobileMenuDropdown).display === "none";
        
        if (!isHidden) {
          mobileMenuDropdown.style.display = "none";
          mobileThemesContainer.style.display = "none";
          mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        } else {
          mobileMenuDropdown.style.display = "flex";
          mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
      }

      function toggleMobilePalette(e) {
        e.stopPropagation();
        if (mobileThemesContainer.style.display === "flex") {
          mobileThemesContainer.style.display = "none";
        } else {
          mobileThemesContainer.style.display = "flex";
        }
      }

      if (mobileMenuBtn) {
        // Use both touchstart and click to prevent double-tap issues on iOS
        mobileMenuBtn.addEventListener("touchstart", function(e) { e.preventDefault(); toggleMobileMenu(e); }, {passive: false});
        mobileMenuBtn.addEventListener("click", toggleMobileMenu);
      }
      
      const mobileMusicBtnNode = document.getElementById("mobileMusicBtn");
      if (mobileMusicBtnNode) {
        mobileMusicBtnNode.addEventListener("touchstart", function(e) { e.preventDefault(); toggleMobilePlayer(e); }, {passive: false});
        mobileMusicBtnNode.addEventListener("click", toggleMobilePlayer);
      }

      /*  MUSIC PLAYER MOBILE CLICK LOGIC  */
      const musicContainer = document.querySelector(".music-mini-player-container");
      if (musicContainer) {
        musicContainer.addEventListener("click", function(e) {
          // Toggle open class on click
          this.classList.toggle("open");
          e.stopPropagation(); // prevent document click from firing immediately
        });
        // Close when tapping anywhere else on the screen
        document.addEventListener("click", function(e) {
          if (musicContainer.classList.contains("open") && !musicContainer.contains(e.target)) {
            musicContainer.classList.remove("open");
          }
        });
      }

      /*  BOOT SCREEN INITIAL SCROLL LOCK  */
      const initialBootScreen = document.getElementById("bootScreen");
      if (initialBootScreen && !initialBootScreen.classList.contains("done")) {
         document.body.style.overflow = "hidden";
         document.documentElement.style.overflow = "hidden";
      }

      /*  EMAIL SLIDER INTERACTIVE LOGIC  */
      const mailSlider = document.getElementById("mailSlider");
      const sliderThumb = document.getElementById("sliderThumb");
      const sliderFill = document.getElementById("sliderFill");
      const sliderText = document.getElementById("sliderText");

      if (mailSlider && sliderThumb && sliderFill && sliderText) {
        let isDragging = false;
        let startX = 0;
        let startLeft = 4;
        let maxSlide = 0;
        let unlocked = false;

        function getClientX(e) {
          return e.touches ? e.touches[0].clientX : e.clientX;
        }

        function startDrag(e) {
          if (unlocked) return;
          isDragging = true;
          startX = getClientX(e);
          const style = window.getComputedStyle(sliderThumb);
          startLeft = parseInt(style.left, 10) || 4;
          maxSlide = mailSlider.clientWidth - sliderThumb.clientWidth - 8;
          sliderThumb.style.transition = "none";
          sliderFill.style.transition = "none";
          document.body.style.userSelect = "none";
        }

        function dragMove(e) {
          if (!isDragging || unlocked) return;
          const currentX = getClientX(e);
          const dx = currentX - startX;
          let newLeft = startLeft + dx;

          if (newLeft < 4) newLeft = 4;
          if (newLeft > maxSlide + 4) newLeft = maxSlide + 4;

          sliderThumb.style.left = newLeft + "px";
          sliderFill.style.width = newLeft + sliderThumb.clientWidth / 2 + "px";

          const pct = (newLeft - 4) / maxSlide;
          if (pct >= 0.98) {
            triggerUnlock();
          }
        }

        function endDrag() {
          if (!isDragging || unlocked) return;
          isDragging = false;
          document.body.style.userSelect = "";

          sliderThumb.style.transition = "left 0.3s ease";
          sliderFill.style.transition = "width 0.3s ease";
          sliderThumb.style.left = "4px";
          sliderFill.style.width = "0px";
        }

        function triggerUnlock() {
          unlocked = true;
          isDragging = false;
          document.body.style.userSelect = "";

          sliderThumb.style.transition = "all 0.3s ease";
          sliderFill.style.transition = "all 0.3s ease";
          sliderThumb.style.left = maxSlide + 4 + "px";
          sliderFill.style.width = "100%";

          mailSlider.classList.add("unlocked");
          sliderThumb.innerHTML = "✔";
          sliderText.innerHTML = "✔ EMAIL COPIED!";
          sfx.success();

          // Copy email to clipboard
          navigator.clipboard
            .writeText("cleverai001@gmail.com")
            .then(() => {
              console.log("Copied to clipboard");
            })
            .catch(() => {
              const textarea = document.createElement("textarea");
              textarea.value = "cleverai001@gmail.com";
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand("copy");
              document.body.removeChild(textarea);
            });
        }

        // Mouse Listeners
        sliderThumb.addEventListener("mousedown", startDrag);
        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", endDrag);

        // Touch Listeners
        sliderThumb.addEventListener("touchstart", startDrag);
        document.addEventListener("touchmove", dragMove);
        document.addEventListener("touchend", endDrag);

        // Handle resize dynamics
        window.addEventListener("resize", () => {
          if (unlocked) {
            maxSlide = mailSlider.clientWidth - sliderThumb.clientWidth - 8;
            sliderThumb.style.left = maxSlide + 4 + "px";
          }
        });
      }
    