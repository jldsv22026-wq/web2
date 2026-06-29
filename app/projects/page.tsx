import Image from "next/image";
import { getGalleryImages } from "@/lib/gallery";

export const metadata = {
  title: "Projects | Janet Lee Design Studio"
};

export default async function ProjectsPage() {
  const images = await getGalleryImages();

  return (
    <main className="projects-page">
      <header className="projects-header">
        <p className="project-category-label">PORTFOLIO</p>
        <h1>Projects</h1>
        <p className="projects-intro">
          A living gallery from the WordPress headless CMS. Add or reorder images in WordPress, then the
          Next.js frontend updates from the gallery endpoint.
        </p>
      </header>

      {images.length > 0 ? (
        <div className="headless-gallery-grid">
          {images.map((image) => (
            <figure className="headless-gallery-item" key={image.id}>
              <Image
                src={image.sizes.large?.url || image.sizes.medium?.url || image.url}
                alt={image.alt || image.title}
                width={image.width || 1200}
                height={image.height || 900}
                unoptimized={image.mime === "image/svg+xml"}
              />
              <figcaption>{image.title}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="empty-gallery">
          <p>No gallery images are selected in WordPress yet.</p>
        </div>
      )}
    </main>
  );
}
