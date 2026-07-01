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
    </main>
  );
}
