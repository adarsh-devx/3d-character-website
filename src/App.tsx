import React, { useState, useEffect, useRef, useCallback } from 'react';

// Custom useTypewriter hook
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;
    let currentIndex = 0;

    setDisplayed('');
    setDone(false);

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayed(text.slice(0, currentIndex));
        } else {
          setDone(true);
          clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Typewriter hook
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600
  );

  // Pill buttons appear 400ms after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Video mouse scrubbing references
  const durationRef = useRef(0);
  const targetXRef = useRef(0.5);
  const currentXRef = useRef(0.5);
  const animationFrameRef = useRef<number | null>(null);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 0;
      durationRef.current = dur;
      if (dur > 0) {
        // Start character in natural center
        videoRef.current.currentTime = dur * 0.5;
      }
    }
  };

  // Smooth mouse scrubbing effect (60fps lerp loop)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetXRef.current = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetXRef.current = Math.max(0, Math.min(1, e.touches[0].clientX / window.innerWidth));
      }
    };

    const animate = () => {
      const lerp = 0.08;
      currentXRef.current += (targetXRef.current - currentXRef.current) * lerp;

      const video = videoRef.current;
      const duration = durationRef.current || (video ? video.duration : 0);
      if (video && !video.seeking && duration > 0) {
        const targetTime = currentXRef.current * duration;
        if (Math.abs(video.currentTime - targetTime) > 0.02) {
          video.currentTime = Math.max(0, Math.min(targetTime, duration));
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Check if video is already cached/loaded
    if (videoRef.current && videoRef.current.readyState >= 1) {
      handleLoadedMetadata();
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('helloadarsshh@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden select-none bg-[#bd0a11]">
      {/* Background Video */}
      <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none bg-[#bd0a11]">
        <video
          ref={videoRef}
          src="/assets/aistudio/kling_20261107_VIDEO_animate_3701_0_79f91441.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-cover md:translate-x-[15%] lg:translate-x-[18%]"
          style={{
            objectPosition: 'center 18%',
          }}
        />
        {/* Seamless blend gradient on the left edge to blend with page backdrop */}
        <div
          className="absolute inset-y-0 left-0 w-[35%] pointer-events-none hidden md:block"
          style={{
            background:
              'linear-gradient(to right, #bd0a11 0%, #bd0a11 35%, rgba(189, 10, 17, 0.75) 65%, transparent 100%)',
          }}
        />
      </div>

      {/* Navbar (fixed, z-index: 10) */}
      <header className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex row justify-between items-center">
        {/* Logo (left) */}
        <div className="flex flex-row items-center gap-3">
          <span className="font-heading text-[21px] sm:text-[26px] tracking-tight text-white leading-none font-medium">
            Adarsh-devx
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-white select-none leading-none inline-block transform translate-y-[-1px]"
            style={{ letterSpacing: '-0.02em' }}
            aria-hidden="true"
          >
            &#x2733;&#xFE0E;
          </span>
        </div>

        {/* Desktop Nav Links (center, hidden below md) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[22px] text-white">
          <a href="#labs" className="hover:opacity-60 transition-opacity">
            Labs
          </a>
          <a href="#studio" className="hover:opacity-60 transition-opacity">
            Studio
          </a>
          <a href="#openings" className="hover:opacity-60 transition-opacity">
            Openings
          </a>
          <a href="#shop" className="hover:opacity-60 transition-opacity">
            Shop
          </a>
        </nav>

        {/* Desktop CTA (right, hidden below md) */}
        <div className="hidden md:block">
          <a
            href="mailto:helloadarsshh@gmail.com"
            className="text-[23px] text-white underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile Hamburger (visible below md) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px] focus:outline-none z-20 cursor-pointer"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${
              isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${
              isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile Overlay (z-index: 9) */}
      <div
        className={`fixed inset-0 z-[9] bg-black/90 backdrop-blur-md flex flex-col justify-center items-start px-8 gap-8 md:hidden transition-all duration-300 ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <a
          href="#labs"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Labs
        </a>
        <a
          href="#studio"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Studio
        </a>
        <a
          href="#openings"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Openings
        </a>
        <a
          href="#shop"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-white hover:opacity-60 transition-opacity"
        >
          Shop
        </a>
        <a
          href="mailto:helloadarsshh@gmail.com"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-white underline underline-offset-4 hover:opacity-60 transition-opacity mt-2"
        >
          Get in touch
        </a>
      </div>

      {/* Hero Section (z-index: 1) */}
      <main className="relative z-[1] w-full h-screen flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl relative z-10">
          {/* 1. Blurred intro label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#ffffff',
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Adarsh-devx&apos;s Adaptive Response Interface Agent
          </div>

          {/* 2. Typewriter text */}
          <p
            className="text-white mb-5 sm:mb-6"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
              fontWeight: 400,
              minHeight: '54px',
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] cursor-blink"
                aria-hidden="true"
              />
            )}
          </p>

          {/* 3. Action pill buttons */}
          <div
            className={`flex flex-wrap gap-y-1 transition-all duration-400 ease-out ${
              pillsVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-[8px]'
            }`}
            style={{
              transitionProperty: 'opacity, transform',
              transitionDuration: '0.4s',
              transitionTimingFunction: 'ease',
            }}
          >
            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Pitch us an idea
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Come work here
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              Send a brief hello
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
            >
              See how we operate
            </button>

            {/* Outline pill button with copy icon */}
            <button
              type="button"
              onClick={copyEmail}
              title="Click to copy email"
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap gap-2 sm:gap-3 hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer group"
            >
              <span>
                {copied ? (
                  <span>Copied! helloadarsshh@gmail.com</span>
                ) : (
                  <>
                    Reach us:{' '}
                    <span className="underline underline-offset-1">
                      helloadarsshh@gmail.com
                    </span>
                  </>
                )}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
                aria-hidden="true"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
