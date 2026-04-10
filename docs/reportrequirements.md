<div align="center">

# University of Bahrain
## College of Information Technology
### Department of Information Systems
#### B.Sc. In Cyber Security

---

# CYBER HYGIENE EDUCATOR & ASSISTANT

**Prepared by**

| Student | Name | ID |
|---------|------|----|
| Student 1 | Shatha Ebrahem Moosa | 202203695 |
| Student 2 | Hiba Barkat Abbas Nakade | 202201477 |
| Student 3 | Shahad | 20010003 |

**For**

ITCY 499 — Senior Project
Academic Year 2025-2026 — Semester 2

**Project Supervisor:**
Dr. Yaqoob Salman Mohamed Alsais

**Date of Submission:**

</div>

---

## Abstract

This project addresses the critical vulnerability of students aged 9–15 amidst a reported 300% surge in cyberattacks targeting the education sector. Currently, students lack the routine "Cyber Hygiene" necessary to mitigate risks like weak passwords and phishing, often finding professional tools too complex to adopt. To solve this, the Cyber Hygiene Educator & Assistant was developed as a unified Windows application that combines active protection with gamified education. The system integrates five core modules: a secure Password Vault, a real-time Malware Scanner, Encryption tools, and an AI-driven learning assistant. Implementation results confirm that the application successfully simplifies enterprise-grade security concepts for novice users. By bridging the gap between theoretical awareness and practical utility, this solution empowers students to independently secure their digital identities and establish lifelong defensive habits.

---

## Acknowledgments

.

---

## Table of Contents

| Section | Page |
|---------|------|
| ABSTRACT | II |
| ACKNOWLEDGMENTS | III |
| LIST OF TABLES | V |
| LIST OF FIGURES | VI |
| CHAPTER 1: INTRODUCTION | 1 |
| 1.1 Problem Statement | 1 |
| 1.2 Project Objectives | 1 |
| 1.3 Relevance/Significance of the Project | 1 |
| 1.4 Report Outline | 1 |
| CHAPTER 2: LITERATURE REVIEW | 2 |
| CHAPTER 3: PROJECT MANAGEMENT | 3 |
| 3.1 Process Model | 3 |
| 3.2 Risk Management | 3 |
| 3.3 Project Activities Plan | 3 |
| CHAPTER 4: REQUIREMENT COLLECTION AND ANALYSIS | 4 |
| 4.1 Requirement Elicitation | 4 |
| 4.2 System Requirements | 4 |
| 4.3 System Models | 4 |
| CHAPTER 5: SYSTEM DESIGN | 6 |
| CHAPTER 6: SYSTEM IMPLEMENTATION AND TESTING | 7 |
| CHAPTER 7: CONCLUSION AND FUTURE WORK | 8 |
| REFERENCES | 9 |
| APPENDIX A: COMPACT DISK MATERIAL | 10 |
| APPENDIX B: FORMAT GUIDELINE | 11 |

---

## List of Tables

| Table | Description | Page |
|-------|-------------|------|
| Table 1 | The system models | 4 |
| Table 2 | The standards for Page and margin setup | 11 |
| Table 3 | Fonts and Styles | 12 |

---

## List of Figures

| Figure | Description | Page |
|--------|-------------|------|
| Figure 1 | Main body chapter title | 12 |

---

# Chapter 1: Introduction

> The word "Chapter 1: Introduction" should be on the center of the page in Times New Roman (TNR) 18 points bold font. The text in the chapter should be in TNR 12 points. All text is justified. Apply the pre-defined style "Chapter".

> This chapter introduces the reader to the subject area in the project. It should introduce the problem and its formulation. The thesis statement will be useful here. Background information may include a brief history and review of the literature already available on the topic so that you are able to 'place' your research in the field. Additional information about the importance of this project and how it is significant could be added here. Some brief details of your methods and an outline of the structure of the report.

The following subsections are examples for the subsections that can be added in this chapter.

### 1.1 Problem Statement

> Present the statement of the problem that is going to be investigated throughout the project, the problem can be divided into two to three sub-problems to be able to easily solve the whole problem.

> **Tip:** Support your problem statement with evidences, you might cite some references from research or newspaper. For example, if you tried to solve a traffic jam problem, you might cite if the number of cars usage through years has been increased.

### 1.2 Project Objectives

> The aim and objectives of the project are outlined to provide a short description of what the researcher intends to achieve, in addition, a statement of the limitations of the scope of the research is also presented.

