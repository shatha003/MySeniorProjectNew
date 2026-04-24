import { callNova } from './aiService';
import type { PhishingEmail, DifficultyTier } from './phishingService';

export async function generatePhishingEmail(
  tier: DifficultyTier,
  previousTopics: string[] = []
): Promise<PhishingEmail> {
  const tierDescriptions: Record<DifficultyTier, string> = {
    cadet: 'Beginner level - obvious phishing with clear red flags like urgent language, misspelled domains, requests for passwords, too-good-to-be-true offers',
    analyst: 'Intermediate level - more subtle phishing with realistic-looking sender addresses, professional formatting, but still contains identifiable red flags',
    operator: 'Advanced level - highly sophisticated phishing that closely mimics real corporate communications, with only subtle tells like slight domain variations or unusual requests',
  };

  const shouldPhish = Math.random() > 0.3;

  const prompt = `Generate a ${shouldPhish ? 'PHISHING' : 'LEGITIMATE SAFE'} email for a cybersecurity training exercise.

Difficulty tier: ${tier} - ${tierDescriptions[tier]}
${previousTopics.length > 0 ? `Avoid these topics already used: ${previousTopics.join(', ')}` : ''}

The email should be ${shouldPhish ? 'a phishing scam designed to trick people' : 'a completely normal, safe email'}.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "sender": "Sender Name",
  "senderEmail": "sender@domain.com",
  "subject": "Email subject line",
  "body": "Full email body text with realistic content, proper formatting, line breaks using \\n",
  "isPhishing": ${shouldPhish},
  "redFlags": ${shouldPhish ? `[{"label": "Flag Name", "description": "Why this is suspicious"}, ...]` : '[]'},
  "explanation": "Brief explanation of why this email is ${shouldPhish ? 'dangerous and what the red flags are' : 'safe and legitimate'}"
}

Requirements:
- Make it realistic and educational
- ${shouldPhish ? 'Include 2-4 specific red flags that are identifiable' : 'Show what a normal, safe email looks like for comparison'}
- Use realistic sender names and email addresses
- ${shouldPhish ? 'The phishing should match the difficulty tier sophistication level' : 'Make it clearly safe - no suspicious elements'}
- Body should be 3-5 sentences long`;

  const response = await callNova(
    [{ role: 'user', content: prompt }],
    {
      systemPrompt: 'You are a cybersecurity training content generator. Generate realistic phishing emails for educational purposes only. Always return valid JSON only, no markdown formatting.',
      temperature: 0.9,
      maxTokens: 1000,
    }
  );

  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender: parsed.sender || 'Unknown Sender',
      senderEmail: parsed.senderEmail || 'unknown@email.com',
      subject: parsed.subject || 'No Subject',
      body: parsed.body || '',
      isPhishing: parsed.isPhishing ?? shouldPhish,
      redFlags: (parsed.redFlags || []).map((f: { label?: string; description?: string }) => ({
        label: f.label || 'Red Flag',
        description: f.description || '',
      })),
      explanation: parsed.explanation || '',
      difficulty: tier,
    };
  } catch (err) {
    console.error('Failed to parse AI phishing email:', err);
    return {
      id: `ai-fallback-${Date.now()}`,
      sender: 'Security Team',
      senderEmail: 'security@company.com',
      subject: 'Action Required: Verify Your Account',
      body: 'Dear User,\n\nWe have detected unusual activity on your account. Please verify your identity immediately by clicking the link below.\n\nhttp://secure-verify-account.com/login\n\nIf you do not verify within 24 hours, your account will be suspended.\n\nSecurity Team',
      isPhishing: true,
      redFlags: [
        { label: 'Urgency', description: 'The email creates urgency by threatening account suspension within 24 hours.' },
        { label: 'Suspicious Link', description: 'The URL "secure-verify-account.com" is not the official company domain.' },
      ],
      explanation: 'This email uses urgency and a suspicious link to trick users into visiting a fake website.',
      difficulty: tier,
    };
  }
}