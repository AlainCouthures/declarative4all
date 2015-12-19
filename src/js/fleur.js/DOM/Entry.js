/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Entry = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ENTRY_NODE;
};
Fleur.Entry.prototype = new Fleur.Node();