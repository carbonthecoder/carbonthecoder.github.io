const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove script imports
html = html.replace('  <!-- CMS DATA STORE & ADMIN SCRIPT -->\\n  <script src="data.js"></script>\\n  <script src="admin.js"></script>', '');

// 2. Restore Bio
html = html.replace('const bioFull = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.bio) ? window.PORTFOLIO_DATA.bio : "I\\'m a 17 y/o tech enthusiast who enjoys making things that actually work — whether it\\'s code or learning something new, I always try to upskill myself.\\n\\nWhen I\\'m not locked in on VS Code, I\\'m probably touching grass, binge-watching anime, or raging in competitive games.";', 'const bioFull = "I\\'m a 17 y/o tech enthusiast who enjoys making things that actually work — whether it\\'s code or learning something new, I always try to upskill myself.\\n\\nWhen I\\'m not locked in on VS Code, I\\'m probably touching grass, binge-watching anime, or raging in competitive games.";');

// 3. Restore Projects HTML (Hardcoded for easy editing)
const dynamicProjectsGrid = \`      <div id="dynamicProjectsContainer" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
        <!-- SLOT 1 -->
        <div class="project-card brutal-border" style="padding:24px;background:rgba(255,255,255,0.01);min-height:160px;display:flex;align-items:center;justify-content:center;border-style:dashed;">
          <span style="font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:2px;font-weight:700;">[ SLOT AVAILABLE ]</span>
        </div>
        <!-- SLOT 2 -->
        <div class="project-card brutal-border" style="padding:24px;background:rgba(255,255,255,0.01);min-height:160px;display:flex;align-items:center;justify-content:center;border-style:dashed;">
          <span style="font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:2px;font-weight:700;">[ SLOT AVAILABLE ]</span>
        </div>
        <!-- SLOT 3 -->
        <div class="project-card brutal-border" style="padding:24px;background:rgba(255,255,255,0.01);min-height:160px;display:flex;align-items:center;justify-content:center;border-style:dashed;">
          <span style="font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:2px;font-weight:700;">[ SLOT AVAILABLE ]</span>
        </div>
      </div>\`;

const staticProjectsGrid = \`      <!-- ====== EDIT PROJECTS HERE ====== -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
        
        <!-- PROJECT 1 -->
        <a href="#" class="project-card brutal-border" style="padding:24px;background:rgba(255,255,255,0.01);min-height:160px;display:flex;flex-direction:column;justify-content:center;text-decoration:none;">
          <div style="font-size:16px;font-weight:800;color:var(--accent-color);margin-bottom:8px;">Lalynd (Discord Bot)</div>
          <p style="font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0;">Carrying 35k+ users in my backpack. A monolithic Discord bot that refuses to crash.</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:16px;">
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">Python</span>
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">PostgreSQL</span>
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">Discord.py</span>
          </div>
        </a>

        <!-- PROJECT 2 -->
        <a href="#" class="project-card brutal-border" style="padding:24px;background:rgba(255,255,255,0.01);min-height:160px;display:flex;flex-direction:column;justify-content:center;text-decoration:none;">
          <div style="font-size:16px;font-weight:800;color:var(--accent-color);margin-bottom:8px;">Zeno (Music Platform)</div>
          <p style="font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0;">Vibe syncing protocol. I built this because Spotify group sessions kept lagging.</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:16px;">
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">FastAPI</span>
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">React</span>
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">WebSockets</span>
          </div>
        </a>

        <!-- PROJECT 3 -->
        <a href="#" class="project-card brutal-border" style="padding:24px;background:rgba(255,255,255,0.01);min-height:160px;display:flex;flex-direction:column;justify-content:center;text-decoration:none;">
          <div style="font-size:16px;font-weight:800;color:var(--accent-color);margin-bottom:8px;">Hydra (Load Balancer)</div>
          <p style="font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0;">Go goes brrrrr. A lightweight L4 load balancer that actually balances.</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:16px;">
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">Go</span>
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">Networking</span>
            <span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">Linux</span>
          </div>
        </a>
      </div>\`;

html = html.replace(dynamicProjectsGrid, staticProjectsGrid);

// 4. Remove the injected Project script logic at the bottom
const scriptRegex = /<script>\\s*window\\.addEventListener\\('DOMContentLoaded', \\(\\) => \\{\\s*\/\/ Populate Bio[\\s\\S]*?<\\/script>\\s*<\\/body>/;
html = html.replace(scriptRegex, '</body>');

// 5. Add a giant comment banner before bioFull to show where to edit
const oldBioMarker = '/* ── AI TYPING BIO ── */';
const newBioMarker = \`/* =========================================
   EDIT YOUR BIO TEXT HERE!
   ========================================= */\`;
html = html.replace(oldBioMarker, newBioMarker);

fs.writeFileSync('index.html', html);
console.log('Reverted to static architecture.');
