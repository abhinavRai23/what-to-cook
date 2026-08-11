const fs = require('fs');

const content = fs.readFileSync('/Users/abhinavrai/.gemini/antigravity-ide/brain/497203e5-f8cb-48c2-ae29-7dc41322cfd9/.system_generated/steps/116/content.md', 'utf-8');

const regex = /<a[^>]+href="([^">]+recipe[^">]*)"[^>]*>(.*?)<\/a>/gi;
let match;
const recipes = new Set();

while ((match = regex.exec(content)) !== null) {
  let title = match[2].replace(/<[^>]+>/g, '').trim();
  if (title && title.length > 3) {
    recipes.add(title);
  }
}

console.log(Array.from(recipes).join('\n'));
