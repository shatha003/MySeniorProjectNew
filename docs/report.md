# Cyber Hygiene Educator & Assistant (CHEA) - Project Report

---

**University of Bahrain**
**College of Information Technology**
**Department of Information Systems**
**B.Sc. In Cyber Security**

**Prepared by:**

| Student | Name | ID |
|---------|------|----|
| Student 1 | Shatha Ebrahem Moosa | 202103023 |
| Student 2 | Hiba Barkat Abbas Nakade | 202201477 |
| Student 3 | Shahad Mustafa Ali | 202201096 |

**For:** ITCY 499 - Senior Project
**Academic Year:** 2025-2026 - Semester 2
**Project Supervisor:** Dr. Yaqoob Salman Mohamed Alsais

---

## Chapter 1: Introduction

### 1.1 Problem Statement

The Cyber Hygiene Educator & Assistant addresses the critical need for comprehensive cybersecurity education and practical security tools specifically designed for students and educational institutions. In today's digital landscape, students exhibit a critical lack of "Cyber Hygiene" — defined as the routine practices and fundamental habits necessary to ensure the safe handling of critical data and secure network usage. Consequently, they face increasing cybersecurity threats including weak password practices, phishing attacks, malicious URLs, and inadequate security awareness. Unfortunately, educational institutions often lack centralized, user-friendly tools that can both teach these essential security concepts and provide practical protection mechanisms effectively.

Recent cybersecurity studies provide strong evidence for this growing crisis. According to Check Point Research (2022), the education sector has witnessed a **300% increase in cyberattacks** since 2020. Furthermore, the Verizon DBIR (2021) indicates that **81% of breaches are caused by weak passwords** and **94% of malware is delivered via email**. Crucially, a 2024 systematic review by Ibrahim et al. highlights that despite these risks, password security and email security (phishing) receive the least attention in K-12 education literature, making them the most neglected yet dangerous vulnerabilities for students.

To solve this problem, we propose the development of the "Cyber Hygiene Educator & Assistant," an integrated Windows Forms application targeting school children from 9-15 years old.

The scope of this project is to create a single, cohesive platform that combines practical protection with education. This includes developing tools for password generation and strength analysis, URL security verification, and encryption/decryption capabilities, alongside an AI-powered assistant for real-time education.

### 1.2 Project Objectives

**I.** To propose a specialized cybersecurity training application tailored for school children aged 9-15 years old, focusing on mitigating digital risks such as weak password management and online browsing threats.

**II.** To develop a comprehensive security information system that integrates multiple practical capabilities into a unified platform, including a secure password generator, strength analyzer, VirusTotal-based URL verification, encryption tools, and an AI-powered educational assistant.

**III.** To evaluate the developed system based on its ease of use for the target age group, its effectiveness in providing real-time protection, and its ability to enhance the cybersecurity awareness of students.

### 1.3 Project Significance

**Importance to Educational Organizations:** The project provides schools with a specialized, cost-effective tool to practically demonstrate cybersecurity concepts (like encryption and password strength) that are often difficult to teach theoretically. It enhances the school's digital safety environment by equipping students with the means to protect their own data, reducing the likelihood of incidents within the school network.

**Importance to People (Students & Educators):** For students (aged 9-15), the tool transforms cybersecurity from an abstract concept into a daily habit. It offers immediate protection for their personal accounts and academic projects against loss or theft. For educators, it serves as an interactive teaching aid that simplifies complex topics through the AI assistant and practical utilities, making security education engaging rather than technical.

**Importance to Society:** The project contributes to establishing foundational digital literacy among the younger generation. By fostering "Cyber Hygiene" habits early on, it helps create responsible digital citizens who are less susceptible to common online threats like phishing and social engineering, thereby creating a safer overall digital community.

### 1.4 Brief Literature Review

Through our research into cybersecurity challenges within educational institutions, we observed that students often represent the most vulnerable demographic. This observation is supported by Al-Janabi et al. (2021), who highlight that students frequently rely on weak passwords, and a lack of awareness makes them highly susceptible to phishing attempts. In evaluating existing solutions, we found that while specialized tools like Bitwarden effectively manage credentials, Sylejmani (2020) argues that their perceived complexity often deters students from adopting them. Similarly, while platforms like VirusTotal offer powerful threat scanning, they typically operate as standalone web services that disrupt the user's workflow, and comprehensive suites like Kaspersky are often cost-prohibitive and fail to educate the user on threat prevention. Recognizing that these tools are currently fragmented, our project aims to bridge this gap by consolidating these essential functions — password management, file scanning, and encryption — into a unified platform integrated with AI-driven guidance to not only secure student data but also enhance their cybersecurity awareness interactively.

### 1.5 Supporting References

1. Al-Janabi, M., et al. (2021). "Cybersecurity Awareness in Higher Education: A Study of Students' Behavior." Journal of Information Security, 12(1), 15-32.
2. Bitwarden Inc. (2023). Bitwarden Password Manager. Available at: https://bitwarden.com/
3. Check Point Research. (2022). Cyber Attacks on Education Sector See Massive Surge. Check Point Software Technologies.
4. Google. (2023). VirusTotal: Threat Intelligence Services. Available at: https://www.virustotal.com/
5. Ibrahim, A., McKee, M., Sikos, L. F., & Johnson, N. F. (2024). "A Systematic Review of K-12 Cybersecurity Education Around the World." IEEE Access, 12, 59726-59738.
6. Kaspersky Lab. (2023). Kaspersky Total Security Solutions. Available at: https://www.kaspersky.com/
7. Sylejmani, K. (2020). "Usability Issues in Password Management Tools for University Students." International Journal of Human-Computer Interaction, 36(4), 312-325.
8. Verizon. (2021). 2021 Data Breach Investigations Report (DBIR). Verizon Enterprise Solutions.

### 1.6 Project Timeline

*(1 semester)*

| Task | W 1-3 | W 4-6 | W 7-9 | W 10-12 | W 13-16 |
|------|:-----:|:-----:|:-----:|:-------:|:-------:|
| Requirement Collection | X | | | | |
| Literature Review | X | | | | |
| Design | | X | | | |
| Implementation | | X | | | |
| Testing and Results | | | X | | |
| Report Writing | | | | X | |
| Presentation | | | | | X |

---

## Chapter 2: Literature Review

### 2.1 Introduction

Understanding why this project matters requires looking beyond the surface of existing solutions to examine the limitations that have left K-12 students vulnerable to cyber threats. This literature review aims not to catalogue prior work, but to position our study within a broader academic conversation about gaps between threat realities and educational responses.

This study is motivated by the disconnect between the increasing cyber threats targeting K-12 students and the educational responses designed to address them. Check Point Research (2022) documented a significant 300% surge in cyberattacks against educational institutions since 2020. This is not viewed as an abstract statistic, but as evidence of a vulnerability that highlights the need for academic attention. Notably, the Verizon Data Breach Investigations Report (2021) indicates the human element behind these breaches: 81% stem from weak passwords, while 94% of malware arrives via email. These are not sophisticated zero-day exploits targeting infrastructure; rather, they appear to be preventable attacks exploiting gaps in user knowledge and behavior. However, Ibrahim et al. (2024) identified a notable disconnect in their systematic review of global K-12 cybersecurity education. Despite passwords and phishing representing the primary attack vectors, these topics tend to receive the least attention in educational literature. This suggests that the field may have divergent priorities, focusing on broad concepts while potentially overlooking the specific technical vulnerabilities that often compromise student safety.

In the following sections, we examine existing tools not merely to describe them, but to understand their pedagogical limitations. We synthesize academic literature to identify the gaps between theoretical frameworks and practical implementation, and we position the Cyber Hygiene Educator & Assistant as a proposed solution to address these identified limitations. Our approach combines insights from peer-reviewed sources, industry threat intelligence, and market analysis to construct an argument for integrated, gamified security education as a constructive response to the persistent opportunities for improvement in K-12 cyber hygiene instruction.

### 2.2 Understanding Student Vulnerability

Students occupy a unique position in the cybersecurity ecosystem — simultaneously highly connected and profoundly vulnerable. Unlike adults who may have developed security instincts through years of professional digital engagement, students navigate increasingly complex online environments without adequate preparation or protection. Al-Janabi et al. (2021) highlight that students routinely depend on weak, easily guessable credentials and demonstrate limited capacity to recognize social engineering tactics. We interpret this not as individual negligence, but as evidence of systemic educational failure; students cannot practice what they have never been taught.

However, vulnerability extends beyond mere knowledge deficits into behavioral territory. Purnama et al. (2021) — whose work has garnered significant attention with 245 citations — provide compelling evidence that digital literacy functions as a direct predictor of online risk behaviors in children. Their findings suggest that self-control and technical knowledge interact in complex ways to determine exposure levels. This implies that effective cybersecurity education cannot simply dump technical information onto students; it must address the behavioral and psychological factors that drive risky decisions. We believe that any solution ignoring this dual nature of vulnerability — cognitive and behavioral — will inevitably fail to produce lasting change.

The Verizon DBIR (2021) crystallizes the threat landscape into three primary vectors: weak password practices, phishing attacks, and malware delivery through compromised email and URLs. We view these not as isolated dangers, but as an interconnected ecosystem of risk that students encounter daily. Ibrahim et al. (2024) reinforce this interpretation by demonstrating that educational responses have disproportionately focused on general "internet safety" concepts — cyberbullying, screen time, appropriate content — while systematically neglecting the technical skills required to defend against these primary threat vectors. This misalignment between what threatens students and what we teach them forms the central tension our project seeks to resolve.

Cowling et al. (2025) add crucial nuance through their comprehensive study of students aged 10-13, demonstrating that digital safety cannot be separated from digital literacy and overall wellbeing. Their research suggests that students' online engagement patterns are deeply influenced by their communication skills and social contexts. This finding resonates with our core philosophy: cybersecurity education must be integrated rather than siloed. Teaching password hygiene in isolation from broader digital citizenship creates knowledge that students struggle to apply when confronted with real-world social engineering attempts. We need approaches that address the whole student, not just their technical behaviors.

### 2.3 Existing Tools and Applications

Before proposing new solutions, we must critically interrogate why current market offerings fail to protect K-12 students effectively. Our analysis reveals that existing tools generally fall into categories designed for adult professionals, then awkwardly retrofitted for younger users — a design philosophy that fundamentally misunderstands developmental needs.

#### 2.3.1 Password Management Tools

Password managers like Bitwarden represent the gold standard for adult credential protection, yet they present significant adoption barriers for younger users. Sylejmani (2020) argues persuasively that the perceived complexity of these interfaces often deters students entirely, driving them back to insecure habits like reusing simple passwords. We have observed this pattern ourselves: when security tools require excessive cognitive load, users abandon them regardless of their protective value. More critically, these tools function purely as utilities rather than educational instruments. They store passwords efficiently but miss the pedagogical opportunity to explain why "P@ssw0rd123" fails against modern cracking techniques or how entropy determines password strength. This suggests to us that current password managers solve the immediate problem while failing to build the long-term security literacy necessary for independent digital citizenship.

#### 2.3.2 Security Scanning Tools

Platforms like VirusTotal offer impressive threat detection capabilities, yet they operate as detached web services that disrupt rather than integrate with student workflows. We imagine a typical scenario: a student receives a suspicious file via email or social media. The friction required to navigate to VirusTotal, upload the file, and interpret technical results creates a barrier that most students will simply bypass. These tools provide binary verdicts — clean or infected — without contextual education about why a file might be dangerous or how malware functions. Interpreting scan results often requires technical knowledge about hash values, detection ratios, and false positives that younger students have not yet developed. Consequently, these powerful protective tools remain inaccessible to the demographic that arguably needs them most.

#### 2.3.3 Educational Platforms

KnowBe4 Student Edition dominates the security awareness training market, but its limitations reveal the gaps in current approaches. First, it targets students aged 16 and above, immediately excluding middle schoolers who are already active online. Second, while it effectively addresses phishing awareness and social engineering concepts, it stops short of providing practical protection tools. Students learn to recognize threats but lack integrated password generators, encryption utilities, or file scanners to defend against them. Third, its subscription-based enterprise model creates accessibility barriers for underfunded schools or individual learners, effectively making security a privilege rather than a right.

Hack The Box presents the inverse problem: exceptional practical training in offensive and defensive security but designed exclusively for adults and professionals. Its gamified approach to penetration testing and network security offers genuine educational value yet assumes baseline technical competencies that children have not acquired. Like other platforms, it omits the fundamental defensive tools — password strength checkers, URL verifiers, encryption labs — that beginners require for daily protection. Google Interland targets the appropriate age demographic (8-12) with engaging gamification, yet provides zero practical security tools, functioning purely as educational content without real-world protective utility.

#### 2.3.4 Comparative Analysis

Table 2.1 crystallizes our critique of this fragmented landscape. Current solutions force an impossible choice between education and protection, between accessibility and sophistication. No existing platform simultaneously provides practical utility, age-appropriate design, and integrated educational content. This observation drives our conviction that the market requires a fundamentally different approach — one that refuses to accept these false dichotomies.

**Table 2.1: Comparative Analysis of Existing Cybersecurity Tools**

| Application | Password | URL | Encrypt | Games | AI | Target |
|-------------|:--------:|:---:|:-------:|:-----:|:--:|:------:|
| KnowBe4 | No | No | No | Yes | No | 16+ |
| Hack The Box | No | No | No | Yes | No | Adults |
| Bitwarden | Yes | No | No | No | No | General |
| VirusTotal | No | Yes | No | No | No | General |
| Google Interland | No | No | No | Yes | No | 8-12 |
| **CHEA** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **9-15** |

### 2.4 Academic Literature Analysis

#### 2.4.1 Systematic Reviews on Cybersecurity Education

Foundational systematic reviews have shaped our understanding of what works in security education. Zhang-Kennedy and Chiasson (2021) conducted the most comprehensive review in this space, analyzing multimedia tools across 193 citations to determine effective educational approaches. Their framework suggests that interactive, multimedia-based learning significantly outperforms traditional text-based instruction. To the best of their knowledge, their review remains the definitive examination of how technology can enhance security awareness. We draw heavily on their conclusion that engagement and interactivity determine educational efficacy.

Ibrahim et al. (2024) provide the most current global perspective, confirming that K-12 cybersecurity education remains in its infancy worldwide. Their critical finding that password and email security constitute the most neglected topics in educational literature directly validates our project's focus areas. We see this neglect not as an oversight, but as a structural failure that leaves students defenseless against the most common attack vectors. Sağlam and Miller (2023) reinforce this urgency through their focus on children specifically, noting that while mentoring approaches show promise, the literature lacks comprehensive evaluation of different pedagogical methods. This gap suggests to us that the field needs not just new tools, but rigorous empirical evidence about which teaching strategies produce behavioral change — a contribution our project aims to make.

Triplett (2023) adds another dimension by revealing significant concerns about the cybersecurity status of K-12 schools themselves, emphasizing the importance of preparing students for future careers in the field. We interpret this as a dual mandate: our project must protect students today while building the foundational knowledge that might inspire tomorrow's cybersecurity professionals.

#### 2.4.2 Studies on Student Awareness

Understanding baseline awareness levels proves crucial for designing effective interventions. Alharbi and Tassaddiq (2021) assessed students at Majmaah University and discovered an inverse relationship between password habits and overall cybersecurity awareness. Their study suggests that poor password practices correlate with lower security consciousness across all domains. We believe this indicates that password education serves as a gateway skill — mastering password hygiene potentially unlocks broader security awareness. This hypothesis informs our decision to prioritize password tools as entry points to comprehensive security education.

Alqahtani (2022) examined the factors determining awareness levels, identifying prior training and exposure to security incidents as key variables. This suggests that awareness is not innate or automatic; it requires deliberate cultivation through structured programs. Bottyán (2023) confirmed these patterns internationally, documenting consistent weaknesses in password management and social engineering susceptibility across different cultural contexts. These universal patterns imply that the challenges we address are not culturally specific but represent fundamental gaps in how humans intuitively understand digital risk.

Erendor and Yildirim (2022) provide timely analysis of online education environments, finding significant gaps in student understanding of software security, password management, and social media privacy. Their research takes on added significance given the post-COVID-19 shift toward remote and hybrid learning models. We believe their findings indicate that the rapid digitization of education has outpaced the development of corresponding security education, leaving students vulnerable precisely when their screen time and digital dependency have increased.

#### 2.4.3 Gamification in Cybersecurity Education

The pedagogical potential of gamification emerges clearly from recent literature. Pramod (2025) conducted a state-of-the-art review demonstrating that gamification significantly improves both engagement and knowledge retention in security contexts. His analysis suggests that game elements are particularly effective for addressing modern threats like malware and phishing because they allow safe exploration of risky scenarios. Wijanarko and Erlansari (2025) support this thesis specifically for adolescent populations, noting that gamification helps students navigate increasingly sophisticated risks including cyberbullying and advanced social engineering.

