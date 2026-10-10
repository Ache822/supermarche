import { useState, useCallback } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PublicIcon from '@mui/icons-material/Public';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { InfiniteAutocompleteInput } from './InfiniteAutocompleteInput';
import type { LocationItem } from '../../types';

export interface LocationFormSelectorProps {
  label?: string;
  placeholder?: string;
  typeFilter?: 'country' | 'state' | 'city' | 'address';
  value?: LocationItem | null;
  onChange?: (location: LocationItem | null) => void;
  helperText?: string;
  error?: boolean;
}

export function LocationFormSelector({
  label = 'Select Service Location or City',
  placeholder = 'Type city, region, or address (e.g., Bastos, Douala, Buea)...',
  value: controlledValue,
  onChange,
  helperText = 'Search on-demand with debounced infinite scroll',
  error = false,
}: LocationFormSelectorProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(controlledValue ?? null);

  const fetchLocations = useCallback(
    async (query: string) => {
      const locationsList: LocationItem[] = [
        { id: 'loc-yde-bastos', name: 'Yaoundé', region: 'Bastos & Omnisports', country: 'Cameroon', type: 'city' },
        { id: 'loc-dla-bonapriso', name: 'Douala', region: 'Bonapriso & Akwa', country: 'Cameroon', type: 'city' },
        { id: 'loc-buea-molyko', name: 'Buea', region: 'Molyko & Soppo', country: 'Cameroon', type: 'city' },
        { id: 'loc-bda-nkwen', name: 'Bamenda', region: 'Nkwen & Commercial Ave', country: 'Cameroon', type: 'city' },
        { id: 'loc-kribi-beach', name: 'Kribi', region: 'Beachfront Hub', country: 'Cameroon', type: 'city' },
        { id: 'loc-baf-centre', name: 'Bafoussam', region: 'City Centre Hub', country: 'Cameroon', type: 'city' },
      ];

      const filtered = query.trim()
        ? locationsList.filter((loc) => `${loc.name} ${loc.region}`.toLowerCase().includes(query.toLowerCase()))
        : locationsList;

      return {
        data: filtered,
        total: filtered.length,
        currentPage: 1,
        hasMore: false,
      };
    },
    []
  );

  const handleSelect = (location: LocationItem | null) => {
    setSelectedLocation(location);
    if (onChange) {
      onChange(location);
    }
  };

  const getLocationIcon = (type?: string) => {
    switch (type) {
      case 'country':
        return <PublicIcon fontSize="small" sx={{ color: '#FF6B00' }} />;
      case 'state':
        return <LocationCityIcon fontSize="small" sx={{ color: '#2563EB' }} />;
      case 'address':
        return <HomeWorkIcon fontSize="small" sx={{ color: '#F59E0B' }} />;
      default:
        return <LocationOnIcon fontSize="small" sx={{ color: '#FF6B00' }} />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <InfiniteAutocompleteInput<LocationItem>
        label={label}
        placeholder={placeholder}
        fetchOptions={fetchLocations}
        getOptionLabel={(loc) => `${loc.name}, ${loc.region} (${loc.country})`}
        getOptionKey={(loc) => loc.id}
        value={selectedLocation}
        onSelect={handleSelect}
        startIcon={<LocationOnIcon fontSize="small" sx={{ color: '#FF6B00' }} />}
        error={error}
        helperText={helperText}
        renderOption={(loc) => (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', py: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              {getLocationIcon(loc.type)}
              <Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>
                  {loc.name}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>
                  {loc.region} • {loc.country}
                </Typography>
              </Box>
            </Box>
            {loc.type && (
              <Chip
                label={loc.type.toUpperCase()}
                size="small"
                variant="outlined"
                sx={{ fontSize: 9, fontWeight: 700, height: 18 }}
              />
            )}
          </Box>
        )}
      />
    </Box>
  );
}
