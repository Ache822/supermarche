import { useEffect } from 'react';
import { Box, Typography, CircularProgress, Container, Paper } from '@mui/material';
import { getSmartStoreUrl, APP_STORE_URL } from './smartRedirect';

/**
 * Smart Download Gateway Page Component (/download)
 * When a user scans the Supermarche QR code from an iPhone or Android device,
 * this page detects the OS on that device and immediately redirects to the respective store.
 */
export function SmartDownloadRedirect() {
  useEffect(() => {
    const targetStoreUrl = getSmartStoreUrl();
    window.location.href = targetStoreUrl;
  }, []);

  const targetStoreUrl = getSmartStoreUrl();
  const isIOS = targetStoreUrl === APP_STORE_URL;

  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            bgcolor: '#FF6B00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: 28,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          BB
        </Box>

        <CircularProgress size={36} sx={{ color: '#FF6B00' }} />

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
            Redirecting to {isIOS ? 'Apple App Store ' : 'Google Play Store 🤖'}...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Detecting your device operating system to open the Supermarche Mobile App download page.
          </Typography>
        </Box>

        <Box
          component="a"
          href={targetStoreUrl}
          sx={{
            mt: 1,
            color: '#FF6B00',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'underline',
          }}
        >
          Click here if redirect does not start automatically
        </Box>
      </Paper>
    </Container>
  );
}
