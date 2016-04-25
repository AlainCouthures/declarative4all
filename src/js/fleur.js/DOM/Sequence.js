/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Sequence = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.SEQUENCE_NODE;
	this.nodeName = "#sequence";
};
Fleur.Sequence.prototype = new Fleur.Node();
Fleur.EmptySequence = new Fleur.Sequence();