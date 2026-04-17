import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PlaceholderPage({ title }: { title: string }) {
    const navigate = useNavigate();
    const { t } = useTranslation('common');

    return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{t('underDevelopment')}</p>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors mt-4"
            >
                <ArrowLeft size={18} />
                {t('goBack')}
            </button>
        </div>
    );
}
