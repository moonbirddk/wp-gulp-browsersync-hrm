var path = require('path'),
    webpack = require('webpack'),
    WriteFilePlugin = require('write-file-webpack-plugin'),
    { PRODUCTION, HOT, HOST, PORT, THEME_NAME, FILES, PATHS } = require('./env.config');


module.exports = {
  
	entry: getEntry(),

  output: getOutput(),
  
  devtool: PRODUCTION ? false : 'inline-source-map',
  
  target: 'web',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: PATHS.src(),
        use: getJsLoaders()
      },
    ]
  },
  
  plugins: getPlugins()
  
};

function getPlugins(){
  if (PRODUCTION) {
    return [ 
      new webpack.optimize.UglifyJsPlugin({ 
        mangle: true, 
        sourcemap: false, 
        comments: false 
      })
    ]
  } else if (HOT) {
    return [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new WriteFilePlugin()
    ]
  }
}

function unipath(base) {
  return function join() {
    const _paths = [base].concat(Array.from(arguments));
    return path.resolve(path.join.apply(null, _paths));
  }
}

function getEntry() {
  var entry = {};
  entry.main = [FILES.inputJs];
  if (HOT) entry.main.push('webpack-hot-middleware/client?noInfo=true&reload=true');
  return entry;
}

function getOutput(){
  if (HOT) {
    return {
      path: PATHS.compiled(),
      publicPath: PRODUCTION ? '/' : `http://${HOST}:${PORT}/wp-content/themes/${THEME_NAME}/`,
      filename: FILES.outputJs,
      sourceMapFilename: '[file].map',
    }
  } else {
    return {
      path: PATHS.compiled(),
      filename: FILES.outputJs,
    }
  }
}

function getJsLoaders() {
  let JsLoaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          ["env", { "modules": false }]
        ]
      }
    }
  ]
  if (HOT) JsLoaders.push({ loader: 'webpack-module-hot-accept' })
  return JsLoaders
}