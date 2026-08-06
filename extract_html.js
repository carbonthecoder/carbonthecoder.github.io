const fs = require('fs');
const readline = require('readline');
const path = require('path');

const transcriptPath = 'C:\\Users\\Ayanimaad\\.gemini\\antigravity\\brain\\e837c5ac-0caa-4310-a96e-cf81c9900028\\.system_generated\\logs\\transcript_full.jsonl';
const targetPath = 'C:\\Users\\Ayanimaad\\.gemini\\antigravity\\scratch\\portfolio\\index.html';

async function processTranscript() {
  const fileStream = fs.createReadStream(transcriptPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let latestHtml = null;

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'USER_INPUT' && entry.content.includes('<!DOCTYPE html>')) {
        // Extract everything between <!DOCTYPE html> and </html>
        const match = entry.content.match(/<!DOCTYPE html>[\s\S]*?<\/html>/);
        if (match) {
          latestHtml = match[0];
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  if (latestHtml) {
    fs.writeFileSync(targetPath, latestHtml, 'utf8');
    console.log('Successfully restored HTML from conversation history!');
  } else {
    console.log('Could not find HTML in conversation history.');
  }
}

processTranscript();
