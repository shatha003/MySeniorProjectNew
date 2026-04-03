const fs = require('fs');
const path = require('path');
const file = 'c:/Users/nasee/Desktop/files/CODING/MySeniorProject/project/src/components/layout/DashboardLayout.tsx';
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

// Find indices
let idx1 = lines.findIndex(l => l.includes('shadow-lg shadow-primary/20') && l.includes('w-8 h-8 rounded-lg'));
let idx2 = lines.findIndex(l => l.includes('className="text-white"') && l.includes('ShieldAlert size={18}'));

if (idx1 !== -1 && idx2 !== -1) {
    // Replace 1st occurrence (desktop)
    lines.splice(idx1, 3, '                    <img src="/icon.png" alt="HyperTool Logo" className="w-8 h-8 object-contain drop-shadow-sm transition-transform group-hover:scale-110" />');
}

let idx3 = lines.findIndex(l => l.includes('from-primary to-[#13b8d1]') && l.includes('w-8 h-8 rounded-lg'));
let idx4 = lines.findIndex(l => l.includes('className="text-white"') && l.includes('ShieldAlert size={18}'));

if (idx3 !== -1 && idx4 !== -1) {
    // Replace 2nd occurrence (mobile)
    lines.splice(idx3, 3, '                                <img src="/icon.png" alt="HyperTool Logo" className="w-8 h-8 object-contain drop-shadow-sm transition-transform group-hover:scale-110" />');
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log("Success with line manipulation");
