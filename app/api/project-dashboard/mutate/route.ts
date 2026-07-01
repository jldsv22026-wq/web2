import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/gallery";
import { isProjectDashboardAuthenticated } from "@/lib/projectAuth";

const allowedActions = new Set(["add_jlds_project", "update_jlds_project", "delete_jlds_project"]);

export async function POST(request: Request) {
  if (!(await isProjectDashboardAuthenticated())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const action = String(formData.get("action") || "");

  if (!allowedActions.has(action)) {
    return NextResponse.json({ message: "Unsupported dashboard action" }, { status: 400 });
  }

  const response = await fetch(`${getWordPressUrl()}/wp-admin/admin-ajax.php`, {
    method: "POST",
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
}
