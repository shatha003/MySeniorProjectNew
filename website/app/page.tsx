'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0d0d15]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(143,245,255,0.1)]">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto headline tracking-wider uppercase">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">CHEA</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-cyan-400 border-b-2 border-cyan-400 pb-1" href="#features">Features</a>
            <a className="text-slate-400 hover:text-cyan-200 transition-colors" href="#training">Training</a>
            <a className="text-slate-400 hover:text-cyan-200 transition-colors" href="#preview">Preview</a>
          </div>
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-xl font-bold active:scale-95 duration-200 ease-out">
            Connect HUD
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px]"></div>
          <img 
            className="w-full h-full object-cover opacity-20" 
            alt="Futuristic high-tech digital grid interface" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2LvJPoG3Pl_bzYKpCQdIt5m75I8HC8AIPYGPimRHu3pUXwD47bRZzSklCBnEyOiByhYNET52pqaHqBrNPE6E5CNrnGxi1Nb7ylZL_BT7oi8Sor7TtW1I9oWtOYB-HXGJn54CKzHakb4eexAatD4noqZLkIg7tcw3dvUSNTNCluBgpx1KVfEYYGPOqHA513lb5Qnok3e0VOd6bJj4WDm6GEMLSUrKu1xmMb0lAy1XXEo0aDod4umA899ZOsYEh7Tm-vp97rc2-94Q" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center text-center">
          <span className="label-md uppercase tracking-[0.2em] text-primary mb-6 headline font-bold">System Online: Guardian Protocol</span>
          <h1 className="text-6xl md:text-8xl headline font-extrabold mb-6 leading-tight max-w-4xl">
            CHEA: Your <span className="glitch-accent">Cyber-Defender</span> Toolkit
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-10">
            The ultimate digital shield built for the next generation. Master the internet, protect your data, and level up your security skills. Designed for legends aged 9-15.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-4 rounded-xl font-bold text-lg kinetic-button glow-primary">
              Download for Windows
            </button>
            <button className="border border-primary/20 text-primary px-10 py-4 rounded-xl font-bold text-lg kinetic-button hover:bg-primary/5">
              View Intel
            </button>
          </div>
        </div>
      </header>

      {/* The Mission */}
      <section className="py-24 bg-surface-container-low relative">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-tertiary/20 rounded-full blur-3xl"></div>
            <img 
              className="rounded-[2rem] border border-outline-variant/15 shadow-2xl relative z-10" 
              alt="Tech-inspired shield protecting a computer" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7S2lGXjdMfgftbPneDAFj9dldfdJFlDySqBlNVff-3r1s12fMEO9mtLNrzd-2re1x3iafrTQqNCviifiiMpcwEPdy3NPLtdmWTXtTXTrOdCbruAI7LNBUF8Jr7MJUL2FzCkLxGiGpa3-Ohax0IgyV9BF4y40JWDelYseFDP-hUICpK8_6qD7r9YvdwtMlPzG79l58ghOjGuvxuRBMM7T82uoT07Qdzp5jgyaOAw5F4sI8wV5GkhWJZoUWfHnxmJeHWLBtAxCDQ3I" 
            />
          </div>
          <div>
            <h2 className="text-4xl headline font-bold mb-8">The Mission: Secure Your World</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
              The digital world is your playground, but even the best explorers need gear. CHEA turns complex cybersecurity into a tactical game. No boring manuals—just high-tech gadgets and smart training to keep you ahead of hackers and safe from online traps.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
                <h4 className="headline font-bold text-sm">Pro Protection</h4>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary mb-2">bolt</span>
                <h4 className="headline font-bold text-sm">Instant Alerts</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Gadgets (Features) */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-5xl headline font-bold mb-4">The Gadgets</h2>
            <p className="text-on-surface-variant max-w-md">Equip your digital arsenal with tools built for elite performance.</p>
          </div>
          <div className="hidden md:block h-px flex-1 mx-12 bg-outline-variant/20"></div>
          <span className="text-tertiary headline font-bold tracking-widest">KIT_V.1.0.4</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Gadget 1 */}
          <div className="bg-surface-container-low group hover:bg-surface-container-high transition-all duration-300 p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">policy</span>
            </div>
            <h3 className="text-xl headline font-bold mb-3">Scan-O-Matic</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Instant deep-scan for links and files. Know if it's safe before you click.</p>
          </div>
          {/* Gadget 2 */}
          <div className="bg-surface-container-low group hover:bg-surface-container-high transition-all duration-300 p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-secondary text-3xl">password</span>
            </div>
            <h3 className="text-xl headline font-bold mb-3">Secret Code Maker</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Forge unhackable passwords that even a supercomputer couldn't crack.</p>
          </div>
          {/* Gadget 3 */}
          <div className="bg-surface-container-low group hover:bg-surface-container-high transition-all duration-300 p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
            <div className="w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-tertiary text-3xl">encrypted</span>
            </div>
            <h3 className="text-xl headline font-bold mb-3">Top Secret Chat</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">End-to-end encrypted messaging. For your eyes and your team's eyes only.</p>
          </div>
          {/* Gadget 4 */}
          <div className="bg-surface-container-low group hover:bg-surface-container-high transition-all duration-300 p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
            <div className="w-14 h-14 bg-error/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-error text-3xl">lock</span>
            </div>
            <h3 className="text-xl headline font-bold mb-3">The Vault</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Ultra-secure credential storage. Locked behind multi-layer bio-auth.</p>
          </div>
        </div>
      </section>

      {/* The Dojo & Arena */}
      <section id="training" className="py-24 bg-surface-container-lowest relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl headline font-extrabold mb-4">Training Grounds</h2>
            <p className="text-on-surface-variant">Don't just use tools. Master the skills.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Phishing Dojo */}
            <div className="glass-hud p-10 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl headline font-bold mb-2">Phishing Dojo</h3>
                  <p className="text-on-surface-variant">Spot the traps, dodge the bait.</p>
                </div>
                <div className="bg-tertiary text-on-tertiary px-4 py-1 rounded-full text-xs font-bold headline">ELITE STATUS</div>
              </div>
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold headline text-primary mb-2">
                  <span>MASTERY XP</span>
                  <span>850 / 1000</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-secondary to-secondary-dim shadow-[0_0_10px_rgba(214,116,255,0.5)]"></div>
                </div>
              </div>
              <img 
                className="w-full h-48 object-cover rounded-xl opacity-40 group-hover:opacity-60 transition-opacity" 
                alt="Stylized martial arts dojo simulation" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7DlB78SLqFc0mvI1JYplbHuib-uwNwuF8sa-BfhoKmHc-8zrIxzpEq5-CNs5sf8mCnV2jdGTQAv5fRrWGrPWvK_3L1FgEoXoy9Ht_Zi_JYQw0Xtku0InCoHOjMGiN_1Ca1GSNg-_7mrR5qw5Wo7X2M_kaNv3MuI0Od5_V8EK8JvCY1yE6sywRs6Kqx5_Af8NjfKkvO30ub8rhy4LG7GwGVakzrdVRYxWomtrWoYWEBB6ebqRbZUB8m-BZxp8dmlfMteN80ipDyqE" 
              />
            </div>
            {/* Quiz Arena */}
            <div className="glass-hud p-10 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl headline font-bold mb-2">Quiz Arena</h3>
                  <p className="text-on-surface-variant">Duel with friends, climb the ladder.</p>
                </div>
                <div className="bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold headline">RANK: GUARDIAN</div>
              </div>
              <div className="flex gap-4 mb-8">
                <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-primary font-variation-fill">military_tech</span>
                </div>
                <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border border-secondary/20">
                  <span className="material-symbols-outlined text-secondary font-variation-fill">trophy</span>
                </div>
                <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border border-tertiary/20">
                  <span className="material-symbols-outlined text-tertiary font-variation-fill">stars</span>
                </div>
              </div>
              <img 
                className="w-full h-48 object-cover rounded-xl opacity-40 group-hover:opacity-60 transition-opacity" 
                alt="Cyberpunk style esport arena" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd5AVgEooPB0Xo3gApO9Q7MqAQSZKpm8xRrRUvmUKTngeBlgNvONulILLuTLQIP1l16SwABeMuCIPtTny1uMXdEbRaPQ3Xnm2idJQXXwxBhC6DMVRJVRWdziLn2B0i0KOo_YyYRtDZGprYb67J5RZRNFDk5GRP1GcAm_e4rIsTBxTEGqaY9VZYFeo1myWMpvyqguXoL7TF68b0Qz77XJBOWe5IPBbT1JuytduNXyvFXUSgRKmUNkX7PU6wMRfMBF3CuVfKFAbO1yI" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Sidekick Section */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-8 bg-gradient-to-br from-surface-container-low to-surface-container-high rounded-[3rem] p-12 border border-outline-variant/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-bright mb-8 ring-4 ring-primary/20">
            <span className="material-symbols-outlined text-primary text-5xl">smart_toy</span>
          </div>
          <h2 className="text-4xl headline font-bold mb-6">Meet Your AI Sidekick</h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Never feel alone on your mission. CHEA's built-in AI assistant is ready 24/7 to answer your tech questions, help you analyze suspicious links, and provide tactical advice for staying safe.
          </p>
        </div>
      </section>

      {/* App Sneak Peek (Bento Grid) */}
      <section id="preview" className="py-24 max-w-7xl mx-auto px-8">
        <h2 className="text-4xl headline font-bold mb-12 text-center">System Interface Preview</h2>
        <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[600px]">
          <div className="col-span-8 row-span-2 rounded-[2rem] bg-surface-container-low overflow-hidden border border-outline-variant/10">
            <img className="w-full h-full object-cover" alt="Main dashboard of the CHEA application" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3khE9Lm8L9vk6rOYaQohs29t8GL6FjiDseD59H5yBEuOjP9lPCZA6ilI1QMrk83TP1NrgvfrRiIWlan_SvrTCcTbCkcPyCN0cec5AJUMadmlAiQhinEbbqopNvQoarJDA__oaoblMLFhgJ6ATsrPptwGTHe4JCuClWXGeINynOy4BIltaqbm9JkIZPjhxV_m6O4pjCw59pUNxVuHLkP-ju7tqpsQmDNwn0XE-izb4wjLGPF2jc__aomfC8HX0GRGmHB0QO28ryv4"/>
          </div>
          <div className="col-span-4 row-span-1 rounded-[2rem] bg-surface-container-low overflow-hidden border border-outline-variant/10">
            <img className="w-full h-full object-cover" alt="Secure messaging interface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5u7rw7Xa__bS361JBkwU_YbpJ3zg6QEOQ8Gxzs-tzVSIYCzCOegJhRUSCSivl_n1P53tUpm3PXA1S_-f2g-ogmeEw7UwdFo8CyWkNAsofVamaCddSKqa9r5ZxQMm0GaxqD5d3vNrWYIpqsDcNXfPAG971Z2bUohbYX0lrYtFy0BU5rgWrWq5IwhUypNm0TRQBpz-wCCRVGMANmJ3hXQhQoaGbwZoxqNASN-lVX-i-qJHXNLcBtd6nIA5vi-Qt_vEZvmfg1xRtHiM"/>
          </div>
          <div className="col-span-4 row-span-1 rounded-[2rem] bg-surface-container-low overflow-hidden border border-outline-variant/10">
            <img className="w-full h-full object-cover" alt="Cybersecurity world map visualization" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn01JL35khNz_LA5UaiJmcljSiXqiex8GIM2QKNUMlbP8rGPNLMaucfG9kjtp5_V5RO2P3i7bPBHxS1B_5m2eCFI4bM6bwDLGDL17KwOsZillBDDu-PWQfQyFTiwnVHIs0pZruVa4C4pGvD7WDrz7fcOuxma0ec9LNcnWpmBZ_WmG7W_IXSk0gqcZNWsC3e9ivkit1Up3NA4IOlG4oy1zHC3H3bt6I3jW7Vyg2J0ehfcKiv3vuNsIN3SAfyQc0WLCW6QRwhxPGwAk"/>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-5xl md:text-6xl headline font-extrabold mb-8">Start Your Training Today</h2>
          <p className="text-xl text-on-surface-variant mb-12">Join thousands of young defenders securing the digital frontier. Free to download, easy to master.</p>
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-12 py-5 rounded-full font-bold text-xl kinetic-button glow-primary mb-8">
            Get CHEA for Windows
          </button>
          <div className="flex justify-center gap-4 text-on-surface-variant headline text-sm tracking-widest uppercase font-bold">
            <span>Latest Release: v1.04</span>
            <span className="text-primary">•</span>
            <span>Verified Secure</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d0d15] w-full py-12 border-t border-white/5 text-sm">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="headline font-bold text-cyan-400 text-xl">CHEA Protocol</div>
          <div className="flex gap-8">
            <a className="text-slate-500 hover:text-purple-400 transition-colors hover:translate-y-[-2px] transition-transform" href="#">Privacy Policy</a>
            <a className="text-slate-500 hover:text-purple-400 transition-colors hover:translate-y-[-2px] transition-transform" href="#">Terms of Service</a>
            <a className="text-slate-500 hover:text-purple-400 transition-colors hover:translate-y-[-2px] transition-transform" href="#">Security Whitepaper</a>
          </div>
          <div className="text-slate-500">© 2024 CHEA Protocol. All Rights Reserved.</div>
        </div>
      </footer>
      
      <style jsx global>{`
        .font-variation-fill {
          font-variation-settings: 'FILL' 1;
        }
      `}</style>
    </div>
  );
}
