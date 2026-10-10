import { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import LanguageIcon from '@mui/icons-material/Language';
import { useAppDispatch } from '../../../store/hooks';
import { updateTicketStatusInAdmin, assignRunnerToTicket } from '../store/adminSlice';
import type { DispatchedTicket, FieldRunner } from '../types/admin.types';
import ReusableDataTable from '../../../components/ui/ReusableDataTable';
import type { ColumnDef } from '../../../components/ui/ReusableDataTable';
import { formatShortId } from '../../../utils/idHelper';

interface TicketManagementTableProps {
  tickets: DispatchedTicket[];
  runners: FieldRunner[];
}

export function TicketManagementTable({ tickets, runners }: TicketManagementTableProps) {
  const dispatch = useAppDispatch();
  const [selectedTicket, setSelectedTicket] = useState<DispatchedTicket | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRunnerId, setSelectedRunnerId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTickets = tickets.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const handleOpenAssign = (ticket: DispatchedTicket) => {
    setSelectedTicket(ticket);
    setSelectedRunnerId(ticket.technicianId || '');
    setAssignDialogOpen(true);
  };

  const handleSaveAssign = () => {
    if (!selectedTicket || !selectedRunnerId) return;
    const runner = runners.find((r) => r.id === selectedRunnerId);
    if (runner) {
      dispatch(
        assignRunnerToTicket({
          ticketId: selectedTicket.id,
          runnerId: runner.id,
          runnerName: runner.name,
        })
      );
    }
    setAssignDialogOpen(false);
  };

  const getStatusChip = (status: DispatchedTicket['status']) => {
    switch (status) {
      case 'in_progress':
        return <Chip label="In Progress" size="small" sx={{ bgcolor: '#2563EB', color: '#FFF', fontWeight: 600 }} />;
      case 'dispatched':
        return <Chip label="Dispatched" size="small" sx={{ bgcolor: '#FF6B00', color: '#FFF', fontWeight: 600 }} />;
      case 'completed':
        return <Chip label="Completed" size="small" sx={{ bgcolor: '#059669', color: '#FFF', fontWeight: 600 }} />;
      case 'action_needed':
        return <Chip label="Action Needed" size="small" sx={{ bgcolor: '#D97706', color: '#FFF', fontWeight: 600 }} />;
      default:
        return <Chip label={status} size="small" sx={{ bgcolor: '#6B7280', color: '#FFF' }} />;
    }
  };

  const columns: ColumnDef<DispatchedTicket>[] = [
    {
      id: 'id',
      label: 'TICKET ID',
      minWidth: 100,
      render: (ticket) => (
        <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: '#FF6B00', fontSize: 11 }}>
          {formatShortId(ticket.id, 'TKT')}
        </Typography>
      ),
    },
    {
      id: 'customerName',
      label: 'CUSTOMER & LOCATION',
      minWidth: 180,
      render: (ticket) => (
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{ticket.customerName}</Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>
            {ticket.city} • {ticket.district}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'serviceTitle',
      label: 'SERVICE WORK ORDER',
      minWidth: 200,
      render: (ticket) => (
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{ticket.serviceTitle}</Typography>
      ),
    },
    {
      id: 'channel',
      label: 'CHANNEL',
      minWidth: 120,
      render: (ticket) => (
        <Chip
          icon={ticket.channel === 'mobile_app' ? <SmartphoneIcon sx={{ fontSize: '14px !important' }} /> : <LanguageIcon sx={{ fontSize: '14px !important' }} />}
          label={ticket.channel === 'mobile_app' ? 'Mobile App' : 'Web Catalog'}
          size="small"
          variant="outlined"
          sx={{ fontSize: 11, fontWeight: 600 }}
        />
      ),
    },
    {
      id: 'priceXAF',
      label: 'PRICE (XAF)',
      minWidth: 110,
      render: (ticket) => (
        <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 13 }}>
          XAF {ticket.priceXAF.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: 'technicianName',
      label: 'ASSIGNED RUNNER',
      minWidth: 150,
      render: (ticket) => (
        ticket.technicianName ? (
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#FF6B00' }}>
            {ticket.technicianName}
          </Typography>
        ) : (
          <Chip label="Unassigned" size="small" color="error" variant="outlined" sx={{ fontSize: 10 }} />
        )
      ),
    },
    {
      id: 'status',
      label: 'STATUS',
      minWidth: 120,
      render: (ticket) => getStatusChip(ticket.status),
    },
    {
      id: 'actions',
      label: 'ACTIONS',
      minWidth: 120,
      align: 'right',
      render: (ticket) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleOpenAssign(ticket)}
          sx={{ textTransform: 'none', fontSize: 12, fontWeight: 600, borderRadius: '8px' }}
        >
          Assign / Edit
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <ReusableDataTable
        title="Work Order & Ticket Dispatch Engine"
        subtitle="Manage customer requests originating from Mobile Apps and Web Catalog with native infinite scroll"
        columns={columns}
        data={filteredTickets}
        keyExtractor={(ticket) => ticket.id}
        searchPlaceholder="Search ticket ID, customer, or district..."
        enableInfiniteScroll={true}
        headerActions={
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Filter Status</InputLabel>
            <Select value={statusFilter} label="Filter Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All Ticket Statuses</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="dispatched">Dispatched</MenuItem>
              <MenuItem value="action_needed">Action Needed</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        }
      />

      {/* Assignment & Status Modal */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} disableRestoreFocus maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
          Assign Runner & Update Ticket
        </DialogTitle>
        <DialogContent dividers>
          {selectedTicket && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>TICKET ID</Typography>
                <Typography sx={{ fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', color: '#FF6B00' }}>
                  {selectedTicket.id}
                </Typography>
                <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{selectedTicket.serviceTitle}</Typography>
              </Box>

              <FormControl fullWidth size="small">
                <InputLabel>Select Field Runner</InputLabel>
                <Select
                  value={selectedRunnerId}
                  label="Select Field Runner"
                  onChange={(e) => setSelectedRunnerId(e.target.value)}
                >
                  {runners.map((r) => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.name} ({r.city} - {r.district})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Update Status</InputLabel>
                <Select
                  value={selectedTicket.status}
                  label="Update Status"
                  onChange={(e) => {
                    const newStatus = e.target.value as DispatchedTicket['status'];
                    dispatch(updateTicketStatusInAdmin({ id: selectedTicket.id, status: newStatus }));
                    setSelectedTicket({ ...selectedTicket, status: newStatus });
                  }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="dispatched">Dispatched</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="action_needed">Action Needed</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAssign} sx={{ bgcolor: '#FF6B00', '&:hover': { bgcolor: '#E05D00' } }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TicketManagementTable;