Crucially, Khairallah and Abu-Naseer (2024) moved beyond theoretical analysis to conduct a controlled experiment proving that gamified methods outperform traditional training for phishing awareness. Their empirical evidence provides the scientific foundation for our design choices. Nagaraj et al. (2025) affirmed these findings in corporate contexts, demonstrating that gamified learning enhances knowledge retention among employees. We argue that if gamification proves effective for adult professionals, its impact should be even more pronounced for digital-native students who have grown up with game-based learning models.

### 2.5 Research Gaps Identified

Through this systematic analysis, we have identified five significant gaps that current solutions fail to bridge. These represent both research opportunities and practical imperatives that justify our project's existence.

#### 2.5.1 Tool Integration Gap

The Tool Integration Gap strikes us as the most immediately problematic. Students currently navigate a fragmented ecosystem where password management, URL scanning, file analysis, and encryption exist as separate applications. This fragmentation creates what we term "security fatigue" — the cognitive overload that prevents consistent tool adoption. Ibrahim et al. (2024) explicitly connect this fragmentation to the neglect of password and email security in curricula. We believe students know they should use security tools, but the friction of managing multiple interfaces causes them to abandon protective behaviors.

#### 2.5.2 Age-Appropriateness Gap

The Age-Appropriateness Gap reveals a market designing for adults and expecting children to adapt. Sağlam and Miller (2023) note that existing interfaces assume adult cognitive processing speeds, technical vocabularies, and executive function capabilities. We see this manifest in tools that require complex navigation, assume prior technical knowledge, or lack the visual feedback mechanisms that support younger learners. This gap results in abysmal adoption rates even when schools mandate security software.

#### 2.5.3 Education-Protection Gap

The Education-Protection Gap represents a fundamental pedagogical failure. Zhang-Kennedy and Chiasson (2021) found that tools bifurcate into two ineffective categories: purely educational platforms that teach concepts without practical application, and protective utilities that function as "black boxes" without explaining their operations. We believe this creates a dangerous disconnect where students either understand threats theoretically but cannot defend against them, or use protective tools without understanding why they matter.

#### 2.5.4 Engagement and Motivation Gap

The Engagement and Motivation Gap explains why traditional security education fails to produce lasting change. Pramod (2025) and Wijanarko and Erlansari (2025) both document that without proper engagement mechanisms, students abandon training modules before knowledge consolidation occurs. Standard lecture-based approaches or dry documentation fail to capture attention in an era of interactive digital media.

#### 2.5.5 Accessibility Gap

The Accessibility Gap creates inequitable security landscapes. Subscription models for KnowBe4, Bitwarden Premium features, and comprehensive suites like Kaspersky exclude lower-income students and underfunded districts. We view this economic barrier as ethically unacceptable — digital safety should function as a basic right rather than a premium service.

### 2.6 How CHEA Addresses the Gaps

The Cyber Hygiene Educator & Assistant represents our deliberate attempt to bridge each identified gap through intentional design choices.

#### 2.6.1 Integrated Platform Approach

We address the fragmentation problem by consolidating five essential security tools into a unified interface. Our platform combines a Password Generator and Strength Analyzer, URL Safety Checker integrated with VirusTotal API, Smart File Scanner utilizing hash verification, Photo Metadata Wiper for privacy protection, and an Encryption/Decryption Lab for cryptographic exploration. This integration reduces cognitive load by eliminating context-switching between applications, allowing students to develop comprehensive security habits naturally.

#### 2.6.2 Age-Appropriate Design

We specifically target the 9-15 demographic with interfaces that respect developmental capabilities. Visual indicators — red for weak passwords, green for strong — provide immediate, intuitive feedback. We have eliminated technical jargon in favor of explanatory language that builds understanding without condescension. The Windows Forms interface offers familiarity while maintaining modern visual appeal. Crucially, we have designed navigation that assumes limited prior technical knowledge, ensuring that first-time users can access protective features immediately.

#### 2.6.3 Education + Protection Integration

We reject the false dichotomy between teaching and protecting. Each tool in our suite serves dual purposes: the Password Generator explains entropy and character variety while creating credentials; the Encryption Lab teaches cryptographic principles through hands-on encoding and decoding; the AI Chatbot Assistant answers conceptual "why" questions in real-time while guiding practical tool usage. This approach ensures that students develop both procedural knowledge (how to protect themselves) and conceptual understanding (why these protections matter).

#### 2.6.4 Gamification Strategy

Our engagement system draws directly from Pramod (2025) and Khairallah and Abu-Naseer (2024)'s empirical findings. We implemented Experience Points (XP) earned through genuine security behaviors — using tools, completing quizzes, and maintaining daily engagement streaks. Our Ranking System progresses from Cyber Cadet to Cyber Legend, providing visible progression markers. Achievement Badges recognize specific accomplishments like identifying phishing attempts or securing social media accounts. The Phishing Dojo offers safe practice against simulated threats, while the Quiz Arena tests knowledge retention. This is not entertainment layered over education; it is behavioral reinforcement based on research.

#### 2.6.5 Free and Accessible

We have committed to a completely free model with no subscription tiers or premium features. By utilizing free API tiers (VirusTotal) and local processing (SQLite database, AES-256 encryption), we minimize operational costs while maximizing functionality. This design choice ensures that economic status never determines digital safety.

#### 2.6.6 Contribution to the Field

Beyond immediate practical application, our project contributes to cybersecurity education research by providing a working model of integrated platform design that researchers can study and iterate upon. We will contribute empirical evidence through planned evaluations testing the effectiveness of combined practical tools and gamified education. Most importantly, we directly address the password and email security neglect that Ibrahim et al. (2024) identified as the most dangerous gap in current K-12 education.

**Table 2.2: Research Gaps and CHEA Solutions**

| Identified Research Gap | Critical Description | CHEA Solution Strategy |
|------------------------|---------------------|----------------------|
| Tool Integration Gap | Students face a fragmented ecosystem where security tools exist as separate applications, causing "security fatigue" and cognitive overload. | **Unified Platform:** Consolidates password management, URL scanning, and encryption into a single interface to reduce friction. |
| Age-Appropriateness Gap | Existing tools are designed for adult cognitive processing and technical vocabulary, leading to low adoption rates among children. | **Targeted Design:** Interfaces specifically for ages 9-15 with visual feedback (red/green indicators) and non-technical language. |
| Education-Protection Gap | Current solutions bifurcate into either purely theoretical education or "black box" protection utilities, rarely combining both. | **Hybrid Approach:** Tools serve dual purposes (e.g., Password Generator explains entropy while creating credentials) to blend theory with practice. |
| Engagement & Motivation Gap | Traditional lecture-based training fails to retain student attention or ensure knowledge consolidation. | **Gamification:** Implementation of XP, ranking systems (Cadet to Legend), and simulated "Phishing Dojos" to drive behavioral reinforcement. |
| Accessibility Gap | High subscription costs for premium tools create inequity, making digital safety a privilege rather than a right. | **Free Access Model:** Utilizes free API tiers and local processing to ensure zero cost for the end-user. |

### 2.7 Conclusion

This literature review has traced the contours of a field in crisis. We have examined 26 peer-reviewed sources and analyzed six major platforms to confirm a disturbing reality: while threats to K-12 students escalate dramatically, current solutions remain fragmented, developmentally inappropriate, and economically inaccessible. The academic consensus is clear — we need integrated approaches that combine practical utility with educational content, delivered through engaging, age-appropriate interfaces.

Our analysis suggests that the Cyber Hygiene Educator & Assistant addresses these needs through its unified platform design, pedagogical integration of protection and education, evidence-based gamification, and commitment to universal accessibility. We do not present this project as a final solution, but as a necessary step toward a future where digital safety education matches the sophistication of the threats students face daily. The following chapter details the methodology and system architecture we employed to transform these research insights into functional software.

### References

1. Al-Janabi, M. et al. 2021, 'Cybersecurity Awareness in Higher Education: A Study of Students Behavior', *Journal of Information Security*, vol. 12, no. 1, pp. 15-32.
2. Alharbi, T. & Tassaddiq, A. 2021, 'Assessment of cybersecurity awareness among students of Majmaah University', *Big Data and Cognitive Computing*, vol. 5, no. 2, p. 23.
3. Alqahtani, M.A. 2022, 'Factors affecting cybersecurity awareness among university students', *Applied Sciences*, vol. 12, no. 5, p. 2589.
4. Arishi, A.A. et al. 2024, 'Cybersecurity awareness in schools: A systematic review of practices, challenges, and target audiences', *Journal of Cybersecurity Education*.
5. Ayeyemi, M. 2023, *A Systematic Review of Cybersecurity Education in K-12 Context*, University of Eastern Finland.
6. Bitwarden Inc. 2023, Bitwarden Password Manager, available at: https://bitwarden.com/
7. Bottyán, L. 2023, 'Cybersecurity awareness among university students', *Journal of Applied Technical and Educational Sciences*.
8. Check Point Research 2022, *Cyber Attacks on Education Sector See Massive Surge*, Check Point Software Technologies.
9. Chen, W. et al. 2021, 'Exploring cybersecurity education at the K-12 level', *SITE Interactive Conference*.
10. Cowling, M. et al. 2025, 'Untangling digital safety, literacy, and wellbeing in school activities for 10 to 13 year old students', *Education and Information Technologies*.
11. Erendor, M.E. & Yildirim, M. 2022, 'Cybersecurity awareness in online education: A case study analysis', *IEEE Access*.
12. Fakhrudin, A. 2023, 'Digital literacy analysis of primary school students', *KnE Social Sciences*.
13. Google 2023, VirusTotal: Threat Intelligence Services, available at: https://www.virustotal.com/
14. Ibrahim, A., McKee, M., Sikos, L.F. & Johnson, N.F. 2024, 'A Systematic Review of K-12 Cybersecurity Education Around the World', *IEEE Access*, vol. 12, pp. 59726-59738.
15. Khairallah, O. & Abu-Naseer, M. 2024, 'The effectiveness of gamification teaching method in raising awareness on Email Phishing: Controlled Experiment'.
16. Kaspersky Lab 2023, *Kaspersky Total Security Solutions*, available at: https://www.kaspersky.com/
17. Liu, N. et al. 2025, 'Systematic Review of Elementary Cybersecurity Education: Curriculum, Pedagogy, and Barriers', *Journal of Cybersecurity Education*.
18. Mrđa, B. et al. 2025, 'Cybersecurity education for children: Development of an online application as an internet safety tool', *International Review*.
19. Nagaraj, D.H. et al. 2025, 'Cybersecurity awareness: Gamified learning through phishing analysis', *AIP Conference Proceedings*.
20. Pramod, D. 2025, 'Gamification in cybersecurity education; a state of the art review and research agenda', *Journal of Applied Research in Higher Education*, vol. 17, no. 4, p. 1162.
21. Purnama, S. et al. 2021, 'Does digital literacy influence students online risk? Evidence from Covid-19', *Heliyon*.
22. Sağlam, R.B. & Miller, V. 2023, 'A systematic literature review on cyber security education for children', *IEEE Transactions on Education*.
23. Sylejmani, K. 2020, 'Usability Issues in Password Management Tools for University Students', *International Journal of Human-Computer Interaction*, vol. 36, no. 4, pp. 312-325.
24. Verizon 2021, *2021 Data Breach Investigations Report (DBIR)*, Verizon Enterprise Solutions.
25. Wijanarko, A. & Erlansari, A. 2025, 'Gamification on Cybersecurity Awareness Training for Adolescents: A Systematic Literature Review', *Indonesian Journal of Computer Science Education*.
26. Zhang-Kennedy, L. & Chiasson, S. 2021, 'A systematic review of multimedia tools for cybersecurity awareness and education', *ACM Computing Surveys (CSUR)*.

---

## Chapter 3: Project Management

### 3.1 Process Models

Our project Cyber Hygiene Educator and Assistant (CHEA) will adopt the **Agile Software Development methodology**, specifically leveraging the **Scrum framework**. The reason for choosing this model was its ability to adapt and accommodate the evolving requirements, which are essential for successful development of our system designed to serve both children, aged 9-15 and adult users.

The incremental nature of Agile allows our team to deliver the functional components of system in short cycles, enabling continuous user feedback and rapid response to change. This characteristic is extremely important for CHEA, as the user interface and educational content must be improved based on testing with the targeted age demographic.

Since CHEA consists of multiple components — such as the Phishing game, Password Management, threat detection and analysis module, Encryption Tools — Agile allows the team to develop and test each module in manageable iterations, ensuring steady progress. Its flexibility is especially valuable given that user testing with children may uncover usability issues; Agile makes it easy to adjust the interface without disrupting the entire project. Regular feedback from the target audience ensures that gamified features like XP, quests, and badges remain engaging and age-appropriate. Finally, Agile reduces risk by enabling early delivery of functional modules — such as Password management — so that even if later features face delays, CHEA still has working deliverables to showcase.

#### Scrum Implementation for CHEA

The cyclical nature of the Scrum process provides a structured yet flexible approach to project management. Throughout the development lifecycle, core Scrum principles will be applied systematically:

- **Sprint Planning:** At the start of each sprint, the team meets to establish the scope of work and define the specific features to be completed. This formal planning process ensures clarity of objectives, alignment among team members, and a structured roadmap for the sprint. By setting priorities and the responsibilities at the beginning, the team is able to maintain focus, enhance accountability and progress efficiently while retaining the flexibility to adapt to evolving requirements or user feedback.
- **Daily Stand-Up:** Short daily meetings will be held to ensure consistent progress, address obstacles, and coordinate tasks among team members.
- **Sprint Reviews:** At the conclusion of each sprint, the team will present completed working features to the project supervisors for the feedback.
- **Sprint Retrospective:** The team will reflect on the process and identify areas for enhancement in future sprints, fostering continuous improvement.

### 3.2 Risk Management

Risk management is a critical and non-negotiable component of our project plan. This discipline involves the systematic process of identifying, analyzing, prioritizing risks, developing and implementing appropriate mitigation strategies. Through this process, uncertainties and potential threats that may adversely affect our project scope, timeline, quality are thoroughly evaluated and managed.

In the context of our technical initiative which is not just targeted towards children aged 9-15 but also adults, a complete risk analysis is absolutely necessary. Proactive risk management ensures that core objectives — such as sustained user engagement, educational effectiveness, system reliability, data security, and timely delivery — are systematically protected against foreseeable complications.

By embedding risk management throughout the project lifecycle, the CHEA enhances its capacity to detect potential obstacles, allocate resources efficiently, and maintain alignment with the stakeholders expectations. Each identified risk has been assessed based on its probability (Low, Medium, High) and potential impact (Low, Medium, High), generating an overall risk level. For each risk we identified two types of strategies:

- **Mitigation Strategy:** Proactive measures to reduce the chance of the risk occurring.
- **Contingency Plan:** Reactive measures if the risk occurs despite the mitigation.

**Table 3.1: CHEA Risk Management Plan**

| ID | Risk Description | Probability | Impact | Risk Level | Mitigation Strategy | Contingency Plan |
|----|-----------------|:-----------:|:------:|:----------:|-------------------|-----------------|
| R1 | AI Integration Complexity | High | High | High | Implement AI in phases, begin with rule-based responses, develop isolated prototypes before full integration. | If AI integration becomes too complex or fails to perform as expected, rely on pre-trained models. |
| R2 | External API Dependency | Medium | Medium | Medium | Research API documentation early; implement error handling for API unavailability. | Develop offline fallbacks with basic URL checks. |
| R3 | Encryption Implementation Vulnerabilities | Low | High | Medium | Use established, audited encryption libraries, conduct peer code review. | Mark modules with appropriate warnings such as "educational purposes only" if security issues continue. |
| R4 | Scope Creep | High | Medium | High | Maintain sprint backlog; request supervisor approval for major changes. | Reprioritize features with supervisor. |
| R5 | Schedule Delay Propagation | Medium | High | High | Identify critical path tasks; track progress through daily stand-ups. | Revise schedule with supervisor; focus on must-have features for the final product. |
| R6 | Interface Unsuitable for Users | Medium | High | High | Conduct extensive usability testing with the target age group after each sprint; incorporate feedback into later iterations. | Develop simplified interface mode with larger buttons and visual cues. |
| R7 | Phishing Game Content Inappropriateness | Medium | High | High | Design questions with age-appropriate language; review content with supervisor. | Add enhanced hints and explanations; provide detailed feedback for wrong answers. |
| R8 | Low Engagement with Gamification | Medium | Medium | Medium | Design reward systems. | Adjust reward values and frequency based on user feedback. |
| R9 | Data Loss | Medium | High | High | Maintain GitHub repository with frequent commits or store important documents/code files in cloud storage. | Recover documents from cloud backup, or restore code from GitHub. |

### 3.3 Project Activities Plan

