import { redirect } from "next/navigation";
import { ProjectDashboardClient } from "@/components/ProjectDashboardClient";
import { isProjectDashboardAuthenticated } from "@/lib/projectAuth";
import { getProjects } from "@/lib/projects";

export const metadata = {
  title: "Project Dashboard | Janet Lee Design Studio"
};

export default async function ProjectDashboardPage() {
  if (!(await isProjectDashboardAuthenticated())) {
    redirect("/project-login");
  }

  const projects = await getProjects({ includeFallback: false });

  return <ProjectDashboardClient initialProjects={projects} />;
}
