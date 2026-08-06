const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The new improved floating skills script
const newScript = `
<!-- Floating Skill Icons -->
<script>
document.addEventListener("DOMContentLoaded", () => {
  // Target Arsenal, Lingo, and Toolkit
  const skillSpans = document.querySelectorAll('#skills span.brutal-border, #langBars > div, #mainToolsGrid > div.draw-card');
  
  // Create a floating element
  const floater = document.createElement('div');
  floater.style.position = 'fixed';
  floater.style.pointerEvents = 'none';
  floater.style.opacity = '0';
  floater.style.transition = 'opacity 0.2s ease, transform 0.1s linear';
  floater.style.zIndex = '999999';
  floater.style.transform = 'translate(-50%, -100%)';
  floater.style.filter = 'drop-shadow(0 0 15px var(--accent-color))';
  document.body.appendChild(floater);
  
  // Map words to SVGs from simpleicons for the "Arsenal" section that doesn't have imgs
  const arsenalToSvg = {
    'server': 'https://cdn.simpleicons.org/linux/ffffff',
    'database': 'https://cdn.simpleicons.org/postgresql/ffffff',
    'api': 'https://cdn.simpleicons.org/postman/ffffff',
    'security': 'https://cdn.simpleicons.org/kalilinux/ffffff',
    'web': 'https://cdn.simpleicons.org/w3c/ffffff',
    'linux': 'https://cdn.simpleicons.org/gnubash/ffffff'
  };

  skillSpans.forEach(el => {
    el.style.cursor = 'pointer'; 
    
    el.addEventListener('mouseenter', () => {
      // Check if it has an image inside (Lingo and Toolkit)
      const img = el.querySelector('img');
      let src = '';
      
      if (img) {
        src = img.src;
      } else {
        // Fallback for Arsenal items
        const text = el.innerText.toLowerCase();
        for (let key in arsenalToSvg) {
          if (text.includes(key)) {
            src = arsenalToSvg[key];
            break;
          }
        }
      }
      
      if (src) {
        floater.innerHTML = \`<img src="\${src}" style="width: 48px; height: 48px; object-fit: contain;">\`;
      } else {
        // Ultimate fallback to an emoji if no image is found
        floater.innerHTML = '<span style="font-size:48px;">✨</span>';
      }
      
      floater.style.opacity = '1';
    });
    
    el.addEventListener('mousemove', (e) => {
      floater.style.left = e.clientX + 'px';
      floater.style.top = (e.clientY - 20) + 'px';
      // Add a slight wobble effect
      floater.style.transform = \`translate(-50%, -100%) rotate(\${(e.clientX % 10) - 5}deg) scale(1.5)\`;
    });
    
    el.addEventListener('mouseleave', () => {
      floater.style.opacity = '0';
      floater.style.transform = 'translate(-50%, -100%) rotate(0deg) scale(1)';
    });
  });
});
</script>
`;

// Replace old script
const oldScriptRegex = /<!-- Floating Skill Icons -->[\s\S]*?<\/script>/;
if (oldScriptRegex.test(html)) {
  html = html.replace(oldScriptRegex, newScript);
  fs.writeFileSync('index.html', html);
  console.log("Replaced old floating script with the SVG-based one.");
} else {
  // If it wasn't found for some reason, just append it
  html = html.replace('</body>', newScript + '\n</body>');
  fs.writeFileSync('index.html', html);
  console.log("Appended new floating script.");
}
