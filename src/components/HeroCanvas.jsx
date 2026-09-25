import React, { useEffect, useRef } from 'react';

const NUM_FRAMES = 64;
const BG_COLOR = '#eb0d0b'; // Exact detected video background color (RGB 235, 13, 11)

export default function HeroCanvas({ mousePos, onGazeUpdate, isLoaded, setIsLoaded }) {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const centerFrameRef = useRef(null);
  const currentAngleRef = useRef(0);
  const isEyeContactRef = useRef(false);
  const lastTimeRef = useRef(performance.now());
  const lastThrottleTimeRef = useRef(0);

  // 1. Preload all 64 WebP frames and center.webp
  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = NUM_FRAMES + 1;
    const images = [];

    const handleLoad = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad) {
        setIsLoaded(true);
      }
    };

    // Load 64 circular frames
    for (let i = 0; i < NUM_FRAMES; i++) {
      const img = new Image();
      img.src = `/frames/frame_${i}.webp`;
      img.onload = handleLoad;
      img.onerror = () => {
        console.warn(`Failed to load frame_${i}.webp`);
        handleLoad();
      };
      images.push(img);
    }
    framesRef.current = images;

    // Load center neutral frame
    const centerImg = new Image();
    centerImg.src = '/character_image_corrected.png';
    centerImg.onload = handleLoad;
    centerImg.onerror = () => {
      console.warn('Failed to load center.webp');
      handleLoad();
    };
    centerFrameRef.current = centerImg;
  }, [setIsLoaded]);

  // 2. High-performance 60 FPS RequestAnimationFrame Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    let animationFrameId;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = (now) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Delta time in seconds (clamped to prevent jumps after tab blur)
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // 1920x1080 Aspect Ratio Cover calculation
      const imgWidth = 1920;
      const imgHeight = 1080;
      const imgRatio = imgWidth / imgHeight;
      const screenRatio = width / height;

      let renderW, renderH, offsetX, offsetY;

      if (screenRatio > imgRatio) {
        renderW = width;
        renderH = width / imgRatio;
        offsetX = 0;
        offsetY = (height - renderH) / 2;
      } else {
        renderH = height;
        renderW = height * imgRatio;
        offsetX = (width - renderW) / 2;
        offsetY = 0;
      }

      // Character face center coordinates on screen
      const faceCenterX = offsetX + renderW * 0.50;
      const faceCenterY = offsetY + renderH * 0.38;

      // Distance from face center
      const dx = mousePos.current.x - faceCenterX;
      const dy = mousePos.current.y - faceCenterY;
      const dist = Math.hypot(dx, dy);

      // Deadzone calculation with hysteresis to prevent flickering at boundaries
      const minScreenDim = Math.min(width, height);
      const deadzoneRadius = minScreenDim * 0.12;

      let isEyeContact = isEyeContactRef.current;
      if (!isEyeContact && dist < deadzoneRadius * 0.92) {
        isEyeContact = true;
      } else if (isEyeContact && dist > deadzoneRadius * 1.18) {
        isEyeContact = false;
      }
      isEyeContactRef.current = isEyeContact;

      // Calculate target angle in [0, 2*PI)
      let targetAngle = Math.atan2(dy, dx);
      if (targetAngle < 0) {
        targetAngle += 2 * Math.PI;
      }

      // Shortest-path circular angular lerp using framerate-independent exponential smoothing
      let diff = targetAngle - currentAngleRef.current;
      while (diff < -Math.PI) diff += 2 * Math.PI;
      while (diff > Math.PI) diff -= 2 * Math.PI;

      // Smooth lerp factor (~35ms response time, framerate independent)
      const lerpFactor = 1 - Math.exp(-18 * dt);
      currentAngleRef.current += diff * lerpFactor;
      currentAngleRef.current = (currentAngleRef.current + 2 * Math.PI) % (2 * Math.PI);

      // Map smoothed angle to nearest frame index (0..63)
      const frameIndex = Math.round((currentAngleRef.current / (2 * Math.PI)) * NUM_FRAMES) % NUM_FRAMES;

      // Throttled telemetry update (~15fps) to prevent React re-render overhead
      if (onGazeUpdate && now - lastThrottleTimeRef.current > 66) {
        lastThrottleTimeRef.current = now;
        onGazeUpdate({
          angleDeg: Math.round((currentAngleRef.current * 180) / Math.PI),
          frameIndex,
          isEyeContact,
          dist: Math.round(dist)
        });
      }

      // Seamless background fill
      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      // Draw EXACTLY ONE crisp frame at 100% opacity
      const frameToDraw = isEyeContact
        ? centerFrameRef.current
        : framesRef.current[frameIndex];

      if (frameToDraw && frameToDraw.complete && frameToDraw.naturalWidth > 0) {
        ctx.drawImage(frameToDraw, offsetX, offsetY, renderW, renderH);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos, onGazeUpdate]);

  return (
    <div className="canvas-container" style={{ backgroundColor: BG_COLOR }}>
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        style={{ width: '100vw', height: '100vh', display: 'block' }}
      />
    </div>
  );
}
