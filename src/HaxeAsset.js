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
      exec("haxe build.hxml", (err, stdout, stderr) => {
        if (err) {
          reject(stderr);
        } else {
          resolve(".cache/haxe.js");
        }
      });
    });
  }

  readFile(path) {
    return new Promise(function(resolve, reject) {
      fs.readFile(path, "utf8", function(err, contents) {
        if(err) {
          reject(err);
        }
        else {
          resolve(contents);
        }
      });
    });
  }

  async generate() {
    var path = await this.compileHaxe([
      "lib/Towser/src",
      "lib/Perdita/src/haxe",
      "app/editor",
      "lib/Nosey/src"
    ]);
    var code = await this.readFile(path);

    let parts = [
      {
        type: "js",
        value: code
      }
    ];

    return parts;
  }
};