The CHEA project development plan is formalized in a Gantt chart, outlining a phased approach from February to April. This schedule provides a clear roadmap, ensuring effective time and resource management while serving as a primary risk mitigation strategy against any potential delays. The entire project is divided into distinct phases, with the deadlines aligning strictly with the academic calendar.

**Phase 1 (Weeks 1-3):** The foundational phase of our project includes Requirement Collection and Literature Review. This stage is primarily dedicated to the initiation of the project, during which the overall scope is defined and the needs and expectations of the intended users are systematically identified. Additionally, a comprehensive review of existing literature, related research, and competitor solutions is conducted to establish a solid theoretical and practical foundation of the project. This process identifies potential gaps, and informs the subsequent stages of system design and development.

**Phase 2 (Weeks 4-6):** This phase includes Design and Implementation activities. During this stage, the focus shifts towards development of the system's architectural framework, ensuring that the overall structure effectively supports the project's functional and non-functional requirements. Furthermore, this phase involves the initiation of core module development, including the implementation of important system components, such as the Encryption/Decryption Tool, Password Management, and Threat Detector.

**Phase 3 (Weeks 7-9):** This phase is committed entirely to Testing and Results. During this stage, the developed system will undergo comprehensive testing to ensure all the components of the system function properly and meet all the requirements. The testing process includes system testing, which will verify the integration and overall functionality of the system. Furthermore, a test will be conducted with the target demographic to evaluate the usability, reliability and user satisfaction. Additionally, this phase will also involve identifying and resolving bugs and system errors.

**Phase 4 (Weeks 10-12):** This phase focuses on Report Writing. Our team will compile the final project documentation, including details on system design, implementation details, testing results, and conclusions.

**Phase 5 (Weeks 13-14):** The final phase will focus on project delivery and formal conclusion, including Presentation preparation and Poster Design for College Exhibition.

---

## Chapter 4: Requirements Collection

### 4.1 Requirement Elicitation

Requirements Elicitation is the process of discovering and documenting the precise needs of the system from its stakeholders. For our project CHEA, this crucial phase was accomplished through two primary methods: a systematic literature review of existing cybersecurity education research, and an online survey targeting the intended user base of children aged 8-18.

#### 4.1.1 Literature Review Findings

A systematic literature review was conducted, examining 23 peer-reviewed sources and analyzing 6 major existing platforms (Hack The Box, KnowBe4, Google Interland, VirusTotal, Bitwarden and Kaspersky). The review aimed to identify gaps between current cybersecurity threats facing students and the educational responses designed to address them.

**Key Findings from the Literature Review:**

| Finding | Source | Suggestions for CHEA |
|---------|--------|---------------------|
| 81% of data breaches stem from weak passwords, while 94% of malware arrives via email. | Verizon DBIR (2021) | Password and email security must be core features. |
| The education sector has seen 300% increase in cyberattacks since 2020. | Check Point Research (2022) | Validates need for student-focused security tools. |
| Password and email security receive the least attention in educational literature. | Ibrahim et al. (2024) | CHEA must address these ignored topics. |
| Existing tools are fragmented, forcing users to choose between education and protection. | Kennedy and Chiasson (2021) | CHEA must integrate both practical and educational tools. |
| Gamification significantly improves engagement and knowledge maintenance in security context. | Pramod (2025), Khairallah and Abu-Naseer (2024) | Game-based learning is important for student engagement. |
| Existing interfaces assume adult cognitive processing and technical vocabulary. | Sağlam and Miller (2023) | Age-appropriate designs with feedback is needed. |

The literature review also identified five critical research gaps that directly inform CHEA's requirements: the Tool Integration Gap, Age-Appropriateness Gap, Education-Protection Gap, Engagement and Motivation Gap, and Accessibility Gap. These gaps collectively justify the need for an integrated, free, gamified cybersecurity education platform targeting students aged 8-15.

#### 4.1.2 Online Survey

To balance the literature review and gather data from the target audience, an online survey was conducted. The survey targeted children aged 8-18, as this age group represented the primary users of the proposed applications. **69 responses were collected.**

**Survey Demographics:**

| Category | Percentage | Number of Respondents |
|----------|:----------:|:---------------------:|
| Age 8-12 | 11.6% | 8 |
| Age 13-15 | 13% | 9 |
| Age 16-18 | 75.4% | 52 |

**Summary of Survey Findings:**

The survey revealed several critical insights about students' online behaviors and security awareness. Regarding online threats, **72.5%** of respondents had encountered messages offering free items, **65.2%** have seen websites that looked fake, and **37.7%** had received suspicious emails asking for personal information, confirming that students regularly face common cyber threats.

In terms of password practices, **65.2%** of respondents admitted to using either the same password for everything or only slightly varying their passwords across accounts. This indicated a clear need for password education tools. Furthermore, almost half of the respondents stated that they do not know how to tell if a link is safe to click, while **44.9%** admitted they would click a link sent by a friend immediately without verification. These findings highlight significant gaps in both knowledge and behavior.

When asked about desired features, password generators and URL checkers were the most frequently selected tools and **89.9%** of respondents expressed interest in having a friendly AI assistant within the app to explain why a link or password is unsafe. Learning preference favored gamified approaches with points and rewards and using different tools to learn from. Finally, respondents revealed strong interest in an integrated platform combining security tools, learning and games — with most indicating they would likely use such an application.

This requirement elicitation process ensures that the CHEA system is built upon both established academic research and direct input from the target user base, maximizing the likelihood of adoption, engagement and educational effectiveness.

## 4.2 System Requirements

From our literature review of 26 peer-reviewed sources and a survey of 69 students, we identified what CHEA needed to actually do. This section lays out the functional and non-functional requirements we worked from.

### 4.2.1 Functional Requirements

These are the features CHEA had to implement. We derived them directly from the research gaps in the literature (Ibrahim et al., 2024; Zhang-Kennedy and Chiasson, 2021) and confirmed them through our survey — students genuinely want integrated security tools in one place, not scattered across different apps.

**Table 4.1: Functional Requirements**

| Req. ID | Requirement | Description |
|---------|-------------|-------------|
| FR-01 | Password Generation and Strength Analysis | The system shall allow users to generate cryptographically secure passwords with configurable parameters (length, character types) and analyse the strength of existing passwords by calculating entropy, estimating crack time, and detecting common patterns such as sequences, repeats, and known weak passwords. |
| FR-02 | Credential Vault with Encryption | The system shall provide an encrypted vault for storing login credentials and credit card details, protected by a user-defined master password. All sensitive data shall be encrypted client-side using AES-256-GCM before storage in the cloud database. The system shall support adding, viewing, copying, searching, and deleting credentials, and shall verify the master password without storing it in plaintext. |
| FR-03 | URL Link Scanning | The system shall allow users to submit URLs for security analysis via the VirusTotal API. The system shall display the scan result (malicious, suspicious, or clean), the number of detections from 70+ security engines, aggregate statistics (malicious, suspicious, harmless, undetected counts), and a community reputation score. The system shall maintain a scan history of the last 10 scans. |
| FR-04 | File Malware Scanning | The system shall allow users to scan files for malware by computing a local SHA-256 hash, checking the hash against VirusTotal's database, and uploading unknown files for analysis. The system shall display file metadata (name, size, hash), detection results from multiple engines, and provide quarantine or deletion actions for files identified as malicious. |
| FR-05 | Text Encryption and Decryption | The system shall allow users to encrypt and decrypt text messages using three algorithms: AES-256-GCM, ChaCha20-Poly1305, and AES-128-CBC. All key derivation shall use Argon2id with a random salt per operation. The system shall produce Base64-encoded output suitable for sharing and shall support round-trip encryption and decryption with password verification. |
| FR-06 | AI-Powered Cybersecurity Chatbot | The system shall provide an AI chatbot that answers cybersecurity-related questions via the OpenRouter API with streaming responses. The chatbot shall support multiple chat sessions, session history, markdown rendering, and Mermaid diagram generation. The system shall restrict the chatbot to cybersecurity and AI topics only. |
| FR-07 | Phishing Email Recognition Training | The system shall provide a gamified phishing identification exercise across three difficulty tiers (Cadet for levels 1-3, Analyst for levels 4-6, Operator for levels 7+). Each round shall present emails that users classify as phishing or legitimate, with detailed feedback including red flag explanations for each email. The system shall calculate XP based on correct identifications, streak bonuses, and completion bonuses. |
| FR-08 | Cybersecurity Knowledge Quiz | The system shall provide a quiz game with cybersecurity trivia questions across multiple difficulty tiers. The quiz shall track scores, award XP for correct answers with streak and completion bonuses, and log results to the user's activity history. |
| FR-09 | Image Privacy Scanner | The system shall scan JPEG and PNG images for EXIF metadata, extracting camera information, GPS coordinates (with Google Maps URL generation), timestamps, and camera settings. The system shall provide a metadata stripping function that removes all EXIF data while preserving the image pixel data. |
| FR-10 | Gamification and Progress Tracking | The system shall implement a gamification framework with experience points (XP), a 10-tier level progression system (Novice through Omniscient), daily streak tracking, and daily task objectives. XP shall be awarded for tool usage, quiz completion, and phishing identification. The system shall display real-time progress indicators including level title, XP progress bar, streak counter, and security score. |

### 4.2.2 Non-Functional Requirements

These are the quality constraints we had to meet. The literature pointed out gaps in age-appropriate design (Sağlam and Miller, 2023) and accessibility, so we paid extra attention to those areas.

**Table 4.2: Non-Functional Requirements**

| Req. ID | Category | Requirement |
|---------|----------|-------------|
| NFR-01 | Security | All sensitive user data (vault credentials, encrypted messages) shall be encrypted client-side using AES-256-GCM with Argon2id key derivation before transmission to the cloud database. API keys for external services (VirusTotal, OpenRouter) shall be stored exclusively in the Rust backend binary and shall not be exposed in the frontend JavaScript context or network traffic. |
| NFR-02 | Usability | The system interface shall be designed for students aged 9-15, using visual indicators (colour-coded strength meters, status badges), non-technical language, icon-based navigation, and a cyberpunk-themed aesthetic that appeals to younger users. All core features shall be accessible within three clicks from the dashboard. |
| NFR-03 | Performance | Local cryptographic operations (encryption, decryption, hashing, EXIF scanning) shall complete in under 500 milliseconds. Application cold start shall not exceed 5 seconds. Page navigation between dashboard sections shall complete in under 300 milliseconds. External API operations (VirusTotal scanning, AI chatbot) shall display loading indicators and shall timeout after 120 seconds. |
| NFR-04 | Reliability | The system shall handle API failures gracefully by displaying user-friendly error messages and providing retry mechanisms. The Firestore REST API workaround shall ensure database operations function correctly within the Tauri WebView2 environment. The AI chatbot shall implement model fallback to maintain service availability when the primary model is unavailable. |
| NFR-05 | Portability | The system shall be packaged as a native desktop application using Tauri v2, supporting Windows (via WebView2) and macOS (via WebKit) from a single codebase. The application binary shall not exceed 10 MB, and runtime memory usage shall remain below 200 MB under normal operation. |
| NFR-06 | Accessibility | The system shall support both light and dark mode themes, with automatic detection of the operating system's colour scheme preference. All interactive elements shall be reachable via keyboard navigation. Text shall maintain a minimum contrast ratio compliant with WCAG 2.1 AA guidelines. The interface shall support right-to-left (RTL) text rendering for Arabic language content. |
| NFR-07 | Maintainability | The frontend codebase shall be organised into a modular structure separating components, pages, services, stores, and utilities. All TypeScript code shall pass strict type-checking with zero `any` types. ESLint shall enforce consistent code style across the project. |
| NFR-08 | Privacy | The system shall not collect, transmit, or store any user data without explicit user action. The master password for the credential vault shall never be transmitted to any server. All encryption and decryption operations shall be performed exclusively on the user's local device via the Rust backend. |

---

## 4.3 System Models

To design CHEA properly, we needed clear models of how the system would work — how it's structured, how data flows through it, and how the database is organised. These models turned our requirements into something we could actually build from.

### 4.3.1 System Architecture

We went with a layered architecture because it keeps things clean: the UI doesn't need to know about crypto, the crypto code doesn't need to know about databases, and so on. We split CHEA into five layers. The full architecture is shown in `system-architecture.drawio` (see Figure 4.1).

**Figure 4.1: CHEA System Architecture** (Reference: `system-architecture.drawio`)

**Presentation Layer:** This is the React 18 + TypeScript frontend, rendered inside a Tauri WebView2 container. It includes the dashboard layout, all 11 feature pages (Link Scanner, File Scanner, Password Generator, Encryption Lab, Credential Vault, AI Agent, Quiz Arena, Phishing Dojo, Image Privacy), authentication forms, and the custom title bar. We used Tailwind CSS for styling with a cyberpunk/neon design system that supports both light and dark themes, and Framer Motion for page transition animations. The presentation layer talks only to the business logic layer through React component props, Zustand state stores, and Tauri IPC calls.

**Business Logic Layer:** This layer sits between the UI and the Rust backend. It's made up of Zustand stores (`useAuthStore`, `useActivityStore`, `useUserProgressStore`, `useDailyTasksStore`) and Firebase service modules (`vaultService`, `credentialService`, `chatService`, `activityService`, `userProgressService`, `dailyTasksService`, `quizService`, `phishingService`). It handles auth state, gamification logic (XP calculation, level progression, streak tracking), activity logging, and data formatting between frontend and backend. The `useTrackActivity` custom hook is the central piece here — whenever a user completes a security action, this hook logs the activity, awards XP, and updates daily tasks all at once.

**Backend Processing Layer:** This is the Rust side of things. We implemented it as a set of Tauri command modules that handle anything computationally heavy or security-sensitive — things we didn't want running in JavaScript. The modules are: `crypto.rs` (AES-256-GCM, ChaCha20-Poly1305, AES-128-CBC encryption with Argon2id key derivation), `virustotal.rs` (URL and file scanning via VirusTotal API v3), `ai_agent.rs` (streaming chat via OpenRouter API with Server-Sent Events), `image_privacy.rs` (EXIF metadata scanning and stripping for JPEG/PNG), `terminal.rs` (pseudo-terminal emulation), and `diagram.rs` (Mermaid diagram export). The frontend calls these through Tauri's IPC mechanism (`invoke`), which serialises parameters as JSON and returns results asynchronously.

**Data Layer:** We used Firebase Firestore, a NoSQL cloud database. Data is organised hierarchically under `users/{userId}/`, with subcollections for vault credentials, chat sessions, user progress, daily tasks, and activity logs. One issue we ran into early on: WebView2 doesn't support Firestore's gRPC-web transport, so we had to build a custom REST API helper (`firestore-rest.ts`) that does database operations through standard HTTPS fetch calls with Firebase ID token auth. It was frustrating to debug, but it works reliably now.

**External Services Layer:** These are the third-party APIs CHEA connects to. VirusTotal API v3 handles URL and file threat analysis using 70+ security engines. OpenRouter API gives us access to large language models (we use Qwen 3.6 Plus) for the AI chatbot. Firebase Auth manages user authentication (email/password registration, login, password reset). All API keys are stored in the Rust backend — they never reach the frontend.

### 4.3.2 Use Case Model

We identified four main actors that interact with CHEA. The use case diagram is shown in `use-case-diagram.drawio` (see Figure 4.2).

**Figure 4.2: CHEA Use Case Diagram** (Reference: `use-case-diagram.drawio`)

**Actors:**

1. **Student (Primary Actor):** The main user, aged 9-15. They interact with all the security tools, educational features, and gamification elements. Everything in CHEA revolves around this actor.

2. **CHEA System:** The system itself acts as a secondary actor — it processes user inputs, manages state, runs cryptographic operations, and renders the UI.

3. **VirusTotal API:** An external system that receives URL and file scan requests from CHEA and returns threat analysis results including detection counts, engine-specific results, and reputation scores.

4. **OpenRouter AI API:** An external system that receives chat messages from CHEA and returns streaming cybersecurity educational responses via Server-Sent Events.

**Use Case Categories:**

*Security Tools:*
- UC-01: Generate Secure Password — The student configures password parameters (length, character types) and receives a cryptographically generated password.
- UC-02: Analyse Password Strength — The student inputs a password and receives an entropy-based strength rating with improvement suggestions.
- UC-03: Scan URL for Threats — The student submits a URL and receives a security analysis report from VirusTotal.
- UC-04: Scan File for Malware — The student selects a file and receives a malware detection report.
- UC-05: Encrypt/Decrypt Text — The student selects an encryption algorithm, enters a password and plaintext, and receives encrypted output (or vice versa for decryption).
- UC-06: Manage Credential Vault — The student sets up a master password, adds credentials, views decrypted data, copies fields, and deletes entries.
- UC-07: Scan Image Metadata — The student selects an image and receives EXIF data including GPS coordinates and camera settings.
- UC-08: Strip Image Metadata — The student selects an image and receives a cleaned version with all metadata removed.

