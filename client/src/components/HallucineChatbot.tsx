/*
 * Chatbot IA Hallucine — Assistant commercial intelligent
 * Bulle flottante en bas à droite, ouvre un panneau de chat
 * Utilise le LLM via tRPC pour répondre aux questions produits
 */
import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, X, Send, Loader2, Sparkles, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Streamdown } from "streamdown";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Quel écran pour un mariage en plein air ?",
  "Quels sont vos prix ?",
  "Quelle différence entre étanche et soufflerie ?",
  "Livrez-vous à l'international ?",
];

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Bonjour ! 🎬 Je suis l'assistant Hallucine. Je peux vous aider à choisir le bon écran de cinéma gonflable, vous renseigner sur nos produits ou vous orienter vers un devis. Comment puis-je vous aider ?",
};

export default function HallucineChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [showBadge, setShowBadge] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chatMutation = trpc.chatbot.chat.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Désolé, une erreur est survenue. Vous pouvez nous contacter directement au +33 6 80 14 76 94 ou via contact@hallucine.fr.",
        },
      ]);
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = (content: string) => {
    if (!content.trim() || chatMutation.isPending) return;

    const userMsg: ChatMessage = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // Send only user/assistant messages (not the welcome message if it's the first)
    const conversationHistory = newMessages.filter(
      (m) => m !== WELCOME_MESSAGE || m.role === "user"
    );
    chatMutation.mutate({ messages: conversationHistory });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-[61] w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10"
            style={{ background: "oklch(0.14 0.02 260)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[oklch(0.20_0.04_45)] to-[oklch(0.16_0.03_260)] border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-warm/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-warm" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Assistant Hallucine</h3>
                  <p className="text-white/50 text-xs">IA • Répond instantanément</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-warm/15 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-warm" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-warm text-charcoal rounded-br-md"
                        : "bg-white/8 text-white/85 rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 [&_strong]:text-warm/90">
                        <Streamdown>{msg.content}</Streamdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-white/60" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading indicator */}
              {chatMutation.isPending && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-warm/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-warm" />
                  </div>
                  <div className="bg-white/8 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-warm/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-warm/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-warm/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested prompts (only if just welcome message) */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      disabled={chatMutation.isPending}
                      className="text-xs px-3 py-1.5 rounded-full border border-warm/20 text-warm/70 hover:bg-warm/10 hover:text-warm hover:border-warm/40 transition-all disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 border-t border-white/8 bg-[oklch(0.12_0.015_260)]"
            >
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question..."
                  rows={1}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-warm/40 focus:outline-none resize-none max-h-20 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || chatMutation.isPending}
                  className="w-10 h-10 rounded-xl bg-warm flex items-center justify-center text-charcoal hover:bg-warm-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-center text-white/20 text-[10px] mt-2">
                Assistant IA Hallucine • Réponses générées automatiquement
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowBadge(false);
        }}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-white/10 border border-white/20 hover:bg-white/15"
            : "bg-gradient-to-br from-warm to-[oklch(0.65_0.15_45)] hover:shadow-xl hover:shadow-warm/20 hover:scale-110"
        }`}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir l'assistant IA"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-charcoal" />
            {showBadge && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold animate-pulse">
                1
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
