const { defineConfig } = require("@vue/cli-service");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const { resolve } = require("path");
const pathResolve = (dir) => {
  return resolve(__dirname, ".", dir);
};
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      require("unplugin-vue-components/webpack")({
        resolvers: [ElementPlusResolver()],
        dts: pathResolve("types/components.d.ts"),
      }),
      require("unplugin-auto-import/webpack")({
        imports: ["vue"],
        resolvers: [ElementPlusResolver()],
        dts: pathResolve("types/auto-imports.d.ts"),
      }),
    ],
  },
  publicPath: "./",
  pages: {
    main: {
      entry: "src/main.ts",
      template: "public/index.html",
      filename: "index.html",
      title: "工作台",
    },
    remind: {
      entry: "src/remind.ts",
      template: "public/remind.html",
      filename: "remind.html",
      title: "提示",
    },
  },
});
