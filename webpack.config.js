const path = require('path');
const {UserscriptPlugin} = require('webpack-userscript');
const dev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: 'production',
  entry: './src/scriptify-main.js',
  output: {
    filename: dev ? 'scriptify.dev.user.js' : 'scriptify.pub.user.js',
    path: path.resolve(__dirname),
  },
  plugins: [
    new UserscriptPlugin({
      headers: path.join(__dirname, './src/meta.json'),
      metajs: false,
    }),
  ],
  optimization: {
    minimize: false,
  },
};
