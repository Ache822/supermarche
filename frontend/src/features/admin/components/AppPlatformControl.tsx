import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useAppDispatch } from '../../../store/hooks';
import { addPushNotification } from '../store/adminSlice';
import type { AppPushNotification } from '../types/admin.types';

interface AppPlatformControlProps {
  notifications: AppPushNotification[];
}

export function AppPlatformControl({ notifications }: AppPlatformControlProps) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [region, setRegion] = useState('All Regions (Cameroon)');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    dispatch(addPushNotification({ title, message, targetRegion: region }));
    setTitle('');
    setMessage('');
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <Grid container spacing={3}>
      {/* Left Column: Push Notification Composer */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
            border: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
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
              <CampaignIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                Mobile App Push Notification Launcher
              </Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                Dispatch instant push alerts to Android & iOS mobile app users
              </Typography>
            </Box>
          </Box>

          {sentSuccess && (
            <Chip
              label="✓ Push Notification Dispatched Successfully to Mobile Users!"
              color="success"
              sx={{ mb: 2, fontWeight: 700, width: '100%' }}
            />
          )}

          <Box component="form" onSubmit={handleSendPush} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Target Region</InputLabel>
              <Select value={region} label="Target Region" onChange={(e) => setRegion(e.target.value)}>
                <MenuItem value="All Regions (Cameroon)">All Regions (Cameroon)</MenuItem>
                <MenuItem value="Yaoundé (Bastos & Omnisports)">Yaoundé (Bastos & Omnisports)</MenuItem>
                <MenuItem value="Douala (Bonapriso & Akwa)">Douala (Bonapriso & Akwa)</MenuItem>
                <MenuItem value="Bamenda (Commercial Ave)">Bamenda (Commercial Ave)</MenuItem>
                <MenuItem value="Buea (Molyko)">Buea (Molyko)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              size="small"
              label="Notification Title"
              placeholder="e.g. 🔥 Express Cooking Gas Dispatch Active"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '0.8125rem !important',
                  fontWeight: '400 !important',
                  opacity: '0.7 !important',
                },
              }}
            />

            <TextField
              size="small"
              multiline
              rows={3}
              label="Notification Message"
              placeholder="e.g. Get 25-minute kitchen delivery in Bastos with free leak safety audit!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              sx={{
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '0.8125rem !important',
                  fontWeight: '400 !important',
                  opacity: '0.7 !important',
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 700,
                py: 1.2,
                borderRadius: '10px',
                '&:hover': { bgcolor: '#E05D00' },
              }}
            >
              Broadcast Push Notification
            </Button>
          </Box>
        </Paper>
      </Grid>

      {/* Right Column: Platform Metrics & Push Log */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
            border: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            height: '100%',
          }}
        >
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              Broadcast History & App Analytics
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
              Recent mobile app broadcasts & installation stats
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <Box sx={{ p: 2, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'), borderRadius: '12px' }}>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 600 }}>ANDROID APP INSTALLS</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#FF6B00' }}>
                12,450
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFF4ED'), borderRadius: '12px' }}>
              <Typography sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 600 }}>IOS APP INSTALLS</Typography>
              <Typography sx={{ fontSize: 22, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#FF6B00' }}>
                6,000
              </Typography>
            </Box>
          </Box>

          <Typography sx={{ fontSize: 12, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', mb: 1.5 }}>
            RECENT BROADCAST LOG (INFINITE SCROLL ENABLED):
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, maxHeight: 280, overflowY: 'auto', pr: 0.5 }}>
            {notifications.map((push) => (
              <Box
                key={push.id}
                sx={{
                  p: 1.75,
                  borderRadius: '10px',
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED'),
                  border: '1px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{push.title}</Typography>
                  <Chip label={push.sentAt} size="small" sx={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }} />
                </Box>
                <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>{push.message}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#FF6B00', fontWeight: 600 }}>
                  <span>🎯 {push.targetRegion}</span>
                  <span>📲 {push.recipientsCount.toLocaleString()} Device Pings</span>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
