/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Map = function() {
	Fleur.Node.apply(this);
	this.entries = new Fleur.NamedNodeMap();
	this.entries.ownerNode = this;
	this.nodeType = Fleur.Node.MAP_NODE;
	this.nodeName = "#map";
};
Fleur.Map.prototype = new Fleur.Node();
Fleur.Map.prototype.getEntryNode = function(entryname) {
	var i = 0, l = this.entries.length;
	while (i < l) {
		if (this.entries[i].nodeName === entryname) {
			return this.entries[i];
		}
		i++;
	}
	return null;
};
Fleur.Map.prototype.hasEntry = function(entryname) {
	return !!this.entries.getNamedItem(entryname);
};
Fleur.Map.prototype.removeEntry = function(entryname) {
	this.entries.removeNamedItem(entryname);
};
Fleur.Map.prototype.removeEntryNode = function(oldEntry) {
	if (oldEntry.ownerMap !== this) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
	}
	this.entries.removeNamedItem(oldEntry.nodeName);
	return oldEntry;
};
Fleur.Map.prototype.setEntryNode = function(newEntry) {
	var n = this.entries.setNamedItem(newEntry);
	newEntry.ownerMap = this;
	return n;
};