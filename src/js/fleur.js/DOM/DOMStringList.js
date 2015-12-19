/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.DOMStringList = function() {};
Fleur.DOMStringList.prototype = new Array();
/**
 * @name Fleur.DOMStringList#item
 * @function
 * @param {Number} index
 * @return {String}
 */
Fleur.DOMStringList.prototype.item = function(index) {
	return this[index];
};
/**
 * @name Fleur.DOMStringList#contains
 * @function
 * @param {String} str
 * @returns {Boolean}
 */
Fleur.DOMStringList.prototype.contains = function(str) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i] === str) {
			return true;
		}
		i++;
	}
	return false;
};