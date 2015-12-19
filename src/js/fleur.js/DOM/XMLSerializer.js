/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XMLSerializer = function() {};
Fleur.XMLSerializer.prototype = new Fleur.Serializer();
Fleur.XMLSerializer.prototype.serializeToString = function(node, indent) {
	return Fleur.Serializer.prototype.serializeToString.call(this, node, "application/xml", indent);
};