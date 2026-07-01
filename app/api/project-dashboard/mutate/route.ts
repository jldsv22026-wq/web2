import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/gallery";
import { isProjectDashboardAuthenticated } from "@/lib/projectAuth";

const allowedActions = new Set(["add_jlds_project", "update_jlds_project", "delete_jlds_project"]);

function getWordPressMutationSecret() {
  return (
    process.env.WORDPRESS_MUTATION_SECRET ||
    process.env.PROJECT_DASHBOARD_SECRET ||
    process.env.PROJECT_DASHBOARD_PASSWORD ||
    ""
  );
}

export async function POST(request: Request) {
  try {
    if (!(await isProjectDashboardAuthenticated())) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const action = String(formData.get("action") || "");
    const mutationSecret = getWordPressMutationSecret();

    if (!allowedActions.has(action)) {
      return NextResponse.json({ message: "Unsupported dashboard action" }, { status: 400 });
    }

    if (mutationSecret) {
      formData.set("jlds_dashboard_secret", mutationSecret);
    }

    const response = await fetch(`${getWordPressUrl()}/wp-json/janet/v1/projects/mutate`, {
      method: "POST",
      headers: mutationSecret ? { "x-jlds-dashboard-secret": mutationSecret } : undefined,
      body: formData
    });

    const text = await response.text();

    try {
      return NextResponse.json(JSON.parse(text), { status: response.ok ? 200 : response.status });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: text || "WordPress returned an invalid response"
        },
        { status: response.ok ? 502 : response.status }
      );
    }
  } catch (error) {
    console.error("Project dashboard mutation failed", error);
    return NextResponse.json(
      {
        success: false,
        message: "Upload failed before it reached WordPress. Please try a smaller image or fewer images."
      },
      { status: 500 }
    );
  }
}
