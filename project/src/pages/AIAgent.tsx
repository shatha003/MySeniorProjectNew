import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    Copy,
    Check,
    Plus,
    MessageSquare,
    Trash2,
    PanelLeftClose,
    PanelLeftOpen,
    Loader2,
    Star,
    Sparkles,
    Bot,
    Clock,
    Search,
    ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "@/components/theme-provider";
import { useTrackActivity } from "../hooks/useTrackActivity";
import {
    createChatSession,
    getChatSessions,
    getChatMessages,
    addChatMessage,
    deleteChatSession,
    type ChatSession,
} from "../services/chatService";
import Mermaid from "../components/Mermaid";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 280, damping: 22 },
    },
};

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

const WELCOME_MESSAGE: Message = {
    role: "assistant",
    content: "Hey there! 👋 I'm your AI cybersecurity buddy. Ask me anything about staying safe online! 🛡️",
};

const isArabic = (text: string) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
};

function CopyButton({ text, getText, getHtml, className, showText = false }: { text?: string; getText?: () => string; getHtml?: () => string; className?: string; showText?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            if (getHtml && navigator.clipboard && window.ClipboardItem) {
                const htmlText = getHtml();
                const plainText = getText ? getText() : text || "";
                const htmlBlob = new Blob([htmlText], { type: 'text/html' });
                const plainBlob = new Blob([plainText], { type: 'text/plain' });
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': htmlBlob,
                        'text/plain': plainBlob,
                    })
                ]);
            } else {
                const copyText = getText ? getText() : text || "";
                await navigator.clipboard.writeText(copyText);
            }
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            title="Copy"
            className={cn("flex items-center gap-1.5 text-xs font-bold transition-all", className)}
        >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {showText && <span>{copied ? "Copied!" : "Copy"}</span>}
        </button>
    );
}

