/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Attr = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ATTRIBUTE_NODE;
};
Fleur.Attr.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Attr.prototype, {
	nodeValue: {
		set: function(value) {
			if (value) {
				if (!this.firstChild) {
					this.appendChild(this.ownerDocument.createTextNode(value));
					return;
				}
				this.firstChild.nodeValue = value;
				return;
			}
			if (this.firstChild) {
				this.removeChild(this.firstChild);
			}
		},
		get: function() {
			var s = "", i = 0, l = this.childNodes ? this.childNodes.length : 0;
			while (i < l) {
				s += this.childNodes[i].nodeValue;
				i++;
			}
			return s;
		}
	},
	specified: {
		get: function() {
			return true;
			//return !!this.firstChild;
		}
	},
	value: {
		set: function(value) {
			if (value) {
				if (!this.firstChild) {
					this.appendChild(this.ownerDocument.createTextNode(value));
					return;
				}
				this.firstChild.nodeValue = value;
				return;
			}
			if (this.firstChild) {
				this.removeChild(this.firstChild);
			}
		},
		get: function() {
			var s = "", i = 0, l = this.childNodes ? this.childNodes.length : 0;
			while (i < l) {
				s += this.childNodes[i].nodeValue;
				i++;
			}
			return s;
		}
	}
});