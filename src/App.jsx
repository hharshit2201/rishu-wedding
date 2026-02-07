import React, { useState, useEffect, useRef } from 'react';
import { Heart, Calendar, MapPin, Music, Volume2, VolumeX, ChevronDown, Star, Sparkles, Play, Pause, SkipForward, SkipBack, Phone } from 'lucide-react';

/**
 * PetalShower defined OUTSIDE App component to prevent resets on timer re-renders.
 */
const PetalShower = () => {
  const petals = Array.from({ length: 60 });
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 99 }}>
      {petals.map((_, i) => {
        const size = Math.random() * 8 + 6; 
        const left = Math.random() * 100;
        const duration = Math.random() * 7 + 5; 
        const delay = Math.random() * -20; 
        const drift = (Math.random() - 0.5) * 200; 
        
        return (
          <div
            key={i}
            className="petal absolute"
            style={{
              left: `${left}%`,
              top: `-10%`,
              width: `${size}px`,
              height: `${size * 0.8}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              opacity: Math.random() * 0.3 + 0.6,
              backgroundColor: i % 3 === 0 ? '#ff4d6d' : i % 3 === 1 ? '#ffb3c1' : '#fecdd3',
              borderRadius: '50% 0 50% 50%',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.05)',
              '--drift': `${drift}px`
            }}
          />
        );
      })}
    </div>
  );
};

// Simplified Elegant Flower Design
const FlowerDesign = ({ className }) => (
  <svg viewBox="0 0 100 100" className={`fill-none stroke-[#D4AF37] opacity-[0.12] ${className}`}>
    <circle cx="50" cy="50" r="4" strokeWidth="1.5" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
      <path 
        key={deg}
        d="M50 46 C50 30 65 30 50 15 C35 30 50 30 50 46" 
        transform={`rotate(${deg} 50 50)`} 
        strokeWidth="1" 
      />
    ))}
    <path d="M50 54 Q50 70 35 85 M50 54 Q50 70 65 85" strokeWidth="0.8" opacity="0.5" />
  </svg>
);

// Intersection Observer Hook for Scroll Reveals
const useScrollReveal = () => {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, revealed];
};

/**
 * Helper component for animated sections
 */
const ScrollSection = ({ title, children, dark }) => {
  const [ref, revealed] = useScrollReveal();
  return (
    <section 
      ref={ref} 
      className={`py-24 px-10 relative overflow-hidden reveal-section ${revealed ? 'reveal-active' : ''} ${dark ? 'bg-[#3D0A0A]' : 'bg-[#f7efe0] border-t border-yellow-600/10'}`}
    >
      {!dark && (
        <>
          <FlowerDesign className="absolute -top-10 -left-10 w-40 h-40 rotate-12 opacity-[0.08]" />
          <FlowerDesign className="absolute bottom-10 right-10 w-32 h-32 -rotate-12 opacity-[0.08]" />
        </>
      )}
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <h2 className={`text-5xl font-script mb-8 leading-none ${dark ? 'text-white' : 'text-[#8B0000]'}`}>{title}</h2>
        {children}
      </div>
    </section>
  );
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef(null);
  const wasMusicPlayingRef = useRef(false);

  const tracks = [
    { title: "Din Shagna Da", url: "/rishu-wedding/audio/din-shagna-da-x-kabira.mp3" },
    { title: "Chhaap Tilak", url: "/rishu-wedding/audio/Chhaap-Tilak.mp3" },
    { title: "Tenu Leke", url: "/rishu-wedding/audio/Tenu-Leke.mp3" },
    { title: "Mast Magan", url: "/rishu-wedding/audio/mast-magan.mp3" }
  ];

  const weddingDetails = {
    bride: "Shruti",
    groom: "Rishu",
    date: "March 7, 2026",
    venue: "Sasaram",
    fatherName: "Ramesh Gupta", 
    events: [
      { name: "Haldi", time: "11:00 AM", date: "March 5th", icon: "✨", venue: "Chanwar Takiya" },
      { name: "Mehendi & Sangeet", time: "08:00 PM", date: "March 6th", icon: "🎶", venue: "Chanwar Takiya" },
      { name: "Wedding Ceremony", time: "07:00 PM", date: "March 7th", icon: "💍", venue: "Moments Resort" }
    ]
  };

  // Auto-play next track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // Handle Track Changes
  useEffect(() => {
    if (isOpen && isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => console.error("Track change play failed:", err));
    }
  }, [currentTrackIndex, isOpen]);

  // Countdown timer
  useEffect(() => {
    const target = new Date("March 7, 2026 19:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => interval && clearInterval(interval);
  }, []);

  // Stop music when page goes out of view, resume when back in view
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlaying && audioRef.current) {
          wasMusicPlayingRef.current = true;
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        if (wasMusicPlayingRef.current && audioRef.current && isOpen) {
          wasMusicPlayingRef.current = false;
          audioRef.current.play().catch(e => console.log("Auto-resume failed", e));
          setIsPlaying(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPlaying, isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio unlock failed", e));
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Manual play failed", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen relative text-[#4A0E0E] font-serif overflow-x-hidden selection:bg-red-100 bg-[#fdf5e6]">
      {/* GLOBAL BACKGROUND SCENE */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-br from-[#fdf5e6] via-[#fffdfa] to-[#f4e8d1]" />
         <div className="absolute inset-0 opacity-[0.2] bg-[url('https://www.transparenttextures.com/patterns/silk.png')]" />
         
         {/* Scattered Flower Designs */}
         <FlowerDesign className="absolute top-[10%] left-[2%] w-32 h-32 rotate-12 opacity-[0.15]" />
         <FlowerDesign className="absolute top-[40%] right-[-5%] w-48 h-48 -rotate-45 opacity-[0.12]" />
         <FlowerDesign className="absolute bottom-[20%] left-[-10%] w-56 h-56 rotate-[30deg] opacity-[0.1]" />
         <FlowerDesign className="absolute bottom-[-5%] right-[10%] w-40 h-40 rotate-[15deg] opacity-[0.15]" />

         <svg viewBox="0 0 400 400" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] opacity-[0.08] pointer-events-none stroke-[#D4AF37] fill-none animate-spin-slow" style={{animationDuration: '180s'}}>
            <circle cx="200" cy="200" r="180" strokeWidth="0.5" strokeDasharray="5 5" />
            <circle cx="200" cy="200" r="140" strokeWidth="1" />
         </svg>
      </div>

      <audio ref={audioRef} src={tracks[currentTrackIndex].url} preload="auto" crossOrigin="anonymous" />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Great+Vibes&family=Montserrat:wght@100;400;700&family=Tiro+Devanagari+Hindi&display=swap');
        
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Cinzel Decorative', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
        .font-hindi { font-family: 'Tiro Devanagari Hindi', serif; }
        
        @keyframes petal-fall {
          0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg) translateX(var(--drift)); opacity: 0; }
        }
        .petal { animation: petal-fall linear infinite; will-change: transform; }

        .shimmer-text {
          background: linear-gradient(90deg, #8B0000 0%, #D4AF37 50%, #8B0000 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer { 100% { background-position: 200% 0; } }

        .gold-sweep {
          position: relative;
          overflow: hidden;
        }
        .gold-sweep::after {
          content: "";
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
          transform: skewX(-25deg);
          animation: sweep 6s infinite;
        }
        @keyframes sweep { 0% { left: -100%; } 100% { left: 200%; } }

        .names-mobile-hero {
          display: flex;
          flex-direction: column;
          width: 100%;
          overflow: visible !important;
          position: relative;
          padding: 2.5rem 0;
        }

        .name-text {
          font-size: clamp(3.8rem, 18vw, 6.5rem);
          line-height: 1.2;
          padding: 0 1.2rem; 
          overflow: visible !important;
          white-space: nowrap;
          display: block;
          filter: drop-shadow(0 2px 4px rgba(139, 0, 0, 0.1));
        }
        
        .reveal-section {
          transition: all 1.2s cubic-bezier(0.22, 1, 0.36, 1);
          transform: translateY(40px);
          opacity: 0;
          will-change: transform, opacity;
        }
        .reveal-active {
          transform: translateY(0);
          opacity: 1;
        }

        .app-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 180s linear infinite; }

        ::-webkit-scrollbar { width: 0px; background: transparent; }
      `}} />

      {!isOpen && (
        <div className="fixed inset-0 z-[110] flex overflow-hidden">
          <div className="w-1/2 h-full bg-[#3D0A0A] flex items-center justify-end border-r border-yellow-500/10 relative shadow-2xl transition-transform duration-1000">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')] rotate-90" />
          </div>
          <div className="w-1/2 h-full bg-[#3D0A0A] flex items-center justify-start border-l border-yellow-500/10 relative shadow-2xl transition-transform duration-1000">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center z-[120]">
             <div className="bg-[#8B0000] p-12 rounded-full border-4 border-yellow-500 shadow-[0_0_60px_rgba(212,175,55,0.6)] transform hover:scale-110 active:scale-95 transition-all cursor-pointer group" onClick={handleOpen}>
                <div className="text-center">
                  <Heart className="w-14 h-14 text-yellow-400 fill-yellow-400 mx-auto animate-pulse" />
                  <p className="text-yellow-100 font-sans font-bold tracking-[0.3em] uppercase text-[10px] mt-4">Tap to Unveil</p>
                </div>
             </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="app-container relative animate-in fade-in duration-1000 overflow-visible">
          <PetalShower />

          <section className="relative min-h-screen flex flex-col items-center justify-center py-20 px-8 overflow-visible">
            <div className="z-10 text-center w-full flex flex-col items-center overflow-visible">
              
              <div className="animate-in slide-in-from-top duration-1000 mb-10">
                <img 
                  src="https://i.etsystatic.com/37213244/r/il/1cd09d/4945579602/il_1080xN.4945579602_9fd5.jpg" 
                  alt="Ganesha" 
                  className="w-32 h-32 mx-auto mix-blend-multiply opacity-95 mb-4"
                  style={{ 
                    maskImage: 'radial-gradient(circle, black 35%, transparent 85%)', 
                    WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 85%)' 
                  }}
                />
                <div className="text-red-900 font-hindi text-sm leading-relaxed font-semibold px-2">
                  वक्रतुण्ड महाकाय सूर्यकोटि समप्रभः। <br />
                  निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
                </div>
              </div>

              <div className="flex items-center gap-4 mb-10 opacity-80">
                <div className="h-[1px] w-12 bg-[#D4AF37]" />
                <h2 className="text-red-900 tracking-[0.4em] uppercase text-xs font-sans font-black whitespace-nowrap">
                  Save The Date
                </h2>
                <div className="h-[1px] w-12 bg-[#D4AF37]" />
              </div>

              <div className="flex flex-col items-center gap-2 mb-4">
                <p className="text-[#8B0000] font-serif text-lg tracking-[0.2em] font-bold uppercase">Anurag family</p>
                <div className="flex flex-col items-center opacity-90 mt-4 bg-white/30 backdrop-blur-sm p-4 rounded-3xl border border-yellow-600/10 shadow-sm relative overflow-hidden gold-sweep">
                  <p className="text-red-800 text-[10px] uppercase tracking-[0.3em] font-sans font-semibold italic mb-1">In Loving Memory of</p>
                  <p className="text-[#8B0000] font-serif text-sm font-bold tracking-widest">Late Shri {weddingDetails.fatherName}</p>
                </div>
                <p className="font-script text-3xl text-red-800 mt-4 leading-tight">welcomes you to the wedding of</p>
              </div>

              <div className="names-mobile-hero overflow-visible">
                <div className="flex justify-start w-full overflow-visible gold-sweep">
                  <span className="name-text font-script shimmer-text">
                    {weddingDetails.groom}
                  </span>
                </div>
                <div className="flex justify-center my-[-1.5rem] z-20">
                  <span className="text-4xl text-red-800 font-serif opacity-30">&</span>
                </div>
                <div className="flex justify-end w-full overflow-visible gold-sweep">
                  <span className="name-text font-script shimmer-text">
                    {weddingDetails.bride}
                  </span>
                </div>
              </div>

              <p className="text-xl text-red-950 font-light italic drop-shadow-sm mt-4 mb-8 px-4">
                request the honor of your presence
              </p>

              <div className="grid grid-cols-4 gap-2 w-full mb-16">
                {[
                  { val: timeLeft.days, label: "Days" },
                  { val: timeLeft.hours, label: "Hours" },
                  { val: timeLeft.minutes, label: "Mins" },
                  { val: timeLeft.seconds, label: "Secs" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center p-3 rounded-2xl bg-white/50 border border-yellow-600/20 backdrop-blur-sm shadow-sm">
                    <span className="text-2xl font-thin text-red-900 leading-none">{String(item.val).padStart(2, '0')}</span>
                    <span className="text-[7px] uppercase tracking-widest text-red-700 mt-1 font-bold opacity-60">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="border-y-2 border-yellow-600/30 py-6 w-full bg-white/20 backdrop-blur-md rounded-full shadow-inner mb-6">
                <div className="text-4xl font-serif text-[#8B0000] tracking-tighter">
                  07 . 03 . 2026
                </div>
              </div>
            </div>

            <div className="mt-12 animate-bounce opacity-40">
              <ChevronDown size={32} />
            </div>
          </section>

          <ScrollSection title="Celebration Schedule">
             <div className="flex flex-col gap-12 mt-12">
                {weddingDetails.events.map((event, idx) => (
                  <div key={idx} className="bg-white/95 p-10 rounded-[2.5rem] border-b-4 border-yellow-600/10 shadow-xl relative overflow-hidden group active:scale-95 transition-transform">
                    {/* Minimalist flower watermark inside card */}
                    <FlowerDesign className="absolute bottom-[-5%] right-[-5%] w-24 h-24 opacity-[0.03]" />
                    <div className="text-5xl mb-6">{event.icon}</div>
                    <h4 className="text-2xl font-bold mb-4 text-[#8B0000] font-sans uppercase tracking-tight">{event.name}</h4>
                    <p className="font-bold text-red-800 text-lg mb-2">{event.date}</p>
                    <p className="italic text-base mb-6 opacity-70">Starts at {event.time}</p>
                    <p className="text-[10px] border-t border-red-50 pt-4 opacity-70 italic uppercase tracking-widest leading-relaxed">{event.venue}</p>
                  </div>
                ))}
              </div>
          </ScrollSection>

          <ScrollSection title="Blessings Only" dark>
              <div className="max-w-4xl mx-auto px-8 py-2 relative z-10 overflow-visible text-center">
                <Heart size={60} className="text-yellow-400 fill-yellow-400 mx-auto mb-10 animate-pulse" />
                <p className="text-xl opacity-80 font-light italic mb-20 leading-relaxed text-yellow-50">
                  "Your presence at our celebration is the most precious gift we could receive. Join us as we start our new chapter with your love and blessings."
                </p>
                <p className="text-[10px] uppercase tracking-[0.6em] text-yellow-500 font-black font-sans mb-4 opacity-70">With Eager Hearts</p>
                <div className="overflow-visible px-4 gold-sweep">
                  <p className="text-4xl md:text-4xl font-script text-white shimmer-text whitespace-nowrap" style={{ padding: '1rem', overflow: 'visible', lineHeight: '1.5' }}>Shruti ♡ Rishu</p>
                </div>

                <div className="mt-20 pt-10 border-t border-yellow-600/20">
                  <h3 className="font-script text-4xl text-yellow-500 mb-8 shimmer-text tracking-wide">Eagerly Awaiting Your Gracious Presence...</h3>
                  <div className="flex flex-col gap-4">
                    <p className="text-[#fdf5e6] font-serif text-xl tracking-[0.2em] font-medium opacity-95">Anju Gupta</p>
                    <p className="text-[#fdf5e6] font-serif text-xl tracking-[0.2em] font-medium opacity-95">Harshit Anurag</p>
                    <p className="text-[#fdf5e6] font-serif text-xl tracking-[0.2em] font-medium opacity-95">Ujjwal Anurag</p>
                  </div>
                </div>
             </div>
          </ScrollSection>

          <footer className="py-16 bg-black text-gray-700 text-center text-[10px] tracking-[1em] font-sans font-bold uppercase border-t border-yellow-900/20">
            CELEBRATE LOVE
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;