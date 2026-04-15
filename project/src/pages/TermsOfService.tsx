import { Link } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { motion } from 'framer-motion'
import { useTheme } from '../components/theme-provider'

export default function TermsOfService() {
    const isLoggedIn = !!auth.currentUser
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By accessing or using CHEA ('the App'), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App. These terms apply to all users of the App, including minors under the supervision of a parent or guardian.",
        },
        {
            title: "2. Description of Service",
            content: "CHEA is a desktop security companion application designed to help users manage permissions, monitor activity, and enforce digital safety policies. The App provides tools for security monitoring, parental controls, and activity management across your digital ecosystem.",
        },
        {
            title: "3. User Accounts",
            content: "To use CHEA, you must create an account by providing accurate information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.",
        },
        {
            title: "4. Acceptable Use",
            content: "You agree not to use the App for any unlawful purpose or in violation of any applicable laws. You may not attempt to gain unauthorized access to the App's systems, interfere with other users' use of the App, or reverse-engineer any part of the application.",
        },
        {
            title: "5. Intellectual Property",
            content: "All content, features, and functionality of the App, including but not limited to text, graphics, logos, and software, are the exclusive property of CHEA and are protected by copyright, trademark, and other intellectual property laws.",
        },
        {
            title: "6. Limitation of Liability",
            content: "CHEA is provided 'as is' without any warranties, express or implied. We do not guarantee that the App will be uninterrupted, error-free, or completely secure. In no event shall CHEA be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the App.",
        },
        {
            title: "7. Termination",
            content: "We reserve the right to suspend or terminate your account at any time, without notice, for any reason including violation of these Terms. Upon termination, your right to use the App will immediately cease.",
        },
        {
            title: "8. Changes to Terms",
            content: "We may update these Terms from time to time. Changes will be effective upon posting. Your continued use of the App after any changes constitutes your acceptance of the new Terms.",
        },
        {
            title: "9. Contact Us",
            content: "If you have any questions about these Terms of Service, please contact us through the App's support channel or at our official email address.",
        },
    ]

    // Style helper functions
    const getBgGradient = () => isDark ? 'bg-neon-violet' : 'bg-neon-crimson'
    const getTextColor = () => isDark ? 'text-neon-violet' : 'text-neon-crimson'
    const getBorderLight = () => isDark ? 'border-neon-violet/20' : 'border-neon-crimson/20'
    const getBorderMedium = () => isDark ? 'border-neon-violet/30' : 'border-neon-crimson/30'
    const getBgLight = () => isDark ? 'bg-neon-violet/10' : 'bg-neon-crimson/10'

    return (
        <div className="min-h-screen bg-surface font-body">
            {/* Top Navigation Bar */}
            <div className={`sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b ${
                isDark ? 'border-white/10' : 'border-black/10'
            }`}>
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link 
                        to={isLoggedIn ? '/dashboard' : '/'}
                        className="flex items-center gap-3 group"
                    >
                        <div className="relative">
                            <img 
                                src="/icon.png" 
                                alt="CHEA" 
                                className="w-10 h-10 object-contain relative z-10"
                            />
                            <div 
                                className={`absolute inset-0 rounded-full blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-125 ${
                                    isDark ? 'bg-neon-violet/40' : 'bg-neon-crimson/40'
                                }`}
                            />
                        </div>
                        <span className="text-xl font-headline font-bold text-on-surface tracking-tight">
                            CHEA
                        </span>
                    </Link>

                    {/* Back Button */}
                    <Link
                        to={isLoggedIn ? '/dashboard' : '/register'}
                        className={`inline-flex items-center gap-2 text-sm font-headline font-semibold transition-all duration-300 rounded-xl px-4 py-2 ${
                            isDark 
                                ? 'text-on-surface-variant hover:text-neon-violet hover:bg-neon-violet/10' 
                                : 'text-on-surface-variant hover:text-neon-crimson hover:bg-neon-crimson/10'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        {isLoggedIn ? 'Back to Dashboard' : 'Back to App'}
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* Header Card */}
                    <div className={`relative rounded-2xl border backdrop-blur-xl p-8 sm:p-12 ${getBgLight()} ${getBorderLight()} shadow-[0_0_60px_rgba(0,0,0,0.1)]`}>
                        {/* Decorative corner accent */}
                        <div className={`absolute top-0 right-0 w-24 h-24 opacity-30 bg-gradient-to-bl ${
                            isDark ? 'from-neon-violet' : 'from-neon-crimson'
                        } to-transparent`} style={{ borderTopRightRadius: '1rem' }} />
                        
                        <div className="text-center relative z-10">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-headline font-bold tracking-wider mb-6 border ${getBgLight()} ${getTextColor()} ${getBorderMedium()}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <path d="M12 18v-6" />
                                    <path d="M9 15l3 3 3-3" />
                                </svg>
                                LEGAL AGREEMENT
                            </motion.div>
                            
                            <h1 className={`font-headline text-4xl sm:text-5xl md:text-6xl font-bold mb-4 ${getTextColor()}`}>
                                Terms of Service
                            </h1>
                            <p className="text-on-surface-variant font-body text-sm sm:text-base">
                                Last updated: March 6, 2026
                            </p>
                        </div>
                    </div>

                    {/* Introduction */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className={`rounded-xl border backdrop-blur-md p-6 ${
                            isDark ? 'bg-surface-container-low/60 border-white/5' : 'bg-white/60 border-black/5'
                        }`}
                    >
                        <p className="text-on-surface-variant leading-relaxed text-center">
                            Welcome to CHEA Protocol. These Terms of Service govern your use of our cybersecurity 
                            application and constitute a legally binding agreement between you and CHEA Protocol.
                        </p>
                    </motion.div>

                    {/* Terms Sections */}
                    <div className="space-y-6">
                        {sections.map((section, index) => (
                            <motion.section
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                                className={`group rounded-xl border backdrop-blur-md p-6 sm:p-8 transition-all duration-300 hover:scale-[1.01] ${
                                    isDark ? 'bg-surface-container/60 border-white/5' : 'bg-white/60 border-black/5'
                                } hover:${getBorderLight()} hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-headline font-bold text-lg ${getBgLight()} ${getTextColor()} ${getBorderLight()}`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className={`font-headline text-xl font-bold mb-3 text-on-surface`}>
                                            {section.title}
                                        </h2>
                                        <p className="text-on-surface-variant leading-relaxed text-sm sm:text-base">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.section>
                        ))}
                    </div>

                    {/* Agreement CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.4, duration: 0.5 }}
                        className={`rounded-2xl border backdrop-blur-xl p-8 text-center ${isDark ? 'bg-gradient-to-br from-neon-violet/10 to-neon-crimson/10' : 'bg-gradient-to-br from-neon-crimson/10 to-neon-violet/10'} ${getBorderLight()}`}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getBgLight()} ${getBorderMedium()}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={getTextColor()}>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <path d="M9 15l3 3 3-3" />
                            </svg>
                        </div>
                        <h3 className={`font-headline text-2xl font-bold mb-3 text-on-surface`}>
                            By Using CHEA, You Agree
                        </h3>
                        <p className="text-on-surface-variant mb-6">
                            By accessing or using our application, you acknowledge that you have read, 
                            understood, and agree to be bound by these Terms of Service.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="mailto:support@chea-protocol.com"
                                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-headline font-semibold text-sm transition-all duration-300 ${getBgGradient()} text-white hover:opacity-90 shadow-[0_0_20px_rgba(0,0,0,0.2)]`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                                Contact Support
                            </a>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="pt-8 border-t border-white/10 text-center"
                    >
                        <p className="text-sm text-on-surface-variant/60">
                            © 2026 CHEA Protocol. All rights reserved.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
