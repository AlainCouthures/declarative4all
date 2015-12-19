/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathException = function(code, error) {
	this.code = code;
	this.error = error;
};
Fleur.XPathException.INVALID_EXPRESSION_ERR = 51;
Fleur.XPathException.TYPE_ERR = 52;