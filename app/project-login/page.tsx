import { redirect } from "next/navigation";
import { ProjectLoginForm } from "@/components/ProjectLoginForm";
import { isProjectDashboardAuthenticated } from "@/lib/projectAuth";

export const metadata = {
  title: "Project Login | Janet Lee Design Studio"
};

export default async function ProjectLoginPage() {
  if (await isProjectDashboardAuthenticated()) {
    redirect("/project-dashboard");
  }

  return (
    <main className="project-login-page utility-page">
      <div className="login-bg-text">PROJECTS</div>

      <div className="login-card">
        <h1 className="admin-login-title">ADMIN LOGIN</h1>
        <ProjectLoginForm />
      </div>
    </main>
  );
}
