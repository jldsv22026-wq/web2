import ProjectsShowcase from "@/components/ProjectsShowcase";
import { getProjects } from "@/lib/projects";

export const metadata = {
  title: "Projects | Janet Lee Design Studio"
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="projects-page">
      {projects.length > 0 ? (
        <ProjectsShowcase projects={projects} />
      ) : (
        <div className="empty-gallery">
          <p>No projects are available in WordPress yet.</p>
        </div>
      )}

      <section className="projects-partners" aria-labelledby="projects-partners-title">
        <h2 id="projects-partners-title">OUR PARTNERS</h2>
        <div className="projects-partners__logos">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="projects-partners__logo" key={index}>
              <span>LOGO</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
