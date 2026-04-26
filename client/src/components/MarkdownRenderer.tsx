/**
 * MarkdownRenderer.tsx — Remplace Streamdown par marked + DOMPurify
 *
 * Pourquoi : streamdown embarque mermaid → three.js = ~12 Mo dans le bundle.
 * marked + dompurify = ~50 Ko pour le même rendu markdown dans un chatbot.
 *
 * Usage : remplacer <Streamdown>{content}</Streamdown>
 *         par      <MarkdownRenderer>{content}</MarkdownRenderer>
 *
 * API marked v18 : utilise marked.use({ renderer: {...} }) au lieu de new Renderer()
 */
import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Configuration marked v18 : renderer via marked.use()
marked.use({
  gfm: true,    // GitHub Flavored Markdown (tableaux, listes de tâches)
  breaks: true, // \n → <br> (pratique pour les messages de chatbot)
  renderer: {
    // Ouvrir les liens dans un nouvel onglet
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const titleAttr = title ? ` title="${title}"` : "";
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
  },
});

interface MarkdownRendererProps {
  children: string;
  className?: string;
}

export function MarkdownRenderer({ children, className }: MarkdownRendererProps) {
  const html = useMemo(() => {
    if (!children) return "";
    // 1. Parser le markdown en HTML
    const rawHtml = marked.parse(children) as string;
    // 2. Sanitizer pour éviter les injections XSS
    return DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "b", "i", "u", "s",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li",
        "a", "code", "pre", "blockquote",
        "table", "thead", "tbody", "tr", "th", "td",
        "hr", "img",
      ],
      ALLOWED_ATTR: ["href", "title", "target", "rel", "src", "alt", "class"],
    });
  }, [children]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
