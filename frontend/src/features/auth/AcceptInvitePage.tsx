import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import api from '../../api/client';

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invitation token is missing from URL.');
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.users.acceptInvite({
        token,
        fullName: fullName.trim(),
        password,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Failed to accept invitation. The token may be invalid or expired.');
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
        bgcolor: '#140C07',
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5.5 },
            borderRadius: '24px',
            bgcolor: '#101C16',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          {/* Header Brand */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 107, 0, 0.14)',
                color: '#FF6B00',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                border: '1px solid rgba(255, 107, 0, 0.3)',
                boxShadow: '0 0 20px rgba(255, 107, 0, 0.2)',
              }}
            >
              <LockOpenIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 26, sm: 32 },
                fontWeight: 800,
                fontFamily: 'Space Grotesk, sans-serif',
                mb: 1.5,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              Accept Team Invitation
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: 14, lineHeight: 1.5, maxWidth: 420, mx: 'auto' }}>
              Set up your Supermarche Admin Console account credentials below.
            </Typography>
          </Box>

          {!token && (
            <Alert severity="error" sx={{ mb: 3.5, textAlign: 'left', borderRadius: '12px' }}>
              Invalid invitation link. The token parameter is missing from the URL.
            </Alert>
          )}

          {success ? (
            <Box sx={{ py: 3 }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 72, color: '#FF6B00', mb: 2 }} />
              <Typography variant="h2" sx={{ fontSize: 22, fontWeight: 800, mb: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
                Account Successfully Created!
              </Typography>
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', mb: 4, fontSize: 14, lineHeight: 1.6 }}>
                Your invitation has been accepted. You can now log into the Supermarche Admin Console.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/admin/login')}
                sx={{
                  bgcolor: '#FF6B00',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  py: 1.6,
                  px: 4,
                  fontSize: 16,
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(255, 107, 0, 0.35)',
                  '&:hover': { bgcolor: '#E05D00' },
                }}
              >
                Go to Admin Login
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ textAlign: 'left' }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3.5, borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#FF6B00', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Full Name
                </Typography>
                <TextField
                  fullWidth
                  placeholder="admin@example.com"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading || !token}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#09120D',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      border: '1px solid rgba(255, 107, 0, 0.25)',
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused': {
                        border: '1px solid #FF6B00',
                        boxShadow: '0 0 0 3px rgba(255, 107, 0, 0.2)',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.4)',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#FF6B00', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  New Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || !token}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              bgcolor: 'rgba(255, 255, 255, 0.05)',
                              p: 1,
                              borderRadius: '8px',
                              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
                            }}
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#09120D',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      border: '1px solid rgba(255, 107, 0, 0.25)',
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused': {
                        border: '1px solid #FF6B00',
                        boxShadow: '0 0 0 3px rgba(255, 107, 0, 0.2)',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.4)',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#FF6B00', mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Confirm Password
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || !token}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#09120D',
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 14,
                      border: '1px solid rgba(255, 107, 0, 0.25)',
                      '& fieldset': { border: 'none' },
                      '&:hover fieldset': { border: 'none' },
                      '&.Mui-focused': {
                        border: '1px solid #FF6B00',
                        boxShadow: '0 0 0 3px rgba(255, 107, 0, 0.2)',
                      },
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.4)',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !token}
                sx={{
                  bgcolor: '#FF6B00',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  py: 1.6,
                  fontSize: 16,
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(255, 107, 0, 0.35)',
                  textTransform: 'none',
                  fontFamily: 'Space Grotesk, sans-serif',
                  '&:hover': { bgcolor: '#E05D00' },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#FFFFFF' }} /> : 'Activate Account & Join Team'}
              </Button>

              <Box sx={{ mt: 3.5, textAlign: 'center' }}>
                <Link to="/admin/login" style={{ color: '#FF6B00', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                  Already have an account? Sign in to Admin Console
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
