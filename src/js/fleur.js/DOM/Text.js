/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Text = function() {
	this.nodeType = Fleur.Node.TEXT_NODE;
	this.nodeName = "#text";
};
Fleur.Text.prototype = new Fleur.CharacterData();
Object.defineProperties(Fleur.Text.prototype, {
	nodeValue: {
		set: function(value) {
			this.data = value;
			this.length = value.length;
		},
		get: function() {
			return this.data;
		}
	}
});
/*
Fleur.Text.prototype.replaceWholeText = function(content) {
};
*/
Fleur.Text.prototype.splitText = function(offset) {
	var t;
	if (offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	} 
	t = this.cloneNode(true);
	t.deleteData(0, offset);
	this.deleteData(offset, this.length - offset);
	if (this.parentNode) {
		this.parentNode.insertBefore(t, this.nextSibling);
	}
	return t;
};