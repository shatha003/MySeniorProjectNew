'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Always provide i18n - the language is set synchronously in the i18n config
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
