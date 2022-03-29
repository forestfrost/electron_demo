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
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.electron.app",
        productName: "工作台",
        copyright: "Copyright © 2022",
        win: {
          icon: "./public/appIcon.ico",
          target: [
            {
              target: "nsis",
              arch: [
                "x64", //64位
                "ia32", //32位
              ],
            },
          ],
        },
        nsis: {
          oneClick: false, //一键安装
          language: "2052", //安装语言
          perMachine: true, //应用所有用户
          allowToChangeInstallationDirectory: true, //用户可以选择路径
        },
      },
    },
  },
});
