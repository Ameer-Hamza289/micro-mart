module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'micro-mart-shared-utils.js',
    libraryTarget: 'system',
  },
  devServer: {
    port: 8086,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  externals: ['rxjs'],
};