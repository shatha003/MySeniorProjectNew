import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { securityQuestionsEN, securityQuestionsAR, type SecurityQuestion } from '@/data/securityQuestions';

export function useSecurityQuestions(): SecurityQuestion[] {
    const { i18n: i18nInstance } = useTranslation();
    return useMemo(() => {
        return i18nInstance.language === 'ar' ? securityQuestionsAR : securityQuestionsEN;
    }, [i18nInstance.language]);
}
