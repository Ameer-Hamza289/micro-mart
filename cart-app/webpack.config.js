module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'micro-mart-cart.js',
    libraryTarget: 'system',
  },
  devServer: {
    port: 8084,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  externals: ['@micro-mart/shared-utils'],
};