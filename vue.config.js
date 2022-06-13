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
  }
}
