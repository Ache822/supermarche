import { Box, Typography } from '@mui/material';

interface CameroonRegionsVisualProps {
  regionId: string; // 'yaounde' | 'douala' | 'bamenda' | 'buea'
}

/**
 * Dedicated Realistic Vector Artwork Component for Cameroon Coverage Regions
 * Custom-tailored for Yaoundé, Douala, Bamenda, and Buea cityscapes & market hubs.
 */
export function CameroonRegionsVisual({ regionId }: CameroonRegionsVisualProps) {
  switch (regionId) {
    case 'yaounde':
      return (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: '#14281E',
            overflow: 'hidden',
          }}
        >
          {/* Yaoundé City Visual Artwork */}
          <svg width="100%" height="100%" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" fill="none">
            <defs>
              <linearGradient id="yaoundeSky" x1="0" y1="0" x2="0" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0B1A12" />
                <stop offset="60%" stopColor="#1B3B2B" />
                <stop offset="100%" stopColor="#FF6B00" />
              </linearGradient>
              <linearGradient id="hillGrad" x1="0" y1="180" x2="0" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1E442F" />
                <stop offset="100%" stopColor="#0E2217" />
              </linearGradient>
            </defs>

            {/* Sky Background */}
            <rect width="600" height="360" fill="url(#yaoundeSky)" />

            {/* Sun Rays */}
            <circle cx="480" cy="90" r="70" fill="#FFD700" opacity="0.15" />
            <circle cx="480" cy="90" r="40" fill="#FFD700" opacity="0.3" />

            {/* Yaoundé 7 Hills Silhouettes */}
            <path d="M0 240 Q120 160 240 230 T480 200 T600 250 V360 H0 Z" fill="url(#hillGrad)" opacity="0.8" />
            <path d="M-50 260 Q150 180 320 250 T600 220 V360 H-50 Z" fill="#132B1F" />

            {/* Bastos District Modern Villas & Embassy Buildings */}
            <rect x="80" y="210" width="45" height="40" rx="4" fill="#234633" />
            <rect x="90" y="190" width="25" height="20" rx="2" fill="#2E5A42" />
            <rect x="150" y="195" width="55" height="55" rx="5" fill="#1E3E2D" />
            <rect x="350" y="180" width="60" height="70" rx="6" fill="#254D38" />

            {/* Windows Glowing */}
            <rect x="90" y="218" width="8" height="10" rx="1" fill="#FFC4A8" opacity="0.7" />
            <rect x="105" y="218" width="8" height="10" rx="1" fill="#FFD700" opacity="0.7" />
            <rect x="162" y="205" width="10" height="12" rx="1" fill="#FFC4A8" opacity="0.8" />
            <rect x="180" y="205" width="10" height="12" rx="1" fill="#FFD700" opacity="0.8" />

            {/* Yaoundé Boulevard Road */}
            <path d="M0 310 Q200 290 400 315 T600 300 V360 H0 Z" fill="#0A1610" />
            <line x1="0" y1="330" x2="600" y2="330" stroke="#FFD700" strokeWidth="2" strokeDasharray="15 10" />

            {/* Cameroonian Yellow City Taxi */}
            <g transform="translate(140, 295)">
              <rect x="0" y="8" width="65" height="22" rx="6" fill="#FFCC00" />
              <path d="M12 8 L22 0 H42 L52 8 Z" fill="#E6B800" />
              <rect x="24" y="-8" width="16" height="6" rx="2" fill="#111111" />
              <text x="32" y="-3" fill="#FFCC00" fontSize="5" fontWeight="bold" textAnchor="middle">TAXI</text>
              <circle cx="14" cy="30" r="7" fill="#222" />
              <circle cx="14" cy="30" r="3" fill="#DDD" />
              <circle cx="50" cy="30" r="7" fill="#222" />
              <circle cx="50" cy="30" r="3" fill="#DDD" />
            </g>

            {/* Black Cameroonian Supermarche Courier Personnel */}
            <g transform="translate(380, 240)">
              {/* Body in Green Uniform */}
              <path d="M30 35 L15 85 H45 L30 35 Z" fill="#FF6B00" />
              <circle cx="30" cy="20" r="14" fill="#4B2E1E" />
              {/* Cap */}
              <path d="M14 16 C14 8 46 8 46 16 Z" fill="#1B3B2B" />
              <path d="M30 16 L50 16" stroke="#FF6B00" strokeWidth="3" strokeLinecap="round" />
              {/* Delivery Box */}
              <rect x="40" y="45" width="30" height="25" rx="3" fill="#D97706" />
              <text x="55" y="60" fill="#FFFFFF" fontSize="6" fontWeight="bold" textAnchor="middle">Supermarche</text>
            </g>
          </svg>

          {/* Text Overlay Label */}
          <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
            <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              Yaoundé Bastos & Omnisports
            </Typography>
            <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#FFC4A8' }}>
              Political Capital Hub • 7 Hills Coverage
            </Typography>
          </Box>
        </Box>
      );

    case 'douala':
      return (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: '#0E1F2B',
            overflow: 'hidden',
          }}
        >
          {/* Douala Seaport City Visual Artwork */}
          <svg width="100%" height="100%" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" fill="none">
            <defs>
              <linearGradient id="doualaSky" x1="0" y1="0" x2="0" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0B1A24" />
                <stop offset="50%" stopColor="#143447" />
                <stop offset="100%" stopColor="#FF6B00" />
              </linearGradient>
            </defs>

            <rect width="600" height="360" fill="url(#doualaSky)" />

            {/* Wouri River Bridge Silhouette */}
            <path d="M0 240 L600 240" stroke="#254B5F" strokeWidth="4" />
            <path d="M40 240 L80 180 L120 240 M160 240 L200 180 L240 240 M280 240 L320 180 L360 240 M400 240 L440 180 L480 240" stroke="#FF6B00" strokeWidth="2.5" opacity="0.6" />

            {/* Douala Port Containers & Ships */}
            <rect x="50" y="210" width="30" height="15" fill="#EF4444" />
            <rect x="85" y="210" width="30" height="15" fill="#3B82F6" />
            <rect x="65" y="195" width="30" height="15" fill="#10B981" />

            {/* Marché Sandaga & Akwa Commercial Buildings */}
            <rect x="220" y="160" width="70" height="80" rx="4" fill="#1C3C4E" />
            <rect x="300" y="140" width="80" height="100" rx="5" fill="#173242" />
            <rect x="395" y="170" width="65" height="70" rx="4" fill="#21465B" />

            {/* Wouri River Water */}
            <path d="M0 242 Q150 255 300 245 T600 250 V360 H0 Z" fill="#0D212E" />
            <line x1="50" y1="270" x2="180" y2="270" stroke="#FF6B00" strokeWidth="1.5" opacity="0.5" />
            <line x1="320" y1="285" x2="480" y2="285" stroke="#FFD700" strokeWidth="1.5" opacity="0.5" />

            {/* Cooking Gas Truck / Courier Motorbike */}
            <g transform="translate(240, 270)">
              <rect x="0" y="0" width="50" height="25" rx="4" fill="#FF6B00" />
              <rect x="35" y="5" width="12" height="12" fill="#E2E8F0" />
              <circle cx="12" cy="25" r="6" fill="#111" />
              <circle cx="38" cy="25" r="6" fill="#111" />
              {/* Red Gas Cylinder on Truck */}
              <rect x="8" y="-12" width="10" height="18" rx="3" fill="#DC2626" />
              <rect x="20" y="-12" width="10" height="18" rx="3" fill="#DC2626" />
            </g>

            {/* Black Cameroonian Gas Technician */}
            <g transform="translate(430, 230)">
              <circle cx="20" cy="18" r="12" fill="#3D2314" />
              <path d="M8 32 L32 32 L28 75 L12 75 Z" fill="#FF6B00" />
              <rect x="25" y="30" width="14" height="22" rx="3" fill="#DC2626" />
              <text x="32" y="44" fill="#FFF" fontSize="5" fontWeight="bold" textAnchor="middle">GAS</text>
            </g>
          </svg>

          <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
            <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              Douala Bonapriso & Akwa
            </Typography>
            <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#FFC4A8' }}>
              Economic Capital Hub • Seaport & Marché Sandaga
            </Typography>
          </Box>
        </Box>
      );

    case 'bamenda':
      return (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: '#1C2919',
            overflow: 'hidden',
          }}
        >
          {/* Bamenda Highlands City Visual Artwork */}
          <svg width="100%" height="100%" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" fill="none">
            <defs>
              <linearGradient id="bamendaSky" x1="0" y1="0" x2="0" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0E1A0C" />
                <stop offset="50%" stopColor="#1E3818" />
                <stop offset="100%" stopColor="#FF6B00" />
              </linearGradient>
            </defs>

            <rect width="600" height="360" fill="url(#bamendaSky)" />

            {/* Grassland Mountain Highlands */}
            <path d="M0 220 Q180 120 360 210 T600 180 V360 H0 Z" fill="#25461E" />
            <path d="M-40 250 Q160 160 380 240 T600 210 V360 H-40 Z" fill="#1A3315" />

            {/* Bamenda Up Station Cliff Edge */}
            <path d="M420 150 L520 150 L550 260 L390 260 Z" fill="#132610" />

            {/* Commercial Ave Market Stalls with Vibrant Canopies */}
            <polygon points="60,250 110,230 160,250" fill="#EF4444" />
            <rect x="70" y="250" width="80" height="40" fill="#2A4D22" />

            <polygon points="170,250 220,230 270,250" fill="#F59E0B" />
            <rect x="180" y="250" width="80" height="40" fill="#22421B" />

            <polygon points="280,250 330,230 380,250" fill="#3B82F6" />
            <rect x="290" y="250" width="80" height="40" fill="#1A3415" />

            {/* Fresh Produce Baskets (Eru, Plantains, Potatoes) */}
            <circle cx="95" cy="275" r="8" fill="#F59E0B" />
            <circle cx="110" cy="275" r="8" fill="#10B981" />
            <circle cx="205" cy="275" r="8" fill="#8B5CF6" />

            {/* Black Cameroonian Market Shopper / Errands Agent */}
            <g transform="translate(460, 220)">
              <circle cx="20" cy="18" r="12" fill="#422517" />
              <path d="M6 32 L34 32 L28 80 L12 80 Z" fill="#FF6B00" />
              {/* Shopping Bag */}
              <rect x="-5" y="40" width="18" height="22" rx="2" fill="#F59E0B" />
              <path d="M-1 40 V34 H9 V40" stroke="#B45309" strokeWidth="2" fill="none" />
            </g>
          </svg>

          <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
            <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              Bamenda Commercial Ave & Nkwen
            </Typography>
            <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#FFC4A8' }}>
              Grassland Capital Hub • Market Shopping & Errand Coverage
            </Typography>
          </Box>
        </Box>
      );

    case 'buea':
    default:
      return (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            bgcolor: '#12251D',
            overflow: 'hidden',
          }}
        >
          {/* Buea Mount Cameroon Visual Artwork */}
          <svg width="100%" height="100%" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" fill="none">
            <defs>
              <linearGradient id="bueaSky" x1="0" y1="0" x2="0" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0B1A14" />
                <stop offset="45%" stopColor="#173B2E" />
                <stop offset="100%" stopColor="#FF6B00" />
              </linearGradient>
            </defs>

            <rect width="600" height="360" fill="url(#bueaSky)" />

            {/* Majestic Mount Cameroon Silhouette with Snow/Cloud Peak */}
            <polygon points="120,260 300,80 480,260" fill="#19382B" />
            <polygon points="260,120 300,80 340,120" fill="#E2E8F0" opacity="0.85" />
            <polygon points="180,260 320,110 460,260" fill="#132D22" opacity="0.9" />

            {/* Lush Buea Mountain Mist / Clouds */}
            <ellipse cx="280" cy="140" rx="90" ry="18" fill="#FFFFFF" opacity="0.25" />
            <ellipse cx="340" cy="160" rx="70" ry="15" fill="#FFFFFF" opacity="0.2" />

            {/* Buea Molyko University Campus Buildings & Residential Villas */}
            <rect x="90" y="220" width="75" height="50" rx="4" fill="#234E3C" />
            <polygon points="85,220 127.5,195 170,220" fill="#991B1B" />

            <rect x="200" y="210" width="90" height="60" rx="5" fill="#1D4233" />
            <polygon points="195,210 245,185 295,210" fill="#991B1B" />

            <rect x="360" y="225" width="70" height="45" rx="4" fill="#255340" />

            {/* Palm Trees & Mountain Vegetation */}
            <g transform="translate(480, 200)">
              <line x1="20" y1="60" x2="20" y2="10" stroke="#543A26" strokeWidth="4" />
              <circle cx="10" cy="10" r="12" fill="#10B981" />
              <circle cx="30" cy="10" r="12" fill="#10B981" />
              <circle cx="20" cy="-2" r="12" fill="#059669" />
            </g>

            {/* Black Cameroonian Deep Cleaning Technician */}
            <g transform="translate(140, 230)">
              <circle cx="20" cy="18" r="12" fill="#3D2314" />
              <path d="M8 32 L32 32 L26 75 L14 75 Z" fill="#FF6B00" />
              {/* Pressure Cleaning Wand */}
              <line x1="30" y1="35" x2="55" y2="55" stroke="#CBD5E1" strokeWidth="3" />
              <line x1="55" y1="55" x2="70" y2="70" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
            </g>
          </svg>

          <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
            <Typography sx={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: 18, color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              Buea Molyko & Clerks Quarters
            </Typography>
            <Typography sx={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#FFC4A8' }}>
              Mount Cameroon Hub • University & Villa Cleaning Coverage
            </Typography>
          </Box>
        </Box>
      );
  }
}
