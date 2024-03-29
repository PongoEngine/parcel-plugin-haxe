const { Asset } = require("parcel-bundler");
const exec = require("child_process").exec;
var fs = require("fs");

module.exports = class HaxeAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = "js";
  }

  compileHaxe() {
    return new Promise(function(resolve, reject) {
      exec(
        `haxe --connect 6122 --macro "addGlobalMetadata('', '@:build(Dependencies.build())')" -D source-map-content -debug -cp ${__dirname} build.hxml -js .cache/haxe.js`,
        (err, stdout, stderr) => {
          if (err) {
            reject(stderr);
          } else {
            resolve("complete");
          }
        }
      );
    });
  }

  readFile(path) {
    return new Promise(function(resolve, reject) {
      fs.readFile(path, "utf8", function(err, contents) {
        if (err) {
          reject(err);
        } else {
          resolve(contents);
        }
      });
    });
  }

  async generate() {
    await this.compileHaxe();
    var source = await this.readFile(".cache/haxe.js");
    var sourceMap = await this.readFile(".cache/haxe.js.map");

    var dependencies = JSON.parse(
      await this.readFile(".cache/haxe-dependencies.json")
    );
    dependencies.forEach(dep => {
      this.addDependency(dep, { includedInParent: true });
    });

    let parts = [
      {
        type: "js",
        value: source,
        map: JSON.parse(sourceMap)
      }
    ];

    return parts;
  }
};
