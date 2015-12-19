/*eslint-env browser*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module NodeTestType
 * @description  === XsltForms_nodeTestType Class ===
 * XPath Expression Class for node type test expressions
 * * constructor function : initializes type property
 */
		
function XsltForms_nodeTestType(type) {
	this.type = type;
}


		
/**
 * * '''evaluate''' method : evaluates as a boolean value if a given node has the same type as this expression object
 */

XsltForms_nodeTestType.prototype.evaluate = function(node) {
	return node.nodeType === this.type;
};