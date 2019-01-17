module.exports = {
  entry: "./demo/app.js",
  output: {
    dir: "./demo-dist"
  },
  configureWebpack(config) {
    config.resolve.alias["vue-trend-chart"] = "../src";
    return config;
  }
};
