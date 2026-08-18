#!/usr/bin/env node
// Scaffolds a new blog post: src/content/blog/YYYY-MM-DD-slug.md
// Usage: npm run new-post "Post Title" ["Tag1,Tag2"]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'src', 'content', 'blog');

const [, , titleArg, tagsArg] = process.argv;

if (!titleArg) {
	console.error('Usage: npm run new-post "Post Title" ["Tag1,Tag2"]');
	process.exit(1);
}

function slugify(title) {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

const today = new Date().toISOString().slice(0, 10);
const slug = slugify(titleArg);
const filename = `${today}-${slug}.md`;
const filepath = path.join(BLOG_DIR, filename);

if (fs.existsSync(filepath)) {
	console.error(`Already exists: ${filepath}`);
	process.exit(1);
}

const tags = tagsArg
	? tagsArg.split(',').map((t) => t.trim()).filter(Boolean)
	: [];

const tagsYaml = tags.length ? `[${tags.map((t) => `"${t}"`).join(', ')}]` : '[]';

const template = `---
title: "${titleArg.replace(/"/g, '\\"')}"
date: ${today}
slug: "${slug}"
categories: []
tags: ${tagsYaml}
excerpt: "One or two sentences summarising the post -- this shows up on the blog index and RSS feed."
featuredImage: ""
---

<!--
  QUICK REFERENCE -- delete this comment block once you're done.

  Images:
    First, run: npm run add-image -- /path/to/photo.jpg ${slug}
    It resizes/compresses the image, drops it in public/blog-media/,
    and prints the exact markdown line to paste below, e.g.:
      ![Alt text describing the image](/blog-media/${today.slice(0, 4)}/${today.slice(5, 7)}/photo.jpg)
    Also paste that same path into "featuredImage" above (without
    the alt text) if this should be the post's thumbnail/hero image.

  Formatting:
    **bold**            *italic*            \`inline code\`
    [link text](https://example.com)
    > A blockquote for pulling out a quote or aside.
    - bullet list
    1. numbered list

    Code block with syntax highlighting:
    \`\`\`python
    print("hello")
    \`\`\`

    Table:
    | Column A | Column B |
    | --- | --- |
    | value | value |
-->

Write your post here.
`;

fs.writeFileSync(filepath, template);
console.log(`Created: ${path.relative(process.cwd(), filepath)}`);
console.log(`Slug: ${slug}`);
if (tags.length) console.log(`Tags: ${tags.join(', ')}`);