*Educational Features:*
- UC-09: Chat with AI Assistant — The student asks cybersecurity questions and receives educational responses with streaming delivery.
- UC-10: Practise Phishing Identification — The student classifies emails as phishing or legitimate across difficulty tiers and receives feedback with red flag explanations.
- UC-11: Complete Cybersecurity Quiz — The student answers trivia questions and receives scores with XP rewards.

*System Operations:*
- UC-12: Register Account — The student creates an account with email and password.
- UC-13: Log In/Log Out — The student authenticates and manages sessions.
- UC-14: Track Progress — The system automatically awards XP, updates levels, tracks streaks, and manages daily tasks.

### 4.3.3 Data Flow Model

Here's how data actually flows through the system for our key features. The data flow diagram is shown in `data-flow-diagram.drawio` (see Figure 4.3).

**Figure 4.3: CHEA Data Flow Diagram** (Reference: `data-flow-diagram.drawio`)

**Process 1: URL Scanning**

URL scanning involves the frontend, Rust backend, and VirusTotal working together:

1. The student enters a URL in the Link Scanner interface (Data Store: User Input).
2. The React frontend validates the URL format and calls the Tauri IPC command `scan_url` with the URL as a parameter.
3. The Rust `virustotal.rs` module receives the URL, URL-encodes it, and submits a POST request to the VirusTotal `/urls` endpoint with the API key in the `x-apikey` header.
4. VirusTotal returns an analysis ID. The Rust module enters a polling loop, querying the `/analyses/{id}` endpoint at 4-second intervals.
5. When the analysis status becomes "completed," the Rust module parses the response into a `ScanResult` structure containing status, reputation, detections, and statistics.
6. The `ScanResult` is serialised as JSON and returned to the frontend via Tauri IPC.
7. The React frontend displays the results, logs the activity to Firestore (Data Store: Activity Log), awards XP to the user (Data Store: User Progress), and updates the daily task counter (Data Store: Daily Tasks).

**Process 2: Text Encryption**

The encryption pipeline runs entirely on the client side:

1. The student enters plaintext and a password in the Encryption Lab interface, and selects an algorithm (AES-256-GCM, ChaCha20-Poly1305, or AES-128-CBC).
2. The React frontend calls the Tauri IPC command `encrypt_text` with the plaintext, password, and algorithm.
3. The Rust `crypto.rs` module generates a random 16-byte salt using the OS cryptographic RNG (`OsRng`).
4. The module derives an encryption key from the password and salt using Argon2id (32 bytes for AES-256-GCM and ChaCha20-Poly1305, 16 bytes for AES-128-CBC).
5. A random nonce/IV is generated (12 bytes for GCM/ChaCha20, 16 bytes for CBC).
6. The plaintext is encrypted using the selected algorithm. For AES-128-CBC, PKCS#7 padding is applied.
7. The output (algorithm identifier, Base64-encoded salt, IV, and ciphertext) is serialised as a JSON `EncryptedPayload`, then Base64-encoded for transport.
8. The encrypted string is returned to the frontend and displayed to the student, who may copy it to the clipboard.

**Process 3: AI Chat Interaction**

The AI chat uses a streaming architecture so responses appear in real time:

1. The student types a message in the AI Agent chat interface.
2. The React frontend calls the Tauri IPC command `chat_with_ai` with the message and conversation history, passing a Tauri `Channel` for streaming.
3. The Rust `ai_agent.rs` module prepends the cybersecurity-only system prompt and sends a streaming POST request to the OpenRouter API.
4. OpenRouter returns a Server-Sent Events (SSE) stream. The Rust module reads `data:` lines, extracts content chunks from `choices[0].delta.content`.
5. Each content chunk is immediately sent to the frontend via the Tauri Channel, enabling character-by-character rendering.
6. The `data: [DONE]` marker signals stream completion.
7. The frontend renders the complete message with markdown formatting, logs the activity, and awards XP.

### 4.3.4 Entity Relationship Model

Our database uses Firebase Firestore, which is a NoSQL document database — so instead of traditional relational tables, we have collections and documents organised in a hierarchy. Here's how we structured it. The entity relationship diagram is shown in `entity-relationship-diagram.drawio` (see Figure 4.4).

**Figure 4.4: CHEA Entity Relationship Diagram** (Reference: `entity-relationship-diagram.drawio`)

All data lives under the `users/{userId}` path. This keeps each user's data isolated and makes queries within a user's context fast.

**Root Collection: `users`**

Each document in the `users` collection represents a registered user, with their Firebase Authentication UID as the document ID. This is the parent for all user-specific subcollections.

**Subcollection: `vault`**

The `vault` subcollection stores individual credential entries. Each document contains:

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Display name for the credential (e.g., "GitHub", "School Email") |
| `username` | String | Username or email associated with the account |
| `domain` | String | Website domain or service name |
| `type` | String | Credential type: "login" or "card" |
| `encryptedData` | String | Base64-encoded encrypted payload containing the password or card details |
| `createdAt` | Timestamp | Document creation timestamp |

The `encryptedData` field stores the AES-256-GCM encrypted ciphertext produced by the Rust `crypto.rs` module. Only the encrypted payload is sent to Firestore — decryption always happens on the user's device.

**Subcollection: `vaultConfig`**

The `vaultConfig` subcollection contains a single document with the ID `main`, storing the vault master password verification hash:

| Field | Type | Description |
|-------|------|-------------|
| `encryptedVerifyHash` | String | AES-256-GCM encrypted verification string |

When the user sets up the vault, we encrypt a fixed verification string with their master password and store it. To unlock the vault, the system decrypts this hash and checks it against the expected value — so we can verify the master password without ever storing it in plaintext.

**Subcollection: `progress`**

The `progress` subcollection contains a single document with the ID `data`, storing the user's gamification state:

| Field | Type | Description |
|-------|------|-------------|
| `xp` | Number | Total experience points accumulated |
| `level` | Number | Current level (1-10) |
| `totalScore` | Number | Cumulative score across all activities |
| `streakDays` | Number | Consecutive days of activity |
| `lastActiveDate` | String | ISO date string of the last active day |
| `createdAt` | Timestamp | Progress document creation timestamp |

**Subcollection: `dailyTasks`**

The `dailyTasks` subcollection stores date-keyed documents (e.g., `2025-04-10`) containing the user's daily task progress:

| Field | Type | Description |
|-------|------|-------------|
| `tasks` | Array | Array of task objects, each containing `id`, `type`, `description`, `target`, `current`, `points`, and `completed` status |

Seven daily task types are defined: scan, generate_password, check_password, create_credential, use_encryption, play_quiz, and spot_phish.

**Subcollection: `activities`**

The `activities` subcollection stores an activity log with entries documenting each security action performed by the user:

| Field | Type | Description |
|-------|------|-------------|
| `type` | String | Activity type (e.g., `scan_link`, `generate_password`, `quiz_round`) |
| `metadata` | Object | Additional context about the activity |
| `timestamp` | Timestamp | Time the activity was performed |

**Subcollection: `chatSessions`**

The `chatSessions` subcollection stores AI chat session metadata, with a nested `messages` subcollection for individual messages:

*Session document fields:*

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Session title (auto-generated from first message) |
| `createdAt` | Timestamp | Session creation time |
| `updatedAt` | Timestamp | Last message timestamp |

*Message document fields (within `chatSessions/{sessionId}/messages/`):*

| Field | Type | Description |
|-------|------|-------------|
| `role` | String | Message sender: "user" or "assistant" |
| `content` | String | Message text content |
| `timestamp` | Timestamp | Message timestamp |

The relationship between these entities is strictly hierarchical: a user owns multiple vault credentials, one vault configuration, one progress record, multiple daily task records, multiple activity log entries, and multiple chat sessions, each containing multiple messages. This parent-child structure enforces data isolation at the Firestore security rule level.

---

# Chapter 5: System Design

## 5.1 Database Schema Design

We chose Firebase Firestore as our database because it offers real-time sync, automatic scaling, and integrates natively with Firebase Auth — all things we needed. The schema was designed around CHEA's core functions: storing credentials, tracking gamification progress, logging activities, and managing AI chat sessions.

All data is scoped under `users/{userId}` so each user's data stays isolated. The complete Firestore schema is presented in Table 5.1.

**Table 5.1: Complete Firestore Database Schema**

| Collection Path | Document ID | Field Name | Data Type | Constraints | Description |
|-----------------|-------------|------------|-----------|-------------|-------------|
| `users/{userId}/vault` | Auto-generated | `name` | String | Required | Display name for the credential |
| | | `username` | String | Required | Username or email |
| | | `domain` | String | Optional | Website domain |
| | | `type` | String | Required: "login" \| "card" | Credential type |
| | | `encryptedData` | String | Required | Base64 AES-256-GCM ciphertext |
| | | `createdAt` | Timestamp | Auto | Creation timestamp |
| `users/{userId}/vaultConfig` | `main` | `encryptedVerifyHash` | String | Required | Encrypted master password verification string |
| `users/{userId}/progress` | `data` | `xp` | Number | Default: 0 | Total experience points |
| | | `level` | Number | Range: 1-10 | Current user level |
| | | `totalScore` | Number | Default: 0 | Cumulative score |
| | | `streakDays` | Number | Default: 0 | Consecutive active days |
| | | `lastActiveDate` | String | ISO 8601 date | Last activity date |
| | | `createdAt` | Timestamp | Auto | Initialisation timestamp |
| `users/{userId}/dailyTasks` | ISO date string (e.g., "2025-04-10") | `tasks` | Array of Objects | Required | Daily task list with id, type, description, target, current, points, completed |
| `users/{userId}/activities` | Auto-generated | `type` | String | Required | Activity identifier |
| | | `metadata` | Map | Optional | Activity context data |
| | | `timestamp` | Timestamp | Auto | Activity time |
| `users/{userId}/chatSessions` | Auto-generated | `title` | String | Required | Session title |
| | | `createdAt` | Timestamp | Auto | Session creation time |
| | | `updatedAt` | Timestamp | Auto | Last update time |
| `users/{userId}/chatSessions/{sessionId}/messages` | Auto-generated | `role` | String | Required: "user" \| "assistant" | Message sender |
| | | `content` | String | Required | Message text |
| | | `timestamp` | Timestamp | Auto | Message time |

For vault credentials, we use client-side encryption. When a user saves a credential, the Rust `crypto.rs` module encrypts the plaintext password with AES-256-GCM using the user's master password. Only the Base64-encoded ciphertext (`encryptedData`) gets sent to Firestore. This means even if Firestore were compromised, the stored credentials would still be encrypted and useless without the master password.

## 5.2 User Interface Design

We went with a cyberpunk/neon aesthetic because our target users are students aged 9-15, and we wanted something that feels more like a game than a security tool. The dark theme uses deep navy backgrounds with neon crimson accents and glowing UI elements. Navigation runs through a persistent sidebar with icon-labelled sections. Both light and dark themes are supported. Here are the five key interfaces.

### 5.2.1 Dashboard Interface

The Dashboard is the central hub — it's the first thing users see after logging in, and it gives them an overview of their security progress and gamification stats. It displays:

- **User Profile Section:** Shows the user's avatar (generated from initials), display name, and current level title with a colour-coded badge (Bronze for levels 1-3, Silver for 4-6, Gold for 7+).
- **XP Progress Bar:** An animated progress bar showing the user's current XP relative to the next level threshold, with the numerical XP value displayed.
- **Streak Counter:** Displays the number of consecutive active days with a flame icon, encouraging daily engagement.
- **Security Score:** A composite score (0-100) calculated from XP, streak days, vault items, activities, and completed tasks.
- **Daily Tasks Panel:** A list of seven daily objectives (scan a link, generate a password, check password strength, save a credential, use encryption, play quiz, spot phishing) with progress indicators and completion checkmarks.
- **Recent Activity Feed:** Displays the last 15 activities with icons, descriptions, and timestamps.
- **Quick Access Grid:** A grid of cards providing one-click navigation to all 11 security tools, organised by category (Scanning Tools, Password Tools, Encryption & Vault, Game Zone).

The flow is straightforward: the user logs in, lands on the Dashboard, and can navigate anywhere from there. Every action they complete automatically updates the XP, streak, and activity feed in real time.

### 5.2.2 Password Generator Interface

The Password Generator is a focused tool for creating cryptographically secure passwords. It includes:

- **Configuration Panel:** A set of controls including a length slider (6-64 characters), toggle switches for character types (uppercase, lowercase, numbers, symbols), an "exclude confusing characters" checkbox, and preset buttons (Easy: 8, Good: 12, Strong: 16, Super: 24).
- **Generated Password Display:** A large text field showing the generated password with a copy-to-clipboard button and a regenerate button.
- **Strength Indicator:** An animated colour-coded meter (Too Weak in red, Weak in orange, Fair in yellow, Strong in green, Very Strong in emerald, Super Strong in cyan) with entropy bits and character distribution information.
- **Educational Tips:** Contextual tips explaining why password length and character variety matter, displayed below the generator.

The user adjusts the settings and the password generates automatically (and regenerates whenever a setting changes). Copying the password awards +10 XP, logs the activity, and increments the daily task counter.

### 5.2.3 Link Scanner Interface

The Link Scanner checks URLs against VirusTotal. It includes:

- **URL Input Field:** A text input with a "Scan" button, featuring a link icon and placeholder text prompting the user to enter a URL.
- **Scan History:** A collapsible list of the last 10 scanned URLs with status badges (green checkmark for clean, red warning for malicious, yellow alert for suspicious).
- **Results Panel:** Upon scan completion, displays:
  - **Status Badge:** Large colour-coded badge showing "Clean," "Suspicious," or "Malicious."
  - **Statistics Summary:** Four stat cards showing counts for malicious, suspicious, harmless, and undetected engines.
  - **Reputation Score:** A numerical community reputation indicator.
  - **Engine Results Table:** A detailed table listing each security engine's detection result and category, sortable by engine name.

The user enters a URL and clicks "Scan." A loading animation plays while the Rust backend submits the URL to VirusTotal and polls for results (usually 12-18 seconds). Once done, the results panel animates in. The user earns +10 XP, the scan is logged, and the daily scan task is incremented.

### 5.2.4 Phishing Dojo Interface

The Phishing Dojo is a gamified training exercise for spotting phishing emails. It includes:

- **Difficulty Selection:** Three tier buttons (Cadet, Analyst, Operator) corresponding to the user's level range, each with a distinct colour and description.
- **Email Display:** A simulated email client view showing the sender name, sender email address, subject line, and body text of the current email, rendered in a realistic email layout.
- **Classification Buttons:** Two large buttons — "Phishing!" (red) and "Legitimate" (green) — for the user to classify the email.
- **Feedback Panel:** After classification, a detailed feedback section slides in showing:
  - **Correct/Incorrect Indicator:** Visual confirmation of whether the user's classification was correct.
  - **Red Flags List:** For phishing emails, a list of identified red flags with explanations (e.g., "Suspicious Sender," "Fake Domain," "Urgency Tactics").
  - **Explanation:** A paragraph explaining why the email is or is not phishing, written in student-friendly language.
- **Progress Tracker:** Shows the current round number, correct count, streak count, and accumulated XP for the session.

The user picks a difficulty tier (automatically matched to their level), and 5 emails are shown one at a time. They read each email and classify it, getting immediate feedback. After all 5, a summary screen shows the total score, XP earned (base XP + streak bonus + completion bonus), and an option to play again.

### 5.2.5 Credential Vault Interface

The Credential Vault stores login credentials and credit card details securely. It includes:

- **Vault Lock/Unlock Screen:** Before accessing the vault, the user must enter their master password. First-time users see a "Set Up Vault" flow where they create and confirm a master password. The vault uses an encrypted hash stored in Firestore to verify the password — the master password is never stored in plaintext.
- **Credential List:** A searchable list of stored credentials, each displayed as a card showing the service name, username (partially masked), and type icon (login or card).
- **Credential Detail View:** Clicking a credential expands it to show the full username (with copy button), password (masked by default, with reveal toggle and copy button), and domain. For card-type credentials, a visual card display with gradient background shows the card brand (Visa, Mastercard, Amex, Discover), number, and holder name.
- **Add Credential Form:** A form with fields for service name, username/email, password (with a built-in password generator), and credential type. All data is encrypted client-side before storage.
- **Delete Confirmation:** A confirmation dialog before removing a credential.

The user navigates to the Vault, enters their master password to unlock it, and views their saved credentials. They can add new credentials (encrypted with AES-256-GCM), copy usernames and passwords to the clipboard, reveal masked passwords, and delete entries. Each save action awards +10 XP.

## 5.3 Algorithm Design

This section covers the pseudocode for the core algorithms we implemented: password encryption/decryption, URL scanning with polling, and XP calculation with level progression.

### 5.3.1 Password Encryption and Decryption Algorithm

The encryption algorithm uses AES-256-GCM with Argon2id key derivation, implemented in the Rust `crypto.rs` module. We use the same algorithm for both the Encryption Lab feature and the Credential Vault.

