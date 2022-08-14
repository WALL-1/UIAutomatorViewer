module.exports = {
  devServer: {
    proxy: 'http://localhost:5000'
  },
  publicPath: process.env.NODE_ENV === 'production'
  ? '../'
  : '/'
}