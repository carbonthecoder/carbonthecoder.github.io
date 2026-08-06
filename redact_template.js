const fs = require('fs');
let html = fs.readFileSync('template.html', 'utf8');

// Title & Meta
html = html.replace('<title>MOHAMMED_IBRAHIM // BACKEND_ENGINEER</title>', '<title>[YOUR_NAME] // [YOUR_ROLE]</title>');
html = html.replace('Mohammed Ibrahim (Ayan) — 17 y/o backend engineer aspirant. Python, C, SQL, Linux, Git/GitHub. Hyderabad, IN.', '[YOUR NAME] — [YOUR AGE] y/o [YOUR ROLE]. [YOUR SKILLS]. [YOUR LOCATION].');

// Lore Drop / Header
html = html.replace('Mohammed Ibrahim, Alias Ayan/Ibu &nbsp;·&nbsp; 17 y/o &nbsp;·&nbsp; Hyderabad, IN 🇮🇳', '[YOUR FULL NAME], Alias [NICKNAME] &nbsp;·&nbsp; [YOUR AGE] y/o &nbsp;·&nbsp; [YOUR LOCATION] 📍');

// Bio
html = html.replace(
  'const bioFull = "I\\'m a 17 y/o tech enthusiast who enjoys making things that actually work — whether it\\'s code or learning something new, I always try to upskill myself.\\n\\nWhen I\\'m not locked in on VS Code, I\\'m probably touching grass, binge-watching anime, or raging in competitive games.";',
  'const bioFull = "I\\'m a [YOUR AGE] y/o [YOUR ROLE] who enjoys making things that actually work — whether it\\'s code or learning something new, I always try to upskill myself.\\n\\nWhen I\\'m not locked in on VS Code, I\\'m probably touching grass, binge-watching anime, or raging in competitive games. [WRITE YOUR OWN BIO HERE]";'
);

// Stats
html = html.replace('17</div>\\n        <div style="font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;">Lvl (Years)', '[AGE]</div>\\n        <div style="font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;">Lvl (Years)');
html = html.replace('8.2 CGPA</div>\\n        <div style="font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;">Academic Validation', '[YOUR STAT]</div>\\n        <div style="font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;">[STAT DESCRIPTION]');

// Projects (Lalynd, Zeno, Hydra)
html = html.replace('Lalynd (Discord Bot)', '[PROJECT 1 TITLE]');
html = html.replace('Carrying 35k+ users in my backpack. A monolithic Discord bot that refuses to crash.', '[PROJECT 1 DESCRIPTION GOES HERE]');

html = html.replace('Zeno (Music Platform)', '[PROJECT 2 TITLE]');
html = html.replace('Vibe syncing protocol. I built this because Spotify group sessions kept lagging.', '[PROJECT 2 DESCRIPTION GOES HERE]');

html = html.replace('Hydra (Load Balancer)', '[PROJECT 3 TITLE]');
html = html.replace('Go goes brrrrr. A lightweight L4 load balancer that actually balances.', '[PROJECT 3 DESCRIPTION GOES HERE]');

// Form Key
html = html.replace('name="access_key" value="fa7713ab-b1f3-468e-ae71-f591159d23cd"', 'name="access_key" value="[YOUR_WEB3FORMS_ACCESS_KEY_HERE]"');
html = html.replace("const FORM_ACCESS_KEY = 'fa7713ab-b1f3-468e-ae71-f591159d23cd';", "const FORM_ACCESS_KEY = '[YOUR_WEB3FORMS_ACCESS_KEY_HERE]';");

// Emails & Socials
html = html.replace(/cleverai001@gmail\.com/g, '[YOUR_EMAIL@GMAIL.COM]');
html = html.replace('href="https://discord.com/users/versatileayann"', 'href="[YOUR_DISCORD_LINK]"');
html = html.replace('href="https://github.com/mrayannn18"', 'href="[YOUR_GITHUB_LINK]"');
html = html.replace('href="https://twitter.com/Ayanx18"', 'href="[YOUR_TWITTER_LINK]"');
html = html.replace('mrayannn18', '[YOUR_GITHUB_USERNAME]');
html = html.replace('Ayanx18', '[YOUR_TWITTER_USERNAME]');
html = html.replace('versatileayann', '[YOUR_DISCORD_USERNAME]');

// Name Glow Effect
html = html.replace('MOHAMMED', '[FIRST');
html = html.replace('IBRAHIM', 'NAME]');

fs.writeFileSync('template.html', html);
console.log('Template created with redacted info.');
