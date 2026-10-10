import { useEffect, useRef, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface PhoneShowcaseSequenceProps {
  totalFrames?: number;
  fps?: number;
  basePath?: string;
  maxWidth?: number | string | object;
}

// Helper to format frame numbers like 00001.jpg ... 00192.jpg
function getFrameUrl(basePath: string, index: number) {
  const frameNum = (index + 1).toString().padStart(5, '0');
  return `${basePath}${frameNum}.jpg`;
}

export function PhoneShowcaseSequence({
  totalFrames = 192,
  fps = 24,
  basePath = '/assets/phone-sequence/',
  maxWidth = 640,
}: PhoneShowcaseSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const currentFrameRef = useRef(0);
  const isIntersectingRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // Draw specific frame onto canvas
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (img && img.complete && img.naturalWidth > 0) {
      if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    }
  };

  // 1. Preload frame sequence (throttled state updates to avoid React re-render thrashing)
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = new Array(totalFrames);
    let count = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      img.src = getFrameUrl(basePath, i);
      img.onload = () => {
        if (isCancelled) return;
        count++;

        // Draw first frame immediately as soon as frame 0 is ready
        if (i === 0) {
          drawFrame(0);
        }

        // Throttle progress state updates to every 10% to prevent 192 continuous re-renders
        if (count % 20 === 0 || count === totalFrames) {
          setLoadedCount(count);
        }

        if (count === totalFrames) {
          setIsLoaded(true);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        count++;
        if (count % 20 === 0 || count === totalFrames) {
          setLoadedCount(count);
        }
        if (count === totalFrames) {
          setIsLoaded(true);
        }
      };
      loadedImages[i] = img;
    }

    imagesRef.current = loadedImages;

    return () => {
      isCancelled = true;
    };
  }, [totalFrames, basePath]);

  // 2. Setup IntersectionObserver to play animation only when in viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersectingRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 3. Optimized Animation Loop using requestAnimationFrame
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      drawFrame(0);
      return;
    }

    const frameDuration = 1000 / fps;

    const loop = (timestamp: number) => {
      if (!isIntersectingRef.current) {
        // Pause scheduling when offscreen to save 100% CPU/GPU resources
        animFrameIdRef.current = requestAnimationFrame(loop);
        return;
      }

      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;

      if (elapsed >= frameDuration) {
        lastFrameTimeRef.current = timestamp - (elapsed % frameDuration);
        currentFrameRef.current = (currentFrameRef.current + 1) % totalFrames;
        drawFrame(currentFrameRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [totalFrames, fps]);

  const loadProgressPercent = Math.round((loadedCount / totalFrames) * 100);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        willChange: 'transform',
      }}
    >
      {/* Loading Bar Progress Overlay before full sequence is loaded */}
      {!isLoaded && loadedCount < totalFrames && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -28,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={loadProgressPercent}
            sx={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              bgcolor: 'rgba(255, 107, 0, 0.15)',
              '& .MuiLinearProgress-bar': { bgcolor: '#FF6B00' },
            }}
          />
          <Typography
            sx={{
              fontSize: 10,
              fontFamily: 'IBM Plex Mono, monospace',
              color: 'text.secondary',
              fontWeight: 600,
            }}
          >
            {loadProgressPercent}%
          </Typography>
        </Box>
      )}

      {/* Canvas Element rendering phone video frames */}
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          width: '100%',
          height: 'auto',
          display: 'block',
          borderRadius: '24px',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 0, 0.25)'
              : '0 16px 40px rgba(255, 107, 0, 0.18), 0 0 0 1px rgba(255, 107, 0, 0.15)',
          bgcolor: 'transparent',
          objectFit: 'contain',
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
    </Box>
  );
}

export default PhoneShowcaseSequence;
