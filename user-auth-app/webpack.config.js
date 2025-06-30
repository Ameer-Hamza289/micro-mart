module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'micro-mart-user-auth.js',
    libraryTarget: 'system',
  },
  devServer: {
    port: 8085,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  externals: ['@micro-mart/shared-utils'],
};