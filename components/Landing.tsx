import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { Mic, MessageSquare, Box, Globe, Ghost, ChevronDown, Check } from 'lucide-react';
import { AppModule } from '../types';
import GlassCard3D from './GlassCard3D';
import Navbar from './Navbar';

interface LandingProps {
  onSelectModule: (module: AppModule) => void;
  lang: 'zh' | 'en';
  setLang: (lang: 'zh' | 'en') => void;
  t: any;
}

// --- Isolated Typewriter Component ---
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
  type3D: 'mic' | 'camera' | 'ghost' | 'human';
  title: string;
  video: string;
  style: React.CSSProperties;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FeatureCard: React.FC<FeatureCardProps> = memo(({ 
  id,
  type3D,
  title, 
  video,
  style,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle Video Playback on Hover
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        // Play when hovered
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented
          });
        }
      } else {
        // Pause and reset to start (0) when not hovered
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
      style={{
        ...style,
        // Use CSS animation for hover glow, static shadow otherwise
        boxShadow: isHovered 
          ? undefined 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
      // OPTIMIZATION: Reduced blur from xl to md/lg for performance
      className={`absolute w-64 h-96 cursor-pointer group origin-center will-change-transform rounded-[2rem] bg-white/5 backdrop-blur-md border transition-all duration-500 overflow-hidden
        ${isHovered ? 'animate-border-pulse bg-white/10' : 'border-white/10'}
      `}
    >
        {/* Content Container */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-end pb-8 select-none">
            {/* Visual Content: Video Only */}
            <div className="absolute inset-0">
                 <video
                    ref={videoRef}
                    src={video}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700"
                    style={{
                      // Grayscale when not hovered, Color when hovered
                      filter: isHovered ? 'none' : 'grayscale(100%)',
                      // Transparency: 0.6 when idle (more transparent), 1.0 when hovered
                      opacity: isHovered ? 1 : 0.6
                    }}
                 />

                 {/* Dark gradient at bottom to ensure text readability - lighter (opacity-60) per request */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-20" />
            </div>
            
            {/* Title */}
            <span className="relative z-30 text-2xl font-bold text-white tracking-[0.2em] uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {title}
            </span>
        </div>
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />
    </div>
  );
});

export default function Landing({ onSelectModule, lang, setLang, t }: LandingProps) {
  const [animData, setAnimData] = useState<{
    module: AppModule;
    rect: DOMRect;
    title: string;
  } | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [deckScale, setDeckScale] = useState(1);
  
  // Card Deck State
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Responsive scaling
  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      // Debounce resize
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        // Base dimensions to calculate relative scale
        const baseWidth = 1536; 
        const baseHeight = 864;
        
        const widthScale = Math.min(1, Math.max(0.55, window.innerWidth / baseWidth));
        const heightScale = Math.min(1, Math.max(0.55, window.innerHeight / baseHeight));
        
        // Use the smaller scale to ensure it fits in the viewport without overlapping
        // Bias slightly towards width to keep cards readable
        setDeckScale(Math.min(widthScale, heightScale));
      }, 50);
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    }
  }, []);

  const handleModuleSelect = (module: AppModule, title: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setAnimData({ module, rect, title });

    setTimeout(() => {
      setIsExpanding(true);
    }, 10);

    setTimeout(() => {
      onSelectModule(module);
    }, 275);
  };

  const handleNavClick = (tabId: string) => {
    if (tabId === 'ai-voice') {
        onSelectModule('ai-voice');
    }
    // For 'digital-human', we are already on the landing page, so we don't need to do anything
    // or we could reset any specific states if needed.
  };

  // --- Card Deck Logic ---
  const CARD_SPACING = 190; 
  const PUSH_DISTANCE = 220; 
  const CENTER_INDEX = 1.5; // Adjusted center for 4 items

  const getCardStyle = (index: number) => {
    // 1. Calculate Base Position (Idle State)
    const relativeIndex = index - CENTER_INDEX;
    const baseX = relativeIndex * CARD_SPACING;
    const baseRotate = relativeIndex * 4; // Slight fan effect

    // 2. Determine State
    const isHovered = index === hoveredIndex;
    const isIdle = hoveredIndex === null;
    
    // 3. Calculate Transforms
    let transform = '';
    let zIndex = 10;
    let opacity = 1;
    let filter = 'blur(0px)';
    
    if (isIdle) {
      // Idle: Stacked with overlap
      transform = `translateX(${baseX}px) rotate(${baseRotate}deg) scale(0.9)`;
      zIndex = 10 + index; 
    } else if (isHovered) {
      // Hovered: Pop up and straight
      transform = `translateX(${baseX}px) rotate(0deg) scale(1.05) translateY(-30px)`;
      zIndex = 50;
      opacity = 1;
    } else {
      // Dodge: Push away neighbors
      const isLeft = index < hoveredIndex;
      const pushDir = isLeft ? -1 : 1;
      const targetX = baseX + (pushDir * PUSH_DISTANCE);
      const targetRotate = baseRotate + (pushDir * 8); 
      
      transform = `translateX(${targetX}px) rotate(${targetRotate}deg) scale(0.85)`;
      zIndex = 40 - Math.abs(index - hoveredIndex); 
      opacity = 0.5;
      // OPTIMIZATION: Reduced Blur for inactive cards
      filter = 'blur(2px)'; 
    }

    const transition = 'all 800ms cubic-bezier(0.2, 1, 0.2, 1)';

    return {
      transform,
      zIndex,
      opacity,
      filter,
      transition
    };
  };

  // Optimized list: Removed static images, relying on video first frame
  const featureList: { 
    id: AppModule; 
    type3D: 'mic' | 'camera' | 'ghost' | 'human'; 
    title: string; 
    video: string; 
  }[] = [
    { 
      id: '2d-audio', 
      type3D: 'mic', 
      title: t.features[0], 
      video: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/macphone_rbh44x.mp4"
    },
    { 
      id: '2d-chat', 
      type3D: 'camera', 
      title: t.features[1], 
      video: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/shexiangji_cnko5j.mp4"
    },
    { 
      id: '2d-avatar', 
      type3D: 'ghost', 
      title: t.features[2], 
      video: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/plant_pwucfi.mp4"
    },
    { 
      id: '3d-avatar', 
      type3D: 'human', 
      title: t.features[3], 
      video: "https://res.cloudinary.com/djmxoehe9/video/upload/v1765437646/littlegirl_gzwaui.mp4"
    },
  ];

  // Helper to get media for transition
  const getSelectedMedia = (moduleId: string) => {
    return featureList.find(f => f.id === moduleId);
  };

  // Construct phrases (Subtitle removed from loop)
  const typewriterPhrases = useMemo(() => [
    t.heroTitle,
    "Make Cars Smarter",
    "重新定义美学创造"
  ], [t.heroTitle]);

  const selectedFeature = getSelectedMedia(animData?.module as string);

  return (
    <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
      <style>{`
        @keyframes white-glow-pulse {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            opacity: 0.8;
          }
          50% { 
            text-shadow: 0 0 25px rgba(255, 255, 255, 0.9), 0 0 10px rgba(255, 255, 255, 0.5);
            opacity: 1;
          }
        }
        @keyframes border-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(255,255,255,0.05); 
            border-color: rgba(255, 255, 255, 0.2); 
          }
          50% { 
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.4), inset 0 0 20px rgba(255,255,255,0.2); 
            border-color: rgba(255, 255, 255, 0.6); 
          }
        }
        .animate-white-glow {
          animation: white-glow-pulse 3s ease-in-out infinite;
        }
        .animate-border-pulse {
          animation: border-pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Nav extracted to component */}
      <Navbar lang={lang} setLang={setLang} t={t} onNavClick={handleNavClick} currentTab="digital-human" />

      {/* Main Content with viewport-relative spacing */}
      <main className="w-full h-full flex flex-col items-center relative">
        
        {/* Title & Subtitle Section */}
        {/* Positioned around 22% down from the top viewport edge */}
        <div className="flex flex-col items-center mt-[22vh] md:mt-[22vh] z-20">
            {/* Title Container */}
            <div className="flex items-center justify-center min-h-[80px] md:min-h-[120px]">
               <Typewriter phrases={typewriterPhrases} />
            </div>
        </div>

        {/* Interactive Card Deck Section */}
        {/* Positioned with flexible margin from title section to adapt to height */}
        <div 
           className={`relative flex-1 w-full flex items-center justify-center mt-0 max-w-6xl perspective-1000 animate-in fade-in zoom-in-95 duration-1000 delay-200 ${animData ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}
        >
           <div 
             className="relative h-[450px] w-full flex justify-center items-center"
             style={{ transform: `scale(${deckScale})`, transformOrigin: 'center center' }}
           >
             {featureList.map((feature, index) => (
                <FeatureCard 
                  key={feature.id}
                  id={feature.id}
                  type3D={feature.type3D}
                  title={feature.title}
                  video={feature.video}
                  style={getCardStyle(index)}
                  isHovered={hoveredIndex === index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => handleModuleSelect(feature.id, feature.title, e)}
                />
             ))}
           </div>
        </div>
      </main>

      {/* Transition Overlay */}
      {animData && selectedFeature && (
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
           <div className={`w-full h-full flex flex-col items-center justify-center transition-all duration-300 relative ${isExpanding ? 'opacity-100' : 'opacity-100'}`}>
              
              {/* Expanding Content */}
              <div className="absolute inset-0 w-full h-full">
                <video 
                  src={selectedFeature.video} 
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover opacity-100" 
                />
                {/* Overlay to ensure seamless visual with card state */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                {/* Additional dark overlay for studio background transition */}
                <div className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${isExpanding ? 'opacity-100' : 'opacity-0'}`} />
              </div>

           </div>
        </div>
      )}
    </div>
  );
}