require('dotenv').config();
const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const nunjucks = require('nunjucks');
const { default: QumraClient } = require('qumra-client');
const browserSync = require('browser-sync').create();

const client = new QumraClient({
  secretKey: process.env.secretKey,
  version: 'v1'
});

const app = express();
const port = 3000;

// إعداد Webpack
const compiler = webpack(webpackConfig);

// استخدم Webpack Dev Middleware لتقديم ملفات البناء
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: 'errors-only',
}));

// استخدم Webpack Hot Middleware لتحديث الملفات بشكل مباشر
app.use(webpackHotMiddleware(compiler));

// إعداد Nunjucks كمحرك قوالب
nunjucks.configure(path.join(__dirname, 'src', 'views'), {
  autoescape: true,
  express: app,
  watch: true,
});
app.set('view engine', 'njk');

// تقديم الملفات الثابتة من مجلد dist
app.use(express.static(path.join(__dirname, 'dist')));

// استخدام QumraClient لعرض المحتوى
app.get('*', async (req, res) => {
  try {
    await client.render(req, res);
  } catch (error) {
    console.error("Error rendering with QumraClient:", error);
    res.status(500).send("Internal Server Error");
  }
});

// تشغيل السيرفر مع إعداد BrowserSync لمراقبة التعديلات
app.listen(port, () => {
  // console.log(`Server running at http://localhost:${port}`);

  // إعداد BrowserSync لمراقبة التعديلات وتحديث المتصفح
  browserSync.init({
    proxy: `http://localhost:${port}`,
    files: ['dist/**/*.*', 'src/**/*.*'], // راقب التغييرات في مجلد dist والقوالب
    port: 3000,
    open: false, // فتح المتصفح تلقائيًا
    notify: false // منع إشعارات التحديث
  });
}); 