/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["sum#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sum",
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
				if (p[1]) {
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
				} else {
					rt = c[1];
				}
				return [p[0] + c[0], rt];
			}, [0, null]);
			var v = r[0];
			var t = r[1];
			if (t.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				if (v !== Math.floor(v)) {
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
/*
Fleur.XPathFunctions_fn["sum"] = function(ctx, children, callback) {
	if (children.length !== 1 && children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var sum = 0, val, t = 0, a;
		if (n !== Fleur.EmptySequence) {
			if (n.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				a = Fleur.Atomize(n);
				val = Fleur.toJSNumber(a);
				t = val[0];
				if (t < 0) {
					sum = NaN;
					t = 0;
				} else {
					sum = val[1];
				}
			} else {
				var items = n.childNodes;
				var i, l;
				i = 0;
				l = items.length;
				while (i < l) {
					a = Fleur.Atomize(items[i]);
					val = Fleur.toJSNumber(a);
					if (val[0] < 0) {
						sum = NaN;
						t = 0;
						break;
					}
					sum += val[1];
					t = Math.max(t, val[0]);
					i++;
				}
			}
		} else {
			a = new Fleur.Text();
		}
		if (sum === 0 && children.length === 2) {
			Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
				Fleur.callback(function() {callback(Fleur.Atomize(n));});
			});
		} else {
			a.data = "" + sum;
			a.schemaTypeInfo = Fleur.numericTypes[t];
			Fleur.callback(function() {callback(a);});
		}
	});
};*/