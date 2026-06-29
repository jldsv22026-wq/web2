# Janet Lee Design Studio Next.js Frontend

Headless Next.js frontend for Janet Lee Design Studio.

Built with Next.js, TypeScript, Tailwind CSS, and custom CSS migrated from the WordPress theme.

WordPress remains the CMS for gallery/portfolio media through:

```text
/wp-json/janet/v1/gallery
```

## Local Setup

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.local.example`:

```text
WORDPRESS_URL=http://janet-lee-v2.local
```

## Vercel Environment Variable

Set this in Vercel:

```text
WORDPRESS_URL=https://janetleedesignstudio.com
```

## Routes

- `/` - main studio website
- `/projects` - portfolio/gallery page from WordPress Headless Gallery
