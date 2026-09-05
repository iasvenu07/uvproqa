import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Sparkles, User, Bot, AlertCircle, Trash2, X, Minimize2, Maximize2 } from "lucide-react";
import { ChatMessage } from "../types";

export default function AiTwinChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I am Venugopal's **QA & Agentic AI Twin**, powered by **Gemini 3.8 Flash**.\n\nAsk me anything about Venugopal's work history, M.Tech education, cloud testing expertise, or certifications (like Oracle Agentic AI or Azure Developer Associate)!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestions = [
    "What certifications do you have?",
    "Tell me about your M.Tech education",
    "Describe your internship at Chegg",
    "What is your automated testing stack?"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map existing messages to history format for backend
      const historyPayload = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with AI Twin server.");
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: data.response,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setError("I had trouble reaching Venugopal's cloud nodes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I am Venugopal's **QA & Agentic AI Twin**, powered by **Gemini 3.8 Flash**.\n\nAsk me anything about Venugopal's work history, M.Tech education, cloud testing expertise, or certifications (like Oracle Agentic AI or Azure Developer Associate)!",
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  return (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px] backdrop-blur-xl">
      {/* Chat Header */}
      <div className="bg-black/30 px-4 py-3.5 flex items-center justify-between text-white border-b border-white/5">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-white/10 rounded-lg">
            <Sparkles size={18} className="text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-white">Venugopal's AI Twin</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[10px] text-indigo-400 font-mono uppercase tracking-wider font-semibold">Gemini 3.8 Flash • Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearHistory}
            title="Reset Chat History"
            className="p-1.5 hover:bg-white/10 rounded-md transition-all text-slate-400 hover:text-white cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/10">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`p-1.5 rounded-lg shrink-0 shadow-sm ${
                msg.role === "user" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-white/5 border border-white/10 text-indigo-400"
              }`}>
                {msg.role === "user" ? <User size={15} /> : <Bot size={15} />}
              </div>

              {/* Speech Bubble */}
              <div className="max-w-[80%] flex flex-col">
                <div className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-white/5 text-slate-300 border border-white/5 rounded-tl-none"
                }`}>
                  {msg.content}
                </div>
                <span className={`text-[9px] mt-1 text-slate-500 font-mono ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-indigo-400 shadow-sm">
                <Bot size={15} />
              </div>
              <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-rose-500 text-xs justify-center bg-rose-500/5 py-2 px-3 border border-rose-500/10 rounded-lg"
            >
              <AlertCircle size={13} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Bubbles (Show only on welcome or when history is short) */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-white/5 bg-[#0c0c0c] flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(s)}
              className="whitespace-nowrap text-[10px] font-mono uppercase tracking-wider bg-white/5 hover:bg-white/10 text-slate-300 py-1.5 px-3 rounded-full border border-white/10 transition-all cursor-pointer shrink-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <div className="p-3 border-t border-white/5 bg-[#0c0c0c] flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
          disabled={isLoading}
          placeholder={isLoading ? "AI Twin is writing..." : "Ask me about Venugopal's credentials..."}
          className="flex-1 bg-black/40 border border-white/5 px-3.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all"
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-md cursor-pointer shrink-0"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
