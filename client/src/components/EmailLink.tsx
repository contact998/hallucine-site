/**
 * client/src/components/EmailLink.tsx
 * Composant pour afficher un email sans le laisser en clair dans le HTML.
 * Évite que Cloudflare Email Obfuscation ne remplace les liens par
 * cdn-cgi/l/email-protection (qui cause des 404 dans les crawlers SEO).
 *
 * L'email est encodé en ROT13 dans le HTML — illisible pour Cloudflare,
 * décodé instantanément côté client par JavaScript.
 *
 * Usage :
 *   <EmailLink />                          → lien "contact@hallucine.fr"
 *   <EmailLink className="text-gold" />    → avec classes CSS
 *   <EmailLink label="Nous écrire" />      → texte personnalisé
 *   <EmailLink asText />                   → texte simple sans lien
 */

const EMAIL = "contact@hallucine.fr";

/** Encode une chaîne en ROT13 — suffisant pour tromper Cloudflare */
function rot13(str: string): string {
  return str.replace(/[a-zA-Z]/g, (c) => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

/** Décode le ROT13 au clic — l'href est construit dynamiquement */
function getMailto(): string {
  return `mailto:${rot13(rot13(EMAIL))}`; // double ROT13 = identité, décodé au runtime
}

interface EmailLinkProps {
  className?: string;
  /** Texte affiché — par défaut l'adresse email */
  label?: string;
  /** Si true, affiche le texte sans balise <a> */
  asText?: boolean;
}

export default function EmailLink({ className, label, asText }: EmailLinkProps) {
  // L'email est stocké encodé — Cloudflare ne le reconnaît pas
  const encoded = rot13(EMAIL); // "pbagnpg@unyyhpvar.se"

  if (asText) {
    return (
      <span
        className={className}
        data-email={encoded}
        ref={(el) => {
          if (el) el.textContent = rot13(encoded);
        }}
      >
        {/* Texte décodé par JS — jamais en clair dans le HTML initial */}
      </span>
    );
  }

  return (
    <a
      href="#"
      className={className}
      data-email={encoded}
      onClick={(e) => {
        e.preventDefault();
        window.location.href = `mailto:${rot13(encoded)}`;
      }}
      ref={(el) => {
        if (el) {
          el.textContent = label ?? rot13(encoded);
          el.href = `mailto:${rot13(encoded)}`;
        }
      }}
    >
      {/* Contenu injecté par JS */}
    </a>
  );
}
