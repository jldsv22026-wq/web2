import { getWordPressUrl } from "@/lib/gallery";

export type ProjectImage = {
  url: string;
  alt: string;
};

export type Project = {
  id: number;
  category: string;
  categoryLabel: string;
  title: string;
  description: string;
  images: ProjectImage[];
  createdAt: string | null;
};

type ProjectsResponse = {
  projects: Project[];
  count: number;
};

export async function getProjects(): Promise<Project[]> {
  const endpoint = `${getWordPressUrl()}/wp-json/janet/v1/projects`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Projects request failed with ${response.status}`);
    }

    const data = (await response.json()) as ProjectsResponse;
    return Array.isArray(data.projects) ? data.projects : [];
  } catch (error) {
    console.error("Unable to load WordPress projects", error);
    return [];
  }
}
