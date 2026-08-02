const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// zustand's package.json "exports" map resolves to its ESM build
// (esm/middleware.mjs) for web even with the default web condition set to
// ["browser"] (zustand doesn't declare a "browser" condition, and Metro's
// exports resolution falls through to "import" rather than "default" here).
// That ESM file has a raw `import.meta.env` guard in its devtools submodule,
// and Metro always serves the web bundle as a classic script (no
// type="module"), so it's a parse-time SyntaxError there — breaking every web
// build, not just local dev. Disabling package-exports resolution routes it
// through resolverMainFields ("browser"/"main") to zustand's plain CJS build
// instead, which has no import.meta usage.
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: "./global.css" });