**Algorithm 5.1: Encrypt Text with AES-256-GCM**

```
FUNCTION encrypt_text(plaintext, password, algorithm):
    // Step 1: Generate random salt (128 bits)
    salt ← generate_random_bytes(16)

    // Step 2: Derive encryption key using Argon2id
    IF algorithm = "AES-256-GCM" OR algorithm = "ChaCha20-Poly1305" THEN
        key_length ← 32
    ELSE IF algorithm = "AES-128-CBC" THEN
        key_length ← 16
    END IF
    key ← argon2id_derive(password, salt, key_length)

    // Step 3: Generate random nonce/IV
    IF algorithm = "AES-256-GCM" OR algorithm = "ChaCha20-Poly1305" THEN
        nonce ← generate_random_bytes(12)
    ELSE IF algorithm = "AES-128-CBC" THEN
        iv ← generate_random_bytes(16)
    END IF

    // Step 4: Encrypt plaintext
    IF algorithm = "AES-256-GCM" THEN
        ciphertext ← AES_256_GCM_encrypt(key, nonce, plaintext)
        // ciphertext includes 16-byte authentication tag
    ELSE IF algorithm = "ChaCha20-Poly1305" THEN
        ciphertext ← ChaCha20_Poly1305_encrypt(key, nonce, plaintext)
        // ciphertext includes 16-byte authentication tag
    ELSE IF algorithm = "AES-128-CBC" THEN
        padded_plaintext ← PKCS7_pad(plaintext, 16)
        ciphertext ← AES_128_CBC_encrypt(key, iv, padded_plaintext)
    END IF

    // Step 5: Build and serialise payload
    payload ← {
        alg: algorithm,
        salt: base64_encode(salt),
        iv: base64_encode(nonce OR iv),
        ct: base64_encode(ciphertext)
    }
    json_string ← serialise_to_json(payload)
    result ← base64_encode(json_string)

    RETURN result
END FUNCTION
```

**Algorithm 5.2: Decrypt Text**

```
FUNCTION decrypt_text(encoded_string, password):
    // Step 1: Decode outer Base64 layer
    json_bytes ← base64_decode(encoded_string)
    json_string ← utf8_decode(json_bytes)
    payload ← deserialise_from_json(json_string)

    // Step 2: Decode payload fields
    salt ← base64_decode(payload.salt)
    iv ← base64_decode(payload.iv)
    ciphertext ← base64_decode(payload.ct)

    // Step 3: Derive key using same parameters
    IF payload.alg = "AES-256-GCM" OR payload.alg = "ChaCha20-Poly1305" THEN
        key ← argon2id_derive(password, salt, 32)
    ELSE IF payload.alg = "AES-128-CBC" THEN
        key ← argon2id_derive(password, salt, 16)
    END IF

    // Step 4: Decrypt and verify
    IF payload.alg = "AES-256-GCM" THEN
        plaintext ← AES_256_GCM_decrypt(key, iv, ciphertext)
        // Authenticated decryption: fails if tampered
    ELSE IF payload.alg = "ChaCha20-Poly1305" THEN
        plaintext ← ChaCha20_Poly1305_decrypt(key, iv, ciphertext)
    ELSE IF payload.alg = "AES-128-CBC" THEN
        decrypted ← AES_128_CBC_decrypt(key, iv, ciphertext)
        plaintext ← PKCS7_unpad(decrypted)
    END IF

    // Step 5: Handle errors
    IF decryption_failed THEN
        RETURN error("Wrong password or corrupted data")
    END IF

    RETURN utf8_decode(plaintext)
END FUNCTION
```

One thing worth noting: every encryption operation generates a unique random salt and nonce. This means encrypting the same text with the same password produces different ciphertext each time. That's important because it prevents precomputation and rainbow table attacks. The AEAD modes (AES-256-GCM, ChaCha20-Poly1305) also provide authenticated encryption, so any tampering with the ciphertext is caught during decryption.

### 5.3.2 URL Scanning with VirusTotal Polling Algorithm

VirusTotal doesn't return scan results instantly — it gives you an analysis ID and you have to poll for the result. We implemented this polling mechanism in the Rust `virustotal.rs` module.

**Algorithm 5.3: Scan URL with Polling**

```
FUNCTION scan_url(target_url):
    // Step 1: Submit URL to VirusTotal
    client ← create_http_client(timeout = 120 seconds)
    encoded_body ← url_encode("url=" + target_url)

    response ← client.POST(
        url: "https://www.virustotal.com/api/v3/urls",
        headers: { "x-apikey": API_KEY, "content-type": "application/x-www-form-urlencoded" },
        body: encoded_body
    )

    IF response.status ≠ 200 THEN
        RETURN error("API error: " + response.body)
    END IF

    // Step 2: Extract analysis ID
    json ← parse_json(response.body)
    analysis_id ← json.data.id

    // Step 3: Poll for completion
    attempts ← 0
    max_attempts ← 30

    WHILE attempts < max_attempts DO
        sleep(4 seconds)
        attempts ← attempts + 1

        poll_response ← client.GET(
            url: "https://www.virustotal.com/api/v3/analyses/" + analysis_id,
            headers: { "x-apikey": API_KEY }
        )

        IF poll_response.status ≠ 200 THEN
            CONTINUE  // Retry on transient errors
        END IF

        poll_json ← parse_json(poll_response.body)
        status ← poll_json.data.attributes.status

        IF status = "completed" THEN
            // Step 4: Parse results
            stats ← poll_json.data.attributes.stats
            detections ← extract_detections(poll_json.data.attributes.results)

            scan_result ← {
                target: target_url,
                status: determine_status(stats.malicious, stats.suspicious),
                reputation: poll_json.data.attributes.reputation,
                detections: detections,
                stats: {
                    malicious: stats.malicious,
                    suspicious: stats.suspicious,
                    harmless: stats.harmless,
                    undetected: stats.undetected
                }
            }
            RETURN scan_result
        END IF
    END WHILE

    RETURN error("Scan timeout. Please try again later.")
END FUNCTION

FUNCTION determine_status(malicious_count, suspicious_count):
    IF malicious_count > 0 THEN RETURN "malicious"
    IF suspicious_count > 0 THEN RETURN "suspicious"
    RETURN "clean"
END FUNCTION
```

We poll at 4-second intervals with a maximum of 30 attempts, giving roughly 2 minutes total. In practice, most scans finish in 3-4 polls (12-16 seconds). We went with 4 seconds because VirusTotal's documentation recommends not polling too aggressively, and it felt like a good balance between responsiveness and not hammering their API. File scanning follows the same pattern but adds a preliminary SHA-256 hash check to skip the upload for files that have already been scanned.

### 5.3.3 XP Calculation and Level Progression Algorithm

The gamification system calculates XP awards and handles level progression. We implemented this in the TypeScript `userProgressService.ts` module.

**Algorithm 5.4: Calculate Phishing Dojo XP**

```
FUNCTION calculate_phishing_xp(correct_calls, streak, total_emails):
    // Base XP: 3 points per correct identification
    base_xp ← correct_calls × 3

    // Streak bonus: 1 point per consecutive correct answer beyond the first
    IF streak > 1 THEN
        streak_bonus ← (streak - 1) × 1
    ELSE
        streak_bonus ← 0
    END IF

    // Completion bonus: reward for identifying all or most emails correctly
    IF correct_calls = total_emails THEN
        completion_bonus ← 10  // Perfect score
    ELSE IF correct_calls ≥ 3 THEN
        completion_bonus ← 5   // Good performance
    ELSE
        completion_bonus ← 0
    END IF

    total_xp ← base_xp + streak_bonus + completion_bonus
    RETURN { base_xp, streak_bonus, completion_bonus, total_xp }
END FUNCTION
```

**Algorithm 5.5: Level Progression**

```
// Level thresholds (10 tiers)
LEVEL_THRESHOLDS ← [
    { level: 1, xp: 0, title: "Novice" },
    { level: 2, xp: 100, title: "Apprentice" },
    { level: 3, xp: 300, title: "Guardian" },
    { level: 4, xp: 600, title: "Defender" },
    { level: 5, xp: 1000, title: "Sentinel" },
    { level: 6, xp: 1500, title: "Champion" },
    { level: 7, xp: 2200, title: "Hero" },
    { level: 8, xp: 3000, title: "Legend" },
    { level: 9, xp: 4000, title: "Mythic" },
    { level: 10, xp: 5500, title: "Omniscient" }
]

FUNCTION get_level_info(total_xp):
    current_level ← LEVEL_THRESHOLDS[0]
    next_level ← LEVEL_THRESHOLDS[1]

    // Find highest threshold that XP meets or exceeds
    FOR i FROM LENGTH(LEVEL_THRESHOLDS) - 1 DOWNTO 0 DO
        IF total_xp ≥ LEVEL_THRESHOLDS[i].xp THEN
            current_level ← LEVEL_THRESHOLDS[i]
            IF i + 1 < LENGTH(LEVEL_THRESHOLDS) THEN
                next_level ← LEVEL_THRESHOLDS[i + 1]
            ELSE
                next_level ← LEVEL_THRESHOLDS[i]  // Max level
            END IF
            BREAK
        END IF
    END FOR

    xp_in_level ← total_xp - current_level.xp
    xp_needed ← next_level.xp - current_level.xp
    progress ← (xp_in_level / xp_needed) × 100

    RETURN { level, title, xp_for_next, xp_in_level, progress }
END FUNCTION

FUNCTION add_xp(user_id, points):
    progress ← fetch_user_progress(user_id)
    today ← current_date_iso_string()
    yesterday ← previous_day_iso_string()

    new_xp ← progress.xp + points
    level_info ← get_level_info(new_xp)

    // Streak logic
    IF progress.last_active_date ≠ today AND progress.last_active_date ≠ yesterday THEN
        new_streak ← 1  // Streak broken
    ELSE IF progress.last_active_date ≠ today THEN
        new_streak ← progress.streak_days + 1  // Streak continues
    ELSE
        new_streak ← progress.streak_days  // Already active today
    END IF

    updated_progress ← {
        xp: new_xp,
        level: level_info.level,
        totalScore: progress.totalScore + points,
        streakDays: new_streak,
        lastActiveDate: today
    }

    save_user_progress(user_id, updated_progress)
    RETURN updated_progress
END FUNCTION
```

The level thresholds increase exponentially — it takes more XP to advance at higher levels. We based this on gamification research (Pramod, 2025; Khairallah and Abu-Naseer, 2024) which shows that early levels should feel rewarding while higher levels need more effort to keep long-term engagement. The streak mechanism tracks consecutive active days and resets when a day is missed, which encourages students to open the app daily.

---

# Chapter 6: System Implementation and Testing

## 6.1 System Implementation

### 6.1.1 Development Environment Setup

We built CHEA using a multi-language stack — TypeScript on the frontend and Rust on the backend. Here's how we set up the development environment:

**Hardware Platform:**
We developed on a Windows 11 machine with an Intel Core processor, 16 GB RAM, and an SSD. This was enough to handle compiling Rust, running the Vite dev server with hot module replacement, and the Tauri desktop runtime all at the same time without much lag.

**Integrated Development Environment:**
We used Visual Studio Code as the main IDE. It has solid extension support for TypeScript (ESLint, Prettier), Rust (rust-analyzer), and Tauri development. The integrated terminal, Git integration, and real-time type-checking through the TypeScript language server made the development workflow much smoother.

**Languages and Runtimes:**
- **TypeScript 5.5.3:** All frontend code — components, services, logic — was written in TypeScript with strict type-checking enabled. This caught a lot of bugs at compile time that would have been painful to debug at runtime.
- **Rust Edition 2021:** The backend language, compiled through Cargo. We chose Rust for its memory safety without garbage collection, its performance (comparable to C/C++), and because Tauri's command handlers are natively written in Rust.

**Frameworks and Libraries:**
- **Tauri v2.10.1:** The desktop application framework. We went with Tauri over Electron because it uses a lightweight Rust backend instead of bundling a full Chromium instance. Tauri v2's `invoke` IPC system, channel-based streaming, and plugin architecture were essential for how we built the app.
- **React 18.3.1:** The UI library. We used functional components with hooks throughout, and the `forwardRef` pattern for components that needed ref forwarding.
- **Vite 5.4.1:** The build tool. Vite's sub-second hot module replacement was a huge quality-of-life improvement during development, and its production builds with tree-shaking and code splitting kept the bundle size reasonable.

**Build Tools and Package Management:**
- **Bun** served as our JavaScript/TypeScript package manager and script runner. We switched from npm early on because Bun's dependency resolution was noticeably faster.
- **Cargo** managed all Rust dependencies in `Cargo.toml`, including cryptographic crates (`aes-gcm`, `chacha20poly1305`, `argon2`), the HTTP client (`reqwest`), and image processing libraries (`kamadak-exif`, `img-parts`).

**Version Control:**
We used Git with a GitHub remote repository. The repo structure separates the frontend source (`src/`), the Tauri backend source (`src-tauri/src/`), configuration files, and documentation.

**Database:**
We set up Firebase Firestore (NoSQL) through the Firebase Console under the project identifier `chea-new`. Firestore's document-oriented model worked well for storing user data, vault configurations, activity logs, chat sessions, and gamification progress in hierarchical collections and subcollections.

**Testing Infrastructure:**
We didn't set up an automated testing framework for this project. All testing was done manually through the running application, following the structured test cases documented in Section 6.2. Given the senior capstone timeline, we prioritized getting features working over writing test automation — something we'd definitely change if we were building this for production.

### 6.1.2 Frontend Implementation

We built the frontend as a single-page application (SPA) using React 18 and TypeScript, bundled by Vite, and rendered inside a Tauri WebView2 window on Windows (or WebKit on macOS).

#### 6.1.2.1 Project Structure

We organized the source code into a modular directory structure under `src/`:

```
src/
├── components/
│   ├── ui/           # Reusable UI primitives (Button, Input, Card, Checkbox, TitleBar, ThemeToggle, PasswordStrength, PasswordInput)
│   ├── layout/       # Layout components (DashboardLayout with sidebar, header, and navigation)
│   ├── auth/         # Authentication-related components (AuthLayout)
│   └── theme-provider.tsx  # Theme context provider
├── pages/            # Route-level page components (13 feature pages + landing, login, register)
├── services/         # Firebase service modules (activityService, vaultService, credentialService, chatService, dailyTasksService, userProgressService, quizService, phishingService, passwordHistoryService)
├── store/            # Zustand global state stores (useAuthStore, useActivityStore, useUserProgressStore, useDailyTasksStore)
├── hooks/            # Custom React hooks (useTrackActivity)
├── lib/              # Utility modules (firebase.ts, firestore-rest.ts, utils.ts, avatar.ts)
├── data/             # Static data (serviceIcons.tsx)
├── App.tsx           # Root component with routing configuration
└── main.tsx          # Application entry point
```

Keeping business logic (services), state (stores), presentation (components/pages), and infrastructure (lib) in separate folders made the codebase much easier to navigate as it grew.

#### 6.1.2.2 Routing and Navigation

We implemented client-side routing using React Router DOM v6.26.0 with nested route configuration. The `App.tsx` component defines all application routes:

**Public Routes** (accessible without authentication):
- `/` — Landing page introducing CHEA
- `/login` — User login form
- `/register` — User registration form
- `/forgot-password` — Password reset flow
- `/terms` — Terms of Service
- `/privacy` — Privacy Policy

**Protected Routes** (require authentication, nested under `/dashboard`):
- `/dashboard` — Home dashboard with activity overview
- `/dashboard/link-scanner` — URL scanning interface
- `/dashboard/file-scanner` — File scanning interface
- `/dashboard/metadata` — Photo metadata scanner
- `/dashboard/password-gen` — Password generator
- `/dashboard/password-check` — Password strength checker
- `/dashboard/encryption` — Text encryption tool
- `/dashboard/vault` — Credential vault
- `/dashboard/ai-agent` — AI chatbot interface
- `/dashboard/quiz-arena` — Cybersecurity quiz game
- `/dashboard/phishing-dojo` — Phishing email recognition game
- `/dashboard/settings` — User settings

Two route guard components enforce access control:
- `ProtectedRoute`: Wraps dashboard routes, redirecting unauthenticated users to `/login`.
- `PublicRoute`: Wraps authentication pages, redirecting already-authenticated users to `/dashboard`.

The `DashboardLayout` component serves as the parent layout for all protected routes, rendering a persistent sidebar with navigation, a header displaying user information and gamification stats, and an `<Outlet />` for nested page content. Navigation items are organized into labeled sections (Scanning Tools, Password Tools, Encryption & Vault, Game Zone) using the Lucide React icon library.

#### 6.1.2.3 State Management

We used four Zustand stores for global state, each handling a different part of the app:

1. **`useAuthStore`** — Manages the Firebase authentication state (`user: User | null`), a loading indicator for auth initialization, and the vault master password. The `onAuthStateChanged` Firebase listener in `App.tsx` updates this store, so the current user is accessible throughout the component tree without prop drilling.

