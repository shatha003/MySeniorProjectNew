import * as React from 'react';

export interface ServiceInfo {
    id: string;
    name: string;
    domain: string;
    color: string;
    icon: React.ReactNode;
}

// Branded SVG icons for popular services
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const YouTubeIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.56 31.56 0 000 12a31.56 31.56 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.56 31.56 0 0024 12a31.56 31.56 0 00-.5-5.81z" fill="#FF0000" />
        <path d="M9.75 15.02l6.28-3.02-6.28-3.02v6.04z" fill="#FFF" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#feda75" />
                <stop offset="25%" stopColor="#fa7e1e" />
                <stop offset="50%" stopColor="#d62976" />
                <stop offset="75%" stopColor="#962fbf" />
                <stop offset="100%" stopColor="#4f5bd5" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="#fff" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="#fff" strokeWidth="1.8" />
    </svg>
);

const TwitterXIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#000" />
        <path d="M13.81 10.47L19.92 3.5h-1.45l-5.31 6.05L8.83 3.5H3.5l6.41 9.17L3.5 20h1.45l5.61-6.39L15.17 20h5.33l-6.69-9.53zm-1.99 2.26l-.65-.91L5.6 4.62h2.23l4.17 5.85.65.91 5.43 7.62h-2.23l-4.33-6.27z" fill="#fff" />
    </svg>
);

const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#1877F2" />
        <path d="M16.67 15.13l.55-3.56h-3.43v-2.31c0-.97.48-1.92 2.01-1.92h1.55V4.27s-1.41-.24-2.75-.24c-2.81 0-4.64 1.7-4.64 4.78v2.71H7v3.56h2.96V23.6a11.7 11.7 0 003.64 0v-8.47h2.66z" fill="#fff" />
    </svg>
);

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.43 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.24-.02-2.25-3.34.73-4.04-1.41-4.04-1.41-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.22.69.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" fill="currentColor" />
    </svg>
);

const MicrosoftIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" />
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
        <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
    </svg>
);

const AppleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor" />
    </svg>
);

const NetflixIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#E50914" />
        <path d="M6 4h3.14l3.4 9.34L15.94 4H19l-5.28 16h-1.5L7 6.5V20H6V4z" fill="#fff" />
    </svg>
);

const SpotifyIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="12" fill="#1DB954" />
        <path d="M17.2 16.9a.74.74 0 01-1.02.25c-2.8-1.71-6.32-2.1-10.47-1.15a.74.74 0 11-.33-1.45c4.55-1.04 8.46-.59 11.57 1.33a.74.74 0 01.25 1.02zm1.31-3c-.23.37-.72.49-1.09.26-3.2-1.97-8.07-2.54-11.85-1.39a.83.83 0 11-.48-1.59c4.31-1.31 9.67-.68 13.32 1.59.37.22.49.72.1 1.13zm.11-3.12c-3.84-2.28-10.17-2.49-13.84-1.38a1 1 0 11-.58-1.91c4.21-1.27 11.21-1.03 15.64 1.6a1 1 0 01-1.22 1.69z" fill="#fff" />
    </svg>
);

const DiscordIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#5865F2" />
        <path d="M18.59 5.89a15.4 15.4 0 00-3.87-1.23.06.06 0 00-.06.03c-.17.3-.36.7-.49 1a14.2 14.2 0 00-4.34 0 10.5 10.5 0 00-.5-1 .06.06 0 00-.06-.03A15.36 15.36 0 005.4 5.89s-2.8 4.22-3.17 8.37a.07.07 0 00.02.05 15.5 15.5 0 004.72 2.44.06.06 0 00.07-.02c.36-.5.69-1.04.97-1.6a.06.06 0 00-.04-.09 10.2 10.2 0 01-1.49-.73.06.06 0 01-.01-.1c.1-.08.2-.16.3-.24a.06.06 0 01.06-.01c3.13 1.46 6.52 1.46 9.61 0a.06.06 0 01.07.01c.1.08.2.16.3.24a.06.06 0 01-.01.1c-.48.28-.97.53-1.49.73a.06.06 0 00-.03.09c.28.56.62 1.1.97 1.6a.06.06 0 00.07.02 15.45 15.45 0 004.72-2.44.06.06 0 00.03-.05c.44-4.65-.74-8.69-3.13-12.27zM8.68 14.27c-.79 0-1.43-.74-1.43-1.65 0-.91.63-1.65 1.43-1.65.8 0 1.44.74 1.43 1.65 0 .91-.63 1.65-1.43 1.65zm5.29 0c-.79 0-1.43-.74-1.43-1.65 0-.91.63-1.65 1.43-1.65.81 0 1.44.74 1.43 1.65 0 .91-.63 1.65-1.43 1.65z" fill="#fff" />
    </svg>
);

const TwitchIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#9146FF" />
        <path d="M5.5 3L4 6.5V19h4.5V22h3l3-3h3.5L22 15V3H5.5zm14 11l-3 3h-4l-2.5 2.5V17H6.5V5h13v9z" fill="#fff" />
        <path d="M15 8h2v5h-2V8zM11 8h2v5h-2V8z" fill="#fff" />
    </svg>
);

const AmazonIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#232F3E" />
        <path d="M14.17 13.5c-1.72 1.27-4.21 1.95-6.36 1.95-3.01 0-5.72-1.11-7.77-2.97-.16-.15-.02-.35.18-.24 2.21 1.29 4.95 2.07 7.78 2.07 1.91 0 4-.4 5.93-1.21.29-.12.53.19.24.4z" fill="#FF9900" />
        <path d="M14.85 12.71c-.22-.28-1.45-.13-2-.07-.17.02-.19-.13-.04-.23 .98-.69 2.58-.49 2.77-.26.19.23-.05 1.83-.97 2.6-.14.12-.27.05-.21-.1.2-.5.65-1.67.45-1.94z" fill="#FF9900" />
        <path d="M12.87 5.14V4.4c0-.11.08-.19.19-.19h3.39c.11 0 .2.08.2.19v.63c0 .11-.09.25-.25.47l-1.76 2.51c.65-.02 1.34.08 1.93.41.13.07.17.18.18.29v.79c0 .11-.12.24-.25.17-.1-.06-1.06-.49-1.57-.49-.49 0-1.47.51-1.55.49-.08-.02-.2-.11-.2-.28V8.7c0-.15 0-.4.2-.62l2.04-2.93h-1.77c-.11 0-.19-.08-.19-.19l.41.18z" fill="#fff" />
    </svg>
);

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path d="M7.1 20H4V9.3h3.1V20zM5.55 8A1.8 1.8 0 015.55 4.4a1.8 1.8 0 010 3.6zM20 20h-3.1v-5.2c0-1.24-.02-2.84-1.73-2.84-1.73 0-2 1.35-2 2.75V20H10.1V9.3h2.96v1.46h.04a3.25 3.25 0 012.93-1.61c3.13 0 3.71 2.06 3.71 4.74V20z" fill="#fff" />
    </svg>
);

const RedditIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="12" fill="#FF4500" />
        <path d="M20 12a1.73 1.73 0 00-2.9-1.28 8.47 8.47 0 00-4.63-1.47l.79-3.72 2.58.55a1.24 1.24 0 102.3.41l.01-.08a1.24 1.24 0 00-2.19-.66l-2.89-.61a.41.41 0 00-.48.3l-.88 4.16a8.52 8.52 0 00-4.69 1.47 1.73 1.73 0 10-1.91 2.82 3.4 3.4 0 00-.05.57c0 2.88 3.37 5.22 7.52 5.22s7.52-2.34 7.52-5.22a3.4 3.4 0 00-.05-.57A1.73 1.73 0 0020 12zM8.5 13.24a1.24 1.24 0 112.48 0 1.24 1.24 0 01-2.48 0zm6.95 3.28c-.85.85-2.47.92-3.44.92s-2.6-.07-3.44-.92a.32.32 0 01.44-.44c.54.53 1.68.72 3 .72s2.46-.19 3-.72a.32.32 0 01.44.44zm-.2-2.04a1.24 1.24 0 110-2.48 1.24 1.24 0 010 2.48z" fill="#fff" />
    </svg>
);

const SnapchatIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#FFFC00" />
        <path d="M12 5c1.5 0 2.82.6 3.62 1.73.6.85.73 1.88.65 2.87-.02.18-.04.36-.06.54.33.13.66.2.93.2.3 0 .48-.08.56-.14a.45.45 0 01.28-.09c.16 0 .4.07.48.34.1.33-.14.53-.83.74l-.18.06c-.39.12-.87.27-1.01.58-.08.18-.05.4.1.67.03.06.07.12.1.17.7 1.08 1.57 1.82 2.58 2.21.16.06.21.14.22.2.02.1-.06.22-.22.31-.42.23-1.03.38-1.82.46-.05.07-.11.27-.15.41-.04.14-.09.29-.16.42-.1.17-.24.26-.56.26-.14 0-.3-.02-.51-.06a4.49 4.49 0 00-.98-.11c-.27 0-.53.03-.79.09-.5.12-.93.41-1.43.74-.72.48-1.54 1.02-2.82 1.02h-.06c-1.28 0-2.1-.54-2.82-1.02-.5-.33-.93-.62-1.43-.74a3.87 3.87 0 00-.79-.09c-.37 0-.7.05-.98.11-.2.04-.37.06-.51.06-.32 0-.46-.09-.56-.26a2.35 2.35 0 01-.16-.42 4.8 4.8 0 00-.15-.41c-.79-.08-1.4-.23-1.82-.46-.16-.09-.24-.2-.22-.31.01-.06.06-.14.22-.2A5.97 5.97 0 005.82 14a2.85 2.85 0 00.38-.56c.08-.18.1-.36.06-.49a.78.78 0 00-.32-.35c-.09-.06-.22-.11-.38-.16l-.42-.13c-.52-.17-.76-.4-.74-.66.01-.16.12-.34.47-.34.09 0 .19.03.29.09.19.12.41.17.62.17.33 0 .62-.11.82-.18l.07-.03c-.02-.19-.05-.39-.07-.58-.08-.99.06-2.02.65-2.87C9.18 5.6 10.5 5 12 5z" fill="#333" />
    </svg>
);

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#000" />
        <path d="M16.6 5.82a4.28 4.28 0 01-1.04-2.06A4.42 4.42 0 0115.5 3h-2.87v12.12a2.6 2.6 0 01-2.58 2.47 2.6 2.6 0 01-2.6-2.6 2.6 2.6 0 012.6-2.6c.27 0 .53.04.78.12V9.6a5.47 5.47 0 00-.78-.06c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5 5.5-2.47 5.5-5.5V9.66a7.12 7.12 0 004.14 1.33V8.17a4.3 4.3 0 01-3.13-2.35z" fill="#25F4EE" />
        <path d="M17.6 6.82a4.28 4.28 0 01-1.04-2.06A4.42 4.42 0 0116.5 4h-2.87v12.12a2.6 2.6 0 01-2.58 2.47 2.6 2.6 0 01-2.6-2.6 2.6 2.6 0 012.6-2.6c.27 0 .53.04.78.12v-2.9a5.47 5.47 0 00-.78-.06c-3.03 0-5.5 2.47-5.5 5.5s2.47 5.5 5.5 5.5 5.5-2.47 5.5-5.5v-5.38a7.12 7.12 0 004.14 1.33V9.17a4.3 4.3 0 01-3.13-2.35z" fill="#FE2C55" />
    </svg>
);

const SteamIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <defs>
            <linearGradient id="steam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#111d2e" />
                <stop offset="100%" stopColor="#0a1a2d" />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="4" fill="url(#steam-grad)" />
        <path d="M12 4a8.98 8.98 0 00-8.93 8.1l4.8 1.98a2.55 2.55 0 011.45-.45h.07l2.14-3.1v-.04a3.41 3.41 0 013.41-3.41A3.41 3.41 0 0118.35 10.5a3.41 3.41 0 01-3.41 3.41h-.08l-3.05 2.18c0 .03.01.07.01.1a2.56 2.56 0 01-2.56 2.56 2.58 2.58 0 01-2.5-1.97l-3.46-1.43A9 9 0 0012 20a8 8 0 000-16z" fill="#fff" opacity="0.9" />
    </svg>
);

const PayPalIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <rect width="24" height="24" rx="4" fill="#003087" />
        <path d="M17.42 7.7c-.07.48-.42 2.2-1.68 3.64-1.58 1.8-3.58 1.8-4.17 1.8H10.9l-.73 4.41-.06.31h-2.1l.04-.31.78-4.95.06-.32H10l.4-.02c2.37-.1 4.22-.83 5.32-2.8.73-1.31.85-2.3.7-1.76z" fill="#009cde" />
        <path d="M15.96 5.5c-.53-.6-1.59-1-3.18-1H8.73l-.04.24-1.63 10.41-.04.28h2.63l.65-4.15.02-.15.6-.03h.64c2.55 0 4.55-1.04 5.14-4.03.17-.87.11-1.6-.26-2.17.14.05-.17-.18-.28-.35-.1-.04 0-.05 0-.05z" fill="#012169" />
    </svg>
);

const DropboxIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 2L6 6l6 4-6 4 6 4 6-4-6-4 6-4-6-4zM6 16l6 4 6-4" fill="none" stroke="#0061FF" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6 6l6 4 6-4-6-4-6 4z" fill="#0061FF" opacity="0.8" />
        <path d="M6 10l6 4 6-4-6-4-6 4z" fill="#0061FF" opacity="0.6" />
    </svg>
);

const SlackIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <path d="M5.04 15.16a2.02 2.02 0 01-2.02 2.02A2.02 2.02 0 011 15.16a2.02 2.02 0 012.02-2.02h2.02v2.02zm1.02 0a2.02 2.02 0 012.02-2.02 2.02 2.02 0 012.02 2.02v5.06a2.02 2.02 0 01-2.02 2.02 2.02 2.02 0 01-2.02-2.02v-5.06z" fill="#E01E5A" />
        <path d="M8.08 5.04a2.02 2.02 0 01-2.02-2.02A2.02 2.02 0 018.08 1a2.02 2.02 0 012.02 2.02v2.02H8.08zm0 1.03a2.02 2.02 0 012.02 2.02 2.02 2.02 0 01-2.02 2.02H2.97a2.02 2.02 0 01-2.02-2.02 2.02 2.02 0 012.02-2.02h5.11z" fill="#36C5F0" />
        <path d="M18.96 8.09a2.02 2.02 0 012.02-2.02 2.02 2.02 0 012.02 2.02 2.02 2.02 0 01-2.02 2.02h-2.02V8.09zm-1.02 0a2.02 2.02 0 01-2.02 2.02 2.02 2.02 0 01-2.02-2.02V2.98a2.02 2.02 0 012.02-2.02 2.02 2.02 0 012.02 2.02V8.1z" fill="#2EB67D" />
        <path d="M15.92 18.96a2.02 2.02 0 012.02 2.02A2.02 2.02 0 0115.92 23a2.02 2.02 0 01-2.02-2.02v-2.02h2.02zm0-1.02a2.02 2.02 0 01-2.02-2.02 2.02 2.02 0 012.02-2.02h5.11a2.02 2.02 0 012.02 2.02 2.02 2.02 0 01-2.02 2.02H15.92z" fill="#ECB22E" />
    </svg>
);

