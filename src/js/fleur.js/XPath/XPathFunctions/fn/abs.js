/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["abs"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.abs, function(a) {
		switch (a.schemaTypeInfo) {
			case Fleur.Types_XMLSchema["nonPositiveInteger"]:
				return Fleur.Types_XMLSchema["nonNegativeInteger"];
			case Fleur.Types_XMLSchema["negativeInteger"]:
				return Fleur.Types_XMLSchema["positiveInteger"];
			case Fleur.Types_XMLSchema["byte"]:
				if (a.data === "128") {
					return Fleur.Types_XMLSchema["short"];
				}
				return Fleur.Types_XMLSchema["byte"];
			case Fleur.Types_XMLSchema["short"]:
				if (a.data === "32768") {
					return Fleur.Types_XMLSchema["int"];
				}
				return Fleur.Types_XMLSchema["short"];
			case Fleur.Types_XMLSchema["int"]:
				if (a.data === "2147483648") {
					return Fleur.Types_XMLSchema["long"];
				}
				return Fleur.Types_XMLSchema["int"];
			case Fleur.Types_XMLSchema["long"]:
				if (a.data === "9223372036854775808") {
					return Fleur.Types_XMLSchema["integer"];
				}
				return Fleur.Types_XMLSchema["long"];
		}
		return a.schemaTypeInfo;
	}, callback);
};