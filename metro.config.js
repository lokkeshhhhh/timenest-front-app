const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// TEMP DIAGNOSTIC ONLY — reverted before task completion.
config.resolver.unstable_conditionsByPlatform.web = ["browser", "react-native"];

module.exports = withNativeWind(config, { input: "./global.css" });
