/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.NodeList = function() {};
Fleur.NodeList.prototype = new Array();
Fleur.NodeList.prototype.item = function(index) {
	return this[index];
};