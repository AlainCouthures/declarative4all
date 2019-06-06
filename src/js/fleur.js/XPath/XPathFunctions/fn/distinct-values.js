/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["distinct-values#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:distinct-values",
	function(arg) {
		return Fleur.XPathFunctions_fn["distinct-values#2"].jsfunc(arg, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});
	
Fleur.XPathFunctions_fn["distinct-values#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:distinct-values",
	function(arg, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		if (arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return arg;
		}
		var result = new Fleur.Sequence();
		arg.childNodes.forEach(function(d) {
			var a = Fleur.Atomize(d);
			var opa = Fleur.toJSValue(a, true, true, true, true, false, false, true);
			if (!result.childNodes.some(function(r) {
					var opr = Fleur.toJSValue(r, true, true, true, true, false, false, true);
					return Fleur.eqOp(opa, opr, c);
					/*
					if ((a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) &&
						(r.schemaTypeInfo === Fleur.Type_string || r.schemaTypeInfo === Fleur.Type_untypedAtomic)) {
						return c.equals(a.data, r.data);
					}
					if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1 &&
						Fleur.numericTypes.indexOf(r.schemaTypeInfo) !== -1) {
						return ((a.data === "INF" && r.data === "INF") ||
							(a.data === "-INF" && r.data === "-INF") ||
							(a.data === "NaN" && r.data === "NaN") ||
							parseFloat(a.data) === parseFloat(r.data));
					}
					if (a.schemaTypeInfo === Fleur.Type_time && r.schemaTypeInfo === Fleur.Type_time) {
						var ta = Fleur.toTime(a.data);
						var tr = Fleur.toTime(r.data);
						var d1 = ta.d;
						d1.setMinutes(d1.getMinutes() - ta.tz);
						var d2 = tr.d;
						d2.setMinutes(d2.getMinutes() - tr.tz);
						return d1.getTime() === d2.getTime();
					}
					if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "duration", Fleur.TypeInfo.DERIVATION_RESTRICTION) && r.schemaTypeInfo && r.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "duration", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
						return a.data === r.data;
					}
					return a.schemaTypeInfo === r.schemaTypeInfo && a.data === r.data;*/
				})) {
				result.appendChild(a);
			}
		});
		if (result.childNodes.length === 1) {
			result = result.childNodes[0];
		}
		return result;
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Node, occurence: "*"});