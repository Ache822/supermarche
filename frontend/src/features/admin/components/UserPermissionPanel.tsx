import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  IconButton,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { addSystemUser, updateUserPermissions, deleteSystemUser, setSystemUsers } from '../store/adminSlice';
import type { SystemUser } from '../types/admin.types';
import { AVAILABLE_BACKEND_PERMISSIONS } from '../types/admin.types';
import ReusableDataTable from '../../../components/ui/ReusableDataTable';
import type { ColumnDef } from '../../../components/ui/ReusableDataTable';
import { HasPermission } from '../../../components/ui/HasPermission';
import { VerifiedBadge } from '../../../components/ui/VerifiedBadge';
import api from '../../../api/client';
import adminService from '../../../services/adminService';
import { getItemId, formatShortId } from '../../../utils/idHelper';

import { useToast } from '../../../context/useToast';

const ALL_PERMISSIONS = AVAILABLE_BACKEND_PERMISSIONS;

export function UserPermissionPanel() {
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.admin.users || []);

  useEffect(() => {
    adminService
      .getUsers()
      .then((res: unknown) => {
        const rawList = (Array.isArray(res) ? res : (res as { data?: unknown[] })?.data || []) as Record<string, unknown>[];
        const normalized: SystemUser[] = rawList.map((u, idx) => ({
          id: String(u.id || u._id || `USR-${1000 + idx}`),
          name: String(u.name || u.fullName || u.email?.toString().split('@')[0] || 'Team Member'),
          email: String(u.email || ''),
          phone: String(u.phone || '+237 670 00 00 00'),
          role: (u.role as SystemUser['role']) || 'ADMIN',
          permissions: (Array.isArray(u.permissions) ? u.permissions : ['pages:read', 'support:chat']) as string[],
          status: (u.status as SystemUser['status']) || 'active',
          createdAt: String(u.createdAt || new Date().toISOString().split('T')[0]),
        }));
        dispatch(setSystemUsers(normalized));
      })
      .catch((err) => {
        console.error('Error fetching backend team members:', err);
      });
  }, [dispatch]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalUser, setEditModalUser] = useState<SystemUser | null>(null);

  // New user form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<SystemUser['role']>('ADMIN');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['pages:read', 'support:chat']);

  const handleOpenEdit = (user: SystemUser) => {
    setEditModalUser(user);
  };

  const handleTogglePermission = (permId: string) => {
    if (selectedPermissions.includes(permId)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permId));
    } else {
      setSelectedPermissions([...selectedPermissions, permId]);
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: SystemUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone,
      role,
      permissions: selectedPermissions,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    dispatch(addSystemUser(newUser));

    api.users
      .invite({
        name,
        email,
        permissions: selectedPermissions,
      } as unknown as { email: string; permissions: string[] })
      .catch(() => {});

    setCreateModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const getTranslatedPermissionLabel = (permId: string, defaultLabel: string) => {
    if (permId === '*') return t('admin.permFullAccess', defaultLabel);
    if (permId === 'pages:read') return t('admin.permPagesRead', defaultLabel);
    if (permId === 'pages:edit') return t('admin.permPagesEdit', defaultLabel);
    if (permId === 'users:read') return t('admin.permUsersRead', defaultLabel);
    if (permId === 'users:manage') return t('admin.permUsersManage', defaultLabel);
    if (permId === 'support:chat') return t('admin.permSupportChat', defaultLabel);
    if (permId === 'campaigns:manage') return t('admin.permCampaignsManage', defaultLabel);
    if (permId === 'faqs:manage') return t('admin.permFaqsManage', defaultLabel);
    if (permId === 'articles:manage') return t('admin.permArticlesManage', defaultLabel);
    if (permId === 'applications:read') return t('admin.permApplicationsRead', defaultLabel);
    if (permId === 'applications:manage') return t('admin.permApplicationsManage', defaultLabel);
    return defaultLabel;
  };

  const columns: ColumnDef<SystemUser>[] = [
    {
      id: 'id',
      label: t('admin.colUserId', 'USER ID'),
      width: '10%',
      render: (row) => (
        <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>
          {formatShortId(getItemId(row), 'USR')}
        </Typography>
      ),
    },
    {
      id: 'name',
      label: t('admin.colOperatorName', 'OPERATOR NAME'),
      width: '24%',
      render: (row) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13 }} noWrap>{row.name}</Typography>
            {(row.status === 'active') && (
              <VerifiedBadge size={16} title="Verified Admin / System Operator" />
            )}
          </Box>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }} noWrap>{row.email}</Typography>
        </Box>
      ),
    },
    {
      id: 'role',
      label: t('admin.colAccessLevel', 'ACCESS LEVEL'),
      width: '16%',
      render: (row) => {
        let chipColor: 'error' | 'primary' | 'success' | 'warning' = 'primary';
        if (row.role === 'admin') chipColor = 'error';
        else if (row.role === 'dispatcher') chipColor = 'warning';
        else if (row.role === 'support') chipColor = 'success';

        const roleStr = (row.role || 'ADMIN').toString();
        return (
          <Chip
            label={roleStr.toUpperCase()}
            size="small"
            color={chipColor}
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: 10, borderRadius: '6px' }}
          />
        );
      },
    },
    {
      id: 'permissions',
      label: t('admin.colAssignedPermissions', 'ASSIGNED PERMISSIONS'),
      width: '38%',
      render: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.permissions.length === 0 ? (
            <Typography sx={{ fontSize: 11, color: 'text.disabled', fontStyle: 'italic' }}>
              {t('admin.noPermissionsAssigned', 'No permissions assigned')}
            </Typography>
          ) : (
            row.permissions.map((pId) => {
              const permObj = ALL_PERMISSIONS.find((p) => p.id === pId);
              const label = getTranslatedPermissionLabel(pId, permObj ? permObj.label : pId);
              return (
                <Chip
                  key={pId}
                  label={label}
                  size="small"
                  sx={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0,0.15)' : '#FFF4ED'),
                    color: '#FF6B00',
                    borderRadius: '4px',
                    height: 20,
                  }}
                />
              );
            })
          )}
        </Box>
      ),
    },
    {
      id: 'actions',
      label: t('admin.colActions', 'ACTIONS'),
      width: '12%',
      align: 'right',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
          <HasPermission permission="USER_MANAGEMENT">
            <IconButton
              size="small"
              onClick={() => handleOpenEdit(row)}
              title="Edit Permissions"
              sx={{ color: '#FF6B00' }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </HasPermission>
          <HasPermission permission="USER_MANAGEMENT">
            <IconButton
              size="small"
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                const targetId = getItemId(row);
                if (!targetId) return;
                toast.confirm({
                  title: 'Delete System User',
                  message: `Are you sure you want to delete operator "${row.name}" (${row.email})?`,
                  confirmText: 'Delete User',
                  color: 'error',
                  onConfirm: () => {
                    dispatch(deleteSystemUser(targetId));
                    api.users.delete(targetId).catch(() => {});
                    toast.success(`User "${row.name}" removed from system operator fleet.`);
                  },
                });
              }}
              title="Delete user"
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </HasPermission>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%', maxHeight: 'calc(100vh - 160px)', minHeight: 0 }}>
      <ReusableDataTable
        title={t('admin.userPermissionTitle', 'Admin & Operations User Permission Control')}
        subtitle={t('admin.userPermissionSub', 'Manage operational staff, assign access rights, and create system operator accounts')}
        columns={columns}
        data={users}
        keyExtractor={(row) => getItemId(row)}
        searchPlaceholder={t('admin.searchUsersPlaceholder', 'Search users by name, email or role...')}
        enableInfiniteScroll={true}
        headerActions={
          <HasPermission permission="USER_MANAGEMENT">
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setCreateModalOpen(true)}
              sx={{
                bgcolor: '#FF6B00',
                '&:hover': { bgcolor: '#E05D00' },
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '10px',
              }}
            >
              {t('admin.createNewUser', 'Create New User')}
            </Button>
          </HasPermission>
        }
      />

      {/* Create User Modal */}
      <Dialog
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        disableRestoreFocus
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 2,
            px: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AdminPanelSettingsIcon sx={{ color: '#FF6B00' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('admin.createUserTitle', 'Create Operations User')}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setCreateModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleCreateUser} sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              pt: '24px !important',
              pb: 3,
              px: 3,
              overflowY: 'auto',
              maxHeight: 'calc(80vh - 130px)',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0, 0.4)', borderRadius: '4px' },
            }}
          >
            <TextField
              label={t('admin.fullNameLabel', 'Full Name')}
              required
              fullWidth
              size="small"
              sx={{
                mt: 0.5,
                '& .MuiInputLabel-root': { fontSize: '0.8125rem !important' },
                '& .MuiInputBase-input': { fontSize: '0.8125rem !important' },
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label={t('admin.emailLabel', 'Email Address')}
              required
              type="email"
              fullWidth
              size="small"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.8125rem !important' },
                '& .MuiInputBase-input': { fontSize: '0.8125rem !important' },
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label={t('admin.phoneLabel', 'Phone (+237)')}
              fullWidth
              size="small"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.8125rem !important' },
                '& .MuiInputBase-input': { fontSize: '0.8125rem !important' },
              }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              select
              label={t('admin.accountRoleLabel', 'Account Role')}
              fullWidth
              size="small"
              sx={{
                '& .MuiInputLabel-root': { fontSize: '0.8125rem !important' },
                '& .MuiInputBase-input': { fontSize: '0.8125rem !important' },
              }}
              value={role}
              onChange={(e) => setRole(e.target.value as SystemUser['role'])}
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="DISPATCHER">DISPATCHER</MenuItem>
              <MenuItem value="SUPPORT">SUPPORT</MenuItem>
            </TextField>

            <Typography sx={{ fontWeight: 700, fontSize: 13, mt: 0.5 }}>
              {t('admin.assignPermissionsLabel', 'Assign Operational Permissions:')}
            </Typography>

            {/* Scrollable Permissions Box Container */}
            <Box
              sx={{
                maxHeight: 200,
                overflowY: 'auto',
                p: 1.5,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#F8FAFC'),
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0, 0.5)', borderRadius: '3px' },
              }}
            >
              {ALL_PERMISSIONS.map((perm) => (
                <FormControlLabel
                  key={perm.id}
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(perm.id)}
                      onChange={() => handleTogglePermission(perm.id)}
                      sx={{ color: '#FF6B00', '&.Mui-checked': { color: '#FF6B00' }, py: 0.5 }}
                    />
                  }
                  label={<Typography sx={{ fontSize: 13, fontWeight: 500 }}>{getTranslatedPermissionLabel(perm.id, perm.label)}</Typography>}
                />
              ))}
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              p: 2,
              px: 3,
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button onClick={() => setCreateModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
              {t('admin.cancelBtn', 'Cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' }, fontWeight: 700, textTransform: 'none', px: 3, borderRadius: '10px' }}
            >
              {t('admin.createAccountBtn', 'Create Account')}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Edit User Modal */}
      {editModalUser && (
        <Dialog
          open={Boolean(editModalUser)}
          onClose={() => setEditModalUser(null)}
          disableRestoreFocus
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: '20px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              borderBottom: '1px solid',
              borderColor: 'divider',
              py: 2,
              px: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              {t('admin.editPermissionsTitle', 'Edit Permissions')}: {editModalUser.name}
            </Typography>
            <IconButton size="small" onClick={() => setEditModalUser(null)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
              pt: '24px !important',
              pb: 3,
              px: 3,
              overflowY: 'auto',
            }}
          >
            <TextField
              select
              label={t('admin.accountStatusLabel', 'Account Status')}
              fullWidth
              size="small"
              sx={{ mt: 0.5 }}
              value={editModalUser.status}
              onChange={(e) => {
                dispatch(
                  updateUserPermissions({
                    id: editModalUser.id,
                    role: editModalUser.role,
                    permissions: editModalUser.permissions,
                    status: e.target.value as SystemUser['status'],
                  })
                );
                setEditModalUser({ ...editModalUser, status: e.target.value as SystemUser['status'] });
              }}
            >
              <MenuItem value="active">{t('admin.statusActive', 'Active')}</MenuItem>
              <MenuItem value="inactive">{t('admin.statusInactive', 'Inactive')}</MenuItem>
            </TextField>

            <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
              User Role: <strong>{(editModalUser.role || 'ADMIN').toString().toUpperCase()}</strong>
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              p: 2,
              px: 3,
              position: 'sticky',
              bottom: 0,
              zIndex: 10,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Button
              variant="contained"
              onClick={() => setEditModalUser(null)}
              sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' }, fontWeight: 700, textTransform: 'none', px: 3, borderRadius: '10px' }}
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default UserPermissionPanel;
