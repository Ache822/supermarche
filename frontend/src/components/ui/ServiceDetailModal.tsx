import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ShieldCheckIcon from '@mui/icons-material/Shield';
import { LocationFormSelector } from './LocationFormSelector';
import type { ServiceItem, LocationItem } from '../../types';
import { getServiceCategoryLabel } from '../../types';
import { useState } from 'react';
import { VerifiedBadge } from './VerifiedBadge';

interface ServiceDetailModalProps {
  open: boolean;
  onClose: () => void;
  service: ServiceItem | null;
  onBookNow?: (service: ServiceItem) => void;
}

export function ServiceDetailModal({
  open,
  onClose,
  service,
  onBookNow,
}: ServiceDetailModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);

  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: '20px' } } }}>
      <DialogTitle sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={getServiceCategoryLabel(service).toUpperCase()}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 107, 0, 0.15)',
              color: '#FF6B00',
              fontWeight: 700,
              fontSize: 10,
              fontFamily: 'IBM Plex Mono, monospace',
            }}
          />
          {service.isLive && (
            <Chip label="LIVE DISPATCH" size="small" color="success" sx={{ fontSize: 10, fontWeight: 700 }} />
          )}
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 0 }}>
        {/* Banner image if available */}
        {service.imageUrl && (
          <Box
            component="img"
            src={service.imageUrl}
            alt={service.title}
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
              borderRadius: '14px',
              mb: 2.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        )}

        <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', mb: 1 }}>
          {service.title}
        </Typography>

        <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6, mb: 3 }}>
          {service.description}
        </Typography>

        <Divider sx={{ mb: 2.5 }} />

        {/* Details Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FF6B00', mb: 0.5 }}>
              <ShieldCheckIcon fontSize="small" />
              <Typography sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                Service Status
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 15, fontFamily: 'Space Grotesk, sans-serif', color: service.isLive ? '#FF6B00' : '#C97B3D' }}>
                {service.isLive ? 'Live & Operational' : 'Coming Soon'}
              </Typography>
              {service.isLive && <VerifiedBadge size={16} title="Verified Dispatcher Network" />}
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: '12px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FF6B00', mb: 0.5 }}>
              <AccessTimeIcon fontSize="small" />
              <Typography sx={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                Avg Dispatch Time
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 15, fontFamily: 'Space Grotesk, sans-serif' }}>
              {service.estimatedTime}
            </Typography>
          </Box>
        </Box>

        {/* Destination Location Input (Debounced Autocomplete + Infinite Scroll) */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Dispatch Location & Address
          </Typography>
          <LocationFormSelector
            label="Service Delivery Location"
            placeholder="Search city or quarter (e.g. Bastos, Bonapriso, Molyko)..."
            onChange={(loc: LocationItem | null) => setSelectedLocation(loc)}
          />
          {selectedLocation && (
            <Typography sx={{ fontSize: 11.5, color: '#FF6B00', fontWeight: 600, mt: 0.8 }}>
              Selected: {selectedLocation.name}, {selectedLocation.region} ({selectedLocation.country})
            </Typography>
          )}
        </Box>

        {/* Guarantees */}
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: 'rgba(255, 107, 0, 0.08)',
            border: '1px solid rgba(255, 107, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <ShieldCheckIcon sx={{ color: '#FF6B00' }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 12, color: '#FF6B00' }}>
              Supermarche Service Guarantee
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
              Includes 5-point safety check, Mobile Money escrow security, and 24/7 support takeover.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 0, justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={onClose} sx={{ borderRadius: '10px', textTransform: 'none' }}>
          Close Summary
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            if (onBookNow) onBookNow(service);
          }}
          startIcon={<VerifiedUserIcon />}
          sx={{
            bgcolor: '#FF6B00',
            '&:hover': { bgcolor: '#E05D00' },
            borderRadius: '10px',
            fontWeight: 700,
            textTransform: 'none',
            px: 3,
          }}
        >
          Book This Service
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ServiceDetailModal;
