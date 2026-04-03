const fs = require('fs');
const path = require('path');
const file = 'c:/Users/nasee/Desktop/files/CODING/MySeniorProject/project/src/components/layout/DashboardLayout.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(/<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-\[#13b8d1\] flex items-center justify-center shadow-lg shadow-primary\/20">[\s\S]*?<ShieldAlert size={18} className="text-white" \/>[\s\S]*?<\/div>/, '<img src="/icon.png" alt="HyperTool" className="w-8 h-8 object-contain drop-shadow-md" />');

txt = txt.replace(/<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-\[#13b8d1\] flex items-center justify-center">[\s\S]*?<ShieldAlert size={18} className="text-white" \/>[\s\S]*?<\/div>/, '<img src="/icon.png" alt="HyperTool" className="w-8 h-8 object-contain drop-shadow-md" />');

fs.writeFileSync(file, txt, 'utf8');
console.log("Success");
