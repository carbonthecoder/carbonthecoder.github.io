const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const dynamicProjectLogic = `
<script>
  window.addEventListener('DOMContentLoaded', () => {
    // Populate Bio from data store (handled in bioFull var)
    
    // Populate Projects
    if (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) {
      const projContainer = document.getElementById('dynamicProjectsContainer');
      if (projContainer) {
        projContainer.innerHTML = ''; // clear dummy slots
        
        window.PORTFOLIO_DATA.projects.forEach(proj => {
          let tagsHtml = '';
          if (proj.tags && proj.tags.length > 0) {
            tagsHtml = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:16px;">' + 
              proj.tags.map(t => '<span style="font-size:9px;padding:4px 8px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);border-radius:2px;">'+t+'</span>').join('') + 
              '</div>';
          }
          
          const cardHtml = \`
            <a href="\${proj.link || '#'}" class="project-card brutal-border" style="padding:24px;background:rgba(255,255,255,0.01);min-height:160px;display:flex;flex-direction:column;justify-content:center;text-decoration:none;">
              <div style="font-size:16px;font-weight:800;color:var(--accent-color);margin-bottom:8px;">\${proj.title}</div>
              <p style="font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;margin:0;">\${proj.description}</p>
              \${tagsHtml}
            </a>
          \`;
          projContainer.innerHTML += cardHtml;
        });
      }
    }
  });
</script>
</body>`;

html = html.replace('</body>', dynamicProjectLogic);
fs.writeFileSync('index.html', html);
console.log('Project injection logic added.');
