import { test, expect, type Locator } from '@playwright/test';

// Pixel snapshots can miss subtle misalignment when content lengths happen to
// be similar -- these checks assert row alignment directly, independent of
// how much text is in each card, so they catch the bug class regardless of
// content. Add a case here whenever a new multi-column card grid ships.
//
// Note: the homepage's "Latest Reports" list (.latest-card/.latest-thumb) and
// the blog index's post list (.post-card/.post-thumb, via PostCard.astro) are
// separate markup, not the same component -- both are checked here.

async function xPositions(locators: Locator[]): Promise<number[]> {
	const boxes = await Promise.all(locators.map((l) => l.boundingBox()));
	return boxes.map((b) => {
		if (!b) throw new Error('Element not visible/found for alignment check');
		return Math.round(b.x);
	});
}

function expectAligned(positions: number[], label: string, tolerancePx = 2) {
	const [first, ...rest] = positions;
	for (const x of rest) {
		expect(Math.abs(x - first), `${label}: expected all rows at the same X (got ${positions.join(', ')})`).toBeLessThanOrEqual(tolerancePx);
	}
}

test('blog index: post thumbnails align down the list', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 1200 });
	await page.goto('/blog/', { waitUntil: 'networkidle' });
	const thumbs = page.locator('.post-thumb');
	const count = await thumbs.count();
	expect(count).toBeGreaterThanOrEqual(2);
	// Thumbnails sit in a single-column list, so check left-edge (x) alignment
	// rather than y, which legitimately varies per row.
	const rows = Array.from({ length: Math.min(count, 5) }, (_, i) => thumbs.nth(i));
	expectAligned(await xPositions(rows), 'blog index post thumbnails');
});

test('homepage: latest report thumbnails align down the list', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 1200 });
	await page.goto('/', { waitUntil: 'networkidle' });
	const thumbs = page.locator('.latest-thumb');
	const count = await thumbs.count();
	expect(count).toBeGreaterThanOrEqual(2);
	const rows = Array.from({ length: Math.min(count, 5) }, (_, i) => thumbs.nth(i));
	expectAligned(await xPositions(rows), 'homepage latest report thumbnails');
});
