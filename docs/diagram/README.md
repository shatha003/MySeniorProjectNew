# HyperTool — Diagrams Index

> All diagrams are in `.drawio` format. Open with [draw.io](https://app.diagrams.net/) or the VS Code draw.io extension.

---

## Folder Structure

```
docs/diagram/
├── chapter-3-analysis/          ← Chapter 3: Requirements and Analysis
│   ├── 01-use-case-diagram.drawio
│   ├── 02-activity-diagram-scanning.drawio
│   ├── 03-activity-diagram-vault.drawio
│   ├── 04-activity-diagram-password.drawio
│   ├── 05-activity-diagram-ai-chat.drawio
│   └── 06-er-diagram.drawio
│
└── chapter-4-design/            ← Chapter 4: Design, Implementation and Testing
    ├── 07-dfd-level-0.drawio
    ├── 08-dfd-level-1.drawio
    ├── 09-component-diagram.drawio
    ├── 10-system-architecture.drawio
    └── 11-database-schema.drawio
```

## Chapter 3: Requirements and Analysis (Section 3.9) — `chapter-3-analysis/`

| # | Figure | File | Description |
|---|--------|------|-------------|
| 1 | Figure 3.1 | `01-use-case-diagram.drawio` | Use Case Diagram — All actors (User) and 15 use cases with external entities |
| 2 | Figure 3.2 | `02-activity-diagram-scanning.drawio` | Activity Diagram — URL & File scanning flow (UC3/UC4) |
| 3 | Figure 3.3 | `03-activity-diagram-vault.drawio` | Activity Diagram — Credential vault management with master password (UC10) |
| 4 | Figure 3.4 | `04-activity-diagram-password.drawio` | Activity Diagram — Password generation & strength checking (UC7/UC8) |
| 5 | Figure 3.5 | `05-activity-diagram-ai-chat.drawio` | Activity Diagram — AI chat with fallback model chain (UC11) |
| 6 | Figure 3.6 | `06-er-diagram.drawio` | Entity-Relationship Diagram — 7 entities with relationships |

## Chapter 4: Design, Implementation and Testing (Section 4.9) — `chapter-4-design/`

| # | Figure | File | Description |
|---|--------|------|-------------|
| 7 | Figure 4.1 | `07-dfd-level-0.drawio` | DFD Level 0 (Context Diagram) — System boundary with external entities |
| 8 | Figure 4.2 | `08-dfd-level-1.drawio` | DFD Level 1 — 7 processes, 4 data stores, external entities |
| 9 | Figure 4.3 | `09-component-diagram.drawio` | Component Diagram — Frontend (React) + Backend (Rust) + External |
| 10 | Figure 4.4 | `10-system-architecture.drawio` | System Architecture — 4-layer architecture |
| 11 | Figure 4.5 | `11-database-schema.drawio` | Database Schema — Firebase Firestore collections & fields |

---

## How to Open

1. **VS Code**: Install the [draw.io Integration](https://marketplace.visualstudio.com/items?itemName=hediet.vscode-drawio) extension
2. **Web**: Go to [app.diagrams.net](https://app.diagrams.net/) and drag a `.drawio` file into the editor
3. **Desktop**: Download [draw.io desktop](https://github.com/jgraph/drawio-desktop/releases)

## Color Coding Convention

| Color | Meaning |
|-------|---------|
| Blue (#dae8fc) | Auth / General functionality |
| Green (#d5e8d4) | Scanning / Privacy features |
| Yellow (#fff2cc) | Crypto / Vault / Password |
| Purple (#e1d5e7) | AI Agent features |
| Orange (#ffe6cc) | Firebase / Data stores |
| Red (#f8cecc) | VirusTotal / Errors |

## Signed

All diagrams created for the HyperTool Senior Project report.
Diagrams reflect the actual codebase architecture as of March 2026.