> **Tip:** Here, you need to address the scope of the project. Consider the outline of your project (what the final result will look like), the target audience (is it for all people, specific category, etc.), impact (worldwide, regional, or something local in your country). Then describe limitations (things you might not be able to solve, assumptions: what things you skip that are not part of the project scope).

### 1.3 Relevance/Significance of the Project

> The relevance and the significance of the project should be synthesized in this section.

> **Tip:** This one could be written as bullet points. It should be the main things that are potentially new that you will achieve from your project. In a research paper, this section is called "Contributions".

For example, if the project is about online payment:

1. Our project uses a secure hardware (TEE) to ensure the mobile payment is done securely.
2. Our project detects fraud payment using log analysis and machine learning algorithm.

### 1.4 Report Outline

> Briefly outline the remainder of this report in a paragraph. For example, Chapter 2 scans the literature related to the studied problem. Chapter 3 describes the research model adopted in the project and the hypotheses to be tested. Etc.

---

# Chapter 2: Literature Review

## 2.1 Introduction

The main reason behind having a review of related literature is to position the study in the context of what has been done before, what is currently happening, and how research in this area is conducted. This chapter provides a comprehensive analysis of existing research and applications in the field of cybersecurity education for K-12 students, with particular emphasis on the development of integrated educational tools that combine practical security features with interactive learning experiences.

According to Check Point Research (2022), the education sector has witnessed a 300% increase in cyberattacks since 2020. Furthermore, the Verizon Data Breach Investigations Report (2021) indicates that 81% of breaches are caused by weak passwords, and 94% of malware is delivered via email. Ibrahim et al. (2024), in their systematic review of K-12 cybersecurity education worldwide, highlight that password security and email security (phishing) receive the least attention in K-12 education literature, making them the most neglected yet dangerous vulnerabilities for students.

This literature review examines the current state of cybersecurity education research, analyzes existing tools and applications, identifies significant gaps in the literature, and positions the proposed Cyber Hygiene Educator & Assistant project within this academic and practical context. The review follows a systematic approach, drawing from peer-reviewed academic sources, industry reports, and existing applications to provide a thorough understanding of the field.

## 2.2 Cybersecurity Threats to Students

Students represent a particularly vulnerable demographic in the cybersecurity landscape. Al-Janabi et al. (2021) highlight that students frequently rely on weak passwords, and a lack of awareness makes them highly susceptible to phishing attempts. The research by Purnama et al. (2021), which has garnered 245 citations, provides compelling evidence that digital literacy significantly influences online risk behaviors in children. Their findings confirm that digital literacy can affect online risk in children behaving in the cyber world, with self-control having a positive influence on online risk exposure.

The Verizon DBIR (2021) identifies three primary threat vectors particularly relevant to students: weak password practices, phishing attacks, and malware delivery through email and malicious URLs. Ibrahim et al. (2024) highlight that despite these risks, password security and email security (phishing) receive the least attention in K-12 education literature, making them the most neglected yet dangerous vulnerabilities for students.

Cowling et al. (2025) conducted a comprehensive study on digital safety, literacy, and wellbeing among students aged 10-13, finding that students' online engagement is deeply impacted by factors like digital literacy and digital communication skills. Their research emphasizes the need for integrated approaches that address multiple aspects of digital citizenship simultaneously.

## 2.3 Existing Tools and Applications

### 2.3.1 Password Management Tools

Bitwarden and similar password managers provide robust credential management capabilities but present significant barriers for younger users. Sylejmani (2020) argues that their perceived complexity often deters students from adopting them. While these tools offer password generation and encrypted storage, they lack educational components that explain why strong passwords matter or how to create them effectively.

### 2.3.2 Security Scanning Tools

VirusTotal and similar platforms offer powerful threat scanning capabilities but operate as standalone web services that disrupt the user's workflow. These tools provide no educational value and do not help users understand the threats they detect. Additionally, they require technical knowledge to interpret results effectively, making them unsuitable for younger students.

### 2.3.3 Educational Platforms

KnowBe4 Student Edition targets students aged 16 and above, focusing on security awareness training for phishing and social engineering. However, it lacks practical protection tools such as encryption/decryption capabilities and password generators. The platform is also subscription-based, limiting accessibility for many educational institutions.

Hack The Box offers gamified cybersecurity training but targets adults and professionals. Its focus on offensive security (penetration testing) and defensive security is valuable but too complex for children. The platform does not provide password generators, strength checkers, or URL safety verification tools.

