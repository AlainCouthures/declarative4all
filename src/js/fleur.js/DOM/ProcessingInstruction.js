/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.ProcessingInstruction = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.PROCESSING_INSTRUCTION_NODE;
};
Fleur.ProcessingInstruction.prototype = new Fleur.Node();
Object.defineProperties(Fleur.ProcessingInstruction.prototype, {
	nodeValue: {
		set: function(value) {
			this.data = value;
		},
		get: function() {
			return this.data;
		}
	}
});