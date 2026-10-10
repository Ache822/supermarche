import { useState } from 'react';
import { Box, Paper, Typography, Chip, Button, Avatar } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import VerifiedIcon from '@mui/icons-material/Verified';
import type { FieldRunner, DispatchedTicket } from '../types/admin.types';

interface LiveDispatchRadarProps {
  runners: FieldRunner[];
  tickets: DispatchedTicket[];
}

export function LiveDispatchRadar({ runners, tickets }: LiveDispatchRadarProps) {
  const [selectedCity, setSelectedCity] = useState<string>('Yaoundé');

  const filteredRunners = runners.filter(
    (r) => selectedCity === 'all' || r.city === selectedCity
  );

  const filteredTickets = tickets.filter(
    (t) => selectedCity === 'all' || t.city === selectedCity
  );

  const cityHubs = ['Yaoundé', 'Douala', 'Bamenda', 'Buea'];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
        border: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: 'rgba(255, 107, 0, 0.15)',
              color: '#FF6B00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LocationOnIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              Cameroon Regional Dispatch Hub Overview
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Dispatch node overview for active field runners & regional service orders
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {cityHubs.map((city) => (
            <Chip
              key={city}
              label={city}
              onClick={() => setSelectedCity(city)}
              color={selectedCity === city ? 'primary' : 'default'}
              variant={selectedCity === city ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                bgcolor: selectedCity === city ? '#FF6B00' : 'transparent',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Simulated Interactive Radar Screen */}
      <Box
        sx={{
          position: 'relative',
          height: 320,
          borderRadius: '14px',
          overflow: 'hidden',
          bgcolor: '#140C07',
          border: '2px solid #3A2316',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Radar Map Grid Background Graphic Lines */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 107, 0, 0.15) 0%, transparent 60%),
              linear-gradient(rgba(255, 107, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 30px 30px, 30px 30px',
            pointerEvents: 'none',
          }}
        />

        {/* Radar Sweep Animation Pulse Bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            bgcolor: '#FF6B00',
            boxShadow: '0 0 15px #FF6B00',
            animation: 'sweep 4s linear infinite',
            '@keyframes sweep': {
              '0%': { transform: 'translateY(0)' },
              '100%': { transform: 'translateY(320px)' },
            },
          }}
        />

        {/* Top Floating Hub Info */}
        <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            icon={<VerifiedIcon sx={{ color: '#FF6B00 !important', fontSize: '14px !important' }} />}
            label={`HUB: ${selectedCity.toUpperCase()} DISPATCH CENTER`}
            sx={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: 10,
              fontWeight: 700,
              bgcolor: 'rgba(31, 20, 12, 0.9)',
              color: '#FF6B00',
              border: '1px solid #FF6B00',
            }}
          />

          <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#FF6B00' }}>
            DISPATCH HUB • ACTIVE NODES
          </Typography>
        </Box>

        {/* Simulated Active Pins on Map Grid */}
        <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', gap: 3, flexWrap: 'wrap', my: 'auto' }}>
          {filteredRunners.map((runner, idx) => (
            <Box
              key={runner.id}
              sx={{
                p: 1.5,
                borderRadius: '12px',
                bgcolor: 'rgba(31, 20, 12, 0.92)',
                border: '1px solid #FF6B00',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 16px rgba(255, 107, 0, 0.3)',
                transform: `translateY(${idx * 4}px)`,
              }}
            >
              <Avatar src={runner.avatarUrl} sx={{ width: 36, height: 36, border: '2px solid #FF6B00' }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: '#FFFFFF', lineHeight: 1.1 }}>
                  {runner.name}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#FF6B00', fontFamily: 'IBM Plex Mono, monospace' }}>
                  ⚡ {runner.district} ({runner.vehicle})
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom Radar Status Bar */}
        <Box sx={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'IBM Plex Mono, monospace' }}>
            Active Dispatches in {selectedCity}: {filteredTickets.length} Jobs
          </Typography>

          <Button
            size="small"
            startIcon={<TwoWheelerIcon />}
            sx={{
              color: '#FF6B00',
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'none',
              bgcolor: 'rgba(255, 107, 0, 0.15)',
              '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.25)' },
            }}
          >
            Refresh Dispatch Nodes
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
