# Cyber Hygiene Integration Plan for CHEA App

## Overview
Align the CHEA app's UI with the senior project report's core terminology: **"Cyber Hygiene"** (proper noun for the app's focus) and **"cyber hygiene"** (general practice), plus the full app name **"Cyber Hygiene Educator & Assistant (CHEA)"** as requested by your advisor.

---

## 1. Update App Titles & Branding (High Visibility)
Update key branding elements to prominently feature "Cyber Hygiene" terminology:

| File | Change |
|------|-------|
| `project/index.html` | Update `<title>` to `Cyber Hygiene Educator & Assistant (CHEA)` |
| `project/src-tauri/tauri.conf.json` | Update window `title` to `Cyber Hygiene Educator & Assistant` |
| `project/src/components/layout/DashboardLayout.tsx` | Add "Cyber Hygiene Educator & Assistant" as a subtitle below the CHEA logo in the sidebar |
| `project/src/pages/LandingPage.tsx` | Add "Cyber Hygiene Educator & Assistant" as a tagline below the CHEA header logo |

---

## 2. Update Translation Files (English First, Replicate to Arabic)
Modify i18n translation files to integrate "cyber hygiene" terminology naturally:

### English Translations
| File | Key Changes |
|------|--------------|
| `src/i18n/locales/en/landing.json` | Add `appFullName: "Cyber Hygiene Educator & Assistant"`, update `heroDesc`/`missionDesc` to mention "building cyber hygiene habits" |
| `src/i18n/locales/en/dashboard.json` | Update `readySafe` to "Ready to build your cyber hygiene today?" |
| `src/i18n/locales/en/nav.json` | Update `askNova` subtitle to mention "cyber hygiene tips" |
| `src/i18n/locales/en/aiAgent.json` | Update welcome message to emphasize CHEA teaches cyber hygiene |

### Arabic Translations (Replicate Changes)
| File | Key Changes |
|------|--------------|
| `src/i18n/locales/ar/landing.json` | Add `appFullName: "معلم ون助手 النظافة السيبرانية"` (or appropriate Arabic translation), update relevant descriptions |
| `src/i18n/locales/ar/dashboard.json` | Update `readySafe` to Arabic equivalent of "Ready to build your cyber hygiene today?" |
| `src/i18n/locales/ar/nav.json` | Update `askNova` subtitle to mention cyber hygiene in Arabic |
| `src/i18n/locales/ar/aiAgent.json` | Update welcome message to reference cyber hygiene in Arabic |

---

## 3. Add Cyber Hygiene to Key UI Sections
Integrate "cyber hygiene" references into high-traffic UI areas:

- **Dashboard header**: Add subtitle "Building lifelong cyber hygiene habits"
- **Landing page hero**: Add "Master Cyber Hygiene" as a secondary tagline
- **Tool descriptions**: Tie each tool to improving cyber hygiene (e.g., "Check links to maintain good cyber hygiene")
- **AI Agent welcome message**: Explicitly mention CHEA's role in teaching cyber hygiene

---

## 4. Terminology Rules (Match Report Consistency)
Follow the report's exact terminology conventions:

- Use **"Cyber Hygiene"** (title case) for the proper noun/app name
- Use **"cyber hygiene"** (lowercase) for general references to the practice
- Use full app name: **"Cyber Hygiene Educator & Assistant (CHEA)"** on first mention, then "CHEA" for subsequent references

---

## 5. Verification (Post-Implementation)
After making changes, run these commands from the `project/` directory to ensure quality:

```bash
# Lint check
bun run lint

# TypeScript compilation check
bun run build
```

Then manually test:
- High-visibility pages (Landing, Dashboard) to confirm text displays correctly
- Check sidebar and header for updated branding
- Verify translation keys load properly in both English and Arabic

---

## 6. Implementation Priority
Execute changes in this order for maximum impact:
1. App titles/branding (highest visibility)
2. Landing page and Dashboard translations
3. Sidebar and header UI updates
4. Tool description updates
5. AI Agent message updates
6. Arabic translation replication
