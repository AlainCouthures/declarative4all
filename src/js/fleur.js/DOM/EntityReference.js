/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.EntityReference = function() {
	this.nodeType = Fleur.Node.ENTITY_REFERENCE_NODE;
};
Fleur.EntityReference.prototype = new Fleur.Node();