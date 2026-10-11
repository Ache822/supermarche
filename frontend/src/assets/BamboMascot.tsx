export function BamboMascot({ width = 320, height = 400 }: { width?: number; height?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 400 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="mascotTitle"
    >
      <title id="mascotTitle">
        Kimzy, the stylish modern shopping mall mascot of Kim's Store, wearing DJ headphones, an oversized streetwear hoodie, and carrying chic designer shopping bags
      </title>

      <defs>
        <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF8533" />
          <stop offset="100%" stopColor="#FF5500" />
        </linearGradient>

        <linearGradient id="bagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A1A" />
          <stop offset="100%" stopColor="#E04800" />
        </linearGradient>

        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E192B" />
          <stop offset="50%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#3B2667" />
        </linearGradient>

        <linearGradient id="sneakerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>

      {/* Ground Dynamic Shadow */}
      <ellipse cx="200" cy="495" rx="140" ry="16" fill="#1A1528" opacity="0.16" />

      {/* Floating Gen-Z Cyber Sparkles */}
      <path d="M70 120 L76 135 L91 141 L76 147 L70 162 L64 147 L49 141 L64 135 Z" fill="#FF8533" opacity="0.85" />
      <path d="M330 90 L334 100 L344 104 L334 108 L330 118 L326 108 L316 104 L326 100 Z" fill="#FF6B00" opacity="0.9" />
      <circle cx="348" cy="140" r="4" fill="#FF8533" opacity="0.75" />
      <circle cx="60" cy="200" r="3.5" fill="#FF6B00" opacity="0.6" />

      {/* Chunky Streetwear Sneakers / High-Top Kicks */}
      {/* Left Sneaker */}
      <g id="left-sneaker">
        <path d="M135 410 L130 460 Q130 475 145 475 L180 475 Q188 475 188 460 L180 410 Z" fill="#1C1726" />
        {/* Sneaker Main Body */}
        <path d="M122 455 Q125 440 148 438 L180 445 Q192 455 190 472 L124 472 Q120 468 122 455 Z" fill="url(#hoodieGrad)" />
        {/* Sole */}
        <path d="M116 470 L195 470 Q196 484 186 486 L124 486 Q114 484 116 470 Z" fill="url(#sneakerGrad)" />
        {/* Street Swoosh / Stripe */}
        <path d="M136 456 Q156 448 174 460" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* Right Sneaker */}
      <g id="right-sneaker">
        <path d="M220 410 L212 460 Q212 475 220 475 L255 475 Q270 475 270 460 L265 410 Z" fill="#1C1726" />
        {/* Sneaker Main Body */}
        <path d="M210 455 Q212 440 235 438 L268 445 Q280 455 278 472 L212 472 Q208 468 210 455 Z" fill="url(#hoodieGrad)" />
        {/* Sole */}
        <path d="M205 470 L284 470 Q286 484 276 486 L214 486 Q204 484 205 470 Z" fill="url(#sneakerGrad)" />
        {/* Street Swoosh / Stripe */}
        <path d="M226 456 Q246 448 264 460" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      {/* Streetwear Pants (Relaxed Fit Cargo / Denim) */}
      <path
        d="M152 310 L132 430 Q130 440 144 440 L182 440 Q188 440 188 430 L196 335 L204 335 L212 430 Q212 440 218 440 L256 440 Q270 440 268 430 L248 310 Z"
        fill="#1C1726"
      />
      {/* Cargo Pocket Accents */}
      <rect x="130" y="355" width="24" height="28" rx="5" fill="#282236" />
      <rect x="246" y="355" width="24" height="28" rx="5" fill="#282236" />

      {/* Oversized Streetwear Hoodie Body */}
      <path
        d="M125 210 Q95 240 105 320 Q108 340 135 345 L265 345 Q292 340 295 320 Q305 240 275 210 Q240 195 200 195 Q160 195 125 210 Z"
        fill="url(#hoodieGrad)"
      />

      {/* Hoodie Front Kangaroo Pocket */}
      <path
        d="M145 285 L160 265 L240 265 L255 285 L252 335 Q200 342 148 335 Z"
        fill="#E05500"
      />
      {/* Front Center Mall Icon / Logo on Chest */}
      <circle cx="200" cy="235" r="14" fill="#FFFFFF" opacity="0.95" />
      <path d="M194 233 L200 227 L206 233 L200 243 Z" fill="#FF6B00" />

      {/* Hoodie Drawstrings */}
      <path d="M178 220 L178 260" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="178" cy="263" r="3" fill="#FFFFFF" />
      <path d="M222 220 L222 260" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="222" cy="263" r="3" fill="#FFFFFF" />

      {/* Left Arm carrying Chic Mall Designer Shopping Bag */}
      <g id="left-arm-shopping-bag">
        {/* Arm */}
        <path
          d="M125 215 Q85 245 92 290 Q95 305 110 300 L125 285 Q115 250 140 230 Z"
          fill="url(#hoodieGrad)"
        />
        {/* Hand */}
        <circle cx="106" cy="300" r="13" fill="#F4B084" />

        {/* Designer Shopping Bag Straps */}
        <path d="M96 295 Q106 270 116 295" stroke="#FFFFFF" strokeWidth="3.5" fill="none" strokeLinecap="round" />

        {/* Designer Shopping Bag Body */}
        <rect x="70" y="300" width="70" height="85" rx="8" fill="url(#bagGrad)" />
        {/* White glossy fold top */}
        <rect x="67" y="296" width="76" height="12" rx="4" fill="#FFFFFF" />
        {/* Brand Name on Bag */}
        <text x="105" y="348" fontFamily="Outfit, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" textAnchor="middle" letterSpacing="1">
          KIM'S
        </text>
        <text x="105" y="362" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="8" fill="#FFF2EB" textAnchor="middle" letterSpacing="0.5">
          STORE
        </text>
      </g>

      {/* Right Arm making Cool Peace Sign / Holding Mall Bag */}
      <g id="right-arm-shopping-bag">
        {/* Arm */}
        <path
          d="M275 215 Q315 245 308 290 Q305 305 290 300 L275 285 Q285 250 260 230 Z"
          fill="url(#hoodieGrad)"
        />
        {/* Hand */}
        <circle cx="294" cy="300" r="13" fill="#F4B084" />

        {/* Secondary Shopping Bag Straps */}
        <path d="M284 295 Q294 270 304 295" stroke="#FF6B00" strokeWidth="3.5" fill="none" strokeLinecap="round" />

        {/* Secondary Sleek Fashion Bag */}
        <rect x="260" y="300" width="65" height="80" rx="8" fill="#1C1726" />
        <rect x="257" y="296" width="71" height="10" rx="4" fill="#FF6B00" />
        {/* Minimalist Shopping Logo */}
        <circle cx="292.5" cy="340" r="14" fill="rgba(255, 107, 0, 0.2)" />
        <path d="M287 340 L292.5 334 L298 340 L292.5 346 Z" fill="#FF6B00" />
      </g>

      {/* Head, Hair & Trendy DJ Headphones */}
      {/* Neck */}
      <rect x="186" y="170" width="28" height="25" rx="6" fill="#F4B084" />

      {/* Face Base */}
      <circle cx="200" cy="140" r="56" fill="#F4B084" />

      {/* Cool Spiky / Styled Urban Hair */}
      <path
        d="M144 135 Q140 85 180 75 Q205 60 235 75 Q260 88 256 135 Q245 105 220 100 Q190 98 165 110 Q150 120 144 135 Z"
        fill="#1C1726"
      />

      {/* Stylish Cyber Visor Shades / Sunglasses */}
      <path
        d="M152 125 Q200 115 248 125 L244 148 Q200 160 156 148 Z"
        fill="url(#visorGrad)"
      />
      {/* Shades Neon Glint */}
      <path d="M162 130 L188 126" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M208 125 L234 129" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Confident Friendly Smile */}
      <path d="M182 165 Q200 180 218 165" stroke="#7A391A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Cute Anime Blush */}
      <ellipse cx="160" cy="155" rx="7" ry="4" fill="#FF6B00" opacity="0.35" />
      <ellipse cx="240" cy="155" rx="7" ry="4" fill="#FF6B00" opacity="0.35" />

      {/* Trendy Gen-Z Over-Ear DJ Headphones */}
      {/* Headband arch */}
      <path
        d="M136 135 Q135 60 200 60 Q265 60 264 135"
        stroke="#1C1726"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M145 125 Q145 70 200 70 Q255 70 255 125"
        stroke="#FF6B00"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Left Ear Cup */}
      <rect x="130" y="115" width="18" height="42" rx="9" fill="#1C1726" />
      <rect x="133" y="121" width="12" height="30" rx="6" fill="#FF6B00" />
      <circle cx="139" cy="136" r="4" fill="#FFFFFF" opacity="0.9" />

      {/* Right Ear Cup */}
      <rect x="252" y="115" width="18" height="42" rx="9" fill="#1C1726" />
      <rect x="255" y="121" width="12" height="30" rx="6" fill="#FF6B00" />
      <circle cx="261" cy="136" r="4" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}
