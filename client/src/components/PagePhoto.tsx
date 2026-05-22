/* Bandeau photo pleine largeur, affiché sous le hero d'une page. */

interface PagePhotoProps {
  src: string;
  alt: string;
}

export default function PagePhoto({ src, alt }: PagePhotoProps) {
  return (
    <section className="bg-charcoal-light pb-12">
      <div className="container">
        <img
          src={src}
          alt={alt}
          className="w-full aspect-[16/9] object-cover object-center rounded-xl"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}
