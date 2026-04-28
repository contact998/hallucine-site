/**
 * client/src/components/EmailLink.tsx
 * Affiche un email sans le laisser en clair dans le HTML.
 * Évite l'obfuscation Cloudflare (cdn-cgi/l/email-protection → 404 crawlers SEO).
 * Évite aussi les liens sans texte d'ancrage (#) détectés par les crawlers.
 *
 * Technique : l'email est splitté en deux parties dans le HTML.
 * Cloudflare cherche des patterns complets "xxx@xxx.xxx" — le split le trompe.
 * Le crawler SEO voit un texte d'ancrage lisible. L'utilisateur voit l'email complet.
 */

const USER = "contact";
const DOMAIN = "hallucine.fr";

interface EmailLinkProps {
  className?: string;
  label?: string;
  asText?: boolean;
}

export default function EmailLink({ className, label, asText }: EmailLinkProps) {
  const email = `${USER}@${DOMAIN}`;
  const display = label ?? email;

  if (asText) {
    return (
      <span className={className}>
        {USER}
        <span>&#64;</span>
        {DOMAIN}
      </span>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={(e) => {
        // Reconstruction dynamique pour contourner les éventuels filtres
        e.currentTarget.href = `mailto:${USER}@${DOMAIN}`;
      }}
    >
      {display === email ? (
        <>
          {USER}
          <span>&#64;</span>
          {DOMAIN}
        </>
      ) : (
        display
      )}
    </a>
  );
}
