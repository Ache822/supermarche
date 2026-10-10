import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  TablePagination,
  Typography,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface ColumnDef<T> {
  id: string;
  label: string;
  minWidth?: number;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T) => React.ReactNode;
}

interface ReusableDataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  onRowClick?: (row: T) => void;
  headerActions?: React.ReactNode;
  enableInfiniteScroll?: boolean;
  emptyMessage?: string;
  maxHeight?: number | string;
  isLoading?: boolean;
  loading?: boolean;
}

export function ReusableDataTable<T>({
  columns,
  data,
  keyExtractor,
  title,
  subtitle,
  searchPlaceholder = 'Search records...',
  searchQuery,
  onSearchChange,
  onRowClick,
  headerActions,
  enableInfiniteScroll = true,
  emptyMessage,
  maxHeight = 550,
  isLoading = false,
  loading = false,
}: ReusableDataTableProps<T>) {
  const { t } = useTranslation();
  const [internalQuery, setInternalQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeSearch = searchQuery !== undefined ? searchQuery : internalQuery;
  const handleSearch = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else setInternalQuery(val);
    setPage(0);
    setVisibleCount(10);
  };

  const filteredData = data.filter((row) => {
    if (!activeSearch.trim()) return true;
    const str = JSON.stringify(row).toLowerCase();
    return str.includes(activeSearch.toLowerCase());
  });

  // Infinite Scroll Handler inside table container
  useEffect(() => {
    if (!enableInfiniteScroll) return;
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 30 && !isLoadingMore) {
        if (visibleCount < filteredData.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 10, filteredData.length));
            setIsLoadingMore(false);
          }, 300);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [enableInfiniteScroll, visibleCount, filteredData.length, isLoadingMore]);

  const displayedRows = enableInfiniteScroll
    ? filteredData.slice(0, visibleCount)
    : filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
        border: '1px solid',
        borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
        overflow: 'hidden',
        width: '100%',
        maxHeight: maxHeight || 'calc(100vh - 220px)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {/* Header bar */}
      {(title || headerActions || searchPlaceholder) && (
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            flexShrink: 0,
            borderBottom: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          }}
        >
          <Box>
            {title && (
              <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', fontSize: 16 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={activeSearch}
              onChange={(e) => handleSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ minWidth: 240 }}
            />
            {headerActions}
          </Box>
        </Box>
      )}

      {/* Table Content (Vertical-Only Scroll Wrapper) */}
      <TableContainer
        ref={scrollRef}
        sx={{
          flex: '1 1 auto',
          minHeight: 0,
          maxHeight: '100%',
          overflowY: 'auto',
          overflowX: 'auto',
          width: '100%',
          '&::-webkit-scrollbar': { width: 6, height: 6 },
          '&::-webkit-scrollbar-track': {
            backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#F0FDF4'),
            borderRadius: 9999,
            border: (theme) => (theme.palette.mode === 'dark' ? '1px solid #3A2316' : '1px solid #DCFCE7'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(180deg, #FF6B00 0%, #257030 100%)',
            borderRadius: 9999,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            '&:hover': {
              background: '#FF6B00',
              boxShadow: '0 0 10px rgba(255, 107, 0, 0.6)',
            },
          },
        }}
      >
        <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', minWidth: { xs: 650, sm: '100%' }, width: '100%' }}>
          <TableHead sx={{ zIndex: 10 }}>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  style={{ width: col.width || (col.minWidth ? `${col.minWidth}px` : undefined) }}
                  sx={{
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED'),
                    fontWeight: 700,
                    fontSize: 12,
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: 'text.secondary',
                    py: 1.5,
                    px: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(isLoading || loading) ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                    <CircularProgress size={24} sx={{ color: '#FF6B00' }} />
                    <Typography sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 600 }}>
                      {t('admin.loadingData', 'Loading data...')}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : displayedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                    {emptyMessage || t('admin.noDataAvailable', 'No data available')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedRows.map((row, idx) => {
                const rawKey = keyExtractor ? keyExtractor(row) : null;
                const rowKey = rawKey ? String(rawKey) : `dt_row_${idx}`;
                return (
                  <TableRow
                    hover
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align || 'left'}
                      style={{ width: col.width || (col.minWidth ? `${col.minWidth}px` : undefined) }}
                      sx={{
                        fontSize: 13,
                        py: 1.5,
                        px: 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {col.render ? col.render(row) : ((row as Record<string, unknown>)[col.id] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Infinite Scroll loading indicator / Pagination */}
      {enableInfiniteScroll ? (
        <Box
          sx={{
            p: 1.5,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#140C07' : '#FFF4ED'),
            borderTop: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
          }}
        >
          <Typography sx={{ fontSize: 11, color: 'text.secondary', fontFamily: 'IBM Plex Mono, monospace' }}>
            {t('admin.showingEntriesCount', 'Showing {{current}} of {{total}} entries (Infinite Scroll)', {
              current: Math.min(visibleCount, filteredData.length),
              total: filteredData.length,
            })}
          </Typography>

          {isLoadingMore ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={14} sx={{ color: '#FF6B00' }} />
              <Typography sx={{ fontSize: 11, color: '#FF6B00', fontWeight: 600 }}>
                {t('admin.loadingMore', 'Loading more...')}
              </Typography>
            </Box>
          ) : visibleCount < filteredData.length ? (
            <Button
              size="small"
              onClick={() => setVisibleCount((prev) => Math.min(prev + 10, filteredData.length))}
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: '#FF6B00',
                textTransform: 'none',
                py: 0.2,
                px: 1.5,
                borderRadius: '6px',
                border: '1px solid rgba(255, 107, 0, 0.3)',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.1)' },
              }}
            >
              {t('admin.loadMoreBtn', 'Load More (+{{count}})', { count: Math.min(10, filteredData.length - visibleCount) })}
            </Button>
          ) : (
            <Chip label={t('admin.allItemsLoaded', 'All items loaded')} size="small" variant="outlined" sx={{ fontSize: 10 }} />
          )}
        </Box>
      ) : (
        <Box sx={{ flexShrink: 0 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Box>
      )}
    </Paper>
  );
}

export default ReusableDataTable;
