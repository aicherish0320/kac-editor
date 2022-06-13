const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1DA57A'
          },
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        Object.assign(args[0].terserOptions.compress, {
          pure_funcs: ['console.log']
        })
        return args
      })
    }
  },
  configureWebpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    )

    if (process.env.NODE_ENV === 'development') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: true
        })
      )
    }
  }
}