export default function AIAgent() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const user = useAuthStore((s) => s.user);
    const userId = user?.uid;
    const trackActivity = useTrackActivity();

    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [sessionsLoading, setSessionsLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const loadSessions = useCallback(async () => {
        if (!userId) return;
        try {
            setSessionsLoading(true);
            const fetchedSessions = await getChatSessions(userId);
            setSessions(fetchedSessions);
            if (fetchedSessions.length > 0 && !activeSessionId) {
                const latestId = fetchedSessions[0].id!;
                setActiveSessionId(latestId);
                await loadMessages(latestId);
            }
        } catch (error) {
            console.error("Failed to load chat sessions:", error);
        } finally {
            setSessionsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const loadMessages = async (sessionId: string) => {
        if (!userId) return;
        try {
            setMessagesLoading(true);
            const fetchedMessages = await getChatMessages(userId, sessionId);
            if (fetchedMessages.length > 0) {
                setMessages(fetchedMessages.map((m) => ({ role: m.role, content: m.content })));
            } else {
                setMessages([WELCOME_MESSAGE]);
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
            setMessages([WELCOME_MESSAGE]);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleSelectSession = async (sessionId: string) => {
        if (sessionId === activeSessionId) return;
        setActiveSessionId(sessionId);
        await loadMessages(sessionId);
    };

    const handleNewChat = () => {
        setActiveSessionId(null);
        setMessages([WELCOME_MESSAGE]);
        setInput("");
    };

    const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (deletingId !== sessionId) {
            setDeletingId(sessionId);
            setTimeout(() => setDeletingId(null), 3000);
            return;
        }
        if (!userId) return;
        try {
            await deleteChatSession(userId, sessionId);
            setSessions((prev) => prev.filter((s) => s.id !== sessionId));
            if (activeSessionId === sessionId) {
                handleNewChat();
            }
            setDeletingId(null);
        } catch (error) {
            console.error("Failed to delete chat session:", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading || !userId) return;

        const userMessageContent = input.trim();
        const userMessage: Message = { role: "user", content: userMessageContent };
        const historyToSend = [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
        }));

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setIsStreaming(false);

        let currentSessionId = activeSessionId;

        try {
            if (!currentSessionId) {
                const title = userMessageContent.length > 40
                    ? userMessageContent.substring(0, 40) + "..."
                    : userMessageContent;
                currentSessionId = await createChatSession(userId, title);
                setActiveSessionId(currentSessionId);
                setSessions((prev) => [
                    { id: currentSessionId!, title, createdAt: Date.now(), updatedAt: Date.now() },
                    ...prev,
                ]);
            }

            await addChatMessage(userId, currentSessionId, "user", userMessageContent);

            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            if (!apiKey) throw new Error("OpenRouter API key not configured.");

            let fullResponse = "";
            let hasStartedStreaming = false;

            const systemMessage: Message = {
                role: "system",
                content: "You are CHEA's AI cybersecurity assistant. You help users learn about online safety, password security, phishing, encryption, and general cybersecurity topics. Be friendly, educational, and use emojis occasionally. Keep responses clear and actionable. You are talking to a user of a cybersecurity education app called CHEA.",
            };

            const apiMessages = [systemMessage, ...historyToSend];

            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://chea.app",
                    "X-Title": "CHEA Cybersecurity App",
                },
                body: JSON.stringify({
                    model: "nvidia/nemotron-nano-9b-v2:free",
                    messages: apiMessages,
                    stream: true,
                }),
            });

            if (!response.ok) {
                const errBody = await response.text();
                throw new Error(`OpenRouter API error (${response.status}): ${errBody}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("Failed to get response stream.");

            const decoder = new TextDecoder();

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
                            fullResponse += delta;
                            if (!hasStartedStreaming) {
                                hasStartedStreaming = true;
                                setIsStreaming(true);
                                setMessages((prev) => [...prev, { role: "assistant", content: delta }]);
                            } else {
                                setMessages((prev) => {
                                    const newMessages = [...prev];
                                    const lastIndex = newMessages.length - 1;
                                    const lastMsg = newMessages[lastIndex];
                                    if (lastMsg && lastMsg.role === "assistant") {
                                        newMessages[lastIndex] = { ...lastMsg, content: lastMsg.content + delta };
                                    }
                                    return newMessages;
                                });
                            }
                        }
                    } catch {
                        // skip malformed JSON lines
                    }
                }
            }

            if (fullResponse.trim()) {
                await addChatMessage(userId, currentSessionId, "assistant", fullResponse);
            }

            setSessions((prev) => {
                const idx = prev.findIndex((s) => s.id === currentSessionId);
                if (idx > 0) {
                    const session = prev[idx];
                    const updated = [...prev];
                    updated.splice(idx, 1);
                    updated.unshift({ ...session, updatedAt: Date.now() });
                    return updated;
                }
                return prev;
            });

            await trackActivity('chat_ai', { message: userMessageContent.substring(0, 50) });
        } catch (error) {
            console.error("AI Error:", error);
            setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === "assistant" && !lastMsg.content.trim()) {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { ...lastMsg, content: `Error: ${error}` };
                    return newMessages;
                }
                return [...prev, { role: "assistant", content: `Error: ${error}` }];
            });
        } finally {
            setIsLoading(false);
            setIsStreaming(false);
        }
    };

    const formatTime = (timestamp: number | Date | undefined) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const headingColor = isDark ? 'text-[#F4F6FF]' : 'text-gray-900';
    const mutedText = isDark ? 'text-[#8AB4F8]/60' : 'text-gray-500';
    const cardBg = isDark ? 'bg-cyber-dark' : 'bg-card';
    const borderColor = isDark ? 'border-neon-crimson/20' : 'border-neon-violet/20';

    const hasMessages = messages.length > 1 || (messages.length === 1 && messages[0] !== WELCOME_MESSAGE);

    return (
        <motion.div
            className="relative min-h-full pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
                    style={{ background: isDark ? 'radial-gradient(circle, rgba(255,10,84,0.06), transparent 70%)' : 'radial-gradient(circle, rgba(77,0,255,0.04), transparent 70%)' }} />
            </div>

            <div className="relative z-10 space-y-8 max-w-6xl mx-auto">
                {/* Friendly Hero Header */}
                <motion.div variants={itemVariants} className="relative">
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} p-8 md:p-10 shadow-xl overflow-hidden relative`}>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                                        <Bot size={24} />
                                    </div>
                                    <h1 className={`font-display text-3xl md:text-5xl font-black tracking-tight ${headingColor}`}>
                                        AI Assistant
                                    </h1>
                                </div>
                                <p className={`text-lg md:text-xl font-medium ${mutedText}`}>
                                    Ask me anything about cybersecurity! I'm here to help 🤖✨
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                                <Star size={20} fill="currentColor" className="animate-bounce" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black leading-none">+5 XP</span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Per Message</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Chat Interface */}
                <motion.div variants={itemVariants}>
                    <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} shadow-lg overflow-hidden relative`}>
                        {/* Chat Header */}
                        <div className={`p-4 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center gap-3 bg-primary/5`}>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-muted-foreground hover:text-primary"
                                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                            >
                                {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                            </button>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg">
                                <Sparkles size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className={`font-black flex items-center gap-2 ${headingColor}`}>
                                    CHEA Support Agent
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                                </h2>
                                <p className={`text-xs font-medium truncate ${mutedText}`} dir="auto">
                                    {activeSessionId
                                        ? sessions.find((s) => s.id === activeSessionId)?.title || "Cybersecurity & AI Expert"
                                        : "Cybersecurity & AI Expert"}
                                </p>
                            </div>
                        </div>

                        <div className="flex">
                            {/* Sidebar - Chat History */}
                            <AnimatePresence>
                                {sidebarOpen && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 288, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`flex flex-col border-r-2 ${isDark ? 'border-white/5' : 'border-gray-100'} bg-card/50 overflow-hidden shrink-0`}
                                    >
                                        {/* Sidebar Header */}
                                        <div className={`p-3 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between gap-2 shrink-0`}>
                                            <h3 className={`text-sm font-black ${headingColor}`}>Chats</h3>
                                            <motion.button
                                                onClick={handleNewChat}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-primary to-violet-600 text-white hover:scale-105 transition-all shadow-sm"
                                                title="New Chat"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Plus size={14} />
                                                <span>New</span>
                                            </motion.button>
                                        </div>

                                        {/* Session List */}
                                        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
                                            {sessionsLoading ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Loader2 size={20} className="animate-spin text-primary" />
                                                </div>
                                            ) : sessions.length === 0 ? (
                                                <div className="text-center py-8 px-4">
                                                    <MessageSquare size={28} className="mx-auto text-primary/20 mb-2" />
                                                    <p className={`text-xs font-bold ${mutedText}`}>No chats yet!</p>
                                                    <p className={`text-xs font-medium ${mutedText} opacity-60 mt-1`}>Start a new chat below</p>
                                                </div>
                                            ) : (
                                                sessions.map((session) => (
                                                    <motion.button
                                                        key={session.id}
                                                        onClick={() => handleSelectSession(session.id!)}
                                                        className={cn(
                                                            "w-full text-left px-3 py-2.5 rounded-xl transition-all group flex items-start gap-2.5 relative",
                                                            activeSessionId === session.id
                                                                ? "bg-primary/10 text-foreground border-2 border-primary/20"
                                                                : "hover:bg-muted/60 text-muted-foreground hover:text-foreground border-2 border-transparent"
                                                        )}
                                                        whileHover={{ x: 3 }}
                                                    >
                                                        <MessageSquare
                                                            size={14}
                                                            className={cn(
                                                                "shrink-0 mt-0.5 transition-colors",
                                                                activeSessionId === session.id ? "text-primary" : "text-muted-foreground/50"
                                                            )}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm truncate font-black" dir="auto">{session.title}</p>
                                                            <p className={`text-[11px] font-bold mt-0.5 ${mutedText}`}>
                                                                {formatTime(session.updatedAt as number)}
                                                            </p>
                                                        </div>
                                                        <motion.button
                                                            onClick={(e) => handleDeleteSession(session.id!, e)}
                                                            className={cn(
                                                                "shrink-0 p-1 rounded-lg transition-all mt-0.5",
                                                                deletingId === session.id
                                                                    ? "opacity-100 text-red-500 bg-red-500/10"
                                                                    : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                                            )}
                                                            title={deletingId === session.id ? "Click again to confirm" : "Delete chat"}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <Trash2 size={13} />
                                                        </motion.button>
                                                    </motion.button>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Main Chat Area */}
                            <div className="flex-1 flex flex-col min-w-0">
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[500px]">
                                    {messagesLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 size={24} className="animate-spin text-primary" />
                                                <p className={`text-sm font-bold ${mutedText}`}>Loading conversation...</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((msg, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className={cn(
                                                        "flex w-full items-start gap-3",
                                                        msg.role === "user" ? "justify-end" : "justify-start group/message"
                                                    )}
                                                >
                                                    {msg.role === "assistant" && (
                                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shrink-0 mt-1">
                                                            <Sparkles size={16} />
                                                        </div>
                                                    )}
                                                    <div
                                                        dir={isArabic(msg.content) ? "rtl" : "ltr"}
                                                        className={cn(
                                                            "px-4 py-3 rounded-2xl max-w-[85%] overflow-hidden",
                                                            msg.role === "user"
                                                                ? "bg-gradient-to-r from-primary to-violet-600 text-white rounded-br-sm"
                                                                : `${isDark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'} text-foreground rounded-bl-sm`,
                                                            isArabic(msg.content) && "text-right font-arabic"
                                                        )}
                                                    >
                                                        {msg.role === "user" ? (
                                                            <p className="text-sm font-medium whitespace-pre-wrap">{msg.content}</p>
                                                        ) : (
                                                            <div className="flex flex-col w-full">
                                                                <div className="text-sm prose prose-sm dark:prose-invert max-w-full prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0 prose-strong:font-bold">
                                                                    <ReactMarkdown
                                                                        remarkPlugins={[remarkGfm]}
                                                                        components={{
                                                                            code({ className, children, ...props }: any) {
                                                                                const match = /language-(\w+)/.exec(className || "");
                                                                                const isInline = !match;
                                                                                const codeString = String(children).replace(/\n$/, "");

                                                                                if (match && match[1] === "mermaid") {
                                                                                    return <Mermaid chart={codeString} isStreaming={isStreaming && idx === messages.length - 1} />;
                                                                                }

                                                                                return !isInline ? (
                                                                                    <div className="relative group/code">
                                                                                        <div className="absolute right-2 top-2 z-10 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                                                            <CopyButton text={codeString} className="bg-background/80 hover:bg-background p-1.5 rounded-md border border-border backdrop-blur-sm shadow-sm" />
                                                                                        </div>
                                                                                        <SyntaxHighlighter
                                                                                            style={vscDarkPlus as any}
                                                                                            language={match[1]}
                                                                                            PreTag="div"
                                                                                            className="rounded-md !my-2 text-xs !bg-background/50 border border-border"
                                                                                            showLineNumbers
                                                                                            {...props}
                                                                                        >
                                                                                            {codeString}
                                                                                        </SyntaxHighlighter>
                                                                                    </div>
                                                                                ) : (
                                                                                    <code className={cn("bg-foreground/10 font-mono rounded px-1.5 py-0.5 text-[0.8rem]", className)} {...props}>
                                                                                        {children}
                                                                                    </code>
                                                                                );
                                                                            },
                                                                            table({ children, ...props }: any) {
                                                                                const tableRef = useRef<HTMLTableElement>(null);

                                                                                const getTableText = () => {
                                                                                    if (!tableRef.current) return "";
                                                                                    return Array.from(tableRef.current.rows).map(row =>
                                                                                        Array.from(row.cells).map(cell => cell.innerText.trim()).join('\t')
                                                                                    ).join('\n');
                                                                                };

                                                                                const getTableHtml = () => {
                                                                                    if (!tableRef.current) return "";
                                                                                    const style = `<style>table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ccc; padding: 8px; text-align: left; } th { background-color: #f4f4f5; font-weight: bold; }</style>`;
                                                                                    return `${style}<table>${tableRef.current.innerHTML}</table>`;
                                                                                };

                                                                                return (
                                                                                    <div className="relative group/table my-4 bg-background/50 rounded-xl border border-border overflow-hidden">
                                                                                        <div className="absolute top-2 right-2 opacity-0 group-hover/table:opacity-100 transition-opacity z-10 p-1 bg-background/80 backdrop-blur-sm rounded-lg border border-border shadow-sm">
                                                                                            <CopyButton
                                                                                                getText={getTableText}
                                                                                                getHtml={getTableHtml}
                                                                                                showText={true}
                                                                                                className="px-2 py-1.5 hover:bg-muted rounded text-xs"
                                                                                            />
                                                                                        </div>
                                                                                        <div className="overflow-x-auto p-4 max-w-full">
                                                                                            <table ref={tableRef} className="w-full text-sm text-left m-0" {...props}>
                                                                                                {children}
                                                                                            </table>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        }}
                                                                    >
                                                                        {msg.content}
                                                                    </ReactMarkdown>
                                                                </div>
                                                                {msg.content.trim().length > 0 && (
                                                                    <div className={cn(
                                                                        "mt-2 flex items-center opacity-0 group-hover/message:opacity-100 transition-opacity",
                                                                        isArabic(msg.content) ? "justify-end" : "justify-start"
                                                                    )}>
                                                                        <CopyButton text={msg.content} showText={true} className="px-2 py-1 rounded-lg hover:bg-foreground/10" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {msg.role === "user" && (
                                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0 mt-1">
                                                            <span className="text-xs font-black">U</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                            {isLoading && !isStreaming && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex items-start gap-3 justify-start max-w-[80%]"
                                                >
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shrink-0">
                                                        <Sparkles size={16} />
                                                    </div>
                                                    <div className="px-5 py-3.5 bg-muted rounded-2xl rounded-bl-sm flex items-center gap-1.5 h-10">
                                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                                                    </div>
                                                </motion.div>
                                            )}
                                            {isStreaming && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center gap-1.5 pl-11 text-xs font-bold text-muted-foreground"
                                                >
                                                    <Loader2 size={12} className="animate-spin" />
                                                    <span>Thinking...</span>
                                                </motion.div>
                                            )}
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {/* Input */}
                                <div className={`p-4 border-t-2 ${isDark ? 'border-white/5' : 'border-gray-100'} bg-muted/30 shrink-0`}>
                                    <form
                                        className="relative flex items-center"
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSend();
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Ask me anything about cybersecurity... 🤔"
                                            dir="auto"
                                            className={`w-full bg-background border-2 ${isDark ? 'border-white/10 focus:border-primary/50' : 'border-gray-200 focus:border-primary/50'} rounded-2xl pl-5 pr-14 py-4 text-sm font-medium focus:outline-none transition-all ${headingColor} placeholder:font-medium placeholder:opacity-50`}
                                            disabled={isLoading}
                                        />
                                        <motion.button
                                            type="submit"
                                            disabled={!input.trim() || isLoading}
                                            className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Send size={18} />
                                        </motion.button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Chats (History) */}
                {!hasMessages && (
                    <motion.div variants={itemVariants}>
                        <div className={`rounded-3xl border-2 ${borderColor} ${cardBg} overflow-hidden shadow-lg`}>
                            <div className={`p-8 border-b-2 ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
                                <div className="flex items-center gap-3">
                                    <Clock className="text-primary" />
                                    <h2 className={`font-display text-2xl font-black ${headingColor}`}>Recent Conversations</h2>
                                </div>
                                <span className={`text-sm font-bold ${mutedText}`}>{sessions.length} Chats Saved</span>
                            </div>

                            <div className="p-6">
                                {sessions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sessions.slice(0, 6).map((session) => (
                                            <motion.div
                                                key={session.id}
                                                className={`group flex items-center justify-between p-5 rounded-2xl border-2 ${isDark ? 'bg-cyber-surface/30 border-white/5 hover:border-primary/30' : 'bg-gray-50 border-gray-100 hover:border-primary/30'} transition-all cursor-pointer`}
                                                onClick={() => handleSelectSession(session.id!)}
                                                whileHover={{ x: 5, scale: 1.02 }}
                                            >
                                                <div className="flex items-center gap-4 overflow-hidden">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shrink-0">
                                                        <MessageSquare size={22} />
                                                    </div>
                                                    <div className="truncate">
                                                        <p className={`font-black text-base truncate ${headingColor}`}>{session.title}</p>
                                                        <p className={`text-xs font-bold ${mutedText}`}>{formatTime(session.updatedAt as number)}</p>
                                                    </div>
                                                </div>
                                                <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-white'} flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors ml-4`}>
                                                    <ChevronRight size={20} />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`py-16 text-center border-4 border-dashed ${isDark ? 'border-white/5' : 'border-gray-100'} rounded-3xl`}>
                                        <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Search className={`text-primary/20`} size={40} />
                                        </div>
                                        <h3 className={`text-xl font-black ${headingColor}`}>No chats yet!</h3>
                                        <p className={`text-lg ${mutedText} mt-2`}>Start your first conversation above.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