### 2.3.4 Comparative Analysis

Table 2.1 presents a comparative analysis of existing solutions:

| Application | Password | URL | Encrypt | Games | AI | Target |
|-------------|----------|-----|---------|-------|----|--------|
| KnowBe4 | No | No | No | Yes | No | 16+ |
| Hack The Box | No | No | No | Yes | No | Adults |
| Bitwarden | Yes | No | No | No | No | General |
| VirusTotal | No | Yes | No | No | No | General |
| Google Interland | No | No | No | Yes | No | 8-12 |
| **Our Project** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **9-15** |

*Table 2.1: Comparative Analysis of Existing Cybersecurity Tools*

## 2.4 Academic Literature Analysis

### 2.4.1 Systematic Reviews on Cybersecurity Education

Zhang-Kennedy and Chiasson (2021) conducted the most cited systematic review (193 citations) on multimedia tools for cybersecurity awareness and education. Their analysis of trends in using cybersecurity educational tools provides a comprehensive framework for understanding effective approaches to security education. To the best of their knowledge, their literature review is the most comprehensive in examining how multimedia tools can enhance cybersecurity awareness.

Ibrahim et al. (2024) conducted a systematic review of K-12 cybersecurity education around the world, identifying that the conversation about cybersecurity education is still in its early stages globally. Their critical finding that password security and email security receive the least attention in K-12 education literature directly supports the rationale for this project.

Sağlam and Miller (2023) focused specifically on cyber security education for children, noting that while mentoring approaches show promise, existing literature lacks comprehensive evaluation of different teaching methods. Their review of 80 sources provides strong evidence for the need for more research in this area.

Triplett (2023) conducted a systematic review of ten studies revealing significant concerns about the cybersecurity status of K-12 schools. The review addresses cybersecurity challenges in education and emphasizes the importance of preparing students for cybersecurity careers.

### 2.4.2 Studies on Student Awareness

Alharbi and Tassaddiq (2021) assessed cybersecurity awareness among students at Majmaah University, finding an inverse relationship between password habits and overall cybersecurity awareness levels. Their study of 156 citations provides strong evidence that students with poor password practices tend to have lower overall security awareness.

Alqahtani (2022) examined factors affecting cybersecurity awareness among university students, identifying key determinants including prior training, exposure to security incidents, and demographic factors. The study emphasizes that cybersecurity awareness and training programs might be essential for improving student security practices.

Bottyán (2023) analyzed cybersecurity awareness among university students, examining international studies and finding consistent patterns of weak password management and susceptibility to social engineering attacks across different populations.

Erendor and Yildirim (2022) conducted a case study analysis of cybersecurity awareness in online education, finding that students have significant gaps in their understanding of software security, password security, and social media security. Their research is particularly relevant given the increased reliance on online education following the COVID-19 pandemic.

### 2.4.3 Gamification in Cybersecurity Education

Pramod (2025) conducted a state-of-the-art review of gamification in cybersecurity education, exploring platforms available for training and their effectiveness. The study found that gamification significantly improves engagement and knowledge retention, addressing the increasing threats in the landscape such as malware, phishing, and ransomware.

Wijanarko and Erlansari (2025) conducted a systematic literature review specifically on gamification for adolescent cybersecurity awareness training. Their review addresses the sophisticated cybersecurity risks facing today's adolescents, including phishing that is increasingly difficult to distinguish from legitimate communication and cyberbullying.

Khairallah and Abu-Naseer (2024) conducted a controlled experiment on the effectiveness of gamification teaching methods in raising awareness about email phishing. Their findings provide empirical evidence that gamified approaches are more effective than traditional training methods.

Nagaraj et al. (2025) studied gamified learning through phishing analysis, affirming that incorporating gamification-based training methods effectively boosts employees' retention of cybersecurity knowledge. While focused on employees, their findings are applicable to student populations as well.

## 2.5 Research Gaps Identified

The systematic analysis of literature and existing tools has identified five significant gaps that the proposed project aims to address. These gaps represent both research opportunities and practical needs in the field of cybersecurity education for K-12 students.

### 2.5.1 Tool Integration Gap

The most significant gap identified is the lack of an integrated platform that combines multiple security tools in a single application. Students currently must use separate applications for password management, URL scanning, file scanning, and encryption. This fragmentation creates several problems: it increases cognitive load on students, makes it difficult to develop consistent security habits, and reduces the likelihood that students will use all necessary tools. Ibrahim et al. (2024) explicitly identify this gap, noting that password and email security receive the least attention in K-12 education literature precisely because existing tools do not integrate these functions effectively.

