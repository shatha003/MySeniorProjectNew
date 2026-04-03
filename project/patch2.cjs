const fs = require('fs');
const path = require('path');
const file = 'c:/Users/nasee/Desktop/files/CODING/MySeniorProject/project/src/components/layout/DashboardLayout.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(/<div(?:(?!<div)[^>])*?>\s*<ShieldAlert[^>]*?>\s*<\/div>\s*<h1 className="text-xl font-bold tracking-tight">/g, '<img src="/icon.png" alt="HyperTool Logo" className="w-8 h-8 object-contain drop-shadow-sm" />\n                    <h1 className="text-xl font-bold tracking-tight">');

txt = txt.replace(/<div(?:(?!<div)[^>])*?>\s*<ShieldAlert[^>]*?>\s*<\/div>\s*<h1 className="text-xl font-bold">/g, '<img src="/icon.png" alt="HyperTool Logo" className="w-8 h-8 object-contain drop-shadow-sm" />\n                                <h1 className="text-xl font-bold">');

fs.writeFileSync(file, txt, 'utf8');
console.log("Success with newer regex");
