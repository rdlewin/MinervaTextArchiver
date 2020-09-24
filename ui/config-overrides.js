const { injectBabelPlugin } = require("react-app-rewired");
const rewireMobX = require("react-app-rewire-mobx");

module.exports = function override(config, env) {
    config = injectBabelPlugin("babel-plugin-styled-components", config);
    config = rewireMobX(config, env);

    return config;
};

const {
    override,
    disableEsLint,
    addDecoratorsLegacy,
    fixBabelImports,
} = require("customize-cra");

module.exports = override(
    disableEsLint(),
    addDecoratorsLegacy(),
    fixBabelImports("react-app-rewire-mobx", {
    libraryDirectory: "",
    camel2DashComponentName: false
}),
);