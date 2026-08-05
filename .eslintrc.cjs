module.exports = {
	root: true,
	env: { browser: true, es2020: true },

	parser: '@typescript-eslint/parser',

	parserOptions: {
		project: './tsconfig.eslint.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},

	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:storybook/recommended',
	],

	ignorePatterns: ['dist', '.eslintrc.cjs'],

	plugins: ['react-refresh'],

	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'@typescript-eslint/no-non-null-assertion': 'error',
		'@typescript-eslint/strict-boolean-expressions': 'error',
	},
};