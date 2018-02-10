/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["children#1"] = new Fleur.Function("http://expath.org/ns/file", "file:children",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			if (err) {
				callback(err);
				return;
			}
			if (stats.isFile()) {
				callback(null);
				return;
			}
			global.fs.readdir(path, function(err, files) {
				if (err) {
					callback(err);
					return;
				}
				if (files.length === 0) {
					callback(null);
					return;
				}
				path = global.path.resolve(path);
				files = files.map(function(file) {
					return global.path.join(path, file);
				});
				if (files.length === 1) {
					callback(files[0]);
					return;
				}
				callback(files);
			});
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_string, occurence: "*"});