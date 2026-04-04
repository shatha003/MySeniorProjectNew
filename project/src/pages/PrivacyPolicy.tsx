import { Link } from 'react-router-dom'
import { auth } from '../lib/firebase'
import { motion } from 'framer-motion'

export default function PrivacyPolicy() {
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
                        <h1 className="font-display text-2xl font-bold mb-2">Privacy Policy</h1>
                        <p className="text-sm text-muted-foreground">Last updated: March 6, 2026</p>
                    </div>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">1. Information We Collect</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            When you use CHEA, we may collect the following types of information:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1.5 ml-2">
                            <li><strong className="text-foreground">Account Information:</strong> Your email address, display name, and profile picture when you register or sign in with Google.</li>
                            <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with the App, including features used and actions performed.</li>
                            <li><strong className="text-foreground">Device Information:</strong> Basic information about the device running the App, such as operating system and version.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">2. How We Use Your Information</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We use the collected information to:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1.5 ml-2">
                            <li>Provide, maintain, and improve the App's services</li>
                            <li>Authenticate your identity and manage your account</li>
                            <li>Monitor and analyze usage patterns to enhance the user experience</li>
                            <li>Communicate important updates and security alerts</li>
                            <li>Ensure the safety and security of our platform</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">3. Data Storage & Security</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your data is stored securely using Firebase services with AES-256 encryption. We implement industry-standard security
                            measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However,
                            no method of electronic storage is 100% secure.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">4. Data Sharing</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We do not sell, trade, or rent your personal information to third parties. We may share your information only in
                            the following circumstances:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1.5 ml-2">
                            <li>With your explicit consent</li>
                            <li>To comply with legal obligations or respond to lawful requests</li>
                            <li>To protect the rights, property, or safety of CHEA, its users, or the public</li>
                            <li>With service providers who assist in operating the App (e.g., Firebase, Google Cloud)</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">5. Children's Privacy</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            CHEA is designed for users of all ages, including minors. We are committed to protecting children's privacy. If
                            you are under the age of 13, a parent or guardian must consent to and supervise your use of the App. We do not knowingly
                            collect personal information from children under 13 without parental consent.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">6. Your Rights</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1.5 ml-2">
                            <li>Access and review your personal data stored in the App</li>
                            <li>Update or correct your account information at any time</li>
                            <li>Request deletion of your account and associated data</li>
                            <li>Opt out of non-essential data collection</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">7. Cookies & Local Storage</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            CHEA may use local storage and browser-based persistence mechanisms to maintain your session and preferences.
                            These are essential for the App to function correctly and cannot be disabled without affecting the App's operation.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">8. Changes to This Policy</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            We may update this Privacy Policy from time to time. Any changes will be posted within the App, and the "Last updated"
                            date will be revised accordingly. Your continued use of the App after any changes constitutes your acceptance of the
                            updated policy.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-display text-lg font-semibold">9. Contact Us</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            If you have any questions or concerns about this Privacy Policy or how your data is handled, please contact us through
                            the App's support channel or at our official email address.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
