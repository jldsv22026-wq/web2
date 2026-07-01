import { NextResponse } from "next/server";
import { getProjects } from "@/lib/projects";
import { isProjectDashboardAuthenticated } from "@/lib/projectAuth";

export async function GET() {
  if (!(await isProjectDashboardAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const projects = await getProjects({ includeFallback: false });
  return NextResponse.json({ projects });
}
