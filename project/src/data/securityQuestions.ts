export interface SecurityQuestion {
    question: string;
    options: string[];
    scores: number[];
    category: string;
}

export const securityQuestions: SecurityQuestion[] = [
    {
        question: "How do you manage your passwords?",
        options: [
            "I use the same password for most accounts",
            "I have 2-3 different passwords I rotate",
            "I use unique passwords for important accounts",
            "I use a password manager for all accounts",
        ],
        scores: [0, 1, 2, 3],
        category: "Password Hygiene",
    },
    {
        question: "How often do you change your passwords?",
        options: [
            "Never, unless forced to",
            "Only when I suspect a breach",
            "Every 6-12 months for important accounts",
            "Regularly, following a security schedule",
        ],
        scores: [0, 1, 2, 3],
        category: "Password Hygiene",
    },
    {
        question: "Do you use two-factor authentication (2FA)?",
        options: [
            "What's 2FA?",
            "No, it's too inconvenient",
            "Yes, on my email and banking",
            "Yes, on all accounts that support it",
        ],
        scores: [0, 1, 2, 3],
        category: "Password Hygiene",
    },
    {
        question: "When you connect to public WiFi, you...",
        options: [
            "Connect and browse freely",
            "Avoid accessing sensitive accounts",
            "Use a VPN for all activities",
            "I never use public WiFi",
        ],
        scores: [0, 1, 2, 3],
        category: "Network Safety",
    },
    {
        question: "How do you handle software updates?",
        options: [
            "I ignore them as long as possible",
            "I update when I remember",
            "I update within a week of notification",
            "I enable automatic updates",
        ],
        scores: [0, 1, 2, 3],
        category: "Network Safety",
    },
    {
        question: "Your home WiFi security is...",
        options: [
            "Open/No password or WEP",
            "WPA with a simple password",
            "WPA2 with a decent password",
            "WPA3 with a strong unique password",
        ],
        scores: [0, 1, 2, 3],
        category: "Network Safety",
    },
    {
        question: "How do you handle your social media privacy?",
        options: [
            "Everything is public",
            "Some posts are private",
            "Only friends can see my content",
            "Locked down with limited personal info",
        ],
        scores: [0, 1, 2, 3],
        category: "Data Privacy",
    },
    {
        question: "When an app asks for permissions, you...",
        options: [
            "Accept all without reading",
            "Glance and usually accept",
            "Read carefully and deny suspicious ones",
            "Review each permission and minimize access",
        ],
        scores: [0, 1, 2, 3],
        category: "Data Privacy",
    },
    {
        question: "How do you dispose of old devices?",
        options: [
            "Throw them in the trash",
            "Donate without wiping",
            "Factory reset before disposing",
            "Full wipe + physical destruction of storage",
        ],
        scores: [0, 1, 2, 3],
        category: "Data Privacy",
    },
    {
        question: "How do you handle unexpected emails with links?",
        options: [
            "Click if it looks interesting",
            "Click if it seems from a known sender",
            "Hover to check the URL first",
            "Verify through a separate channel before clicking",
        ],
        scores: [0, 1, 2, 3],
        category: "Social Engineering",
    },
    {
        question: "When someone calls claiming to be from your bank...",
        options: [
            "I give them whatever info they need",
            "I answer their questions cautiously",
            "I ask for a callback number to verify",
            "I hang up and call the bank directly",
        ],
        scores: [0, 1, 2, 3],
        category: "Social Engineering",
    },
    {
        question: "You find a USB drive in the parking lot. You...",
        options: [
            "Plug it in to find the owner",
            "Plug it into a non-work computer",
            "Give it to IT/security department",
            "Leave it or dispose of it safely",
        ],
        scores: [0, 1, 3, 3],
        category: "Social Engineering",
    },
    {
        question: "How do you share sensitive information with colleagues?",
        options: [
            "Regular email or messaging apps",
            "Password-protected files via email",
            "Company-approved encrypted channels",
            "End-to-end encrypted tools only",
        ],
        scores: [0, 1, 2, 3],
        category: "Data Privacy",
    },
    {
        question: "How do you back up your important data?",
        options: [
            "I don't back up",
            "Occasionally copy to a USB drive",
            "Regular backups to cloud storage",
            "Automated 3-2-1 backup strategy",
        ],
        scores: [0, 1, 2, 3],
        category: "Network Safety",
    },
    {
        question: "How do you verify if a website is secure before entering data?",
        options: [
            "I don't check, just enter my info",
            "I look for the padlock icon",
            "I check for HTTPS and padlock",
            "I verify the full URL, HTTPS, and certificate",
        ],
        scores: [0, 1, 2, 3],
        category: "Data Privacy",
    },
];