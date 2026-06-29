export type GalleryImageSize = {
  url: string;
  width: number | null;
  height: number | null;
} | null;

export type GalleryImage = {
  id: number;
  title: string;
  alt: string;
  mime?: string;
  url: string;
  width: number | null;
  height: number | null;
  sizes: {
    thumbnail: GalleryImageSize;
    medium: GalleryImageSize;
    large: GalleryImageSize;
  };
};

type GalleryResponse = {
  images: GalleryImage[];
  count: number;
};

export function getWordPressUrl() {
  return (
    process.env.WORDPRESS_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    "http://janet-lee-v2.local"
  ).replace(/\/$/, "");
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const endpoint = `${getWordPressUrl()}/wp-json/janet/v1/gallery`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Gallery request failed with ${response.status}`);
    }

    const data = (await response.json()) as GalleryResponse;
    return Array.isArray(data.images) ? data.images : [];
  } catch (error) {
    console.error("Unable to load WordPress gallery", error);
    return [];
  }
}

export function findGalleryImageByFilename(images: GalleryImage[], filename: string) {
  const target = filename.toLowerCase();

  return images.find((image) => {
    const urlFilename = image.url.split("/").pop()?.toLowerCase();
    const titleFilename = image.title.toLowerCase();

    return urlFilename === target || titleFilename === target.replace(/\.[^.]+$/, "");
  });
}
