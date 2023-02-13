import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

//tODO remove csrf when live
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$lib: './src/lib',
			$db: './src/db',
		},
		csrf: {
			checkOrigin: false,
		},
	},
	preprocess: vitePreprocess()
};

export default config;
