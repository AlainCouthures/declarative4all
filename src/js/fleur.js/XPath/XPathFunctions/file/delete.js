/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["delete#1"] = new Fleur.Function("http://expath.org/ns/file", "file:delete",
	function(path, callback) {
		return Fleur.XPathFunctions_file["delete#2"].jsfunc(path, false, callback);
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.EmptySequence});

Fleur.XPathFunctions_file["delete#2"] = new Fleur.Function("http://expath.org/ns/file", "file:delete",
	function(path, recursive, callback) {
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
				global.fs.unlink(path, function(err) {
					if (err) {
						callback(err);
						return;
					}
					callback(null);
				});
			} else {
				if (recursive) {
					var rdel = function(paths, cb) {
						var cpath = paths.shift();
						var nextdel = function(err) {
							if (err) {
								callback(err);
								return;
							}
							if (paths.length !== 0) {
								rdel(paths, cb);
							} else {
								cb(null);
							}
						};
						global.fs.stat(cpath, function(err, stats) {
							if (err) {
								callback(err);
								return;
							}
							if (stats.isFile()) {
								//console.log("unlink " + cpath);nextdel();
								global.fs.unlink(cpath, nextdel);
								return;
							}
							global.fs.readdir(cpath, function(err, files) {
								if (err) {
									callback(err);
									return;
								}
								if (files.length === 0) {
									//console.log("rmdir " + cpath);nextdel();
									global.fs.rmdir(path, nextdel);
									return;
								}
								rdel(files.map(function(file) {
										return global.path.join(cpath, file);
									}), function(err) {
									if (err) {
										callback(err);
										return;
									}
									//console.log("rmdir " + cpath);nextdel();
									global.fs.rmdir(cpath, nextdel);
								});
								return;
							});
						});
					};
					rdel([path], callback);
					return;
				}
				global.fs.readdir(path, function(err, files) {
					if (err) {
						callback(err);
						return;
					}
					if (files.length === 0) {
						global.fs.rmdir(path, function(err) {
							if (err) {
								callback(err);
								return;
							}
							callback(null);
						});
						return;
					}
					callback(null);
				});
			}
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_boolean}], false, true, {type: Fleur.EmptySequence});