const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replaceInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace tailwind utility classes for indigo with cyan
  content = content.replace(/bg-indigo-/g, 'bg-cyan-');
  content = content.replace(/text-indigo-/g, 'text-cyan-');
  content = content.replace(/border-indigo-/g, 'border-cyan-');
  content = content.replace(/ring-indigo-/g, 'ring-cyan-');
  content = content.replace(/shadow-indigo-/g, 'shadow-cyan-');
  content = content.replace(/from-indigo-/g, 'from-cyan-');
  content = content.replace(/to-indigo-/g, 'to-cyan-');
  content = content.replace(/via-indigo-/g, 'via-cyan-');
  content = content.replace(/focus:border-indigo-/g, 'focus:border-cyan-');
  content = content.replace(/focus:ring-indigo-/g, 'focus:ring-cyan-');
  content = content.replace(/hover:bg-indigo-/g, 'hover:bg-cyan-');
  content = content.replace(/hover:text-indigo-/g, 'hover:text-cyan-');
  content = content.replace(/hover:border-indigo-/g, 'hover:border-cyan-');
  content = content.replace(/active:bg-indigo-/g, 'active:bg-cyan-');
  content = content.replace(/group-hover:text-indigo-/g, 'group-hover:text-cyan-');
  content = content.replace(/group-hover:bg-indigo-/g, 'group-hover:bg-cyan-');
  
  // Specific variable replacements if any
  content = content.replace(/var\(--accent-indigo\)/g, 'var(--accent-cyan)');
  
  // Custom case for gradients where we had purple before, let's swap purple to sky for better blue/cyan gradients
  content = content.replace(/to-purple-500/g, 'to-sky-400');
  content = content.replace(/to-purple-600/g, 'to-sky-500');

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
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      replaceInFile(filePath);
    }
  }
};

walkSync(srcDir);
console.log("Global theme migration from Indigo to Cyan complete.");
