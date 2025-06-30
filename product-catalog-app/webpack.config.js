module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'micro-mart-product-catalog.js',
    libraryTarget: 'system',
  },
  devServer: {
    port: 8082,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  externals: ['@micro-mart/shared-utils'],
};