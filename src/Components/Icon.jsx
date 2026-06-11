export function Icon({ name }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: '2',
  }

  const paths = {
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="3" {...common} />
        <path d="M8 2v4M16 2v4M3 10h18" {...common} />
      </>
    ),
    records: <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4H10l2 2h4.5A2.5 2.5 0 0 1 19 8.5V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" {...common} />,
    pill: (
      <>
        <path d="m10.5 20.5 10-10a5 5 0 0 0-7-7l-10 10a5 5 0 0 0 7 7Z" {...common} />
        <path d="m8.5 8.5 7 7" {...common} />
      </>
    ),
    sos: <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="800" fill="currentColor">SOS</text>,
    heart: <path d="M20.8 6.5a5 5 0 0 0-7.1 0L12 8.2l-1.7-1.7a5 5 0 0 0-7.1 7.1l1.7 1.7L12 22l7.1-6.7 1.7-1.7a5 5 0 0 0 0-7.1Z" {...common} />,
    headset: (
      <>
        <path d="M4 13a8 8 0 0 1 16 0" {...common} />
        <path d="M5 13h3v6H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM19 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2ZM16 19c0 1.7-1.3 3-3 3h-2" {...common} />
      </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" {...common} />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" {...common} />
        <path d="M10 21h4" {...common} />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" {...common} />
        <path d="M4 21a8 8 0 0 1 16 0" {...common} />
      </>
    ),
    chart: (
      <>
        <path d="M4 19h16M7 16v-5M12 16V7M17 16v-8" {...common} />
        <path d="m7 11 5-4 5 1" {...common} />
      </>
    ),
    search: <path d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" {...common} />,
    'arrow-left': <path d="M19 12H5M12 19l-7-7 7-7" {...common} />,
    lock: <path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6Z" {...common} />,
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...common} />
        <circle cx="9" cy="7" r="4" {...common} />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" {...common} />
      </>
    ),
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z" {...common} />,
    target: <path d="M12 2v4M12 18v4M2 12h4M18 12h4M17 7l-5 5-3-1-2 4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" {...common} />,
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" {...common} />
        <circle cx="12" cy="12" r="3" {...common} />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" {...common} />
        <rect x="14" y="4" width="6" height="6" rx="1" {...common} />
        <rect x="4" y="14" width="6" height="6" rx="1" {...common} />
        <rect x="14" y="14" width="6" height="6" rx="1" {...common} />
      </>
    ),
    mail: <path d="M4 4h16v16H4ZM4 7l8 6 8-6" {...common} />,
    map: (
      <>
        <path d="M12 21s7-5.2 7-12A7 7 0 0 0 5 9c0 6.8 7 12 7 12Z" {...common} />
        <circle cx="12" cy="9" r="2.5" {...common} />
      </>
    ),
    moon: <path d="M21 14.8A8 8 0 0 1 9.2 3 6.5 6.5 0 1 0 21 14.8Z" {...common} />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" {...common} />,
    plus: <path d="M12 5v14M5 12h14" {...common} />,
    minus: <path d="M5 12h14" {...common} />,
    send: <path d="m22 2-7 20-4-9-9-4Z" {...common} />,
    settings: (
      <>
        <circle cx="12" cy="12" r="3" {...common} />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5.8Z" {...common} />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon-svg">
      {paths[name] || paths.heart}
    </svg>
  )
}
