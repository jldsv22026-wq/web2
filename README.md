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

For the footer contact form, create a Resend API key and set:

```text
RESEND_API_KEY=your_resend_api_key
CONTACT_FROM_EMAIL=Website <contact@your-verified-domain.com>
```

`CONTACT_FROM_EMAIL` must use a sender/domain verified in Resend. For the client demo, all inquiry emails route to:

```text
jldsv22026@gmail.com
```

Before launch, update `app/api/contact/route.ts` to route by dropdown choice:

```text
GENERAL INQUIRY -> info@janetleedesignstudio.com
PARTNERS INQUIRY -> partners@janetleedesignstudio.com
CAREERS INQUIRY -> careers@janetleedesignstudio.com
```

The customer also receives a confirmation receipt at the email address they submit.

## Routes

- `/` - main studio website
- `/projects` - portfolio/gallery page from WordPress Headless Gallery
- `/api/contact` - footer contact form email endpoint
