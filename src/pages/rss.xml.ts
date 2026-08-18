import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
	const posts = await getCollection('blog');
	const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

	return rss({
		title: 'Bexley Watchdog',
		description: 'Reviews on roofers, plumbers, and tradesmen in Erith and Bexley.',
		site: context.site!,
		items: sorted.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.excerpt,
			link: `/blog/${post.data.slug}/`,
			categories: post.data.tags,
		})),
		customData: '<language>en-gb</language>',
	});
};