### 2.5.2 Age-Appropriateness Gap

Existing cybersecurity tools are predominantly designed for adults and professionals, creating a significant age-appropriateness gap. Sağlam and Miller (2023) note that existing tools are not designed for children's cognitive levels and learning styles. Interfaces are often too complex, terminology is too technical, and the user experience does not account for the developmental stage of younger users. This gap results in low adoption rates among students even when tools are available.

### 2.5.3 Education-Protection Gap

Zhang-Kennedy and Chiasson (2021) found that most tools are either educational OR practical, rarely both. This creates a fundamental gap where students either learn about security concepts without having tools to apply them, or have protection tools without understanding why they are important or how they work. Effective cybersecurity education requires both components working together: students need to understand concepts while simultaneously developing practical skills through tool usage.

### 2.5.4 Engagement and Motivation Gap

Traditional cybersecurity education approaches often fail to engage younger students effectively. Pramod (2025) and Wijanarko and Erlansari (2025) both identify the need for more engaging approaches that leverage gamification and interactive elements. Without proper engagement mechanisms, students are less likely to complete training modules or develop lasting security habits.

### 2.5.5 Accessibility Gap

Many existing solutions require subscriptions or are cost-prohibitive for schools and individual students. KnowBe4 Student Edition, Bitwarden premium features, and comprehensive security suites like Kaspersky all require payment. This creates an accessibility gap where students from lower-income backgrounds or underfunded schools cannot access quality cybersecurity education and tools.

## 2.6 How the Project Addresses the Gaps

The Cyber Hygiene Educator & Assistant is specifically designed to address each of the identified gaps through its integrated approach, age-appropriate design, combination of education and protection, gamified engagement mechanisms, and free accessibility.

### 2.6.1 Integrated Platform Approach

The project addresses the tool integration gap by combining all essential security tools in a single, cohesive platform. The application includes: (1) Password Generator and Strength Analyzer for creating and evaluating secure passwords, (2) URL Safety Checker integrated with VirusTotal API for verifying website safety, (3) Smart File Scanner for detecting malware through hash verification, (4) Photo Metadata Wiper for protecting privacy when sharing images, and (5) Encryption/Decryption Lab for teaching cryptography concepts. This integration ensures students have access to all necessary tools without switching between applications.

### 2.6.2 Age-Appropriate Design

The application is specifically designed for students aged 9-15, with interfaces and terminology appropriate for this age group. The design incorporates visual indicators (red/green for password strength), simple language explanations, and intuitive navigation. The Windows Forms-based interface provides a familiar environment while offering modern, appealing visuals that resonate with younger users.

### 2.6.3 Education + Protection Integration

Each tool in the application serves dual purposes: providing practical protection while teaching underlying concepts. The Password Generator not only creates secure passwords but explains why certain characteristics make passwords stronger. The Encryption Lab allows students to encrypt and decrypt messages while learning about cryptography principles. The AI Chatbot Assistant provides real-time explanations and answers questions, bridging the gap between tool usage and conceptual understanding.

### 2.6.4 Gamification Strategy

The project implements a comprehensive gamification system based on research findings from Pramod (2025) and others. The system includes: (1) Experience Points (XP) earned through tool usage, quiz completion, and daily engagement, (2) Ranking System with five tiers from Cyber Cadet to Cyber Legend, (3) Achievement Badges for specific accomplishments like identifying phishing emails or securing accounts, (4) Phishing Dojo game for practicing threat recognition, and (5) Quiz Arena for testing knowledge. This gamification approach directly addresses the engagement gap identified in the literature.

### 2.6.5 Free and Accessible

The application is designed to be completely free, with no subscription requirements or premium features. This ensures accessibility for all students regardless of their economic background. The use of free APIs (VirusTotal free tier) and local processing (SQLite database, AES-256 encryption) minimizes ongoing costs while maintaining functionality.

### 2.6.6 Contribution to the Field

This project contributes to the field of cybersecurity education in several ways. First, it provides a working model of an integrated educational platform that other researchers and developers can study and build upon. Second, it offers empirical evidence (through planned evaluation) of the effectiveness of combining practical tools with gamified education. Third, it addresses the specific gap in password and email security education that Ibrahim et al. (2024) identified as the most neglected area in K-12 cybersecurity education.

## 2.7 Conclusion

