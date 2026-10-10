import React, { useState, useEffect, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import type { FAQItem } from '../../../types/faq';
import { adminFaqService, DEFAULT_FAQ_CATEGORIES } from '../../../services/adminFaqService';
import ReusableDataTable from '../../../components/ui/ReusableDataTable';
import type { ColumnDef } from '../../../components/ui/ReusableDataTable';
import { getItemId, formatShortId } from '../../../utils/idHelper';
import { HasPermission } from '../../../components/ui/HasPermission';

import { useToast } from '../../../context/useToast';

export function FaqManagementPanel() {
  const { t } = useTranslation();
  const toast = useToast();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  // Form State
  const [formCategoryId, setFormCategoryId] = useState<string>('cat-general');
  const [formPage, setFormPage] = useState<string>('help');
  const [formQuestion, setFormQuestion] = useState<string>('');
  const [formAnswer, setFormAnswer] = useState<string>('');
  const [formTargetRole, setFormTargetRole] = useState<'ALL' | 'CUSTOMER' | 'PRO'>('ALL');
  const [formOrderIndex, setFormOrderIndex] = useState<number>(1);
  const [formIsPublished, setFormIsPublished] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const data = await adminFaqService.getAdminFaqs();
      setFaqs(data);
    } catch {
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    adminFaqService
      .getAdminFaqs()
      .then((data) => {
        if (isMounted) {
          setFaqs(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFaqs([]);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenCreateModal = () => {
    setEditingFaq(null);
    setFormCategoryId('cat-general');
    setFormPage('help');
    setFormQuestion('');
    setFormAnswer('');
    setFormTargetRole('ALL');
    setFormOrderIndex(faqs.length + 1);
    setFormIsPublished(true);
    setModalOpen(true);
  };

  const handleOpenEditModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setFormCategoryId(faq.categoryId || 'cat-general');
    setFormPage((faq as unknown as { page?: string }).page || (faq.targetRole === 'PRO' || faq.categoryId === 'cat-pro' ? 'become-a-provider' : 'help'));
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormTargetRole(faq.targetRole || 'ALL');
    setFormOrderIndex(faq.orderIndex || 1);
    setFormIsPublished(faq.isPublished);
    setModalOpen(true);
  };

  const handleSaveFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const catObj = DEFAULT_FAQ_CATEGORIES.find((c) => c.id === formCategoryId);
    const categoryName = catObj ? catObj.name : 'General Information';
    const targetPage = formPage || (formTargetRole === 'PRO' || formCategoryId === 'cat-pro' ? 'become-a-provider' : 'help');

    const payload: Partial<FAQItem> & { page?: string; is_published?: boolean } = {
      categoryId: formCategoryId,
      categoryName,
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      targetRole: formTargetRole,
      page: targetPage,
      orderIndex: Number(formOrderIndex) || 1,
      isPublished: formIsPublished,
      is_published: formIsPublished,
    };

    try {
      if (editingFaq) {
        const targetId = getItemId(editingFaq);
        const updated = await adminFaqService.updateFaq(targetId, payload);
        setFaqs((prev) => prev.map((f) => (getItemId(f) === targetId ? { ...f, ...updated } : f)));
      } else {
        const created = await adminFaqService.createFaq(payload);
        setFaqs((prev) => [created, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      console.warn('Failed to save FAQ record:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublished = async (faq: FAQItem) => {
    const targetId = getItemId(faq);
    const nextState = !faq.isPublished;
    // Optimistic UI update
    setFaqs((prev) => prev.map((f) => (getItemId(f) === targetId ? { ...f, isPublished: nextState } : f)));

    try {
      await adminFaqService.toggleFaqPublishStatus(targetId, nextState);
    } catch {
      // Revert if failed
      setFaqs((prev) => prev.map((f) => (getItemId(f) === targetId ? { ...f, isPublished: faq.isPublished } : f)));
    }
  };

  const handleDeleteFaq = (faqId: string) => {
    toast.confirm({
      title: 'Delete FAQ Entry',
      message: 'Are you sure you want to delete this FAQ question and answer?',
      confirmText: 'Delete FAQ',
      color: 'error',
      onConfirm: async () => {
        setFaqs((prev) => prev.filter((f) => getItemId(f) !== faqId));
        try {
          await adminFaqService.deleteFaq(faqId);
          toast.success('FAQ entry successfully deleted.');
        } catch {
          fetchFaqs();
          toast.error('Failed to delete FAQ entry. Reverting list.');
        }
      },
    });
  };

  // Filtered FAQ list
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchSearch =
        !searchQuery ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = categoryFilter === 'all' || faq.categoryId === categoryFilter;
      const matchRole = roleFilter === 'all' || faq.targetRole === roleFilter;

      return matchSearch && matchCat && matchRole;
    }).sort((a, b) => (a.orderIndex || 1) - (b.orderIndex || 1));
  }, [faqs, searchQuery, categoryFilter, roleFilter]);

  const getTranslatedFaqCategory = (catId: string, defaultName: string) => {
    if (catId === 'cat-general' || catId === 'general') return t('admin.faqCatGeneral', defaultName);
    if (catId === 'cat-booking' || catId === 'booking') return t('admin.faqCatBooking', defaultName);
    if (catId === 'cat-payments' || catId === 'payments') return t('admin.faqCatPayments', defaultName);
    if (catId === 'cat-pro' || catId === 'pro') return t('admin.faqCatPro', defaultName);
    if (catId === 'cat-safety' || catId === 'safety') return t('admin.faqCatSafety', defaultName);
    if (catId === 'cat-app' || catId === 'app') return t('admin.faqCatApp', defaultName);
    return defaultName;
  };

  const columns: ColumnDef<FAQItem>[] = [
    {
      id: 'id',
      label: t('admin.colFaqId', 'FAQ ID'),
      width: '10%',
      render: (row) => (
        <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>
          {formatShortId(row.id, 'FAQ')}
        </Typography>
      ),
    },
    {
      id: 'question',
      label: t('admin.colQuestionAnswer', 'QUESTION & ANSWER SNIPPET'),
      width: '38%',
      render: (row) => (
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }} noWrap>
            {row.question}
          </Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {row.answer}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'category',
      label: t('admin.colCategory', 'CATEGORY'),
      width: '18%',
      render: (row) => {
        const catObj = DEFAULT_FAQ_CATEGORIES.find((c) => c.id === row.categoryId);
        const catLabel = getTranslatedFaqCategory(row.categoryId, catObj ? catObj.name : row.categoryName || 'General');
        return (
          <Chip
            label={catLabel}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: 10,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0,0.15)' : '#FFF4ED'),
              color: '#FF6B00',
              borderRadius: '6px',
            }}
          />
        );
      },
    },
    {
      id: 'targetRole',
      label: t('admin.colAudience', 'AUDIENCE'),
      width: '12%',
      render: (row) => {
        const role = row.targetRole || 'ALL';
        const roleColor = role === 'PRO' ? 'warning' : role === 'CUSTOMER' ? 'primary' : 'default';
        return (
          <Chip
            label={role}
            size="small"
            color={roleColor}
            variant="outlined"
            sx={{ fontWeight: 800, fontSize: 9, borderRadius: '4px' }}
          />
        );
      },
    },
    {
      id: 'isPublished',
      label: t('admin.colPublished', 'PUBLISHED'),
      width: '10%',
      render: (row) => (
        <Switch
          checked={row.isPublished}
          onChange={() => handleTogglePublished(row)}
          color="success"
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: t('admin.colActions', 'ACTIONS'),
      width: '12%',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          <Tooltip title="Edit FAQ">
            <IconButton size="small" onClick={() => handleOpenEditModal(row)} sx={{ color: '#FF6B00' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <HasPermission permission="PAGES_EDIT">
            <Tooltip title="Delete FAQ">
              <IconButton
                size="small"
                onClick={() => handleDeleteFaq(row.id)}
                sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </HasPermission>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxHeight: 'calc(100vh - 160px)', minHeight: 0 }}>
      {/* Header Controls Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          flexShrink: 0,
          borderRadius: '16px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
          border: '1px solid',
          borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: 'rgba(255, 107, 0, 0.12)',
              color: '#FF6B00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QuizIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('admin.faqConsoleTitle', 'Dynamic FAQ Management Console')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 12 }}>
              {t('admin.faqConsoleSub', 'Publish, update, reorder & categorize live Help Center questions without redeploying')}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateModal}
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '10px',
            bgcolor: '#FF6B00',
            '&:hover': { bgcolor: '#E05D00' },
            px: 2.5,
            py: 1,
          }}
        >
          {t('admin.addNewFaqBtn', 'Add New FAQ')}
        </Button>
      </Paper>

      {/* Table & Filters */}
      <ReusableDataTable
        title={t('admin.faqDirectoryTitle', 'Help Center & App FAQ Directory')}
        subtitle={t('admin.faqDirectorySub', 'Manage public accordion questions, target customer roles, and toggle instant visibility')}
        columns={columns}
        data={filteredFaqs}
        keyExtractor={(row) => row.id}
        searchPlaceholder={t('admin.searchFaqsPlaceholder', 'Search questions or answers...')}
        onSearchChange={(val) => setSearchQuery(val)}
        isLoading={isLoading}
        emptyMessage="No FAQ entries found matching the selected filters."
        enableInfiniteScroll={true}
        headerActions={
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {/* Category Filter */}
            <TextField
              select
              size="small"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">{t('admin.allCategoriesFilter', 'All Categories')}</MenuItem>
              {DEFAULT_FAQ_CATEGORIES.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {getTranslatedFaqCategory(cat.id, cat.name)}
                </MenuItem>
              ))}
            </TextField>

            {/* Target Role Filter */}
            <TextField
              select
              size="small"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="all">{t('admin.allAudiencesFilter', 'All Audiences')}</MenuItem>
              <MenuItem value="ALL">{t('admin.audienceGeneral', 'General (All)')}</MenuItem>
              <MenuItem value="CUSTOMER">{t('admin.audienceCustomer', 'Customer Only')}</MenuItem>
              <MenuItem value="PRO">{t('admin.audiencePro', 'Pro Partner Only')}</MenuItem>
            </TextField>
          </Box>
        }
      />

      {/* Create / Edit FAQ Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        disableRestoreFocus
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F8FAFC'),
            borderBottom: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
            {editingFaq ? t('admin.editFaqTitle', 'Edit FAQ Entry') : t('admin.createFaqTitle', 'Create New FAQ Entry')}
          </Typography>
          <IconButton size="small" onClick={() => setModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleSaveFaqSubmit}>
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  fullWidth
                  label={t('admin.categoryLabel', 'Category')}
                  size="small"
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  required
                >
                  {DEFAULT_FAQ_CATEGORIES.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {getTranslatedFaqCategory(cat.id, cat.name)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  select
                  fullWidth
                  label={t('admin.targetPageLabel', 'Target Page')}
                  size="small"
                  value={formPage}
                  onChange={(e) => setFormPage(e.target.value)}
                  required
                >
                  <MenuItem value="help">Help Center (/help)</MenuItem>
                  <MenuItem value="become-a-provider">Become a Pro (/become-a-provider)</MenuItem>
                  <MenuItem value="all">All App Pages</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  select
                  fullWidth
                  label={t('admin.targetAudienceLabel', 'Target Audience')}
                  size="small"
                  value={formTargetRole}
                  onChange={(e) => setFormTargetRole(e.target.value as 'ALL' | 'CUSTOMER' | 'PRO')}
                  required
                >
                  <MenuItem value="ALL">{t('admin.audienceGeneral', 'General (All)')}</MenuItem>
                  <MenuItem value="CUSTOMER">{t('admin.audienceCustomer', 'Customer Only')}</MenuItem>
                  <MenuItem value="PRO">{t('admin.audiencePro', 'Pro Partner Only')}</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 3 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('admin.orderIndexLabel', 'Display Order Index')}
                  size="small"
                  value={formOrderIndex}
                  onChange={(e) => setFormOrderIndex(Number(e.target.value))}
                  slotProps={{ htmlInput: { min: 1 } }}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('admin.questionLabel', 'Question (English / Default)')}
                  placeholder="e.g., How long does cooking gas refill delivery take in Bastos?"
                  size="small"
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('admin.answerLabel', 'Answer (English / Default)')}
                  placeholder="Provide clear, concise instructions or explanation for customers..."
                  size="small"
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Switch
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    color="success"
                  />
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {t('admin.publishImmediatelyLabel', 'Publish Immediately on Site & App')} ({formIsPublished ? t('admin.badgeVerified', 'Published') : t('admin.badgeDraft', 'Draft / Offline')})
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2.5,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F8FAFC'),
              borderTop: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Button onClick={() => setModalOpen(false)} sx={{ color: 'text.secondary' }}>
              {t('admin.cancelBtn', 'Cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={isSubmitting || !formQuestion.trim() || !formAnswer.trim()}
              sx={{ fontWeight: 700, borderRadius: '8px', bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}
            >
              {editingFaq ? t('admin.editFaqTitle', 'Update FAQ') : t('admin.addNewFaqBtn', 'Save & Publish FAQ')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default FaqManagementPanel;
