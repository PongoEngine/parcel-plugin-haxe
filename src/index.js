const exec = require("child_process").exec;

exec('haxe --wait 6122');
module.exports = function(bundler) {
    bundler.addAssetType('hx', require.resolve('./HaxeAsset.js'))
}