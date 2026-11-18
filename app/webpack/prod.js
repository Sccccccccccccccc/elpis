const webpack = require('webpack');

const webpackProdConfig = require('./config/webpack.prod.js');

console.log('\nbuilding...\n');

webpack(webpackProdConfig, (err, stats) => {
  if (err) {
    console.log('---[build error]---', err);
    return;
  }

  process.stdout.write(`${stats.toString({
    colors: true, // 是否在控制台显示颜色
    modules: false, // 是否在控制台显示模块
    children: false, // 是否在控制台显示子模块(子编译任务的信息)
    chunks: false, // 是否显示代码块信息
    chunkModules: true // 代码块中模块的信息
  })}`)

})
