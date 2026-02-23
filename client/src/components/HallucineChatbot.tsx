/**
 * Chatbot IA Hallucine — Assistant commercial intelligent
 * Bulle flottante en bas à droite, ouvre un panneau de chat
 * Utilise le LLM via tRPC pour répondre aux questions produits
 * Après quelques échanges, propose un bouton "Demander un devis" pré-rempli
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, X, Send, Loader2, Sparkles, User, ChevronDown, FileText, Monitor, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Streamdown } from "streamdown";
import { useLocation } from "wouter";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface LeadData {
  product: "ecran" | "tente" | "mobilier" | "arche" | null;
  size: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  country: string;
  eventType: string;
  audience: string;
  date: string;
  budget: string;
  need: "achat" | "location" | "info" | null;
  message: string;
  ready: boolean;
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

/** Parse le bloc LEAD_DATA caché dans la réponse du chatbot */
function parseLeadData(content: string): LeadData | null {
  const match = content.match(/<!--LEAD_DATA:(.*?)-->/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/** Nettoie le contenu du message en retirant le bloc LEAD_DATA */
function cleanContent(content: string): string {
  return content.replace(/<!--LEAD_DATA:.*?-->/g, "").trim();
}

export default function HallucineChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [showBadge, setShowBadge] = useState(true);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [showDevisButton, setShowDevisButton] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [, navigate] = useLocation();
  const messageCountRef = useRef(0);

  const chatMutation = trpc.chatbot.chat.useMutation({
    onSuccess: (data) => {
      const rawContent = data.response;
      const extracted = parseLeadData(rawContent);
      const cleaned = cleanContent(rawContent);

      if (extracted) {
        setLeadData(prev => ({
          product: extracted.product || prev?.product || null,
          size: extracted.size || prev?.size || "",
          name: extracted.name || prev?.name || "",
          email: extracted.email || prev?.email || "",
          phone: extracted.phone || prev?.phone || "",
          company: extracted.company || prev?.company || "",
          city: extracted.city || prev?.city || "",
          country: extracted.country || prev?.country || "",
          eventType: extracted.eventType || prev?.eventType || "",
          audience: extracted.audience || prev?.audience || "",
          date: extracted.date || prev?.date || "",
          budget: extracted.budget || prev?.budget || "",
          need: extracted.need || prev?.need || null,
          message: extracted.message || prev?.message || "",
          ready: extracted.ready || prev?.ready || false,
        }));
        if (extracted.ready) {
          setShowDevisButton(true);
        }
      }

      messageCountRef.current += 1;
      // Après 3 échanges, montrer le bouton devis même sans LEAD_DATA ready
      if (messageCountRef.current >= 3 && !showDevisButton) {
        setShowDevisButton(true);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: cleaned },
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

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || chatMutation.isPending) return;

    const userMsg: ChatMessage = { role: "user", content: content.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    const conversationHistory = newMessages.filter(
      (m) => m !== WELCOME_MESSAGE || m.role === "user"
    );
    chatMutation.mutate({ messages: conversationHistory });
  }, [messages, chatMutation]);

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

  /** Compter les infos collectées pour afficher le résumé */
  const collectedInfoCount = (() => {
    if (!leadData) return 0;
    let count = 0;
    if (leadData.product) count++;
    if (leadData.size) count++;
    if (leadData.name) count++;
    if (leadData.email) count++;
    if (leadData.phone) count++;
    if (leadData.company) count++;
    if (leadData.city || leadData.country) count++;
    if (leadData.eventType) count++;
    if (leadData.message) count++;
    return count;
  })();

  /** Naviguer vers le formulaire avec les données pré-remplies */
  const goToDevis = useCallback(() => {
    const params = new URLSearchParams();
    if (leadData?.product) params.set("product", leadData.product);
    if (leadData?.size) params.set("size", leadData.size);
    if (leadData?.name) params.set("name", leadData.name);
    if (leadData?.email) params.set("email", leadData.email);
    if (leadData?.phone) params.set("phone", leadData.phone);
    if (leadData?.company) params.set("company", leadData.company);
    if (leadData?.city) params.set("city", leadData.city);
    if (leadData?.country) params.set("country", leadData.country);
    if (leadData?.message) params.set("message", leadData.message);
    if (leadData?.eventType) params.set("eventType", leadData.eventType);
    if (leadData?.audience) params.set("audience", leadData.audience);
    if (leadData?.date) params.set("date", leadData.date);
    if (leadData?.budget) params.set("budget", leadData.budget);
    if (leadData?.need) params.set("need", leadData.need);
    
    const queryString = params.toString();
    navigate(`/contactez-nous${queryString ? `?${queryString}` : ""}`);
    setIsOpen(false);
  }, [leadData, navigate]);

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
                aria-label="Réduire le chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10"
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

              {/* CTA Devis button — apparaît après quelques échanges */}
              {showDevisButton && !chatMutation.isPending && messages.length > 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 space-y-2"
                >
                  {/* Résumé des infos collectées */}
                  {collectedInfoCount > 0 && (
                    <div className="bg-warm/5 border border-warm/15 rounded-xl px-3 py-2.5">
                      <p className="text-warm/70 text-[10px] font-medium uppercase tracking-wider mb-1.5">Infos collectées de notre conversation</p>
                      <div className="flex flex-wrap gap-1.5">
                        {leadData?.product && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-warm/10 text-warm/80">
                            <Monitor className="w-3 h-3" />
                            {leadData.product === "ecran" ? "Écran" : leadData.product === "tente" ? "Tente" : leadData.product === "mobilier" ? "Mobilier" : "Arche"}
                            {leadData.size ? ` ${leadData.size}` : ""}
                          </span>
                        )}
                        {leadData?.name && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-white/60">
                            <User className="w-3 h-3" />{leadData.name}
                          </span>
                        )}
                        {leadData?.company && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-white/60">
                            {leadData.company}
                          </span>
                        )}
                        {leadData?.email && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-white/60">
                            <Mail className="w-3 h-3" />{leadData.email}
                          </span>
                        )}
                        {(leadData?.city || leadData?.country) && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-white/60">
                            {[leadData.city, leadData.country].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {leadData?.eventType && (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400/70">
                            {leadData.eventType}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={goToDevis}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-warm to-[oklch(0.72_0.14_55)] text-charcoal font-semibold text-sm rounded-xl hover:shadow-lg hover:shadow-warm/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FileText className="w-4 h-4" />
                    {collectedInfoCount > 0
                      ? `Formulaire pré-rempli (${collectedInfoCount} infos) →`
                      : "Demander un devis gratuit →"}
                  </button>
                  <p className="text-center text-white/30 text-[10px]">
                    {collectedInfoCount > 0
                      ? "Cliquez pour ouvrir le formulaire avec ces informations déjà remplies"
                      : "Formulaire pré-rempli avec les infos de notre conversation"}
                  </p>
                </motion.div>
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
                  aria-label="Envoyer le message"
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