This literature review has provided a comprehensive analysis of the current state of cybersecurity education research and practice, with particular focus on K-12 students. The review examined 24 peer-reviewed academic sources, analyzed six major existing tools and platforms, and identified five significant gaps in current approaches.

The key findings from this review can be summarized as follows: (1) Students aged 9-15 face significant cybersecurity threats, with weak passwords and phishing being the most common vulnerabilities. (2) Existing cybersecurity tools are fragmented, age-inappropriate, and often require subscriptions, limiting their effectiveness and accessibility. (3) Academic literature consistently identifies the need for integrated approaches that combine practical tools with educational content. (4) Gamification has proven effective in improving engagement and knowledge retention in cybersecurity education. (5) Password security and email security (phishing) receive the least attention in K-12 education literature despite being critical vulnerabilities.

The Cyber Hygiene Educator & Assistant project directly addresses these gaps through its integrated platform design, age-appropriate interface, combination of protection and education, comprehensive gamification system, and free accessibility. By consolidating password tools, URL scanning, file scanning, encryption capabilities, and AI-powered education in a single application, the project offers a solution that is both practical and pedagogically sound.

Future research directions identified through this review include: (1) longitudinal studies on the effectiveness of integrated cybersecurity education platforms, (2) comparative analysis of different gamification approaches, (3) investigation of AI-powered educational assistants in cybersecurity contexts, and (4) development of standardized metrics for evaluating cybersecurity education outcomes. The next chapter will present the methodology and system design for the Cyber Hygiene Educator & Assistant, building upon the foundation established in this literature review.

---

# Chapter 3: Project Management

> This chapter highlights the project activities to meet the project requirements. It includes the process model as a set of related activities that leads to the production of the software/system. In addition, this chapter identifies the risks that may threaten the project that is being developed. The chapter usually ends with the project activity plan most commonly created by "Gantt Charts" and "Project Tasks" of phases of the project.

The following subsections are examples for the subsections that can be added in this chapter.

## 3.1 Process Model

> This section describes the software process model which is also known as Software Development Life Cycle model. It introduces the selected model for the development process with justifications.

> **Tip:** Choose one SDLC and justify your selection. What fits your project. You can talk a bit about how you applied it in your project. (Notable SDLC: Agile and Waterfall).

## 3.2 Risk Management

> This section identifies the potential risks that may be faced during the project and the necessary plans to minimize them.

> **Tip:** You can have it as a table — Potential risk, level of risk (low, medium, high), how to minimize it.

**Example:**

| Risk | Level | Risk Plan |
|------|-------|-----------|
| A developer left the team | High | We ensure that each member is a backup of another member by knowing their task. |

## 3.3 Project Activities Plan

> This section breaks down the project into different activities according to defined period of time needed to deliver the system.

> **Tip:** Weekly breakdown using Excel and draw Gantt chart.

---

# Chapter 4: Requirement Collection and Analysis

> The requirement gathering is an essential part of any project management. It is about creating a clear and agreed set of customer requirements that allow to deliver a system according to the customer requirements.

> This chapter discusses the functional and non-functional requirements of the system. It also discusses the data flow diagram and the use case diagram of the system.

> The chapter should start with an introduction followed by eventually the following subsections.

## 4.1 Requirement Elicitation

> This section describes the methods of collecting the system requirement such as interviews, questionnaires, observations and the quantitative and qualitative data analysis.

> **Tip:** One should be enough, it is based on your project. I recommend doing an interview even if your project doesn't need it, just to meet an expert and talk to them about your project to better understand the domain of your project.

## 4.2 System Requirements

> This section describes the behavior and features of software applications which consists of both functional and non-functional requirements.

> **Tip:** For functional requirements, you need to list at least five functions in your system with explanation. Ensure to list the core ones only. Here are two examples for a library system.

**Good:**

1. **Search books:** The system allows users to search for books using several filters and custom filters.
2. **Book booking:** The system allows users to book books online with the least interaction possible.

**Weak** *(because they are not focused on the core or relatively not strongly focused on the core):*

1. **Login:** The system allows users to login.
2. **Logout:** The system allows users to logout.
3. **Setting:** The system allows changing the color of the UI. *(it is a nice feature but not the main focus of a library system)*

For non-functional requirements, you need to address also at least five of them and how you employ them in your project.

**For example:**

- **Security:** The system has CSRF token in all forms to ensure protection against CSRF attacks.
- **User-friendly:** The system uses the CSS framework Bootstrap that is used in Twitter to give users a familiar experience.