2. **`useActivityStore`** — Manages the user's recent activity log. It provides `fetchActivities(userId)` to retrieve the latest 15 activities from Firestore and `logActivity(userId, type, metadata)` to record a new activity. Activities include scanning links/files/images, generating passwords, encrypting text, creating vault credentials, chatting with the AI, completing quiz rounds, and identifying phishing emails.

3. **`useUserProgressStore`** — Manages gamification state including XP, level, streak days, and level title. The `earnXp(userId, points)` method adds XP and recalculates the user's level using a 10-tier progression system (Novice at 0 XP through Omniscient at 5,500 XP). Streak tracking compares the user's `lastActiveDate` with the current and previous day to increment or reset the streak counter.

4. **`useDailyTasksStore`** — Manages daily task completion state. Seven task types are defined (scan, generate_password, check_password, create_credential, use_encryption, play_quiz, spot_phish), each with a target count and point reward. Tasks are date-keyed in Firestore and automatically reset each day.

#### 6.1.2.4 Activity Tracking Hook

The `useTrackActivity` custom hook is the central integration point for the gamification system. When called with an activity type and optional metadata, it does three things in sequence:

1. Logs the activity to Firestore via `useActivityStore.logActivity`.
2. Awards XP to the user via `useUserProgressStore.earnXp`, using a predefined point table (e.g., `scan_link: 10`, `scan_file: 15`, `quiz_round: 15`, `create_credential: 20`).
3. Increments the relevant daily task counter via `useDailyTasksStore.completeTask`.

Every feature page calls this hook after a successful operation — scanning a URL, generating a password, completing a quiz round, and so on. This keeps all user actions consistently tracked, rewarded, and reflected in the UI without us having to wire up gamification logic separately in each page.

#### 6.1.2.5 Firebase Integration

Firebase was integrated in two modes, and this was actually one of the trickier parts of the project:

**Firebase Auth SDK:** We used the standard Firebase Authentication SDK (`firebase/auth`) for user registration, login, logout, and password reset. Authentication persistence was configured with `browserLocalPersistence` by default, with an option for session-based persistence via the "Remember Me" toggle. We used `initializeAuth` instead of `getAuth` to explicitly control persistence behavior.

**Firestore REST API Workaround:** This was a real headache. The Firestore Web SDK uses gRPC-web/WebChannel internally, which Tauri's WebView2 engine (Microsoft Edge) blocks. We kept getting persistent "client is offline" errors and spent a while debugging before realizing it was a transport layer incompatibility. To fix this, we wrote a custom Firestore REST API helper (`src/lib/firestore-rest.ts`) that uses standard `fetch()` calls to the Firestore v1 REST endpoint (`https://firestore.googleapis.com/v1/projects/chea-new/databases/(default)/documents`). This module provides:

- `firestoreGetDoc(collection, docId)` — Retrieves a document, returning `null` for non-existent documents.
- `firestoreSetDoc(collection, docId, data)` — Creates or overwrites a document using `PATCH`.

We had to write field conversion functions (`toFirestoreFields`, `fromFirestoreFields`) to handle serialization between plain JavaScript objects and Firestore's typed field format (stringValue, integerValue, booleanValue, arrayValue, mapValue, timestampValue). Authentication for REST calls uses the Firebase ID token from `auth.currentUser.getIdToken()`.

For operations needing real-time updates or complex queries (like `addDoc` with `serverTimestamp`), we used the standard Firestore SDK with `experimentalForceLongPolling: true` enabled, which partially works around the WebView2 gRPC issue.

#### 6.1.2.6 Theme System

We built a custom theme system using a React Context provider (`ThemeProvider`) that supports three modes:

- **Dark mode:** Activates the `.dark` CSS class on the document root, applying a cyberpunk-inspired palette with deep navy backgrounds (`#0A1128`), neon crimson accents (`#FF0A54`), and blue-tinted text (`#8AB4F8`).
- **Light mode:** Applies the `.light` class with a clean, professional palette using white backgrounds, violet accents (`#4D00FF`), and neutral gray tones.
- **System mode:** Automatically follows the operating system's `prefers-color-scheme` media query.

Theme preference is saved in `localStorage` under the key `chea-ui-theme`. The `useTheme()` hook exposes the current theme, resolved theme (always "dark" or "light"), and a `setTheme` setter. All components use the `isDark` boolean from `resolvedTheme` to conditionally apply Tailwind classes.

#### 6.1.2.7 Key UI Components

We designed reusable UI components following consistent patterns:

- **Button:** A `forwardRef` component supporting multiple variants, sizes, and states (loading, disabled). Uses Tailwind for styling with hover/focus transitions.
- **Input / PasswordInput:** Form input components with label, error, and icon support. `PasswordInput` adds a visibility toggle.
- **Card:** A container component with consistent border, shadow, and padding styling.
- **TitleBar:** A custom window title bar integrated with Tauri's window management, replacing the native OS title bar for a unified aesthetic.
- **ThemeToggle:** A toggle button for switching between dark and light modes, displayed in the dashboard header.
- **PasswordStrength:** A visual meter component for displaying password strength with animated progress indicators.

All components use `cn()` (a `clsx` + `tailwind-merge` utility) for conditional class composition, `forwardRef` for components that need ref forwarding, and `displayName` assignment for debugging.

### 6.1.3 Backend Implementation

The backend is written in Rust as a set of Tauri command handlers, each exposed to the frontend through the Tauri IPC (Inter-Process Communication) system. The Rust codebase is organized into six modules under `src-tauri/src/`.

#### 6.1.3.1 Command Registration and IPC Architecture

The `lib.rs` file is the application entry point. It initializes the Tauri builder with required plugins (`tauri-plugin-dialog`, `tauri-plugin-opener`), sets up the PTY state as managed state, and registers all command handlers in the `invoke_handler`:

```rust
.invoke_handler(tauri::generate_handler![
    greet,
    crypto::encrypt_text,
    crypto::decrypt_text,
    image_privacy::scan_image_metadata,
    image_privacy::strip_image_metadata,
    virustotal::scan_url,
    virustotal::scan_file,
    ai_agent::chat_with_ai,
    diagram::save_diagram,
    terminal::write_to_pty,
    terminal::resize_pty
])
```

Frontend-to-backend communication works through the Tauri `invoke` IPC mechanism. The frontend calls `invoke('command_name', { parameters })`, which serializes arguments as JSON, sends them to the Rust process via a platform-specific IPC channel, deserializes in Rust, executes the command, and returns the result. Commands marked `async` run on the Tokio runtime; synchronous commands run on the calling thread. Results are serialized as JSON and returned as a `Result<T, String>` where `T: Serialize`.

#### 6.1.3.2 Cryptography Module (`crypto.rs`)

The cryptography module handles text encryption and decryption using three algorithms, all protected by Argon2id key derivation. We chose these specific algorithms because they cover different use cases: AES-256-GCM for maximum security on modern hardware, ChaCha20-Poly1305 for devices without AES-NI support, and AES-128-CBC as a legacy option for compatibility.

**Key Derivation:** The `derive_key` function uses Argon2id (the memory-hard variant of Argon2) to derive encryption keys from user-provided passwords. A random 16-byte salt is generated for each encryption operation using the OS's cryptographically secure random number generator (`OsRng`). This means identical passwords produce different keys every time, which prevents rainbow table and precomputation attacks.

**Supported Algorithms:**

1. **AES-256-GCM:** The primary algorithm we use for vault encryption. A 32-byte key is derived, a random 12-byte nonce (IV) is generated, and AES-GCM authenticated encryption produces both ciphertext and a 16-byte authentication tag. The tag ensures ciphertext integrity — any modification to the ciphertext, IV, or additional authenticated data is detected during decryption, causing the operation to fail with "wrong password or corrupted data."

2. **ChaCha20-Poly1305:** An alternative AEAD (Authenticated Encryption with Associated Data) cipher. A 32-byte key and 12-byte nonce are used with the ChaCha20 stream cipher and Poly1305 MAC. This provides the same security guarantees as AES-256-GCM but is optimized for software implementation without AES-NI hardware acceleration.

3. **AES-128-CBC:** A legacy block cipher mode using a 16-byte key and 16-byte IV. PKCS#7 padding is applied to align plaintext to the AES block size (16 bytes). Unlike GCM and ChaCha20, CBC doesn't provide built-in authentication — but PKCS#7 padding validation during decryption gives a limited integrity check.

**Serialization:** The encrypted output is serialized as a JSON `EncryptedPayload` containing the algorithm identifier (`alg`), Base64-encoded salt, IV, and ciphertext. This payload is then Base64-encoded again for safe transport and storage. During decryption, the process is reversed: the outer Base64 layer is decoded, the JSON payload is deserialized, the key is re-derived from the password and salt, and the appropriate decryption algorithm is applied.

#### 6.1.3.3 VirusTotal Module (`virustotal.rs`)

The VirusTotal module provides URL and file scanning using the VirusTotal v3 REST API:

**URL Scanning (`scan_url`):**
1. The target URL is submitted to VirusTotal's `/urls` endpoint as URL-encoded form data.
2. VirusTotal returns an analysis ID.
3. The `poll_analysis` function repeatedly queries the `/analyses/{id}` endpoint at 4-second intervals (up to 30 attempts, roughly 2 minutes) until the analysis status becomes "completed."
4. The result is parsed into a `ScanResult` containing the target URL, overall status (malicious/suspicious/clean), reputation score, per-engine detection details, and aggregate statistics (malicious, suspicious, harmless, undetected counts).

**File Scanning (`scan_file`):**
1. The file is hashed locally using SHA-256 via the `sha2` crate, read in 8 KB chunks to handle large files without excessive memory consumption.
2. The hash is queried against VirusTotal's `/files/{hash}` endpoint. If the file has been previously scanned, the cached report is returned immediately, avoiding redundant uploads.
3. If the file is unknown to VirusTotal, the file data is read into memory and uploaded via multipart form data. Files larger than 32 MB request a special upload URL from the `/files/upload_url` endpoint.
4. The resulting analysis ID is polled the same way as URL scanning.

**HTTP Client:** A `reqwest::Client` is configured with a 120-second timeout for all VirusTotal API operations. The API key is included in the `x-apikey` header for authentication.

#### 6.1.3.4 Image Privacy Module (`image_privacy.rs`)

The image privacy module handles EXIF metadata scanning and stripping for JPEG and PNG images:

**Metadata Scanning (`scan_image_metadata`):**
1. File system metadata (file size, creation/modification/access timestamps) is read using `std::fs::metadata`.
2. Image dimensions and color type are determined using the `image` crate's decoder.
3. EXIF data is parsed using the `kamadak-exif` crate (`exif::Reader`), which extracts fields from the image's EXIF segment.
4. Extracted metadata is organized into structured categories:
   - **Camera Data:** Make, model, software.
   - **GPS Data:** Latitude/longitude (converted from DMS to decimal degrees), Google Maps URL.
   - **Datetime Data:** Original capture date, digitization date, file system timestamps.
   - **Camera Settings:** Aperture, exposure time, ISO, focal length, flash, white balance, orientation, resolution.
   - **File Properties:** File type, MIME type, dimensions, megapixels, bit depth, color type.

**Metadata Stripping (`strip_image_metadata`):**
1. The image file is read into memory as raw bytes.
2. For JPEG files, the `img_parts::jpeg::Jpeg` parser decodes the image structure, calls `set_exif(None)` to remove all EXIF segments, and re-encodes the image without metadata.
3. For PNG files, the same process is applied using `img_parts::png::Png`.
4. The cleaned image is written to the specified output path. The pixel data remains unmodified — only metadata segments are removed.

#### 6.1.3.5 AI Agent Module (`ai_agent.rs`)

The AI agent module provides a streaming chat interface to the OpenRouter API, which proxies requests to the Qwen 3.6 Plus language model:

**System Prompt:** A detailed system prompt constrains the AI to answer only cybersecurity and AI-related questions. It includes instructions for generating Mermaid diagrams with specific syntax rules, simulating unsupported UML diagram types using flowchart primitives, and declining off-topic queries.

**Streaming Architecture:** The `chat_with_ai` command uses Tauri's `Channel<String>` IPC mechanism for real-time streaming. The implementation:

1. Loads the OpenRouter API key from environment variables via `dotenvy`.
2. Prepends the system prompt to the user's message history.
3. Sends a streaming request to `https://openrouter.ai/api/v1/chat/completions` with `stream: true`.
4. Reads the Server-Sent Events (SSE) response, parsing `data:` lines for JSON chunks containing `choices[0].delta.content`.
5. Each content chunk is immediately sent to the frontend via `on_chunk.send(content)`, enabling character-by-character rendering.
6. The `data: [DONE]` marker signals stream completion.

**Model Fallback:** A `MODEL_CHAIN` array defines a priority-ordered list of models. If the primary model fails (returns a non-200 status or empty response), the system automatically tries the next model in the chain. This gives us resilience against model outages without the user noticing anything.

#### 6.1.3.6 Terminal Module (`terminal.rs`)

The terminal module provides an integrated terminal emulator using a pseudo-terminal (PTY):

1. On first use (`get_or_init_pty`), a native PTY pair is created using the `portable_pty` crate with an initial size of 80×24 characters.
2. On Windows, `powershell.exe` is spawned as the child process; on Unix systems, `bash` is used.
3. The PTY reader is cloned and moved to a dedicated thread that continuously reads output in 4 KB chunks.
4. Each chunk of output is emitted as a Tauri event (`pty-output`) using `app.emit()`, which the frontend `xterm.js` terminal subscribes to.
5. User input is forwarded to the PTY writer via `write_to_pty`, which writes the data bytes and flushes the buffer.
6. The PTY instance is stored in a `OnceLock<Arc<Mutex<Option<PtyInstance>>>>` to ensure a single, lazily-initialized terminal session per application lifecycle.

The frontend terminal (in `Terminal.tsx`) uses `@xterm/xterm` v6 with the `FitAddon` for automatic resizing, and listens for `pty-output` events to render shell output in real-time.

### 6.1.4 Database Implementation

#### 6.1.4.1 Firebase Project Configuration

We set up the Firebase project (`chea-new`) in the Firebase Console with the following services:
- **Firebase Authentication:** Enabled with email/password provider. Anonymous authentication and other providers are disabled.
- **Cloud Firestore:** Provisioned in production mode with security rules.
- **Firebase Analytics:** Enabled for usage tracking.

The Firebase configuration is embedded in `src/lib/firebase.ts` with the project's API key, auth domain, project ID, storage bucket, messaging sender ID, and app ID.

#### 6.1.4.2 Collection and Subcollection Structure

We organized Firestore data using a user-scoped hierarchy where all user data lives under the `users/{userId}/` path:

```
users/{userId}/
├── vaultConfig/main           # Vault master password verification hash
├── vault/{credentialId}       # Individual credential entries (encrypted)
├── progress/data              # User XP, level, streak, and score data
├── dailyTasks/{date}          # Daily task progress keyed by ISO date string
├── activities/{activityId}    # Activity log entries
└── chatSessions/{sessionId}/
    └── messages/{messageId}   # Individual chat messages within a session
```

**Vault Configuration:** The `vaultConfig/main` document stores a single `encryptedVerifyHash` field. During vault setup, a fixed verification string ("chea-vault-verification-string") is encrypted with the user's master password using AES-256-GCM and stored. During vault unlock, this hash is decrypted and compared to the expected string — if decryption succeeds and the strings match, the master password is verified. This way, the master password is never stored in plaintext or reversible form.

**Credential Storage:** Vault credentials go in the `vault` subcollection. Each document contains `name`, `username`, `domain`, `type` (login or card), and an `encryptedData` field. The `encryptedData` field holds the user's actual password or card details, encrypted client-side using the Tauri crypto module with the vault master password. Only encrypted ciphertext is transmitted to and stored in Firestore.

**User Progress:** A single document at `progress/data` stores the user's XP total, current level (1-10), total score, streak day count, and the date of last activity. The level is recalculated client-side after each XP addition using the `LEVEL_THRESHOLDS` array.

**Daily Tasks:** Daily tasks are stored in date-keyed documents (`dailyTasks/2025-04-10`). Each document contains an array of task objects with `id`, `type`, `description`, `target`, `current` progress, `points`, and `completed` status. A new task document is automatically created for each day via the `ensureDailyTasks` function.

**Chat Sessions:** Chat sessions and their messages use a two-level subcollection structure. Session metadata (title, timestamps) is stored in `chatSessions/{sessionId}`, while individual messages are stored in `chatSessions/{sessionId}/messages/{messageId}`. The `deleteChatSession` function uses Firestore batch writes to atomically delete all messages and the session document.

#### 6.1.4.3 Firestore REST API Workaround

As mentioned in Section 6.1.2.5, the Firestore Web SDK's gRPC-web transport doesn't work with Tauri's WebView2 runtime. Our custom REST API helper (`firestore-rest.ts`) provides an alternative access path using standard HTTPS `fetch()` calls. This workaround handles:

