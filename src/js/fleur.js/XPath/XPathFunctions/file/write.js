/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_file["write#2"] = new Fleur.Function("http://expath.org/ns/file", "file:write",
	function(filename, node, ctx, callback) {
		return Fleur.XPathFunctions_file["write#3"].jsfunc(filename, node, null, ctx, callback);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.EmptySequence});

Fleur.XPathFunctions_file["write#3"] = new Fleur.Function("http://expath.org/ns/file", "file:write",
	function(filename, node, serialization, ctx, callback) {
		var contentType;
		var indent = false;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			contentType = Fleur.toContentType(op2[1], Fleur.extension2contentType[global.path.extname(filename).toLowerCase()] || "application/xml");
			indent = op2[1].indent === "yes";
		}
		if (!contentType) {
			contentType = Fleur.extension2contentType[global.path.extname(filename).toLowerCase()] || "application/xml";
		}
		var ser = new Fleur.Serializer();
		global.fs.writeFile(filename, ser.serializeToString(node, contentType, indent), function(err) {
			if (err) {
				callback(Fleur.error(ctx, "FODC0002"));
			} else {
				callback(Fleur.EmptySequence);
			}
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.EmptySequence});