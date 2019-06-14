package;

import haxe.Json;
import haxe.io.Path;
import haxe.macro.Context;
import haxe.macro.Expr;
import haxe.macro.Type;
import sys.FileSystem;
import sys.io.File;

class Dependencies {

	public static function build() : Array<Field> 
    {
		var fields:Array<Field> = Context.getBuildFields();

		if(fields.length > 0) {
			var posInfos = Context.getPosInfos(fields[0].pos);
			_modules.push(posInfos.file);
		}

		if(!_hasSaved) {
			_hasSaved = true;
			Context.onAfterGenerate(function() {
				File.saveContent(".cache/haxe-dependencies.json", Json.stringify(_modules));
			});
		}

		return fields;
	}

	private static var _modules :Array<String> = [];
	private static var _hasSaved :Bool = false;
}