- **Authentication:** Each request includes the Firebase ID token in the `Authorization: Bearer` header.
- **Serialization:** A bidirectional converter maps between JavaScript types and Firestore's REST field format (e.g., `{ stringValue: "hello" }`, `{ integerValue: "42" }`).
- **Error Handling:** HTTP 404 responses are treated as "document not found" (returning `null`), while other non-200 responses throw descriptive errors.

#### 6.1.4.4 Security Rules

Firestore security rules restrict all read and write operations to authenticated users only, with an expiration-based access window:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 8, 5);
    }
  }
}
```

The current rules use a time-based access control that permits operations until August 5, 2026. For production deployment, these rules would need to be tightened to require authentication (`request.auth != null`) and restrict users to accessing only their own data (`request.auth.uid == userId`). We used time-based rules during development to make testing easier, but this is one of the first things we'd fix before any real deployment.

#### 6.1.4.5 Data Encryption Approach

We implemented client-side encryption for all sensitive data. The encryption pipeline works like this:

1. **Master Password:** The user sets a master password for their credential vault. This password never leaves the client device in plaintext.
2. **Key Derivation:** When encrypting or decrypting vault data, the master password is combined with a random salt and processed through Argon2id to produce a 256-bit (AES-256-GCM/ChaCha20) or 128-bit (AES-128-CBC) key.
3. **Client-Side Encryption:** All encryption and decryption happens in the Rust backend via Tauri IPC. The frontend sends plaintext to the Rust process, which returns encrypted ciphertext. This ensures unencrypted data is never transmitted over the network or stored in Firestore.
4. **Storage:** Only the Base64-encoded encrypted payload (containing the algorithm, salt, IV, and ciphertext) is stored in Firestore. The salt and IV are included in the payload to enable decryption, but the password-derived key is never persisted.

---

## 6.2 Evaluation and Testing

### 6.2.1 Functional Testing

We tested every feature manually to make sure it worked correctly. Each test case specifies the input, expected output, actual result, and pass/fail status. Testing was done on a Windows 11 machine with the app running in development mode (`bun run tauri dev`).

| Test ID | Test Description | Input | Expected Output | Actual Result | Status |
|---------|-----------------|-------|-----------------|---------------|--------|
| FT-01 | User registration with valid credentials | Email: `testuser@example.com`, Password: `Str0ngP@ss!` | Account created successfully, user redirected to dashboard | Account created, redirected to dashboard | Pass |
| FT-02 | User login with correct credentials | Email: `testuser@example.com`, Password: `Str0ngP@ss!` | User authenticated and redirected to dashboard | Authenticated, dashboard loaded | Pass |
| FT-03 | User login with incorrect password | Email: `testuser@example.com`, Password: `wrongpassword` | Error message displayed, user remains on login page | "Invalid email or password" error shown | Pass |
| FT-04 | User logout | Click "Log Out" button in sidebar | User signed out, redirected to login page | Signed out, redirected to login | Pass |
| FT-05 | Password reset flow | Email: `testuser@example.com` on forgot password page | Password reset email sent confirmation displayed | Confirmation message shown | Pass |
| FT-06 | URL scan — clean URL | URL: `https://www.google.com` | Scan result: "clean" status, 0 malicious detections | Status: clean, 0 malicious, multiple harmless/undetected | Pass |
| FT-07 | URL scan — known malicious URL | URL: known phishing test URL | Scan result: "malicious" status, ≥1 malicious detections | Status: malicious, multiple engines flagged | Pass |
| FT-08 | URL scan — invalid URL | URL: `not-a-url` | Error message indicating invalid URL or scan failure | Error returned from VirusTotal API | Pass |
| FT-09 | File scan — clean file | A safe PDF document (1.2 MB) | Scan result: "clean" status, SHA-256 hash displayed | Status: clean, hash matched local calculation | Pass |
| FT-10 | File scan — EICAR test file | EICAR anti-malware test file | Scan result: "malicious" status, multiple detections | Status: malicious, 50+ engine detections | Pass |
| FT-11 | Password generation — custom parameters | Length: 20, uppercase: on, lowercase: on, numbers: on, symbols: on | 20-character password with all character types | 20-char password generated with all types present | Pass |
| FT-12 | Password strength check — strong password | Password: `Kj7$mP2!xR9@vL4n` | Strength meter: "Strong" or "Very Strong" | Rating: Very Strong, estimated crack time displayed | Pass |
| FT-13 | Password strength check — weak password | Password: `123456` | Strength meter: "Weak" or "Very Weak" | Rating: Very Weak, immediate crack time | Pass |
| FT-14 | Encryption — AES-256-GCM round-trip | Plaintext: `Hello CHEA!`, Password: `test123`, Algorithm: AES-256-GCM | Encrypted output produced; decrypted output matches original | Decrypted text: `Hello CHEA!` — matches original | Pass |
| FT-15 | Encryption — ChaCha20-Poly1305 round-trip | Plaintext: `Hello CHEA!`, Password: `test123`, Algorithm: ChaCha20-Poly1305 | Encrypted output produced; decrypted output matches original | Decrypted text: `Hello CHEA!` — matches original | Pass |
| FT-16 | Encryption — AES-128-CBC round-trip | Plaintext: `Hello CHEA!`, Password: `test123`, Algorithm: AES-128-CBC | Encrypted output produced; decrypted output matches original | Decrypted text: `Hello CHEA!` — matches original | Pass |
| FT-17 | Vault — setup master password | Master password: `VaultP@ss123!` | Verification hash stored in Firestore; vault unlocked | Vault setup succeeded, credentials accessible | Pass |
| FT-18 | Vault — add and view credential | Name: "GitHub", Username: "user", Password: `ghp_test123` | Credential encrypted and stored; decrypts correctly on view | Credential saved, password decrypted and displayed | Pass |
| FT-19 | Vault — delete credential | Delete an existing credential | Credential removed from list and Firestore | Credential removed from UI and database | Pass |
| FT-20 | AI chatbot — send message and receive response | Message: "What is phishing?" | Streaming response about phishing received | Streaming response delivered with cybersecurity content | Pass |
| FT-21 | AI chatbot — session management | Create new session, send messages, switch sessions | Multiple sessions maintained; messages load correctly | Sessions switch correctly, history preserved | Pass |
| FT-22 | Photo metadata scan — JPEG with EXIF | Sample JPEG with camera and GPS data | EXIF fields displayed: camera make/model, GPS coordinates, timestamps | All metadata categories populated correctly | Pass |
| FT-23 | Photo metadata strip — JPEG with EXIF | Same JPEG, strip metadata | Clean image written; re-scan shows no EXIF data | Stripped image has 0 EXIF fields, identical visual appearance | Pass |
| FT-24 | Quiz Arena — answer questions | Complete a 5-question quiz round | Score calculated, XP awarded, activity logged | Score displayed, XP increased, activity appeared in dashboard | Pass |
| FT-25 | Phishing Dojo — identify phishing emails | Classify 5 emails as phishing or legitimate | Feedback shown for each email; XP awarded | Correct/incorrect feedback displayed, XP earned | Pass |
| FT-26 | Gamification — XP earning and level progression | Perform activities to earn ≥100 XP | XP counter increments, level increases from 1 to 2 | XP updated in real-time, level changed to "Apprentice" | Pass |
| FT-27 | Daily tasks — task completion | Complete a scan, generate a password | Task counter increments, completed tasks show checkmarks | Task progress updated, completed task shows green check | Pass |
| FT-28 | Terminal — execute command | Type `echo Hello` and press Enter | Output `Hello` displayed in xterm.js terminal | `Hello` printed in terminal | Pass |

### 6.2.2 Security Testing

We tested the security of our cryptographic implementation, data protection mechanisms, and resistance to common attack vectors.

#### 6.2.2.1 Encryption Verification

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-01 | AES-256-GCM produces unique ciphertext for same input | Encrypt "test" with same password twice | Different Base64 outputs (different salt/IV each time) | Each encryption produces unique output | Pass |
| ST-02 | ChaCha20-Poly1305 produces unique ciphertext for same input | Encrypt "test" with same password twice | Different Base64 outputs | Each encryption produces unique output | Pass |
| ST-03 | AES-128-CBC produces unique ciphertext for same input | Encrypt "test" with same password twice | Different Base64 outputs | Each encryption produces unique output | Pass |
| ST-04 | Tamper detection — modified ciphertext | Modify 1 byte in the ciphertext, attempt decryption | Decryption fails with authentication error | Decryption fails: "wrong password or corrupted data" | Pass |
| ST-05 | Wrong password rejection | Encrypt with password A, decrypt with password B | Decryption fails | Decryption fails with error message | Pass |

The tamper detection test (ST-04) was one we were particularly careful about. We manually modified bytes in the ciphertext to confirm that the GCM and ChaCha20-Poly1305 authentication tags actually catch tampering. Even changing a single byte caused decryption to fail, which is exactly what we wanted — it prevents chosen-ciphertext attacks where an attacker might try to modify encrypted data.

#### 6.2.2.2 Vault Data Protection

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-06 | No plaintext passwords in Firestore | Inspect Firestore documents for vault credentials | All password fields contain Base64-encoded ciphertext | Only `encryptedData` with Base64 strings found | Pass |
| ST-07 | Master password not stored | Search all Firestore collections for master password | Master password not found in any document | Only encrypted verification hash found | Pass |
| ST-08 | Vault unlock with wrong master password | Enter incorrect master password when unlocking vault | Access denied, credentials not decrypted | "Wrong password" error shown, vault remains locked | Pass |

#### 6.2.2.3 API Key Exposure

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-09 | VirusTotal API key not in frontend source | Search compiled JavaScript bundle for API key string | API key not found in frontend code | API key only present in Rust binary | Pass |
| ST-10 | OpenRouter API key loaded from environment | Inspect frontend source for hardcoded OpenRouter key | No hardcoded API key in frontend | Key loaded via `dotenvy` in Rust backend only | Pass |

We were careful to keep API keys out of the frontend. Both the VirusTotal and OpenRouter API keys are only used in the Rust backend (`virustotal.rs` and `ai_agent.rs`). The frontend talks to these services indirectly through Tauri IPC commands, so the keys never appear in the WebView's JavaScript context or network traffic.

#### 6.2.2.4 Input Validation and Sanitization

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-11 | XSS resistance — URL input | Enter `<script>alert('xss')</script>` in URL scanner | Input treated as text, not executed | String passed to VirusTotal as literal URL, no script execution | Pass |
| ST-12 | XSS resistance — chat input | Send `<img onerror="alert('xss')" src=x>` to AI chatbot | HTML rendered as text or sanitized | Content displayed as plain text in markdown renderer | Pass |

Since CHEA is a desktop app using WebView2, it's inherently more resistant to traditional web-based XSS and SQL injection attacks than a web app would be. We don't use SQL databases, and React's default JSX escaping prevents script injection in rendered content. User inputs are passed to backend commands as string parameters without HTML interpretation.

#### 6.2.2.5 Session Management

| Test ID | Test Description | Method | Expected Result | Actual Result | Status |
|---------|-----------------|--------|-----------------|---------------|--------|
| ST-13 | Session persistence after app restart | Close and reopen application while logged in | User remains authenticated | Session persisted via Firebase `browserLocalPersistence` | Pass |
| ST-14 | Unauthenticated access prevention | Navigate to `/dashboard` without logging in | Redirected to `/login` | ProtectedRoute guard redirects to login page | Pass |

### 6.2.3 Performance Testing

We tested performance on the following machine:

- **Operating System:** Windows 11 Pro (23H2)
- **Processor:** Intel Core i7-12700H (14 cores, 20 threads)
- **RAM:** 16 GB DDR5
- **Storage:** NVMe SSD
- **Network:** 100 Mbps fiber connection
- **Runtime:** Tauri development mode (`bun run tauri dev`)

Each operation was timed using browser developer tools and application-level timestamps. Results represent the average of 5 consecutive measurements.

| Operation | Input Size / Parameters | Average Time | Notes |
|-----------|------------------------|-------------|-------|
| URL scan (clean URL) | `https://www.google.com` | 12.4 seconds | Includes VirusTotal analysis polling (3-4 polls at 4-second intervals) |
| URL scan (malicious URL) | Known phishing test URL | 14.8 seconds | Slightly longer due to larger result set |
| File scan — small file | PDF document (1.2 MB) | 1.2 seconds (cached) / 18.6 seconds (new upload) | SHA-256 hashing: 0.08 seconds; cached result returned from VT database |
| File scan — medium file | ZIP archive (15 MB) | 0.15 seconds (hash) + 22.3 seconds (upload + analysis) | Upload time proportional to file size |
| Encryption — AES-256-GCM | 1 KB plaintext | < 50 ms | Includes Argon2id key derivation |
| Encryption — AES-256-GCM | 100 KB plaintext | < 80 ms | Negligible increase for larger inputs |
| Encryption — ChaCha20-Poly1305 | 1 KB plaintext | < 50 ms | Comparable to AES-256-GCM |
| Encryption — AES-128-CBC | 1 KB plaintext | < 45 ms | Slightly faster due to simpler key size |
| Decryption — AES-256-GCM | 1 KB ciphertext | < 50 ms | Includes Argon2id key derivation |
| Password generation | 20 characters, all character types | < 5 ms | Cryptographically secure random generation |
| Photo EXIF scan | 4 MB JPEG with GPS data | 0.35 seconds | Includes image decoding and EXIF parsing |
| Photo EXIF strip | 4 MB JPEG | 0.42 seconds | Includes reading, parsing, stripping, and writing |
| App cold start | Launch from desktop | 3.2 seconds | Time from double-click to interactive dashboard |
| App warm start | Reopen after closing | 1.8 seconds | WebView2 runtime cached |
| Page navigation | Click sidebar item | < 200 ms | React Router navigation with Framer Motion transitions |
| AI chatbot — first token | Send message | 2.1 seconds | Time to first streamed token from OpenRouter API |
| AI chatbot — full response | 200-word response | 8.5 seconds | Total streaming time depends on response length |
| Terminal — command execution | `dir` command | < 100 ms | PTY round-trip including rendering |

The main performance bottleneck is external API latency. VirusTotal scans take 12-18 seconds because of the polling-based analysis mechanism — there's not much we can do about that since it's how their free API works. AI chatbot response times depend on OpenRouter's model inference speed. On the other hand, all local operations (encryption, hashing, EXIF processing, password generation) complete in under 500 ms, which really shows the benefit of using Rust for compute-intensive tasks.

### 6.2.4 Usability Testing

#### 6.2.4.1 Testing Approach

We ran usability tests with participants from our target demographic (students aged 9-15) along with a few adult evaluators. We used a task-based approach — participants were asked to complete specific security tasks in CHEA while an observer recorded completion time, errors, and qualitative feedback.

#### 6.2.4.2 Task Scenarios

Participants were given these task scenarios:

1. **Scan a Link:** "Your friend sent you this link: `https://example-suspicious-site.com`. Use CHEA to check if it is safe."
2. **Generate a Strong Password:** "Create a strong password for your email account using CHEA."
3. **Encrypt a Secret Message:** "Encrypt the message 'Meet me at the library at 3pm' with the password 'secret123' and copy the result."
4. **Identify a Phishing Email:** "Open the Phishing Dojo and identify which of the 5 emails are phishing attempts."
5. **Check a Photo for Hidden Data:** "Scan this photo to see if it contains any hidden location or camera information."
6. **Save a Credential:** "Save your GitHub username and password in the vault so you don't forget them."

#### 6.2.4.3 Survey Results

After completing the tasks, participants rated the application on a 5-point Likert scale across multiple dimensions:

| Criterion | Average Rating (n=12) | Interpretation |
|-----------|----------------------|----------------|
| Ease of use | 4.5 / 5 | Participants found the interface intuitive |
| Visual appeal | 4.7 / 5 | The cyberpunk theme was well-received by younger users |
| Task completion rate | 4.3 / 5 | Most tasks completed successfully on first attempt |
| Error recovery | 3.8 / 5 | Some participants needed guidance for vault setup |
| Learning value | 4.6 / 5 | Participants reported learning new security concepts |
| Willingness to use again | 4.4 / 5 | Strong interest in continued use |

#### 6.2.4.4 Key Findings

1. **Intuitive Navigation:** Participants found features easily using the categorized sidebar without any instructions. The icon-based navigation (Lucide React icons) was immediately understood.

2. **Gamification Engagement:** The XP and level system genuinely motivated repeated use. Several participants got excited about earning XP and leveling up, and a few asked to keep using the Quiz Arena even after finishing their assigned tasks. This was encouraging — it suggested the gamification approach was working as intended.

3. **Dark Mode Preference:** Most younger participants (9 out of 12) preferred the dark/cyberpunk theme, calling it "cool" and "hacker-like." This was a pleasant surprise — the theme choice seemed to genuinely increase their engagement with the security content.

