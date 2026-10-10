import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Switch,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import {
  updateTestimonialStatus,
  toggleTestimonialFeatured,
  deleteTestimonial,
  setTestimonials,
} from '../store/adminSlice';
import ReusableDataTable from '../../../components/ui/ReusableDataTable';
import type { ColumnDef } from '../../../components/ui/ReusableDataTable';
import type { Testimonial } from '../types/admin.types';
import { SubmitReviewModal } from '../../../components/ui/SubmitReviewModal';
import adminService from '../../../services/adminService';
import socketClient from '../../../api/socketClient';
import { getItemId } from '../../../utils/idHelper';

export function TestimonialModerationPanel() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const testimonials = useAppSelector((state) => state.admin.testimonials || []);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'FEATURED'>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [warningTestimonial, setWarningTestimonial] = useState<Testimonial | null>(null);

  const fetchAdminTestimonials = useCallback(() => {
    adminService
      .getTestimonials()
      .then((res: Testimonial[]) => {
        dispatch(setTestimonials(res));
      })
      .catch(() => {});
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
    fetchAdminTestimonials();

    const unsubscribe = socketClient.on('testimonial_updated', () => {
      if (isMounted) fetchAdminTestimonials();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchAdminTestimonials]);

  const pendingCount = testimonials.filter((t) => t.status === 'PENDING').length;
  const approvedCount = testimonials.filter((t) => t.status === 'APPROVED').length;
  const featuredCount = testimonials.filter((t) => t.isFeatured).length;

  const handleToggleFeatured = async (row: Testimonial) => {
    const targetId = getItemId(row);
    if (!targetId) return;

    if (!row.isFeatured && !row.consentToPublish) {
      setWarningTestimonial(row);
    } else {
      const nextState = !row.isFeatured;
      dispatch(toggleTestimonialFeatured(targetId));
      socketClient.emit('testimonial_updated', { id: targetId, isFeatured: nextState });
      try {
        await adminService.toggleTestimonialFeatured(targetId, nextState);
      } catch {
        // Fallback
      }
    }
  };

  const handleConfirmWarningFeature = async () => {
    if (warningTestimonial) {
      const targetId = getItemId(warningTestimonial);
      if (!targetId) return;
      dispatch(toggleTestimonialFeatured(targetId));
      socketClient.emit('testimonial_updated', { id: targetId, isFeatured: true });
      try {
        await adminService.toggleTestimonialFeatured(targetId, true);
      } catch {
        // Fallback
      }
      setWarningTestimonial(null);
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (filterTab === 'PENDING') return t.status === 'PENDING';
    if (filterTab === 'APPROVED') return t.status === 'APPROVED';
    if (filterTab === 'FEATURED') return t.isFeatured;
    return true;
  });

  const handleApprove = async (itemOrId: Testimonial | string) => {
    const targetId = typeof itemOrId === 'string' ? itemOrId : getItemId(itemOrId);
    if (!targetId) return;
    dispatch(updateTestimonialStatus({ id: targetId, status: 'APPROVED' }));
    socketClient.emit('testimonial_updated', { id: targetId, status: 'APPROVED' });
    try {
      await adminService.updateTestimonialStatus(targetId, 'APPROVED');
    } catch {
      // Fallback
    }
  };

  const handleReject = async (itemOrId: Testimonial | string) => {
    const targetId = typeof itemOrId === 'string' ? itemOrId : getItemId(itemOrId);
    if (!targetId) return;
    dispatch(updateTestimonialStatus({ id: targetId, status: 'REJECTED' }));
    socketClient.emit('testimonial_updated', { id: targetId, status: 'REJECTED' });
    try {
      await adminService.updateTestimonialStatus(targetId, 'REJECTED');
    } catch {
      // Fallback
    }
  };

  const handleDelete = async (itemOrId: Testimonial | string) => {
    const targetId = typeof itemOrId === 'string' ? itemOrId : getItemId(itemOrId);
    if (!targetId) return;
    dispatch(deleteTestimonial(targetId));
    socketClient.emit('testimonial_updated', { id: targetId, action: 'deleted' });
    try {
      await adminService.deleteTestimonial(targetId);
    } catch {
      // Fallback
    }
  };

  const columns: ColumnDef<Testimonial>[] = [
    {
      id: 'authorName',
      label: t('admin.colAuthorRole', 'AUTHOR & ROLE'),
      width: '22%',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 13, color: 'text.primary' }}>
            {row.authorName}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
            {row.authorRole || t('admin.defaultRole', 'Verified Client')}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'rating',
      label: t('admin.colRating', 'RATING'),
      width: '12%',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating value={row.rating} readOnly size="small" sx={{ color: '#FFB800' }} />
          <Typography sx={{ fontSize: 11, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace' }}>
            ({row.rating}.0)
          </Typography>
        </Box>
      ),
    },
    {
      id: 'serviceUsed',
      label: t('admin.colSkillCategory', 'SERVICE CATEGORY'),
      width: '18%',
      render: (row) => (
        <Chip
          label={row.serviceUsed || 'General Service'}
          size="small"
          sx={{ fontWeight: 600, fontSize: 10.5, bgcolor: 'rgba(255, 107, 0, 0.1)', color: '#FF6B00' }}
        />
      ),
    },
    {
      id: 'content',
      label: t('admin.colReviewContent', 'REVIEW CONTENT & FEEDBACK'),
      width: '27%',
      render: (row) => (
        <Typography
          sx={{
            fontSize: 12.5,
            fontStyle: 'italic',
            color: 'text.primary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          "{row.content}"
        </Typography>
      ),
    },
    {
      id: 'consentToPublish',
      label: t('admin.colConsentStatus', 'CONSENT STATUS'),
      width: '13%',
      render: (row) =>
        row.consentToPublish ? (
          <Chip
            icon={<VerifiedUserIcon sx={{ fontSize: '13px !important' }} />}
            label={t('admin.consentGiven', 'Consent Given')}
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontSize: 10, fontWeight: 700 }}
          />
        ) : (
          <Chip
            icon={<WarningAmberIcon sx={{ fontSize: '13px !important' }} />}
            label={t('admin.consentPrivate', 'Private / No Consent')}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ fontSize: 10, fontWeight: 700 }}
          />
        ),
    },
    {
      id: 'status',
      label: t('admin.colStatus', 'STATUS'),
      width: '10%',
      render: (row) => {
        const rawStatus = (row.status || 'PENDING').toString().toLowerCase();
        const statusKey = `admin.status${rawStatus.charAt(0).toUpperCase()}${rawStatus.slice(1)}`;
        return (
          <Chip
            label={t(statusKey, row.status)}
            size="small"
            color={
              row.status === 'APPROVED'
                ? 'success'
                : row.status === 'PENDING'
                ? 'warning'
                : 'error'
            }
            sx={{ fontSize: 10, fontWeight: 800 }}
          />
        );
      },
    },
    {
      id: 'isFeatured',
      label: t('admin.colLandingPage', 'LANDING PAGE'),
      width: '12%',
      render: (row) => (
        <Tooltip title={row.isFeatured ? 'Featured on Landing Page' : 'Not Featured'}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              size="small"
              checked={row.isFeatured}
              onChange={() => handleToggleFeatured(row)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#FF6B00' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#FF6B00' },
              }}
            />
            <Typography sx={{ fontSize: 11, fontWeight: row.isFeatured ? 700 : 400, color: row.isFeatured ? '#FF6B00' : 'text.disabled' }}>
              {row.isFeatured ? t('admin.switchFeatured', 'Featured') : t('admin.switchHidden', 'Hidden')}
            </Typography>
          </Box>
        </Tooltip>
      ),
    },
    {
      id: 'actions',
      label: t('admin.colModerationActions', 'MODERATION ACTIONS'),
      width: '14%',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {row.status !== 'APPROVED' && (
            <Tooltip title="Approve Testimonial">
              <IconButton
                size="small"
                color="success"
                onClick={() => handleApprove(row)}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {row.status !== 'REJECTED' && (
            <Tooltip title="Reject Testimonial">
              <IconButton
                size="small"
                color="warning"
                onClick={() => handleReject(row)}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Delete Permanently">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxHeight: 'calc(100vh - 160px)', minHeight: 0 }}>
      {/* Header Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          flexShrink: 0,
          borderRadius: '16px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 0.5 }}>
            <RateReviewIcon sx={{ color: '#FF6B00', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('admin.testimonialsTitle', 'Customer Testimonials & Ratings Moderation')}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
            {t('admin.testimonialsSub', 'Approve incoming public reviews, toggle homepage featured status, and moderate client ratings.')}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
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
          {t('admin.addTestimonialBtn', 'Add New Testimonial')}
        </Button>
      </Paper>

      {/* Filter Tabs */}
      <Paper
        elevation={0}
        sx={{
          flexShrink: 0,
          borderRadius: '14px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          px: 2,
          py: 0.5,
        }}
      >
        <Tabs
          value={filterTab}
          onChange={(_, val) => setFilterTab(val)}
          textColor="inherit"
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#FF6B00', height: 3 },
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: 13 },
          }}
        >
          <Tab value="ALL" label={t('admin.tabAllReviews', 'All Reviews ({{count}})', { count: testimonials.length })} />
          <Tab
            value="PENDING"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {t('admin.tabPendingModeration', 'Pending Moderation')}
                {pendingCount > 0 && (
                  <Chip label={pendingCount} size="small" color="warning" sx={{ height: 18, fontSize: 10, fontWeight: 800 }} />
                )}
              </Box>
            }
          />
          <Tab value="APPROVED" label={t('admin.tabApprovedReviews', 'Approved ({{count}})', { count: approvedCount })} />
          <Tab value="FEATURED" label={t('admin.tabFeaturedLanding', 'Featured on Landing ({{count}})', { count: featuredCount })} />
        </Tabs>
      </Paper>

      {/* Testimonials DataTable */}
      <ReusableDataTable
        keyExtractor={(row: Testimonial & { _id?: string }) => row.id || row._id || `tst_${Math.random()}`}
        columns={columns}
        data={filteredTestimonials}
        searchPlaceholder={t('admin.searchTestimonialsPlaceholder', 'Search testimonials by author name, comment, or service...')}
        subtitle={t('admin.tableManageFeedbackSub', 'Manage customer feedback pipeline with real-time approval & homepage toggle')}
        enableInfiniteScroll={true}
      />

      <SubmitReviewModal open={modalOpen} onClose={() => setModalOpen(false)} isAdminMode={true} />

      {/* Safeguard Consent Warning Dialog */}
      <Dialog
        open={Boolean(warningTestimonial)}
        onClose={() => setWarningTestimonial(null)}
        disableRestoreFocus
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main', fontWeight: 700 }}>
          <WarningAmberIcon />
          Public Display Consent Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13.5, color: 'text.primary', lineHeight: 1.6 }}>
            Warning: <strong>{warningTestimonial?.authorName}</strong> did not check the box allowing public display (<code>consentToPublish: false</code>).
            <br /><br />
            Are you sure you want to feature this review on the landing page?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setWarningTestimonial(null)} color="inherit" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmWarningFeature}
            color="warning"
            variant="contained"
            sx={{ fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
          >
            Proceed & Feature Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
