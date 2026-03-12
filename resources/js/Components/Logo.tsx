// resources/js/Components/Logo.tsx
export default function Logo({ size = 32 }: { size?: number }) {
    return (
        <svg width={size} height={size * 1.2} viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="180" height="220" rx="16" fill="#1A1A1A" stroke="#C9A84C" strokeWidth="2"/>
            <rect x="22" y="22" width="156" height="196" rx="10" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4"/>
            <ellipse cx="100" cy="12" rx="28" ry="10" fill="#0D0D0D" stroke="#C9A84C" strokeWidth="2"/>
            <line x1="30" y1="80" x2="170" y2="80" stroke="#C9A84C" strokeWidth="0.8" opacity="0.3"/>
            <line x1="30" y1="170" x2="170" y2="170" stroke="#C9A84C" strokeWidth="0.8" opacity="0.3"/>
            <text x="100" y="150" textAnchor="middle" fontFamily="Georgia, serif" fontSize="80" fontWeight="700" fill="#C9A84C">L</text>
            <circle cx="100" cy="205" r="5" fill="none" stroke="#C9A84C" strokeWidth="1.2" opacity="0.5"/>
        </svg>
    );
}