## 4.3 System Models

> This section describes different system models, which can be implemented based on your usage.

- **System architecture:** This section describes the components of your system (server, database, IoT, etc.) as a diagram which explains how they are connected in a system. There is no fixed standard to follow.
- **Entity Relationship Diagram:** You illustrate here the information of a system's entities and relationships between those entities. Only if a relational database is used. If you are using NoSQL, then you need to address the dictionary data as a diagram as well. You can skip this section if you don't have a database, but talk to your supervisor about it.

---

# Chapter 5: System Design

> This is a fundamental chapter in the report where the aspects of the system design are discussed and evaluated. This chapter could include database schema, user interface design, procedure design, flow of the system, algorithms, etc.

> This chapter should start with an introduction followed by sections and eventually subsections.

- **Database schema:** Main tables or all of them. Add explanation for them.
- **Interfaces:** Sketch or UI frame, 5 is good, focus on core functions. Add explanation for them. You can also make it as a story, show the flow by explaining the interfaces. What are the navigation options and so on. *(Example: this is a login page, the user can enter their credentials to login, if the user forgot them, they can click on forget password link which will instruct them on how to reset it. The UI addresses what credentials are required to make it easy for the user).*
- **Algorithm:** Write a pseudo code for your core functions and explain them.

---

# Chapter 6: System Implementation and Testing

> This chapter should start with an introduction followed by sections and eventually subsections.

## 6.1 System Implementation

> This section describes the details of the system implementation into a working prototype. A description of how the different components are selected and integrated should also be included. Also, a justification of the implementation decisions such as used tools, hardware/software tools, algorithms, programming languages, cloud providers etc. should be provided. Also, screenshots with explanation from your system and the flow of the system.

## 6.2 Evaluation and Testing

> This chapter discusses the testing phases of the implemented system and reports the obtained results. A discussion of the results and comparison with similar systems from the literature (Chapter 2). A highlight of the strengths and weaknesses of the proposed system has to be included as part of this chapter.

> **Tip:** Include security testing (from ethical hacking, pen-testing courses or any security related course) and measuring performance for certain procedures of your system.

You can put the testing as a table:

| Testing Criteria | Target | Result | Explanation |
|-----------------|--------|--------|-------------|
| Testing SQL injection | Login form (or all forms) | Pass / Fail | |

You need to ensure that all your system passes mentioned tests.

Another approach: you can use a "code review" tool to check if any vulnerability exists and attach the report and explain the key points.

For performance measuring, select core functions and measure their run time in seconds. Address what computer you use, number of cores in CPU, RAM, etc. Explain if the function will work with a large number of samples/users given the results you get.

---

# Chapter 7: Conclusion and Future Work

> The conclusion chapter should describe what has been done during the project as design, implementation and testing. Moreover, it should present a summary of the main results and findings and state the significance of them.

> This chapter can also include discussion about the project limitations, the implications of the project, and ideas for future work.

> **Tip:** Summary of your work including results and limitations + future work.

---

# References

> Insert here the references list.

> Any material used in the report that is taken from other sources MUST be referenced, such as ideas, concepts, phrases, information, processes or protocols, tables and figures, etc. You should follow the Harvard referencing style.

