module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
      ? '/vue2money/dist'
      : '/',

  transpileDependencies: [
    'vuetify'
  ]
}
