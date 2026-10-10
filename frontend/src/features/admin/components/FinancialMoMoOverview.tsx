import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import type { MoMoTransaction } from '../types/admin.types';
import ReusableDataTable from '../../../components/ui/ReusableDataTable';
import type { ColumnDef } from '../../../components/ui/ReusableDataTable';
import { formatShortId } from '../../../utils/idHelper';

interface FinancialMoMoOverviewProps {
  transactions: MoMoTransaction[];
  momoPayoutBalanceXAF: number;
}

export function FinancialMoMoOverview({ transactions, momoPayoutBalanceXAF }: FinancialMoMoOverviewProps) {
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amountXAF, 0);
  const totalCommissions = transactions.reduce((acc, curr) => acc + curr.commissionXAF, 0);
  const totalRunnerPayouts = transactions.reduce((acc, curr) => acc + curr.runnerPayoutXAF, 0);

  const handleExecutePayout = () => {
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 4000);
  };

  const columns: ColumnDef<MoMoTransaction>[] = [
    {
      id: 'id',
      label: 'TXN ID',
      minWidth: 100,
      render: (txn) => (
        <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, fontSize: 11, color: 'text.secondary' }}>
          {formatShortId(txn.id, 'TXN')}
        </Typography>
      ),
    },
    {
      id: 'ticketId',
      label: 'TICKET ID',
      minWidth: 110,
      render: (txn) => (
        <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#FF6B00', fontWeight: 700 }}>
          {formatShortId(txn.ticketId, 'TKT')}
        </Typography>
      ),
    },
    {
      id: 'provider',
      label: 'PAYMENT CHANNEL',
      minWidth: 140,
      render: (txn) => (
        <Chip
          label={txn.provider}
          size="small"
          color={txn.provider === 'MTN MoMo' ? 'warning' : 'primary'}
          sx={{ fontWeight: 700, fontSize: 10 }}
        />
      ),
    },
    {
      id: 'senderNumber',
      label: 'SENDER PHONE',
      minWidth: 140,
      render: (txn) => (
        <Typography sx={{ fontSize: 12, fontFamily: 'IBM Plex Mono, monospace' }}>
          {txn.senderNumber}
        </Typography>
      ),
    },
    {
      id: 'amountXAF',
      label: 'TOTAL GROSS',
      minWidth: 120,
      render: (txn) => (
        <Typography sx={{ fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
          XAF {txn.amountXAF.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: 'commissionXAF',
      label: 'BAMBE MARGIN (15%)',
      minWidth: 140,
      render: (txn) => (
        <Typography sx={{ color: '#2563EB', fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
          XAF {txn.commissionXAF.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: 'runnerPayoutXAF',
      label: 'RUNNER PAYOUT (85%)',
      minWidth: 140,
      render: (txn) => (
        <Typography sx={{ color: '#10B981', fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12 }}>
          XAF {txn.runnerPayoutXAF.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'SETTLEMENT',
      minWidth: 110,
      align: 'right',
      render: (txn) => {
        const txnStatus = (txn.status || 'successful').toString();
        return (
          <Chip
            label={txnStatus.toUpperCase()}
            size="small"
            color={txn.status === 'successful' ? 'success' : 'default'}
            sx={{ fontSize: 10, fontWeight: 700 }}
          />
        );
      },
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Financial Summary Cards */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
              GROSS SETTLED REVENUE
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#FF6B00', my: 0.5 }}>
              XAF {totalRevenue.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'IBM Plex Mono, monospace' }}>
              MTN MoMo + Orange Money Receipts
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
              SUPERMARCHE COMMISSION (15%)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#2563EB', my: 0.5 }}>
              XAF {totalCommissions.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'IBM Plex Mono, monospace' }}>
              Net Platform Dispatch Margin
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
              border: '1px solid',
              borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            }}
          >
            <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
              RUNNER EARNINGS SPLIT (85%)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#10B981', my: 0.5 }}>
              XAF {totalRunnerPayouts.toLocaleString()}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled', fontFamily: 'IBM Plex Mono, monospace' }}>
              Reserve: XAF {momoPayoutBalanceXAF.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Transaction Ledger Table with Infinite Scroll */}
      <ReusableDataTable
        title="MTN Mobile Money & Orange Money Ledger"
        subtitle="Real-time payment settlements & field runner commissions with native infinite scroll"
        columns={columns}
        data={transactions}
        keyExtractor={(txn) => txn.id}
        searchPlaceholder="Search transaction ID, ticket, or phone number..."
        enableInfiniteScroll={true}
        headerActions={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {payoutSuccess && (
              <Chip label="✓ Runner Payouts Settled via MoMo API!" color="success" sx={{ fontWeight: 700 }} />
            )}
            <Button
              variant="contained"
              onClick={handleExecutePayout}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{ bgcolor: '#FF6B00', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#E05D00' } }}
            >
              Batch Execute MoMo Payouts
            </Button>
          </Box>
        }
      />
    </Box>
  );
}

export default FinancialMoMoOverview;
