import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';

    const toggleLanguage = () => {
        const newLang = isArabic ? 'en' : 'ar';
        i18n.changeLanguage(newLang);
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLang;
    };

    return (
        <motion.button
            onClick={toggleLanguage}
            className="titlebar-btn flex items-center justify-center w-[46px] relative overflow-hidden focus:outline-none"
            whileTap={{ scale: 0.9 }}
            title={isArabic ? 'English' : 'العربية'}
            tabIndex={-1}
        >
            <span className="text-[11px] font-black tracking-wider text-muted-foreground">
                {isArabic ? 'EN' : 'AR'}
            </span>
        </motion.button>
    );
}
