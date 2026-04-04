import { Link } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { motion } from 'framer-motion'

export default function TermsOfService() {
    const isLoggedIn = !!auth.currentUser

    return (
        <div className="min-h-full bg-background">
            {/* Top bar with back button */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
                <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3">
                    <Link
                        to={isLoggedIn ? '/dashboard' : '/register'}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors rounded-lg px-3 py-1.5 hover:bg-muted"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        {isLoggedIn ? 'Back to Dashboard' : 'Back to Registration'}
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    <div>
                        <h1 className="font-display text-2xl font-bold mb-2">Terms of Service</h1>
                        <p className="text-sm text-muted-foreground">Last updated: March 6, 2026</p>
                    </div>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">1. Acceptance of Terms</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            By accessing or using CHEA ("the App"), you agree to be bound by these Terms of Service. If you do not agree to
                            these terms, please do not use the App. These terms apply to all users of the App, including minors under the supervision
                            of a parent or guardian.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">2. Description of Service</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            CHEA is a desktop security companion application designed to help users manage permissions, monitor activity,
                            and enforce digital safety policies. The App provides tools for security monitoring, parental controls, and activity
                            management across your digital ecosystem.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">3. User Accounts</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            To use CHEA, you must create an account by providing accurate information. You are responsible for maintaining the
                            confidentiality of your account credentials and for all activities that occur under your account. You must notify us
                            immediately of any unauthorized use of your account.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">4. Acceptable Use</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            You agree not to use the App for any unlawful purpose or in violation of any applicable laws. You may not attempt to
                            gain unauthorized access to the App's systems, interfere with other users' use of the App, or reverse-engineer any
                            part of the application.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">5. Intellectual Property</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            All content, features, and functionality of the App, including but not limited to text, graphics, logos, and software,
                            are the exclusive property of CHEA and are protected by copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">6. Limitation of Liability</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            CHEA is provided "as is" without any warranties, express or implied. We do not guarantee that the App will be
                            uninterrupted, error-free, or completely secure. In no event shall CHEA be liable for any indirect, incidental,
                            special, or consequential damages arising out of or in connection with your use of the App.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">7. Termination</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We reserve the right to suspend or terminate your account at any time, without notice, for any reason including
                            violation of these Terms. Upon termination, your right to use the App will immediately cease.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">8. Changes to Terms</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We may update these Terms from time to time. Changes will be effective upon posting. Your continued use of the App
                            after any changes constitutes your acceptance of the new Terms.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">9. Contact Us</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            If you have any questions about these Terms of Service, please contact us through the App's support channel or at
                            our official email address.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