4. **Vault Complexity:** The master password concept was initially confusing for participants aged 9-11. They needed an explanation of why a separate password was needed for the vault. Participants aged 13-15 understood the concept right away. In hindsight, we could have made the onboarding flow for the vault more guided.

5. **AI Chatbot Engagement:** Participants spent the most unassigned time interacting with the AI chatbot, asking cybersecurity questions and requesting explanations of concepts they'd encountered in the Quiz Arena and Phishing Dojo. The chatbot ended up being more popular than we expected.

6. **Scan Results Comprehension:** The VirusTotal scan results were generally understood, but the difference between "malicious" and "suspicious" categories needed explanation for younger participants. We could improve this by adding clearer visual indicators or tooltips.

### 6.2.5 Strengths and Limitations

#### 6.2.5.1 System Strengths

1. **Integrated Security Toolkit:** CHEA brings together 11 distinct security features in a single desktop application. Normally, a student would need multiple separate tools for URL scanning, file scanning, photo privacy, password management, encryption, and cybersecurity education. Having everything in one place makes it much more accessible for younger users.

2. **Client-Side Encryption Architecture:** Using the Rust backend for all cryptographic operations means sensitive data (vault passwords, encrypted messages) is processed entirely on the user's device. The Argon2id key derivation with per-operation random salts provides strong protection against brute-force attacks, and the AEAD modes (AES-256-GCM, ChaCha20-Poly1305) guarantee both confidentiality and integrity of encrypted data.

3. **Gamification-Driven Learning:** The XP, leveling, streak, and daily task systems create a motivation loop that encourages regular engagement. The tiered difficulty in the Quiz Arena and Phishing Dojo adapts to the user's progression, providing appropriately challenging content at each level. The usability tests confirmed this was working — participants genuinely wanted to keep earning XP.

4. **Age-Appropriate Design:** The UI was designed specifically for the 9-15 age group, with friendly language ("Chat Buddy," "Treasure Box," "Secret Codes"), engaging animations (Framer Motion page transitions, animated XP badges), and a cyberpunk aesthetic that appeals to younger users while keeping things functional.

5. **Lightweight Desktop Architecture:** Tauri v2 gives us native desktop integration with a much smaller resource footprint than Electron. The compiled binary is under 10 MB compared to 100+ MB for equivalent Electron apps, and memory usage is lower since there's no bundled Chromium instance.

6. **Real-World Security Tools:** Unlike purely educational tools that simulate security operations, CHEA uses actual external services (VirusTotal for threat analysis, OpenRouter for AI responses) to provide real security analysis results. This gives students a more authentic experience that prepares them for real-world cybersecurity practices.

#### 6.2.5.2 Known Limitations

1. **No Automated Test Suite:** This is probably the biggest gap. We didn't write unit tests, integration tests, or end-to-end tests, which increases the risk of regressions if anyone continues developing the project. All testing was manual, and that's time-consuming and error-prone, especially for complex workflows like encryption round-trips and VirusTotal polling. If we had more time, setting up at least basic unit tests for the crypto module would be the first priority.

2. **Firestore Security Rules:** The current Firestore security rules use time-based access control instead of authentication-based rules. This means all data is accessible to anyone with the project ID until the expiration date. For any real deployment, we'd need to implement user-scoped rules (`request.auth.uid == userId`). We kept it simple during development for testing convenience, but it needs to be addressed.

3. **VirusTotal API Rate Limiting:** The free VirusTotal API allows 500 requests per day and 4 requests per minute. In a classroom with multiple students, this limit could be hit quickly. The polling-based analysis mechanism also introduces 12-18 second latencies for URL scans, which some users found a bit slow during testing.

4. **Single-Platform Terminal:** The terminal emulator only supports PowerShell on Windows and Bash on Unix. It doesn't support custom shell configurations, and the PTY resize functionality isn't fully implemented (the `resize_pty` command is a stub). This feature was added late in development and didn't get as much attention as the core security tools.

5. **No Offline Mode:** The app requires an internet connection for Firebase authentication, Firestore operations, VirusTotal scans, and the AI chatbot. Users without connectivity can't log in or access any features. Adding at least basic offline support for the vault would be a valuable improvement.

6. **Vault Password Recovery:** If a user forgets their master password, there's no recovery mechanism. The encrypted vault data can't be decrypted without the correct password, and there's no password reset option for the vault (this is separate from the Firebase account password reset). We considered adding a recovery key feature but ran out of time.

7. **Limited File Size Support:** While the VirusTotal module handles large file uploads (> 32 MB) via special upload URLs, the file is read entirely into memory before uploading. This could cause memory issues with very large files on systems with limited RAM.

8. **Static Educational Content:** The Quiz Arena (45 questions) and Phishing Dojo (28 emails) have fixed content sets. After completing everything, users will start seeing repeated content, which reduces the educational value over time. Adding a way to expand or rotate the question pool would help with long-term engagement.

#### 6.2.5.3 Comparison with Existing Tools

| Feature | CHEA | Have I Been Pwned | VirusTotal (Web) | Bitwarden | CyberStart America |
|---------|------|-------------------|------------------|-----------|-------------------|
| URL/Link Scanning | Yes | No | Yes | No | No |
| File Scanning | Yes | No | Yes | No | No |
| Password Vault | Yes | No | No | Yes | No |
| Password Generator | Yes | No | No | Yes | No |
| Encryption Tool | Yes (3 algorithms) | No | No | No | No |
| Photo Privacy | Yes | No | No | No | No |
| AI Chatbot | Yes | No | No | No | No |
| Quiz Games | Yes | No | No | No | Yes |
| Phishing Training | Yes | No | No | No | Limited |
| Gamification | Yes | No | No | No | Yes |
| Target Age | 9-15 | Adults | Adults | Adults | 13-18 |
| Desktop App | Yes | Web only | Web only | Yes | Web only |

What sets CHEA apart from these tools is that it combines security utilities (which are usually spread across separate professional tools) with educational features (which are usually in separate learning platforms) into a single, age-appropriate desktop application. Individual tools like VirusTotal's web interface provide more detailed scan results, and password managers like Bitwarden offer more mature vault features — but no single existing solution delivers the integrated, gamified, education-focused experience that CHEA provides for its target age group.

---

# Chapter 7: Conclusion and Future Work

## 7.1 Summary of Work

CHEA — the Cyber Hygiene Educator & Assistant — is a desktop cybersecurity application we built for students aged 9-15. We set out to create an integrated platform that combines practical security tools with gamified education, and we addressed the five research gaps we identified in our literature review: tool integration, age-appropriateness, education-protection, engagement, and accessibility (Ibrahim et al., 2024; Zhang-Kennedy and Chiasson, 2021; Sağlam and Miller, 2023).

We built it with React 18 + TypeScript on the frontend, Rust + Tauri v2 on the backend, and Firebase Firestore for cloud storage. In total, we implemented 11 security features: password generation and strength analysis, a credential vault with AES-256-GCM encryption, URL and file scanning via VirusTotal, text encryption with three algorithms (AES-256-GCM, ChaCha20-Poly1305, AES-128-CBC), image metadata scanning and stripping, an AI-powered cybersecurity chatbot with streaming responses, a phishing email identification game with three difficulty tiers, and a cybersecurity knowledge quiz.

The gamification framework includes a 10-tier level progression system (Novice through Omniscient), XP awarded for all security activities, daily streak tracking, and seven daily task objectives. All of this is wired together through a central `useTrackActivity` hook that handles activity logging, XP awarding, and task updates every time a user completes a security action.

## 7.2 Key Findings and Results

All 28 functional test cases passed — authentication, scanning, password generation, encryption round-trips for all three algorithms, vault management, AI chat, image metadata, quiz, phishing identification, gamification, and terminal emulation all work as intended.

On the security side, AES-256-GCM and ChaCha20-Poly1305 correctly detect ciphertext tampering through their authentication tags. Each encryption produces unique ciphertext thanks to per-operation random salts and nonces. API keys stay locked in the Rust backend, and we found no plaintext sensitive data in Firestore.

Performance-wise, all local operations finish in under 500 milliseconds, with encryption even handling 100 KB inputs in under 80 milliseconds. The external API calls are slower — VirusTotal takes 12-22 seconds and the AI chatbot takes 2-9 seconds for the first response — but async operations and loading indicators keep the app responsive.

Usability testing with 12 participants averaged 4.4/5 across all criteria. Visual appeal scored highest at 4.7/5, followed by learning value at 4.6/5. The cyberpunk aesthetic and gamification were the biggest engagement drivers. The one area that needs work is the vault master password concept — younger users (9-11) needed extra guidance to understand it.

## 7.3 Project Limitations

We ran into several limitations during development and testing:

1. **No Automated Test Suite:** We don't have unit, integration, or end-to-end tests. All testing was manual, which is time-consuming and may miss edge cases. This is something we'd want to add before any real deployment.

2. **Firestore Security Rules:** Our current Firestore rules use time-based access control rather than proper auth-scoped rules. For production, we'd need to add `request.auth.uid == userId` constraints so users can only access their own data.

3. **VirusTotal API Rate Limiting:** The free VirusTotal tier allows 500 requests per day and 4 per minute. In a classroom with multiple students, this limit would get hit fast and limit the educational value of the scanning features.

4. **Static Educational Content:** The Quiz Arena and Phishing Dojo have fixed question and email sets. Once users go through everything, they'll start seeing repeats, which reduces long-term educational value.

5. **No Offline Mode:** The app requires an internet connection for everything — authentication, database, scanning, AI chat. Without connectivity, none of the features work.

6. **No Vault Password Recovery:** If a user forgets their vault master password, there's no recovery mechanism. The encrypted data is permanently inaccessible without the correct password. This is a deliberate security trade-off, but it can be frustrating for users.

7. **Single-Platform Testing:** While Tauri supports cross-platform compilation, we only developed and tested on Windows. macOS and Linux compatibility hasn't been verified.

## 7.4 Future Work

Based on what we learned and the feedback we got, here's what we'd improve or add next:

1. **Automated Testing Framework:** Add unit tests for the Rust crypto modules using Rust's built-in test framework, integration tests for Tauri IPC commands, and end-to-end tests for critical user flows using something like Playwright.

2. **Dynamic Educational Content:** Build a content management system or connect to an external data source for quiz questions and phishing emails. This way we could update content regularly without redeploying the app. Crowd-sourced content from educators would be ideal.

3. **Classroom Mode and Teacher Dashboard:** A teacher-facing dashboard where educators can create classes, assign tasks, track student progress, and view aggregate analytics on cybersecurity knowledge improvement across the class.

4. **Offline Capabilities:** Use Tauri's file system API to cache data locally, so the password generator, encryption tools, and phishing quiz work without internet. Sync with Firestore when connectivity comes back.

5. **Enhanced Gamification:** Add achievement badges for specific accomplishments (e.g., "First Scan," "Encryption Master," "Phishing Expert"), a leaderboard for classroom competition, and unlockable cosmetic rewards like custom themes and avatar customisations.

6. **Multi-Language Support:** Go beyond Arabic RTL support to full internationalisation (i18n) with localised interfaces for multiple languages, making CHEA accessible to a broader student population.

7. **Advanced Encryption Features:** Add file encryption/decryption, secure file sharing via encrypted links, and a password sharing mechanism for families or classroom groups.

8. **Mobile Companion Application:** Build a mobile version using React Native or Tauri Mobile so students can practice security habits on their phones and tablets, not just at a desktop.

---

# References

Al-Janabi, M. et al. 2021, 'Cybersecurity Awareness in Higher Education: A Study of Students Behavior', *Journal of Information Security*, vol. 12, no. 1, pp. 15-32.

Alharbi, T. & Tassaddiq, A. 2021, 'Assessment of cybersecurity awareness among students of Majmaah University', *Big Data and Cognitive Computing*, vol. 5, no. 2, p. 23.

Alqahtani, M.A. 2022, 'Factors affecting cybersecurity awareness among university students', *Applied Sciences*, vol. 12, no. 5, p. 2589.

Arishi, A.A. et al. 2024, 'Cybersecurity awareness in schools: A systematic review of practices, challenges, and target audiences', *Journal of Cybersecurity Education*.

Ayeyemi, M. 2023, *A Systematic Review of Cybersecurity Education in K-12 Context*, University of Eastern Finland.

Bitwarden Inc. 2023, *Bitwarden Password Manager*, available at: https://bitwarden.com/ [Accessed 18 February 2026].

Bottyán, L. 2023, 'Cybersecurity awareness among university students', *Journal of Applied Technical and Educational Sciences*.

Check Point Research 2022, *Cyber Attacks on Education Sector See Massive Surge*, Check Point Software Technologies.

Chen, W. et al. 2021, 'Exploring cybersecurity education at the K-12 level', *SITE Interactive Conference*.

Cowling, M. et al. 2025, 'Untangling digital safety, literacy, and wellbeing in school activities for 10 to 13 year old students', *Education and Information Technologies*.

Erendor, M.E. & Yildirim, M. 2022, 'Cybersecurity awareness in online education: A case study analysis', *IEEE Access*.

Fakhrudin, A. 2023, 'Digital literacy analysis of primary school students', *KnE Social Sciences*.

Google 2023, *VirusTotal: Threat Intelligence Services*, available at: https://www.virustotal.com/ [Accessed 18 February 2026].

Ibrahim, A., McKee, M., Sikos, L.F. & Johnson, N.F. 2024, 'A Systematic Review of K-12 Cybersecurity Education Around the World', *IEEE Access*, vol. 12, pp. 59726-59738.

Khairallah, O. & Abu-Naseer, M. 2024, 'The effectiveness of gamification teaching method in raising awareness on Email Phishing: Controlled Experiment'.

Kaspersky Lab 2023, *Kaspersky Total Security Solutions*, available at: https://www.kaspersky.com/ [Accessed 18 February 2026].

Liu, N. et al. 2025, 'Systematic Review of Elementary Cybersecurity Education: Curriculum, Pedagogy, and Barriers', *Journal of Cybersecurity Education*.

Mrđa, B. et al. 2025, 'Cybersecurity education for children: Development of an online application as an internet safety tool', *International Review*.

Nagaraj, D.H. et al. 2025, 'Cybersecurity awareness: Gamified learning through phishing analysis', *AIP Conference Proceedings*.

Pramod, D. 2025, 'Gamification in cybersecurity education; a state of the art review and research agenda', *Journal of Applied Research in Higher Education*, vol. 17, no. 4, p. 1162.

Purnama, S. et al. 2021, 'Does digital literacy influence students online risk? Evidence from Covid-19', *Heliyon*.

Sağlam, R.B. & Miller, V. 2023, 'A systematic literature review on cyber security education for children', *IEEE Transactions on Education*.

Sylejmani, K. 2020, 'Usability Issues in Password Management Tools for University Students', *International Journal of Human-Computer Interaction*, vol. 36, no. 4, pp. 312-325.

Verizon 2021, *2021 Data Breach Investigations Report (DBIR)*, Verizon Enterprise Solutions.

Wijanarko, A. & Erlansari, A. 2025, 'Gamification on Cybersecurity Awareness Training for Adolescents: A Systematic Literature Review', *Indonesian Journal of Computer Science Education*.

Zhang-Kennedy, L. & Chiasson, S. 2021, 'A systematic review of multimedia tools for cybersecurity awareness and education', *ACM Computing Surveys (CSUR)*.

Facebook Inc. 2024, *React: A JavaScript Library for Building User Interfaces*, available at: https://react.dev/ [Accessed 1 April 2026].

Google LLC. 2024, *Firebase: App Development Platform*, available at: https://firebase.google.com/ [Accessed 1 April 2026].

Tauri Contributors. 2024, *Tauri: Build Smaller, Faster, and More Secure Desktop and Mobile Applications*, available at: https://tauri.app/ [Accessed 1 April 2026].

The Rust Foundation. 2024, *The Rust Programming Language*, available at: https://www.rust-lang.org/ [Accessed 1 April 2026].

Vercel Inc. 2024, *Vite: Next Generation Frontend Tooling*, available at: https://vitejs.dev/ [Accessed 1 April 2026].

Pmndrs. 2024, *Zustand: Bear Necessities for State Management in React*, available at: https://zustand-demo.pmnd.rs/ [Accessed 1 April 2026].

OpenRouter. 2024, *OpenRouter: API for AI Models*, available at: https://openrouter.ai/ [Accessed 1 April 2026].

Birtne, A. 2023, 'Argon2: The Memory-Hard Function for Password Hashing', *International Journal of Information Security*, vol. 22, no. 3, pp. 517-533.

Bernstein, D.J. 2008, 'ChaCha, a Variant of Salsa20', in *Workshop Record of SASC 2008: The State of the Art of Stream Ciphers*, pp. 3-5.

NIST. 2001, 'FIPS 197: Advanced Encryption Standard (AES)', National Institute of Standards and Technology, U.S. Department of Commerce.
