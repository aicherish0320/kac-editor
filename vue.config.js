const BundleAnalyzerPlugin =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  publicPath: './',
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
