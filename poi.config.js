module.exports = {
  entry: "./docs/app.js",
  output: {
    dir: "./docs-dist",
    publicUrl: "./"
  },
  configureWebpack(config) {
    config.resolve.alias["vue-trend-chart"] = "../src";
    return config;
  }
};
