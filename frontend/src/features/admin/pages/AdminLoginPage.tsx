import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Alert, Chip, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAppDispatch } from '../../../store/hooks';
import { loginSuccess } from '../store/adminSlice';
import { SupermarcheLogo } from '../../../components/ui/SupermarcheLogo';
import api from '../../../api/client';
import type { AdminUser } from '../types/admin.types';

export function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await api.auth.login({ email: email.trim(), password });

      const rawObj = (res as { data?: Record<string, unknown>; token?: string; accessToken?: string; jwt?: string }).data || (res as Record<string, unknown>);
      const token = (
        (res as Record<string, unknown>)?.token ||
        (res as Record<string, unknown>)?.accessToken ||
        (res as Record<string, unknown>)?.jwt ||
        rawObj?.token ||
        rawObj?.accessToken ||
        rawObj?.jwt ||
        'cookie_authenticated'
      ) as string;
      let userObj: AdminUser;

      if (rawObj?.user && typeof rawObj.user === 'object') {
        const u = rawObj.user as Record<string, unknown>;
        userObj = {
          id: String(u.id || u.authId || 'usr_superadmin_001'),
          email: String(u.email || email),
          name: String(u.name || u.fullName || 'Root Super Admin'),
          role: (u.role || u.access || 'SUPER_ADMIN') as AdminUser['role'],
          access: (u.access || u.role || 'SUPER_ADMIN') as AdminUser['access'],
          permissions: (Array.isArray(u.permissions) ? u.permissions : ['*']) as string[],
        };
      } else {
        userObj = {
          id: 'usr_superadmin_001',
          email: email.trim(),
          name: email.includes('admin') ? 'Root Super Admin' : 'System Admin',
          role: 'SUPER_ADMIN',
          access: 'SUPER_ADMIN',
          permissions: ['*'],
        };
      }

      dispatch(loginSuccess({ token, user: userObj }));
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#F8FAFC'),
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 440,
          width: '100%',
          borderRadius: '24px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
          border: '2px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#4F2D1B' : '#E2E8F0'),
          textAlign: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <SupermarcheLogo size={46} showText={true} />
        </Box>

        <Chip
          icon={<VerifiedIcon sx={{ color: '#FF6B00 !important', fontSize: '14px !important' }} />}
          label="RESTRICTED ADMIN PORTAL"
          size="small"
          sx={{
            fontFamily: 'IBM Plex Mono, monospace',
            fontSize: 10,
            fontWeight: 700,
            bgcolor: 'rgba(255, 107, 0, 0.15)',
            color: '#FF6B00',
            mb: 3,
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', mb: 1 }}>
          Admin Authentication
        </Typography>

        <Typography sx={{ fontSize: 13, color: 'text.secondary', mb: 3 }}>
          Sign in with your registered admin email & password to access management controls.
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, fontSize: 12, borderRadius: '10px', textAlign: 'left' }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} autoComplete="on" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            required
            size="small"
            type="email"
            label="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            sx={{
              '& .MuiInputLabel-root': { fontSize: '0.8125rem !important' },
              '& .MuiInputBase-input': { fontSize: '0.8125rem !important' },
              '& .MuiInputBase-input::placeholder': {
                fontSize: '0.8125rem !important',
                fontWeight: '400 !important',
                opacity: '0.7 !important',
              },
              '& input:-webkit-autofill': {
                WebkitBoxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 0 0 1000px #1F140C inset !important'
                    : '0 0 0 1000px #FFFFFF inset !important',
                WebkitTextFillColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#FFFFFF !important' : '#0F172A !important',
                transition: 'background-color 500000s ease-in-out 0s !important',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            required
            size="small"
            type={showPassword ? 'text' : 'password'}
            label="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            sx={{
              '& .MuiInputLabel-root': { fontSize: '0.8125rem !important' },
              '& .MuiInputBase-input': { fontSize: '0.8125rem !important' },
              '& .MuiInputBase-input::placeholder': {
                fontSize: '0.8125rem !important',
                fontWeight: '400 !important',
                opacity: '0.7 !important',
              },
              '& input:-webkit-autofill': {
                WebkitBoxShadow: (theme) =>
                  theme.palette.mode === 'dark'
                    ? '0 0 0 1000px #1F140C inset !important'
                    : '0 0 0 1000px #FFFFFF inset !important',
                WebkitTextFillColor: (theme) =>
                  theme.palette.mode === 'dark' ? '#FFFFFF !important' : '#0F172A !important',
                transition: 'background-color 500000s ease-in-out 0s !important',
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      aria-label="Toggle password visibility"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              bgcolor: '#FF6B00',
              color: '#FFFFFF',
              fontWeight: 700,
              py: 1.4,
              borderRadius: '12px',
              fontSize: 15,
              textTransform: 'none',
              '&:hover': { bgcolor: '#E05D00' },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Authenticate & Access Console →'}
          </Button>
        </Box>


      </Paper>
    </Box>
  );
}

export default AdminLoginPage;
