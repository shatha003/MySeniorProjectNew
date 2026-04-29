# Report Updates: QuickGuide Onboarding Feature

This document contains all the text additions needed to document the QuickGuide onboarding component in the CHEA project report. Each section is labeled with the report chapter/section it belongs to and specifies whether it's a new paragraph, a sentence to append, or text to replace.

---

## 1. Section 2.6.2 — Age-Appropriate Design (Append to end of paragraph)

**What to change:** Append the following sentence to the end of the existing paragraph in Section 2.6.2 (line 177).

**Text to add:**

To further support younger users who may be unfamiliar with cybersecurity tools, we implemented a collapsible QuickGuide component on the four most tool-intensive pages (Link Scanner, File Scanner, Password Checker, and Credential Vault). Each guide presents 3–4 numbered, kid-friendly steps with emoji icons that explain exactly what to do — for example, "Copy a link you want to check → Paste it in the box → Click Scan Now → Read the result." The guide appears as a small banner below the page header with a lightbulb icon and "Not sure what to do?" label, expanding on click and dismissible via a close button. This design directly addresses the age-appropriateness gap identified by Sağlam and Miller (2023) by ensuring that students aged 9–15 can use every tool independently, even on their first visit, without needing external instructions or adult supervision.

---

## 2. Section 4.2.2 — Non-Functional Requirements Table, NFR-02 Row (Replace)

**What to change:** Replace the NFR-02 row in Table 4.2 (line 433) with the expanded version below.

**Old text:**

| NFR-02 | Usability | The interface is designed for students aged 9-15, using visual indicators, non-technical language, and a cyberpunk-themed aesthetic. |

**New text:**

| NFR-02 | Usability | The interface is designed for students aged 9-15, using visual indicators, non-technical language, a cyberpunk-themed aesthetic, and collapsible step-by-step QuickGuide banners on tool pages to support first-time users unfamiliar with cybersecurity tools. |

---

## 3. Section 5.3.6 — Link Scanner Interface (Append after first paragraph, before scan details)

**What to change:** Insert the following paragraph after the sentence ending "and a prominent 'Scan' button with a search icon." in Section 5.3.6 (around line 710).

**Text to add:**

Below the hero header, a collapsible QuickGuide banner provides four numbered onboarding steps: (1) copy a link to check, (2) paste it in the search box, (3) click "Scan Now!" to check with 70+ security engines, and (4) read the result — green means safe, red means danger. The guide is dismissible and uses translated step text, supporting both English and Arabic. This ensures that students who have never used a URL scanner before can complete their first scan without confusion.

---

## 4. Section 5.3.9 — Credential Vault Interface (Append after "Vault Lock Screen" paragraph)

**What to change:** Insert the following paragraph after the vault lock screen description in Section 5.3.9 (after line 762).

**Text to add:**

Below the hero header (visible only after the vault is unlocked), a collapsible QuickGuide banner provides four numbered onboarding steps: (1) set up a master password in Settings if not done yet, (2) unlock the vault by typing the master password, (3) click "Add New!" to save a login or card, and (4) remember that everything is encrypted — only the master password can unlock it. This guide is particularly important for the Vault page, as the two-step unlock flow (setup then unlock) can be confusing for younger students encountering encrypted storage for the first time.

---

## 5. Section 5.3.13 — File Scanner Interface (Append after "Upload Card" description)

**What to change:** Insert the following paragraph after the Upload Card idle state description in Section 5.3.13 (around line 806).

**Text to add:**

Below the hero header, a collapsible QuickGuide banner provides four numbered onboarding steps: (1) click "Pick a File!" to choose a file from the computer, (2) wait while 70+ security engines scan it, (3) check the result — green means safe, red means danger, and (4) if the file is dangerous, quarantine or delete it. The guide uses emoji icons and translated text to ensure accessibility for students who have never used a malware scanner.

---

## 6. Section 5.3.14 — Password Checker Interface (Append after "Password Input" paragraph)

**What to change:** Insert the following paragraph after the password input description in Section 5.3.14 (around line 820).

**Text to add:**

Below the hero header, a collapsible QuickGuide banner provides four numbered onboarding steps: (1) type any password to test in the input box, (2) watch the strength meter and score change as you type, (3) check the green checklist — each checkmark means the password is stronger, and (4) read the hacker story below to see how fast the password could be cracked. This guide helps students understand the relationship between the multiple analysis panels (strength meter, checklist, crack time, AI narrative) and how to interpret them together.

---

## 7. Section 5.4.4 — Reusable UI Component Library (Replace table section)

**What to change:**

1. Change "11 reusable UI components" to "12 reusable UI components" on line 976.
2. Add a row to the component table (after MusicPlayer row, before the blank line on line 988).

**New table row to add:**

| QuickGuide | Collapsible step-by-step onboarding banner with numbered steps, emoji icons, smooth expand/collapse animation, and dismissible state. Used on LinkScanner, FileScanner, PasswordChecker, and CredentialVault pages to guide first-time users through each tool's workflow. Steps are fully translated via i18next. |

---

## 8. Section 6.1.2.1 — Project Structure (Update ui/ comment)

**What to change:** Update the `ui/` comment in the directory tree (line 1676).

**Old text:**

```
│   ├── ui/           # Reusable UI primitives (Button, Input, Card, Checkbox, TitleBar, ThemeToggle, PasswordStrength, PasswordInput)
```

**New text:**

```
│   ├── ui/           # Reusable UI primitives (Button, Input, Card, Checkbox, TitleBar, ThemeToggle, PasswordStrength, PasswordInput, QuickGuide)


---

## 9. Section 5.6 — Summary (Append sentence about QuickGuide)

**What to change:** In the summary paragraph (around line 1641), the sentence listing the reusable UI component library should be updated to mention the QuickGuide.

**Find this sentence:**

The application architecture (Section 5.4) documents the routing system with authentication guards, the Zustand state management layer, the centralised AI service module, and the reusable UI component library including three AI-specific components.

**Replace with:**

The application architecture (Section 5.4) documents the routing system with authentication guards, the Zustand state management layer, the centralised AI service module, and the reusable UI component library including twelve UI primitives and three AI-specific components, with a QuickGuide onboarding component integrated into four tool pages to support first-time users aged 9–15.

---

## 10. Section 2.5 — Research Gaps Table (Update Age-Appropriateness Gap row)

**What to change:** In the research gaps table (around line 211), update the "CHEA Solution Strategy" cell for the Age-Appropriateness Gap row.

**Old text:**

Targeted Design: Interfaces specifically for ages 9–15 with visual feedback (red/green indicators) and non-technical language.

**New text:**

Targeted Design: Interfaces specifically for ages 9–15 with visual feedback (red/green indicators), non-technical language, and collapsible QuickGuide onboarding banners on tool pages that provide numbered step-by-step instructions for students unfamiliar with cybersecurity tools.
