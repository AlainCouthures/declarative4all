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
Object.defineProperty(Fleur, "EmptySequence", {
	value: new Fleur.Sequence(),
	writable: false,
	enumerable: true,
	configurable: false
});
Fleur.Sequence.prototype.merge = function(newChild) {
	if (newChild.nodeType === Fleur.Node.SEQUENCE_NODE) {
		if (newChild.childNodes.length !== 0) {
			const seq = this;
			newChild.childNodes.forEach(n => {
				if (!seq.internals.has(n.internal_id)) {
					seq.appendChild(n);
					seq.internals.add(n.internal_id);
				}
			});
		}
		return newChild;
	}
	if (!this.internals.has(newChild.internal_id)) {
		this.appendChild(newChild);
		this.internals.add(newChild.internal_id);
	}
	return newChild;
};