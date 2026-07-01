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

export const fallbackProjects: Project[] = [
  {
    id: 9001,
    category: "commercial",
    categoryLabel: "COMMERCIAL",
    title: "Tea Authority",
    description:
      "Design firm that specializes in space planning and creating beautiful, functional spaces that reflect our clients' unique style. Our team of experienced and talented designers has a deep understanding of the latest trends and",
    images: [
      { url: "/images/projects/tea-1.png", alt: "Tea Authority interior" },
      { url: "/images/projects/tea-2.png", alt: "Tea Authority dining interior" }
    ],
    createdAt: null
  },
  {
    id: 9002,
    category: "residential",
    categoryLabel: "RESIDENTIAL",
    title: "Dan's Deli",
    description:
      "Design firm that specializes in space planning and creating beautiful, functional spaces that reflect our clients' unique style. Our team of experienced and talented designers has a deep understanding of the latest trends and",
    images: [{ url: "/images/projects/dan.png", alt: "Dan's Deli interior" }],
    createdAt: null
  }
];

type GetProjectsOptions = {
  includeFallback?: boolean;
};

export async function getProjects(options: GetProjectsOptions = {}): Promise<Project[]> {
  const includeFallback = options.includeFallback ?? true;
  const endpoint = `${getWordPressUrl()}/wp-json/janet/v1/projects`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Projects request failed with ${response.status}`);
    }

    const data = (await response.json()) as ProjectsResponse;
    const projects = Array.isArray(data.projects) ? data.projects : [];
    return projects.length > 0 || !includeFallback ? projects : fallbackProjects;
  } catch (error) {
    console.error("Unable to load WordPress projects", error);
    return includeFallback ? fallbackProjects : [];
  }
}
