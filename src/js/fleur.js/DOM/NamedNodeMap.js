/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.NamedNodeMap = function() {};
Fleur.NamedNodeMap.prototype = new Array();
Fleur.NamedNodeMap.prototype.getNamedItem = function(itemname) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i].nodeName === itemname) {
			return this[i];
		}
		i++;
	}
	return null;
};
Fleur.NamedNodeMap.prototype.getNamedItemNS = function(namespaceURI, localName) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i].namespaceURI === namespaceURI && this[i].localName === localName) {
			return this[i];
		}
		i++;
	}
	return null;
};
Fleur.NamedNodeMap.prototype.item = function(index) {
	return this[index];
};
Fleur.NamedNodeMap.prototype.removeNamedItem = function(itemname) {
	var i = 0, l = this.length, node;
	while (i < l) {
		if (this[i].localName === itemname) {
			node = this[i];
			this.splice(i, 1);
			return node;
		}
		i++;
	}
	throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
};
Fleur.NamedNodeMap.prototype.removeNamedItemNS = function(namespaceURI, localName) {
	var i = 0, l = this.length, node;
	while (i < l) {
		if (this[i].namespaceURI === namespaceURI && this[i].localName === localName) {
			node = this[i];
			this.splice(i, 1);
			return node;
		}
		i++;
	}
	throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
};
Fleur.NamedNodeMap.prototype.setNamedItem = function(arg) {
	var i = 0, l = this.length, node;
	if (arg.ownerElement && arg.ownerElement !== this.ownerNode) {
		throw new Fleur.DOMException(Fleur.DOMException.INUSE_ATTRIBUTE_ERR);
	}
	if (this.ownerNode && this.ownerNode.nodeType === Fleur.Node.ELEMENT_NODE && arg.nodeType !== Fleur.Node.ATTRIBUTE_NODE) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	}
	while (i < l) {
		if (this[i].localName === arg.localName) {
			node = this[i];
			this.splice(i, 1);
			this.push(arg);
			return node;
		}
		i++;
	}
	this.push(arg);
	return null;
};
Fleur.NamedNodeMap.prototype.setNamedItemNS = function(arg) {
	var i = 0, l = this.length, node;
	if (arg.ownerElement && arg.ownerElement !== this.ownerNode) {
		throw new Fleur.DOMException(Fleur.DOMException.INUSE_ATTRIBUTE_ERR);
	}
	while (i < l) {
		if (this[i].namespaceURI === arg.namespaceURI && this[i].localName === arg.localName) {
			node = this[i];
			this.splice(i, 1);
			this.push(arg);
			return node;
		}
		i++;
	}
	this.push(arg);
	return null;
};