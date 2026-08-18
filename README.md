# Bexley Watchdog

Consumer reviews on roofers, plumbers, and tradesmen operating in Erith and Bexley, UK. The site exists to help local residents share and check experiences with local trade businesses -- both good and bad -- and avoid rogue traders and cowboy builders.

Live at [bexleywatchdog.co.uk](https://bexleywatchdog.co.uk).

## Why this migration

The site used to run on WordPress.com (`bexleywatchdog.wordpress.com`). This repo replaces that with a static [Astro](https://astro.build) site with no server-side moving parts -- nothing to patch, nothing to host beyond static file serving, nothing to compromise.

All content was pulled via the public WordPress.com REST API (no authentication needed) and converted into local Markdown files:

- **12 posts**, fetched from `.../sites/bexleywatchdog.wordpress.com/posts/?number=20`, each carrying its title, publish date, full HTML body, and excerpt. Titles had their HTML entities decoded (e.g. `&#8211;` &rarr; `&ndash;`); post bodies keep their original HTML as published.
- **1 page** ("About"), fetched with `?type=page`.
- Embedded images hosted on WordPress (`*.wp.com` and `bexleywatchdog.wordpress.com`/`bexleywatchdog.co.uk` URLs) were downloaded and saved under `public/blog-media/YYYY/MM/` (year/month taken from the post's publish date), with the post body rewritten to reference the local copy instead of hotlinking WordPress. 14 images across 2 posts were migrated this way.
- None of the 12 posts had real categories or tags set (WordPress reported all of them as "Uncategorized" with no tags), so no taxonomy was invented -- `categories`/`tags` are empty arrays in the migrated frontmatter and can be filled in by hand later if useful.

## Stack

- [Astro](https://astro.build) (static output, no server runtime)
- Content collection for blog posts (`src/content/blog/`, schema in `src/content.config.ts`) -- each post is a Markdown file with `title`, `date`, `slug`, `categories`, `tags`, and `excerpt` frontmatter; the body is the original post HTML with local image paths
- Post images live in `public/blog-media/YYYY/MM/`
- Deployed via GitHub Actions to GitHub Pages (see [.github/workflows/deploy.yml](.github/workflows/deploy.yml))

## Development

```bash
npm install
npm run dev
```

```bash
npm run build      # static build to dist/
npm run preview    # preview the production build locally
```

## Adding content

No CMS, no database -- new posts are just Markdown files committed to this repo.

### New blog post

```bash
npm run new-post -- "Post Title" "Tag1,Tag2"
```

Creates `src/content/blog/YYYY-MM-DD-slug.md` with frontmatter pre-filled (title, today's date, a slug derived from the title, and any tags you pass). Tags are freeform for this site -- there's no fixed taxonomy to match.

### Adding an image

```bash
npm run add-image -- /path/to/photo.jpg my-post-slug
```

Auto-rotates, resizes (max 1600px wide, never upscales), and compresses the image into `public/blog-media/YYYY/MM/` (current year/month), then prints the exact Markdown snippet to paste into the post and a `featuredImage:` frontmatter suggestion to use as the post's thumbnail/OG image. Requires the `sharp` package (already a dependency).

### Before pushing

```bash
npm run build       # confirm the site builds cleanly
```

Pushing to `main` triggers the GitHub Actions workflow, which builds the site and deploys `dist/` to GitHub Pages.
