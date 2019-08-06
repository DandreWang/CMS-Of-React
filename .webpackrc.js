const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },


  publicPath: '/',

  //sidlu环境 开始
  // outputPath:path.resolve(__dirname, 'sidlu_dist'),
  //sidlu环境 结束

  // https://github.com/ant-design/ant-design-pro/issues/1536
  disableDynamicImport: true,//仅生成一个js文件
  hash: true,
};
