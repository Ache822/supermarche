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
        Kimzy, the friendly supermarket grocery assistant, holding a fresh market basket filled with groceries
      </title>

      {/* Ground Shadow */}
      <ellipse cx="200" cy="500" rx="130" ry="14" fill="#662600" opacity="0.12" />

      {/* Legs & Shoes */}
      <path
        d="M150 330 L135 470 Q135 485 150 485 L175 485 Q185 485 186 472 L195 360 L205 360 L214 472 Q215 485 225 485 L250 485 Q265 485 265 470 L250 330 Z"
        fill="#362C44"
      />
      <rect x="140" y="470" width="45" height="20" rx="6" fill="#120E16" />
      <rect x="215" y="470" width="45" height="20" rx="6" fill="#120E16" />

      {/* Body & Supermarket Orange Apron */}
      <path
        d="M140 220 Q120 240 118 300 Q116 335 140 340 L260 340 Q284 335 282 300 Q280 240 260 220 Q230 205 200 205 Q170 205 140 220 Z"
        fill="#FFFFFF"
      />
      {/* Supermarche Apron Front */}
      <path
        d="M150 240 L165 215 L235 215 L250 240 L255 350 Q200 360 145 350 Z"
        fill="#FF6B00"
      />
      {/* Apron Pocket */}
      <rect x="165" y="275" width="70" height="50" rx="8" fill="#E05D00" />
      <path d="M185 295 L200 310 L215 295" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Left Arm holding Fresh Baguette & Grocery Items */}
      <path
        d="M126 235 Q104 240 92 272 Q84 295 100 313 L120 300 Q108 292 110 275 Q113 255 132 246 Z"
        fill="#FFF4ED"
      />
      <circle cx="98" cy="313" r="17" fill="#C98B5D" />

      {/* Right Arm holding Shopping Basket */}
      <path
        d="M274 235 Q297 245 306 280 Q312 305 292 322 Q276 334 262 318 L272 302 Q286 296 284 278 Q282 258 268 250 Z"
        fill="#FFF4ED"
      />
      <circle cx="292" cy="322" r="17" fill="#C98B5D" />

      {/* Fresh Grocery Shopping Basket */}
      <rect x="250" y="325" width="100" height="70" rx="10" fill="#B84A00" />
      <rect x="245" y="320" width="110" height="15" rx="5" fill="#8F3800" />
      <path d="M275 320 Q300 280 325 320" stroke="#662600" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Groceries inside basket: Baguette, Carrot, Orange */}
      {/* Baguette */}
      <rect x="260" y="270" width="18" height="60" rx="9" fill="#D98F52" transform="rotate(-15 260 270)" />
      {/* Carrot */}
      <polygon points="290,280 305,330 280,325" fill="#FF6B00" />
      <path d="M290 280 L295 265 M290 280 L285 268" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      {/* Fresh Orange */}
      <circle cx="325" cy="305" r="16" fill="#FF814D" />
      <circle cx="322" cy="300" r="3" fill="#FFFFFF" opacity="0.4" />

      {/* Head & Cap */}
      <circle cx="200" cy="150" r="62" fill="#C98B5D" />

      {/* Supermarche Chef / Grocer Cap */}
      <path
        d="M138 118 Q135 95 168 84 Q198 74 228 88 Q254 100 258 120 Q258 132 250 138 Q252 116 232 108 Q210 100 188 104 Q164 108 150 122 Q142 126 138 118 Z"
        fill="#FF6B00"
      />
      <rect x="150" y="118" width="100" height="14" rx="7" fill="#E05D00" />
      <circle cx="200" cy="96" r="7" fill="#FFFFFF" />

      {/* Eyes & Warm Happy Smile */}
      <ellipse cx="178" cy="155" rx="8" ry="9" fill="#120E16" />
      <ellipse cx="222" cy="155" rx="8" ry="9" fill="#120E16" />
      <circle cx="180" cy="152" r="2.5" fill="#FFFFFF" />
      <circle cx="224" cy="152" r="2.5" fill="#FFFFFF" />
      <path d="M172 178 Q200 200 228 178" stroke="#120E16" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <ellipse cx="165" cy="168" rx="9" ry="6" fill="#FF814D" opacity="0.5" />
      <ellipse cx="235" cy="168" rx="9" ry="6" fill="#FF814D" opacity="0.5" />
    </svg>
  );
}
