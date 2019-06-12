module.exports = function(bundler) {
    bundler.addAssetType('hx', require.resolve('./HaxeAsset.js'))
  }