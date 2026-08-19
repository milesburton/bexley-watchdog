// @ts-check
import sitemap from '@astrojs/sitemap';
import { execSync } from 'node:child_process';
import { defineConfig } from 'astro/config';

function safeGit(command) {
	try {
		return execSync(command, { encoding: 'utf8' }).trim();
	} catch {
		return 'unknown';
	}
}

const commitHash = safeGit('git rev-parse --short HEAD');
const commitDate = safeGit('git log -1 --format=%cI');

// https://astro.build/config
export default defineConfig({
	site: 'https://bexleywatchdog.milesburton.com',
	integrations: [sitemap()],
	vite: {
		define: {
			__BUILD_COMMIT__: JSON.stringify(commitHash),
			__BUILD_DATE__: JSON.stringify(commitDate),
		},
	},
});
