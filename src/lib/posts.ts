import type { CollectionEntry } from 'astro:content';

// Falls back to the first image in the post body when no featuredImage is
// set in frontmatter, so older migrated posts (which predate that field)
// still get a card thumbnail / OG image.
export function getHeroImage(post: CollectionEntry<'blog'>): string | undefined {
	if (post.data.featuredImage) return post.data.featuredImage;
	const match = post.body?.match(/<img[^>]+src="(\/blog-media\/[^"]+)"/);
	return match?.[1];
}
