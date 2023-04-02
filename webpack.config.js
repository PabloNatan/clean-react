const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/main/index.tsx',
  output: {
    path: path.join(__dirname, 'public/js'),
    publicPath: '/public/js',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'scss'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 8192, // The maximum file size in bytes for inline loading
              encoding: 'base64' // The encoding type for inline loading
            }
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: true
    },
    static: {
      directory: './public'
    }
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [new CleanWebpackPlugin()]
}
