/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["sort#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort",
	function(input) {
		return Fleur.XPathFunctions_fn["sort#3"].jsfunc(input, null, null);
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});
	
Fleur.XPathFunctions_fn["sort#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort",
	function(input, collation) {
		return Fleur.XPathFunctions_fn["sort#3"].jsfunc(input, collation, null);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});
	
Fleur.XPathFunctions_fn["sort#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort",
	function(input, collation, key) {
		if (input.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return Fleur.Atomize(input);
		}
		if (input === Fleur.EmptySequence) {
			return Fleur.EmptySequence;
		}
		var i, l;
		var seq = new Fleur.Sequence();
		var arr = [];
		for (i = 0, l = input.childNodes.length; i < l; i++) {
			arr.push(Fleur.Atomize(input.childNodes[i]));
		}
		var v = function(n) {
			if (n.schemaTypeInfo === Fleur.Type_integer) {
				return parseInt(n.data, 10);
			} else if (n.schemaTypeInfo === Fleur.Type_decimal) {
				return parseFloat(n.data);
			} else if (n.schemaTypeInfo === Fleur.Type_float) {
				return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
			} else if (n.schemaTypeInfo === Fleur.Type_double) {
				return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return parseInt(n.data, 10);
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return parseFloat(n.data);
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
			} else if (n.schemaTypeInfo === Fleur.Type_string || n.schemaTypeInfo === Fleur.Type_anyURI || n.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				return n.data;
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return n.data;
			}
		};
		arr.sort(function(a, b) {
			if (a.data === b.data) {
				return 0;
			}
			if (v(a) < v(b)) {
				return -1;
			}
			return 1;
		});
		arr.forEach(function(n) {
			seq.appendChild(n);
		});
		return seq;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node}], false, false, {type: Fleur.Node, occurence: "*"});