/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["avg#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:avg",
	function(arg) {
		if (arg === null) {
			return [null, null];
		}
		if (arg[0] instanceof Array) {
			var r = arg.reduce(function(p, c) {
				var rt;
				if (c[1] === Fleur.Type_untypedAtomic) {
					c[1] = Fleur.Type_double;
				}
				if (!p[1]) {
					return c;
				}
				rt = p[1].compareType(c[1], Fleur.TypeInfo.DERIVATION_RESTRICTION);
				if (!rt) {
					if (p[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || c[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
						if (p[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION) || c[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
							rt = Fleur.Type_double;
						} else {
							rt = Fleur.Type_float;
						}
					} else {
						rt = Fleur.Type_double;
					}
				}
				if (typeof p[0] !== typeof c[0]) {
					p[0] = Number(p[0]);
					c[0] = Number(c[0]);
				}
				return [p[0] + c[0], rt];
			}, [0, null]);
			var argl = typeof r[0] === "number" ? arg.length : Fleur.BigInt(arg.length);
			var v = r[0] / argl;
			var t = r[1];
			if (t.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				if (r[0] !== v * argl) {
					v = Number(r[0]) / Number(argl);
					t = Fleur.Type_decimal;
				}
			}
			return [v, t];
		}
		if (arg[1] === Fleur.Type_untypedAtomic) {
			arg[1] = Fleur.Type_double;
		}
		return arg;
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "*"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});