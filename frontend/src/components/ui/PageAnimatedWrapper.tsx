import { useEffect, useState, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

interface PageAnimatedWrapperProps {
  children: ReactNode;
}

/**
 * Global Page Entrance Animation Wrapper Component
 * Ensures EVERY page across the Supermarche platform mounts with a smooth fade-in & slide-up animation.
 */
export function PageAnimatedWrapper({ children }: PageAnimatedWrapperProps) {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, [location.pathname]);

  return (
    <Box
      key={location.pathname}
      sx={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
        minHeight: '100%',
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
}
