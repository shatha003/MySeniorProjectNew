import i18n from 'i18next';

export type DifficultyTier = 'cadet' | 'analyst' | 'operator';

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    difficulty: DifficultyTier;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    // CADET (Level 1-3) — Basic concepts
    {
        id: 'cadet-1',
        question: 'What makes a password STRONG?',
        options: [
            'Using your name and birthday',
            'A mix of letters, numbers, and symbols',
            'The word "password" spelled backwards',
            'Just numbers like 123456',
        ],
        correctIndex: 1,
        explanation: 'Strong passwords mix uppercase letters, lowercase letters, numbers, and special symbols. The more random, the harder to guess!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-2',
        question: 'A stranger online asks for your home address to send you a "free gift." What should you do?',
        options: [
            'Give them your address — it\'s exciting!',
            'Ask your parents first',
            'Never share personal info — say no and tell a trusted adult',
            'Give a fake address',
        ],
        correctIndex: 2,
        explanation: 'Never share personal information like your address with strangers online. Always tell a trusted adult if someone asks for your info!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-3',
        question: 'What is "phishing"?',
        options: [
            'A type of fishing game',
            'When someone tries to trick you into sharing private info online',
            'A computer virus that deletes files',
            'A way to download free games',
        ],
        correctIndex: 1,
        explanation: 'Phishing is when bad actors pretend to be someone you trust to trick you into giving them passwords, money, or personal info!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-4',
        question: 'You get a message saying "You won $1000! Click here to claim!" What do you do?',
        options: [
            'Click the link right away!',
            'Share it with all your friends',
            'Ignore it — if it sounds too good to be true, it probably is!',
            'Reply with your bank info',
        ],
        correctIndex: 2,
        explanation: 'Scammers use "too good to be true" offers to trick people. Real contests don\'t ask you to click random links to claim prizes!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-5',
        question: 'Which of these is the SAFEST website to visit?',
        options: [
            'One with "http://" at the start',
            'One with "https://" and a lock icon',
            'One that looks really cool',
            'One your friend sent you without checking',
        ],
        correctIndex: 1,
        explanation: 'The "https://" and lock icon mean the website uses encryption to protect your data. Always look for these before entering any info!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-6',
        question: 'What should you do if a pop-up says "Your computer has a virus! Call now!"?',
        options: [
            'Call the number immediately',
            'Close the pop-up — it\'s a scam!',
            'Click the pop-up to learn more',
            'Restart your computer',
        ],
        correctIndex: 1,
        explanation: 'These pop-ups are fake! They try to scare you into calling scammers. Just close the tab or browser window.',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-7',
        question: 'Why shouldn\'t you use the same password for everything?',
        options: [
            'It\'s boring',
            'If one account gets hacked, ALL your accounts are at risk',
            'Your computer will run slower',
            'Websites will block you',
        ],
        correctIndex: 1,
        explanation: 'Using the same password everywhere is like using one key for your house, car, and school locker. If someone gets that key, they can access everything!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-8',
        question: 'What is two-factor authentication (2FA)?',
        options: [
            'Having two passwords',
            'An extra security step — like a code sent to your phone — after entering your password',
            'Using two different browsers',
            'Logging in twice',
        ],
        correctIndex: 1,
        explanation: '2FA adds an extra layer of security. Even if someone steals your password, they still need the second factor (like a code on your phone) to get in!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-9',
        question: 'Someone you don\'t know sends you a friend request. Should you accept?',
        options: [
            'Yes — more friends is always better!',
            'Only if they have a cool profile picture',
            'No — only accept requests from people you know in real life',
            'Accept and then block them',
        ],
        correctIndex: 2,
        explanation: 'Only accept friend requests from people you actually know. Strangers might use your personal posts and photos in harmful ways!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-10',
        question: 'What is "cyberbullying"?',
        options: [
            'Playing video games with friends',
            'Using technology to hurt, embarrass, or threaten someone',
            'A type of computer game',
            'When your internet is slow',
        ],
        correctIndex: 1,
        explanation: 'Cyberbullying is using phones, computers, or social media to hurt someone. If it happens to you, tell a trusted adult and don\'t respond!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-11',
        question: 'Your friend asks to borrow your password to check something quick. What do you say?',
        options: [
            'Sure, friends share everything!',
            'No — never share your password with anyone, even friends',
            'Only if they promise to keep it secret',
            'Change it after they use it',
        ],
        correctIndex: 1,
        explanation: 'Never share your password with anyone — not even your best friend! You never know who might see it or what could happen.',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-12',
        question: 'What does it mean to "log out" of an account?',
        options: [
            'Delete your account forever',
            'End your session so others can\'t access your account on that device',
            'Turn off your computer',
            'Change your password',
        ],
        correctIndex: 1,
        explanation: 'Logging out ends your session and prevents others who use the same device from accessing your account. Always log out on shared computers!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-13',
        question: 'A website asks for your phone number to "verify your age." What should you do?',
        options: [
            'Give them your real number',
            'Ask a parent or guardian before sharing any personal info',
            'Make up a random number',
            'Give your friend\'s number instead',
        ],
        correctIndex: 1,
        explanation: 'Always check with a parent or guardian before sharing personal information like your phone number online. They can help you decide if it\'s safe!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-14',
        question: 'What is a "digital footprint"?',
        options: [
            'The tracks your computer makes',
            'The trail of information you leave behind when you use the internet',
            'A type of computer virus',
            'Your computer\'s battery life',
        ],
        correctIndex: 1,
        explanation: 'Everything you do online — posts, comments, searches — leaves a digital footprint. Think before you post because it can stay online forever!',
        difficulty: 'cadet',
    },
    {
        id: 'cadet-15',
        question: 'You see a mean comment about a classmate on social media. What should you do?',
        options: [
            'Leave your own mean comment',
            'Share it with everyone',
            'Report it and don\'t engage — tell a trusted adult',
            'Screenshot it and laugh',
        ],
        correctIndex: 2,
        explanation: 'Don\'t make the situation worse by engaging. Report the comment, support your classmate, and tell a trusted adult about cyberbullying!',
        difficulty: 'cadet',
    },

    // ANALYST (Level 4-6) — Scenario-based
    {
        id: 'analyst-1',
        question: 'You get an email from "Netflix" saying your payment failed and asking you to click a link to update billing. The sender is "support@netflix-help.com". What do you do?',
        options: [
            'Click the link and update your info',
            'Forward it to your parents',
            'It\'s phishing — the real Netflix domain is netflix.com, not netflix-help.com',
            'Reply asking for more details',
        ],
        correctIndex: 2,
        explanation: 'Check the sender\'s email carefully! "netflix-help.com" is NOT Netflix\'s real domain. Scammers use similar-looking domains to trick you. Always go directly to the official website instead.',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-2',
        question: 'Your gaming buddy sends you a link saying "Check out this FREE skin hack!" What\'s the safest move?',
        options: [
            'Click it — your buddy wouldn\'t prank you',
            'Ask your buddy how they found it and if they tried it first',
            'Ignore "free hack" links — they often contain malware or steal accounts',
            'Open it in a private window',
        ],
        correctIndex: 2,
        explanation: '"Free hack" links are almost always scams. They can steal your account, install malware, or trick you into downloading bad software. Your buddy\'s account might even be hacked!',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-3',
        question: 'A quiz on social media asks "What\'s your first pet\'s name? What school did you go to?" Why might this be risky?',
        options: [
            'It\'s just a fun quiz — no risk',
            'These answers are often used as security questions for accounts',
            'The quiz might be boring',
            'It uses too much data',
        ],
        correctIndex: 1,
        explanation: 'Many security questions use info like "first pet" or "school name." Scammers create fake quizzes to collect this info and use it to break into your accounts!',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-4',
        question: 'You download a game from a website that isn\'t the official store. Your antivirus warns you about the file. What should you do?',
        options: [
            'Turn off the antivirus and install it',
            'Delete the file — unofficial downloads often contain malware',
            'Install it anyway — the antivirus is wrong',
            'Ask a friend if they downloaded it',
        ],
        correctIndex: 1,
        explanation: 'If your antivirus warns you, listen to it! Unofficial game downloads often hide malware, ransomware, or spyware. Only download from official, trusted sources.',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-5',
        question: 'You receive a DM on Instagram: "Hey! I reported your account by mistake. Click here to appeal or your account will be deleted in 24 hours!" What\'s happening?',
        options: [
            'Your account is really in danger',
            'It\'s a scam using urgency and fear to make you click a fake link',
            'Instagram actually sends messages like this',
            'Click the link to save your account',
        ],
        correctIndex: 1,
        explanation: 'This is a classic phishing tactic! Scammers create urgency ("24 hours!") and fear ("account deleted!") to make you act without thinking. Instagram doesn\'t DM you about account issues.',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-6',
        question: 'A website offers a "free iPhone" if you complete a survey and share it with 10 friends. What\'s the catch?',
        options: [
            'There\'s no catch — it\'s a real giveaway',
            'It\'s a scam to collect your personal data and spread the scam to your friends',
            'You might get a phone case instead',
            'It takes longer than expected',
        ],
        correctIndex: 1,
        explanation: 'These "free" offers are designed to harvest your personal info and use your social network to spread the scam. If it requires sharing with friends, it\'s almost certainly fake!',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-7',
        question: 'You notice a strange app on your phone that you don\'t remember installing. It has permission to access your contacts and camera. What should you do?',
        options: [
            'Ignore it — it\'s probably a system app',
            'Uninstall it immediately and run a security scan',
            'Give it more permissions to see what it does',
            'Ask the app what it does',
        ],
        correctIndex: 1,
        explanation: 'Unknown apps with access to contacts and camera are a major red flag. Uninstall immediately, run a security scan, and change your passwords as a precaution.',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-8',
        question: 'Your teacher asks the class to share passwords for a "class project." What should you do?',
        options: [
            'Share your password — the teacher asked for it',
            'Politely explain that you should never share passwords, even with teachers',
            'Give a fake password',
            'Change your password after sharing',
        ],
        correctIndex: 1,
        explanation: 'No legitimate teacher or authority figure should ever ask for your password. It\'s okay to politely refuse and explain that sharing passwords is a security risk.',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-9',
        question: 'You find a USB drive in the school parking lot. What should you do?',
        options: [
            'Plug it into your computer to find the owner',
            'Give it to a teacher or IT staff — never plug in unknown USB drives',
            'Throw it away',
            'Plug it into your phone instead',
        ],
        correctIndex: 1,
        explanation: 'Unknown USB drives can contain malware that automatically installs when plugged in. This is a real attack method called "USB drop attacks." Hand it to IT staff instead!',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-10',
        question: 'A friend\'s account sends you a weird message with a link. Their message seems out of character. What likely happened?',
        options: [
            'Your friend is just being weird',
            'Their account was probably hacked — don\'t click the link and tell them',
            'It\'s a new trend',
            'They\'re testing you',
        ],
        correctIndex: 1,
        explanation: 'When an account sends unusual messages with links, it often means the account was compromised. Don\'t click the link, and let your friend know through another method (like texting them).',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-11',
        question: 'You want to connect to WiFi at a coffee shop. You see "FreeWiFi" and "FreeWiFi-Official." Which should you choose?',
        options: [
            'Either one — they\'re the same',
            'Ask a staff member which is the real network',
            'FreeWiFi — it\'s simpler',
            'Don\'t use any WiFi at all',
        ],
        correctIndex: 1,
        explanation: 'Fake WiFi networks with similar names are a real threat. Hackers can intercept your data on fake networks. Always ask staff for the correct network name!',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-12',
        question: 'An app asks for permission to access your location, contacts, and microphone. You only need it for reading news. What should you do?',
        options: [
            'Grant all permissions — the app needs them',
            'Deny unnecessary permissions or find a different app',
            'Grant them but don\'t use those features',
            'Uninstall the app immediately',
        ],
        correctIndex: 1,
        explanation: 'Apps should only request permissions they need. A news app doesn\'t need your location, contacts, or microphone. Deny unnecessary permissions or find a more privacy-respecting alternative.',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-13',
        question: 'You see a post claiming "Scientists discovered that vaccines cause microchips!" with no sources. What should you do?',
        options: [
            'Share it — it\'s important news',
            'Check reliable sources before believing or sharing — it\'s likely misinformation',
            'Comment asking for proof',
            'Save it for later',
        ],
        correctIndex: 1,
        explanation: 'Always verify claims with reliable, trusted sources before believing or sharing them. Misinformation spreads fast online, and checking facts is an important cybersecurity skill!',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-14',
        question: 'A website says "Download our browser extension for faster browsing!" but it\'s not from a well-known company. What\'s the risk?',
        options: [
            'No risk — extensions are always safe',
            'Browser extensions can read everything on your screen, including passwords and messages',
            'It might slow down your browser',
            'It could use too much memory',
        ],
        correctIndex: 1,
        explanation: 'Browser extensions can have access to everything you see and type in your browser. Only install extensions from trusted, well-known companies and check their permissions carefully!',
        difficulty: 'analyst',
    },
    {
        id: 'analyst-15',
        question: 'You get a text: "Your package delivery failed. Click to reschedule: bit.ly/3xK9mP." What\'s suspicious?',
        options: [
            'Nothing — packages get delayed all the time',
            'The shortened URL hides the real destination — it could be a phishing link',
            'The message is too short',
            'It came as a text instead of email',
        ],
        correctIndex: 1,
        explanation: 'Shortened URLs (like bit.ly) hide where the link actually goes. Scammers use them to disguise phishing sites. Instead, go directly to the delivery company\'s official website to check.',
        difficulty: 'analyst',
    },

    // OPERATOR (Level 7+) — Advanced scenarios
    {
        id: 'operator-1',
        question: 'You receive an email that looks EXACTLY like it\'s from your bank. The logo, colors, and layout are perfect. But the link goes to "bankofamerica-secure.com" instead of "bankofamerica.com." What type of attack is this?',
        options: [
            'A normal email from the bank',
            'A sophisticated phishing attack using a lookalike domain',
            'A harmless marketing email',
            'A software update notification',
        ],
        correctIndex: 1,
        explanation: 'This is a sophisticated phishing attack! Scammers create near-perfect copies of real websites using similar domain names. Always check the URL carefully — even one extra word or hyphen means it\'s fake!',
        difficulty: 'operator',
    },
    {
        id: 'operator-2',
        question: 'A website you use regularly announces they were "breached" and your data may be exposed. What should you do FIRST?',
        options: [
            'Delete your account immediately',
            'Change your password on that site AND any other site where you used the same password',
            'Ignore it — they probably fixed it',
            'Post about it on social media',
        ],
        correctIndex: 1,
        explanation: 'When a breach happens, change your password on that site immediately. If you reused that password anywhere else, change those too! Consider using a password manager to create unique passwords.',
        difficulty: 'operator',
    },
    {
        id: 'operator-3',
        question: 'You notice a website\'s SSL certificate has expired (the lock icon shows a warning). What does this mean?',
        options: [
            'Nothing — it\'s just a minor issue',
            'The connection may not be secure — avoid entering any personal information',
            'The website is definitely a scam',
            'The website is under maintenance',
        ],
        correctIndex: 1,
        explanation: 'An expired SSL certificate means the encrypted connection can\'t be verified. While the site might not be a scam, you shouldn\'t enter sensitive data until the certificate is renewed.',
        difficulty: 'operator',
    },
    {
        id: 'operator-4',
        question: 'Someone creates a social media profile using YOUR name and photos, then messages your friends asking for money. What type of attack is this?',
        options: [
            'Phishing',
            'Identity theft and impersonation',
            'A harmless prank',
            'A software bug',
        ],
        correctIndex: 1,
        explanation: 'This is identity theft through impersonation. The scammer is using your identity to exploit your friends\' trust. Report the fake profile immediately and warn your friends through another channel.',
        difficulty: 'operator',
    },
    {
        id: 'operator-5',
        question: 'A "tech support" caller says they detected viruses on your computer and needs remote access to fix it. They sound professional and know your name. What do you do?',
        options: [
            'Give them remote access — they\'re professionals',
            'Hang up — legitimate companies never call unsolicited about viruses',
            'Ask for their employee ID first',
            'Let them access but watch what they do',
        ],
        correctIndex: 1,
        explanation: 'Legitimate tech companies NEVER call you unsolicited about viruses. This is a common scam where criminals gain remote access to steal data, install malware, or demand payment.',
        difficulty: 'operator',
    },
    {
        id: 'operator-6',
        question: 'You find your email address on a "have I been pwned" breach database. What does this mean?',
        options: [
            'Your computer has a virus',
            'Your email was involved in a known data breach',
            'Someone hacked your email account',
            'Your email was deleted',
        ],
        correctIndex: 1,
        explanation: '"Pwned" means your email appeared in a known data breach. It doesn\'t mean your account was directly hacked, but your info may be exposed. Change passwords and enable 2FA on affected accounts.',
        difficulty: 'operator',
    },
    {
        id: 'operator-7',
        question: 'A QR code on a parking meter says "Scan to pay." But someone stuck their own QR code sticker over the real one. What type of attack is this?',
        options: [
            'A normal payment system',
            'Quishing — QR code phishing that redirects you to a fake payment site',
            'A government tax collection',
            'A software update',
        ],
        correctIndex: 1,
        explanation: '"Quishing" is QR code phishing. Scammers place fake QR codes in public places that redirect to malicious websites. Always verify QR codes in public spaces before scanning!',
        difficulty: 'operator',
    },
    {
        id: 'operator-8',
        question: 'You receive an email from your "principal" asking you to urgently buy gift cards for a school event. The email address is "principal@school-district.org" but your school uses "school.edu." What\'s wrong?',
        options: [
            'Nothing — schools use different domains',
            'It\'s CEO fraud — a scammer impersonating authority using a similar domain',
            'The principal changed email providers',
            'It\'s a legitimate emergency request',
        ],
        correctIndex: 1,
        explanation: 'This is "CEO fraud" or "business email compromise." Scammers impersonate authority figures and create urgency to bypass your critical thinking. Always verify unusual requests through a different communication channel!',
        difficulty: 'operator',
    },
    {
        id: 'operator-9',
        question: 'An app you installed asks to be your phone\'s "accessibility service" to "improve your experience." Why is this dangerous?',
        options: [
            'It\'s not dangerous — accessibility features are helpful',
            'Accessibility services can read your screen, log keystrokes, and access all your data',
            'It will drain your battery',
            'It will use your data plan',
        ],
        correctIndex: 1,
        explanation: 'Accessibility services are powerful permissions that can read everything on your screen, including passwords and messages. Malicious apps abuse this to become keyloggers and spyware!',
        difficulty: 'operator',
    },
    {
        id: 'operator-10',
        question: 'You connect to a "free" public WiFi and visit your bank\'s website. The URL shows "https://" but the certificate is self-signed. What\'s the risk?',
        options: [
            'No risk — https means it\'s safe',
            'A man-in-the-middle attack could intercept your data on the public network',
            'The website will load slowly',
            'Your bank account will be frozen',
        ],
        correctIndex: 1,
        explanation: 'On public WiFi, attackers can position themselves between you and the website. A self-signed certificate means the connection can\'t be properly verified. Avoid sensitive transactions on public networks!',
        difficulty: 'operator',
    },
    {
        id: 'operator-11',
        question: 'A friend shows you a website that clones popular login pages to "test your password strength." It asks you to type your real password to "check" it. What\'s happening?',
        options: [
            'It\'s a legitimate security tool',
            'It\'s a credential harvesting site — it steals whatever password you type',
            'It encrypts your password',
            'It creates a backup of your password',
        ],
        correctIndex: 1,
        explanation: 'Any site asking you to type your real password is stealing it! Legitimate password checkers NEVER ask for your actual password. They analyze password patterns without needing the real thing.',
        difficulty: 'operator',
    },
    {
        id: 'operator-12',
        question: 'You get a notification: "New login to your account from Russia. Click here to secure your account." The link goes to the real login page. Is this safe?',
        options: [
            'Yes — the link goes to the real site',
            'No — the notification itself might be fake to create panic and get you to change your password on a fake page',
            'Yes — it\'s a helpful alert',
            'Only if you\'re not in Russia',
        ],
        correctIndex: 1,
        explanation: 'Even if the link looks real, the notification itself could be fake. Scammers create fake security alerts to panic you into action. Always go directly to the official website yourself — never through links in alerts!',
        difficulty: 'operator',
    },
    {
        id: 'operator-13',
        question: 'A game mod website requires you to "disable your antivirus" before installing. What does this tell you?',
        options: [
            'The mod is just powerful',
            'The file likely contains malware that antivirus would detect',
            'The antivirus is too sensitive',
            'It\'s a common requirement for mods',
        ],
        correctIndex: 1,
        explanation: 'Any request to disable your antivirus is a massive red flag. Legitimate software never requires this. The file almost certainly contains malware that your antivirus correctly identified!',
        difficulty: 'operator',
    },
    {
        id: 'operator-14',
        question: 'You notice a smart TV app is requesting access to your home network, microphone, and viewing history. What privacy concern does this raise?',
        options: [
            'None — smart TVs need all these permissions',
            'The app could profile your behavior, listen to conversations, and access other devices on your network',
            'It will just show better ads',
            'It will improve the picture quality',
        ],
        correctIndex: 1,
        explanation: 'Smart device apps can collect extensive data about you. Network access lets them see other devices, microphones can listen in, and viewing history creates detailed profiles. Only grant permissions that are truly necessary!',
        difficulty: 'operator',
    },
    {
        id: 'operator-15',
        question: 'A website uses "zero-day exploit" to install software on your computer without you clicking anything. How is this possible?',
        options: [
            'It\'s not possible — you always have to click something',
            'A zero-day exploit targets an unknown vulnerability in your browser or software',
            'Your computer is haunted',
            'The website guessed your password',
        ],
        correctIndex: 1,
        explanation: 'A "zero-day" is a previously unknown security flaw that hackers exploit before developers can fix it. These "drive-by downloads" can infect your computer just by visiting a malicious page. Keep your software updated!',
        difficulty: 'operator',
    },
];

