// typescript-eslint doesn't support TypeScript 7 yet (it needs the JS
// compiler API, which TS 7's native compiler doesn't ship). Give the
// typescript-eslint packages the TS 6 API via @typescript/typescript6 while the
// app itself, `next build` and `tsc` stay on TS 7.
//
// Remove once typescript-eslint supports TS >= 7:
// https://github.com/typescript-eslint/typescript-eslint/issues/10940

const TS6 = "npm:@typescript/typescript6@^6.0.2";

const usesTsApi = (name) =>
	name === "typescript-eslint" ||
	name === "ts-api-utils" ||
	name.startsWith("@typescript-eslint/");

function readPackage(pkg) {
	if (usesTsApi(pkg.name) && (pkg.peerDependencies?.typescript || pkg.dependencies?.typescript)) {
		delete pkg.peerDependencies?.typescript;
		pkg.dependencies = { ...pkg.dependencies, typescript: TS6 };
	}
	return pkg;
}

module.exports = { hooks: { readPackage } };
