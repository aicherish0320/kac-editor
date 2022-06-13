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
  }
}
