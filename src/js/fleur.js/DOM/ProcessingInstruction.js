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
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}
			if (value !== "") {
				this.appendChild(new Fleur.Text());
				this.firstChild.data = value;
			}
		},
		get: function() {
			var _textContent = "", i = 0, li = this.childNodes.length;
			while (i < li) {
				_textContent += this.childNodes[i++].textContent;
			}
			return _textContent;
		}
	}
});