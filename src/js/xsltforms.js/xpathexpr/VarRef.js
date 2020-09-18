/*eslint-env browser*/
/*globals XsltForms_idManager */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module VarRef
 * @description  === XsltForms_varRef Class ===
 * XPath Expression Class for variables get
 * * constructor function
 */
		
function XsltForms_varRef(vname) {
	this.name = vname;
}


		
/**
 * * '''evaluate''' method : gets the variable value
 */

XsltForms_varRef.prototype.evaluate = function(ctx) {
	if (!ctx.varresolver || !ctx.varresolver[this.name]) {
		return "";
	}
	if (ctx.varresolver[this.name] instanceof XsltForms_var) {
		var varxf = ctx.varresolver[this.name];
		for (var i = 0, l = varxf.depsNodesRefresh.length; i < l ; i++) {
			ctx.addDepNode(varxf.depsNodesRefresh[i]);
		}
		for (i = 0, l = varxf.depsNodesBuild.length; i < l ; i++) {
			ctx.addDepNode(varxf.depsNodesBuild[i]);
		}
		for (var j = 0, l2 = varxf.depsElements.length; j < l2 ; j++) {
			ctx.addDepElement(varxf.depsElements[j]);
		}
		return varxf.boundnodes;
	}
	return ctx.varresolver[this.name][0];
};