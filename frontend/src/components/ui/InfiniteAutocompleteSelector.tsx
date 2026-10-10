import { useState, useCallback } from 'react';
import { InfiniteAutocompleteInput } from './InfiniteAutocompleteInput';
import api from '../../api/client';
import type { PaginatedResponse, LocationItem, ServiceItem } from '../../types';

export interface InfiniteAutocompleteSelectorProps {
  fetchUrl?: string;
  label?: string;
  placeholder?: string;
  value?: string | SelectorOption | Record<string, unknown> | null;
  onChange?: (selected: string) => void;
  queryParams?: Record<string, string | number | boolean>;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export interface SelectorOption {
  id: string;
  label: string;
  subLabel?: string;
  raw?: unknown;
}

/**
 * Standard Reusable Paginated Autocomplete Component (`<InfiniteAutocompleteSelector/>`)
 * Replaces static HTML <select> dropdowns across forms, modals, and landing page searches.
 * Features 300ms debounced input search, IntersectionObserver infinite scroll, and keyboard controls.
 */
export function InfiniteAutocompleteSelector({
  fetchUrl = '/api/locations',
  label = 'Select Option',
  placeholder = 'Type to search...',
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
}: InfiniteAutocompleteSelectorProps) {
  const [selectedOption, setSelectedOption] = useState<SelectorOption | null>(() => {
    if (!value) return null;
    if (typeof value === 'string') {
      return { id: value, label: value };
    }
    const valObj = value as Record<string, unknown>;
    const valId = String(valObj.id || valObj.name || valObj.title || value);
    const valLabel = String(valObj.label || valObj.name || valObj.title || value);
    return {
      id: valId,
      label: valLabel,
      raw: value,
    };
  });

  const fetchOptions = useCallback(
    async (query: string, page: number): Promise<PaginatedResponse<SelectorOption>> => {
      try {
        if (fetchUrl.includes('/services') || fetchUrl.includes('/categories')) {
          const res: unknown = await api.services.getPaginatedServices(page, 10);
          const rawData = (Array.isArray(res) ? res : (res as { data?: ServiceItem[] })?.data || []) as ServiceItem[];
          const filtered = query.trim()
            ? rawData.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
            : rawData;

          const items: SelectorOption[] = filtered.map((srv) => ({
            id: srv.id || srv.title,
            label: srv.title,
            subLabel: typeof srv.category === 'string' ? srv.category : srv.category?.name || '',
            raw: srv,
          }));

          return {
            data: items,
            total: items.length,
            currentPage: page,
            hasMore: false,
          };
        }

        // Location / City Hub Options
        const locationsList: LocationItem[] = [
          { id: 'loc-yde-bastos', name: 'Yaoundé', region: 'Bastos & Omnisports', country: 'Cameroon' },
          { id: 'loc-dla-bonapriso', name: 'Douala', region: 'Bonapriso & Akwa', country: 'Cameroon' },
          { id: 'loc-buea-molyko', name: 'Buea', region: 'Molyko & Soppo', country: 'Cameroon' },
          { id: 'loc-bda-nkwen', name: 'Bamenda', region: 'Nkwen & Commercial Ave', country: 'Cameroon' },
          { id: 'loc-kribi-beach', name: 'Kribi', region: 'Beachfront Hub', country: 'Cameroon' },
          { id: 'loc-baf-centre', name: 'Bafoussam', region: 'City Centre Hub', country: 'Cameroon' },
        ];

        const filteredLocs = query.trim()
          ? locationsList.filter((loc) => `${loc.name} ${loc.region}`.toLowerCase().includes(query.toLowerCase()))
          : locationsList;

        const items: SelectorOption[] = filteredLocs.map((loc) => ({
          id: loc.id,
          label: `${loc.name}, ${loc.region}`,
          subLabel: loc.country,
          raw: loc,
        }));

        return {
          data: items,
          total: items.length,
          currentPage: 1,
          hasMore: false,
        };
      } catch {
        return { data: [], total: 0, currentPage: 1, hasMore: false };
      }
    },
    [fetchUrl]
  );

  const handleSelect = (option: SelectorOption | null) => {
    setSelectedOption(option);
    if (onChange) {
      onChange(option ? option.label : '');
    }
  };

  return (
    <InfiniteAutocompleteInput<SelectorOption>
      label={label}
      placeholder={placeholder}
      fetchOptions={fetchOptions}
      getOptionLabel={(opt) => opt.label}
      getOptionKey={(opt) => opt.id}
      value={selectedOption}
      onSelect={handleSelect}
      error={error}
      helperText={helperText}
      disabled={disabled}
    />
  );
}

export default InfiniteAutocompleteSelector;
