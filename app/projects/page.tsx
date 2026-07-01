import ProjectsShowcase from "@/components/ProjectsShowcase";
import { getProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects | Janet Lee Design Studio"
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="projects-page">
      <section className="projects-page-hero" aria-labelledby="projects-page-title">
        <div className="projects-page-hero__shade" />
        <div className="projects-page-hero__inner">
          <p className="projects-page-hero__eyebrow">Portfolio</p>
          <h1 id="projects-page-title">Projects</h1>
        </div>
      </section>

      {projects.length > 0 ? (
        <ProjectsShowcase projects={projects} />
      ) : (
        <div className="empty-gallery">
          <p>No projects are available in WordPress yet.</p>
        </div>
      )}
    </main>
  );
}
