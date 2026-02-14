/*
 * Design: "Nuit Étoilée" – Section Contact
 * Formulaire de devis intelligent et guidé
 * Étape 1 : choix du produit (Écran, Tente, Mobilier)
 * Étape 2 : détails spécifiques au produit choisi
 * Étape 3 : coordonnées
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Tent, Armchair, ArrowRight, ArrowLeft, Send, CheckCircle, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

type ProductType = "ecran" | "tente" | "mobilier" | null;

const screenSizes = [
  { value: "2m", label: "2m", tech: "Étanche" },
  { value: "3m", label: "3m", tech: "Étanche" },
  { value: "4m", label: "4m", tech: "Étanche" },
  { value: "5m", label: "5m", tech: "Étanche" },
  { value: "6m", label: "6m", tech: "Étanche" },
  { value: "8m", label: "8m", tech: "Étanche" },
  { value: "10m", label: "10m", tech: "Soufflerie" },
  { value: "12m", label: "12m", tech: "Soufflerie" },
  { value: "15m", label: "15m", tech: "Soufflerie" },
  { value: "18m", label: "18m", tech: "Soufflerie" },
  { value: "20m", label: "20m", tech: "Soufflerie" },
  { value: "24m", label: "24m", tech: "Soufflerie" },
];

export default function ContactSection() {
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState<ProductType>(null);
  const [screenSize, setScreenSize] = useState("");
  const [usage, setUsage] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name || !email) {
      toast.error("Veuillez remplir au moins votre nom et votre email.");
      return;
    }
    setSubmitted(true);
    toast.success("Votre demande a bien été envoyée. Nous vous répondrons dans les 24h.");
  };

  const products = [
    { type: "ecran" as const, icon: Monitor, label: "Écran de cinéma", desc: "De 2m à 24m, étanche ou soufflerie" },
    { type: "tente" as const, icon: Tent, label: "Tente gonflable", desc: "Technologie étanche, montage rapide" },
    { type: "mobilier" as const, icon: Armchair, label: "Mobilier gonflable", desc: "Technologie étanche, design élégant" },
  ];

  const selectedSize = screenSizes.find((s) => s.value === screenSize);

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[oklch(0.10_0.04_260_/_0.5)] to-[oklch(0.14_0.03_260)]" />

      <div className="container relative">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left side - Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-gold text-sm font-semibold tracking-widest uppercase">Contact</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
                Parlons de votre<br />
                <span className="text-gradient-gold">projet</span>
              </h2>
              <p className="text-white/60 mt-4 leading-relaxed">
                Chaque projet est unique. Dites-nous ce que vous cherchez, et nous vous proposerons la solution la plus adaptée à vos besoins.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Email</div>
                    <div className="text-white/50 text-sm">contact@hallucine.fr</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Téléphone</div>
                    <div className="text-white/50 text-sm">+33 6 80 14 76 94</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">Siège</div>
                    <div className="text-white/50 text-sm">Shenzhen, Chine — Fabrication : Dongguan, Chine</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-white/[0.04] border border-white/10 rounded-sm p-6 md:p-8"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-gold mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-3">Merci pour votre demande</h3>
                  <p className="text-white/60">
                    Nous avons bien reçu votre demande de devis. Notre équipe vous répondra dans les 24 heures.
                  </p>
                </div>
              ) : (
                <>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex-1 flex items-center gap-2">
                        <div
                          className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                            s <= step ? "bg-gold" : "bg-white/10"
                          }`}
                        />
                      </div>
                    ))}
                    <span className="text-white/40 text-xs ml-2">Étape {step}/3</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {/* Step 1: Product selection */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-white mb-2">Quel produit vous intéresse ?</h3>
                        <p className="text-white/50 text-sm mb-6">Sélectionnez la catégorie qui correspond à votre besoin.</p>
                        <div className="grid gap-3">
                          {products.map((p) => (
                            <button
                              key={p.type}
                              onClick={() => {
                                setProduct(p.type);
                                setStep(2);
                              }}
                              className={`flex items-center gap-4 p-4 border rounded-sm transition-all duration-300 text-left ${
                                product === p.type
                                  ? "border-gold bg-gold/10"
                                  : "border-white/10 hover:border-gold/30 bg-white/[0.02]"
                              }`}
                            >
                              <div className="w-12 h-12 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                                <p.icon className="w-6 h-6 text-gold" />
                              </div>
                              <div>
                                <div className="text-white font-semibold">{p.label}</div>
                                <div className="text-white/40 text-xs">{p.desc}</div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-white/30 ml-auto" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Product details */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-white mb-2">
                          {product === "ecran" && "Quelle taille d'écran ?"}
                          {product === "tente" && "Décrivez votre besoin en tente"}
                          {product === "mobilier" && "Décrivez votre besoin en mobilier"}
                        </h3>
                        <p className="text-white/50 text-sm mb-6">
                          {product === "ecran" && "Sélectionnez la taille souhaitée. La technologie s'adapte automatiquement."}
                          {product === "tente" && "Taille, usage, nombre de personnes..."}
                          {product === "mobilier" && "Type de mobilier, quantité, événement..."}
                        </p>

                        {product === "ecran" && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                              {screenSizes.map((size) => (
                                <button
                                  key={size.value}
                                  onClick={() => setScreenSize(size.value)}
                                  className={`p-3 border rounded-sm text-center transition-all duration-300 ${
                                    screenSize === size.value
                                      ? "border-gold bg-gold/10"
                                      : "border-white/10 hover:border-gold/30"
                                  }`}
                                >
                                  <div className="text-white font-bold text-lg">{size.label}</div>
                                  <div className={`text-xs mt-0.5 ${
                                    size.tech === "Étanche" ? "text-gold/70" : "text-blue-400/70"
                                  }`}>
                                    {size.tech}
                                  </div>
                                </button>
                              ))}
                            </div>
                            {selectedSize && (
                              <div className="p-3 bg-gold/5 border border-gold/20 rounded-sm">
                                <span className="text-gold text-sm">
                                  Technologie {selectedSize.tech} — {selectedSize.tech === "Étanche" ? "Chambre à air scellée, sans soufflerie" : "Soufflerie permanente, tissu polyamide haute ténacité"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="mt-4">
                          <label className="text-white/60 text-sm mb-2 block">
                            {product === "ecran" ? "Usage prévu" : "Décrivez votre besoin"}
                          </label>
                          <select
                            value={usage}
                            onChange={(e) => setUsage(e.target.value)}
                            className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm focus:border-gold focus:outline-none"
                          >
                            <option value="">Sélectionnez un usage</option>
                            <option value="festival">Festival / Événement public</option>
                            <option value="corporate">Événement corporate</option>
                            <option value="cinema">Cinéma en plein air</option>
                            <option value="sport">Retransmission sportive</option>
                            <option value="mariage">Mariage / Événement privé</option>
                            <option value="location">Location / Prestation</option>
                            <option value="autre">Autre</option>
                          </select>
                        </div>

                        <div className="mt-4">
                          <label className="text-white/60 text-sm mb-2 block">Message complémentaire</label>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            placeholder="Décrivez votre projet, vos contraintes, vos questions..."
                            className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setStep(1)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-sm hover:border-white/30 transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4" /> Retour
                          </button>
                          <button
                            onClick={() => setStep(3)}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold text-navy-deep font-semibold text-sm rounded-sm hover:bg-gold-light transition-colors"
                          >
                            Continuer <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Contact info */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h3 className="text-xl font-bold text-white mb-2">Vos coordonnées</h3>
                        <p className="text-white/50 text-sm mb-6">Pour que nous puissions vous répondre rapidement.</p>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-white/60 text-sm mb-1.5 block">Nom complet *</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Jean Dupont"
                              className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-white/60 text-sm mb-1.5 block">Email *</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="jean@exemple.com"
                              className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-white/60 text-sm mb-1.5 block">Téléphone</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+33 6 12 34 56 78"
                              className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-white/60 text-sm mb-1.5 block">Société</label>
                            <input
                              type="text"
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                              placeholder="Nom de votre société"
                              className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="text-white/60 text-sm mb-1.5 block">Pays</label>
                            <input
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              placeholder="France"
                              className="w-full p-3 bg-white/[0.05] border border-white/10 rounded-sm text-white text-sm placeholder:text-white/30 focus:border-gold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setStep(2)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/70 text-sm rounded-sm hover:border-white/30 transition-colors"
                          >
                            <ArrowLeft className="w-4 h-4" /> Retour
                          </button>
                          <button
                            onClick={handleSubmit}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy-deep font-bold text-sm rounded-sm hover:bg-gold-light transition-colors glow-gold"
                          >
                            <Send className="w-4 h-4" /> Envoyer ma demande
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
