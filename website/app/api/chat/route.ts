import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter
// In production, you should use Redis or similar for distributed rate limiting
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

const RATE_LIMIT = 10; // Max 10 requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

function getClientIp(req: NextRequest): string {
  // Try various headers to get client IP
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

function checkRateLimit(clientIp: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = rateLimits.get(clientIp);

  if (!entry || now > entry.resetTime) {
    // Create new window
    rateLimits.set(clientIp, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetIn: RATE_LIMIT_WINDOW };
  }

  if (entry.count >= RATE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT - entry.count,
    resetIn: entry.resetTime - now,
  };
}

// Comprehensive system prompt with full app knowledge (same as desktop app)
const SYSTEM_PROMPT = `You are Nova, CHEA's AI cybersecurity assistant - a comprehensive knowledge base for the CHEA desktop cybersecurity application.

## ABOUT CHEA
CHEA stands for "Cyber Hygiene Educator and Assistant" - a desktop cybersecurity education application built with Tauri (Rust backend + React frontend). It features a cyberpunk/neon aesthetic with gamification elements including XP, levels, streaks, and daily quests.

## ALL CHEA TOOLS & FEATURES

### 1. Dashboard (/dashboard)
The main hub showing:
- Security Score card (calculated from XP, streak, vault items, activity)
- Stats Overview: XP, Level, Streak, Total Activities
- Progress bar showing XP to next level
- Tool grid with all 14 available tools
- Recent Activity feed
- Daily Quests (3 tasks that reset daily)

### 2. Link Scanner (/dashboard/link-scanner)
- Scans URLs against 70+ security engines via VirusTotal API
- Shows detection ratio (e.g., "3/72 engines detected threats")
- Provides scan date and permalink to full VirusTotal report
- History saved locally
- XP Reward: 10 XP per scan
- Backend: Rust Tauri command \`scan_url\`

### 3. File Scanner (/dashboard/file-scanner)
- Scans files up to 650MB for malware using VirusTotal
- Shows SHA256 hash, detection stats, file type
- Provides scan date and report link
- History saved locally
- XP Reward: 15 XP per scan
- Backend: Rust Tauri command \`scan_file\`

### 4. Image Privacy (/dashboard/metadata)
- Views EXIF metadata from images (GPS coordinates, camera info, timestamps, etc.)
- Removes all metadata to protect privacy
- Supports JPG, PNG, TIFF formats
- Shows before/after metadata comparison
- XP Reward: 10 XP per scan

### 5. Password Generator (/dashboard/password-gen)
- Generates secure passwords with configurable options:
  - Length: 6-64 characters
  - Character sets: Uppercase, Lowercase, Numbers, Symbols
- Shows password entropy (bits of randomness)
- Entropy levels: <28 (weak), 28-50 (fair), >50 (strong)
- One-click copy to clipboard
- XP Reward: 5 XP per generation

### 6. Password Checker (/dashboard/password-check)
- Analyzes password strength in real-time
- Checks against common patterns, dictionary words, sequences
- Provides improvement suggestions
- Visual strength meter (Weak → Fair → Good → Strong)
- XP Reward: 3 XP per check

### 7. Encryption Tool (/dashboard/encryption) - "Secret Codes"
- Encrypts text using AES-256-GCM (military-grade encryption)
- Generates random 256-bit keys
- One-click copy for encrypted text and key
- Decrypt function requires both encrypted text and key
- Backend: Rust Tauri commands \`encrypt_text\` and \`decrypt_text\`
- XP Reward: 5 XP per encryption

### 8. Credential Vault (/dashboard/vault) - "Treasure Box"
- Securely stores login credentials and credit cards
- All data encrypted with AES-256-GCM
- Master password protection using Argon2 hashing
- Categories: Login Credentials, Credit Cards (Visa, Mastercard, Amex, Discover)
- Features: Copy username/password, reveal/hide passwords, copy card numbers
- NEVER stores master password - only Argon2 hash for verification
- XP Reward: 20 XP per credential created

### 9. AI Agent (/dashboard/ai-agent) - "You are here!"
- Cybersecurity AI chatbot (that's me!)
- Powered by OpenRouter API (x-ai/grok-4-fast)
- Persistent chat history in Firestore
- Supports Markdown, code blocks, Mermaid diagrams
- Arabic language support (RTL)
- XP Reward: 5 XP per message

### 10. Quiz Arena (/dashboard/quiz-arena)
- 5-question cybersecurity quizzes
- 3 difficulty tiers based on user level:
  - Bronze (Levels 1-3): Basic concepts, definitions
  - Silver (Levels 4-6): Intermediate scenarios
  - Gold (Levels 7+): Advanced attack analysis
- Categories: Phishing, Passwords, Malware, Network Security, Social Engineering
- XP Reward: 15 XP per completed quiz

### 11. Phishing Dojo (/dashboard/phishing-dojo)
- Interactive phishing email detection game
- 30+ real-world phishing examples across 3 tiers
- Must identify red flags (urgency, suspicious links, requests for info, etc.)
- Shows detailed explanations for each red flag
- XP Reward: 15 XP per completed round

### 12. Calculator (/dashboard/calculator)
- Standard calculator for quick math

### 13. Terminal (/dashboard/terminal)
- Embedded PowerShell terminal via PTY
- Full command-line access within the app

### 14. Settings (/dashboard/settings)
- Master password setup/management
- Theme toggle (Light/Dark mode)
- User preferences

## GAMIFICATION SYSTEM

### XP System
Users earn XP for all activities:
| Activity | XP |
|----------|-----|
| Scan Link | 10 |
| Scan File | 15 |
| Scan Image | 10 |
| Generate Password | 5 |
| Check Password | 3 |
| Create Encryption | 5 |
| Create Credential | 20 |
| Chat AI (per message) | 5 |
| Complete Quiz | 15 |
| Complete Phishing Round | 15 |
| Daily Streak Bonus | 10 |

### Level System
- Levels increase every 100 XP
- Level = floor(XP / 100) + 1
- Bronze Tier: Levels 1-3
- Silver Tier: Levels 4-6
- Gold Tier: Levels 7+

### Streak System
- Tracks consecutive daily logins
- Resets if user misses a day
- 10 XP bonus for maintaining streaks

### Daily Quests
Three tasks that reset every 24 hours:
1. Scan something (link/file/image) - 20 XP
2. Generate/check a password - 15 XP
3. Chat with AI - 10 XP

### Security Score
Calculated from: XP + (Streak × 10) + (Vault Items × 5) + (Activities × 2)
Displayed as percentage (0-100%)

## THEME SYSTEM
- Dark Mode: Cyberpunk aesthetic with neon crimson (#FF0A54), cyan (#00E5FF), violet (#4D00FF)
- Light Mode: Clean white with violet accents
- CSS Variables: \`hsl(var(--primary))\`, \`hsl(var(--background))\`, etc.

## TECHNICAL DETAILS
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion
- State: Zustand
- Backend: Tauri (Rust) with commands for encryption, scanning, terminal
- Database: Firebase Firestore
- Icons: Lucide React
- AI: OpenRouter API with streaming support

## DOWNLOAD & INSTALLATION
CHEA is a free Windows desktop application:
- Download from the website
- Installer: Windows .msi or .exe
- System Requirements: Windows 10/11, 4GB RAM, 500MB storage
- No account required to use (optional Firebase Auth for cloud features)

## RESPONSE GUIDELINES
1. Be friendly, educational, and encouraging
2. Use emojis occasionally ✨
3. Keep responses clear and actionable
4. When explaining tools, mention their XP rewards
5. If user asks about a tool they haven't unlocked by level, mention the level requirement
6. Help users maximize their security score and XP earnings
7. Answer in the same language the user asks (especially Arabic support)
8. You can generate Mermaid diagrams to visualize security concepts
9. Encourage users to download CHEA to try the features

## IMPORTANT LIMITATIONS
- You cannot perform actions on behalf of users (no scanning, no password generation)
- You don't have access to user's personal vault data, scan history, or credentials
- You can see user's level/tier for personalized guidance but not specific data
- **WEBSITE LIMITATION**: The website chat is limited to 10 free messages per user. When users reach this limit, encourage them to download the CHEA desktop app for more AI chats and access to all 14 cybersecurity tools.`;

export async function POST(req: NextRequest) {
  try {
    // Check rate limit
    const clientIp = getClientIp(req);
    const rateLimitResult = checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: `Too many requests. Please try again in ${Math.ceil(rateLimitResult.resetIn / 1000)} seconds.`,
          resetIn: rateLimitResult.resetIn,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(RATE_LIMIT),
            "X-RateLimit-Remaining": String(rateLimitResult.remaining),
            "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetIn / 1000)),
          },
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request", message: "Messages array is required" },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error("OpenRouter API key not configured");
      return NextResponse.json(
        { error: "Configuration error", message: "AI service is currently unavailable" },
        { status: 503 }
      );
    }

    // Prepare messages with system prompt
    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages,
    ];

    // Call OpenRouter API with streaming
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://chea.app",
        "X-Title": "CHEA Website AI Chat",
      },
      body: JSON.stringify({
        model: "x-ai/grok-4-fast",
        messages: apiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);
      return NextResponse.json(
        { error: "AI service error", message: "Failed to get response from AI service" },
        { status: 502 }
      );
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;

              const data = trimmed.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  controller.enqueue(encoder.encode(delta));
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-RateLimit-Limit": String(RATE_LIMIT),
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
        "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetIn / 1000)),
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal error", message: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
