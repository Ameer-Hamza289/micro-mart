module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'micro-mart-header.js',
    libraryTarget: 'system',
  },
  devServer: {
    port: 8081,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  externals: ['@micro-mart/shared-utils'],
};