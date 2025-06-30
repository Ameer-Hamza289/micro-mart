module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'micro-mart-shell.js',
    libraryTarget: 'system',
  },
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};