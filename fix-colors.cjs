const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'Pages', 'DashboardDetail');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace text neon colors with softer/darker variants
  content = content.replace(/text-cyan-400/g, 'text-cyan-600');
  content = content.replace(/text-emerald-400/g, 'text-emerald-600');
  content = content.replace(/text-amber-400/g, 'text-orange-600');
  content = content.replace(/text-amber-500/g, 'text-orange-600');
  content = content.replace(/text-purple-400/g, 'text-purple-600');
  content = content.replace(/text-indigo-400/g, 'text-indigo-600');

  // Replace background opacity with solid pastels
  content = content.replace(/bg-cyan-500\/10/g, 'bg-cyan-50');
  content = content.replace(/bg-emerald-500\/10/g, 'bg-emerald-50');
  content = content.replace(/bg-amber-500\/10/g, 'bg-orange-50');
  content = content.replace(/bg-purple-500\/10/g, 'bg-purple-50');
  content = content.replace(/bg-indigo-500\/20/g, 'bg-indigo-50');
  content = content.replace(/bg-indigo-500\/10/g, 'bg-indigo-50');

  // Replace border opacity with solid borders
  content = content.replace(/border-cyan-500\/20/g, 'border-cyan-200');
  content = content.replace(/border-emerald-500\/20/g, 'border-emerald-200');
  content = content.replace(/border-amber-500\/20/g, 'border-orange-200');
  content = content.replace(/border-purple-500\/20/g, 'border-purple-200');
  content = content.replace(/border-indigo-500\/20/g, 'border-indigo-200');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${path.basename(filePath)}`);
  }
};

const walkSync = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkSync(filePath);
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      replaceInFile(filePath);
    }
  }
};

walkSync(dir);
console.log("Done fixing eye straining colors.");
