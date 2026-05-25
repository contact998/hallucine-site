import { type ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "tertiary";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-warm text-charcoal hover:bg-warm-light",
  secondary:
    "border border-warm/40 text-warm hover:bg-warm/10",
  tertiary:
    "border border-white/20 text-ivory hover:bg-white/5",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 px-7 py-3 font-semibold rounded transition-colors";

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type AsLink = CommonProps & {
  href: string;
  /** True si c'est un lien externe / tel: / mailto: — utilise <a> au lieu de <Link wouter> */
  external?: boolean;
  onClick?: never;
  type?: never;
};

type AsButton = CommonProps & {
  onClick: () => void;
  type?: "button" | "submit";
  href?: never;
  external?: never;
};

type Props = AsLink | AsButton;

/**
 * Bouton standardisé des pages produit. 3 variantes : primary (doré plein), secondary (outline doré),
 * tertiary (outline ivoire). Rend un <Link wouter>, un <a> externe ou un <button> selon les props.
 */
export default function ProductButton(props: Props) {
  const { variant = "primary", children, className } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in props && props.href !== undefined) {
    if (props.external) {
      return (
        <a href={props.href} className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} onClick={props.onClick} className={classes}>
      {children}
    </button>
  );
}
