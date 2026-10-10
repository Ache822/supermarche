import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setSelectedTicket, updateTicketStatus } from '../../store/ticketsSlice';
import { ServiceTicketCard } from '../../components/ui/ServiceTicketCard';
import { VerifiedBadge } from '../../components/ui/VerifiedBadge';

export function TrackingDashboard() {
  const dispatch = useAppDispatch();
  const { activeTickets, selectedTicketId } = useAppSelector((state) => state.tickets);

  const selectedTicket =
    activeTickets.find((t) => t.id === selectedTicketId) || activeTickets[0];

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              Work Order Ticket Tracking
            </Typography>
            <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'primary.main', mt: 0.5 }}>
              REAL-TIME DISPATCH MONITORING • CAMEROON HUB
            </Typography>
          </Box>

          <Chip
            icon={<ConfirmationNumberIcon sx={{ color: '#FF6B00 !important' }} />}
            label={`${activeTickets.length} Active Tickets`}
            sx={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 600,
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255, 107, 0, 0.15)' : 'rgba(255, 107, 0, 0.08)'),
              color: 'primary.main',
              border: '1px solid',
              borderColor: 'primary.main',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' },
            gap: 4,
          }}
        >
          {/* Left Column: Ticket List Selector */}
          <Box>
            <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: 'text.disabled', mb: 1.5, textTransform: 'uppercase' }}>
              Select Work Order Ticket:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {activeTickets.map((ticket) => (
                <ServiceTicketCard
                  key={ticket.id}
                  jobId={ticket.id}
                  service={ticket.serviceName}
                  status={ticket.status}
                  eta={ticket.eta}
                  price={ticket.price}
                  onClick={() => dispatch(setSelectedTicket(ticket.id))}
                  technician={
                    <VerifiedBadge
                      name={ticket.technicianName}
                      role={ticket.technicianRole}
                      verified={ticket.verified}
                    />
                  }
                />
              ))}
            </Box>
          </Box>

          {/* Right Column: Detailed Ticket Work Order Breakdown */}
          {selectedTicket && (
            <Box>
              <Box
                sx={{
                  p: 4,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
                  border: '1px solid',
                  borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
                  borderRadius: '12px',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                      : '0 8px 32px rgba(255, 107, 0, 0.08)',
                }}
              >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: 'text.disabled' }}>
                      WORK ORDER ID: {selectedTicket.id}
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: 22, fontWeight: 700, mt: 0.5 }}>
                      {selectedTicket.serviceName}
                    </Typography>
                  </Box>

                  <Chip
                    label={selectedTicket.status.toUpperCase()}
                    sx={{
                      fontFamily: 'IBM Plex Mono, monospace',
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor:
                        selectedTicket.status === 'action_needed'
                          ? '#C97B3D'
                          : selectedTicket.status === 'completed'
                          ? '#B84A00'
                          : '#FF6B00',
                      color: '#FFFFFF',
                    }}
                  />
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Status Timeline */}
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                    WORK ORDER DISPATCH TIMELINE
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                    <Box sx={{ p: 1.5, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#291A10' : '#FFF4ED'), borderRadius: '6px', textAlign: 'center' }}>
                      <CheckCircleOutlinedIcon sx={{ color: '#FF6B00', fontSize: 20 }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 600, mt: 0.5 }}>Created</Typography>
                    </Box>

                    <Box sx={{ p: 1.5, bgcolor: selectedTicket.status !== 'pending' ? (theme => theme.palette.mode === 'dark' ? '#291A10' : '#FFF4ED') : 'transparent', borderRadius: '6px', textAlign: 'center' }}>
                      <HourglassTopIcon sx={{ color: selectedTicket.status !== 'pending' ? '#FF6B00' : 'text.disabled', fontSize: 20 }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 600, mt: 0.5 }}>Dispatched</Typography>
                    </Box>

                    <Box sx={{ p: 1.5, bgcolor: selectedTicket.status === 'completed' ? (theme => theme.palette.mode === 'dark' ? '#291A10' : '#FFF4ED') : 'transparent', borderRadius: '6px', textAlign: 'center' }}>
                      <CheckCircleOutlinedIcon sx={{ color: selectedTicket.status === 'completed' ? '#FF6B00' : 'text.disabled', fontSize: 20 }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 600, mt: 0.5 }}>Completed</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Urgent Action Banner if action_needed */}
                {selectedTicket.status === 'action_needed' && (
                  <Box
                    sx={{
                      p: 2,
                      mb: 3,
                      bgcolor: 'rgba(201, 123, 61, 0.12)',
                      border: '1px solid #C97B3D',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <WarningAmberIcon sx={{ color: '#C97B3D' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#C97B3D' }}>
                        Customer Action Required
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                        {selectedTicket.notes || 'Please verify item substitution with your technician.'}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Technician Info */}
                <Box sx={{ mb: 4, p: 2.5, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#291A10' : '#FFF4ED'), borderRadius: '8px' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.disabled', textTransform: 'uppercase', mb: 1 }}>
                    Assigned Field Lead
                  </Typography>
                  <VerifiedBadge
                    name={selectedTicket.technicianName}
                    role={selectedTicket.technicianRole}
                    verified={selectedTicket.verified}
                  />
                </Box>

                {/* Location & Details */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 4 }}>
                  <Box>
                    <Typography sx={{ fontSize: 12, color: 'text.disabled', mb: 0.5 }}>
                      LOCATION
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon fontSize="small" sx={{ color: '#FF6B00' }} />
                      {selectedTicket.location}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ fontSize: 12, color: 'text.disabled', mb: 0.5 }}>
                      ESTIMATED COST
                    </Typography>
                    <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 15, fontWeight: 700, color: '#FF6B00' }}>
                      {selectedTicket.price}
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* TODO: Replace REPLACE_WITH_NUMBER with official technician / helpdesk phone number */}
                  <Button
                    component="a"
                    href="tel:REPLACE_WITH_NUMBER"
                    variant="contained"
                    startIcon={<PhoneInTalkIcon />}
                    sx={{
                      bgcolor: '#FF6B00',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      flex: 1,
                      textDecoration: 'none',
                      '&:hover': { bgcolor: '#E05D00' },
                    }}
                  >
                    Call Technician
                  </Button>

                  {selectedTicket.status !== 'completed' && (
                    <Button
                      variant="outlined"
                      onClick={() =>
                        dispatch(
                          updateTicketStatus({
                            id: selectedTicket.id,
                            status: 'completed',
                            notes: 'Marked completed by customer.',
                          })
                        )
                      }
                      sx={{ borderColor: '#FF6B00', color: '#FF6B00', fontWeight: 600 }}
                    >
                      Confirm Received
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
