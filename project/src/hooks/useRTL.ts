import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useRTL() {
    const { i18n } = useTranslation();

    useEffect(() => {
        const isRTL = i18n.language === 'ar';
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);
}
