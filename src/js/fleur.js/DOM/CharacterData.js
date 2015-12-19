/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.CharacterData = function() {
	this.data = "";
	this.length = 0;
};
Fleur.CharacterData.prototype = new Fleur.Node();
Fleur.CharacterData.prototype.appendData = function(arg) {
	this.textContent = this.nodeValue = this.data += arg;
	this.length = this.data.length;
};
Fleur.CharacterData.prototype.deleteData = function(offset, count) {
	if (count < 0 || offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	}
	this.textContent = this.nodeValue = this.data = this.data.substr(0, offset) + this.data.substr(offset + count);
	this.length = this.data.length;
};
Fleur.CharacterData.prototype.insertData = function(offset, data) {
	if (offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	}
	this.textContent = this.nodeValue = this.data = this.data.substr(0, offset) + data + this.data.substr(offset);
	this.length = this.data.length;
};
Fleur.CharacterData.prototype.replaceData = function(offset, count, arg) {
	if (count < 0 || offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	}
	this.textContent = this.nodeValue = this.data = this.data.substr(0, offset) + arg + this.data.substr(offset + count);
	this.length = this.data.length;
};
Fleur.CharacterData.prototype.substringData = function(offset, count) {
	if (count < 0 || offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	}
	return this.data.substr(offset, count);
};