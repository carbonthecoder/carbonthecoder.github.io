
      document.addEventListener("DOMContentLoaded", () => {
        // 1. Flashlight Cursor
        const flashlight = document.getElementById("cursorFlashlight");
        if (flashlight) {
          document.addEventListener("mousemove", (e) => {
            let colorHex =
              window
                .getComputedStyle(document.body)
                .getPropertyValue("--accent-color")
                .trim() || "#FF3300";
            let r = parseInt(colorHex.slice(1, 3), 16) || 255;
            let g = parseInt(colorHex.slice(3, 5), 16) || 51;
            let b = parseInt(colorHex.slice(5, 7), 16) || 0;
            flashlight.style.background = `radial-gradient(circle 400px at ${e.clientX}px ${e.clientY}px, rgba(${r}, ${g}, ${b}, 0.03), transparent 80%)`;
          });
        }

        // 2. IST Timezone Clock
        const timeMetric = document.getElementById("timeMetric");
        if (timeMetric) {
          setInterval(() => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: false,
            });
            timeMetric.innerText = `${timeStr} IST`;
          }, 1000);
        }

        // 3. Matrix Rain Easter Egg
        const matrixCanvas = document.getElementById("matrixCanvas");
        const navLogo = document.getElementById("navLogo");
        let matrixRunning = false;

        if (matrixCanvas && navLogo) {
          const ctx = matrixCanvas.getContext("2d");
          let width = (matrixCanvas.width = window.innerWidth);
          let height = (matrixCanvas.height = window.innerHeight);
          const letters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン";
          const charArray = letters.split("");
          const fontSize = 16;
          let columns = width / fontSize;
          const drops = [];
          for (let x = 0; x < columns; x++) drops[x] = 1;

          let matrixInterval;

          function drawMatrix() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, width, height);
            ctx.fillStyle = "#0F0";
            ctx.font = fontSize + "px monospace";

            for (let i = 0; i < drops.length; i++) {
              const text =
                charArray[Math.floor(Math.random() * charArray.length)];
              ctx.fillText(text, i * fontSize, drops[i] * fontSize);

              if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
              }
              drops[i]++;
            }
          }

          navLogo.addEventListener("dblclick", () => {
            if (!matrixRunning) {
              matrixRunning = true;
              matrixCanvas.style.opacity = "0.5"; // Keeping it semi-transparent so you can still read the site
              matrixInterval = setInterval(drawMatrix, 33);

              if (window.playExtra) {
                window.playExtra('zaWarudo');
              } else if (window.punchSfx) {
                window.punchSfx.currentTime = 0;
                window.punchSfx.play().catch(() => {});
              }

              // Auto-stop after 10 seconds
              setTimeout(() => {
                matrixCanvas.style.opacity = "0";
                setTimeout(() => {
                  clearInterval(matrixInterval);
                  matrixRunning = false;
                  // Clear canvas entirely
                  ctx.clearRect(0, 0, width, height);
                  drops.fill(1);
                }, 1000);
              }, 10000);
            }
          });

          window.addEventListener("resize", () => {
            width = matrixCanvas.width = window.innerWidth;
            height = matrixCanvas.height = window.innerHeight;
            columns = width / fontSize;
            while (drops.length < columns) drops.push(1);
          });
        }

        // Add Mario 1-UP sound to all skill bars
        document.querySelectorAll('.skill-bar-inner').forEach(bar => {
          bar.parentElement.style.cursor = 'pointer';
          bar.parentElement.addEventListener('click', () => { 
            if(window.playExtra) window.playExtra('mario1Up'); 
          });
        });

        // Scroll listener for the bottom of the page
        let endSoundPlayed = false;
        let topSoundPlayed = true; // start true so it doesn't play immediately on load
        window.addEventListener("scroll", () => {
          if (window.innerWidth <= 768) return; // Disable top/bottom scroll sounds on mobile
          // Check if user is near the bottom (within 20px)
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 20) {
            if (!endSoundPlayed && window.endSfx) {
              endSoundPlayed = true;
              window.endSfx.currentTime = 0;
              window.endSfx.play().catch(e => console.log(e));
            }
          } else if ((window.innerHeight + window.scrollY) < document.body.offsetHeight - 200) {
            // Reset if they scroll back up a bit so it can trigger again later
            endSoundPlayed = false;
          }

          // Check if user rapidly scrolls back to the VERY top
          if (window.scrollY <= 10) {
            if (!topSoundPlayed && window.playExtra) {
              topSoundPlayed = true;
              window.playExtra('pipe');
            }
          } else if (window.scrollY > 200) {
            topSoundPlayed = false;
          }
        });

        // 5-Second Stare (NANI?!)
        const mainTitle = document.querySelector('.hero-title');
        let naniTimer = null;
        if(mainTitle) {
          mainTitle.addEventListener('mouseenter', () => {
            naniTimer = setTimeout(() => {
              if(window.playExtra) window.playExtra('nani');
            }, 5000);
          });
          mainTitle.addEventListener('mouseleave', () => {
            clearTimeout(naniTimer);
          });
        }

        // Spotify DJ Airhorn
        const spotifyBtn = document.querySelector('.spotify-shock-btn');
        if(spotifyBtn) {
          spotifyBtn.addEventListener('click', () => {
            if(window.playExtra) window.playExtra('djAirhorn');
          });
        }


        // Global Spam Click Tracker (Website Soul)
        let globalClickCount = 0;
        let globalClickTimer = null;
        window.addEventListener('click', () => {
          globalClickCount++;
          if(globalClickTimer) clearTimeout(globalClickTimer);
          globalClickTimer = setTimeout(() => { globalClickCount = 0; }, 300); // 300ms reset for REAL spam
          
          if(globalClickCount >= 5) { // 5 rapid clicks triggers it
            globalClickCount = 0;
            if(window.playExtra) window.playExtra('chicken'); // Screaming Chicken sound
          }
        });
        // Magnetic Buttons Logic
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
          btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const h = rect.width / 2;
            const v = rect.height / 2;
            const x = e.clientX - rect.left - h;
            const y = e.clientY - rect.top - v;
            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
          });
          btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0px, 0px)';
          });
        });

        // Project Card Glow Logic
        document.querySelectorAll('.project-card').forEach(card => {
          card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
          });
        });

        // Scroll Fade-in Intersection Observer
        const scrollObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              scrollObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        // Apply scroll-fade class to key sections and observe
        const sectionsToFade = document.querySelectorAll('.project-card, .skill-pill, .stat-item, h2');
        sectionsToFade.forEach(el => {
          el.classList.add('scroll-fade');
          scrollObserver.observe(el);
        });
      });
    