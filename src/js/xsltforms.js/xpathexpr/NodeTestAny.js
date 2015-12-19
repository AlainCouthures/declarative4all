/*eslint-env browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module NodeTestAny
 * @description  === XsltForms_nodeTestAny Class ===
 * XPath Expression Class for any node Expression ("*")
 * * constructor function : initializes absolute property and stacks successive steps
 */
		
function XsltForms_nodeTestAny() {
}


		
/**
 * * '''evaluate''' method : always true
 */

XsltForms_nodeTestAny.prototype.evaluate = function(node) {
	var n = node.localName || node.baseName;
    return !n || (n.substr(0, 10) !== "xsltforms_" && node.namespaceURI !== "http://www.w3.org/2000/xmlns/");
};