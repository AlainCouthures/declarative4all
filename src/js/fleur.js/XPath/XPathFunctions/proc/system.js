/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_proc["system#1"] = new Fleur.Function("http://basex.org/modules/proc", "proc:system",
	function(cmd, callback) {
		return Fleur.XPathFunctions_proc["system#3"].jsfunc(cmd, null, null, callback);
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_string, occurence: "?"});

Fleur.XPathFunctions_proc["system#2"] = new Fleur.Function("http://basex.org/modules/proc", "proc:system",
	function(cmd, args, callback) {
		return Fleur.XPathFunctions_proc["system#3"].jsfunc(cmd, args, null, callback);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "*"}], false, true, {type: Fleur.Type_string, occurence: "?"});

Fleur.XPathFunctions_proc["system#3"] = new Fleur.Function("http://basex.org/modules/proc", "proc:system",
	function(cmd, args, options, callback) {
		if (cmd !== "" && global.child_process) {
			var cmdline = cmd.indexOf(" ") !== -1 ? '"' + cmd + '"' : cmd;
			if (args) {
				args.forEach(function(arg) {
					cmdline += arg.indexOf(" ") !== -1 ? ' "' + arg + '"' : " " + arg;
				});
			}
			global.child_process.exec(cmdline, {windowsHide: true}, function(err, stdout, stderr) {
				if (err) {
					err.name = "FOPR0001";
					callback(err);
				} else if (stderr) {
					var e = new Error(stderr);
					e.name = "FOPR0001";
					callback(e);
				} else {
					callback(stdout);
				}
			});
			return;
		}
		callback(null);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Node, occurence: "?"}], false, true, {type: Fleur.Type_string, occurence: "?"});