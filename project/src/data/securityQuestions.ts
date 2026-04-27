export interface SecurityQuestion {
    question: string;
    options: string[];
    scores: number[];
    category: string;
}

export const securityQuestionsEN: SecurityQuestion[] = [
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

export const securityQuestionsAR: SecurityQuestion[] = [
    {
        question: "كيف تدير كلمات مرورك؟",
        options: [
            "أستخدم نفس كلمة المرور لمعظم الحسابات",
            "لدي 2-3 كلمات مرور أتنقل بينها",
            "أستخدم كلمات مرور فريدة للحسابات المهمة",
            "أستخدم مدير كلمات مرور لجميع حساباتي",
        ],
        scores: [0, 1, 2, 3],
        category: "نظافة كلمات المرور",
    },
    {
        question: "كم مرة تغير كلمات مرورك؟",
        options: [
            "أبداً، إلا إذا أُجبرت على ذلك",
            "فقط عندما أشتبه بخرق أمني",
            "كل 6-12 شهراً للحسابات المهمة",
            "بانتظام وفقاً لجدول أمني",
        ],
        scores: [0, 1, 2, 3],
        category: "نظافة كلمات المرور",
    },
    {
        question: "هل تستخدم المصادقة الثنائية (2FA)؟",
        options: [
            "ما هي المصادقة الثنائية؟",
            "لا، إنها مزعجة جداً",
            "نعم، على بريدي الإلكتروني وحسابي البنكي",
            "نعم، على جميع الحسابات التي تدعمها",
        ],
        scores: [0, 1, 2, 3],
        category: "نظافة كلمات المرور",
    },
    {
        question: "عند الاتصال بشبكة واي فاي عامة، أنت...",
        options: [
            "أتصل وأتصفح بحرية",
            "أتجنب الوصول للحسابات الحساسة",
            "أستخدم VPN لجميع الأنشطة",
            "لا أستخدم واي فاي عامة أبداً",
        ],
        scores: [0, 1, 2, 3],
        category: "أمان الشبكة",
    },
    {
        question: "كيف تتعامل مع تحديثات البرامج؟",
        options: [
            "أتجاهلها لأطول فترة ممكنة",
            "أحدث عندما أتذكر",
            "أحدث خلال أسبوع من الإشعار",
            "أفعل التحديث التلقائي",
        ],
        scores: [0, 1, 2, 3],
        category: "أمان الشبكة",
    },
    {
        question: "أمان واي فاي منزلك هو...",
        options: [
            "مفتوح/بدون كلمة مرور أو WEP",
            "WPA بكلمة مرور بسيطة",
            "WPA2 بكلمة مرور جيدة",
            "WPA3 بكلمة مرور قوية وفريدة",
        ],
        scores: [0, 1, 2, 3],
        category: "أمان الشبكة",
    },
    {
        question: "كيف تتعامل مع خصوصية وسائل التواصل الاجتماعي؟",
        options: [
            "كل شيء عام",
            "بعض المنشورات خاصة",
            "فقط الأصدقاء يمكنهم رؤية محتواي",
            "مقفل تماماً مع معلومات شخصية محدودة",
        ],
        scores: [0, 1, 2, 3],
        category: "خصوصية البيانات",
    },
    {
        question: "عندما يطلب تطبيق أذونات، أنت...",
        options: [
            "أقبل الكل دون قراءة",
            "ألقي نظرة وعادة أقبل",
            "أقرأ بعناية وأرفض المشبوهة",
            "أراجع كل إذان وأقلل الوصول",
        ],
        scores: [0, 1, 2, 3],
        category: "خصوصية البيانات",
    },
    {
        question: "كيف تتخلص من الأجهزة القديمة؟",
        options: [
            "أرميها في القمامة",
            "أتبرع بها بدون مسح البيانات",
            "أعمل إعادة ضبط المصنع قبل التخلص",
            "مسح كامل + تدمير التخزين الفعلي",
        ],
        scores: [0, 1, 2, 3],
        category: "خصوصية البيانات",
    },
    {
        question: "كيف تتعامل مع رسائل بريد إلكتروني غير متوقعة تحتوي روابط؟",
        options: [
            "أنقر إذا بدت مثيرة للاهتمام",
            "أنقر إذا بدت من مرسل معروف",
            "أمرر المؤشر لأتحقق من الرابط أولاً",
            "أتحقق عبر قناة منفصلة قبل النقر",
        ],
        scores: [0, 1, 2, 3],
        category: "الهندسة الاجتماعية",
    },
    {
        question: "عندما يتصل شخص يدعي أنه من بنكك...",
        options: [
            "أعطيه أي معلومات يحتاجها",
            "أجيب على أسئلته بحذر",
            "أطلب رقم اتصال للتحقق",
            "أغلق الخط وأتصل بالبنك مباشرة",
        ],
        scores: [0, 1, 2, 3],
        category: "الهندسة الاجتماعية",
    },
    {
        question: "تجد ذاكرة USB في موقف السيارات. أنت...",
        options: [
            "أوصلها بالكمبيوتر لمعرفة صاحبها",
            "أوصلها بكمبيوتر غير العمل",
            "أسلمها لقسم تكنولوجيا المعلومات/الأمن",
            "أتركها أو أتخلص منها بأمان",
        ],
        scores: [0, 1, 3, 3],
        category: "الهندسة الاجتماعية",
    },
    {
        question: "كيف تشارك المعلومات الحساسة مع زملائك؟",
        options: [
            "بريد إلكتروني عادي أو تطبيقات مراسلة",
            "ملفات محمية بكلمة مرور عبر البريد",
            "قنوات مشفرة معتمدة من الشركة",
            "أدوات مشفرة من الطرف للطرف فقط",
        ],
        scores: [0, 1, 2, 3],
        category: "خصوصية البيانات",
    },
    {
        question: "كيف تنسخ بياناتك المهمة احتياطياً؟",
        options: [
            "لا أنسخ احتياطياً",
            "أحياناً أنسخ لذاكرة USB",
            "نسخ احتياطي منتظم للتخزين السحابي",
            "استراتيجية نسخ احتياطي 3-2-1 آلية",
        ],
        scores: [0, 1, 2, 3],
        category: "أمان الشبكة",
    },
    {
        question: "كيف تتحقق من أمان موقع ويب قبل إدخال بياناتك؟",
        options: [
            "لا أتحقق، أدخل بياناتي مباشرة",
            "أبحث عن أيقونة القفل",
            "أتحقق من HTTPS وأيقونة القفل",
            "أتحقق من الرابط كاملاً وHTTPS والشهادة",
        ],
        scores: [0, 1, 2, 3],
        category: "خصوصية البيانات",
    },
];