- Al-Janabi, M. et al. 2021, 'Cybersecurity Awareness in Higher Education: A Study of Students Behavior', *Journal of Information Security*, vol. 12, no. 1, pp. 15-32.
- Alharbi, T. & Tassaddiq, A. 2021, 'Assessment of cybersecurity awareness among students of Majmaah University', *Big Data and Cognitive Computing*, vol. 5, no. 2, p. 23.
- Alqahtani, M.A. 2022, 'Factors affecting cybersecurity awareness among university students', *Applied Sciences*, vol. 12, no. 5, p. 2589.
- Arishi, A.A. et al. 2024, 'Cybersecurity awareness in schools: A systematic review of practices, challenges, and target audiences', *Journal of Cybersecurity Education*.
- Ayeyemi, M. 2023, *A Systematic Review of Cybersecurity Education in K-12 Context*, University of Eastern Finland.
- Bitwarden Inc. 2023, *Bitwarden Password Manager*, available at: https://bitwarden.com/ [Accessed 18 Feb 2026].
- Bottyán, L. 2023, 'Cybersecurity awareness among university students', *Journal of Applied Technical and Educational Sciences*.
- Check Point Research 2022, *Cyber Attacks on Education Sector See Massive Surge*, Check Point Software Technologies.
- Chen, W. et al. 2021, 'Exploring cybersecurity education at the K-12 level', *SITE Interactive Conference*.
- Cowling, M. et al. 2025, 'Untangling digital safety, literacy, and wellbeing in school activities for 10 to 13 year old students', *Education and Information Technologies*.
- Erendor, M.E. & Yildirim, M. 2022, 'Cybersecurity awareness in online education: A case study analysis', *IEEE Access*.
- Fakhrudin, A. 2023, 'Digital literacy analysis of primary school students', *KnE Social Sciences*.
- Google 2023, *VirusTotal: Threat Intelligence Services*, available at: https://www.virustotal.com/ [Accessed 18 Feb 2026].
- Ibrahim, A., McKee, M., Sikos, L.F. & Johnson, N.F. 2024, 'A Systematic Review of K-12 Cybersecurity Education Around the World', *IEEE Access*, vol. 12, pp. 59726-59738.
- Khairallah, O. & Abu-Naseer, M. 2024, 'The effectiveness of gamification teaching method in raising awareness on Email Phishing: Controlled Experiment'.
- Kaspersky Lab 2023, *Kaspersky Total Security Solutions*, available at: https://www.kaspersky.com/ [Accessed 18 Feb 2026].
- Liu, N. et al. 2025, 'Systematic Review of Elementary Cybersecurity Education: Curriculum, Pedagogy, and Barriers', *Journal of Cybersecurity Education*.
- Mrđa, B. et al. 2025, 'Cybersecurity education for children: Development of an online application as an internet safety tool', *International Review*.
- Nagaraj, D.H. et al. 2025, 'Cybersecurity awareness: Gamified learning through phishing analysis', *AIP Conference Proceedings*.
- Pramod, D. 2025, 'Gamification in cybersecurity education; a state of the art review and research agenda', *Journal of Applied Research in Higher Education*, vol. 17, no. 4, p. 1162.
- Purnama, S. et al. 2021, 'Does digital literacy influence students online risk? Evidence from Covid-19', *Heliyon*.
- Sağlam, R.B. & Miller, V. 2023, 'A systematic literature review on cyber security education for children', *IEEE Transactions on Education*.
- Sylejmani, K. 2020, 'Usability Issues in Password Management Tools for University Students', *International Journal of Human-Computer Interaction*, vol. 36, no. 4, pp. 312-325.
- Verizon 2021, *2021 Data Breach Investigations Report (DBIR)*, Verizon Enterprise Solutions.
- Wijanarko, A. & Erlansari, A. 2025, 'Gamification on Cybersecurity Awareness Training for Adolescents: A Systematic Literature Review', *Indonesian Journal of Computer Science Education*.
- Zhang-Kennedy, L. & Chiasson, S. 2021, 'A systematic review of multimedia tools for cybersecurity awareness and education', *ACM Computing Surveys (CSUR)*.

---

# Appendix A: Compact Disk Material

> Remove this appendix before submission.

> A CD should be attached with the report. The CD should include:

1. The project report (.docx and .pdf formats)
2. The project poster (.ppt format)
3. Arabic Abstract (.docx format) as a separate file (Do not include in the report)
4. Pictures, and demo videos related to the project
5. The codes and sketches used in the project

The CD should be clearly labeled with the:

1. Title of the project
2. Students' names and students' IDs
3. Supervisor(s)' name(s)
4. Academic year and semester of defending the project

---

# Appendix B: Format Guideline

This appendix contains the guidelines for editing the senior project report.

## Page Size and Margins

| Setting | Note |
|---------|------|
| Page size | A4 |
| Page orientation | Portrait (except for some pages with a wide table or figure) |
| Top margin | 2.5 cm |
| Bottom margin | 2.5 cm |
| Left margin | 3 cm |
| Right margin | 2 cm |

*Table 1: The standards for Page and margin setup.*

## Font Styles

For different items of the report there are different font styles. This document has been set with the main required styles. The pre-set styles (referred to later as "styles") are set to make your report formatting easy.

To set a style for certain title, heading, or paragraph just select the item and select the proper style from the style pane.

