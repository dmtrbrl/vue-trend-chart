module.exports = {
  entry: "./docs/app.js",
  output: {
    dir: "./docs-dist"
  },
  configureWebpack(config) {
    config.resolve.alias["vue-trend-chart"] = "../src";
    return config;
  }
};
