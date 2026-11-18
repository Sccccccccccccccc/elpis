const webpack = require('webpack');
const express = require('express');
const path = require('path');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

// 从 webpack.dev.js 中获取 webpack 配置 和 devServer 配置
const { webpackConfig, DEV_SERVER_CONFIG } = require('./config/webpack.dev.js');

const app = express();
const compiler = webpack(webpackConfig);

// 指定静态文件目录
app.use( express.static( path.join(__dirname, '../public/dist') ) );

// 引用 webpack-dev-middleware 中间件 （监控文件改动）
app.use(devMiddleware(compiler, {
    // 落地文件
    writeToDisk: (filePath) => { return filePath.endsWith('tpl') },

    // 资源路径
    publicPath: webpackConfig.output.publicPath,

    // headers 配置
    headers: {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers' : 'X-Requested-With, content-type, Authorization',
    },

    // 打印信息
    stats: {
      colors: true,
    }
}));

// 引用 webpack-hot-middleware 中间件 （热更新）
app.use(hotMiddleware(compiler, {
  path: `${ DEV_SERVER_CONFIG.HMR_PATH }`,
  log: () => {},
}))

const port = DEV_SERVER_CONFIG.PORT;
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
})

// 静态文件目录