const path = require('path');

module.exports = {
  PRODUCTION: false,
  HOT: true,
  THEME_NAME: 'wp-gulp-browersync-hrm',
  PROXY_TARGET: 'localhost/YOUR_PROJECT_FOLDER/',
  HOST: 'localhost',
  PORT: 3000,
  FILES: {
    inputJs: './src/js/app.js',
    outputJs: 'app.js',
    inputSass: 'src/sass/app.sass',
    outputCss: 'css/',
  },
  PATHS: {
    src: unipath('src'),
    compiled: unipath(path.resolve(__dirname, 'js')),
    modules: unipath('node_modules'),
    base: unipath('.'),
    css: unipath('css'),
  }
};

function unipath(base) {
  return function join() {
    const _paths = [base].concat(Array.from(arguments));
    return path.resolve(path.join.apply(null, _paths));
  }
}
