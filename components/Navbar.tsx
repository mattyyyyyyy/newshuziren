import React, { useState, memo, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';

interface NavbarProps {
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
  t: any;
  currentTab?: string;
  onNavClick?: (tabId: string) => void;
}

const JDOLogo = memo(() => (
  <div className="flex items-center gap-3">
    <img 
      src="https://github.com/mattyyyyyyy/picture2bed/blob/main/e850352ac65c103853436eb801478413b07eca802308%20(1).png?raw=true" 
      alt="JDO Logo" 
      className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
    />
    <span 
      className="font-sans font-medium text-2xl text-white tracking-tighter drop-shadow-lg select-none leading-none"
    >
      JDO
    </span>
  </div>
));

export default function Navbar({ lang, setLang, t, currentTab = 'digital-human', onNavClick }: NavbarProps) {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangMenuOpen]);

  const menuItems = [
    { id: 'digital-human', label: lang === 'zh' ? '数字人' : 'Digital Human' },
    { id: 'ai-voice', label: lang === 'zh' ? 'AI语音' : 'AI Voice' },
    { id: 'prompt-library', label: lang === 'zh' ? '提示词' : 'Prompt' }
  ];

  const handleModuleClick = (id: string) => {
    if (onNavClick) {
      onNavClick(id);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-[60] flex items-center justify-between px-10 md:px-14 bg-transparent transition-all duration-300 pointer-events-none">
      {/* Left: Logo */}
      <div 
        className="flex items-center gap-3 select-none min-w-[200px] h-full cursor-pointer pointer-events-auto group" 
        onClick={() => handleModuleClick('digital-human')}
      >
        <JDOLogo />
      </div>
      
      {/* Center: Unified Modular Switcher (Rectangular with rounded corners) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center z-50 pointer-events-auto">
        <div className="flex items-center gap-12 px-8 py-2.5 rounded-xl bg-white/[0.04] backdrop-blur-lg border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => handleModuleClick(item.id)}
                className={`relative py-1 text-[14px] font-light uppercase tracking-[0.2em] transition-all duration-500 leading-none whitespace-nowrap ${
                  isActive 
                    ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]' 
                    : 'text-white/20 hover:text-white/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Right: Language Switcher - Smaller size, less gap */}
      <div className="relative z-50 flex items-center justify-end gap-6 min-w-[200px] pointer-events-auto" ref={langMenuRef}>
        <div className="relative">
          <button 
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} 
            className="flex items-center gap-1.5 px-1 py-0.5 font-black uppercase tracking-widest text-[9px] hover:text-white transition-colors"
          >
            <Globe size={13} className="text-white/40" />
            <span>{lang === 'zh' ? 'ZH' : 'EN'}</span>
          </button>

          {isLangMenuOpen && (
            <div className="absolute top-full right-0 mt-4 w-32 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
              <button
                onClick={() => { setLang('zh'); setIsLangMenuOpen(false); }}
                className={`flex items-center justify-between w-full px-3 py-2 text-[10px] font-medium rounded-md transition-colors ${lang === 'zh' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                简体中文
                {lang === 'zh' && <Check size={12} className="text-green-400" />}
              </button>
              <button
                onClick={() => { setLang('en'); setIsLangMenuOpen(false); }}
                className={`flex items-center justify-between w-full px-3 py-2 text-[10px] font-medium rounded-md transition-colors ${lang === 'en' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                English
                {lang === 'en' && <Check size={12} className="text-green-400" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}