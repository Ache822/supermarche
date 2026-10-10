import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Rating,
  MenuItem,
  Alert,
  FormControlLabel,
  Switch,
  Checkbox,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppDispatch } from '../../store/hooks';
import { addTestimonial } from '../../features/admin/store/adminSlice';
import api from '../../api/client';
import socketClient from '../../api/socketClient';

interface SubmitReviewModalProps {
  open: boolean;
  onClose: () => void;
  isAdminMode?: boolean;
}

const SERVICE_OPTIONS = [
  'Cooking Gas Cylinder Delivery',
  'Market Shopping & Prepped Soups',
  'Home Repairs & Plumbing',
  'Deep Cleaning & Hygiene',
  'Digital & Door Security Installation',
  'Student Errand & Back-to-School',
  'Other On-Demand Service',
];

export function SubmitReviewModal({ open, onClose, isAdminMode = false }: SubmitReviewModalProps) {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState<number | null>(5);
  const [hoverRating, setHoverRating] = useState<number>(-1);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [serviceUsed, setServiceUsed] = useState(SERVICE_OPTIONS[0]);
  const [content, setContent] = useState('');
  const [consentToPublish, setConsentToPublish] = useState(true);
  const [autoApprove, setAutoApprove] = useState(true);
  const [autoFeature, setAutoFeature] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !content || !rating) return;

    const payload = {
      authorName,
      authorRole: authorRole || 'Verified Client',
      rating,
      content,
      serviceUsed,
      consentToPublish,
      status: (isAdminMode ? (autoApprove ? 'APPROVED' : 'PENDING') : 'PENDING') as 'APPROVED' | 'PENDING' | 'REJECTED',
      isFeatured: isAdminMode ? autoFeature : false,
    };

    dispatch(addTestimonial(payload));
    socketClient.emit('testimonial_updated', payload);

    try {
      await api.testimonials.submit(payload);
    } catch {
      // Continue gracefully if offline
    }

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setAuthorName('');
    setAuthorRole('');
    setContent('');
    setRating(5);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleResetAndClose} maxWidth="sm" fullWidth disableRestoreFocus>
      {/* Fixed Modal Header */}
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          px: 3,
          borderBottom: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
          Leave a Review / Testimonial
        </Typography>
        <IconButton size="small" onClick={handleResetAndClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Scrollable Modal Body */}
      <DialogContent dividers sx={{ p: 3 }}>
        {submitted ? (
          <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#FF6B00', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
              Thank You for Your Feedback!
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14, maxWidth: 420, mx: 'auto', mb: 3 }}>
              Your review has been submitted successfully with <strong>PENDING</strong> status. It will appear on the Supermarche public landing page after quick moderation.
            </Typography>
          </Box>
        ) : (
          <Box component="form" id="submit-review-modal-form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Alert severity="info" sx={{ borderRadius: '10px', fontSize: 13 }}>
              Share your experience with Supermarche runners and technicians in Douala, Yaoundé, Bamenda & Buea.
            </Alert>

            {/* Rating Stars Selector */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, py: 1.5, bgcolor: 'rgba(255, 184, 0, 0.08)', borderRadius: '12px', border: '1px solid rgba(255, 184, 0, 0.2)' }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary' }}>
                Your Star Rating
              </Typography>
              <Rating
                name="testimonial-rating"
                value={rating}
                precision={1}
                size="large"
                onChange={(_, newValue) => setRating(newValue)}
                onChangeActive={(_, newHover) => setHoverRating(newHover)}
                emptyIcon={<StarIcon style={{ opacity: 0.35 }} fontSize="inherit" />}
                sx={{ color: '#FFB800' }}
              />
              <Typography sx={{ fontSize: 12, color: '#D97706', fontWeight: 700 }}>
                {hoverRating !== -1
                  ? ['', 'Poor ★', 'Fair ★★', 'Good ★★★', 'Very Good ★★★★', 'Excellent ★★★★★'][hoverRating]
                  : ['', 'Poor ★', 'Fair ★★', 'Good ★★★', 'Very Good ★★★★', 'Excellent ★★★★★'][rating || 5]}
              </Typography>
            </Box>

            <TextField
              label="Your Full Name"
              required
              fullWidth
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Madame Marie-Noëlle Ebogo"
              size="small"
            />

            <TextField
              label="City & Role / Occupation (Optional)"
              fullWidth
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              placeholder="e.g. Bastos, Yaoundé • Household Client"
              size="small"
            />

            <TextField
              select
              label="Service Category Used"
              fullWidth
              value={serviceUsed}
              onChange={(e) => setServiceUsed(e.target.value)}
              size="small"
            >
              {SERVICE_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Your Review Comment / Feedback"
              required
              multiline
              rows={4}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe how the runner or technician assisted you with your task..."
              size="small"
            />

            {/* Public Publishing Consent Checkbox */}
            <Box sx={{ p: 1.5, bgcolor: 'rgba(255, 107, 0, 0.04)', borderRadius: '10px', border: '1px dashed rgba(255, 107, 0, 0.3)' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentToPublish}
                    onChange={(e) => setConsentToPublish(e.target.checked)}
                    sx={{ color: '#FF6B00', '&.Mui-checked': { color: '#FF6B00' } }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>
                    I agree to have my review and name displayed publicly on the Supermarche website.
                  </Typography>
                }
              />
            </Box>

            {isAdminMode && (
              <Box sx={{ p: 2, bgcolor: 'rgba(255, 107, 0, 0.06)', borderRadius: '10px', border: '1px solid rgba(255, 107, 0, 0.2)' }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#FF6B00', mb: 1, textTransform: 'uppercase' }}>
                  Admin Moderation Overrides
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <FormControlLabel
                    control={<Switch checked={autoApprove} onChange={(e) => setAutoApprove(e.target.checked)} size="small" color="success" />}
                    label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Approve Testimonial Immediately</Typography>}
                  />
                  <FormControlLabel
                    control={<Switch checked={autoFeature} onChange={(e) => setAutoFeature(e.target.checked)} size="small" color="success" />}
                    label={<Typography sx={{ fontSize: 13, fontWeight: 600 }}>Feature on Landing Page Immediately</Typography>}
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      {/* Fixed Modal Footer */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F9FAFB'),
        }}
      >
        {submitted ? (
          <Button
            variant="contained"
            onClick={handleResetAndClose}
            sx={{ bgcolor: '#FF6B00', px: 4, py: 1, fontWeight: 700, borderRadius: '10px', textTransform: 'none' }}
          >
            Done
          </Button>
        ) : (
          <>
            <Button onClick={handleResetAndClose} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="submit-review-modal-form"
              variant="contained"
              disabled={!authorName || !content || !rating}
              sx={{
                bgcolor: '#FF6B00',
                color: '#FFFFFF',
                fontWeight: 700,
                px: 3,
                py: 1,
                borderRadius: '10px',
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)',
                '&:hover': { bgcolor: '#E05D00' },
              }}
            >
              Submit Review for Moderation
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
