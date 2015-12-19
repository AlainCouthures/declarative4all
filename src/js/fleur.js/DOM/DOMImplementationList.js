/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.DOMImplementationList = function() {};
Fleur.DOMImplementationList.prototype = new Array();
Fleur.DOMImplementationList.prototype.item = function(index) {
	return this[index];
};

Fleur._DOMImplementations = new Fleur.DOMImplementationList();