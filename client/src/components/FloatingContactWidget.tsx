/*
 * FloatingContactWidget
 * Barre verticale flottante à droite avec actions rapides :
 * Accueil · Tél fixe · Mobile · Email · WhatsApp · Retour en haut.
 * Le bouton « Retour en haut » n'apparaît qu'après scroll > 300px.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Home, Phone, Mail, MessageCircle, ChevronUp } from "lucide-react";
import { useRoutes } from "@/i18n/useRoutes";

const TEL_FIXE = "+33458212010";
const WHATSAPP = "33680147694";
const EMAIL    = "contact@hallucine.fr";

export default function FloatingContactWidget() {
  const route = useRoutes();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside
      aria-label="Contact rapide"
      className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 p-1.5 shadow-lg"
    >
      <ActionItem
        as="link"
        href={route("home")}
        icon={<Home className="w-4 h-4" />}
        label="Accueil"
      />
      <ActionItem
        as="a"
        href={`tel:${TEL_FIXE}`}
        icon={<Phone className="w-4 h-4" />}
        label="Téléphone fixe"
        tooltip="+33 4 58 21 20 10"
      />
      <ActionItem
        as="a"
        href={`mailto:${EMAIL}`}
        icon={<Mail className="w-4 h-4" />}
        label="Email"
        tooltip={EMAIL}
      />
      <ActionItem
        as="a"
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        icon={<MessageCircle className="w-4 h-4" />}
        label="WhatsApp"
        tooltip="WhatsApp"
      />
      {scrolled && (
        <ActionItem
          as="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          icon={<ChevronUp className="w-4 h-4" />}
          label="Retour en haut"
          accent
        />
      )}
    </aside>
  );
}

// ─── Bouton générique ────────────────────────────────────────────────────────

type Common = { icon: React.ReactNode; label: string; tooltip?: string; accent?: boolean };

function ActionItem(
  props:
    | (Common & { as: "link"; href: string })
    | (Common & { as: "a"; href: string; target?: string; rel?: string })
    | (Common & { as: "button"; onClick: () => void })
) {
  const baseClass = `group relative w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
    props.accent
      ? "bg-warm text-charcoal hover:bg-warm-light"
      : "text-white/70 hover:text-white hover:bg-white/10"
  }`;

  const inner = (
    <>
      {props.icon}
      <span className="sr-only">{props.label}</span>
      {props.tooltip && (
        <span className="pointer-events-none absolute right-full mr-2 px-2 py-1 rounded bg-charcoal-light border border-white/10 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {props.tooltip}
        </span>
      )}
    </>
  );

  if (props.as === "link") {
    return <Link href={props.href} className={baseClass} aria-label={props.label}>{inner}</Link>;
  }
  if (props.as === "a") {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={baseClass}
        aria-label={props.label}
      >
        {inner}
      </a>
    );
  }
  return (
    <button onClick={props.onClick} className={baseClass} aria-label={props.label} type="button">
      {inner}
    </button>
  );
}
