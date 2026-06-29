import { ProjectPreview } from "@/components/ProjectPreview";
import { findGalleryImageByFilename, getGalleryImages } from "@/lib/gallery";

export default async function Home() {
  const galleryImages = await getGalleryImages();
  const heroLogo = findGalleryImageByFilename(galleryImages, "hero-logo.png");
  const heroBackground = findGalleryImageByFilename(galleryImages, "hero-section-bg.webp");
  const companyImage = findGalleryImageByFilename(galleryImages, "ladies-pic.webp");
  const projectTiles = [
    {
      key: "residential",
      label: "RESIDENTIAL",
      image: findGalleryImageByFilename(galleryImages, "residential-thumb.webp") ?? null,
      fallback: "/images/residential-thumb.webp"
    },
    {
      key: "commercial",
      label: "COMMERCIAL",
      image: findGalleryImageByFilename(galleryImages, "comm-thumb.webp") ?? null,
      fallback: "/images/comm-thumb.webp"
    },
    {
      key: "renovation",
      label: "RENOVATION",
      image: findGalleryImageByFilename(galleryImages, "renovation-thumb.webp") ?? null,
      fallback: "/images/renovation-thumb.webp"
    },
    {
      key: "pop-ups",
      label: "POP-UPS",
      image: findGalleryImageByFilename(galleryImages, "pop-ups-thumb.webp") ?? null,
      fallback: "/images/pop-ups-thumb.webp"
    }
  ];

  return (
    <main id="primary" className="site-main">
      <section
        className="hero-section"
        style={{
          backgroundImage: `url("${heroBackground?.url || "/images/hero-section-bg.webp"}")`
        }}
      >
        <div className="hero-logo-lockup">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroLogo?.url || "/images/hero-logo.png"}
            alt={heroLogo?.alt || "Janet Lee Design Studio"}
            className="hero-logo-image"
          />
        </div>
        <a className="scroll-down-arrow hero-scroll-arrow" href="#projects" aria-label="Scroll to projects">
          <span />
        </a>
      </section>

      <section id="projects" className="projects-section">
        <ProjectPreview projects={projectTiles} />
        <a className="scroll-down-arrow section-scroll-arrow" href="#company" aria-label="Scroll to company">
          <span />
        </a>
      </section>

      <section id="company" className="company-section">
        <div className="company-section__inner">
          <div className="company-section__content">
            <div className="company-section__copy">
              <p>
                Our design philosophy is inspired by the way water flows naturally to create rivers. Just as
                water takes the shape of the land it flows through, good design should take the shape of its
                intended purpose. It should be functional, aesthetically pleasing, and logical.
              </p>
              <p>
                Good design should take the shape of its intended purpose. It should be functional,
                aesthetically pleasing, and logical.
              </p>
            </div>

            <ul className="company-section__services" aria-label="Company services">
              <li>FULL INTERIOR DESIGN SERVICE</li>
              <li>RENOVATION&nbsp; FURNITURE</li>
              <li>FIXTURE AND EQUIPMENT (FF&amp;E)</li>
            </ul>

            <a className="company-section__button" href="#colophon">
              BOOK AN APPOINTMENT
            </a>

            <div className="company-section__details">
              <address>
                Janet Lee Design Studio
                <br />
                (032) 384 - 2345
                <br />
                Penthouse Office Suite
                <br />
                Capitol Central Hotel &amp; Suites
                <br />
                N. Escario Corner F. Ramos Ext.
                <br />
                Cebu City, Philippines 6000
              </address>
              <p>
                OFFICE HOURS:
                <br />
                Monday to Friday 9am to 6pm
              </p>
            </div>
          </div>

          <div className="company-section__image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={companyImage?.url || "/images/ladies-pic.webp"}
              alt={companyImage?.alt || "Janet Lee Design Studio team"}
              width={companyImage?.width || 991}
              height={companyImage?.height || 503}
              className="company-section__image"
            />
          </div>
        </div>
        <a className="scroll-down-arrow section-scroll-arrow" href="#colophon" aria-label="Scroll to footer">
          <span />
        </a>
      </section>
    </main>
  );
}
