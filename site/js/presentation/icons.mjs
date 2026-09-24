const paths = {
dumbbell:'<path d="M3 9v6m3-8v10m12-10v10m3-8v6M6 12h12M3 9h3m-3 6h3m12-6h3m-3 6h3"/>',
check:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
motion:'<circle cx="14" cy="4" r="2"/><path d="m8 9 4-2 3 4 4 1M12 7l-2 7 4 3 1 4M10 14l-4 6M5 10l3-1"/>',
coffee:'<path d="M4 9h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Zm12 1h2a3 3 0 0 1 0 6h-2M6 3c-1 1 1 2 0 3M10 3c-1 1 1 2 0 3M14 3c-1 1 1 2 0 3"/>',
programs:'<rect x="5" y="7" width="15" height="14" rx="3"/><path d="M16 3H6a3 3 0 0 0-3 3v10M9 12h7M9 16h5"/>',
moon:'<path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5Z"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
settings:'<path d="m9 3-.7 2.2-2 .9-2.1-.5-2 3.4 1.5 1.7v2.6L2.2 15l2 3.4 2.1-.5 2 .9L9 21h4l.7-2.2 2-.9 2.1.5 2-3.4-1.5-1.7v-2.6L19.8 9l-2-3.4-2.1.5-2-.9L13 3Z"/><circle cx="11" cy="12" r="3"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v7m0-11v2"/>',
trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
play:'<path d="m9 5 11 7-11 7Z"/>',
};
export const icon = name => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.info}</svg>`;
