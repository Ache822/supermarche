import {
  Box,
  Typography,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import { useAppDispatch } from '../../../store/hooks';
import { updateRunnerKyc } from '../store/adminSlice';
import type { FieldRunner } from '../types/admin.types';
import ReusableDataTable from '../../../components/ui/ReusableDataTable';
import type { ColumnDef } from '../../../components/ui/ReusableDataTable';
import { VerifiedBadge } from '../../../components/ui/VerifiedBadge';

interface RunnerFleetTableProps {
  runners: FieldRunner[];
}

export function RunnerFleetTable({ runners }: RunnerFleetTableProps) {
  const dispatch = useAppDispatch();

  const columns: ColumnDef<FieldRunner>[] = [
    {
      id: 'name',
      label: 'TECHNICIAN',
      minWidth: 200,
      render: (runner) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={runner.avatarUrl} sx={{ border: '2px solid #FF6B00' }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{runner.name}</Typography>
              {runner.kycStatus === 'verified' && (
                <VerifiedBadge size={16} title="Verified Dispatcher / Field Service Provider" />
              )}
            </Box>
            <Typography sx={{ fontSize: 11, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 11 }} /> {runner.phone}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'city',
      label: 'CITY & DISTRICT',
      minWidth: 160,
      render: (runner) => (
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{runner.city}</Typography>
          <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{runner.district}</Typography>
        </Box>
      ),
    },
    {
      id: 'vehicle',
      label: 'VEHICLE',
      minWidth: 120,
      render: (runner) => (
        <Chip
          icon={<TwoWheelerIcon sx={{ fontSize: '14px !important' }} />}
          label={runner.vehicle}
          size="small"
          variant="outlined"
          sx={{ fontSize: 11, fontWeight: 600 }}
        />
      ),
    },
    {
      id: 'kycStatus',
      label: 'KYC STATUS',
      minWidth: 130,
      render: (runner) => (
        runner.kycStatus === 'verified' ? (
          <Chip
            icon={<VerifiedIcon sx={{ fontSize: '14px !important', color: '#FF6B00 !important' }} />}
            label="VERIFIED"
            size="small"
            sx={{ bgcolor: 'rgba(255, 107, 0,0.15)', color: '#FF6B00', fontWeight: 700, fontSize: 10 }}
          />
        ) : (
          <Chip label="PENDING AUDIT" size="small" color="warning" sx={{ fontWeight: 700, fontSize: 10 }} />
        )
      ),
    },
    {
      id: 'rating',
      label: 'RATING & JOBS',
      minWidth: 130,
      render: (runner) => (
        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
          ⭐ {runner.rating} ({runner.completedJobs} jobs)
        </Typography>
      ),
    },
    {
      id: 'cashOnHandXAF',
      label: 'CASH FLOAT (XAF)',
      minWidth: 130,
      render: (runner) => (
        <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, fontWeight: 700 }}>
          XAF {runner.cashOnHandXAF.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'KYC ACTIONS',
      minWidth: 150,
      align: 'right',
      render: (runner) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          {runner.kycStatus === 'verified' ? (
            <Button
              size="small"
              color="warning"
              variant="outlined"
              onClick={() => dispatch(updateRunnerKyc({ runnerId: runner.id, status: 'pending' }))}
              sx={{ textTransform: 'none', fontSize: 11, borderRadius: '8px' }}
            >
              Suspend
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              onClick={() => dispatch(updateRunnerKyc({ runnerId: runner.id, status: 'verified' }))}
              sx={{ bgcolor: '#FF6B00', textTransform: 'none', fontSize: 11, fontWeight: 700, borderRadius: '8px' }}
            >
              Approve KYC
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <ReusableDataTable
      title="Field Technician & Runner Fleet Network"
      subtitle="Manage certified local safety runners, vehicle types, ratings, and KYC authorization with infinite scroll"
      columns={columns}
      data={runners}
      keyExtractor={(runner) => runner.id}
      searchPlaceholder="Search runner name, phone, or city..."
      enableInfiniteScroll={true}
    />
  );
}

export default RunnerFleetTable;
