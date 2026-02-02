const fs = require('fs');
const path = './src/pages/ProjectDetails.tsx';

let content = fs.readFileSync(path, 'utf8');

// Fix Tags
content = content.replace(/< div/g, '<div');
content = content.replace(/<\/ div/g, '</div');
content = content.replace(/< section/g, '<section');
content = content.replace(/<\/ section/g, '</section');
content = content.replace(/< PortalNavbar/g, '<PortalNavbar');

// Fix Attributes
content = content.replace(/className = "/g, 'className="');
content = content.replace(/src = {/g, 'src={');
content = content.replace(/alt = {/g, 'alt={');
content = content.replace(/key = {/g, 'key={');
content = content.replace(/onClick = {/g, 'onClick={');

// Fix the specific Tailwind string corruption
// Replaces "py - 4" with "py-4", "text - sm" with "text-sm", etc.
// formatting-specific
content = content.replace(/py - 4/g, 'py-4');
content = content.replace(/px - 2/g, 'px-2');
content = content.replace(/font - semibold/g, 'font-semibold');
content = content.replace(/text - sm/g, 'text-sm');
content = content.replace(/tracking - wider/g, 'tracking-wider');
content = content.replace(/border - b - 2/g, 'border-b-2');
content = content.replace(/transition - colors/g, 'transition-colors');
content = content.replace(/whitespace - nowrap/g, 'whitespace-nowrap');

// Fix the closing backtick issue if present
// Check lines 285-287
// If we find `} }` without backtick, we might need to fix.
// But earlier view showed `} `}` (backtick present).
// Let's ensure the whitespace is clean.

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed ProjectDetails.tsx');
