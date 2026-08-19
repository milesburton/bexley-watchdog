import { test, expect } from '@playwright/test';

// Pixel snapshots of each unique page template. Run `npx playwright test
// --update-snapshots` after an intentional visual change to accept the new
// baseline -- review the diff first, don't update blindly.
const TEMPLATES = [
	{ name: 'home', path: '/' },
	{ name: 'blog-index', path: '/blog/' },
	{ name: 'blog-post', path: '/blog/hello-world/' },
	{ name: 'about', path: '/about/' },
];

const VIEWPORTS = [
	{ name: 'desktop', width: 1280, height: 900 },
	{ name: 'mobile', width: 390, height: 844 },
];

for (const { name, path } of TEMPLATES) {
	for (const viewport of VIEWPORTS) {
		test(`${name} @ ${viewport.name}`, async ({ page }) => {
			await page.setViewportSize({ width: viewport.width, height: viewport.height });
			await page.goto(path, { waitUntil: 'networkidle' });
			// Freeze the theme so light/dark system-preference doesn't flip the baseline.
			await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
			// fullPage screenshots don't wait for below-the-fold loading="lazy"
			// images to finish decoding on their own -- force them to load by
			// scrolling the full page height first, otherwise long pages with
			// many lazy images (e.g. /blog/) can capture broken-image icons.
			await page.evaluate(async () => {
				const height = document.documentElement.scrollHeight;
				for (let y = 0; y < height; y += window.innerHeight) {
					window.scrollTo(0, y);
					await new Promise((resolve) => setTimeout(resolve, 30));
				}
				window.scrollTo(0, 0);
			});
			await page.waitForFunction(() =>
				Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0),
			);
			await expect(page).toHaveScreenshot(`${name}-${viewport.name}.png`, {
				fullPage: true,
				animations: 'disabled',
			});
		});
	}
}
