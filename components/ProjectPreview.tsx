import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { GalleryImage } from "@/lib/gallery";

export type ProjectTile = {
  key: string;
  label: string;
  image: GalleryImage | null;
  fallback: string;
};

export function ProjectPreview({ projects }: { projects: ProjectTile[] }) {
  const getImageUrl = (project: ProjectTile) =>
    project.image?.sizes.large?.url || project.image?.sizes.medium?.url || project.image?.url || project.fallback;

  return (
    <div className="project-category-grid project-category-grid--scroll-reveal grid w-full grid-cols-1 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.key} href="/projects" label={project.label}>
          <Image
            src={getImageUrl(project)}
            alt={`${project.label} projects`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized={Boolean(project.image)}
          />
        </ProjectCard>
      ))}
    </div>
  );
}

function ProjectCard({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <Link href={href} className="project-category-card group">
      {children}
      <span className="project-category-card__shade" />
      <span className="project-category-card__label">{label}</span>
    </Link>
  );
}
