/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Element = function() {
	Fleur.Node.apply(this);
	this.attributes = new Fleur.NamedNodeMap();
	this.attributes.ownerNode = this;
	this.namespaces = new Fleur.NamedNodeMap();
	this.nodeType = Fleur.Node.ELEMENT_NODE;
};
Fleur.Element.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Element.prototype, {
	nodeValue: {
		set: function() {},
		get: function() {
			return null;
		}
	},
	tagName: {
		set: function(value) {
			this.nodeName = value;
		},
		get: function() {
			return this.nodeName;
		}
	}
});
Fleur.Element.prototype.getAttribute = function(attrname) {
	return this.getAttributeNS(null, attrname);
};
Fleur.Element.prototype.getAttributeNode = function(attrname) {
	var i = 0, l = this.attributes.length;
	while (i < l) {
		if (this.attributes[i].nodeName === attrname) {
			return this.attributes[i];
		}
		i++;
	}
	return null;
};
Fleur.Element.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
	var i = 0, l = this.attributes.length;
	while (i < l) {
		if (this.attributes[i].localName === localName && (!namespaceURI || this.attributes[i].namespaceURI === namespaceURI)) {
			return this.attributes[i];
		}
		i++;
	}
	return null;
};
Fleur.Element.prototype.getAttributeNS = function(namespaceURI, localName) {
	var i = 0, l = this.attributes.length;
	while (i < l) {
		if ( !namespaceURI && this.attributes[i].nodeName === localName || this.attributes[i].localName === localName && this.attributes[i].namespaceURI === namespaceURI) {
			return this.attributes[i].nodeValue;
		}
		i++;
	}
	return "";
};
Fleur.Element.prototype._getElementsByTagNameNS = function(namespaceURI, localName, elts) {
	var i = 0, l = this.children.length;
	if ((namespaceURI === "*" || this.namespaceURI === namespaceURI) && (localName === "*" || this.localName === localName)) {
		elts.push(this);
	}
	while (i < l) {
		this.children[i++]._getElementsByTagNameNS(namespaceURI, localName, elts);
	}
};
Fleur.Element.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
	var elts = new Fleur.NodeList();
	var i = 0, l = this.children.length;
	if (!namespaceURI) {
		return this.getElementsByTagName(localName);
	}
	while (i < l) {
		this.children[i++]._getElementsByTagNameNS(namespaceURI, localName, elts);
	}
	return elts;
};
Fleur.Element.prototype._getElementsByTagName = function(eltname, elts) {
	var i = 0, l = this.children.length;
	if (eltname === "*" || this.tagName === eltname) {
		elts.push(this);
	}
	while (i < l) {
		this.children[i++]._getElementsByTagName(eltname, elts);
	}
};
Fleur.Element.prototype.getElementsByTagName = function(eltname) {
	var elts = new Fleur.NodeList();
	var i = 0, l = this.children.length;
	while (i < l) {
		this.children[i++]._getElementsByTagName(eltname, elts);
	}
	return elts;
};
Fleur.Element.prototype.hasAttribute = function(attrname) {
	return Boolean(this.attributes.getNamedItem(attrname));
};
Fleur.Element.prototype.hasAttributeNS = function(namespaceURI, localName) {
	return this.attributes.getNamedItemNS(namespaceURI, localName) !== null;
};
Fleur.Element.prototype.removeAttribute = function(attrname) {
	this.attributes.removeNamedItem(attrname);
};
Fleur.Element.prototype.removeAttributeNode = function(oldAttr) {
	if (oldAttr.ownerElement !== this) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
	}
	this.attributes.removeNamedItemNS(oldAttr.namespaceURI, oldAttr.localName);
	return oldAttr;
};
Fleur.Element.prototype.removeAttributeNS = function(namespaceURI, localName) {
	this.attributes.removeNamedItemNS(namespaceURI, localName);
};
Fleur.Element.prototype.setAttribute = function(attrname, value) {
	var attr;
	if (this.hasAttribute(attrname)) {
		attr = this.attributes.getNamedItem(attrname);
		attr.nodeValue = value;
		return;
	}
	attr = this.ownerDocument.createAttribute(attrname);
	attr.ownerElement = this;
	attr.appendChild(this.ownerDocument.createTextNode(value));
	this.attributes.setNamedItem(attr);
};
Fleur.Element.prototype.setAttributeNode = function(newAttr) {
	var n = this.attributes.setNamedItem(newAttr);
	newAttr.ownerElement = this;
	return n;
};
Fleur.Element.prototype.setAttributeNodeNS = function(newAttr) {
	var n = this.attributes.setNamedItemNS(newAttr);
	newAttr.ownerElement = this;
	return n;
};
Fleur.Element.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
	var attr;
	if (this.hasAttributeNS(namespaceURI, qualifiedName)) {
		attr = this.attributes.getNamedItemNS(namespaceURI, qualifiedName);
		attr.nodeValue = value;
		return;
	}
	attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
	attr.ownerElement = this;
	attr.nodeValue = value;
	this.attributes.setNamedItemNS(attr);
};
/*
Fleur.Element.prototype._serializeToString = function(indent) {
	var s, i, l;
	s = "<" + this.nodeName;
	for (i = 0, l = this.attributes.length; i < l; i++) {
		s += " " + this.attributes[i].nodeName + "=\"" + Fleur.XMLSerializer.escape(this.attributes[i].nodeValue).replace('"', "&quot;") + "\"";
	}
	if (this.childNodes.length === 0) {
		return s + "/>";
	}
	s += indent ? ">\n" : ">";
	for (i = 0, l = this.childNodes.length; i < l; i++) {
		s += Fleur.XMLSerializer._serializeToString(this.childNodes[i], indent, "    ");
	}
	return s + "</" + this.nodeName + ">";
};
*/
/*
Fleur.Element.prototype.setIdAttribute = function(name, isId) {
};
*/
/*
Fleur.Element.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
};
*/
/*
Fleur.Element.prototype.setIdAttributeNode = function(idAttr, isId) {
};
*/