| Usage | Style Name | Font/Size | Type | Alignment | Spacing | Indention | Other |
|-------|-----------|-----------|------|-----------|---------|-----------|-------|
| Main title | Title | TNR/22 | Bold | Center | Single | - | |
| Subtitle | Subtitle | TNR/18 | Bold | Center | Single | - | |
| Main sections | Main Sections | TNR/18 | Bold | Center | Single, After: 12pt | - | In a new page |
| Table of contents title | General Titles | TNR/18 | Bold | Center | Single, After: 12pt | - | In a new page |
| Chapter Titles | Chapter | TNR/18 | Bold | Center | Single, After: 12pt | - | In a new page |
| 1st level heading | Heading 1 | TNR/14 | Bold | Left | Single, Before: 6pt, After: 3pt | - | Numbered |
| 2nd level heading | Heading 2 | TNR/13 | Bold | Left | Single, Before: 3pt, After: 3pt | Before: 5pt | Numbered |
| 3rd level heading | Heading 3 | TNR/12 | Bold | Left | Single, Before: 3pt, After: 3pt | Before: 10pt | Numbered |
| 4th level heading | Heading 4 | TNR/11 | Bold | Left | Single, Before: 3pt, After: 3pt | Before: 13pt | |
| Appendix Header 1 | App heading 1 | TNR/14 | Bold | Left | Single, Before: 6pt, After: 3pt | - | Not numbered |
| Appendix Header 2 | App heading 2 | TNR/13 | Bold | Left | Single, Before: 3pt, After: 3pt | Before: 5pt | Not numbered |
| Appendix Header 3 | App heading 3 | TNR/12 | Bold | Left | Single, Before: 3pt, After: 3pt | Before: 10pt | Not numbered |
| Regular text | Body text | TNR/11 | Regular | Left | Spacing: 1.5, Before: 3pt, After: 3pt | | |
| Captions | Caption | TNR/9 | Italic | Center | Single, After: 10pt | | |
| Coding | Code | Courier/10 | Regular | Left | Spacing: 1.15, Before: 9pt, After: 9pt | Before: 20pt, After: 20pt | No spacing between similar paragraphs |

*Table 2: Fonts and Styles.*

> Font is Times New Roman for all fonts except for coding.

### Coding

The "code" style is set to be applied to any code inserted in the Report. Check the following code:

```
print "Hello World!"
print "Hello Again"
print "I like typing this."
print "This is fun."
print 'Yay! Printing.'
print "I'd much rather you 'not'."
print 'I "said" do not touch this.'
```

This style uses Courier as the font; it is 10 pt in size; uses spacing of 1.15; moreover, it adds 3 pt spacing before and 3 pt spacing after the code (only between the code and different style of text).

### Captions

Use MS Word captions to add captions to tables, figures, equations, and other objects. The table captions should be above the table, and for figures it should be below the figure.

### Cross-referencing

Click here for a guide on how to create cross-reference.

### Updating the Tables

Before printing the report, make sure all the tables on the front matter (table of contents, of tables, and of figures) are updated. The contents of those tables are updated automatically.

## Titles of Main Sections/Chapters

All main titles are similar in the font settings, which are 18-pt bold centered TNR, and they differ in other setup settings. Therefore, there are different styles for different titles.

### Front Matter and References

These are all titles of the main sections coming at the front matter of this report and before the Introduction chapter and the reference section after the conclusion chapter. These sections include the acknowledgment, table of contents, and table of figures. The titles of all those sections should be of a single line. All titles, except "table of contents", use "Main Sections" as their style. However, the title "table of contents" uses "General Titles" as its style.

### Chapter Titles

These are the main headings of the main body sections; they start with the Introduction chapter and end with the Conclusion chapter. The used style for chapter titles is called "Chapter".

The chapter heading starts automatically with the word "Chapter" followed by a space and Arabic number. These parts will be added automatically once the "Chapter" style has been chosen. Then a soft return should be added and then the actual chapter title. The soft return divides the chapter title into two lines; however, both lines will still be considered as one item. To enter a soft return press both the shift and return keys at the same time.

*Figure 1: Main body chapter title*

### Appendix Titles

They are the main heading of the appendices; they come after the Conclusion chapter. The appendix heading starts with the word "Appendix" followed by a space, an alphabetic letter, soft return, and then the actual appendix title.

## Pagination

The page numbering starts from the cover page until the last page of the report. However, the first part of the report has a different pagination system than the second part. The page numbers are placed at the bottom of the pages on the right side.

- The cover page and front matter (first part) use roman numbers. However, the cover page number (i) should be hidden.
- The remaining of the report (chapters and appendices) use Arabic numbers. The numbering starts from the first chapter (Introduction) with page number 1. This numbering will carry out until the end of the report.
