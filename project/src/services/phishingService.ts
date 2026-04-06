export type DifficultyTier = 'cadet' | 'analyst' | 'operator';

export interface RedFlag {
    label: string;
    description: string;
}

export interface PhishingEmail {
    id: string;
    sender: string;
    senderEmail: string;
    subject: string;
    body: string;
    isPhishing: boolean;
    redFlags: RedFlag[];
    explanation: string;
    difficulty: DifficultyTier;
}

export const PHISHING_EMAILS: PhishingEmail[] = [
    // CADET (Level 1-3) — Obvious phishing
    {
        id: 'phish-cadet-1',
        sender: 'Free Gift Team',
        senderEmail: 'freegifts2024@yahoo.com',
        subject: '🎁 YOU WON A FREE iPHONE!!! CLICK NOW!!!',
        body: 'CONGRATULATIONS!!! You have been selected as our LUCKY WINNER! Click the link below RIGHT NOW to claim your FREE iPhone 15 Pro Max! This offer expires in 1 HOUR!!! Don\'t miss out!!!\n\n👉 CLAIM YOUR PRIZE NOW 👈\n\nHurry!!! Only 1 prize left!!!',
        isPhishing: true,
        redFlags: [
            { label: 'Suspicious Sender', description: 'Real companies don\'t use free email addresses like @yahoo.com for official communications.' },
            { label: 'Too Good to Be True', description: 'You didn\'t enter any contest! Free iPhone giveaways like this are always scams.' },
            { label: 'Urgency Tactics', description: '"Expires in 1 HOUR!!!" is designed to make you act without thinking.' },
            { label: 'Excessive Punctuation', description: 'Multiple exclamation marks and ALL CAPS are common in phishing emails.' },
        ],
        explanation: 'This email has ALL the classic signs of phishing! The sender uses a free email account, makes unbelievable claims, creates fake urgency, and uses excessive punctuation to seem exciting. Real companies never contact you this way.',
        difficulty: 'cadet',
    },
    {
        id: 'phish-cadet-2',
        sender: 'GameZone Support',
        senderEmail: 'support@gamez0ne-free.com',
        subject: 'Your Game Account Will Be DELETED Tomorrow!',
        body: 'Dear Player,\n\nWe noticed suspicious activity on your account. You must verify your account within 24 hours or it will be permanently DELETED!\n\nClick here to verify: http://gamez0ne-free.com/verify-now\n\nYour username: ________\nYour password: ________\n\nGameZone Support Team',
        isPhishing: true,
        redFlags: [
            { label: 'Fake Domain', description: '"gamez0ne-free.com" is not a real gaming company domain. Notice the "0" instead of "o" in "zone".' },
            { label: 'Asking for Password', description: 'Legitimate companies NEVER ask you to type your password in an email.' },
            { label: 'Threat of Deletion', description: 'Creating fear by threatening to delete your account is a common phishing tactic.' },
            { label: 'Unsecured Link', description: 'The link uses "http://" instead of "https://" — it\'s not encrypted.' },
        ],
        explanation: 'This phishing email tries to scare you into giving away your password. Notice the misspelled domain (gamez0ne with a zero!), the request for your password, and the threat to delete your account. Always go directly to the official website instead of clicking email links.',
        difficulty: 'cadet',
    },
    {
        id: 'phish-cadet-3',
        sender: 'Netflix Billing',
        senderEmail: 'netflix-billing@gmail.com',
        subject: 'Payment Failed — Update Now or Lose Access',
        body: 'Hello,\n\nYour Netflix payment of $15.99 was declined. Your account will be suspended in 48 hours.\n\nPlease update your payment information immediately by clicking the link below:\n\nhttp://netflix-update-billing.com/secure\n\nThank you,\nNetflix Customer Service',
        isPhishing: true,
        redFlags: [
            { label: 'Wrong Email Domain', description: 'Netflix would email from @netflix.com, NOT from a @gmail.com address.' },
            { label: 'Fake Website', description: '"netflix-update-billing.com" is NOT Netflix\'s real website. It\'s a fake site designed to steal your info.' },
            { label: 'Time Pressure', description: '"48 hours" creates urgency so you don\'t stop to think about whether this is real.' },
        ],
        explanation: 'Netflix would NEVER email you from a Gmail address. The fake website is designed to look like Netflix but will steal your credit card information. If you\'re worried about your account, go directly to netflix.com — never click links in emails.',
        difficulty: 'cadet',
    },
    {
        id: 'phish-cadet-4',
        sender: 'Amazon Security',
        senderEmail: 'amazon-security-alert@hotmail.com',
        subject: 'URGENT: Unusual Purchase of $999.99 Detected',
        body: 'Dear Valued Customer,\n\nWe detected an unusual purchase of $999.99 on your account.\n\nOrder #AMZ-99482\nItem: Apple MacBook Pro\n\nIf this was NOT you, click here to cancel: http://amazon-help-center.net/cancel-order\n\nIf you don\'t respond within 24 hours, your card will be charged.\n\nAmazon Security Team',
        isPhishing: true,
        redFlags: [
            { label: 'Suspicious Email', description: 'Amazon uses @amazon.com, not @hotmail.com. This is immediately suspicious.' },
            { label: 'Fake Order', description: 'There\'s no real order — the $999.99 amount is designed to panic you.' },
            { label: 'Fake Link', description: '"amazon-help-center.net" is not Amazon\'s website. It\'s a phishing site.' },
            { label: 'Urgency', description: 'The 24-hour deadline is meant to make you panic and click without thinking.' },
        ],
        explanation: 'This email uses fear (a $999.99 charge you didn\'t make) to make you click a fake link. The sender email is from Hotmail, not Amazon. Always check your orders by going directly to Amazon.com — never through email links.',
        difficulty: 'cadet',
    },
    {
        id: 'phish-cadet-5',
        sender: 'Roblox Admin',
        senderEmail: 'roblox-free-robux@outlook.com',
        subject: 'Get 10,000 FREE ROBUX! No Password Needed!',
        body: 'Hey Roblox Player!\n\nWe\'re giving away 10,000 FREE ROBUX to celebrate our 10th anniversary! 🎉\n\nJust click the link below and enter your Roblox username to receive your free Robux!\n\n👉 http://free-robux-generator.com/claim\n\nThis offer is only available TODAY! Share with your friends!\n\nRoblox Admin Team',
        isPhishing: true,
        redFlags: [
            { label: 'Fake Sender', description: 'Roblox would never use @outlook.com. Official emails come from @roblox.com.' },
            { label: 'Too Good to Be True', description: 'Free Robux generators don\'t exist. This is a scam to steal your account.' },
            { label: 'Asking for Username', description: 'Even just your username can be used to target your account with attacks.' },
            { label: 'Fake Link', description: '"free-robux-generator.com" is not affiliated with Roblox.' },
        ],
        explanation: 'Free Robux generators are ALWAYS scams. Roblox would never give away free Robux through random emails. This fake website will either steal your account or install malware on your device.',
        difficulty: 'cadet',
    },
    {
        id: 'phish-cadet-6',
        sender: 'School IT Department',
        senderEmail: 'it-support@myschool.edu',
        subject: 'Reminder: School WiFi Password Has Changed',
        body: 'Dear Students,\n\nThe school WiFi password has been updated for security reasons.\n\nNew WiFi Name: SchoolNetwork\nNew Password: Learn2024!\n\nThis password will work on all school devices.\n\nIT Support Team\nMySchool District',
        isPhishing: false,
        redFlags: [],
        explanation: 'This looks like a legitimate email from your school\'s IT department. The email comes from the official school domain (@myschool.edu), the message is clear and professional, and it doesn\'t ask you to click any suspicious links or provide personal information.',
        difficulty: 'cadet',
    },
    {
        id: 'phish-cadet-7',
        sender: 'Coach Mike',
        senderEmail: 'coach.mike@myschool.edu',
        subject: 'Soccer Practice Rescheduled to Thursday',
        body: 'Hi team,\n\nDue to field maintenance, soccer practice is moved to Thursday at 3:30 PM this week.\n\nPlease bring your water bottles and wear your practice uniforms.\n\nSee you on the field!\nCoach Mike',
        isPhishing: false,
        redFlags: [],
        explanation: 'This is a legitimate email from your coach. It comes from the official school email address, contains specific and relevant information, doesn\'t ask for any personal info, and doesn\'t include any suspicious links.',
        difficulty: 'cadet',
    },
    {
        id: 'phish-cadet-8',
        sender: 'Apple Support',
        senderEmail: 'apple-support-team@icloud-support.net',
        subject: 'Your Apple ID Has Been Locked — Action Required',
        body: 'Dear Apple User,\n\nYour Apple ID has been locked due to unusual activity.\n\nTo unlock your account, please verify your identity by clicking the link below:\n\nhttp://apple-id-verify.com/unlock\n\nYou will need to provide:\n- Apple ID email\n- Password\n- Security question answers\n\nApple Support',
        isPhishing: true,
        redFlags: [
            { label: 'Fake Domain', description: '"icloud-support.net" is NOT Apple\'s domain. Apple uses @apple.com or @icloud.com.' },
            { label: 'Asking for Sensitive Info', description: 'No legitimate company asks for your password AND security answers in one email.' },
            { label: 'Fake Verification Link', description: '"apple-id-verify.com" is a phishing site designed to steal your Apple ID.' },
        ],
        explanation: 'Apple will NEVER ask you to verify your password through an email link. The fake domain and request for multiple pieces of sensitive information are clear signs this is a phishing attempt.',
        difficulty: 'cadet',
    },

    // ANALYST (Level 4-6) — Moderate sophistication
    {
        id: 'phish-analyst-1',
        sender: 'Google Security',
        senderEmail: 'security@google-accounts-verify.com',
        subject: 'Sign-in attempt blocked — Review recent activity',
        body: 'Hello,\n\nWe blocked a sign-in attempt to your Google Account from an unrecognized device.\n\nDevice: Windows PC\nLocation: Moscow, Russia\nTime: Today at 2:47 AM\n\nIf this was you, click here to approve: http://google-accounts-verify.com/approve\n\nIf this wasn\'t you, your account may be compromised. Secure your account immediately.\n\nGoogle Security Team',
        isPhishing: true,
        redFlags: [
            { label: 'Spoofed Domain', description: '"google-accounts-verify.com" looks official but is NOT a Google domain. Google uses @google.com.' },
            { label: 'Scare Tactic', description: 'Using a foreign location (Moscow) and unusual time (2:47 AM) to create panic.' },
            { label: 'Fake Approval Link', description: 'The link goes to a phishing site, not Google. Real Google alerts direct you to myaccount.google.com.' },
        ],
        explanation: 'This is a sophisticated phishing email that mimics Google\'s real security alerts. The key giveaway is the sender domain — Google would never use "google-accounts-verify.com." Always go directly to myaccount.google.com to check security alerts.',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-2',
        sender: 'Microsoft Teams',
        senderEmail: 'noreply@microsoft.com',
        subject: 'You have a new voice message from Sarah Johnson',
        body: 'Hi there,\n\nSarah Johnson left you a voice message on Microsoft Teams.\n\nDuration: 2:34\nReceived: Today at 10:15 AM\n\n▶️ Play Message\n\nTo listen to this message, sign in to your Microsoft account.\n\nMicrosoft Teams',
        isPhishing: false,
        redFlags: [],
        explanation: 'This appears to be a legitimate notification from Microsoft Teams. The sender is from the official @microsoft.com domain, it doesn\'n\'t ask for sensitive information directly, and voice message notifications are a standard Teams feature. The "Play Message" button would link to the official Teams website.',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-3',
        sender: 'PayPal',
        senderEmail: 'service@paypa1.com',
        subject: 'You received a payment of $250.00',
        body: 'Hello,\n\nYou\'ve received a payment of $250.00 from David M.\n\nTransaction ID: PP-2847561\n\nTo view the full transaction details and release the funds to your account, please sign in to your PayPal account.\n\nView Transaction Details\n\nThank you for using PayPal.\nPayPal Customer Service',
        isPhishing: true,
        redFlags: [
            { label: 'Typosquatting Domain', description: 'The sender email is "paypa1.com" (with the number 1 instead of letter L). This is a classic typosquatting attack.' },
            { label: 'Fake Payment', description: 'The $250 payment is designed to excite you and make you click without checking the sender carefully.' },
            { label: 'Action Required', description: '"Release the funds" implies you need to take action, which creates urgency.' },
        ],
        explanation: 'This is a clever phishing email using typosquatting — replacing the letter "l" with the number "1" in PayPal. At a glance, "paypa1.com" looks like "paypal.com." Always check sender emails character by character!',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-4',
        sender: 'Spotify',
        senderEmail: 'no-reply@spotify.com',
        subject: 'Your Spotify Premium receipt',
        body: 'Hi there,\n\nThanks for your purchase! Here\'s your receipt for Spotify Premium.\n\nAmount: $10.99\nDate: April 2, 2025\nPlan: Premium Individual\n\nYou can view your full receipt and manage your subscription in your Spotify account settings.\n\nNeed help? Visit our Support page.\n\nSpotify',
        isPhishing: false,
        redFlags: [],
        explanation: 'This is a legitimate receipt email from Spotify. The sender uses the official @spotify.com domain, it contains standard receipt information, and doesn\'t ask you to click suspicious links or provide any personal information.',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-5',
        sender: 'Instagram',
        senderEmail: 'security@mail.instagram.com',
        subject: 'New login from Chrome on Windows',
        body: 'Hi @username,\n\nWe noticed a new login to your Instagram account.\n\nDevice: Chrome on Windows\nLocation: New York, United States\nTime: Just now\n\nIf this was you, you can ignore this email.\n\nIf you don\'t recognize this activity, please secure your account:\n\nSecure My Account\n\nInstagram Security Team',
        isPhishing: false,
        redFlags: [],
        explanation: 'This appears to be a legitimate security notification from Instagram. The sender domain "mail.instagram.com" is an official Instagram email subdomain. Login notifications are a standard security feature, and the email doesn\'t ask for passwords or sensitive information.',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-6',
        sender: 'Steam Support',
        senderEmail: 'support@steamcornmunity.com',
        subject: 'Action Required: Verify your Steam account ownership',
        body: 'Dear Steam User,\n\nWe\'ve detected unusual activity on your Steam account. To protect your account and game library, please verify your ownership.\n\nPlease provide the following information within 48 hours:\n\n• Steam username\n• Email associated with account\n• Last 4 digits of payment method\n• Date of account creation\n\nFailure to verify may result in account suspension.\n\nVerify Now\n\nSteam Support Team',
        isPhishing: true,
        redFlags: [
            { label: 'Misspelled Domain', description: '"steamcornmunity.com" has an extra "rn" making it look like "community" — but it\'s a fake domain.' },
            { label: 'Requesting Sensitive Info', description: 'Asking for payment method details and account info via email is a red flag.' },
            { label: 'Threat of Suspension', description: 'The 48-hour deadline and threat of suspension create false urgency.' },
        ],
        explanation: 'The domain "steamcornmunity.com" is a clever misspelling of "steamcommunity.com." Steam would never ask for payment details via email. This is a phishing attempt to steal your Steam account and payment information.',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-7',
        sender: 'Discord',
        senderEmail: 'noreply@discord.com',
        subject: 'Your Discord verification code',
        body: 'Here\'s your Discord verification code:\n\n847291\n\nThis code expires in 5 minutes.\n\nIf you didn\'t request this code, you can safely ignore this email.\n\nDiscord',
        isPhishing: false,
        redFlags: [],
        explanation: 'This is a legitimate verification code email from Discord. The sender is from the official @discord.com domain, it only contains a verification code (no links), and it tells you to ignore it if you didn\'t request it. This is standard two-factor authentication behavior.',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-8',
        sender: 'TikTok Support',
        senderEmail: 'tiktok-verify@hotmail.com',
        subject: 'Your TikTok account has been flagged for review',
        body: 'Dear TikTok User,\n\nYour account has been flagged for violating our Community Guidelines.\n\nYour account will be restricted within 24 hours unless you verify your identity.\n\nClick here to verify: http://tiktok-appeal.com/verify\n\nYou\'ll need to provide:\n• Full name\n• Date of birth\n• Phone number\n• Government ID photo\n\nTikTok Trust & Safety Team',
        isPhishing: true,
        redFlags: [
            { label: 'Unofficial Email', description: 'TikTok would use @tiktok.com, not @hotmail.com.' },
            { label: 'Excessive Info Request', description: 'Asking for government ID and personal info is a major red flag.' },
            { label: 'Fake Appeal Site', description: '"tiktok-appeal.com" is not TikTok\'s official domain.' },
            { label: 'Urgency', description: 'The 24-hour deadline is designed to make you panic and comply.' },
        ],
        explanation: 'This phishing email combines multiple tactics: an unofficial email address, a fake appeal website, requests for government ID, and a tight deadline. TikTok would never ask for your government ID via email.',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-9',
        sender: 'Zoom',
        senderEmail: 'no-reply@zoom.us',
        subject: 'Your meeting recording is ready',
        body: 'Hi,\n\nYour meeting recording from "Team Standup - April 2" is now available.\n\nMeeting ID: 847 2910 3847\nDuration: 32 minutes\nParticipants: 8\n\nYou can view and download your recording from the Zoom web portal.\n\nView Recording\n\nZoom Video Communications',
        isPhishing: false,
        redFlags: [],
        explanation: 'This is a legitimate notification from Zoom. The sender uses the official @zoom.us domain, it contains specific meeting details, and the link would direct you to the official Zoom web portal. Meeting recording notifications are a standard Zoom feature.',
        difficulty: 'analyst',
    },
    {
        id: 'phish-analyst-10',
        sender: 'WhatsApp',
        senderEmail: 'support@whatsappp.com',
        subject: 'Your WhatsApp account will be deactivated',
        body: 'Dear User,\n\nWe\'ve noticed unusual activity on your WhatsApp account. Your account will be deactivated in 24 hours.\n\nTo prevent deactivation, verify your account by clicking the link below:\n\nhttp://whatsapp-verify.net/confirm\n\nEnter your phone number and the 6-digit code sent to your phone.\n\nWhatsApp Security',
        isPhishing: true,
        redFlags: [
            { label: 'Misspelled Domain', description: '"whatsappp.com" has an extra "p" — it\'s not the real WhatsApp domain.' },
            { label: 'Asking for Verification Code', description: 'If you give them the 6-digit code, they can take over your WhatsApp account!' },
            { label: 'Fake Verification Site', description: '"whatsapp-verify.net" is not owned by WhatsApp.' },
        ],
        explanation: 'This is a dangerous phishing attempt targeting your WhatsApp account. If you enter the verification code on their fake site, they can hijack your account and impersonate you to all your contacts. WhatsApp would never ask for verification codes via email.',
        difficulty: 'analyst',
    },

    // OPERATOR (Level 7+) — Sophisticated attacks
    {
        id: 'phish-operator-1',
        sender: 'Google Workspace Admin',
        senderEmail: 'admin@googleworkspace-support.com',
        subject: 'Action Required: Your organization\'s Google Workspace subscription expires in 3 days',
        body: 'Dear Workspace Administrator,\n\nYour organization\'s Google Workspace subscription is set to expire on April 5, 2025.\n\nTo avoid service interruption and data loss, please renew your subscription by visiting the admin console:\n\nhttps://googleworkspace-support.com/admin/renew\n\nIf you do not renew by the expiration date, all user accounts and associated data will be suspended.\n\nFor billing questions, contact our support team.\n\nGoogle Workspace Billing Team',
        isPhishing: true,
        redFlags: [
            { label: 'Lookalike Domain', description: '"googleworkspace-support.com" mimics Google\'s branding but is NOT owned by Google.' },
            { label: 'Data Loss Threat', description: 'Threatening "data loss" targets an admin\'s biggest fear to create urgency.' },
            { label: 'Admin-Level Targeting', description: 'This is a targeted attack aimed at IT administrators who have access to entire organizations.' },
        ],
        explanation: 'This is a sophisticated business email compromise targeting IT administrators. The fake domain closely mimics Google\'s real services, and the threat of data loss is designed to bypass critical thinking. Always verify subscription status through the official admin.google.com console.',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-2',
        sender: 'Dr. Sarah Chen, Principal',
        senderEmail: 'principal@schooldistrict.org',
        subject: 'Urgent — Need your help with a confidential matter',
        body: 'Hi,\n\nI\'m in back-to-back meetings all day and can\'t take calls. I need you to do something important for me right away.\n\nI need to purchase 5 Apple gift cards ($100 each) for a student recognition program. The district office is processing reimbursements slowly, so I\'m asking you to handle this directly.\n\nPlease purchase the cards and send me the codes. I\'ll reimburse you by end of day.\n\nThis is confidential — please don\'t discuss with other staff members yet.\n\nThank you,\nDr. Sarah Chen\nPrincipal',
        isPhishing: true,
        redFlags: [
            { label: 'Authority Impersonation', description: 'The scammer is impersonating the principal to exploit your willingness to help authority figures.' },
            { label: 'Urgency + Secrecy', description: '"Can\'t take calls" and "confidential" prevent you from verifying the request.' },
            { label: 'Gift Card Request', description: 'Gift cards are the #1 payment method for scams because they\'re untraceable.' },
            { label: 'Domain Mismatch', description: 'Check if the principal\'s real email uses a different domain (like @myschool.edu vs @schooldistrict.org).' },
        ],
        explanation: 'This is a classic "CEO fraud" or "principal scam." The attacker impersonates authority, creates urgency, demands secrecy, and requests untraceable gift cards. Always verify unusual financial requests through a different communication channel (call or visit in person).',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-3',
        sender: 'GitHub',
        senderEmail: 'noreply@github.com',
        subject: '[GitHub] New sign-in from Chrome on macOS',
        body: 'Hey there!\n\nA new sign-in was made to your GitHub account.\n\nBrowser: Chrome on macOS\nLocation: San Francisco, CA, United States\nIP Address: 192.168.1.1\nTime: April 2, 2025 at 11:42 PM PDT\n\nIf this was you, no action is needed.\n\nIf you don\'t recognize this activity, please secure your account immediately.\n\nReview Security Activity\n\nGitHub Security Team',
        isPhishing: false,
        redFlags: [],
        explanation: 'This appears to be a legitimate security notification from GitHub. The sender is from the official @github.com domain, it provides specific details about the login (browser, location, IP, time), and doesn\'t ask for any sensitive information. The link would direct to github.com/settings/security.',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-4',
        sender: 'AWS Billing',
        senderEmail: 'aws-billing@amazon-aws-billing.com',
        subject: 'AWS Invoice Available — Account: ********4829',
        body: 'Hello,\n\nYour AWS invoice for the billing period March 1-31, 2025 is now available.\n\nAccount ID: 4829\nTotal Amount: $2,847.32\nDue Date: April 15, 2025\n\nView and download your invoice:\nhttps://amazon-aws-billing.com/invoice/4829\n\nIf you have questions about this invoice, contact AWS Support.\n\nAmazon Web Services\nBilling Department',
        isPhishing: true,
        redFlags: [
            { label: 'Fake AWS Domain', description: '"amazon-aws-billing.com" is not an Amazon domain. AWS uses @aws.amazon.com or @amazon.com.' },
            { label: 'High Amount', description: 'The $2,847.32 amount is designed to create concern and prompt immediate action.' },
            { label: 'Professional Formatting', description: 'This email is well-formatted and professional, making it harder to spot as phishing.' },
        ],
        explanation: 'This is a sophisticated phishing email targeting AWS users. The fake domain "amazon-aws-billing.com" looks legitimate at first glance. Always access AWS billing through the official AWS Console (console.aws.amazon.com), never through email links.',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-5',
        sender: 'LinkedIn',
        senderEmail: 'messages-noreply@linkedin.com',
        subject: 'You have a new message from Alex Rivera',
        body: 'Alex Rivera sent you a message:\n\n"Hey! I saw your profile and I\'m impressed with your background. I\'m recruiting for an exciting opportunity at a top tech company. Would you be open to a quick chat this week? I\'d love to share more details.\n\nLet me know what time works best for you!\n\nBest,\nAlex Rivera\nSenior Talent Acquisition"',
        isPhishing: false,
        redFlags: [],
        explanation: 'This appears to be a legitimate LinkedIn message notification. The sender domain "messages-noreply@linkedin.com" is LinkedIn\'s official messaging notification address. The message content is a standard recruiter outreach message. No suspicious links or requests for sensitive information.',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-6',
        sender: 'Dropbox',
        senderEmail: 'no-reply@dropboxmail.com',
        subject: 'John Doe shared "Q4_Financial_Report_Confidential.pdf" with you',
        body: 'Hi,\n\nJohn Doe (john.doe@company.com) has shared a file with you:\n\n📄 Q4_Financial_Report_Confidential.pdf (2.4 MB)\n\nThis file will expire in 7 days.\n\nOpen in Dropbox\n\nDropbox helps you share and collaborate on files securely.\n\nDropbox Team',
        isPhishing: true,
        redFlags: [
            { label: 'Lookalike Domain', description: '"dropboxmail.com" is NOT Dropbox\'s domain. Dropbox uses @dropbox.com or @email.dropbox.com.' },
            { label: 'Curiosity Bait', description: '"Confidential" financial reports are designed to make you curious and click without thinking.' },
            { label: 'False Urgency', description: 'The 7-day expiration creates urgency to open the file quickly.' },
        ],
        explanation: 'This phishing email uses a near-perfect domain impersonation and curiosity-driven file naming. "dropboxmail.com" sounds legitimate but is fake. The "confidential financial report" is designed to trigger your curiosity. Always check shared files through the official Dropbox website.',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-7',
        sender: 'Slack',
        senderEmail: 'feedback@slack.com',
        subject: 'Your weekly Slack summary',
        body: 'Here\'s your Slack activity summary for the week of March 31 - April 4:\n\n📊 Messages sent: 47\n📊 Messages received: 132\n📊 Active channels: 8\n📊 Top channel: #engineering (23 messages)\n\nYour most active day was Wednesday with 15 messages.\n\nKeep collaborating!\nThe Slack Team',
        isPhishing: false,
        redFlags: [],
        explanation: 'This is a legitimate weekly summary email from Slack. The sender uses the official @slack.com domain, it contains personalized activity statistics, and doesn\'t include any suspicious links or requests for information. Slack regularly sends these activity summaries.',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-8',
        sender: 'DocuSign',
        senderEmail: 'docusign@notification-docusign.com',
        subject: 'Please sign: Employment Agreement — [Your Name]',
        body: 'Hello,\n\nYou have a document waiting for your signature:\n\nDocument: Employment Agreement\nSender: hr@company.com\nSent: April 2, 2025\nExpires: April 9, 2025\n\nPlease review and sign this document at your earliest convenience.\n\nReview Document\n\nThank you,\nThe DocuSign Team',
        isPhishing: true,
        redFlags: [
            { label: 'Fake Domain', description: '"notification-docusign.com" is NOT DocuSign\'s domain. DocuSign uses @docusign.net or @docusign.com.' },
            { label: 'Employment Bait', description: 'An "Employment Agreement" is designed to create excitement and urgency to review it.' },
            { label: 'Deadline Pressure', description: 'The 7-day expiration creates a sense of urgency to act quickly.' },
        ],
        explanation: 'This phishing email impersonates DocuSign to trick you into signing a fake document. The fake domain "notification-docusign.com" mimics the real service. Always access documents through the official DocuSign website, never through email links.',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-9',
        sender: 'Cloudflare',
        senderEmail: 'support@cloudflare.com',
        subject: 'Cloudflare Security Alert: SSL Certificate Expiring Soon',
        body: 'Hello,\n\nYour SSL/TLS certificate for example.com is set to expire in 7 days (April 9, 2025).\n\nTo prevent service disruption, please renew your certificate through the Cloudflare dashboard.\n\nCertificate Details:\n• Domain: example.com\n• Type: Universal SSL\n• Expires: April 9, 2025\n• Status: Active\n\nManage Certificate\n\nCloudflare Support',
        isPhishing: false,
        redFlags: [],
        explanation: 'This appears to be a legitimate SSL certificate notification from Cloudflare. The sender uses the official @cloudflare.com domain, it contains specific certificate details, and SSL expiration warnings are a standard Cloudflare service. The link would direct to the official Cloudflare dashboard.',
        difficulty: 'operator',
    },
    {
        id: 'phish-operator-10',
        sender: 'Microsoft 365 Admin',
        senderEmail: 'microsoft365-noreply@microsoftonline-support.com',
        subject: 'Microsoft 365 License Renewal — Action Required by April 5',
        body: 'Dear Microsoft 365 Administrator,\n\nYour organization\'s Microsoft 365 Business Premium licenses are set to expire on April 5, 2025.\n\nTo ensure uninterrupted access to Exchange Online, SharePoint, Teams, and all Microsoft 365 services, please renew your licenses before the expiration date.\n\nRenew Licenses Now\n\nFailure to renew will result in:\n• Email service suspension\n• Loss of access to SharePoint files\n• Teams communication disruption\n• OneDrive data unavailability\n\nMicrosoft 365 Billing Team',
        isPhishing: true,
        redFlags: [
            { label: 'Fake Microsoft Domain', description: '"microsoftonline-support.com" is NOT a Microsoft domain. Microsoft uses @microsoft.com or @notification.office.com.' },
            { label: 'Catastrophic Threats', description: 'Listing all the services that will "fail" is designed to create maximum panic.' },
            { label: 'Admin Targeting', description: 'This targets IT administrators who have the power to make billing decisions.' },
            { label: 'Tight Deadline', description: 'The April 5 deadline (just 3 days away) creates urgency.' },
        ],
        explanation: 'This is a sophisticated business-targeted phishing email. The fake domain closely mimics Microsoft\'s branding, and the list of catastrophic consequences is designed to bypass rational thinking. Always check license status through the official Microsoft 365 admin center (admin.microsoft.com).',
        difficulty: 'operator',
    },
];

export function getEmailsForTier(tier: DifficultyTier, count: number = 5): PhishingEmail[] {
    const tierEmails = PHISHING_EMAILS.filter(e => e.difficulty === tier);
    const shuffled = [...tierEmails].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getTierForLevel(level: number): DifficultyTier {
    if (level <= 3) return 'cadet';
    if (level <= 6) return 'analyst';
    return 'operator';
}

export function calculatePhishingXp(correctCalls: number, streak: number, totalEmails: number): { baseXp: number; streakBonus: number; completionBonus: number; totalXp: number } {
    const baseXp = correctCalls * 3;
    const streakBonus = streak > 1 ? (streak - 1) * 1 : 0;
    const completionBonus = correctCalls === totalEmails ? 10 : correctCalls >= 3 ? 5 : 0;
    const totalXp = baseXp + streakBonus + completionBonus;
    
    return { baseXp, streakBonus, completionBonus, totalXp };
}
