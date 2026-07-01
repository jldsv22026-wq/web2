import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/gallery";
import { isProjectDashboardAuthenticated } from "@/lib/projectAuth";

const allowedActions = new Set(["add_jlds_project", "update_jlds_project", "delete_jlds_project"]);

type WordPressMutationResult = {
  body: unknown;
  status: number;
  ok: boolean;
  text: string;
};

function getWordPressMutationSecret() {
  return (
    process.env.WORDPRESS_MUTATION_SECRET ||
    process.env.PROJECT_DASHBOARD_SECRET ||
    process.env.PROJECT_DASHBOARD_PASSWORD ||
    ""
  );
}

function cloneFormData(formData: FormData) {
  const nextFormData = new FormData();

  formData.forEach((value, key) => {
    nextFormData.append(key, value);
  });

  return nextFormData;
}

async function readWordPressResponse(response: Response): Promise<WordPressMutationResult> {
  const text = await response.text();
  let body: unknown = text;

  try {
    body = JSON.parse(text);
  } catch {
    body = {
      success: false,
      message: text || "WordPress returned an invalid response"
    };
  }

  return {
    body,
    status: response.ok ? 200 : response.status,
    ok: response.ok,
    text
  };
}

function isMissingRestRoute(result: WordPressMutationResult) {
  if (result.status !== 404) {
    return false;
  }

  if (typeof result.body === "object" && result.body !== null) {
    const body = result.body as { code?: unknown; message?: unknown };
    return body.code === "rest_no_route" || body.message === "No route was found matching the URL and request method.";
  }

  return result.text.includes("No route was found matching the URL and request method");
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
      body: cloneFormData(formData)
    });

    let result = await readWordPressResponse(response);

    if (isMissingRestRoute(result)) {
      const fallbackResponse = await fetch(`${getWordPressUrl()}/wp-admin/admin-ajax.php`, {
        method: "POST",
        body: cloneFormData(formData)
      });

      result = await readWordPressResponse(fallbackResponse);
    }

    return NextResponse.json(result.body, { status: result.ok ? 200 : result.status });
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