const PinterestIcon = () => (
    <svg viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="12" fill="#E60023" />
        <path d="M12 5.5c-4.14 0-6.5 2.96-6.5 5.43 0 1.5.57 2.83 1.78 3.32.2.08.38 0 .43-.22l.18-.7c.06-.21.03-.28-.12-.47-.34-.42-.55-.95-.55-1.71 0-2.2 1.64-4.17 4.28-4.17 2.33 0 3.61 1.43 3.61 3.33 0 2.5-1.11 4.62-2.76 4.62-.9 0-1.58-.75-1.37-1.67.26-.11.53-2.25.53-2.25 0-.54-.29-1-.63-1-.5 0-.9.52-.9 1.21 0 .44.15.74.15.74s-.5 2.14-.6 2.52c-.17.75-.03 1.67.02 1.76.03.06.08.07.12.03.05-.06.75-1.01.95-1.7l.37-1.4c.18.35.72.66 1.29.66 1.7 0 3.02-1.55 3.02-3.63-.01-1.57-1.33-3.04-3.35-3.04z" fill="#fff" />
    </svg>
);

// The list of all popular services
export const POPULAR_SERVICES: ServiceInfo[] = [
    { id: 'google', name: 'Google', domain: 'google.com', color: '#4285F4', icon: <GoogleIcon /> },
    { id: 'youtube', name: 'YouTube', domain: 'youtube.com', color: '#FF0000', icon: <YouTubeIcon /> },
    { id: 'instagram', name: 'Instagram', domain: 'instagram.com', color: '#E4405F', icon: <InstagramIcon /> },
    { id: 'facebook', name: 'Facebook', domain: 'facebook.com', color: '#1877F2', icon: <FacebookIcon /> },
    { id: 'twitter', name: 'X (Twitter)', domain: 'x.com', color: '#000000', icon: <TwitterXIcon /> },
    { id: 'github', name: 'GitHub', domain: 'github.com', color: '#181717', icon: <GitHubIcon /> },
    { id: 'microsoft', name: 'Microsoft', domain: 'microsoft.com', color: '#00A4EF', icon: <MicrosoftIcon /> },
    { id: 'apple', name: 'Apple', domain: 'apple.com', color: '#A2AAAD', icon: <AppleIcon /> },
    { id: 'netflix', name: 'Netflix', domain: 'netflix.com', color: '#E50914', icon: <NetflixIcon /> },
    { id: 'spotify', name: 'Spotify', domain: 'spotify.com', color: '#1DB954', icon: <SpotifyIcon /> },
    { id: 'discord', name: 'Discord', domain: 'discord.com', color: '#5865F2', icon: <DiscordIcon /> },
    { id: 'twitch', name: 'Twitch', domain: 'twitch.tv', color: '#9146FF', icon: <TwitchIcon /> },
    { id: 'reddit', name: 'Reddit', domain: 'reddit.com', color: '#FF4500', icon: <RedditIcon /> },
    { id: 'linkedin', name: 'LinkedIn', domain: 'linkedin.com', color: '#0A66C2', icon: <LinkedInIcon /> },
    { id: 'amazon', name: 'Amazon', domain: 'amazon.com', color: '#FF9900', icon: <AmazonIcon /> },
    { id: 'tiktok', name: 'TikTok', domain: 'tiktok.com', color: '#FE2C55', icon: <TikTokIcon /> },
    { id: 'snapchat', name: 'Snapchat', domain: 'snapchat.com', color: '#FFFC00', icon: <SnapchatIcon /> },
    { id: 'pinterest', name: 'Pinterest', domain: 'pinterest.com', color: '#E60023', icon: <PinterestIcon /> },
    { id: 'steam', name: 'Steam', domain: 'store.steampowered.com', color: '#171a21', icon: <SteamIcon /> },
    { id: 'paypal', name: 'PayPal', domain: 'paypal.com', color: '#003087', icon: <PayPalIcon /> },
    { id: 'dropbox', name: 'Dropbox', domain: 'dropbox.com', color: '#0061FF', icon: <DropboxIcon /> },
    { id: 'slack', name: 'Slack', domain: 'slack.com', color: '#4A154B', icon: <SlackIcon /> },
];

// Get service icon by ID
export function getServiceById(id: string): ServiceInfo | undefined {
    return POPULAR_SERVICES.find(s => s.id === id);
}

// Get service icon component by service ID
export function getServiceIcon(serviceId: string | undefined): React.ReactNode | null {
    if (!serviceId) return null;
    const service = getServiceById(serviceId);
    return service ? service.icon : null;
}
