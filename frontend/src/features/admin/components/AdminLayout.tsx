import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { PageAnimatedWrapper } from '../../../components/ui/PageAnimatedWrapper';

export function AdminLayout() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#F8FAFC'),
      }}
    >
      <Box sx={{ width: '100%', height: '100%' }}>
        <PageAnimatedWrapper>
          <Outlet />
        </PageAnimatedWrapper>
      </Box>
    </Box>
  );
}

export default AdminLayout;
