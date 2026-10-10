import { useState, useEffect, useRef, useId } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import type { PaginatedResponse } from '../../types';

export interface InfiniteAutocompleteInputProps<T> {
  fetchOptions: (query: string, page: number) => Promise<PaginatedResponse<T>>;
  getOptionLabel: (option: T) => string;
  getOptionKey: (option: T) => string;
  renderOption?: (option: T, isSelected: boolean) => React.ReactNode;
  onSelect: (option: T | null) => void;
  value?: T | null;
  inputValue?: string;
  onInputChange?: (val: string) => void;
  placeholder?: string;
  label?: string;
  debounceMs?: number;
  limit?: number;
  startIcon?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  noOptionsText?: string;
}

export function InfiniteAutocompleteInput<T>({
  fetchOptions,
  getOptionLabel,
  getOptionKey,
  renderOption,
  onSelect,
  value = null,
  inputValue: controlledInputValue,
  onInputChange,
  placeholder = 'Type to search...',
  label,
  debounceMs = 300,
  startIcon = <SearchIcon fontSize="small" sx={{ color: 'text.disabled' }} />,
  disabled = false,
  error = false,
  helperText,
  fullWidth = true,
  size = 'small',
  noOptionsText = 'No matching options found',
}: InfiniteAutocompleteInputProps<T>) {
  const componentId = useId();
  const listboxId = `${componentId}-listbox`;

  const [query, setQuery] = useState(controlledInputValue ?? (value ? getOptionLabel(value) : ''));
  const [prevControlledInputValue, setPrevControlledInputValue] = useState(controlledInputValue);
  const [prevValue, setPrevValue] = useState(value);

  const [options, setOptions] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync controlled inputValue and selected value changes during render phase
  if (controlledInputValue !== undefined && controlledInputValue !== prevControlledInputValue) {
    setPrevControlledInputValue(controlledInputValue);
    setQuery(controlledInputValue);
  }

  if (value !== prevValue) {
    setPrevValue(value);
    if (value && controlledInputValue === undefined) {
      setQuery(getOptionLabel(value));
    }
  }

  // Initial / Query change fetching logic with 300ms debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setLoading(true);
      setPage(1);
      try {
        const res = await fetchOptions(query, 1);
        setOptions(res.data);
        setHasMore(res.hasMore);
      } catch (err) {
        console.error('Error fetching options:', err);
        setOptions([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, fetchOptions, debounceMs]);

  // Infinite scroll listener using IntersectionObserver on sentinelRef
  useEffect(() => {
    if (!isOpen || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading && !loadingMore) {
          setLoadingMore(true);
          const nextPage = page + 1;
          try {
            const res = await fetchOptions(query, nextPage);
            setOptions((prev) => [...prev, ...res.data]);
            setPage(nextPage);
            setHasMore(res.hasMore);
          } catch (err) {
            console.error('Error fetching next page options:', err);
          } finally {
            setLoadingMore(false);
          }
        }
      },
      {
        root: listContainerRef.current,
        threshold: 0.1,
      }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [isOpen, hasMore, loading, loadingMore, page, query, fetchOptions]);

  // Outside click & Escape key listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDownGlobal = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDownGlobal);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDownGlobal);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onInputChange) {
      onInputChange(val);
    }
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    if (onInputChange) {
      onInputChange('');
    }
    onSelect(null);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleSelectOption = (option: T) => {
    setQuery(getOptionLabel(option));
    if (onInputChange) {
      onInputChange(getOptionLabel(option));
    }
    onSelect(option);
    setIsOpen(false);
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    } else if (e.key === 'Enter' && focusedIndex >= 0 && options[focusedIndex]) {
      e.preventDefault();
      handleSelectOption(options[focusedIndex]);
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      <TextField
        id={componentId}
        label={label}
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDownInput}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        helperText={helperText}
        size={size}
        fullWidth={fullWidth}
        sx={{
          '& .MuiInputBase-input::placeholder': {
            fontSize: '0.8125rem !important',
            fontWeight: '400 !important',
            opacity: '0.7 !important',
          },
        }}
        slotProps={{
          htmlInput: {
            role: 'combobox',
            'aria-expanded': isOpen,
            'aria-autocomplete': 'list',
            'aria-controls': listboxId,
            'aria-activedescendant':
              focusedIndex >= 0 && options[focusedIndex]
                ? `${componentId}-option-${getOptionKey(options[focusedIndex])}`
                : undefined,
          },
          input: {
            startAdornment: startIcon ? (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ) : undefined,
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={18} color="success" />
                ) : (
                  <>
                    {query && (
                      <IconButton size="small" onClick={handleClear} aria-label="Clear search query">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => setIsOpen((prev) => !prev)}
                      aria-label="Toggle dropdown list"
                    >
                      <ArrowDropDownIcon />
                    </IconButton>
                  </>
                )}
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Autocomplete Dropdown Menu */}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 1400,
            maxHeight: 280,
            overflowY: 'auto',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: (theme) => (theme.palette.mode === 'dark' ? '#3A2316' : '#E2E8F0'),
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1F140C' : '#FFFFFF'),
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.18)',
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(255, 107, 0, 0.4)', borderRadius: 3 },
          }}
          ref={listContainerRef}
        >
          <List id={listboxId} role="listbox" disablePadding sx={{ py: 0.5 }}>
            {options.length === 0 && !loading ? (
              <Typography
                sx={{
                  p: 2,
                  textAlign: 'center',
                  fontSize: 13,
                  color: 'text.secondary',
                  fontStyle: 'italic',
                }}
              >
                {noOptionsText}
              </Typography>
            ) : (
              options.map((option, index) => {
                const key = getOptionKey(option);
                const labelText = getOptionLabel(option);
                const isSelected = value ? getOptionKey(value) === key : false;
                const isFocused = focusedIndex === index;

                return (
                  <ListItem
                    key={key}
                    disablePadding
                    id={`${componentId}-option-${key}`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <ListItemButton
                      onClick={() => handleSelectOption(option)}
                      selected={isSelected || isFocused}
                      sx={{
                        py: 1.2,
                        px: 2,
                        '&.Mui-selected': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 107, 0, 0.25)'
                              : 'rgba(255, 107, 0, 0.12)',
                          color: '#FF6B00',
                          fontWeight: 700,
                        },
                        '&:hover': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'rgba(255, 107, 0, 0.15)'
                              : 'rgba(255, 107, 0, 0.08)',
                        },
                      }}
                    >
                      {renderOption ? (
                        renderOption(option, isSelected)
                      ) : (
                        <Typography sx={{ fontSize: 13.5, fontWeight: isSelected ? 700 : 500 }}>
                          {labelText}
                        </Typography>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })
            )}

            {/* Infinite Scroll Sentinel element & Loader */}
            <Box
              ref={sentinelRef}
              sx={{
                py: loadingMore ? 1.5 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {loadingMore && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="success" />
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    Loading more options...
                  </Typography>
                </Box>
              )}
              {!hasMore && options.length > 0 && (
                <Typography sx={{ fontSize: 11, color: 'text.disabled', py: 0.8 }}>
                  End of options list
                </Typography>
              )}
            </Box>
          </List>
        </Paper>
      )}
    </Box>
  );
}
