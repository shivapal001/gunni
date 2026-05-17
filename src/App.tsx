/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, MouseEvent, TouchEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";

const HEARTS_COUNT = 25;

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [heartArray, setHeartArray] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentLine, setCurrentLine] = useState(0);
  const [showFeeling, setShowFeeling] = useState(false);
  const [currentFeeling, setCurrentFeeling] = useState("");

  const handleEnter = () => {
    setHasEntered(true);
    setIsPlaying(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const flirtyLines = [
    "Kya tum Google ho? Kyunki jo bhi main dhoond raha tha, wo tum ho. 😉",
    "Tumhari aankhein itni chamakdar hain, mujhe chashma lagana padega! ✨",
    "Tum jaadu karti ho kya? Jab tumhe dekhta hoon, baaki sab gayab ho jata hai. 🪄",
    "Agar tum ek sabzi hoti, toh tum 'cute-cumber' hoti. 🥒❤️",
    "Main tumse itna pyaar karta hoon jitna is gaane ki har ek line. 🎶",
    "Tumhari smile hi mera favorite notification hai. 📱💖"
  ];

  const feelings = [
    "Guniii, mere liye tum har cheez se badhkar ho. ❤️",
    "Tumse baat karke mera din ban jata hai. 🌟",
    "Main waada karta hoon ki hamesha tumhara sath dunga. 🤝💘",
    "Tumhare bina life adhuri lagti hai... 🌸",
    "Bas tum muskuraati raho, mere liye wahi kaafi hai. 😊💕"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % flirtyLines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getRandomFeeling = () => {
    const randomIndex = Math.floor(Math.random() * feelings.length);
    setCurrentFeeling(feelings[randomIndex]);
    setShowFeeling(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#ff758c", "#ffd700"],
    });
  };

  useEffect(() => {
    setHeartArray(Array.from({ length: HEARTS_COUNT }, (_, i) => i));
  }, []);

  const handleYes = () => {
    setAccepted(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff758c", "#ff7eb3", "#ffffff", "#ffd700"],
    });
  };

  const moveNoButton = (e?: MouseEvent | TouchEvent) => {
    if (accepted) return;
    
    // Calculate random position within viewport, leaving margins
    const margin = 100;
    const maxX = window.innerWidth - margin;
    const maxY = window.innerHeight - margin;
    const minX = margin;
    const minY = margin;
    
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * (maxY - minY) + minY;
    
    setNoButtonPos({ x, y });
  };

  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
      }
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (hasEntered && audioRef.current) {
      audioRef.current.play().catch(err => console.log("Autoplay failed:", err));
    }
  }, [hasEntered]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center font-sans overflow-hidden bg-gradient-to-br from-[#fff5f7] to-[#fed7e2]"
    >
      {/* Local Audio Element */}
      <audio 
        ref={audioRef}
        src="/ambarsariya.mp3" 
        loop
      />

      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="entry"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="z-50 fixed inset-0 bg-pink-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-8"
            >
              <Heart size={100} className="text-pink-500" fill="#ec4899" />
            </motion.div>
            <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4 tracking-tighter">
              𝓰𝓾𝓷𝓲𝓲𝓲
            </h1>
            <p className="text-pink-600 font-medium mb-8">Ek chota sa surprise tumhare liye...</p>
            <button
              onClick={handleEnter}
              className="px-12 py-5 bg-pink-500 text-white rounded-full font-bold text-xl shadow-xl hover:bg-pink-600 transition-all cursor-pointer transform active:scale-95"
            >
              Open with ❤️
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col items-center justify-center"
          >
            {/* Floating Background Hearts */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {heartArray.map((i) => (
                <div
                  key={i}
                  className="floating-heart text-pink-300 opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 10}s`,
                    fontSize: `${Math.random() * 20 + 10}px`,
                  }}
                >
                  <Heart fill="currentColor" />
                </div>
              ))}
            </div>

            {/* Music Player Control */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white/40 backdrop-blur-md p-2 rounded-full border border-white/50 shadow-sm">
              <button 
                onClick={toggleMusic}
                className="p-2 rounded-full hover:bg-white/50 transition-colors text-pink-600 cursor-pointer"
              >
                {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
              <span className="text-xs font-medium text-pink-700 pr-4 animate-pulse">
                Ambarsariya...
              </span>
            </div>

            {/* Main Content Card */}
            <AnimatePresence mode="wait">
              {!accepted ? (
                <motion.div
                  key="ask"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="z-10 bg-white/60 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,182,193,0.3)] border border-white/80 max-w-lg w-full mx-4 text-center relative"
                >
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block relative mb-8"
                  >
                    <Heart size={64} className="text-pink-500 mx-auto" fill="#ec4899" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-2 -right-2 text-yellow-400"
                    >
                      <Sparkles size={24} />
                    </motion.div>
                  </motion.div>

                  <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
                    𝓰𝓾𝓷𝓲𝓲𝓲 ❤️
                  </h1>
                  
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={currentLine}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-pink-600 font-medium italic text-lg mb-8 min-h-[3rem] flex items-center justify-center"
                    >
                      "{flirtyLines[currentLine]}"
                    </motion.p>
                  </AnimatePresence>

                  <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-800 mb-12">
                    Will you be mine forever?
                  </h2>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleYes}
                      className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold text-lg shadow-[0_10px_20px_rgba(236,72,153,0.3)] transition-all cursor-pointer min-w-[140px]"
                    >
                      Yes! 💖
                    </motion.button>

                    <motion.button
                      style={{
                        position: noButtonPos.x ? "fixed" : "relative",
                        left: noButtonPos.x || 'auto',
                        top: noButtonPos.y || 'auto',
                      }}
                      onMouseEnter={moveNoButton}
                      onClick={moveNoButton}
                      onTouchStart={moveNoButton}
                      className="px-10 py-4 bg-white/80 hover:bg-white text-gray-400 rounded-full font-bold text-lg border border-pink-100 shadow-sm transition-all min-w-[140px] cursor-default"
                    >
                      No 🥺
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="z-10 text-center px-4"
                >
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="bg-white/80 backdrop-blur-md p-10 md:p-16 rounded-[3rem] shadow-2xl border border-pink-100 max-w-md w-full mx-auto"
                  >
                    <div className="text-8xl md:text-9xl mb-8">🥰</div>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-pink-600 mb-6 italic">
                      Yayayay!
                    </h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                      Thank you for being part of my life, <br/>
                      <span className="font-bold text-pink-500 text-2xl">𝓰𝓾𝓷𝓲𝓲𝓲!</span>
                    </p>
                    <p className="mt-8 text-pink-400 font-medium animate-pulse text-lg">
                      Hamesha Tumhari hi... ❤️
                    </p>

                    <button 
                      onClick={getRandomFeeling}
                      className="mt-6 px-6 py-3 bg-white text-pink-500 rounded-full font-bold text-sm border border-pink-200 hover:bg-pink-50 transition-all shadow-sm flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Heart size={16} fill="currentColor" /> Click for my Feelings
                    </button>

                    <AnimatePresence>
                      {showFeeling && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-100 text-pink-700 font-serif italic text-lg shadow-inner"
                        >
                          {currentFeeling}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Lyrics Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="mt-12 text-left bg-white/40 p-6 rounded-2xl border border-pink-100/50 max-h-[300px] overflow-y-auto custom-scrollbar"
                    >
                      <h3 className="text-pink-600 font-serif font-bold text-center mb-4 flex items-center justify-center gap-2">
                        <Sparkles size={16} /> Ambarsariya Lyrics <Sparkles size={16} />
                      </h3>
                      <div className="text-sm text-gray-700 leading-relaxed space-y-4 font-medium text-center">
                        <p>
                          Gali mein maare phere <br/>
                          Paas aane ko mere <br/>
                          Gali mein maare phere <br/>
                          Paas aane ko mere
                        </p>
                        <p>
                          Kabhi parakhta nain mere toh <br/>
                          Kabhi parakhta qawaare
                        </p>
                        <p className="text-pink-600 italic">
                          Ambarsariya mundave kachiyan kaliyan na tod <br/>
                          Ambarsariya mundave kachiyan kaliyan na tod
                        </p>
                        <p>
                          Teri maa ne bole manda <br/>
                          tere baap ne bole khor
                        </p>
                        <p>
                          Main kaliyon se lipti <br/>
                          Titli ki tarah <br/>
                          Udti hoon baagon mein <br/>
                          Titli ki tarah
                        </p>
                        <p className="text-pink-400 text-xs mt-4">
                          Jab se tum aaye ho, <br/>
                          zindagi bilkul is gaane jaisi lagti hai...
                        </p>
                      </div>
                    </motion.div>
                    
                    <div className="mt-10 flex justify-center gap-4">
                      {[1, 2, 3].map(i => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.3, 1], y: [0, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        >
                          <Heart size={32} className="text-pink-500" fill="#ec4899" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-6 text-pink-400/60 font-medium text-xs tracking-[0.2em] uppercase z-10">
        Made with all my ❤️ for you
      </footer>
    </div>
  );
}
