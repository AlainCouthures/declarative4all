/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.NameList = function() {};
Fleur.NameList.prototype = new Array();
/**
 * @name Fleur.NameList#contains
 * @function
 * @param {String} str
 * @returns {Boolean}
 */
Fleur.NameList.prototype.contains = function(str) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i][1] === str) {
			return true;
		}
		i++;
	}
	return false;
};
/**
 * @param {String} namespaceURI
 * @param {String} name
 * @return {Boolean}
 */
Fleur.NameList.prototype.containsNS = function(namespaceURI, n) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i][0] === namespaceURI && this[i][1] === n) {
			return true;
		}
		i++;
	}
	return false;
};
/**
 * @name Fleur.NameList#getName
 * @function
 * @param {Number} index
 * @returns {String}
 */
Fleur.NameList.prototype.getName = function(index) {
	return this[index][1];
};
/**
 * @name Fleur.NameList#getNamespaceURI
 * @function
 * @param {Number} index
 * @returns {String}
 */
Fleur.NameList.prototype.getNamespaceURI = function(index) {
	return this[index][0];
};