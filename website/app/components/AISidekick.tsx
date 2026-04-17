"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  X, 
  MessageCircle, 
  Loader2, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check,
  Download
} from "lucide-react";
import { useTheme } from "./theme-provider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

// Copy button component for messages
function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-1 text-xs transition-all hover:scale-105 ${className}`}
      title="Copy message"
    >
      {copied ? (
        <Check size={14} className="text-emerald-500" />
      ) : (
        <Copy size={14} />
      )}
      {copied && <span className="text-emerald-500 font-medium">Copied!</span>}
    </button>
  );
}

// Format timestamp
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return date.toLocaleDateString();
}

export default function AISidekick() {
  const { theme, mounted } = useTheme();
  const isDark = theme === "dark";

  // Message limit tracking (10 messages lifetime per user) - MUST be before any functions that use them
  const MAX_FREE_MESSAGES = 10;
  const [userMessageCount, setUserMessageCount] = useState(0);
  const hasReachedLimit = userMessageCount >= MAX_FREE_MESSAGES;
  const [hasMounted, setHasMounted] = useState(false);
  
  // Load message count from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("chea-ai-message-count");
    if (stored) {
      setUserMessageCount(parseInt(stored, 10));
    }
    setHasMounted(true);
  }, []);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm Nova, your AI cybersecurity buddy. CHEA stands for Cyber Hygiene Educator and Assistant. Ask me about CHEA's features, security tips, or how to stay safe online! 🛡️✨",
      timestamp: Date.now(),
    },
  ]);
  
  // Update welcome message when count changes or on mount
  useEffect(() => {
    if (!hasMounted) return;
    
    const welcomeMessage = hasReachedLimit
      ? "🎉 You've used all 10 free messages! Download CHEA for more AI chats and access to all 14 cybersecurity tools. Your security journey continues there! 🚀"
      : `Hey there! 👋 I'm Nova, your AI cybersecurity buddy. CHEA stands for Cyber Hygiene Educator and Assistant. You have ${MAX_FREE_MESSAGES - userMessageCount} free messages remaining. Ask me about CHEA's features, security tips, or how to stay safe online! 🛡️✨`;
    
    setMessages(prev => {
      // Only update if the first message is from assistant (welcome message)
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [{
          ...prev[0],
          content: welcomeMessage,
        }];
      }
      return prev;
    });
  }, [userMessageCount, hasReachedLimit, hasMounted]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Save message count to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("chea-ai-message-count", userMessageCount.toString());
  }, [userMessageCount]);
  
  // Refs for scrolling
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Smart scroll to bottom - only scrolls the container, not the page
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container && shouldAutoScroll) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [shouldAutoScroll]);

  // Scroll when messages change or streaming updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isStreaming, scrollToBottom]);

  // Handle scroll events to detect if user scrolled up
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShouldAutoScroll(isAtBottom);
    }
  };

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isChatOpen]);

  // Clear chat function
  const handleClearChat = () => {
    const welcomeMessage = hasReachedLimit
      ? "🎉 You've used all 10 free messages! Download CHEA for more AI chats and access to all 14 cybersecurity tools. Your security journey continues there! 🚀"
      : `Hey there! 👋 I'm Nova, your AI cybersecurity buddy. CHEA stands for Cyber Hygiene Educator and Assistant. You have ${MAX_FREE_MESSAGES - userMessageCount} free messages remaining. Ask me about CHEA's features, security tips, or how to stay safe online! 🛡️✨`;
    
    setMessages([{
      role: "assistant",
      content: welcomeMessage,
      timestamp: Date.now(),
    }]);
    setError(null);
    setShouldAutoScroll(true);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || hasReachedLimit) return;

    const userMessage: Message = { 
      role: "user", 
      content: input.trim(),
      timestamp: Date.now(),
    };
    
    // Increment message count (user prompt only)
    const newCount = userMessageCount + 1;
    setUserMessageCount(newCount);
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setIsStreaming(false);
    setError(null);
    setShouldAutoScroll(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error(errorData.message || "Rate limit exceeded. Please wait a moment before sending another message.");
        }
        throw new Error(errorData.message || "Failed to get response from AI");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to read response");
      }

      const decoder = new TextDecoder();
      let fullResponse = "";
      let hasStartedStreaming = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        if (!hasStartedStreaming) {
          hasStartedStreaming = true;
          setIsStreaming(true);
          setIsLoading(false);
          setMessages((prev) => [...prev, { 
            role: "assistant", 
            content: chunk,
            timestamp: Date.now(),
          }]);
        } else {
          setMessages((prev) => {
            const updated = [...prev];
            const lastMsg = updated[updated.length - 1];
            if (lastMsg && lastMsg.role === "assistant") {
              updated[updated.length - 1] = { 
                ...lastMsg, 
                content: fullResponse,
                timestamp: Date.now(),
              };
            }
            return updated;
          });
        }
      }

      setIsStreaming(false);
      
      // Check if user has reached the limit after this message
      const updatedCount = userMessageCount + 1;
      if (updatedCount >= MAX_FREE_MESSAGES) {
        // Add limit reached message after a short delay
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "🎉 You've used all 10 free messages! Download CHEA for more AI chats and access to all 14 cybersecurity tools. Your security journey continues there! 🚀",
              timestamp: Date.now(),
            },
          ]);
        }, 500);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: `Sorry, I encountered an error: ${err.message || "Unknown error"}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Static version for SSR
  if (!mounted) {
    return (
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-hud rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-neon-crimson/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-crimson/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
              {/* AI Character */}
              <div className="flex flex-col items-center md:items-start">
                {/* Avatar Circle with Glow */}
                <div className="relative mb-6">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-crimson/30 to-neon-violet/30 blur-2xl scale-150" />
                  
                  {/* Avatar Container */}
                  <div className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-surface-container-high ring-4 ring-neon-crimson/20 flex items-center justify-center overflow-hidden">
                    <img
                      src="/new_pic/aibox.png"
                      alt="AI Support Agent"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-surface">
                    <div className="w-3 h-3 bg-neon-crimson rounded-full animate-pulse" />
                  </div>
                </div>

                {/* AI Name */}
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">
                    Nova
                  </h3>
                  <p className="text-sm text-on-surface-variant font-body">
                    Cybernetic Helper & Educational AI
                  </p>
                </div>
              </div>

              {/* Speech Bubble Content */}
              <div className="relative">
                {/* Comic Speech Bubble */}
                <div className="comic-bubble relative">
                  <p className="text-base sm:text-lg leading-relaxed font-comic">
                    &ldquo;Hey there! I&apos;m your AI sidekick. I&apos;m here 24/7 to help you analyze suspicious links, 
                    answer security questions, and give you tactical advice for staying safe online. 
                    You get 10 free messages here - then download CHEA for more!&rdquo;
                  </p>
                </div>

                {/* Features List */}
                <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: "chat", text: "Instant Answers" },
                    { icon: "link", text: "Link Analysis" },
                    { icon: "school", text: "Security Tips" },
                    { icon: "support_agent", text: "24/7 Support" },
                  ].map((feature) => (
                    <div
                      key={feature.text}
                      className="flex items-center gap-2 sm:gap-3 text-sm text-on-surface-variant font-body"
                    >
                      <span className="material-symbols-outlined text-neon-crimson" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {feature.icon}
                      </span>
                      {feature.text}
                    </div>
                  ))}
                </div>

                {/* Chat Button */}
                <button className="mt-6 sm:mt-8 w-full py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-neon-crimson to-neon-violet text-white font-headline font-bold text-base sm:text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  Chat with Me!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-hud rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-12 relative overflow-hidden"
        >
          {/* Background Decorations */}
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none ${isDark ? "bg-neon-crimson/5" : "bg-neon-violet/5"}`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none ${isDark ? "bg-neon-crimson/5" : "bg-neon-violet/5"}`} />

          <AnimatePresence mode="wait">
            {!isChatOpen ? (
              // Intro View
              <motion.div
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10"
              >
                {/* AI Character */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col items-center md:items-start"
                >
                  {/* Avatar Circle with Glow */}
                  <motion.div
                    className="relative mb-6"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 rounded-full blur-2xl scale-150 ${isDark ? "bg-gradient-to-br from-neon-crimson/30 to-neon-crimson/20" : "bg-gradient-to-br from-neon-violet/30 to-neon-violet/20"}`} />
                    
                    {/* Avatar Container */}
                    <div className={`relative w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-surface-container-high ring-4 flex items-center justify-center overflow-hidden ${isDark ? "ring-neon-crimson/20" : "ring-neon-violet/20"}`}>
                      <img
                        src="/new_pic/aibox.png"
                        alt="AI Support Agent"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-surface">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${isDark ? "bg-neon-crimson" : "bg-neon-violet"}`} />
                    </div>
                  </motion.div>

                  {/* AI Name */}
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-headline font-bold text-on-surface mb-1">
                      Nova
                    </h3>
                    <p className="text-sm text-on-surface-variant font-body">
                      Cybernetic Helper & Educational AI
                    </p>
                  </div>
                </motion.div>

                {/* Speech Bubble Content */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative"
                >
                  {/* Comic Speech Bubble */}
                  <div className="comic-bubble relative">
                    <p className="text-base sm:text-lg leading-relaxed font-comic">
                      &ldquo;Hey there! I&apos;m your AI sidekick. I&apos;m here 24/7 to help you learn about CHEA, 
                      answer security questions, and give you tactical advice for staying safe online. 
                      Think of me as your personal cybersecurity coach!&rdquo;
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { icon: "chat", text: "Instant Answers" },
                      { icon: "link", text: "Link Analysis" },
                      { icon: "school", text: "Security Tips" },
                      { icon: "support_agent", text: "24/7 Support" },
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.text}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-2 sm:gap-3 text-sm text-on-surface-variant font-body"
                      >
                        <span className={`material-symbols-outlined ${isDark ? "text-neon-crimson" : "text-neon-violet"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {feature.icon}
                        </span>
                        {feature.text}
                      </motion.div>
                    ))}
                  </div>

                  {/* Chat Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 1 }}
                    onClick={() => setIsChatOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`mt-6 sm:mt-8 w-full py-3 sm:py-4 rounded-2xl text-white font-headline font-bold text-base sm:text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-gradient-to-r from-neon-crimson to-neon-violet hover:shadow-[0_0_30px_rgba(255,10,84,0.4)]"
                        : "bg-gradient-to-r from-neon-violet to-secondary hover:shadow-[0_0_30px_rgba(77,0,255,0.4)]"
                    }`}
                  >
                    <MessageCircle size={20} />
                    Chat with Me!
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              // Chat View
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 flex flex-col"
              >
                {/* Chat Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <div className={`absolute inset-0 rounded-full blur-xl scale-150 ${isDark ? "bg-neon-crimson/30" : "bg-neon-violet/30"}`} />
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface-container-high ring-2 flex items-center justify-center overflow-hidden">
                        <img
                          src="/new_pic/aibox.png"
                          alt="Nova AI"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-surface">
                        <div className={`w-2 h-2 rounded-full ${isDark ? "bg-neon-crimson" : "bg-neon-violet"}`} />
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                        Nova
                        <Sparkles size={14} className={`${isDark ? "text-neon-crimson" : "text-neon-violet"} sm:size-4`} />
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant font-body">Ask me about CHEA or cybersecurity!</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Clear Chat Button */}
                    <motion.button
                      onClick={handleClearChat}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-full transition-colors ${
                        isDark 
                          ? "hover:bg-surface-container-high text-on-surface-variant hover:text-red-400" 
                          : "hover:bg-gray-100 text-gray-500 hover:text-red-500"
                      }`}
                      title="Clear chat"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                    
                    {/* Close Button */}
                    <motion.button
                      onClick={() => setIsChatOpen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-full transition-colors ${
                        isDark 
                          ? "hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface" 
                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </div>

                {/* Messages Area - Fixed scrolling container */}
                <div 
                  ref={messagesContainerRef}
                  onScroll={handleScroll}
                  className={`rounded-2xl border-2 mb-4 overflow-y-auto flex-1 min-h-[300px] max-h-[50vh] sm:max-h-[400px] lg:max-h-[450px] ${
                    isDark 
                      ? "bg-surface/50 border-white/5" 
                      : "bg-white/50 border-gray-100"
                  }`}
                >
                  <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
                    {messages.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex w-full items-start gap-2 sm:gap-3 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {/* Avatar */}
                        {msg.role === "assistant" && (
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-high ring-2 flex-shrink-0 flex items-center justify-center overflow-hidden ${isDark ? "ring-neon-crimson/20" : "ring-neon-violet/20"}`}>
                            <img
                              src="/new_pic/aibox.png"
                              alt="Nova"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Message Bubble */}
                        <div className="flex flex-col max-w-[80%] sm:max-w-[75%]">
                          <div
                            className={`px-4 py-3 sm:px-5 sm:py-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              msg.role === "user"
                                ? `text-white rounded-br-sm ${isDark ? "bg-gradient-to-r from-neon-crimson to-neon-violet" : "bg-gradient-to-r from-neon-violet to-secondary"}`
                                : `${isDark ? "bg-white/5 border border-white/10 text-on-surface" : "bg-gray-100 border border-gray-200 text-gray-800"} rounded-bl-sm`
                            }`}
                          >
                            {msg.role === "user" ? (
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                              <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:my-2 prose-pre:p-0 prose-pre:bg-transparent prose-p:my-1.5 prose-headings:my-2 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    code({ className, children, ...props }: any) {
                                      const match = /language-(\w+)/.exec(className || "");
                                      const isInline = !match;
                                      const codeString = String(children).replace(/\n$/, "");

                                      return !isInline ? (
                                        <div className="relative group my-2">
                                          <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <CopyButton 
                                              text={codeString} 
                                              className={`p-1.5 rounded-md backdrop-blur-sm shadow-sm ${isDark ? "bg-surface/80 text-on-surface" : "bg-white/80 text-gray-700"}`}
                                            />
                                          </div>
                                          <SyntaxHighlighter
                                            style={vscDarkPlus as any}
                                            language={match?.[1] || "text"}
                                            PreTag="div"
                                            className="rounded-lg text-xs sm:text-sm !bg-black/80 !my-0"
                                            showLineNumbers
                                            {...props}
                                          >
                                            {codeString}
                                          </SyntaxHighlighter>
                                        </div>
                                      ) : (
                                        <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${isDark ? "bg-white/10 text-white" : "bg-gray-200 text-gray-800"}`} {...props}>
                                          {children}
                                        </code>
                                      );
                                    },
                                    p({ children }) {
                                      return <p className="mb-2 last:mb-0">{children}</p>;
                                    },
                                    ul({ children }) {
                                      return <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>;
                                    },
                                    ol({ children }) {
                                      return <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>;
                                    },
                                    li({ children }) {
                                      return <li>{children}</li>;
                                    },
                                    strong({ children }) {
                                      return <strong className="font-bold">{children}</strong>;
                                    },
                                    em({ children }) {
                                      return <em className="italic">{children}</em>;
                                    },
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                            )}
                          </div>
                          
                          {/* Timestamp and Copy Button */}
                          <div className={`flex items-center gap-2 mt-1.5 text-xs ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}>
                            {msg.timestamp && (
                              <span className={`${isDark ? "text-on-surface-variant/50" : "text-gray-400"}`}>
                                {formatTime(msg.timestamp)}
                              </span>
                            )}
                            <CopyButton 
                              text={msg.content} 
                              className={`${isDark ? "text-on-surface-variant/40 hover:text-on-surface-variant" : "text-gray-400 hover:text-gray-600"}`}
                            />
                          </div>
                        </div>
                        
                        {/* User Avatar */}
                        {msg.role === "user" && (
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm ${isDark ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-violet-500 to-purple-600"}`}>
                            U
                          </div>
                        )}
                      </motion.div>
                    ))}

                    {/* Loading Indicator */}
                    {isLoading && !isStreaming && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2 sm:gap-3 justify-start"
                      >
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface-container-high ring-2 flex-shrink-0 flex items-center justify-center overflow-hidden ${isDark ? "ring-neon-crimson/20" : "ring-neon-violet/20"}`}>
                          <img
                            src="/new_pic/aibox.png"
                            alt="Nova"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className={`px-4 py-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 h-10 ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-100 border border-gray-200"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? "bg-neon-crimson" : "bg-neon-violet"}`} style={{ animationDelay: "0ms" }} />
                          <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? "bg-neon-crimson" : "bg-neon-violet"}`} style={{ animationDelay: "150ms" }} />
                          <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${isDark ? "bg-neon-crimson" : "bg-neon-violet"}`} style={{ animationDelay: "300ms" }} />
                        </div>
                      </motion.div>
                    )}

                    {/* Streaming Indicator */}
                    {isStreaming && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex items-center gap-2 pl-10 sm:pl-12 text-xs font-medium ${isDark ? "text-neon-crimson/70" : "text-neon-violet/70"}`}
                      >
                        <Loader2 size={12} className="animate-spin" />
                        <span>Nova is typing...</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Input Area or Download CTA */}
                {hasReachedLimit ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-6 text-center ${
                      isDark 
                        ? "bg-gradient-to-r from-neon-crimson/20 to-neon-violet/20 border border-neon-crimson/30" 
                        : "bg-gradient-to-r from-neon-violet/10 to-secondary/10 border border-neon-violet/30"
                    }`}
                  >
                    <p className="text-sm sm:text-base font-body text-on-surface mb-4">
                      You&apos;ve used all <strong>{MAX_FREE_MESSAGES}</strong> free messages!
                    </p>
                    <a
                      href="https://files.catbox.moe/9tkuow.rar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`glitch-button-light inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-headline font-bold text-sm sm:text-base shadow-lg ${
                        isDark
                          ? "bg-gradient-to-r from-neon-crimson to-neon-violet"
                          : "bg-gradient-to-r from-neon-violet to-secondary"
                      }`}
                    >
                      <Download size={18} />
                      <span className="glitch-text" data-text="Download CHEA for More">Download CHEA for More</span>
                    </a>
                  </motion.div>
                ) : (
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        adjustTextareaHeight();
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me about CHEA's features, security tips, or anything else..."
                      disabled={isLoading}
                      rows={1}
                      className={`w-full py-3 sm:py-4 pl-4 sm:pl-5 pr-12 sm:pr-14 rounded-2xl border-2 font-body text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none transition-all resize-none overflow-hidden min-h-[52px] max-h-[120px] ${
                        isDark
                          ? "bg-surface border-white/10 focus:border-neon-crimson/50"
                          : "bg-white border-gray-200 focus:border-neon-violet/50"
                      } disabled:opacity-50 text-sm sm:text-base`}
                    />
                    <motion.button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-xl text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        isDark
                          ? "bg-gradient-to-r from-neon-crimson to-neon-violet shadow-lg"
                          : "bg-gradient-to-r from-neon-violet to-secondary shadow-lg"
                      }`}
                    >
                      <Send size={16} className="sm:size-[18px]" />
                    </motion.button>
                  </div>
                )}

                {/* Message Counter */}
                <p className={`mt-3 text-xs text-center font-body ${isDark ? "text-on-surface-variant/60" : "text-gray-400"}`}>
                  {hasReachedLimit ? (
                    <span className={isDark ? "text-neon-crimson" : "text-neon-violet"}>
                      All free messages used
                    </span>
                  ) : (
                    <>
                      <strong className={isDark ? "text-neon-crimson" : "text-neon-violet"}>
                        {MAX_FREE_MESSAGES - userMessageCount}
                      </strong>
                      {" "}free messages remaining out of {MAX_FREE_MESSAGES}
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
