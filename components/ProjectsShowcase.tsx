"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project, ProjectImage } from "@/lib/projects";

const defaultFilters = [
  { label: "RESIDENTIAL", value: "residential" },
  { label: "COMMERCIAL", value: "commercial" },
  { label: "RENOVATION", value: "renovation" },
  { label: "POP-UPS", value: "popups" }
];

function normalizeCategory(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function imageNeedsUnoptimized(image: ProjectImage) {
  return image.url.toLowerCase().split("?")[0].endsWith(".svg");
}

function isValidFilter(value: string | null) {
  return Boolean(value && defaultFilters.some((filter) => filter.value === value));
}

function getInitialFilter() {
  if (typeof window === "undefined") {
    return "residential";
  }

  const params = new URLSearchParams(window.location.search);
  const categoryFromUrl = params.get("category");
  const savedCategory = window.localStorage.getItem("jlds-project-category");

  if (isValidFilter(categoryFromUrl)) {
    return categoryFromUrl as string;
  }

  if (isValidFilter(savedCategory)) {
    return savedCategory as string;
  }

  return "residential";
}

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  const [activeImage, setActiveImage] = useState(project.images[0] ?? null);
  const thumbnails = [...project.images.slice(0, 6)];

  while (thumbnails.length < 6) {
    thumbnails.push({ url: "", alt: "" });
  }

  return (
    <section className={`project-entry ${index % 2 === 0 ? "text-left" : "text-right"}`}>
      <div className="project-inner">
        <div className="project-info-col">
          <span className="project-category-label">{project.categoryLabel}</span>
          <h2 className="project-entry-title">{project.title}</h2>
          {project.description ? <p className="project-entry-desc">{project.description}</p> : null}

          <div className="project-thumbnails-grid" aria-label={`${project.title} thumbnails`}>
            {thumbnails.map((thumbnail, thumbnailIndex) => {
              const isEmpty = !thumbnail.url;
              const isActive = activeImage?.url === thumbnail.url;

              return (
                <button
                  aria-label={isEmpty ? "Empty thumbnail slot" : `Show image ${thumbnailIndex + 1} for ${project.title}`}
                  className={`project-thumb-item${isActive ? " active" : ""}${isEmpty ? " empty" : ""}`}
                  disabled={isEmpty}
                  key={`${project.id}-${thumbnailIndex}-${thumbnail.url || "empty"}`}
                  onClick={() => setActiveImage(thumbnail)}
                  type="button"
                >
                  {thumbnail.url ? (
                    <Image
                      alt={thumbnail.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 30vw, 150px"
                      src={thumbnail.url}
                      unoptimized={imageNeedsUnoptimized(thumbnail)}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="project-gallery-col">
          <div className="gallery-display">
            {activeImage?.url ? (
              <div className="gallery-img-wrapper">
                <Image
                  alt={activeImage.alt || project.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 840px"
                  src={activeImage.url}
                  unoptimized={imageNeedsUnoptimized(activeImage)}
                />
              </div>
            ) : (
              <div className="gallery-img-wrapper gallery-img-wrapper--empty" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProjectsShowcase({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState(getInitialFilter);

  const selectFilter = (value: string) => {
    setActiveFilter(value);
    window.localStorage.setItem("jlds-project-category", value);

    const url = new URL(window.location.href);
    url.searchParams.set("category", value);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const visibleProjects = projects.filter((project) => {
    return normalizeCategory(project.category) === activeFilter;
  });

  return (
    <>
      <header className="projects-page-hero">
        <div className="filter-container" aria-label="Project categories">
          {defaultFilters.map((filter) => (
            <button
              className={`filter-btn${activeFilter === filter.value ? " active" : ""}`}
              key={filter.value}
              onClick={() => selectFilter(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {visibleProjects.length > 0 ? (
        <div className="projects-list-container">
          {visibleProjects.map((project, index) => (
            <ProjectEntry index={index} key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="empty-gallery">
          <p>No projects are available for this category yet.</p>
        </div>
      )}
    </>
  );
}
