import { describe, it, expect } from "vitest";
import {
  blogListPath,
  blogLocaleString,
  pageTitleWithBrand,
  extractListMeta,
  buildBlogListHtml,
} from "./blogListSsr";

const TEMPLATE = `<!doctype html><html lang="__LOCALE__"><head>
<title>__PAGE_TITLE__</title>
<meta name="description" content="__PAGE_DESCRIPTION__" />
<!--__OG_LOCALE_TAGS__-->
<meta property="og:image" content="__PAGE_IMAGE__" />
<meta property="og:url" content="__PAGE_URL__" />
<link rel="canonical" href="https://obsolete.example/" />
<link rel="alternate" hreflang="fr" href="https://obsolete.example/" />
</head><body><div id="root"></div></body></html>`;

function post(over: Record<string, unknown> = {}) {
  return {
    id: 1,
    title: "Mon titre",
    slug: "mon-titre",
    excerpt: "Un extrait descriptif.",
    content: "<p>corps</p>",
    imageUrl: null,
    lang: "fr",
    parentId: null,
    status: "published",
    publishedAt: new Date("2026-04-30T00:00:00Z"),
    createdAt: new Date("2026-04-30T00:00:00Z"),
    updatedAt: new Date("2026-04-30T00:00:00Z"),
    metaKeywords: null,
    metaDescription: null,
    author: "Hallucine",
    category: null,
    ...over,
  } as never;
}

const META = { title: "Blog | Hallucine", description: "Desc.", image: "https://img.example/x.webp", h1: "Le Blog" };

describe("pageTitleWithBrand — suffixe marque systématique (title ≠ H1)", () => {
  it("titre court → suffixe « | Hallucine »", () => {
    const t48 = "a".repeat(48);
    expect(pageTitleWithBrand(t48)).toBe(`${t48} | Hallucine`);
  });
  it("titre long → suffixe quand même (différencie title/H1, Google tronque l'affichage)", () => {
    const t70 = "a".repeat(70);
    expect(pageTitleWithBrand(t70)).toBe(`${t70} | Hallucine`);
  });
  it("titre mentionnant déjà la marque → servi tel quel (pas de « Hallucine | Hallucine »)", () => {
    expect(pageTitleWithBrand("Hallucine la Mure Fabricant d'Ecrans Gonflables")).toBe(
      "Hallucine la Mure Fabricant d'Ecrans Gonflables",
    );
  });
});

describe("blogLocaleString — chaînes blog côté serveur", () => {
  it("sert la chaîne de la locale demandée (même source que le client)", () => {
    expect(blogLocaleString("fr", "other_articles", "x")).toBe("Autres articles");
    expect(blogLocaleString("pt", "other_articles", "x")).not.toBe("x");
  });
  it("locale inconnue → FR ; clé inconnue → fallback", () => {
    expect(blogLocaleString("zz", "other_articles", "x")).toBe("Autres articles");
    expect(blogLocaleString("fr", "cle_inexistante", "repli")).toBe("repli");
  });
});

describe("blogListPath", () => {
  it("renvoie le chemin blog de la langue, fallback FR pour une langue inconnue", () => {
    expect(blogListPath("fr")).toBe("/blog");
    expect(blogListPath("xx")).toBe(blogListPath("fr"));
  });
});

describe("extractListMeta", () => {
  it("extrait title/description/og:image/h1 du HTML pré-rendu", () => {
    const html = `<head><title>Blog | Actualités</title>
<meta name="description" content="La desc échappée &amp; localisée" />
<meta property="og:image" content="https://r2.example/hero.webp" /></head>
<body><h1 class="font-display">Notre Blog</h1></body>`;
    expect(extractListMeta(html)).toEqual({
      title: "Blog | Actualités",
      description: "La desc échappée &amp; localisée",
      image: "https://r2.example/hero.webp",
      h1: "Notre Blog",
    });
  });
  it("renvoie undefined par champ manquant (défauts appliqués par l'appelant)", () => {
    expect(extractListMeta("<html></html>")).toEqual({
      title: undefined, description: undefined, image: undefined, h1: undefined,
    });
  });
});

describe("buildBlogListHtml", () => {
  const html = buildBlogListHtml({
    cleanTemplate: TEMPLATE,
    locale: "fr",
    posts: [post(), post({ id: 2, title: 'Titre <fragile> & "à échapper"', slug: "titre-fragile", excerpt: null })],
    total: 21,
    meta: META,
    ogLocaleTags: '<meta property="og:locale" content="fr_FR" />',
  });

  it("injecte des liens articles crawlables dans #root (avec date et extrait)", () => {
    expect(html).toContain('<a href="/blog/mon-titre">Mon titre</a>');
    expect(html).toContain('<time datetime="2026-04-30">');
    expect(html).toContain("<p>Un extrait descriptif.</p>");
    expect(html).toContain("<h1>Le Blog</h1>");
  });

  it("échappe les titres dans les liens", () => {
    expect(html).toContain("Titre &lt;fragile&gt; &amp; &quot;à échapper&quot;");
    expect(html).not.toContain("<fragile>");
  });

  it("canonical + hreflang ×6 + x-default du bon TLD, anciens tags retirés", () => {
    expect(html).toContain('<link rel="canonical" href="https://hallucinecran.fr/blog" />');
    for (const origin of ["hallucinecran.fr", "hallucinecran.com", "hallucinecran.de", "hallucinecran.es", "hallucinecran.it", "hallucinecran.pt"]) {
      expect(html).toContain(`href="https://${origin}/blog"`);
    }
    expect(html).toContain('hreflang="x-default"');
    expect(html).not.toContain("obsolete.example");
  });

  it("expose __SSR_INITIAL_DATA__.blogList au format lu par readSsrBlogList", () => {
    expect(html).toContain("window.__SSR_INITIAL_DATA__=");
    expect(html).toContain('"blogList":{"lang":"fr","limit":50,"data":{"posts":[');
    expect(html).toContain('"total":21');
  });

  it("JSON-LD CollectionPage avec ItemList complet", () => {
    expect(html).toContain('"@type":"CollectionPage"');
    expect(html).toContain('"numberOfItems":2');
    expect(html).toContain('"url":"https://hallucinecran.fr/blog/titre-fragile"');
  });

  it("locale de → canonical et og:url sur le .de", () => {
    const de = buildBlogListHtml({
      cleanTemplate: TEMPLATE, locale: "de", posts: [post()], total: 1,
      meta: META, ogLocaleTags: "",
    });
    expect(de).toContain('<link rel="canonical" href="https://hallucinecran.de/blog" />');
    expect(de).toContain('content="https://hallucinecran.de/blog"');
  });
});
