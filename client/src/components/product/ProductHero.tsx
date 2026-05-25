import { type ReactNode } from "react";

type Props = {
  /** Petit label au-dessus du H1, en uppercase tracking-widest */
  eyebrow: string;
  /** Titre H1 principal */
  title: string;
  /** Fragment coloré en accent à la suite du titre, sur une nouvelle ligne */
  coloredPart?: string;
  /** Sous-titre H2 sous le H1 (optionnel) */
  subtitle?: string;
  /** Paragraphe(s) descriptifs — passés en children */
  children?: ReactNode;
  /** Boutons d'action — typiquement <ProductButton /> */
  actions?: ReactNode;
};

/**
 * Section hero standardisée des pages produit : eyebrow + H1 (+ accent doré sur 2e ligne)
 * + sous-titre optionnel + description + CTAs.
 */
export default function ProductHero({
  eyebrow,
  title,
  coloredPart,
  subtitle,
  children,
  actions,
}: Props) {
  return (
    <section className="pt-32 pb-16 bg-charcoal-light">
      <div className="container">
        <p className="text-warm text-sm font-medium tracking-widest uppercase mb-4">{eyebrow}</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ivory leading-tight mb-6">
          {title}
          {coloredPart && (
            <>
              {" "}<br />
              <span className="text-warm">{coloredPart}</span>
            </>
          )}
        </h1>
        {subtitle && (
          <h2 className="text-xl md:text-2xl text-ivory/80 font-medium mb-6">{subtitle}</h2>
        )}
        {children && <div className="text-white/70 text-lg max-w-3xl leading-relaxed space-y-4 mb-8">{children}</div>}
        {actions && <div className="flex flex-wrap gap-4">{actions}</div>}
      </div>
    </section>
  );
}
