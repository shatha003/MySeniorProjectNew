import { useState, useRef, useEffect, useCallback } from "react";
import { invoke, Channel } from "@tauri-apps/api/core";
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
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import {
    createChatSession,
    getChatSessions,
    getChatMessages,
    addChatMessage,
    deleteChatSession,
    type ChatSession,
} from "../services/chatService";
import Mermaid from "../components/Mermaid";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

const WELCOME_MESSAGE: Message = {
    role: "assistant",
    content: "Hello! I am your AI cybersecurity and AI assistant. How can I help you today?",
};

const isArabic = (text: string) => {
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
};

function CopyButton({ text, getText, getHtml, className, showText = false }: { text?: string; getText?: () => string; getHtml?: () => string; className?: string; showText?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            // First attempt to write HTML+Plain text if getHtml provides it
            // This preserves formatting perfectly when pasting to Word/Excel
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
                // Fallback to simple text copying
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
            className={cn("flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all", className)}
        >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {showText && <span>{copied ? "Copied" : "Copy"}</span>}
        </button>
    );
}

export default function AIAgent() {
    const user = useAuthStore((s) => s.user);
    const userId = user?.uid;

    // Chat sessions state
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [sessionsLoading, setSessionsLoading] = useState(true);

    // Messages state
    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Delete confirmation
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Load sessions on mount
    const loadSessions = useCallback(async () => {
        if (!userId) return;
        try {
            setSessionsLoading(true);
            const fetchedSessions = await getChatSessions(userId);
            setSessions(fetchedSessions);

            // Auto-load most recent session if one exists
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
    }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    // Load messages for a given session
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

    // Switch to a session
    const handleSelectSession = async (sessionId: string) => {
        if (sessionId === activeSessionId) return;
        setActiveSessionId(sessionId);
        await loadMessages(sessionId);
    };

    // Start a new chat
    const handleNewChat = () => {
        setActiveSessionId(null);
        setMessages([WELCOME_MESSAGE]);
        setInput("");
    };

    // Delete a session
    const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (deletingId !== sessionId) {
            setDeletingId(sessionId);
            setTimeout(() => setDeletingId(null), 3000); // Reset after 3s
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

    // Send a message
    const handleSend = async () => {
        if (!input.trim() || isLoading || !userId) return;

        const userMessageContent = input.trim();
        const userMessage: Message = { role: "user", content: userMessageContent };
        const historyToSend = [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
        }));

        // Only add the user message — do NOT add an empty assistant placeholder
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setIsStreaming(false);

        let currentSessionId = activeSessionId;

        try {
            // Create a new session if this is the first message
            if (!currentSessionId) {
                const title = userMessageContent.length > 40
                    ? userMessageContent.substring(0, 40) + "..."
                    : userMessageContent;
                currentSessionId = await createChatSession(userId, title);
                setActiveSessionId(currentSessionId);
                // Add session to the list at the top
                setSessions((prev) => [
                    { id: currentSessionId!, title, createdAt: Date.now(), updatedAt: Date.now() },
                    ...prev,
                ]);
            }

            // Save user message to Firestore
            await addChatMessage(userId, currentSessionId, "user", userMessageContent);

            // Stream AI response
            let fullResponse = "";
            let hasStartedStreaming = false;
            const channel = new Channel<string>();
            channel.onmessage = (chunk: string) => {
                fullResponse += chunk;

                if (!hasStartedStreaming) {
                    hasStartedStreaming = true;
                    setIsStreaming(true);
                    // Add the assistant message on first chunk
                    setMessages((prev) => [...prev, { role: "assistant", content: chunk }]);
                } else {
                    // Append subsequent chunks to the existing assistant message
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastIndex = newMessages.length - 1;
                        const lastMsg = newMessages[lastIndex];
                        if (lastMsg && lastMsg.role === "assistant") {
                            newMessages[lastIndex] = { ...lastMsg, content: lastMsg.content + chunk };
                        }
                        return newMessages;
                    });
                }
            };

            await invoke("chat_with_ai", { messages: historyToSend, onChunk: channel });

            // Save assistant response to Firestore
            if (fullResponse.trim()) {
                await addChatMessage(userId, currentSessionId, "assistant", fullResponse);
            }

            // Move session to top of the list (most recently updated)
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
        } catch (error) {
            console.error("AI Error:", error);
            setMessages((prev) => {
                // If streaming had started, the last message is the assistant's
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === "assistant" && !lastMsg.content.trim()) {
                    // Replace empty assistant message with error
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { ...lastMsg, content: `Error: ${error}` };
                    return newMessages;
                }
                // Otherwise append a new error message
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

    return (
        <div className="flex h-[calc(100vh-8rem)] max-w-6xl mx-auto border border-border bg-card rounded-xl overflow-hidden shadow-sm">
            {/* Sidebar - Chat History */}
            <div
                className={cn(
                    "flex flex-col border-r border-border bg-card/50 transition-all duration-300 ease-in-out overflow-hidden",
                    sidebarOpen ? "w-72 min-w-[288px]" : "w-0 min-w-0"
                )}
            >
                {/* Sidebar Header */}
                <div className="p-3 border-b border-border flex items-center justify-between gap-2 shrink-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">Chat History</h3>
                    <button
                        onClick={handleNewChat}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                        title="New Chat"
                    >
                        <Plus size={14} />
                        <span>New</span>
                    </button>
                </div>

                {/* Session List */}
                <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
                    {sessionsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 size={20} className="animate-spin text-muted-foreground" />
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-8 px-4">
                            <MessageSquare size={28} className="mx-auto text-muted-foreground/40 mb-2" />
                            <p className="text-xs text-muted-foreground">No conversations yet</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Start a new chat to begin</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => handleSelectSession(session.id!)}
                                className={cn(
                                    "w-full text-left px-3 py-2.5 rounded-lg transition-all group flex items-start gap-2.5 relative",
                                    activeSessionId === session.id
                                        ? "bg-primary/10 text-foreground border border-primary/20"
                                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent"
                                )}
                            >
                                <MessageSquare
                                    size={14}
                                    className={cn(
                                        "shrink-0 mt-0.5 transition-colors",
                                        activeSessionId === session.id ? "text-primary" : "text-muted-foreground/50"
                                    )}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate font-medium" dir="auto">{session.title}</p>
                                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                                        {formatTime(session.updatedAt as number)}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteSession(session.id!, e)}
                                    className={cn(
                                        "shrink-0 p-1 rounded transition-all mt-0.5",
                                        deletingId === session.id
                                            ? "opacity-100 text-destructive bg-destructive/10"
                                            : "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    )}
                                    title={deletingId === session.id ? "Click again to confirm" : "Delete chat"}
                                >
                                    <Trash2 size={13} />
                                </button>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-card/80 backdrop-blur-sm flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </button>
                    <img
                        src="/Support agent..webp"
                        alt="AI Agent"
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                    />
                    <div className="min-w-0 flex-1">
                        <h2 className="font-semibold flex items-center gap-2">
                            CHEA Support Agent
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        </h2>
                        <p className="text-xs text-muted-foreground truncate" dir="auto">
                            {activeSessionId
                                ? sessions.find((s) => s.id === activeSessionId)?.title || "Cybersecurity & AI Expert"
                                : "Cybersecurity & AI Expert"}
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 size={24} className="animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Loading conversation...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex w-full items-start gap-3",
                                        msg.role === "user" ? "justify-end" : "justify-start group/message"
                                    )}
                                >
                                    {msg.role === "assistant" && (
                                        <img
                                            src="/Support agent..webp"
                                            alt="AI"
                                            className="w-8 h-8 rounded-full border border-border mt-1"
                                        />
                                    )}
                                    <div
                                        dir={isArabic(msg.content) ? "rtl" : "ltr"}
                                        className={cn(
                                            "px-4 py-3 rounded-2xl max-w-[85%] overflow-hidden",
                                            msg.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                                : "bg-muted text-foreground rounded-bl-sm",
                                            isArabic(msg.content) && "text-right font-arabic"
                                        )}
                                    >
                                        {msg.role === "user" ? (
                                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        ) : (
                                            <div className="flex flex-col w-full">
                                                <div className="text-sm prose prose-sm dark:prose-invert max-w-full prose-pre:my-0 prose-pre:p-0 prose-pre:bg-transparent prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code({ className, children, ...props }: any) {
                                                                const match = /language-(\w+)/.exec(className || "");
                                                                const isInline = !match;
                                                                const codeString = String(children).replace(/\n$/, "");

                                                                if (match && match[1] === "mermaid") {
                                                                    // We pass isStreaming so Mermaid knows whether it should delay rendering
                                                                    // to prevent flickering errors and lag while the AI types
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
                                                                    // We wrap the table in a container to enforce basic borders in word/excel
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
                                                        <CopyButton text={msg.content} showText={true} className="px-2 py-1 rounded-md hover:bg-foreground/10" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && !isStreaming && (
                                <div className="flex items-start gap-3 justify-start max-w-[80%]">
                                    <img
                                        src="/Support agent..webp"
                                        alt="AI"
                                        className="w-8 h-8 rounded-full border border-border"
                                    />
                                    <div className="px-5 py-3.5 bg-muted rounded-2xl rounded-bl-sm flex items-center gap-1.5 h-10">
                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            {isStreaming && (
                                <div className="flex items-center gap-1.5 pl-11 text-xs text-muted-foreground">
                                    <Loader2 size={12} className="animate-spin" />
                                    <span>Generating...</span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-muted/30 border-t border-border shrink-0">
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
                            placeholder="Ask about cybersecurity or AI..."
                            dir="auto"
                            className="w-full bg-background border border-border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
