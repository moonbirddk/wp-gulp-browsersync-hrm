# wp-gulp-browersync-hrm
Wordpress Start Theme with a Gulp and BrowserSync based workflow and Hot Module Replacement via Webpack.

Install dependencies 

```
yarn install
```

All variables are set using the file .env.config.js

```
module.exports = {
  PRODUCTION: false,
  HOT: true,
  THEME_NAME: 'YOUR_THEME_NAME',
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
}
```

Update style.css with your projects theme name

```
/*   
Theme Name: YOUR_THEME_NAME
*/
```

When variables are set run:

```
gulp serve
```