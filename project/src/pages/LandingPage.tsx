import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['landing', 'common']);

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body selection:bg-primary/30 selection:text-primary">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0d0d15]/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_20px_rgba(143,245,255,0.1)]">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto headline tracking-wider uppercase">
          <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">CHEA</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-cyan-400 border-b-2 border-cyan-400 pb-1 hover:text-cyan-300 transition-colors" href="#features">{t('landing:navFeatures')}</a>
            <a className="text-slate-400 hover:text-cyan-200 transition-colors" href="#mission">{t('landing:navMission')}</a>
            <a className="text-slate-400 hover:text-cyan-200 transition-colors" href="#training">{t('landing:navTraining')}</a>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2 rounded-xl font-bold active:scale-95 duration-200 ease-out"
          >
            {t('landing:connectHud')}
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
          <span className="label-md uppercase tracking-[0.2em] text-primary mb-6 headline font-bold">{t('landing:systemOnline')}</span>
          <h1 className="text-6xl md:text-8xl headline font-extrabold mb-6 leading-tight max-w-4xl">
            {t('landing:heroTitleBefore')}<span className="glitch-accent">{t('landing:heroTitleAccent')}</span>{t('landing:heroTitleAfter')}
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl mb-10 font-body">
            {t('landing:heroDesc')}
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-4 rounded-xl font-bold text-lg kinetic-button glow-primary"
            >
              {t('landing:initializeProtocol')}
            </button>
            <button className="border border-primary/20 text-primary px-10 py-4 rounded-xl font-bold text-lg kinetic-button hover:bg-primary/5">
              {t('landing:viewIntel')}
            </button>
          </div>
        </div>
      </header>

      {/* The Mission */}
      <section id="mission" className="py-24 bg-surface-container-low relative">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-tertiary/20 rounded-full blur-3xl"></div>
            <img 
              className="rounded-[2rem] border border-outline-variant/15 shadow-2xl relative z-10" 
              alt="Digital shield protecting computer icon" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7S2lGXjdMfgftbPneDAFj9dldfdJFlDySqBlNVff-3r1s12fMEO9mtLNrzd-2re1x3iafrTQqNCviifiiMpcwEPdy3NPLtdmWTXtTXTrOdCbruAI7LNBUF8Jr7MJUL2FzCkLxGiGpa3-Ohax0IgyV9BF4y40JWDelYseFDP-hUICpK8_6qD7r9YvdwtMlPzG79l58ghOjGuvxuRBMM7T82uoT07Qdzp5jgyaOAw5F4sI8wV5GkhWJZoUWfHnxmJeHWLBtAxCDQ3I" 
            />
          </div>
          <div>
            <h2 className="text-4xl headline font-bold mb-8">{t('landing:missionTitle')}</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
              {t('landing:missionDesc')}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
                <h4 className="headline font-bold text-sm">{t('landing:proProtection')}</h4>
              </div>
              <div className="p-4 rounded-xl bg-surface-container-high border border-outline-variant/10">
                <span className="material-symbols-outlined text-secondary mb-2">bolt</span>
                <h4 className="headline font-bold text-sm">{t('landing:instantAlerts')}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Gadgets (Features) */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-5xl headline font-bold mb-4">{t('landing:theGadgets')}</h2>
            <p className="text-on-surface-variant max-w-md">{t('landing:gadgetsSubtitle')}</p>
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
            <h3 className="text-xl headline font-bold mb-3">{t('landing:gadget1Title')}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{t('landing:gadget1Desc')}</p>
          </div>
          {/* Gadget 2 */}
          <div className="bg-surface-container-low group hover:bg-surface-container-high transition-all duration-300 p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
            <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-secondary text-3xl">password</span>
            </div>
            <h3 className="text-xl headline font-bold mb-3">{t('landing:gadget2Title')}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{t('landing:gadget2Desc')}</p>
          </div>
          {/* Gadget 3 */}
          <div className="bg-surface-container-low group hover:bg-surface-container-high transition-all duration-300 p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
            <div className="w-14 h-14 bg-tertiary/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-tertiary text-3xl">encrypted</span>
            </div>
            <h3 className="text-xl headline font-bold mb-3">{t('landing:gadget3Title')}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{t('landing:gadget3Desc')}</p>
          </div>
          {/* Gadget 4 */}
          <div className="bg-surface-container-low group hover:bg-surface-container-high transition-all duration-300 p-8 rounded-2xl border border-outline-variant/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/5 -mr-8 -mt-8 rounded-full blur-2xl"></div>
            <div className="w-14 h-14 bg-error/10 rounded-xl flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-error text-3xl">lock</span>
            </div>
            <h3 className="text-xl headline font-bold mb-3">{t('landing:gadget4Title')}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{t('landing:gadget4Desc')}</p>
          </div>
        </div>
      </section>

      {/* The Dojo & Arena */}
      <section id="training" className="py-24 bg-surface-container-lowest relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl headline font-extrabold mb-4">{t('landing:trainingGrounds')}</h2>
            <p className="text-on-surface-variant">{t('landing:trainingSubtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Phishing Dojo */}
            <div className="glass-hud p-10 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl headline font-bold mb-2">{t('landing:phishingDojoTitle')}</h3>
                  <p className="text-on-surface-variant">{t('landing:phishingDojoDesc')}</p>
                </div>
                <div className="bg-tertiary text-on-tertiary px-4 py-1 rounded-full text-xs font-bold headline">{t('landing:eliteStatus')}</div>
              </div>
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold headline text-primary mb-2">
                  <span>{t('landing:masteryXp')}</span>
                  <span>850 / 1000</span>
                </div>
                <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-secondary to-secondary-dim shadow-[0_0_10px_rgba(214,116,255,0.5)]"></div>
                </div>
              </div>
              <img 
                className="w-full h-48 object-cover rounded-xl opacity-40 group-hover:opacity-60 transition-opacity" 
                alt="Phishing Dojo interface" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7DlB78SLqFc0mvI1JYplbHuib-uwNwuF8sa-BfhoKmHc-8zrIxzpEq5-CNs5sf8mCnV2jdGTQAv5fRrWGrPWvK_3L1FgEoXoy9Ht_Zi_JYQw0Xtku0InCoHOjMGiN_1Ca1GSNg-_7mrR5qw5Wo7X2M_kaNv3MuI0Od5_V8EK8JvCY1yE6sywRs6Kqx5_Af8NjfKkvO30ub8rhy4LG7GwGVakzrdVRYxWomtrWoYWEBB6ebqRbZUB8m-BZxp8dmlfMteN80ipDyqE" 
              />
            </div>
            {/* Quiz Arena */}
            <div className="glass-hud p-10 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl headline font-bold mb-2">{t('landing:quizArenaTitle')}</h3>
                  <p className="text-on-surface-variant">{t('landing:quizArenaDesc')}</p>
                </div>
                <div className="bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold headline">{t('landing:rankGuardian')}</div>
              </div>
              <div className="flex gap-4 mb-8">
                <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                </div>
                <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border border-secondary/20">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                </div>
                <div className="w-16 h-16 rounded-xl bg-surface-container-highest flex items-center justify-center border border-tertiary/20">
                  <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                </div>
              </div>
              <img 
                className="w-full h-48 object-cover rounded-xl opacity-40 group-hover:opacity-60 transition-opacity" 
                alt="Quiz Arena interface" 
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
          <h2 className="text-4xl headline font-bold mb-6">{t('landing:aiSidekickTitle')}</h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {t('landing:aiSidekickDesc')}
          </p>
        </div>
      </section>

      {/* App Sneak Peek (Bento Grid) */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <h2 className="text-4xl headline font-bold mb-12 text-center">{t('landing:systemPreview')}</h2>
        <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[600px]">
          <div className="col-span-8 row-span-2 rounded-[2rem] bg-surface-container-low overflow-hidden border border-outline-variant/10">
            <img 
              className="w-full h-full object-cover" 
              alt="CHEA dashboard modules" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3khE9Lm8L9vk6rOYaQohs29t8GL6FjiDseD59H5yBEuOjP9lPCZA6ilI1QMrk83TP1NrgvfrRiIWlan_SvrTCcTbCkcPyCN0cec5AJUMadmlAiQhinEbbqopNvQoarJDA__oaoblMLFhgJ6ATsrPptwGTHe4JCuClWXGeINynOy4BIltaqbm9JkIZPjhxV_m6O4pjCw59pUNxVuHLkP-ju7tqpsQmDNwn0XE-izb4wjLGPF2jc__aomfC8HX0GRGmHB0QO28ryv4" 
            />
          </div>
          <div className="col-span-4 row-span-1 rounded-[2rem] bg-surface-container-low overflow-hidden border border-outline-variant/10">
            <img 
              className="w-full h-full object-cover" 
              alt="Secure messaging interface" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5u7rw7Xa__bS361JBkwU_YbpJ3zg6QEOQ8Gxzs-tzVSIYCzCOegJhRUSCSivl_n1P53tUpm3PXA1S_-f2g-ogmeEw7UwdFo8CyWkNAsofVamaCddSKqa9r5ZxQMm0GaxqD5d3vNrWYIpqsDcNXfPAG971Z2bUohbYX0lrYtFy0BU5rgWrWq5IwhUypNm0TRQBpz-wCCRVGMANmJ3hXQhQoaGbwZoxqNASN-lVX-i-qJHXNLcBtd6nIA5vi-Qt_vEZvmfg1xRtHiM" 
            />
          </div>
          <div className="col-span-4 row-span-1 rounded-[2rem] bg-surface-container-low overflow-hidden border border-outline-variant/10">
            <img 
              className="w-full h-full object-cover" 
              alt="Cybersecurity world map" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn01JL35khNz_LA5UaiJmcljSiXqiex8GIM2QKNUMlbP8rGPNLMaucfG9kjtp5_V5RO2P3i7bPBHxS1B_5m2eCFI4bM6bwDLGDL17KwOsZillBDDu-PWQfQyFTiwnVHIs0pZruVa4C4pGvD7WDrz7fcOuxma0ec9LNcnWpmBZ_WmG7W_IXSk0gqcZNWsC3e9ivkit1Up3NA4IOlG4oy1zHC3H3bt6I3jW7Vyg2J0ehfcKiv3vuNsIN3SAfyQc0WLCW6QRwhxPGwAk" 
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 text-center">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-5xl md:text-6xl headline font-extrabold mb-8">{t('landing:startTraining')}</h2>
          <p className="text-xl text-on-surface-variant mb-12">{t('landing:startTrainingDesc')}</p>
          <a 
            href="https://files.catbox.moe/9tkuow.rar"
            target="_blank"
            rel="noopener noreferrer"
            className="glitch-button-light bg-gradient-to-br from-primary to-primary-container text-on-primary px-12 py-5 rounded-full font-bold text-xl mb-8 inline-block"
          >
            <span className="glitch-text" data-text={t('landing:getWindows')}>{t('landing:getWindows')}</span>
          </a>
          <div className="flex justify-center gap-4 text-on-surface-variant font-label text-sm tracking-widest uppercase">
            <span>{t('landing:latestRelease')}</span>
            <span className="text-primary">•</span>
            <span>{t('landing:verifiedSecure')}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d0d15] w-full py-12 border-t border-white/5 font-body text-sm">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="headline font-bold text-cyan-400 text-xl">CHEA Protocol</div>
          <div className="flex gap-8">
            <a className="text-slate-500 hover:text-purple-400 transition-colors" href="/privacy">{t('landing:privacyPolicy')}</a>
            <a className="text-slate-500 hover:text-purple-400 transition-colors" href="/terms">{t('landing:termsOfService')}</a>
            <a className="text-slate-500 hover:text-purple-400 transition-colors" href="#">{t('landing:securityWhitepaper')}</a>
          </div>
          <div className="text-slate-500">{t('landing:copyright')}</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
