/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.DOMConfiguration = function() {
	this._parameters = {
		"canonical-form": false,
		"cdata-sections": true,
		"check-character-normalization": false,
		"comments": true,
		"datatype-normalization": false,
		"element-content-whitespace": true,
		"entities": true,
		"error-handler": function(){},
		"infoset": true,
		"namespaces": true,
		"namespace-declarations": true,
		"normalize-characters": false,
		"schema-location": null,
		"schema-type" : null,
		"split-cdata-sections": true,
		"validate": false,
		"validate-if-schema": false,
		"well-formed": true
	};
	this.parametersNames = new Fleur.DOMStringList();
	for (var p in this._parameters) {
		if (this._parameters.hasOwnProperty(p)) {
			this.parametersNames.push(p);
		}
	}
};
/**
 * @name Fleur.DOMConfiguration#canSetParameter
 * @function
 * @param {String} pname
 * @param {String} value
 * @returns {Boolean}
 */
Fleur.DOMConfiguration.prototype.canSetParameter = function(pname, value) {
	/*eslint-disable valid-typeof*/
	return this.parametersNames.contains(pname) && (typeof value === typeof this._parameters[pname]);
	/*eslint-enable valid-typeof*/
};
/**
 * @name Fleur.DOMConfiguration#setParameter
 * @function
 * @param {String} pname
 * @param {String} value
 */
Fleur.DOMConfiguration.prototype.setParameter = function(pname, value) {
	this._parameters[pname] = value;
};
/**
 * @name Fleur.DOMConfiguration#getParameter
 * @function
 * @param {String} pname
 * @returns {String}
 */
Fleur.DOMConfiguration.prototype.getParameter = function(pname) {
	return this._parameters[pname];
};