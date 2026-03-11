import react from '@vitejs/plugin-react';
//@ts-ignore
import path from 'path';
import { AliasOptions, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import viteSvgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

//@ts-ignore
const root = path.resolve(__dirname, 'src');

export default defineConfig({
	plugins: [
		react({ jsxRuntime: 'automatic' }),
		viteSvgr(),
		viteTsconfigPaths(),
		dts({ insertTypesEntry: true, exclude: ['src/storybook/**/*.stories.{ts,tsx}', 'src/test/**/*.test.{ts,tsx}'] }),
		cssInjectedByJsPlugin(),
	],
	resolve: {
		alias: {
			'@': root,
		} as AliasOptions,
	},
	build: {
		lib: {
			entry: './src/index.ts',
			name: 'itsa-fe-components',
			fileName: format => `itsa-fe-components.${format}.js`,
			formats: ['es', 'cjs', 'umd'],
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
			output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } },
		},
	},
});
