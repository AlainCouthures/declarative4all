/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Multidim = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.MULTIDIM_NODE;
	this.nodeName = "#multidim";
};
Fleur.Multidim.prototype = new Fleur.Node();