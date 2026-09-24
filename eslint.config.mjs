import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
	...nextVitals,
	...nextTs,
	{
		files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
		// eslint-plugin-react's version auto-detect calls context.getFilename(),
		// which ESLint 10 removed. Pinning the version skips that code path.
		settings: { react: { version: "19.3" } },
		rules: {
			"@next/next/no-page-custom-font": "off",
			// React Compiler rules new in eslint-config-next 16. They flag existing
			// mount/hydration patterns; warn until those components are refactored.
			"react-hooks/set-state-in-effect": "warn",
			"react-hooks/refs": "warn",
			"react-hooks/incompatible-library": "warn",
		},
	},
	{
		// CommonJS files.
		files: ["server.js", "tailwind.config.js"],
		rules: { "@typescript-eslint/no-require-imports": "off" },
	},
	globalIgnores([
		".next/**",
		"out/**",
		"build/**",
		"next-env.d.ts",
		"public/sw.js",
		"public/sw-custom.js",
		"public/workbox-*.js",
	]),
]);
