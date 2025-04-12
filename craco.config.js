module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable source maps in production
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.devtool = false;
      }

      // Ignore source map warnings
      webpackConfig.ignoreWarnings = [
        /Failed to parse source map/,
        /source-map-loader/,
      ];

      return webpackConfig;
    },
  },
};
