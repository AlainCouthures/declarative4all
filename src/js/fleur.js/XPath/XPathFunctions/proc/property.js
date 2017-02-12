/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_proc["property#1"] = new Fleur.Function("http://basex.org/modules/proc", "proc:property",
	function(pname) {
		switch (pname) {
			case "host-name":
				if (process) {
					return global.os.hostname();
				}
				return null;
			case "host-addresses":
				if (process) {
					var addrs = '';
					var interfs = global.os.networkInterfaces();
					for (var interf in interfs) {
						if (interfs.hasOwnProperty(interf)) {
							if (interfs[interf].length !== 0 && interfs[interf][0].mac !== "00:00:00:00:00:00") {
								if (addrs !== "" && interfs[interf].length !== 0) {
									addrs += " /";
								}
								if (interfs[interf].length !== 0) {
									if (addrs === "") {
										addrs = interfs[interf][0].mac;
									} else {
										addrs += " " + interfs[interf][0].mac;
									}
								}
								interfs[interf].forEach(function(e) {
									if (addrs === "") {
										addrs = e.address;
									} else {
										addrs += ' ' + e.address;
									}
								});
							}
						}
					}
					return addrs;
				}
				return null;
			case "host-engine":
				if (process) {
					var filename = global.path.basename(process.argv[1]);
					if (!filename.endsWith(".js")) {
						filename += ".js";
					}
					var filestats = global.fs.statSync(filename);
					return global.os.platform() + ' ' + global.os.release() + " nodeJS " + process.version + " " + global.path.basename(filename) + " " + filestats.mtime.toISOString();
				}
				return navigator.userAgent;
			case "xquery-engine":
				return "Fleur.js " + global.fleurmtime;
			default:
				return null;
		}
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});