function getTranslatedQuestion(question: QuizQuestion): QuizQuestion {
    const lang = i18n.language || 'en';
    if (lang === 'en') return question;

    const translation = i18n.t(`questions.${question.id}`, { returnObjects: true, ns: 'quiz' }) as any;
    if (!translation || !translation.question) return question;

    return {
        ...question,
        question: translation.question || question.question,
        options: translation.options || question.options,
        explanation: translation.explanation || question.explanation,
    };
}

export function getQuestionsForTier(tier: DifficultyTier, count: number = 5): QuizQuestion[] {
    const tierQuestions = QUIZ_QUESTIONS.filter(q => q.difficulty === tier);
    const translatedQuestions = tierQuestions.map(getTranslatedQuestion);
    const shuffled = [...translatedQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getTierForLevel(level: number): DifficultyTier {
    if (level <= 3) return 'cadet';
    if (level <= 6) return 'analyst';
    return 'operator';
}

export function calculateQuizXp(correctAnswers: number, streak: number, totalQuestions: number): { baseXp: number; streakBonus: number; completionBonus: number; totalXp: number } {
    const baseXp = correctAnswers * 3;
    const streakBonus = streak > 1 ? (streak - 1) * 1 : 0;
    const completionBonus = correctAnswers === totalQuestions ? 10 : correctAnswers >= 3 ? 5 : 0;
    const totalXp = baseXp + streakBonus + completionBonus;
    
    return { baseXp, streakBonus, completionBonus, totalXp };
}
