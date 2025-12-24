import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { Ghost, Box, Mic, MessageSquare, Cat } from 'lucide-react';
import { AppModule } from '../types';

interface LandingProps {
  onSelectModule: (module: AppModule) => void;
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
  t: any;
}

interface TypewriterProps {
  phrases: string[];
}

const Typewriter = memo(({ phrases }: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const currentPhrase = phrases[phraseIndex % phrases.length];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
        setTypingSpeed(50);
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        setTypingSpeed(100 + Math.random() * 50);
      }, typingSpeed);
    }

    if (!isDeleting && displayText === currentPhrase) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsDeleting(true);
        setTypingSpeed(50);
      }, 3000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setPhraseIndex(prev => prev + 1);
      setTypingSpeed(150);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, typingSpeed, phrases]);

  return (
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal text-center tracking-[0.2em] leading-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.8)] min-h-[1.2em]">
      {displayText}
      <span className="ml-1 animate-[blink_1s_step-end_infinite]">_</span>
    </h1>
  );
});

interface FeatureCardProps {
  id: AppModule;
  title: string;
  video: string;
  style: React.CSSProperties;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = memo(({ 
  title, 
  video,
  style,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; 
      }
    }
  }, [isHovered]);

  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={style}
      className={`absolute w-[260px] h-[400px] cursor-pointer group origin-center will-change-transform rounded-[2rem] bg-white/5 backdrop-blur-md border transition-all duration-500 overflow-hidden
        ${isHovered ? 'animate-border-pulse bg-white/10' : 'border-white/10 shadow-2xl'}
      `}
    >
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-end pb-10 select-none">
            <div className="absolute inset-0">
                 <video
                    ref={videoRef}
                    src={video}
                    muted loop playsInline preload="auto"
                    className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700"
                    style={{
                      filter: isHovered ? 'none' : 'grayscale(100%)',
                      opacity: isHovered ? 1 : 0.6
                    }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-20" />
            </div>
            <span className="relative z-30 text-2xl font-bold text-white tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {title}
            </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />
    </div>
  );
});

export default function Landing({ onSelectModule, lang, setLang, t }: LandingProps) {
  const [animData, setAnimData] = useState<{ rect: DOMRect; video: string } | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [deckScale, setDeckScale] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const baseWidth = 1536; 
      const baseHeight = 864;
      const widthScale = Math.max(0.65, window.innerWidth / baseWidth);
      const heightScale = Math.max(0.65, window.innerHeight / baseHeight);
      setDeckScale(Math.min(1.1, Math.min(widthScale, heightScale)));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModuleSelect = (module: AppModule, video: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnimData({ rect, video });
    setTimeout(() => setIsExpanding(true), 10);
    setTimeout(() => onSelectModule(module), 275);
  };

  const CARD_SPACING = 200; 
  const PUSH_DISTANCE = 240; 
  const CENTER_INDEX = 1.5;

  const getCardStyle = (index: number) => {
    const relativeIndex = index - CENTER_INDEX;
    const baseX = relativeIndex * CARD_SPACING;
    const baseRotate = relativeIndex * 4;
    const isHovered = index === hoveredIndex;
    const isIdle = hoveredIndex === null;
    
    let transform = '';
    let zIndex = 10;
    let opacity = 1;
    let filter = 'blur(0px)';
    
    if (isIdle) {
      transform = `translateX(${baseX}px) rotate(${baseRotate}deg) scale(0.9)`;
      zIndex = 10 + index; 
    } else if (isHovered) {
      transform = `translateX(${baseX}px) rotate(0deg) scale(1.05) translateY(-30px)`;
      zIndex = 50;
    } else {
      const isLeft = index < hoveredIndex;
      const pushDir = isLeft ? -1 : 1;
      transform = `translateX(${baseX + (pushDir * PUSH_DISTANCE)}px) rotate(${baseRotate + (pushDir * 8)}deg) scale(0.85)`;
      zIndex = 40 - Math.abs(index - hoveredIndex); 
      opacity = 0.5;
      filter = 'blur(2px)'; 
    }

    return { transform, zIndex, opacity, filter, transition: 'all 800ms cubic-bezier(0.2, 1, 0.2, 1)' };
  };

  const featureList: { id: AppModule; title: string; video: string; }[] = [
    { id: '2d-audio', title: t.features[0], video: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/macphone_rbh44x.mp4" },
    { id: '2d-chat', title: t.features[1], video: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/shexiangji_cnko5j.mp4" },
    { id: '2d-avatar', title: t.features[2], video: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/plant_pwucfi.mp4" },
    { id: '3d-avatar', title: t.features[3], video: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/littlegirl_gzwaui.mp4" },
  ];

  const typewriterPhrases = useMemo(() => [t.heroTitle, "Make Cars Smarter", "重新定义美学创造"], [t.heroTitle]);

  return (
    <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
      <style>{`
        @keyframes border-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.4); border-color: rgba(255, 255, 255, 0.6); }
        }
        .animate-border-pulse { animation: border-pulse 2s ease-in-out infinite; }
      `}</style>

      <main className="w-full h-full flex flex-col items-center relative pt-10">
        <div className="flex flex-col items-center mt-[15vh] z-20">
            <div className="flex items-center justify-center min-h-[120px]">
               <Typewriter phrases={typewriterPhrases} />
            </div>
        </div>

        <div className={`relative flex-1 w-full flex items-center justify-center mt-0 max-w-6xl animate-in fade-in zoom-in-95 duration-1000 delay-200 ${animData ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
           <div className="relative h-[600px] w-full flex justify-center items-center" style={{ transform: `scale(${deckScale})`, transformOrigin: 'center center' }}>
             {featureList.map((feature, index) => (
                <FeatureCard 
                  key={feature.id}
                  id={feature.id}
                  title={feature.title}
                  video={feature.video}
                  style={getCardStyle(index)}
                  isHovered={hoveredIndex === index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => handleModuleSelect(feature.id, feature.video, e)}
                />
             ))}
           </div>
        </div>

        {/* Floating Language Switcher since global navbar is gone */}
        <div className="absolute bottom-8 right-8 flex gap-3">
           <button 
             onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
             className="px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
           >
             {lang === 'zh' ? 'EN' : 'ZH'}
           </button>
        </div>
      </main>

      {animData && (
        <div 
          className="fixed z-50 bg-[#191919]/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl"
          style={{
            top: isExpanding ? 0 : animData.rect.top,
            left: isExpanding ? 0 : animData.rect.left,
            width: isExpanding ? '100vw' : animData.rect.width,
            height: isExpanding ? '100vh' : animData.rect.height,
            borderRadius: isExpanding ? 0 : '2rem', 
            transition: 'all 300ms cubic-bezier(0.2, 0, 0.2, 1)', 
          }}
        >
           <div className="w-full h-full flex flex-col items-center justify-center relative">
              <video src={animData.video} autoPlay loop muted className="w-full h-full object-cover opacity-100" />
              <div className="absolute inset-0 bg-black/60 transition-opacity duration-500 opacity-100" />
           </div>
        </div>
      )}
    </div>
  );
}
