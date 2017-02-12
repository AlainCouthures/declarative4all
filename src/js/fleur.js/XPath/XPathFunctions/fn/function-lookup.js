/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["function-lookup#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-lookup",
	function(fqname, arity) {
		return Fleur.XPathFunctions[fqname.namespaceURI] ? Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity] || null : null;
	},
	null, [{type: Fleur.Type_QName}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Node});