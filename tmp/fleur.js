/*
Fleur rev.7 (7)
Fleur README

Copyright (C) 2017 agenceXML - Alain Couthures
Contact at : info@agencexml.com

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

"use strict";
(function(Fleur) {
Fleur.NodeList = function() {};
Fleur.NodeList.prototype = new Array();
Fleur.NodeList.prototype.item = function(index) {
	return this[index];
};
Fleur.Node = function() {
	this._userData = {};
	this.childNodes = new Fleur.NodeList();
	this.children = new Fleur.NodeList();
};
Fleur.Node.ELEMENT_NODE = 1;
Fleur.Node.ATTRIBUTE_NODE = 2;
Fleur.Node.TEXT_NODE = 3;
Fleur.Node.CDATA_NODE = 4;
Fleur.Node.ENTITY_REFERENCE_NODE = 5;
Fleur.Node.ENTITY_NODE = 6;
Fleur.Node.PROCESSING_INSTRUCTION_NODE = 7;
Fleur.Node.COMMENT_NODE = 8;
Fleur.Node.DOCUMENT_NODE = 9;
Fleur.Node.DOCUMENT_TYPE_NODE = 10;
Fleur.Node.DOCUMENT_FRAGMENT_NODE = 11;
Fleur.Node.NOTATION_NODE = 12;
Fleur.Node.NAMESPACE_NODE = 129;
Fleur.Node.ATOMIC_NODE = Fleur.Node.TEXT_NODE;
Fleur.Node.SEQUENCE_NODE = 130;
Fleur.Node.ARRAY_NODE = 131;
Fleur.Node.MAP_NODE = 132;
Fleur.Node.ENTRY_NODE = 133;
Fleur.Node.DOCUMENT_POSITION_DISCONNECTED = 1;
Fleur.Node.DOCUMENT_POSITION_PRECEDING = 2;
Fleur.Node.DOCUMENT_POSITION_FOLLOWING = 4;
Fleur.Node.DOCUMENT_POSITION_CONTAINS = 8;
Fleur.Node.DOCUMENT_POSITION_CONTAINED_BY = 16;
Fleur.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
Fleur.Node.QNameReg = /^([_A-Z][-_.\w]*:)?[_A-Z][-_.\w]*$/i;
Fleur.Node.QNameCharsReg = /^[-_.\w:]+$/i;
Fleur.Node.prefixReg = /^[-_.\w]+$/i;
Fleur.Node.JSNameReg = /^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[a-zA-Z_$][0-9a-zA-Z_$]*$/;
Object.defineProperties(Fleur.Node.prototype, {
	prefix: {
		set: function(value) {
			if ((value === "xml" && this.namespaceURI !== "http://www.w3.org/XML/1998/namespace") ||
				(value === "xmlns" && this.namespaceURI !== "http://www.w3.org/2000/xmlns/")) {
				throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
			}
			if (!Fleur.Node.prefixReg.test(value)) {
				throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
			}
			this._prefix = value;
			if (value) {
				this.nodeName = value + ":" + this.localName;
			}
		},
		get: function() {
			return this._prefix;
		}
	},
	textContent: {
		set: function(value) {
			if (this.nodeType === Fleur.Node.TEXT_NODE || this.nodeType === Fleur.Node.CDATA_NODE || this.nodeType === Fleur.Node.COMMENT_NODE) {
				this.data = value;
			} else {
				while (this.firstChild) {
					this.removeChild(this.firstChild);
				}
				if (value !== "") {
					this.appendChild(new Fleur.Text());
					this.firstChild.data = value;
				}
			}
		},
		get: function() {
			var _textContent = "", i = 0, li = this.childNodes.length;
			if (this.nodeType === Fleur.Node.TEXT_NODE || this.nodeType === Fleur.Node.CDATA_NODE) {
				return this.data;
			}
			while (i < li) {
				_textContent += this.childNodes[i++].textContent;
			}
			return _textContent;
		}
	}
});
Fleur.Node.prototype.appendChild = function(newChild) {
	var n = this, i = 0, l;
	if (newChild.nodeType === Fleur.Node.DOCUMENT_FRAGMENT_NODE) {
		l = newChild.childNodes.length;
		while (i < l) {
			this.appendChild(newChild.childNodes[0]);
			i++;
		}
	} else if ((this.nodeType !== Fleur.Node.SEQUENCE_NODE || this.ownerDocument) && (newChild.nodeType === Fleur.Node.ATTRIBUTE_NODE || (this.nodeType === Fleur.Node.ATTRIBUTE_NODE && newChild.nodeType !== Fleur.Node.TEXT_NODE))) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	} else {
		if (this.nodeType !== Fleur.Node.SEQUENCE_NODE || this.ownerDocument) {
			while (n) {
				if (n === newChild) {
					throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
				}
				n = n.parentNode || n.ownerElement;
			}
			if (newChild.ownerDocument && (this.ownerDocument || this) !== newChild.ownerDocument) {
				throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
			}
			if (newChild.parentNode) {
				newChild.parentNode.removeChild(newChild);
			}
			if (this.childNodes.length === 0) {
				this.firstChild = newChild;
			}
			newChild.previousSibling = this.lastChild;
			newChild.nextSibling = null;
			if (this.lastChild) {
				this.lastChild.nextSibling = newChild;
			}
			newChild.parentNode = this;
			this.lastChild = newChild;
		}
		this.childNodes.push(newChild);
		if (newChild.nodeType === Fleur.Node.ELEMENT_NODE || newChild.nodeType === Fleur.Node.SEQUENCE_NODE || newChild.nodeType === Fleur.Node.ARRAY_NODE || newChild.nodeType === Fleur.Node.MAP_NODE || newChild.nodeType === Fleur.Node.ENTRY_NODE) {
			this.children.push(newChild);
		}
	}
	return newChild;
};
Fleur.Node.prototype.appendDescendants = function(src) {
	if (src.childNodes) {
		var dest = this;
		if (src.childNodes.forEach) {
			src.childNodes.forEach(function(n) {dest.appendChild(n); dest.appendDescendants(n);});
		} else {
			for (var i = 0, l = src.childNodes.length; i < l; i++) {
				dest.appendChild(src.childNodes[i]);
				dest.appendDescendants(src.childNodes[i]);
			}
		}
	}
};
Fleur.Node.prototype.appendDescendantsRev = function(src) {
	if (src.childNodes) {
		var dest = this;
		if (src.childNodes.forEach) {
			src.childNodes.forEach(function(n) {dest.appendDescendantsRev(n); dest.appendChild(n);});
		} else {
			for (var i = 0, l = src.childNodes.length; i < l; i++) {
				dest.appendDescendantsRev(src.childNodes[i]);
				dest.appendChild(src.childNodes[i]);
			}
		}
	}
};
Fleur.Node.prototype.appendContent = function(n, sep) {
	var n2;
	switch(n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			if (this.lastChild && this.lastChild.nodeType === Fleur.Node.TEXT_NODE) {
				this.lastChild.data += sep + n.data;
			} else if (n.data && n.data !== "") {
				n2 = new Fleur.Text();
				n2.data = n.data;
				n2.schemaTypeInfo = Fleur.Type_untypedAtomic;
				this.appendChild(n2);
			}
			break;
		case Fleur.Node.COMMENT_NODE:
			n2 = new Fleur.Comment();
			n2.data = n.data;
			this.appendChild(n2);
			break;
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			n2 = new Fleur.ProcessingInstruction();
			n2.nodeName = n2.target = n.target;
			n2.data = n.data;
			this.appendChild(n2);
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			n2 = new Fleur.Attr();
			n2.nodeName = n.nodeName;
			n2.localName = n.localName;
			n2.schemaTypeInfo = n.schemaTypeInfo;
			n2.namespaceURI = n.namespaceURI;
			n2.prefix = n.prefix;
			n.childNodes.forEach(function(c) {
				n2.appendContent(c);
			});
			this.setAttributeNodeNS(n2);
			break;
		case Fleur.Node.ELEMENT_NODE:
			n2 = new Fleur.Element();
			n2.nodeName = n.nodeName;
			n2.localName = n.localName;
			n2.schemaTypeInfo = n.schemaTypeInfo;
			n2.namespaceURI = n.namespaceURI;
			n2.prefix = n.prefix;
			n.attributes.forEach(function(c) {
				n2.appendContent(c, "");
			});
			n.childNodes.forEach(function(c) {
				n2.appendContent(c, "");
			});
			this.appendChild(n2);
			break;
		case Fleur.Node.SEQUENCE_NODE:
			var n0 = this;
			n.childNodes.forEach(function(c) {
				n0.appendContent(c, " ");
			});
			break;
		case Fleur.Node.DOCUMENT_NODE:
		case Fleur.Node.DOCUMENT_TYPE_NODE:
			throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
};
Fleur.Node.prototype.clearUserData = function() {
	this._userData = {};
};
Fleur.Node.prototype.cloneNode = function(deep) {
	var i = 0, li = 0, j = 0, lj = 0, clone = null;
	switch (this.nodeType) {
		case Fleur.Node.TEXT_NODE:
			clone = this.ownerDocument.createTextNode(this.data);
			clone.schemaTypeInfo = this.schemaTypeInfo;
			break;
		case Fleur.Node.COMMENT_NODE:
			clone = this.ownerDocument.createComment(this.data);
			break;
		case Fleur.Node.CDATA_NODE:
			clone = this.ownerDocument.createCDATASection(this.data);
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			clone = this.ownerDocument.createAttributeNS(this.namespaceURI, this.nodeName);
			clone.schemaTypeInfo = this.schemaTypeInfo;
			lj = this.childNodes.length;
			while (j < lj) {
				clone.appendChild(this.childNodes[j++].cloneNode(true));
			}
			break;
		case Fleur.Node.ENTRY_NODE:
			clone = this.ownerDocument.createEntry(this.nodeName);
			lj = this.childNodes.length;
			while (j < lj) {
				clone.appendChild(this.childNodes[j++].cloneNode(true));
			}
			break;
		case Fleur.Node.ELEMENT_NODE:
			clone = this.ownerDocument.createElementNS(this.namespaceURI, this.nodeName);
			clone.schemaTypeInfo = this.schemaTypeInfo;
			li = this.attributes.length;
			while (i < li) {
				clone.setAttributeNode(this.attributes[i++].cloneNode(false));
			}
			if (deep) {
				lj = this.childNodes.length;
				while (j < lj) {
					clone.appendChild(this.childNodes[j++].cloneNode(true));
				}
			}
			break;
		case Fleur.Node.MAP_NODE:
			clone = this.ownerDocument.createMap();
			li = this.entries.length;
			while (i < li) {
				clone.setEntryNode(this.entries[i++].cloneNode(false));
			}
			break;
		case Fleur.Node.SEQUENCE_NODE:
			clone = this.ownerDocument.createSequence();
			lj = this.childNodes.length;
			while (j < lj) {
				clone.appendChild(this.childNodes[j++].cloneNode(true));
			}
			break;
		case Fleur.Node.ARRAY_NODE:
			clone = this.ownerDocument.createArray();
			lj = this.childNodes.length;
			while (j < lj) {
				clone.appendChild(this.childNodes[j++].cloneNode(true));
			}
			break;
		case Fleur.Node.DOCUMENT_NODE:
			break;
	}
	return clone;
};
Fleur.Node.prototype.compareDocumentPosition = function(other) {
	var nancestor = this.ownerElement || this.parentNode;
	var nancestors = [];
	var oancestor = other.ownerElement || other.parentNode;
	var oancestors = [];
	var i = 0, j = 0;
	if (this.ownerDocument.implementation !== other.ownerDocument.implementation) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	if (this === other) {
		return 0;
	}
	while (nancestor) {
		nancestors.splice(0, 0, nancestor);
		nancestor = nancestor.parentNode;
	}
	while (oancestor) {
		oancestors.splice(0, 0, oancestor);
		oancestor = oancestor.parentNode;
	}
	do {
		if (nancestors[i] !== oancestors[i]) {
			if (i === 0) {
				return Fleur.Node.DOCUMENT_POSITION_DISCONNECTED;
			}
			if (!nancestors[i]) {
				return Fleur.Node.DOCUMENT_POSITION_CONTAINS | Fleur.Node.DOCUMENT_POSITION_PRECEDING;
			}
			if (!oancestors[i]) {
				return Fleur.Node.DOCUMENT_POSITION_CONTAINED_BY | Fleur.Node.DOCUMENT_POSITION_FOLLOWING;
			}
			do {
				if (nancestors[i - 1].childNodes[j] === nancestors[i]) {
					return Fleur.Node.DOCUMENT_POSITION_PRECEDING;
				}
				if (nancestors[i - 1].childNodes[j] === oancestors[i]) {
					return Fleur.Node.DOCUMENT_POSITION_FOLLOWING;
				}
			} while (j++);
		}
		if (!nancestors[i]) {
			return (this.localName < other.localName ? Fleur.Node.DOCUMENT_POSITION_PRECEDING : Fleur.Node.DOCUMENT_POSITION_FOLLOWING) | Fleur.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
	} while (i++);
};
Fleur.Node.prototype.getFeature = function(feature, version) {
	return this.ownerDocument.implementation.getFeature(feature, version);
};
Fleur.Node.prototype.getUserData = function(key) {
	return this._userData[key];
};
Fleur.Node.prototype.hasAttributes = function() {
	return !!this.attributes && this.attributes.length !== 0;
};
Fleur.Node.prototype.hasEntries = function() {
	return !!this.entries && this.entries.length !== 0;
};
Fleur.Node.prototype.hasChildNodes = function() {
	return !!this.childNodes && this.childNodes.length !== 0;
};
Fleur.Node.prototype.insertBefore = function(newChild, refChild) {
	var i = 0, j = 0, l = this.childNodes.length, n = refChild, ln;
	if (newChild.nodeType === Fleur.Node.DOCUMENT_FRAGMENT_NODE) {
		ln = newChild.childNodes.length;
		while (i < ln) {
			this.insertBefore(newChild.childNodes[i], refChild);
			i++;
		}
		return newChild;
	} else if (newChild.nodeType === Fleur.Node.ATTRIBUTE_NODE || (this.nodeType === Fleur.Node.ATTRIBUTE_NODE && newChild.nodeType !== Fleur.Node.TEXT_NODE)) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	} else {
		if (refChild) {
			while (n) {
				if (n === newChild) {
					throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
				}
				n = n.parentNode || n.ownerElement;
			}
			if (refChild.ownerDocument !== newChild.ownerDocument) {
				throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
			}
			if (refChild.parentNode !== this) {
				throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
			}
			if (newChild.parentNode) {
				newChild.parentNode.removeChild(newChild);
			}
			while (i < l) {
				if (this.childNodes[i] === refChild) {
					newChild.parentNode = this;
					newChild.previousSibling = refChild.previousSibling;
					refChild.previousSibling = newChild;
					if (newChild.previousSibling) {
						newChild.previousSibling.nextSibling = newChild;
					} else {
						this.firstChild = newChild;
					}
					newChild.nextSibling = refChild;
					if (newChild.nodeType === Fleur.Node.ELEMENT_NODE || newChild.nodeType === Fleur.Node.SEQUENCE_NODE || newChild.nodeType === Fleur.Node.ARRAY_NODE || newChild.nodeType === Fleur.Node.MAP_NODE || newChild.nodeType === Fleur.Node.ENTRY_NODE) {
						this.children.splice(j, 0, newChild);
					}
					this.childNodes.splice(i, 0, newChild);
					return newChild;
				}
				if (this.childNodes[i] === this.children[j]) {
					j++;
				}
				i++;
			}
		} else {
			if (newChild.parentNode) {
				newChild.parentNode.removeChild(newChild);
			}
			newChild.parentNode = this;
			if (this.childNodes.length !== 0) {
				newChild.previousSibling = this.childNodes[this.childNodes.length - 1];
				this.childNodes[this.childNodes.length - 1].nextSibling = newChild;
			} else {
				newChild.previousSibling = null;
			}
			newChild.nextSibling = null;
			if (newChild.nodeType === Fleur.Node.ELEMENT_NODE || newChild.nodeType === Fleur.Node.SEQUENCE_NODE || newChild.nodeType === Fleur.Node.ARRAY_NODE || newChild.nodeType === Fleur.Node.MAP_NODE || newChild.nodeType === Fleur.Node.ENTRY_NODE) {
				this.children.push(newChild);
			}
			this.childNodes.push(newChild);
			this.lastChild = newChild;
			return newChild;
		}
	}
};
Fleur.Node.prototype.isDefaultNamespace = function(namespaceURI) {
	var pnode = this.parentNode || this.ownerElement || this.documentElement;
	if (this.nodeType === Fleur.Node.ELEMENT_NODE) {
		return this.prefix ? this.getAttribute("xmlns") === namespaceURI : this.namespaceURI === namespaceURI;
	}
	return pnode ? pnode.isDefaultNamespace(namespaceURI) : false;
};
Fleur.Node.prototype.isEqualNode = function(arg) {
	var i = 0, j = 0, li, lj;
	if (!arg || this.nodeType !== arg.nodeType || this.nodeName !== arg.nodeName || this.localName !== arg.localName || this.namespaceURI !== arg.namespaceURI || this.prefix !== arg.prefix || this.nodeValue !== arg.nodeValue) {
		return false;
	}
	if (this.attributes) {
		li = this.attributes.length;
		if (!arg.attributes || arg.attributes.length !== li) {
			return false;
		}
		while (i < li) {
			if (!this.attributes[i].isEqualNode(arg.getAttributeNodeNS(this.attributes[i].namespaceURI, this.attributes[i].localName))) {
				return false;
			}
			i++;
		}
	}
	if (this.entries) {
		li = this.entries.length;
		if (!arg.entries || arg.entries.length !== li) {
			return false;
		}
		while (i < li) {
			if (!this.entries[i].isEqualNode(arg.getEntryNode(this.entries[i].nodeName))) {
				return false;
			}
			i++;
		}
	}
	if (this.childNodes) {
		lj = this.childNodes.length;
		if (!arg.childNodes || arg.childNodes.length !== lj) {
			return false;
		}
		while (j < lj) {
			if (!this.childNodes[j].isEqualNode(arg.childNodes[j])) {
				return false;
			}
			j++;
		}
	}
	if (this.nodeType === Fleur.Node.DOCUMENT_TYPE_NODE) {
		if (this.publicId !== arg.publicId || this.systemId !== arg.systemId || this.internalSubset !== arg.internalSubset) {
			return false;
		}
	}
	return true;
};
Fleur.Node.prototype.isSameNode = function(other) {
	return other === this;
};
Fleur.Node.prototype.isSupported = function(feature, version) {
 var doc = this.ownerDocument ? this.ownerDocument : this;
 return doc.implementation.hasFeature(feature, version);
};
Fleur.Node.prototype.lookupNamespaceURI = function(prefix) {
	var namespaceURI, xmlns, pnode = this;
	if (pnode.nodeType === Fleur.Node.DOCUMENT_NODE) {
		pnode = pnode.documentElement;
	}
	if (prefix === null || prefix === '') {
		while (pnode) {
			if (pnode.nodeType === Fleur.Node.ELEMENT_NODE) {
				xmlns = pnode.getAttributeNode("xmlns");
				if (xmlns) {
					return xmlns.textContent;
				}
			}
			pnode = pnode.parentNode || pnode.ownerElement;
		}
		return null;
	}
	while (pnode) {
		if (pnode.nodeType === Fleur.Node.ELEMENT_NODE) {
			namespaceURI = pnode.getAttributeNS("http://www.w3.org/2000/xmlns/", prefix);
			if (namespaceURI !== '') {
				return namespaceURI;
			}
		}
		pnode = pnode.parentNode || pnode.ownerElement;
	}
	return null;
};
Fleur.Node.prototype.lookupPrefix = function(namespaceURI) {
	var pnode = this;
	if (namespaceURI === null || namespaceURI === '') {
		return null;
	}
	if (pnode.nodeType === Fleur.Node.DOCUMENT_NODE) {
		pnode = pnode.documentElement;
	}
	while (pnode) {
		if (pnode.nodeType === Fleur.Node.ELEMENT_NODE) {
		}
		pnode = pnode.parentNode || pnode.ownerElement;
	}
	return null;
};
Fleur.Node.prototype.normalize = function() {
	var i = 0;
	while (i < this.childNodes.length) {
		switch (this.childNodes[i].nodeType) {
			case Fleur.Node.DOCUMENT_NODE:
			case Fleur.Node.ATTRIBUTE_NODE:
			case Fleur.Node.ELEMENT_NODE:
			case Fleur.Node.SEQUENCE_NODE:
			case Fleur.Node.ARRAY_NODE:
			case Fleur.Node.MAP_NODE:
			case Fleur.Node.ENTRY_NODE:
				this.childNodes[i].normalize();
				break;
			case Fleur.Node.TEXT_NODE:
				while (i + 1 < this.childNodes.length) {
					if (this.childNodes[i + 1].nodeType !== Fleur.Node.TEXT_NODE) {
						break;
					}
					this.childNodes[i].appendData(this.childNodes[i + 1].nodeValue);
					this.removeChild(this.childNodes[i + 1]);
				}
				if (this.childNodes[i].data.length === 0) {
					this.removeChild(this.childNodes[i]);
				}
				break;
		}
		i++;
	}
};
Fleur.Node.prototype.removeChild = function(oldChild) {
	var i = 0, j = 0, l = this.childNodes.length;
	if (oldChild.parentNode !== this) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
	}
	while (i < l) {
		if (this.childNodes[i] === oldChild) {
			if (oldChild.previousSibling) {
				oldChild.previousSibling.nextSibling = oldChild.nextSibling;
			} else {
				this.firstChild = oldChild.nextSibling;
			}
			if (oldChild.nextSibling) {
				oldChild.nextSibling.previousSibling = oldChild.previousSibling;
			} else {
				this.lastChild = oldChild.previousSibling;
			}
			this.childNodes.splice(i, 1);
			if (this.children[j] === oldChild) {
				this.children.splice(j, 1);
			}
			oldChild.parentNode = null;
			oldChild.previousSibling = null;
			oldChild.nextSibling = null;
			return oldChild;
		}
		if (this.childNodes[i] === this.children[j]) {
			j++;
		}
		i++;
	}
};
Fleur.Node.prototype.replaceChild = function(newChild, oldChild) {
	var i = 0, j = 0, l = this.childNodes.length, n = this;
	if (this.nodeType === Fleur.Node.DOCUMENT_NODE && oldChild.nodeType === Fleur.Node.DOCUMENT_TYPE_NODE) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	if (newChild.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	}
	while (n) {
		if (n === newChild) {
			throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
		}
		n = n.parentNode || n.ownerElement;
	}
	if (oldChild.parentNode !== this) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
	}
	if (newChild.ownerDocument !== (this.ownerDocument || this)) {
		throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
	}
	if (oldChild === newChild) {
		return oldChild;
	}
	while (i < l) {
		if (this.childNodes[i] === oldChild) {
			this.childNodes[i] = newChild;
			if (this.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE || this.childNodes[i].nodeType === Fleur.Node.SEQUENCE_NODE || this.childNodes[i].nodeType === Fleur.Node.ARRAY_NODE || this.childNodes[i].nodeType === Fleur.Node.MAP_NODE || this.childNodes[i].nodeType === Fleur.Node.ENTRY_NODE) {
				this.children[j] = newChild; //Incomplete
			}
			newChild.parentNode = this;
			newChild.previousSibling = oldChild.previousSibling;
			if (newChild.previousSibling) {
				newChild.previousSibling.nextSibling = newChild;
			} else {
				this.firstChild = newChild;
			}
			newChild.nextSibling = oldChild.nextSibling;
			if (newChild.nextSibling) {
				newChild.nextSibling.previousSibling = newChild;
			} else {
				this.lastChild = newChild;
			}
			oldChild.parentNode = null;
			oldChild.previousSibling = null;
			oldChild.nextSibling = null;
			return oldChild;
		}
		if (this.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE || this.childNodes[i].nodeType === Fleur.Node.SEQUENCE_NODE || this.childNodes[i].nodeType === Fleur.Node.ARRAY_NODE || this.childNodes[i].nodeType === Fleur.Node.MAP_NODE || this.childNodes[i].nodeType === Fleur.Node.ENTRY_NODE) {
			j++;
		}
		i++;
	}
	return oldChild;
};
Fleur.Node.prototype.setUserData = function(key, data, handler) {
	if (data) {
		this._userData[key] = data;
	} else {
		delete this._userData[key];
	}
};
Fleur.Node.prototype._setOwnerDocument = function(doc) {
	if (this.ownerDocument) {
		throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
	}
	this.ownerDocument = doc;
};
Fleur.Node.prototype._setNodeNameLocalNamePrefix = function(namespaceURI, qualifiedName) {
	var pos = qualifiedName.indexOf(":");
	if ( pos === 0 || pos === qualifiedName.length - 1 || (!namespaceURI && pos > 0)) {
		throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
	}
	this.nodeName = qualifiedName;
	this.namespaceURI = namespaceURI;
	this.localName = qualifiedName.substr(pos + 1);
	this.prefix = pos > 0 ? qualifiedName.substr(0, pos) : null;
};
Fleur.Node.prototype.then = function(resolve, reject) {
	if (this.schemaTypeInfo === Fleur.Type_error) {
		reject(this);
	} else {
		resolve(this);
	}
};
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
Fleur.Array = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ARRAY_NODE;
	this.nodeName = "#array";
};
Fleur.Array.prototype = new Fleur.Node();
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
Fleur.CDATASection = function() {
	this.nodeType = Fleur.Node.CDATA_NODE;
	this.nodeName = "#cdata-section";
};
Fleur.CDATASection.prototype = new Fleur.CharacterData();
Fleur.Comment = function() {
	this.nodeType = Fleur.Node.COMMENT_NODE;
	this.nodeName = "#comment";
};
Fleur.Comment.prototype = new Fleur.CharacterData();
Fleur.Document = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.DOCUMENT_NODE;
	this.nodeName = "#document";
	this.inputEncoding = "UTF-8";
	this.xmlStandalone = false;
	this.xmlVersion = "1.0";
	this._elementById = {};
	this._elementsByTagName = {
		" ": {}
	};
};
Fleur.Document.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Document.prototype, {
	documentElement: {
		get: function() {
			return this.children[0] ? this.children[0] : null;
		}
	},
	nodeValue: {
		set: function() {},
		get: function() {
			return null;
		}
	}
});
Fleur.Document.prototype._adoptNode = function(source) {
	var ic = 0, lc = source.childNodes ? source.childNodes.length : 0, ia = 0, la = source.attributes ? source.attributes.length : 0;
	source.ownerDocument = this;
	while (ia < la) {
		this.adoptNode(source.attributes.item(ia));
		ia++;
	}
	while (ic < lc) {
		this.adoptNode(source.childNodes[ic]);
		ic++;
	}
	return source;
};
Fleur.Document.prototype.adoptNode = function(source) {
	if (source.nodeType === Fleur.Node.DOCUMENT_NODE || source.nodeType === Fleur.Node.DOCUMENT_TYPE_NODE) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	if (source.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
		source.ownerElement = null;
	}
	return this._adoptNode(source);
};
Fleur.Document.prototype.createAttribute = function(attrname) {
	return this.createAttributeNS(null, attrname);
};
Fleur.Document.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
	var node = new Fleur.Attr();
	if (!Fleur.Node.QNameReg.test(qualifiedName)) {
		if (Fleur.Node.QNameCharsReg.test(qualifiedName)) {
			throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
		} else {
			throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
		}
	}
	if ((namespaceURI === null && qualifiedName.indexOf(":") !== -1) ||
		(qualifiedName.substr(0, 4) === "xml:" && namespaceURI !== "http://www.w3.org/XML/1998/namespace") ||
		((qualifiedName === "xmlns" || qualifiedName.substr(0, 6) === "xmlns:") && namespaceURI !==  "http://www.w3.org/2000/xmlns/") ||
		(namespaceURI ===  "http://www.w3.org/2000/xmlns/" && qualifiedName !== "xmlns" && qualifiedName.indexOf(":") !== -1 && qualifiedName.substr(0, 6) !== "xmlns:")) {
		throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
	}
	node._setOwnerDocument(this);
	node._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
	node.name = qualifiedName;
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createCDATASection = function(data) {
	var node = new Fleur.CDATASection();
	node._setOwnerDocument(this);
	node.appendData(data);
	return node;
};
Fleur.Document.prototype.createComment = function(data) {
	var node = new Fleur.Comment();
	node._setOwnerDocument(this);
	node.appendData(data);
	return node;
};
Fleur.Document.prototype.createDocumentFragment = function() {
	var node = new Fleur.DocumentFragment();
	node._setOwnerDocument(this);
	return node;
};
Fleur.Document.prototype.createElement = function(tagName) {
	var node = new Fleur.Element();
	node._setOwnerDocument(this);
	node.nodeName = tagName;
	node.namespaceURI = null;
	node.localName = tagName;
	node.prefix = null;
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createElementNS = function(namespaceURI, qualifiedName) {
	var node = new Fleur.Element();
	if ((namespaceURI === null && qualifiedName.indexOf(":") !== -1) ||
		(qualifiedName.substr(0, 4) === "xml:" && namespaceURI !== "http://www.w3.org/XML/1998/namespace") ||
		((qualifiedName === "xmlns" || qualifiedName.substr(0, 6) === "xmlns:") && namespaceURI !==  "http://www.w3.org/2000/xmlns/") ||
		(namespaceURI ===  "http://www.w3.org/2000/xmlns/" && qualifiedName !== "xmlns" && qualifiedName.indexOf(":") !== -1 && qualifiedName.substr(0, 6) !== "xmlns:")) {
		throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
	}
	node._setOwnerDocument(this);
	node._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createEntityReference = function(entname) {
	var node = new Fleur.EntityReference();
	node._setOwnerDocument(this);
	node._setNodeNameLocalNamePrefix(null, entname);
	node.nodeName = entname;
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createProcessingInstruction = function(target, data) {
	var node = new Fleur.ProcessingInstruction();
	if (!Fleur.Node.QNameReg.test(target)) {
		throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
	}
	node._setOwnerDocument(this);
	node.nodeName = node.target = target;
	node.textContent = node.data = data;
	return node;
};
Fleur.Document.prototype.createSequence = function() {
	var node = new Fleur.Sequence();
	node._setOwnerDocument(this);
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createArray = function() {
	var node = new Fleur.Array();
	node._setOwnerDocument(this);
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createMap = function() {
	var node = new Fleur.Map();
	node._setOwnerDocument(this);
	return node;
};
Fleur.Document.prototype.createEntry = function(entryname) {
	var node = new Fleur.Entry();
	node._setOwnerDocument(this);
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.nodeName = node.localName = entryname;
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createTextNode = function(data) {
	var node = new Fleur.Text();
	node._setOwnerDocument(this);
	node.appendData(data);
	node.schemaTypeInfo = Fleur.Type_untypedAtomic;
	return node;
};
Fleur.Document.prototype.createTypedValueNode = function(typeNamespace, typeName, data) {
	var node = new Fleur.Text();
	node._setOwnerDocument(this);
	node.appendData(data);
	node.schemaTypeInfo = Fleur.Types[typeNamespace][typeName];
	return node;
};
Fleur.Document.prototype.createNamespace = function(prefix, namespaceURI) {
	var node = new Fleur.Namespace();
	node.name = prefix;
	node.textContent = node.data = namespaceURI;
	return node;
};
Fleur.Document.prototype.getElementById = function(elementId) {
	return this._elementById[elementId];
};
Fleur.Document.prototype.getElementsByTagName = function(tagName) {
	var i = 0, l = this.children.length, elts = new Fleur.NodeList();
	while (i < l) {
		this.children[i++]._getElementsByTagName(tagName, elts);
	}
	return elts;
};
Fleur.Document.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
	var i = 0, l = this.children.length, elts = new Fleur.NodeList();
	if (!namespaceURI) {
		return this.getElementsByTagName(localName);
	}
	while (i < l) {
		this.children[i++]._getElementsByTagNameNS(namespaceURI, localName, elts);
	}
	return elts;
};
Fleur.Document.prototype.importNode = function(importedNode, deep) {
	var i = 0, li = 0, j = 0, lj = 0, node = null;
	switch (importedNode.nodeType) {
		case Fleur.Node.TEXT_NODE:
			node = this.createTextNode(importedNode.data);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			break;
		case Fleur.Node.COMMENT_NODE:
			node = this.createComment(importedNode.data);
			break;
		case Fleur.Node.CDATA_NODE:
			node = this.createCDATASection(importedNode.data);
			break;
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			node = this.createProcessingInstruction(importedNode.target, importedNode.data);
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			node = this.createAttributeNS(importedNode.namespaceURI, importedNode.nodeName);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			lj = importedNode.childNodes.length;
			while (j < lj) {
				node.appendChild(this.importNode(importedNode.childNodes[j++], true));
			}
			break;
		case Fleur.Node.ELEMENT_NODE:
			node = this.createElementNS(importedNode.namespaceURI, importedNode.nodeName);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			li = importedNode.attributes.length;
			while (i < li) {
				node.setAttributeNode(this.importNode(importedNode.attributes[i++], true));
			}
			if (deep) {
				lj = importedNode.childNodes.length;
				while (j < lj) {
					node.appendChild(this.importNode(importedNode.childNodes[j++], true));
				}
			}
			break;
		case Fleur.Node.SEQUENCE_NODE:
			node = this.createSequence();
			lj = importedNode.childNodes.length;
			while (j < lj) {
				node.appendChild(this.importNode(importedNode.childNodes[j++], true));
			}
			break;
		case Fleur.Node.ARRAY_NODE:
			node = this.createArray();
			lj = importedNode.childNodes.length;
			while (j < lj) {
				node.appendChild(this.importNode(importedNode.childNodes[j++], true));
			}
			break;
		case Fleur.Node.MAP_NODE:
			node = this.createMap();
			li = importedNode.entries.length;
			while (i < li) {
				node.setEntryNode(this.importNode(importedNode.entries[i++], true));
			}
			break;
		case Fleur.Node.ENTRY_NODE:
			node = this.createEntry(importedNode.nodeName);
			lj = importedNode.childNodes.length;
			while (j < lj) {
				node.appendChild(this.importNode(importedNode.childNodes[j++], true));
			}
			break;
		case Fleur.Node.DOCUMENT_FRAGMENT_NODE:
			node = this.createDocumentFragment();
			if (deep) {
				lj = importedNode.childNodes.length;
				while (j < lj) {
					node.appendChild(this.importNode(importedNode.childNodes[j++], true));
				}
			}
			break;
		case Fleur.Node.DOCUMENT_NODE:
		case Fleur.Node.DOCUMENT_TYPE_NODE:
			throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	return node;
};
Fleur.Document.docImportNode = function(doc, importedNode, deep) {
	var i = 0, li = 0, j = 0, lj = 0, node = null;
	switch (importedNode.nodeType) {
		case Fleur.Node.TEXT_NODE:
			node = doc.createTextNode(importedNode.data);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			break;
		case Fleur.Node.COMMENT_NODE:
			node = doc.createComment(importedNode.data);
			break;
		case Fleur.Node.CDATA_NODE:
			node = doc.createCDATASection(importedNode.data);
			break;
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			node = doc.createProcessingInstruction(importedNode.target, importedNode.data);
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			node = doc.createAttributeNS(importedNode.namespaceURI || "", importedNode.nodeName);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			node.value = importedNode.value;
			break;
		case Fleur.Node.ELEMENT_NODE:
			node = doc.createElementNS(importedNode.namespaceURI || "http://www.w3.org/1999/xhtml", importedNode.nodeName);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			li = importedNode.attributes.length;
			while (i < li) {
				node.setAttributeNode(Fleur.Document.docImportNode(doc, importedNode.attributes[i++], true));
			}
			if (deep) {
				lj = importedNode.childNodes.length;
				while (j < lj) {
					node.appendChild(Fleur.Document.docImportNode(doc, importedNode.childNodes[j++], true));
				}
			}
			break;
		case Fleur.Node.DOCUMENT_FRAGMENT_NODE:
			node = doc.createDocumentFragment();
			if (deep) {
				lj = importedNode.childNodes.length;
				while (j < lj) {
					node.appendChild(Fleur.Document.docImportNode(doc, importedNode.childNodes[j++], true));
				}
			}
			break;
		case Fleur.Node.DOCUMENT_NODE:
		case Fleur.Node.DOCUMENT_TYPE_NODE:
			throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	return node;
};
Fleur.Document.prototype._serializeToString = function(indent) {
	var s, i, l;
	for (i = 0, l = this.childNodes.length; i < l; i++) {
		s += this._serializeToString(this.childNodes[i], indent, "");
	}
	return s;
};
Fleur.Document.prototype.compileXslt = function() {
	return this.documentElement.compileXslt();
};
Fleur.Document.prototype.evaluate = function(expression, contextNode, env, type, xpresult) {
	contextNode = contextNode || this;
	env = env || {};
	if (!env.nsresolver) {
		var nsResolver;
		if (this.documentElement) {
			nsResolver = function(element) {
				return {
					defaultNamespace: element.getAttribute("xmlns"),
					nsresolver: element.ownerDocument.createNSResolver(element),
					lookupNamespaceURI: function(prefix) {
						if (prefix === "_") {
							return this.defaultNamespace;
						}
						return this.nsresolver.lookupNamespaceURI(prefix);
					},
					declareNamespace: function(prefix, uri) {
						return this.nsresolver.declareNamespace(prefix, uri);
					}
				};
			};
			env.nsresolver = nsResolver(this.documentElement);
		} else if (this.nodeType === Fleur.Node.DOCUMENT_NODE) {
			nsResolver = function(document) {
				return {
					nsresolver: document.createNSResolver(),
					lookupNamespaceURI: function(prefix) {
						return this.nsresolver.lookupNamespaceURI(prefix);
					},
					declareNamespace: function(prefix, uri) {
						return this.nsresolver.declareNamespace(prefix, uri);
					}
				};
			};
			env.nsresolver = nsResolver(this);
		}
	}
	type = type || Fleur.XPathResult.ANY_TYPE;
	if (!xpresult) {
		return new Fleur.XPathResult(this, expression, contextNode, env, type);
	}
	xpresult.document = this;
	xpresult.expression = expression;
	xpresult.contextNode = contextNode;
	xpresult.env = env;
	xpresult.resultType = type;
	xpresult._index = 0;
	return xpresult;
};
Fleur.Document.prototype.createExpression = function(expression) {
	expression = expression || "";
	return Fleur.XPathEvaluator._xq2js(expression);
};
Fleur.Document.prototype.createNSResolver = function(node) {
	return new Fleur.XPathNSResolver(node);
};
Fleur.DocumentFragment = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.DOCUMENT_FRAGMENT_NODE;
	this.nodeName = "#document-fragment";
};
Fleur.DocumentFragment.prototype = new Fleur.Node();
Object.defineProperties(Fleur.DocumentFragment.prototype, {
	nodeValue: {
		set: function() {},
		get: function() {
			return null;
		}
	}
});
Fleur.DocumentType = function() {
	this.nodeType = Fleur.Node.DOCUMENT_TYPE_NODE;
	this.entities = new Fleur.NamedNodeMap();
	this.entities.ownerNode = this;
	this.notations = new Fleur.NamedNodeMap();
	this.notations.ownerNode = this;
};
Fleur.DocumentType.prototype = new Fleur.Node();
Object.defineProperties(Fleur.DocumentType.prototype, {
	nodeValue: {
		set: function() {},
		get: function() {
			return null;
		}
	}
});
Fleur.DocumentType.prototype.createEntity = function(entname) {
	var node = new Fleur.Entity();
	node.localName = node.nodeName = entname;
	return node;
};
Fleur.DocumentType.prototype.hasEntity = function(entname) {
	return !!this.entities.getNamedItem(entname);
};
Fleur.DocumentType.prototype.setEntity = function(entname, value) {
	var entity;
	if (this.hasEntity(entname)) {
		return;
	}
	entity = this.createEntity(entname);
	entity.nodeValue = Fleur.DocumentType.resolveEntities(this, value);
	this.entities.setNamedItem(entity);
};
Fleur.DocumentType.prototype.getEntity = function(entname) {
	var i = 0, l = this.entities.length;
	while (i < l) {
		if (this.entities[i].nodeName === entname) {
			return this.entities[i].nodeValue;
		}
		i++;
	}
	return null;
};
Fleur.DocumentType.resolveEntities = function(doctype, s) {
	var offset = 0, index, entityname, entityvalue = null;
	while ((index = s.indexOf("&", offset)) !== -1) {
		entityname = s.substring(index + 1, s.indexOf(";", index + 1));
		switch (entityname) {
			case "amp":
				entityvalue = "&";
				break;
			case "lt":
				entityvalue = "\x01";
				break;
			case "gt":
				entityvalue = ">";
				break;
			case "apos":
				entityvalue = "'";
				break;
			case "quot":
				entityvalue = '"';
				break;
			default:
				if (entityname.charAt(0) === "#") {
					entityvalue = String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
				} else if (doctype) {
					entityvalue = doctype.getEntity(entityname);
				}
		}
		if (entityvalue) {
			s = s.substr(0, index) + entityvalue + s.substr(index + entityname.length + 2);
			offset = index + entityvalue.length;
		} else {
			break;
		}
	}
	return s.split("\r\n").join("\n");
};
Fleur.DOMConfiguration = function() {
	this._parameters = {
		"canonical-form": false,
		"cdata-sections": true,
		"check-character-normalization": false,
		"comments": true,
		"datatype-normalization": false,
		"element-content-whitespace": true,
		"entities": true,
		"error-handler": function(){},
		"infoset": true,
		"namespaces": true,
		"namespace-declarations": true,
		"normalize-characters": false,
		"schema-location": null,
		"schema-type" : null,
		"split-cdata-sections": true,
		"validate": false,
		"validate-if-schema": false,
		"well-formed": true
	};
	this.parametersNames = new Fleur.DOMStringList();
	for (var p in this._parameters) {
		if (this._parameters.hasOwnProperty(p)) {
			this.parametersNames.push(p);
		}
	}
};
Fleur.DOMConfiguration.prototype.canSetParameter = function(pname, value) {
	return this.parametersNames.contains(pname) && (typeof value === typeof this._parameters[pname]);
};
Fleur.DOMConfiguration.prototype.setParameter = function(pname, value) {
	this._parameters[pname] = value;
};
Fleur.DOMConfiguration.prototype.getParameter = function(pname) {
	return this._parameters[pname];
};
Fleur.DOMError = function() {};
Fleur.DOMError.SEVERITY_WARNING = 1;
Fleur.DOMError.SEVERITY_ERROR = 2;
Fleur.DOMError.SEVERITY_FATAL_ERROR = 3;
Fleur.DOMErrorHandler = function() {};
Fleur.DOMException = function(code) {
	this.code = code;
};
Fleur.DOMException.INDEX_SIZE_ERR = 1;
Fleur.DOMException.DOMSTRING_SIZE_ERR = 2;
Fleur.DOMException.HIERARCHY_REQUEST_ERR = 3;
Fleur.DOMException.WRONG_DOCUMENT_ERR = 4;
Fleur.DOMException.INVALID_CHARACTER_ERR = 5;
Fleur.DOMException.NO_DATA_ALLOWED_ERR = 6;
Fleur.DOMException.NO_MODIFICATION_ALLOWED_ERR = 7;
Fleur.DOMException.NOT_FOUND_ERR = 8;
Fleur.DOMException.NOT_SUPPORTED_ERR = 9;
Fleur.DOMException.INUSE_ATTRIBUTE_ERR = 10;
Fleur.DOMException.INVALID_STATE_ERR = 11;
Fleur.DOMException.SYNTAX_ERR = 12;
Fleur.DOMException.INVALID_MODIFICATION_ERR = 13;
Fleur.DOMException.NAMESPACE_ERR = 14;
Fleur.DOMException.INVALID_ACCESS_ERR = 15;
Fleur.DOMException.VALIDATION_ERR = 16;
Fleur.DOMException.TYPE_MISMATCH_ERR = 17;
Fleur.DOMImplementationList = function() {};
Fleur.DOMImplementationList.prototype = new Array();
Fleur.DOMImplementationList.prototype.item = function(index) {
	return this[index];
};
Fleur._DOMImplementations = new Fleur.DOMImplementationList();
Fleur.DOMImplementation = function() {};
Fleur.DOMImplementation.prototype._Features = [
	["core", "3.0"],
	["core", "2.0"],
	["core", "1.0"],
	["xml", "3.0"],
	["xml", "2.0"],
	["xml", "1.0"],
	["xpath", "3.0"],
	["xpath", "2.0"],
	["xpath", "1.0"]
];
Fleur.DOMImplementation.prototype.createDocument = function(namespaceURI, qualifiedName, doctype, mediatype) {
	var doc = new Fleur.Document();
	if (doctype && (doctype.ownerDocument || doctype._implementation !== this)) {
		throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
	}
	doc.implementation = this;
	if (qualifiedName) {
		doc.appendChild(doc.createElementNS(namespaceURI, qualifiedName));
	}
	if (doctype) {
		doctype.ownerDocument = doc;
		doc.doctype = doctype;
	}
	doc.mediatype = mediatype;
	return doc;
};
Fleur.DOMImplementation.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
	var dt = new Fleur.DocumentType();
	if (!Fleur.Node.QNameReg.test(qualifiedName)) {
		if (Fleur.Node.QNameCharsReg.test(qualifiedName)) {
			throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
		} else {
			throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
		}
	}
	dt.nodeName = dt.name = qualifiedName;
	dt.entities = new Fleur.NamedNodeMap();
	dt.entities.ownernode = dt;
	dt.notations = new Fleur.NamedNodeMap();
	dt.notations.ownerNode = dt;
	dt.publicId = publicId;
	dt.systemId = systemId;
	dt._implementation = this;
	return dt;
};
Fleur.DOMImplementation.prototype.getFeature = function(feature, version) {
	return this.hasFeature(feature, version) ? this : null;
};
Fleur.DOMImplementation.prototype.hasFeature = function(feature, version) {
	var i = 0, l = this._Features.length;
	if (version === "") {
		version = null;
	}
	feature = feature.toLowerCase();
	while (i < l) {
		if (this._Features[i][0] === feature && (!version || this._Features[i][1] === version)) {
			return true;
		}
		i++;
	}
	return false;
};
Fleur._DOMImplementation = new Fleur.DOMImplementation();
Fleur._DOMImplementations.push(Fleur._DOMImplementation);
Fleur.DOMImplementationSource = function() {};
Fleur.DOMImplementationSource.prototype.getDOMImplementation = function(features) {
	var f, l0 = Fleur._DOMImplementations.length, l1, i = 0, j = 0, version = /^[0-9]*\.[0-9]*$/;
	f = features.split(" ");
	l1 = f.length;
	while (j < l1) {
		if (j < l1 - 1 && !version.test(f[j + 1])) {
			f.splice(j + 1, 0, "");
			f[j + 1] = null;
			l1++;
		}
		j += 2;
	}
	while (i < l0) {
		j = 0;
		while (j < l1 && Fleur._DOMImplementations.item(i).hasFeature(f[j], f[j + 1])) {
			j += 2;
		}
		if (j >= l1) {
			return Fleur._DOMImplementations.item(i);
		}
		i++;
	}
};
Fleur.DOMImplementationSource.prototype.getDOMImplementationList = function(features) {
	var f, l0 = Fleur._DOMImplementations.length, l1, i = 0, j = 0, version = /^[0-9]*\.[0-9]*$/g, list = new Fleur.DOMImplementationList();
	f = features.split(" ");
	l1 = f.length;
	while (j < l1) {
		if (j < l1 - 1 && !version.test(f[j + 1])) {
			f.splice(j + 1, 0, "");
			f[j + 1] = null;
			l1++;
		}
		j += 2;
	}
	while (i < l0) {
		j = 0;
		while (j < l1 && Fleur._DOMImplementations.item(i).hasFeature(f[j], f[j + 1])) {
			j += 2;
		}
		if (j >= l1) {
			list.push(Fleur._DOMImplementations.item(i));
		}
		i++;
	}
	return list;
};
Fleur.DOMLocator = function() {};
Fleur.DOMParser = function() {};
Fleur.DOMParser._appendFromCSVString = function(node, s, config) {
	var offset = 0, end, doc = node.ownerDocument || node, eltnode, sep, head = config.header === "present", ignore;
	var headers = [];
	var first = head;
	var col = 0;
	var rowcat = "";
	var key = config.key ? parseInt(config.key, 10) : null;
	var currparent;
	var mapnode;
	sep = config.separator ? decodeURIComponent(config.separator) : ",";
	s = s.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
	if (s.charAt(s.length - 1) !== "\n") {
		s += "\n";
	}
	ignore = Math.max(parseInt(config.ignore, 10) || 0, 0);
	end = s.length;
	if (ignore !== 0) {
		while (offset !== end) {
			if (s.charAt(offset) === "\n") {
				ignore--;
				if (ignore === 0) {
					offset++;
					break;
				}
			}
			offset++;
		}
	}
	if (key !== null) {
		mapnode = doc.createMap();
		currparent = new Fleur.Entry();
		currparent._setOwnerDocument(node);
		currparent.childNodes = new Fleur.NodeList();
		currparent.children = new Fleur.NodeList();
	} else {
		currparent = doc.createArray();
	}
	while (offset !== end) {
		var v = "";
		if (s.charAt(offset) === '"') {
			offset++;
			do {
				if (s.charAt(offset) !== '"') {
					v += s.charAt(offset);
					offset++;
				} else {
					if (s.substr(offset, 2) === '""') {
						v += '"';
						offset += 2;
					} else {
						offset++;
						break;
					}
				}
			} while (offset !== end);
		} else {
			while (s.substr(offset, sep.length) !== sep && s.charAt(offset) !== "\n") {
				v += s.charAt(offset);
				offset++;
			}
		}
		if (first) {
			headers.push(v);
			if (col === key) {
				eltnode = doc.createElement(headers[col]);
				eltnode.appendChild(mapnode);
				node.appendChild(eltnode);
			}
		} else {
			rowcat += v;
			if (col === key) {
				currparent.nodeName = currparent.localName = v;
			} else {
				if (head) {
					eltnode = doc.createElement(headers[col]);
					if (v !== "") {
						eltnode.appendChild(doc.createTextNode(v));
					}
					currparent.appendChild(eltnode);
				} else {
					currparent.appendChild(doc.createTextNode(v));
				}
			}
		}
		if (s.charAt(offset) === "\n") {
			if (!first && rowcat !== "") {
				if (key !== null) {
					mapnode.setEntryNode(currparent);
					currparent = new Fleur.Entry();
					currparent._setOwnerDocument(node);
					currparent.childNodes = new Fleur.NodeList();
					currparent.children = new Fleur.NodeList();
				} else {
					node.appendChild(currparent);
					currparent = doc.createArray();
				}
			}
			first = false;
			col = 0;
			rowcat = "";
		} else {
			col++;
		}
		offset++;
	}
	if (key !== null && !head) {
		node.appendChild(mapnode);
	}
};
Fleur.DOMParser._appendFromXMLString = function(node, s) {
	var ii, ll, text, entstart, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrs, parents = [], doc = node.ownerDocument || node, currnode = node, eltnode, attrnode, c,
		seps_pi = " \t\n\r?", seps_dtd = " \t\n\r[>", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r",
		n, namespaces = {}, newnamespaces = {}, pindex, prefix, localName, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue;
	while (offset !== end) {
		text = "";
		c = s.charAt(offset);
		while (c !== "<" && offset !== end) {
			if (c === "&") {
				c = s.charAt(++offset);
				entstart = offset;
				entityname = "";
				while (c !== ";" && offset !== end) {
					entityname += c;
					c = s.charAt(++offset);
				}
				if (offset === end) {
					break;
				}
				entityvalue = "";
				switch (entityname) {
					case "amp":
						text += "&";
						break;
					case "lt":
						text += "<";
						break;
					case "gt":
						text += ">";
						break;
					case "apos":
						text += "'";
						break;
					case "quot":
						text += '"';
						break;
					default:
						if (entityname.charAt(0) === "#") {
							text += String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
						} else if (doc.doctype) {
							entityvalue = doc.doctype.getEntity(entityname);
							s = s.substr(0, entstart) + entityvalue + s.substr(offset + 1);
							offset = entstart;
							end = s.length;
						}
				}
			} else {
				text += c;
			}
			c = s.charAt(++offset);
		}
		if (text !== "") {
			currnode.appendChild(doc.createTextNode(text));
		}
		if (offset === end) {
			break;
		}
		offset++;
		if (s.charAt(offset) === "!") {
			offset++;
			if (s.substr(offset, 2) === "--") {
				offset += 2;
				index = s.indexOf("-->", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					currnode.appendChild(doc.createComment(text));
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			} else if (s.substr(offset, 7) === "[CDATA[") {
				offset += 7;
				index = s.indexOf("]]>", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					currnode.appendChild(doc.createCDATASection(text));
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			} else if (s.substr(offset, 7) === "DOCTYPE") {
				offset += 7;
				index = s.indexOf(">", offset);
				while (seps.indexOf(c) !== -1) {
					c = s.charAt(offset++);
				}
				nodename = "";
				while (seps_dtd.indexOf(c) === -1) {
					nodename += c;
					c = s.charAt(offset++);
				}
				while (seps.indexOf(c) !== -1) {
					c = s.charAt(offset++);
				}
				dtdtype = "";
				while (seps_dtd.indexOf(c) === -1) {
					dtdtype += c;
					c = s.charAt(offset++);
				}
				if (dtdtype === "PUBLIC" || dtdtype === "SYSTEM") {
					if (dtdtype === "PUBLIC") {
						while (seps.indexOf(c) !== -1) {
							c = s.charAt(offset++);
						}
						dtdpublicid = "";
						ii = offset;
						ll = Math.min(index - 1, s.indexOf(c, offset));
						while (ii < ll) {
							dtdpublicid += s.charAt(ii++);
						}
						offset += dtdpublicid.length + 1;
						c = s.charAt(offset++);
					}
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
					dtdsystemid = "";
					ii = offset;
					ll = Math.min(index - 1, s.indexOf(c, offset));
					while (ii < ll) {
						dtdsystemid += s.charAt(ii++);
					}
					offset += dtdsystemid.length + 1;
					c = s.charAt(offset++);
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
				} else {
					dtdpublicid = dtdsystemid = null;
				}
				currnode.appendChild(doc.doctype = doc.implementation.createDocumentType(nodename, dtdpublicid, dtdsystemid));
				doc.doctype.ownerDocument = doc;
				if (c === "[") {
					index = s.indexOf("]", offset);
					c = s.charAt(offset++);
					while (c !== "]" && offset < end) {
						while (seps.indexOf(c) !== -1) {
							c = s.charAt(offset++);
						}
						if (c === "]") {
							break;
						}
						if (s.substr(offset, 7) === "!ENTITY") {
							offset += 7;
							c = s.charAt(offset++);
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (c === "%") {
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							nodename = "";
							while (seps_dtd.indexOf(c) === -1) {
								nodename += c;
								c = s.charAt(offset++);
							}
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (s.substr(offset - 1, 6) === "SYSTEM") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							} else if (s.substr(offset -1, 6) === "PUBLIC") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
								while (seps_dtd.indexOf(c) === -1) {
									c = s.charAt(offset++);
								}
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							entityvalue = "";
							ii = offset;
							ll = Math.min(index - 1, s.indexOf(c, offset));
							while (ii < ll) {
								entityvalue += s.charAt(ii++);
							}
							offset += entityvalue.length + 1;
							c = s.charAt(offset++);
							doc.doctype.setEntity(nodename, entityvalue);
						} else if (s.substr(offset, 9) === "!NOTATION") {
							offset += 9;
							c = s.charAt(offset++);
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							nodename = "";
							while (seps_dtd.indexOf(c) === -1) {
								nodename += c;
								c = s.charAt(offset++);
							}
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (s.substr(offset - 1, 6) === "SYSTEM") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							} else if (s.substr(offset -1, 6) === "PUBLIC") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
								while (seps_dtd.indexOf(c) === -1) {
									c = s.charAt(offset++);
								}
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							if (c === '"' || c === "'") {
								notationvalue = "";
								ii = offset;
								ll = Math.min(index - 1, s.indexOf(c, offset));
								while (ii < ll) {
									notationvalue += s.charAt(ii++);
								}
								offset += notationvalue.length + 1;
								c = s.charAt(offset++);
							}
						}
						offset = s.indexOf(">", offset - 1) + 1;
						c = s.charAt(offset++);
					}
					index = s.indexOf(">", offset);
				}
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset++;
			}
		} else if (s.charAt(offset) === "?") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_pi.indexOf(c) === -1) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf("?>", offset - 1);
			if (index === -1) {
				index = end;
			}
			if (nodename === "xml") {
			} else if (nodename !== "") {
				text = "";
				ii = offset;
				while (ii < index) {
					text += s.charAt(ii++);
				}
				text = text.replace(/\x01/gm,"<");
				currnode.appendChild(doc.createProcessingInstruction(nodename, index === offset - 1 ? "" : text));
			}
			if (index === end) {
				break;
			}
			offset = index + 2;
		} else if (s.charAt(offset) === "/") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_close.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			if (nodename === currnode.nodeName) {
				n = parents.pop();
				namespaces = {};
				for (prefix in n.namespaces) {
					if (n.namespaces.hasOwnProperty(prefix)) {
						namespaces[prefix] = n.namespaces[prefix];
					}
				}
				currnode = n.node;
			} else {
				while (parents.length !== 0) {
					n = parents.pop();
					if (nodename === n.node.nodeName) {
						namespaces = {};
						for (prefix in n.namespaces) {
							if (n.namespaces.hasOwnProperty(prefix)) {
								namespaces[prefix] = n.namespaces[prefix];
							}
						}
						currnode = n.node;
						break;
					}
				}
			}
			offset = s.indexOf(">", offset - 1) + 1;
			if (offset === 0) {
				break;
			}
		} else {
			c = s.charAt(offset++);
			nodename = "";
			while (seps_elt.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf(">", offset - 1);
			if (nodename !== "") {
				newnamespaces = {};
				for (prefix in namespaces) {
					if (namespaces.hasOwnProperty(prefix)) {
						newnamespaces[prefix] = namespaces[prefix];
					}
				}
				attrs = {};
				while (offset <= end) {
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
					if (c === "/" || c === ">" || offset === end) {
						break;
					}
					attrname = "";
					while (seps_attr.indexOf(c) === -1 && offset <= end) {
						attrname += c;
						c = s.charAt(offset++);
					}
					while (seps.indexOf(c) !== -1 && offset <= end) {
						c = s.charAt(offset++);
					}
					if (c === "=") {
						c = s.charAt(offset++);
						while (seps.indexOf(c) !== -1 && offset <= end) {
							c = s.charAt(offset++);
						}
						attrvalue = "";
						if (c === "'" || c === "\"") {
							attrvalue = "";
							ii = offset;
							ll = Math.min(index - 1, s.indexOf(c, offset));
							while (ii < ll) {
								attrvalue += s.charAt(ii++);
							}
							offset += attrvalue.length + 1;
							c = s.charAt(offset++);
						} else {
							while (seps_elt.indexOf(c) === -1 && offset <= end) {
								attrvalue += c;
								c = s.charAt(offset++);
							}
						}
					} else {
						attrvalue = attrname;
					}
					pindex = attrname.indexOf(":");
					prefix = pindex !== -1 ? attrname.substr(0, pindex) : " ";
					localName = pindex !== -1 ? attrname.substr(pindex + 1) : attrname;
					if (!attrs[prefix]) {
						attrs[prefix] = {};
					}
					attrs[prefix][localName] = attrvalue;
					if (prefix === "xmlns") {
						newnamespaces[localName] = attrvalue;
					} else if (prefix === " " && localName === "xmlns") {
						newnamespaces[" "] = attrvalue;
					}
				}
				pindex = nodename.indexOf(":");
				eltnode = doc.createElementNS(newnamespaces[pindex !== -1 ? nodename.substr(0, pindex) : " "], nodename);
				for (prefix in attrs) {
					if (attrs.hasOwnProperty(prefix)) {
						for (attrname in attrs[prefix]) {
							if (attrs[prefix].hasOwnProperty(attrname)) {
								attrnode = doc.createAttributeNS(prefix === "xmlns" || prefix === " " && attrname === "xmlns" ? "http://www.w3.org/2000/xmlns/" : prefix === "xml" ? "http://www.w3.org/XML/1998/namespace" : prefix !== " " ? newnamespaces[prefix] : null, prefix !== " " ? prefix + ":" + attrname : attrname);
								eltnode.setAttributeNodeNS(attrnode);
								attrnode.appendChild(doc.createTextNode(Fleur.DocumentType.resolveEntities(doc.doctype, attrs[prefix][attrname]).replace(/\x01/gm,"<")));
							}
						}
					}
				}
				currnode.appendChild(eltnode);
				if (s.charAt(offset - 1) !== "/") {
					parents.push({node: currnode, namespaces: namespaces});
					currnode = eltnode;
					namespaces = {};
					for (prefix in newnamespaces) {
						if (newnamespaces.hasOwnProperty(prefix)) {
							namespaces[prefix] = newnamespaces[prefix];
						}
					}
				}
			}
			offset = index + 1;
			if (offset === 0) {
				break;
			}
		}
	}
};
Fleur.DOMParser._parseTextAdvance = function(n, states, grammar, selection) {
	for (var i = 0; i < states[n].length; i++) {
		var state = states[n][i];
		if (state[2] === state[1].length) {
			var join = [];
			var prevtext = false;
			for (var j = 0, l = state[4].length; j < l ; j++) {
				if (state[4][j] !== "") {
					if (state[1][j][0] === 2 && !state[1][j][2]) {
						if (prevtext && typeof (state[4][j][1][0]) === "string") {
							join[join.length - 1] += state[4][j][1][0];
						} else {
							join = join.concat(state[4][j][1]);
							prevtext = typeof (state[4][j][1][0]) === "string";
						}
					} else if (state[1][j][2]) {
						if (state[1][j][0] === 2) {
							join.push([state[1][j][2], state[4][j][1]]);
							prevtext = false;
						} else {
							var joinitem = state[4][j];
							if (prevtext) {
								join[join.length - 1] += joinitem;
							} else if (joinitem !== "") {
								join.push(joinitem);
								prevtext = true;
							}
						}
					}
				}
			}
			state[4] = [[1, join]];
			for (var k = 0; k < states[state[3]].length; k++) {
				var state2 = states[state[3]][k];
				if (state2[1][state2[2]] && state2[1][state2[2]][0] === 2 && state2[1][state2[2]][1] === state[0]) {
					var data3 = state2[4].slice(0);
					data3.push(state[4][0]);
					states[n].push([state2[0], state2[1], state2[2] + 1, state2[3], data3]);
				}
			}
		} else {
			if (state[1][state[2]][0] === 2) {
				var next = state[1][state[2]][1];
				for (var i2 = 0, l2 = grammar[next].length; i2 < l2; i2++) {
					var r = grammar[next][i2];
					if (selection.indexOf(r) === -1) {
						if (r.length > 0) {
							selection.push(r);
							states[n].push([next, r, 0, n, []]);
						} else {
							var data4 = state[4].slice(0);
							data4.push("");
							states[n].push([state[0], state[1], state[2] + 1, state[3], data4]);
						}
					}
				}
			}
		}
	}
};
Fleur.DOMParser._appendFromGrammarString = function(node, s, grammar) {
	var states = [[]];
	var selection = [];
	for (var i = 0, l = grammar[0][0].length; i < l; i++) {
		selection[i] = grammar[0][0][i];
		states[0][i] = [0, grammar[0][0][i], 0, 0, []];
	}
	Fleur.DOMParser._parseTextAdvance(0, states, grammar[0], selection);
	for (var j = 0; j < s.length; j++) {
		states[j + 1] = [];
		for (var k = 0; k < states[j].length; k++) {
			var state = states[j][k];
			var c = s.charAt(j);
			if (state[1][state[2]]) {
				if ((state[1][state[2]][0] === 0 && state[1][state[2]][1] === c) || (state[1][state[2]][0] === 1 && state[1][state[2]][1].test(c))) {
					var data = state[4].slice(0);
					data.push(c);
					states[j + 1].push([state[0], state[1], state[2] + 1, state[3], data]);
				}
			}
		}
		Fleur.DOMParser._parseTextAdvance(j + 1, states, grammar[0], []);
		if (states[states.length - 1].length === 0) {
			return "error";
		}
	}
	var laststates = states[states.length - 1];
	for (i = 0, l = laststates.length; i < l; i++) {
		if (laststates[i][0] === 0 && laststates[i][1].length === laststates[i][2] && laststates[i][3] === 0) {
			Fleur.DOMParser._appendFromArray(node, grammar[1], [laststates[i][4][0]]);
			break;
		}
	}
	return node;
};
Fleur.DOMParser._appendFromArray = function(node, names, os) {
	var i, l, o, n, nodename, doc = node.ownerDocument || node;
	for (i = 0, l = os.length; i < l; i++) {
		o = os[i];
		if (typeof o === "string") {
			n = doc.createTextNode(o);
		} else {
			nodename = names[1][o[0]];
			switch (nodename[0]) {
				case Fleur.Node.ELEMENT_NODE:
					n = doc.createElementNS(names[0][nodename[1]], nodename[2]);
					Fleur.DOMParser._appendFromArray(n, names, o[1]);
					break;
				case Fleur.Node.ATTRIBUTE_NODE:
					n = doc.createAttributeNS(names[0][nodename[1]], nodename[2]);
					n.nodeValue = o[1][0];
					node.setAttributeNodeNS(n);
					continue;
				case Fleur.Node.CDATA_NODE:
					n = doc.createCDATASection(o[1][0]);
					break;
				case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
					n = doc.createProcessingInstruction(o[1], o[2]);
					break;
				case Fleur.Node.COMMENT_NODE:
					n = doc.createComment(o[1][0]);
					break;
			}
		}
		node.appendChild(n);
	}
	return node;
};
Fleur.DOMParser.prototype.parseFromArray = function(o) {
	var doc, impl, domSource = new Fleur.DOMImplementationSource();
	impl = domSource.getDOMImplementation("XML");
	doc = impl.createDocument();
	return Fleur.DOMParser._appendFromArray(doc, o[0], o[1]);
};
Fleur.DOMParser._appendFromEXML = function(node, enode) {
	var i, l;
	if (enode.nodeType === Fleur.Node.ELEMENT_NODE) {
		switch (enode.localName) {
			case "element":
		}
		i = 0;
		l = enode.childNodes.length;
		while (i < l) {
			i++;
		}
	} else if (enode.nodeType === Fleur.Node.TEXT_NODE && enode.textContent.trim() !== "") {
		node.appendChild(node.ownerDocument.importNode(enode, true));
	}
};
Fleur.DOMParser._appendFromJSON = function(node, o) {
	if (o === null) {
		return;
	}
	var doc = node.ownerDocument || node, n;
	switch (typeof o) {
		case "string":
			n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "string", o);
			break;
		case "number":
			n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "double", o);
			break;
		case "boolean":
			n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "boolean", o);
			break;
		default:
			if (o instanceof RegExp) {
				n = doc.createTypedValueNode("http://www.agencexml.com/types", "regex", o);
			} else if (typeof o.length === "number") {
				n = doc.createArray();
				for (var i = 0, l = o.length; i < l; i++) {
					Fleur.DOMParser._appendFromJSON(n, o[i]);
				}
			} else {
				n = doc.createMap();
				for (var k in o) {
					if (o.hasOwnProperty(k)) {
						var e = doc.createEntry(k);
						n.setEntryNode(e);
						Fleur.DOMParser._appendFromJSON(e, o[k]);
					}
				}
			}
	}
	node.appendChild(n);
	return node;
};
Fleur.DOMParser.prototype.parseFromJSON = function(o) {
	var doc, impl, domSource = new Fleur.DOMImplementationSource();
	impl = domSource.getDOMImplementation("XML");
	doc = impl.createDocument();
	return Fleur.DOMParser._appendFromJSON(doc, o);
};
Fleur.DOMParser._appendFromString = function(node, s, mediatype, grammar) {
	var media = mediatype.split(";"), config = {}, param, paramreg = /^\s*(\S*)\s*=\s*(\S*)\s*$/, i = 1, l = media.length, handler;
	while (i < l) {
		param = paramreg.exec(media[i]);
		config[param[1]] = param[2];
		i++;
	}
	handler = Fleur.DOMParser.Handlers[media[0].replace(/^\s+|\s+$/gm,'')];
	if (!handler) {
		return;
	}
	handler(node, s, config, grammar);
	return node;
};
Fleur.DOMParser.Handlers = {
	"text/csv": function(node, s, config) {
		Fleur.DOMParser._appendFromCSVString(node, s, config);
	},
	"application/xquery": function(node, s, config) {
		Fleur.DOMParser.xpatharr = Fleur.XPathEvaluator._xp2js(s, "", "");
		eval("Fleur.DOMParser.xpatharr = [Fleur.XQueryX.module,[[Fleur.XQueryX.mainModule,[[Fleur.XQueryX.queryBody,[" + Fleur.DOMParser.xpatharr + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]]]];');
		Fleur.DOMParser._appendFromArray(node, Fleur.XQueryXNames, [Fleur.DOMParser.xpatharr]);
		delete Fleur.DOMParser.xpatharr;
	},
	"application/json": function(node, s, config) {
		eval("Fleur.DOMParser.json = " + s);
		Fleur.DOMParser._appendFromJSON(node, Fleur.DOMParser.json);
		delete Fleur.DOMParser.json;
	},
	"application/xml": function(node, s, config) {
		Fleur.DOMParser._appendFromXMLString(node, s);
	},
	"application/exml+xml": function(node, s, config) {
		var enode = node.ownerDocument.implementation.createDocument();
		Fleur.DOMParser._appendFromXMLString(enode, s);
		Fleur.DOMParser._appendFromEXML(node, enode.documentElement);
		enode.removeChild(enode.documentElement);
		enode = null;
	},
	"text/plain":  function(node, s, config, grammar) {
		Fleur.DOMParser._appendFromGrammarString(node, s, grammar);
	}
};
Fleur.DOMParser.Handlers["text/xml"] = Fleur.DOMParser.Handlers["application/xml"];
Fleur.DOMParser.Handlers["text/json"] = Fleur.DOMParser.Handlers["application/json"];
Fleur.DOMParser.prototype.parseFromString = function(s, mediatype, grammar) {
	var doc, impl, domSource = new Fleur.DOMImplementationSource();
	impl = domSource.getDOMImplementation("XML");
	doc = impl.createDocument();
	return Fleur.DOMParser._appendFromString(doc, s, mediatype, grammar);
};
Fleur.DOMStringList = function() {};
Fleur.DOMStringList.prototype = new Array();
Fleur.DOMStringList.prototype.item = function(index) {
	return this[index];
};
Fleur.DOMStringList.prototype.contains = function(str) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i] === str) {
			return true;
		}
		i++;
	}
	return false;
};
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
Fleur.Entity = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ENTITY_NODE;
};
Fleur.Entity.prototype = new Fleur.Node();
Fleur.Entry = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ENTRY_NODE;
};
Fleur.Entry.prototype = new Fleur.Node();
Fleur.Function = function(namespaceURI, nodeName, jsfunc, xqxfunc, argtypes, needctx, needcallback, restype, updating) {
	Fleur.Node.apply(this);
	this._setNodeNameLocalNamePrefix(namespaceURI, nodeName);
	this.jsfunc = jsfunc;
	this.xqxfunc = xqxfunc;
	this.argtypes = argtypes;
	this.needctx = needctx;
	this.needcallback = needcallback;
	this.restype = restype;
	this.updating = Boolean(updating);
};
Fleur.Function.prototype = new Fleur.Node();
Fleur.GrammarParser = function() {};
Fleur.GrammarParser._skipSpaces = function(s, offset) {
	var i = offset;
	var c = s.charAt(i);
	var pre = "";
	do {
		if (c !== "\n" && c !== "\r" && c !== "\t" && c !== " ") {
			return pre === "\n" ? i - 1 : i;
		}
		pre = c;
		c = s.charAt(++i);
	} while (c !== "");
	return i;
};
Fleur.GrammarParser._getName = function(s) {
	var i = 0;
	var o = s.charAt(0);
	while (o !== "" && "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-$".indexOf(o) !== -1) {
		o = s.charAt(++i);
	}
	return s.substr(0, i).toLowerCase();
};
Fleur.GrammarParser._bases = {
	b: "01",
	d: "0123456789",
	x: "0123456789abcdef"
};
Fleur.GrammarParser._getChar = function(s, base) {
	var i = 0;
	var o = s.charAt(0).toLowerCase();
	var c = 0;
	while (base.indexOf(o) !== -1) {
		c = c * base.length + base.indexOf(o);
		o = s.charAt(++i).toLowerCase();
	}
	return [i, c];
};
Fleur.GrammarParser._getTerm = function(s, gram) {
	var i = 0;
	var o = s.charAt(i);
	var prevo = "";
	var t = [];
	var l;
	var typ = 0;
	var ref = 1;
	var reg;
	var newrulename;
	var base;
	var c1, c2;
	var term;
	var min = 1;
	var max = 1;
	prevo = o;
	if ("0123456789".indexOf(o) !== -1) {
		min = 0;
		do {
			min = min * 10 + Fleur.GrammarParser._bases.d.indexOf(o);
			o = s.charAt(++i);
		} while ("0123456789".indexOf(o) !== -1);
	}
	if (o === "*") {
		if (prevo === "*") {
			min = 0;
		}
		o = s.charAt(++i);
		if ("0123456789".indexOf(o) !== -1) {
			max = 0;
			do {
				max = max * 10 + Fleur.GrammarParser._bases.d.indexOf(o);
				o = s.charAt(++i);
			} while ("0123456789".indexOf(o) !== -1);
		} else {
			max = Number.POSITIVE_INFINITY;
		}
	} else {
		max = min;
	}
	if (min !== max) {
		newrulename = "$" + gram[0].length;
		if (min !== 0) {
			reg = "\r\n" + newrulename + " = " + min + s.substr(i) + " " + (max === Number.POSITIVE_INFINITY ? "*" : (max - min)) + s.substr(i);
		} else if (max !== Number.POSITIVE_INFINITY){
			reg = "\r\n" + newrulename + " = " + max + "[" + s.substr(i) + "]";
		} else {
			reg = "\r\n" + newrulename + " = / ^" + newrulename + " " + s.substr(i);
		}
		t.push([2, newrulename]);
		gram[0] += reg;
		return t;
	}
	if (min === 0) {
		return [[]];
	}
	if (o === "(") {
		newrulename = "$" + gram[0].length;
		reg = "\r\n" + newrulename + " = ";
		do {
			o = s.charAt(++i);
			if (o === ')') {
				if (prevo !== '\\') {
					t.push([2, newrulename]);
					gram[0] += reg;
					break;
				}
			}
			reg += o;
		} while (o !== "");
	} else if (o === "[") {
		newrulename = "$" + gram[0].length;
		reg = "\r\n" + newrulename + " = / ";
		do {
			o = s.charAt(++i);
			if (o === ']') {
				if (prevo !== '\\') {
					t.push([2, newrulename]);
					gram[0] += reg;
					break;
				}
			}
			reg += o;
		} while (o !== "");
	} else {
		if (o === "^") {
			ref = 0;
			o = s.charAt(++i);
		} else if (o === "@") {
			ref = 1;
			typ = 2;
			o = s.charAt(++i);
		}
		if (o === '"') {
			typ = 3;
			do {
				o = s.charAt(++i);
				if (o === '"') {
					if (prevo === '"') {
						t.push(ref ? [0, '"', 1] : [0, '"']);
						prevo = "";
					} else {
						break;
					}
				} else {
					t.push(ref ? [0, o, 1] : [0, o]);
					prevo = o;
				}
			} while (o !== "");
		} else if (o === "%") {
			base = Fleur.GrammarParser._bases[s.charAt(++i)];
			c1 = Fleur.GrammarParser._getChar(s.substr(i + 1), base);
			i += c1[0] + 1;
			o = s.charAt(++i);
			if (o === "-") {
				c2 = Fleur.GrammarParser._getChar(s.substr(i), base);
				reg = "[\\x" + c1[1].charCodeAt(0).toString(16) + "-\\x" + c2[1].charCodeAt(0).toString(16) + "]";
				t.push(ref ? [1, new RegExp(reg), 1] : [1, new RegExp(reg)]);
			} else {
				t.push(ref ? [0, c1[1], 1] : [0, c1[1]]);
				while (o === ".") {
					c1 = Fleur.GrammarParser._getChar(s.substr(i + 1), base);
					i += c1[0] + 1;
					o = s.charAt(++i);
					t.push(ref ? [0, c1[1], 1] : [0, c1[1]]);
				}
			}
			switch (s.charAt(i + 1)) {
				case ".":
					break;
				case "-":
					c2 = Fleur.GrammarParser._getChar(s.substr(i + 1));
			}
		} else {
			if (typ === 0) {
				typ = 1;
			}
			o = Fleur.GrammarParser._getName(s.substr(i));
			switch (o) {
				case "alpha":
					term = ref ? [1, /[A-Za-z]/, 1] : [1, /[A-Za-z]/];
					break;
				case "bit":
					term = ref ? [1, /[01]/, 1] : [1, /[01]/];
					break;
				case "char":
					term = ref ? [1, /[^\0]/, 1] : [1, /[^\0]/];
					break;
				case "cr":
					term = ref ? [0, "\r", 1] : [0, "\r"];
					break;
				case "ctl":
					term = ref ? [1, /[\0-\x1f\x7f]/, 1] : [1, /[\0-\x1f\x7f]/];
					break;
				case "digit":
					term = ref ? [1, /[0-9]/, 1] : [1, /[0-9]/];
					break;
				case "dquote":
					term = ref ? [0, '"', 1] : [0, '"'];
					break;
				case "hexdig":
					term = ref ? [1, /[0-9A-Fa-f]/, 1] : [1, /[0-9A-Fa-f]/];
					break;
				case "htab":
					term = ref ? [0, "\t", 1] : [0, "\t"];
					break;
				case "lf":
					term = ref ? [0, "\n", 1] : [0, "\n"];
					break;
				case "octet":
					term = ref ? [1, /[\0-\xff]/, 1] : [1, /[\0-\xff]/];
					break;
				case "sp":
					term = ref ? [0, " ", 1] : [0, " "];
					break;
				case "vchar":
					term = ref ? [1, /[\x21-\x7e]/, 1] : [1, /[\x21-\x7e]/];
					break;
				case "wsp":
					term = ref ? [1, /[ \t]/, 1] : [1, /[ \t]/];
					break;
				default:
					term = ref ? [2, o, typ] : [2, o];
			}
			t.push(term);
		}
	}
	if (min !== 1) {
		l = t.length * (min - 1);
		for (i = 0; i < l; i++) {
			term = t[i].slice(0);
			t.push(term);
		}
	}
	return t;
};
Fleur.GrammarParser._getAlternative = function(s, gram) {
	var offset = 0;
	var o = s.charAt(offset);
	var term = "";
	var alt = [];
	var nbpar = 0;
	while (o !== "") {
		if (o === " " && nbpar === 0) {
			term = term.substr(Fleur.GrammarParser._skipSpaces(term, 0));
			if (term !== "") {
				alt = alt.concat(Fleur.GrammarParser._getTerm(term, gram));
			}
			term = "";
		} else {
			switch (o) {
				case "(":
				case "[":
					nbpar++;
					break;
				case ")":
				case "]":
					nbpar--;
			}
			term += o;
		}
		o = s.charAt(++offset);
	}
	term = term.substr(Fleur.GrammarParser._skipSpaces(term, 0));
	if (term !== "") {
		return alt.concat(Fleur.GrammarParser._getTerm(term, gram));
	}
	return alt;
};
Fleur.GrammarParser._getDefinition = function(s, gram) {
	var offset = 0;
	var o = s.charAt(offset);
	var alt = "";
	var def = [];
	var empty = true;
	var nbpar = 0;
	while (o !== "") {
		if (o === "/" && nbpar === 0) {
			alt = alt.substr(Fleur.GrammarParser._skipSpaces(alt, 0));
			if (alt !== "") {
				def.push(Fleur.GrammarParser._getAlternative(alt, gram));
				empty = false;
			} else if (empty) {
				def.push([]);
			}
			alt = "";
		} else {
			switch (o) {
				case "(":
				case "[":
					nbpar++;
					break;
				case ")":
				case "]":
					nbpar--;
			}
			alt += o;
		}
		o = s.charAt(++offset);
	}
	alt = alt.substr(Fleur.GrammarParser._skipSpaces(alt, 0));
	if (alt !== "") {
		def.push(Fleur.GrammarParser._getAlternative(alt, gram));
	} else if (empty) {
		def.push([]);
	}
	return def;
};
Fleur.GrammarParser.prototype.createGrammar = function(grammar) {
	var g = [];
	var gram = [grammar];
	var offset = 0;
	var n = [[""], [[2, 0, "xmlns"]]];
	var rules = {};
	var nbrules = 0;
	var rulename;
	var o;
	var def;
	var i, j, k, l, l2, l3;
	var prods = {};
	var nbprods = 1;
	var root = "";
	var ruleindex;
	while (offset < gram[0].length) {
		offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
		rulename = Fleur.GrammarParser._getName(gram[0].substr(offset));
		if (rulename !== "") {
			if (root === "") {
				root = rulename;
			}
			offset += rulename.length;
			offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
			offset++;
			if (gram[0].charAt(offset) === "/") {
				ruleindex = rules[rulename];
				offset++;
			} else {
				rules[rulename] = nbrules++;
				ruleindex = g.length;
			}
			offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
			o = gram[0].charAt(offset);
			def = "";
			var pre = "";
			var instr = false;
			var incomment = false;
			while (o !== ""){
				if (pre === "\n") {
					if (o !== " ") {
						def = def.substr(0, def.length - 1);
						offset--;
						break;
					} else {
						def = def.substr(0, def.length - 1);
					}
				}
				if (instr) {
					instr = o !== '"';
				}
				if (incomment) {
					incomment = o !== "\n";
				} else if (o === ";" && !instr) {
					incomment = true;
				} else {
					def += o;
					instr = o === '"' && !incomment;
				}
				pre = o;
				o = gram[0].charAt(++offset);
			}
			offset++;
			if (ruleindex === g.length) {
				g.push(Fleur.GrammarParser._getDefinition(def, gram));
			} else {
				g[ruleindex] = g[ruleindex].concat(Fleur.GrammarParser._getDefinition(def, gram));
			}
		} else {
			offset++;
		}
	}
	prods["1 " + root] = 0;
	n[1][1] = [1, 0, root];
	for (i = 0, l = g.length; i < l; i++) {
		for (j = 0, l2 = g[i].length; j < l2; j++) {
			for (k = 0, l3 = g[i][j].length; k < l3; k++) {
				if (g[i][j][k][0] === 2) {
					if (g[i][j][k][2]) {
						if (prods[g[i][j][k][2] + " " + g[i][j][k][1]]) {
							g[i][j][k][2] = prods[g[i][j][k][2] + " " + g[i][j][k][1]];
						} else {
							prods[g[i][j][k][2] + " " + g[i][j][k][1]] = ++nbprods;
							n[1].push([g[i][j][k][2], 0, g[i][j][k][1]]);
							g[i][j][k][2] = nbprods;
						}
					}
					g[i][j][k][1] = rules[g[i][j][k][1]];
				}
			}
		}
	}
	return [g, n];
};
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
	return Boolean(this.entries.getNamedItem(entryname));
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
Fleur.NameList = function() {};
Fleur.NameList.prototype = new Array();
Fleur.NameList.prototype.contains = function(str) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i][1] === str) {
			return true;
		}
		i++;
	}
	return false;
};
Fleur.NameList.prototype.containsNS = function(namespaceURI, n) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i][0] === namespaceURI && this[i][1] === n) {
			return true;
		}
		i++;
	}
	return false;
};
Fleur.NameList.prototype.getName = function(index) {
	return this[index][1];
};
Fleur.NameList.prototype.getNamespaceURI = function(index) {
	return this[index][0];
};
Fleur.Namespace = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.NAMESPACE_NODE;
};
Fleur.Namespace.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Namespace.prototype, {
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
			return !!this.firstChild;
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
Fleur.Sequence = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.SEQUENCE_NODE;
	this.nodeName = "#sequence";
};
Fleur.Sequence.prototype = new Fleur.Node();
Fleur.EmptySequence = new Fleur.Sequence();
Fleur.Serializer = function() {};
Fleur.Serializer.escapeXML = function(s, quotes, inline) {
	var i = 0, c, code, l = s.length, r = "";
	while (i < l) {
		c = s.charAt(i);
		switch (c) {
			case '&':
				r += '&amp;';
				break;
			case '<':
				r += '&lt;';
				break;
			case '>':
				r += '&gt;';
				break;
			case '"':
				r += quotes ? '&quot;' : '"';
				break;
			default:
				code = c.charCodeAt(0);
				if ((!inline && (code === 9 || code === 10 || code === 13)) || (code > 31 && code < 127)) {
					r += c;
				} else {
					r += '&#' + code + ';';
				}
		}
		i++;
	}
	return r;
};
Fleur.Serializer._serializeXMLToString = function(node, indent, offset) {
	var s, i, l;
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
			s = (indent ? offset + "<" : "<") + node.nodeName;
			if (indent) {
				var names = [];
				for (i = 0, l = node.attributes.length; i < l; i++) {
					names.push(node.attributes[i].nodeName);
				}
				names.sort();
				for (i = 0, l = names.length; i < l; i++) {
					s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true) + "\"";
				}
			} else {
				for (i = 0, l = node.attributes.length; i < l; i++) {
					s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true) + "\"";
				}
			}
			if (node.childNodes.length === 0) {
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset + "  ");
			}
			return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName + (indent ? ">\n" : ">");
		case Fleur.Node.TEXT_NODE:
			if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
				return "";
			}
			return Fleur.Serializer.escapeXML(node.data);
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.nodeValue + (indent ? "?>\n" : "?>");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.DOCUMENT_NODE:
			s = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset);
			}
			return s;
	}
};
Fleur.Serializer._serializeHTMLToString = function(node, indent, offset) {
	var s, i, l;
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
			s = "";
			if (node.localName.toLowerCase() === "html") {
				s += indent ? "<!DOCTYPE html>\n" : "<!DOCTYPE html>";
			}
			s += (indent ? offset + "<" : "<") + node.localName.toLowerCase();
			if (indent) {
				var names = [];
				for (i = 0, l = node.attributes.length; i < l; i++) {
					if (node.attributes[i].localName !== "xmlns" && node.attributes[i].prefix !== "xmlns") {
						names.push(node.attributes[i].localName.toLowerCase());
					}
				}
				names.sort();
				for (i = 0, l = names.length; i < l; i++) {
					s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true) + "\"";
				}
			} else {
				for (i = 0, l = node.attributes.length; i < l; i++) {
					if (node.attributes[i].localName !== "xmlns" && node.attributes[i].prefix !== "xmlns") {
						s += " " + node.attributes[i].localName.toLowerCase() + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true) + "\"";
					}
				}
			}
			if (node.childNodes.length === 0) {
				if (["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"].indexOf(node.localName.toLowerCase()) !== -1) {
					return s + (indent ? ">\n" : ">");
				}
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeHTMLToString(node.childNodes[i], indent, offset + "  ");
			}
			return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName.toLowerCase() + (indent ? ">\n" : ">");
		case Fleur.Node.TEXT_NODE:
			if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
				return "";
			}
			return node.parentNode.localName && ["script", "style"].indexOf(node.parentNode.localName.toLowerCase()) !== -1 ? node.data : Fleur.Serializer.escapeXML(node.data);
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.nodeValue + (indent ? "?>\n" : "?>");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.DOCUMENT_NODE:
			s = "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeHTMLToString(node.childNodes[i], indent, offset);
			}
			return s;
	}
};
Fleur.Serializer._serializeNodeToXQuery = function(node, indent, offset, tree, postfix, inmap) {
	var s, i, l;
	postfix = postfix || "";
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
			s = (indent ? offset + "<" : "<") + node.nodeName;
			if (indent) {
				var names = [];
				for (i = 0, l = node.attributes.length; i < l; i++) {
					names.push(node.attributes[i].nodeName);
				}
				names.sort();
				for (i = 0, l = names.length; i < l; i++) {
					s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true, false) + "\"";
				}
			} else {
				for (i = 0, l = node.attributes.length; i < l; i++) {
					s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true, true) + "\"";
				}
			}
			if (node.childNodes.length === 0) {
				return s + (indent ? "/>" + postfix + "\n" : "/>" + postfix);
			}
			s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", true);
			}
			return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName + ">" + postfix + (indent ? "\n" : "");
		case Fleur.Node.SEQUENCE_NODE:
			s = indent ? offset + "(" : "(";
			if (node.childNodes.length === 0) {
				return s + (indent ? ")\n" : ")");
			}
			s += indent ? "\n" : "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", false, i !== l - 1 ? "," : "");
			}
			return s + (indent ? offset + ")\n" : ")");
		case Fleur.Node.ATTRIBUTE_NODE:
			return (indent ? offset : "") + "attribute " + node.name + " {\"" + Fleur.Serializer.escapeXML(node.value).replace(/"/gm, "\"\"") + "\"}" + postfix + (indent ? "\n" : "");
		case Fleur.Node.MAP_NODE:
			s = (indent ? offset : "") + "map {"; 
			if (node.entries.length === 0) {
				return s + "}" + (indent ? "\n" : "");
			}
			s += indent ? "\n" : "";
			for (i = 0, l = node.entries.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.entries[i], indent, offset + "  ", false, i !== l - 1 ? ", " : "", true);
			}
			return s + "}" + postfix + (indent ? "\n" : "");
		case Fleur.Node.ENTRY_NODE:
			if (inmap) {
				return (indent ? offset : "") + "\"" + node.nodeName + "\": " + Fleur.Serializer._serializeNodeToXQuery(node.firstChild, indent, offset + "  ") + postfix + (indent ? "\n" : "");
			}
			return (indent ? offset : "") + "entry " + node.nodeName + " {" + Fleur.Serializer._serializeNodeToXQuery(node.firstChild, indent, offset + "  ") + "}" + postfix + (indent ? "\n" : "");
		case Fleur.Node.TEXT_NODE:
			if (tree) {
				if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
					return "";
				}
				return Fleur.Serializer.escapeXML(node.data, !indent, !indent);
			}
			if (node.schemaTypeInfo === Fleur.Type_error) {
				return "fn:error(fn:QName(\"" + node.namespaceURI + "\", \"" + node.nodeName + "\")" + (node.textContent ? ",\"" + Fleur.Serializer.escapeXML(node.textContent, false, false).replace(/"/gm, "\"\"") + "\"" : "") + ")" + postfix;
			}
			if (node.schemaTypeInfo === Fleur.Type_QName) {
				return "fn:QName(\"" + node.namespaceURI + "\", \"" + node.nodeName + "\")" + postfix;
			}
			var fdata = node.data;
			if (fdata !== "INF" && fdata !== "-INF" && fdata !== "NaN") {
				if (node.schemaTypeInfo === Fleur.Type_float || node.schemaTypeInfo === Fleur.Type_double) {
					if (fdata.indexOf("e") === -1) {
						if (fdata !== "0") {
							var exp = Math.floor(Math.log10(Math.abs(parseFloat(fdata))));
							fdata = String(parseFloat(fdata) * Math.pow(10, -exp)) + "e" + exp;
						} else {
							fdata = "0.0e0";
						}
					}
					if (fdata.indexOf(".") === -1) {
						fdata = fdata.split("e");
						fdata = fdata[0] + ".0e" + fdata[1];
					}
				} else if (node.schemaTypeInfo === Fleur.Type_decimal && fdata.indexOf(".") === -1) {
					fdata += ".0";
				}
			}
			return (indent ? offset : "") + "xs:" + node.schemaTypeInfo.typeName + "(\"" + Fleur.Serializer.escapeXML(fdata, !indent, !indent).replace(/"/gm, "\"\"") + "\")" + postfix + (indent ? "\n" : "");
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.nodeValue + (indent ? "?>\n" : "?>");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.DOCUMENT_NODE:
			if (node.childNodes.length === 0) {
				return "document {}";
			}
			s = 'document {';
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset, true);
			}
			return s + "}" + postfix;
	}
};
Fleur.Serializer._serializeEXMLToString = function(node, indent, offset) {
	var s, i, l, nodeName, isqname;
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
		case Fleur.Node.ENTRY_NODE:
			isqname = node.nodeType === Fleur.Node.ELEMENT_NODE && Fleur.Node.QNameReg.test(node.nodeName);
			nodeName = isqname ? node.nodeName : "exml:" + (node.nodeType === Fleur.Node.ELEMENT_NODE ? "element" : "entry");
			s = (indent ? offset + "<" : "<") + nodeName;
			if (!isqname) {
				s += " name=\"" + Fleur.Serializer.escapeXML(node.nodeName) + "\"";
			}
			if (node.attributes) {
				if (indent) {
					var names = [];
					for (i = 0, l = node.attributes.length; i < l; i++) {
						names.push(node.attributes[i].nodeName);
					}
					names.sort();
					for (i = 0, l = names.length; i < l; i++) {
						s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i])) + "\"";
					}
				} else {
					for (i = 0, l = node.attributes.length; i < l; i++) {
						s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue) + "\"";
					}
				}
			}
			if (node.childNodes.length === 0) {
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, offset + "  ");
			}
			return s + (indent ? offset + "</" : "</") + nodeName + (indent ? ">\n" : ">");
		case Fleur.Node.TEXT_NODE:
			s = indent ? offset + '<exml:atom' : '<exml:atom';
			return s +  ' type="Q{' + node.schemaTypeInfo.typeNamespace + '}' + node.schemaTypeInfo.typeName + '">' + Fleur.Serializer.escapeXML(node.data) + (indent ? "</exml:atom>\n" : "</exml:atom>");
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.nodeValue + (indent ? "?>\n" : "?>");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.DOCUMENT_NODE:
			s = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
			s += '<exml:document xmlns:exml="http://www.agencexml.com/exml">' + (indent ? "\n" : "");
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, "  ");
			}
			return  s + "</exml:document>";
		case Fleur.Node.ARRAY_NODE:
			s = indent ? offset + "<exml:array" : "<exml:array";
			if (node.childNodes.length === 0) {
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, offset + "  ");
			}
			return s + (indent ? offset + "</" : "</") + "exml:array" + (indent ? ">\n" : ">");
		case Fleur.Node.MAP_NODE:
			s = indent ? offset + "<exml:map" : "<exml:map";
			if (node.entries.length === 0) {
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent ? ">\n" : ">";
			for (i = 0, l = node.entries.length; i < l; i++) {
				s += Fleur.Serializer._serializeEXMLToString(node.entries[i], indent, offset + "  ");
			}
			return s + (indent ? offset + "</exml:map>\n" : "</exml:map>");
	}
};
Fleur.Serializer.escapeJSON = function(s) {
	var i = 0, c, code, l = s.length, r = "";
	while (i < l) {
		c = s.charAt(i);
		switch (c) {
			case '\t':
				r += '\\t';
				break;
			case '\n':
				r += '\\n';
				break;
			case '\r':
				r += '\\r';
				break;
			case '\\':
				r += '\\\\';
				break;
			case '"':
				r += '\\"';
				break;
			default:
				code = c.charCodeAt(0);
				if (code > 31 && code < 127) {
					r += c;
				} else {
					r += '\\u' + ('000' + code.toString(16)).slice(-4);
				}
		}
		i++;
	}
	return r;
};
Fleur.Serializer._serializeJSONToString = function(node, indent, offset, inline, comma) {
	var s, i, l, quote;
	switch (node.nodeType) {
		case Fleur.Node.MAP_NODE:
			s = indent && !inline ? offset + "{" : "{";
			if (node.entries.length === 0) {
				return s + (indent ? "}" + comma + "\n" : "}" + comma);
			}
			if (indent) {
				s += "\n";
			}
			if (indent) {
				var names = [];
				for (i = 0, l = node.entries.length; i < l; i++) {
					names.push(node.entries[i].nodeName);
				}
				names.sort();
				for (i = 0, l = names.length; i < l; i++) {
					s += Fleur.Serializer._serializeJSONToString(node.getEntryNode(names[i]), indent, offset + "  ", false, (i === l - 1 ? "" : ","));
				}
			} else {
				for (i = 0, l = node.entries.length; i < l; i++) {
					s += Fleur.Serializer._serializeJSONToString(node.entries[i], indent, offset + "  ", false, (i === l - 1 ? "" : ","));
				}
			}
			return s + (indent ? offset + "}" + comma + "\n" : "}" + comma);
		case Fleur.Node.ENTRY_NODE:
			if (indent && Fleur.Node.JSNameReg.test(node.nodeName)) {
				s = offset + node.nodeName + ": ";
			} else {
				s = (indent ? offset + '"' : '"') + Fleur.Serializer.escapeJSON(node.nodeName) + '":' + (indent ? " " : "");
			}
			s += Fleur.Serializer._serializeJSONToString(node.firstChild, indent, offset, true, comma);
			return s;
		case Fleur.Node.TEXT_NODE:
			quote = node.schemaTypeInfo === Fleur.Type_string  || node.schemaTypeInfo === Fleur.Type_untypedAtomic ? '"' : node.schemaTypeInfo === Fleur.Type_regex ? '/' : "";
			return (indent && !inline ? offset + quote : quote) + Fleur.Serializer.escapeJSON(node.data) + quote + comma + (indent ? "\n" : "");
		case Fleur.Node.ARRAY_NODE:
		case Fleur.Node.SEQUENCE_NODE:
			s = indent && !inline ? offset + "[" : "[";
			if (node.childNodes.length === 0) {
				return s + (indent ? "]" + comma + "\n" : "]" + comma);
			}
			if (indent) {
				s += "\n";
			}
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeJSONToString(node.childNodes[i], indent, offset + "  ", false, (i === l - 1 ? "" : ","));
			}
			return s + (indent ? offset + "]" + comma + "\n" : "]" + comma);
		case Fleur.Node.DOCUMENT_NODE:
			s = "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeJSONToString(node.childNodes[i], indent, offset, false, "");
			}
			return s;
	}
};
Fleur.Serializer.escapeCSV = function(s, sep) {
	if (s.indexOf(sep) !== -1) {
		return '"' + s.replace(/"/g, '""') + '"';
	}
	return s;
};
Fleur.Serializer._serializeCSVToString = function(node, head, key, sep, level) {
	var s = "", s2, s3, i, l, rowname, nextlevel = level, headref;
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
		case Fleur.Node.ARRAY_NODE:
		case Fleur.Node.DOCUMENT_NODE:
			if (node.childNodes.length === 0) {
				nextlevel = 2;
			} else if (node.nodeType !== Fleur.Node.DOCUMENT_NODE || node.childNodes[0].nodeType === Fleur.Node.ARRAY_NODE) {
				nextlevel = level + 1;
			}
			if (node.childNodes.length > 1 && nextlevel < 2) {
				l = node.childNodes.length;
				i = 1;
				rowname = node.childNodes[0].nodeName;
				while (i < l) {
					if (rowname !== node.childNodes[i].nodeName) {
						nextlevel++;
						break;
					}
					i++;
				}
			}
			if (head && level === 0 && nextlevel !== 0) {
				if (key !== null) {
					headref = node.childNodes[0].entries[0];
					l = headref.childNodes.length;
					i = 0;
					while (i < l) {
						if (s !== "") {
							s += sep;
						}
						if (i === key) {
							s += node.nodeName + sep;
						}
						s += headref.childNodes[i].nodeName;
						i++;
					}
					if (l === key) {
						if (s !== "") {
							s += sep;
						}
						s += node.nodeName;
					}
					head = false;
				} else {
					if (node.childNodes.length !== 0) {
						headref = nextlevel === level + 1 ? node.childNodes[0] : node;
						l = headref.childNodes.length;
						i = 0;
						while (i < l) {
							if (s !== "") {
								s += sep;
							}
							s += headref.childNodes[i].nodeName;
							i++;
						}
					} else {
						s  = node.nodeName;
					}
				}
				s += "\n";
			}
			l = node.childNodes.length;
			i = 0;
			s3 = "";
			while (i < l) {
				s2 = Fleur.Serializer._serializeCSVToString(node.childNodes[i], key ? head : level === 0, key, sep, nextlevel);
				if (s2) {
					if (s3 !== "") {
						s3 += nextlevel === 1 ? "\n" : ((nextlevel - level === 2 || node.nodeType === Fleur.Node.ARRAY_NODE) ? sep : "");
					}
					s3 += s2;
				}
				i++;
			}
			return s + s3;
		case Fleur.Node.SEQUENCE_NODE:
			return null;
		case Fleur.Node.MAP_NODE:
			l = node.entries.length;
			i = 0;
			while (i < l) {
				s += Fleur.Serializer._serializeCSVToString(node.entries[i], false, key, sep, nextlevel) + "\n";
				i++;
			}
			return s;
		case Fleur.Node.ENTRY_NODE:
			l = node.childNodes.length;
			i = 0;
			s3 = "";
			while (i < l) {
				if (i === key) {
					if (s3 !== "") {
						s3 += sep;
					}
					s3 += Fleur.Serializer.escapeCSV(node.nodeName);
				}
				s2 = Fleur.Serializer._serializeCSVToString(node.childNodes[i], false, key, sep, nextlevel);
				if (s2) {
					if (s3 !== "") {
						s3 += sep;
					}
					s3 += s2;
				}
				i++;
			}
			return s + s3;
		case Fleur.Node.TEXT_NODE:
			if (head && level !== 2) {
				s = (node.parentNode ? Fleur.Serializer.escapeCSV(node.nodeName) : "#text") + "\n";
			}
			s += Fleur.Serializer.escapeCSV(node.data);
			return s;
		default:
			return null;
	}
};
Fleur.Serializer.XQX_delimitedList = function(node, delimiter, leftEncloser, rightEncloser, selector) {
	var s = leftEncloser, i = 0, l = node.childNodes.length;
	while (i < l) {
		Fleur.Serializer._serializeXQXToString(node.childNodes[i]);
		i++;
		if (i !== l) {
			s += delimiter;
		}
	}
	return s + rightEncloser;
};
Fleur.Serializer.XQX_parenthesizedList = function(node, delimiter) {
	delimiter = delimiter || ", ";
	return Fleur.Serializer.XQX_delimitedList(node, delimiter, "(", ")");
};
Fleur.Serializer.XQX_commaSeparatedList = function(node) {
	return Fleur.Serializer.XQX_delimitedList(node, ", ");
};
Fleur.Serializer.XQX_quote = function(item) {
	return '"' + item.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\x85/g, "&amp;#x85;").replace(/\x2028/g, "&#x2028;").replace (/\"/g, '""') + '"';
};
Fleur.Serializer.XQX_renderQName = function(node) {
	return (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") ? node.getAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") + ":" : "") + node.textContent;
};
Fleur.Serializer.XQX_renderEQName = function(node) {
	if (node.localName === "elementConstructor" && node.namespaceURI === "http://www.w3.org/2005/XQueryX") {
		var i = 0, l = node.children.length;
		while (i < l) {
			if (node.children[i].localName === "tagName" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
				return Fleur.Serializer.XQX_renderQName(node.children[i]);
			}
			i++;
		}
	}
	if (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "prefix")) {
		return node.getAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") + ":" + node.textContent;
	}
	if (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "URI")) {
		return "Q{" + node.getAttributeNS("http://www.w3.org/2005/XQueryX", "URI") + "}" + node.textContent;
	}
	return node.textContent;
};
Fleur.Serializer.XQX_renderChildren = function(node, filter) {
	var i = 0, l, s = "";
	l = node.children.length;
	while (i < l) {
		if (!filter || (filter.indexOf(node.children[i].localName) !== -1 && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX")) {
			s += Fleur.Serializer._serializeXQXToString(node.children[i]);
		}
		i++;
	}
	return s;
};
Fleur.Serializer.XQX_ops = {
	"unaryMinusOp": "-",
	"unaryPlusOp": "+",
	"addOp": "+",
	"subtractOp": " - ",
	"multiplyOp": "*",
	"divOp": " div ",
	"idivOp": " idiv ",
	"modOp": " mod ",
	"stringConcatenateOp": "||",
	"eqOp": " eq ",
	"neOp": " ne ",
	"ltOp": " lt ",
	"gtOp": " gt ",
	"leOp": " le ",
	"geOp": " ge ",
	"equalOp": " = ",
	"notEqualOp": " != ",
	"lessThanOp": " < ",
	"greaterThanOp": " > ",
	"lessThanOrEqualOp": " <= ",
	"greaterThanOrEqualOp": " >= ",
	"isOp": " is ",
	"nodeBeforeOp": " << ",
	"nodeAfterOp": " >> ",
	"andOp": " and ",
	"orOp": " or ",
	"unionOp": " union ",
	"intersectOp": " intersect ",
	"exceptOp": " except "
};
Fleur.Serializer._serializeXQXToString = function(node) {
	var i = 0, l, s, n;
	if (node.nodeType === Fleur.Node.DOCUMENT_NODE) {
		return Fleur.Serializer._serializeXQXToString(node.documentElement);
	}
	if (node.namespaceURI !== "http://www.w3.org/2005/XQueryX") {
		return;
	}
	switch(node.localName) {
		case "attributeName":
			return Fleur.Serializer.XQX_renderQName(node);
		case "NCName":
			return node.textContent;
		case "rootExpr":
			return "/";
		case "argumentPlaceholder":
			return "?";
		case "contextItemExpr":
			return ".";
		case "stringConstantExpr":
		case "stringLiteral":
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "value" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return Fleur.Serializer.XQX_quote(node.children[i].textContent);
				}
				i++;
			}
			return "";
		case "integerConstantExpr":
		case "integerLiteral":
		case "decimalConstantExpr":
		case "doubleConstantExpr":
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "value" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return node.children[i].textContent;
				}
				i++;
			}
			return "";
		case "varRef":
		case "variableRef":
			return "$" + Fleur.Serializer.XQX_renderChildren(node, ["name"]);
		case "pragma":
			return "(# " + Fleur.Serializer.XQX_renderChildren(node, ["pragmaName"]) + " " + Fleur.Serializer.XQX_renderChildren(node, ["pragmaContents"]) + " #)";
		case "extensionExpr":
			return Fleur.Serializer.XQX_renderChildren(node, ["pragma"]) + "{" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + "}";
		case "simpleMapExpr":
			l = node.children.length;
			s = "";
			while (i < l) {
				if (node.children[i].localName === "pathExpr" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += (s === "" ? "( " : "\n! ( ") + Fleur.Serializer._serializeXQXToString(node.children[i]) + " )";
				}
				i++;
			}
			return s;
		case "functionCallExpr":
			l = node.children.length;
			s = "";
			while (i < l) {
				if (node.children[i].localName === "arguments" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_parenthesizedList(node.children[i]) ;
				}
				i++;
			}
			return Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + (s === "" ? "()" : s);
		case "constructorFunctionExpr":
			l = node.children.length;
			s = "";
			while (i < l) {
				if (node.children[i].localName === "argExpr" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_parenthesizedList(node.children[i]) ;
				}
				i++;
			}
			return Fleur.Serializer.XQX_renderChildren(node, ["typeName"]) + (s === "" ? "()" : s);
		case "unaryMinusOp":
		case "unaryPlusOp":
			return "(" + Fleur.Serializer.XQX_ops[node.localName] + Fleur.Serializer.XQX_renderChildren(node, ["operand"]) + ")";
		case "addOp":
		case "subtractOp":
		case "multiplyOp":
		case "divOp":
		case "idivOp":
		case "modOp":
		case "stringConcatenateOp":
		case "eqOp":
		case "neOp":
		case "ltOp":
		case "gtOp":
		case "leOp":
		case "geOp":
		case "equalOp":
		case "notEqualOp":
		case "lessThanOp":
		case "greaterThanOp":
		case "lessThanOrEqualOp":
		case "greaterThanOrEqualOp":
		case "isOp":
		case "nodeBeforeOp":
		case "nodeAfterOp":
		case "andOp":
		case "orOp":
		case "unionOp":
		case "intersectOp":
		case "exceptOp":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["firstOperand"]) + Fleur.Serializer.XQX_ops[node.localName] + Fleur.Serializer.XQX_renderChildren(node, ["secondOperand"]) + ")";
		case "sequenceExpr":
			return Fleur.Serializer.XQX_parenthesizedList(node, ",\n");
		case "firstOperand":
		case "secondOperand":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "rangeSequenceExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["startExpr"]) + " to " + Fleur.Serializer.XQX_renderChildren(node, ["endExpr"]) + ")";
		case "forClause":
			return " for " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
		case "forClauseItem":
		case "letClauseItem":
			s = "";
			l = node.children.length;
			while (i < l) {
				s += Fleur.Serializer._serializeXQXToString(node.children[i]);
				i++;
			}
			return s;
		case "allowingEmpty":
			return " allowing empty ";
		case "forExpr":
			return "\n    in " + Fleur.Serializer.XQX_renderChildren(node);
		case "letClause":
			return " let " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
		case "letExpr":
			return " := " + Fleur.Serializer.XQX_renderChildren(node);
		case "windowClause":
			return " for " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "tumblingWindowClause":
			return "   tumbling window " + Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) +
				" in " + Fleur.Serializer.XQX_renderChildren(node, ["bindingSequence"]) + "\n" +
				"      " + Fleur.Serializer.XQX_renderChildren(node, ["windowStartCondition"]) + "\n" +
				"      " + Fleur.Serializer.XQX_renderChildren(node, ["windowEndCondition"]);
		case "slidingWindowClause":
			return "   sliding window " + Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) +
				" in " + Fleur.Serializer.XQX_renderChildren(node, ["bindingSequence"]) + "\n" +
				"      " + Fleur.Serializer.XQX_renderChildren(node, ["windowStartCondition"]) + "\n" +
				"      " + Fleur.Serializer.XQX_renderChildren(node, ["windowEndCondition"]);
		case "bindingSequence":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "windowStartCondition":
			return "start " + Fleur.Serializer.XQX_renderChildren(node, ["windowVars"]) +
				" when " + Fleur.Serializer.XQX_renderChildren(node, ["winStartExpr"]);
		case "windowEndCondition":
			return (node.getAttributeNS("http://www.w3.org/2005/XQueryX", "onlyEnd") === "true" ? "only end " : "end " ) +
				Fleur.Serializer.XQX_renderChildren(node, ["windowVars"]) + " when " + Fleur.Serializer.XQX_renderChildren(node, ["winEndExpr"]);
		case "windowVars":
			return Fleur.Serializer.XQX_renderChildren(node, ["currentItem"]) + Fleur.Serializer.XQX_renderChildren(node, ["positionalVariableBinding"]) +
				Fleur.Serializer.XQX_renderChildren(node, ["previousItem"]) + Fleur.Serializer.XQX_renderChildren(node, ["nextItem"]);
		case "currentItem":
			return "$" + Fleur.Serializer.XQX_renderEQName(node);
		case "previousItem":
			return " previous $" + Fleur.Serializer.XQX_renderEQName(node);
		case "nextItem":
			return " next $" + Fleur.Serializer.XQX_renderEQName(node);
		case "countClause":
			return " count " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "whereClause":
			return " where " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "groupByClause":
			return "  group by " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
		case "groupingSpec":
			return "$" + Fleur.Serializer.XQX_renderChildren(node);
		case "groupVarInitialize":
		case "collation":
			return " collation " + Fleur.Serializer.XQX_quote(node.textContent);
		case "emptyOrderingMode":
		case "orderingKind":
			return " " + node.textContent;
		case "orderModifier":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "orderBySpec":
			return Fleur.Serializer.XQX_renderChildren(node, ["orderByExpr"]) + " " + Fleur.Serializer.XQX_renderChildren(node, ["orderModifier"]);
 		case "orderByClause":
		case "returnClause":
			return " return " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "flworExpr":
			return "\n(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
		case "ifThenElseExpr":
			return "( if (" + Fleur.Serializer.XQX_renderChildren(node, ["ifClause"]) + ") then " + Fleur.Serializer.XQX_renderChildren(node, ["thenClause"]) + " else " + Fleur.Serializer.XQX_renderChildren(node, ["elseClause"]) + ")";
		case "positionalVariableBinding":
			return " at $" + Fleur.Serializer.XQX_renderEQName(node);
		case "variableBinding":
			return "$" + Fleur.Serializer.XQX_renderEQName(node) + (node.parentNode.localName === "typeswitchExprCaseClause" && node.parentNode.namespaceURI === "http://www.w3.org/2005/XQueryX" ? " as " : "");
		case "typedVariableBinding": 
			return "$" + Fleur.Serializer.XQX_renderChildren(node, ["varName"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
		case "quantifiedExprInClause":
			return Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) + " in " + Fleur.Serializer.XQX_renderChildren(node, ["sourceExpr"]);
		case "quantifiedExpr":
		case "instanceOfExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " instance of " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ")";
		case "castExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " cast as " + Fleur.Serializer.XQX_renderChildren(node, ["singleType"]) + ")";
		case "castableExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " castable as " + Fleur.Serializer.XQX_renderChildren(node, ["singleType"]) + ")";
		case "treatExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " treat as " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ")";
		case "switchExprCaseClause":
		case "switchExprDefaultClause":
			return "\n   default return " + Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
		case "switchExpr":
			return "(switch(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + ")" +
				Fleur.Serializer.XQX_renderChildren(node, ["switchExprCaseClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["switchExprDefaultClause"]) + ")";
		case "typeswitchExprCaseClause":
			return " case " + Fleur.Serializer.XQX_renderChildren(node, ["variableBinding"]) +
				Fleur.Serializer.XQX_renderChildren(node, ["sequenceType", "sequenceTypeUnion"]) + " return " +
				Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
		case "typeswitchExprDefaultClause":
			return " default " + Fleur.Serializer.XQX_renderChildren(node, ["variableBinding"]) + " return " + Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
		case "typeswitchExpr":
			return "(typeswitch(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + ")" +
				Fleur.Serializer.XQX_renderChildren(node, ["typeswitchExprCaseClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeswitchExprDefaultClause"]) +
				")";
		case "tryCatchExpr":
			return "\n(try " + Fleur.Serializer.XQX_renderChildren(node, ["tryClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["catchClause"]) + ")";
		case "tryClause":
			return "{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "catchClause":
			return "\n  catch " + Fleur.Serializer.XQX_renderChildren(node, ["catchErrorList"]) + Fleur.Serializer.XQX_renderChildren(node, ["catchExpr"]);
		case "catchErrorList":
		case "catchExpr":
			return "\n{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "validateExpr":
		case "xpathAxis":
			return node.textContent + "::";
		case "predicates":
			s = "";
			l = node.children.length;
			while (i < l) {
				s += "[" + Fleur.Serializer._serializeXQXToString(node.children[i]) + "]";
				i++;
			}
			return s;
		case "predicate":
			return "[" + Fleur.Serializer.XQX_renderChildren(node) + "]";
		case "dynamicFunctionInvocationExpr":
		case "functionItem":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "mapConstructor":
		case "mapConstructorEntry":
		case "arrayConstructor":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "squareArray":
		case "curlyArray":
			return " array { " + Fleur.Serializer.XQX_renderChildren(node) + " } ";
		case "star":
			return "*";
		case "textTest":
			return "text()";
		case "commentTest":
			return "comment()";
		case "namespaceTest":
			return "namespace-node()";
		case "anyKindTest":
			return "node()";
		case "piTest":
			return "processing-instruction(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
		case "documentTest":
			return "document-node(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
		case "nameTest":
			return Fleur.Serializer.XQX_renderEQName(node);
		case "attributeTest":
		case "elementTest":
		case "schemaElementTest":
			return "schema-element(" + Fleur.Serializer.XQX_renderEQName(node) + ")";
		case "schemaAttributeTest":
			return "schema-attribute(" + Fleur.Serializer.XQX_renderEQName(node) + ")";
		case "anyFunctionTest":
			return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function(*)";
		case "typedFunctionTest":
			return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function" + Fleur.Serializer.XQX_renderChildren(node, ["paramTypeList"]) +
				" as " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]);
		case "paramTypeList":
			return Fleur.Serializer.XQX_parenthesizedList(node);
		case "anyMapTest":
			return " map(*)";
		case "typedMapTest":
			return " map(" + Fleur.Serializer.XQX_renderChildren(node, ["atomicType"]) + ", " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ") ";
		case "lookup":
			return " ?" + Fleur.Serializer.XQX_renderChildren(node);
		case "arrowPostfix":
		case "anyArrayTest":
			return " array(*)";
		case "typedArrayTest":
			return " array(" + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ") ";
		case "parenthesizedItemType":
			return " ( " + Fleur.Serializer.XQX_renderChildren(node) + " ) ";
		case "stepExpr":
			s = "";
			n = node.previousSibling;
			while (n) {
				if (n.localName === "stepExpr" && n.namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s = "/";
					break;
				}
				n = n.previousSibling;
			}
			return s + Fleur.Serializer.XQX_renderChildren(node);
		case "filterExpr":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "namedFunctionRef":
			return Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + "#" + Fleur.Serializer.XQX_renderChildren(node, ["integerConstantExpr"]);
		case "inlineFunctionExpr":
			return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function " + Fleur.Serializer.XQX_renderChildren(node, ["paramList"]) +
				Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]) +	 Fleur.Serializer.XQX_renderChildren(node, ["functionBody"]);
		case "pathExpr":
			return Fleur.Serializer.XQX_renderChildren(node, ["rootExpr", "stepExpr"]);
		case "attributeConstructor":
		case "namespaceDeclaration":
		case "attributeList":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "elementContent":
			l = node.children.length;
			s = "";
			while (i < l) {
				if (node.children[i].localName !== "elementConstructor" || node.children[i].namespaceURI !== "http://www.w3.org/2005/XQueryX") {
					s += " {" + Fleur.Serializer._serializeXQXToString(node.children[i]) + " }";
				} else {
					s += Fleur.Serializer._serializeXQXToString(node.children[i]);
				}
				i++;
			}
			return s;
		case "elementConstructor":
			return "<" + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["xqx:attributeList"]) +
				">" + Fleur.Serializer.XQX_renderChildren(node, ["elementContent"]) + "</" + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + ">";
		case "tagNameExpr":
			return "{" + Fleur.Serializer.XQX_renderChildren(node) + "}";
		case "computedElementConstructor":
			return " element " + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["tagNameExpr"]) +
				" { " + Fleur.Serializer.XQX_renderChildren(node, ["contentExpr"]) + " }";
		case "contentExpr":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "computedAttributeConstructor":
			return " attribute " + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["tagNameExpr"]) +
				" { " + Fleur.Serializer.XQX_renderChildren(node, ["valueExpr"]) + " }";
		case "computedDocumentConstructor":
			return " document {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "computedTextConstructor":
			return " text {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "computedCommentConstructor":
			return " comment {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "computedNamespaceConstructor":
		case "piTargetExpr":
			return "{" + Fleur.Serializer.XQX_renderChildren(node) + "}";
		case "piValueExpr":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "computedPIConstructor":
		case "unorderedExpr":
			return " unordered{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "orderedExpr":
			return " ordered{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "versionDecl":
		case "namespaceDecl":
 			s = "declare namespace ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "prefix" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += node.children[i].textContent;
					break;
				}
				i++;
			}
			s += "=";
			i = 0;
			while (i < l) {
				if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return s + Fleur.Serializer.XQX_quote(node.children[i].textContent);
				}
				i++;
			}
			return s;
		case "defaultNamespaceDecl":
			s = "declare default ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "defaultNamespaceCategory" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += node.children[i].textContent;
					break;
				}
				i++;
			}
			s += " namespace ";
			i = 0;
			while (i < l) {
				if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return s + Fleur.Serializer.XQX_quote(node.children[i].textContent);
				}
				i++;
			}
			return s;
		case "boundarySpaceDecl":
			return "declare boundary-space " + node.textContent;
		case "defaultCollationDecl":
			return "declare default collation " + Fleur.Serializer.XQX_quote(node.textContent);
		case "baseUriDecl":
			return "declare base-uri " + Fleur.Serializer.XQX_quote(node.textContent);
		case "constructionDecl":
			return "declare construction " + node.textContent;
		case "orderingModeDecl":
			return "declare ordering " + node.textContent;
		case "emptyOrderingDecl":
			return "declare default order " + node.textContent;
		case "copyNamespacesDecl":
		case "optionDecl":
			s = "declare option " + Fleur.Serializer.XQX_renderChildren(node, ["optionName"]) + " ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "optionContents" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
					break;
				}
				i++;
			}
			return s;
		case "decimalFormatDecl":
		case "decimalFormatParam":
			s = Fleur.Serializer.XQX_renderChildren(node, ["decimalFormatParamName"]) + " = ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "decimalFormatParamValue" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
					break;
				}
				i++;
			}
			return s + " ";
		case "voidSequenceType":
			return "empty-sequence()";
		case "occurrenceIndicator":
			return node.textContent;
		case "anyItemType":
			return "item()";
		case "sequenceType":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "sequenceTypeUnion":
		case "singleType":
		case "typeDeclaration":
		case "contextItemType":
			return " as " + Fleur.Serializer.XQX_renderChildren(node);
		case "contextItemDecl":
		case "annotation":
		case "varDecl":
		case "targetLocation":
		case "schemaImport":
		case "moduleImport":
		case "javascriptImport":
		case "param":
			return "$" + Fleur.Serializer.XQX_renderChildren(node, ["varName"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
		case "paramList":
			return Fleur.Serializer.XQX_parenthesizedList(node);
		case "functionBody":
			return "\n{\n" + Fleur.Serializer.XQX_renderChildren(node) + "\n}";
		case "functionDecl":
			s = "declare" + Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function " + Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + Fleur.Serializer.XQX_renderChildren(node, ["paramList"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "externalDefinition" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return s + " external ";
				}
				i++;
			}
			return s + Fleur.Serializer.XQX_renderChildren(node, ["functionBody"]);
		case "queryBody":
			return Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "moduleDecl":
			s = " module namespace ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "prefix" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += node.children[i].textContent;
					break;
				}
				i++;
			}
			s += "=";
			i = 0;
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
					break;
				}
				i++;
			}
			return s + ";\n";
		case "prolog":
			s = "";
			l = node.children.length;
			while (i < l) {
				s += Fleur.Serializer._serializeXQXToString(node.children[i]) + ";\n";
				i++;
			}
			return s + ";\n";
		case "libraryModule":
			return Fleur.Serializer.XQX_renderChildren(node, ["moduleDecl"]) + Fleur.Serializer.XQX_renderChildren(node, ["prolog"]);
		case "mainModule":
			return Fleur.Serializer.XQX_renderChildren(node, ["prolog"]) + Fleur.Serializer.XQX_renderChildren(node, ["queryBody"]);
		case "module":
			return Fleur.Serializer.XQX_renderChildren(node);
	}
};
Fleur.Serializer.prototype.serializeToString = function(node, mediatype, indent) {
	var media = mediatype.split(";"), config = {}, param, paramreg = /^\s*(\S*)\s*=\s*(\S*)\s*$/, i = 1, l = media.length, handler;
	while (i < l) {
		param = paramreg.exec(media[i]);
		config[param[1]] = param[2];
		i++;
	}
	handler = Fleur.Serializer.Handlers[media[0].replace(/^\s+|\s+$/gm,'')];
	if (!handler) {
		return "";
	}
	return handler(node, indent, config);
};
Fleur.Serializer.Handlers = {
	"application/xml": function(node, indent) {
		var ser = Fleur.Serializer._serializeXMLToString(node, indent, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	},
	"application/exml+xml": function(node, indent) {
		var ser = Fleur.Serializer._serializeEXMLToString(node, indent, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	},
	"application/xquery": function(node) {
		return Fleur.Serializer._serializeXQXToString(node);
	},
	"text/csv": function(node, indent, config) {
		var ser = Fleur.Serializer._serializeCSVToString(node, config.header === "present", config.key ? parseInt(config.key, 10) : null, config.separator ? decodeURIComponent(config.separator) : ",", 0);
		return ser;
	},
	"application/json": function(node, indent) {
		var ser = Fleur.Serializer._serializeJSONToString(node, indent, "", false, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	},
	"text/html": function(node, indent) {
		var ser = Fleur.Serializer._serializeHTMLToString(node, indent, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	}
};
Fleur.Serializer.Handlers["text/xml"] = Fleur.Serializer.Handlers["application/xml"];
Fleur.Serializer.Handlers["application/xquery+xml"] = Fleur.Serializer.Handlers["application/xml"];
Fleur.Serializer.Handlers["text/json"] = Fleur.Serializer.Handlers["application/json"];
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
Fleur.TypeInfo = function(typeNamespace, typeName, derivationMethod, derivationType) {
	this.typeNamespace = typeNamespace;
	this.typeName = typeName;
	Fleur.Types[typeNamespace][typeName] = this;
	switch (derivationMethod) {
		case Fleur.TypeInfo.DERIVATION_RESTRICTION:
			this.restriction = derivationType;
			break;
		case Fleur.TypeInfo.DERIVATION_EXTENSION:
			this.extension = derivationType;
			break;
		case Fleur.TypeInfo.DERIVATION_UNION:
			this.union = derivationType;
			break;
		case Fleur.TypeInfo.DERIVATION_LIST:
			this.list = derivationType;
			break;
	}
};
Fleur.TypeInfo.DERIVATION_RESTRICTION = 1;
Fleur.TypeInfo.DERIVATION_EXTENSION = 2;
Fleur.TypeInfo.DERIVATION_UNION = 4;
Fleur.TypeInfo.DERIVATION_LIST = 8;
Fleur.TypeInfo.prototype.isDerivedFrom = function(typeNamespaceArg, typeNameArg, derivationMethod) {
	var propname, t, typeArg = Fleur.Types[typeNamespaceArg][typeNameArg];
	switch (derivationMethod) {
		case Fleur.TypeInfo.DERIVATION_RESTRICTION:
			propname = "restriction";
			break;
		case Fleur.TypeInfo.DERIVATION_EXTENSION:
			propname = "extension";
			break;
		case Fleur.TypeInfo.DERIVATION_UNION:
			propname = "union";
			break;
		case Fleur.TypeInfo.DERIVATION_LIST:
			propname = "list";
			break;
	}
	t = this[propname];
	while (t) {
		if (t === typeArg) {
			return true;
		}
		t = t[propname];
	}
	return false;
};
Fleur.Types = {};
Fleur.Types["http://www.w3.org/2001/XMLSchema"] = {};
Fleur.Types_XMLSchema = Fleur.Types["http://www.w3.org/2001/XMLSchema"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "error");
Fleur.Type_error = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["error"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "untypedAtomic");
Fleur.Type_untypedAtomic = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["untypedAtomic"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anySimpleType");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anyAtomicType");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "string");
Fleur.Type_string = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["string"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "boolean");
Fleur.Type_boolean = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["boolean"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "decimal");
Fleur.Type_decimal = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["decimal"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "float");
Fleur.Type_float = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["float"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "double");
Fleur.Type_double = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["double"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "duration");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dateTime");
Fleur.Type_dateTime = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTime"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "time");
Fleur.Type_time = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["time"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "date");
Fleur.Type_date = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["date"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gYearMonth");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gYear");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gMonthDay");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gDay");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gMonth");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "hexBinary");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "base64Binary");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anyURI");
Fleur.Type_anyURI = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["anyURI"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "QName");
Fleur.Type_QName = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["QName"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NOTATION");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "normalizedString", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "token", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].normalizedString);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "language", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NMTOKEN", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NMTOKENS", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NMTOKEN);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "Name", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NCName", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].Name);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ID", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "IDREF", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "IDREFS", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].IDREF);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ENTITY", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ENTITIES", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].ENTITY);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].decimal);
Fleur.Type_integer = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["integer"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "nonPositiveInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "negativeInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonPositiveInteger);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "long", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "int", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].long);
Fleur.Type_int = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["int"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "short", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].int);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "byte", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].short);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "nonNegativeInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedLong", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonNegativeInteger);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedInt", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedLong);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedShort", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedInt);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedByte", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedShort);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "positiveInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonNegativeInteger);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "yearMonthDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].duration);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dayTimeDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].duration);
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dateTimeStamp", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].dateTime);
Fleur.Types["http://www.agencexml.com/fleur"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "regex", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_regex = Fleur.Types["http://www.agencexml.com/fleur"]["regex"];
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "handler");
Fleur.Type_handler = Fleur.Types["http://www.agencexml.com/fleur"]["handler"];
Fleur.Types["http://www.agencexml.com/fleur/io"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/fleur/io", "ipv4", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_ipv4 = Fleur.Types["http://www.agencexml.com/fleur/io"]["ipv4"];
new Fleur.TypeInfo("http://www.agencexml.com/fleur/io", "port", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedShort);
Fleur.Type_port = Fleur.Types["http://www.agencexml.com/fleur/io"]["port"];
Fleur.numericTypes = [Fleur.Type_integer, Fleur.Type_decimal, Fleur.Type_float, Fleur.Type_double];
Fleur.UserDataHandler = function() {};
Fleur.UserDataHandler.NODE_CLONED = 1;
Fleur.UserDataHandler.NODE_IMPORTED = 2;
Fleur.UserDataHandler.NODE_DELETED = 3;
Fleur.UserDataHandler.NODE_RENAMED = 4;
Fleur.UserDataHandler.NODE_ADOPTED = 5;
Fleur.XMLSerializer = function() {};
Fleur.XMLSerializer.prototype = new Fleur.Serializer();
Fleur.XMLSerializer.prototype.serializeToString = function(node, indent) {
	return Fleur.Serializer.prototype.serializeToString.call(this, node, "application/xml", indent);
};
Fleur.XPathFunctions = {};
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/array"] = {};
Fleur.XPathFunctions_array = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/array"];
Fleur.XPathFunctions["http://xqib.org"] = {};
Fleur.XPathFunctions_b = Fleur.XPathFunctions["http://xqib.org"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions"] = {};
Fleur.XPathFunctions_fn = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/map"] = {};
Fleur.XPathFunctions_map = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/map"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/math"] = {};
Fleur.XPathFunctions_math = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/math"];
Fleur.XPathFunctions["http://www.w3.org/2001/XMLSchema"] = {};
Fleur.XPathFunctions_xs = Fleur.XPathFunctions["http://www.w3.org/2001/XMLSchema"];
Fleur.XPathFunctions["http://expath.org/ns/file"] = {};
Fleur.XPathFunctions_file = Fleur.XPathFunctions["http://expath.org/ns/file"];
Fleur.XPathFunctions["http://expath.org/ns/http-client"] = {};
Fleur.XPathFunctions_http = Fleur.XPathFunctions["http://expath.org/ns/http-client"];
Fleur.XPathFunctions["http://exquery.org/ns/request"] = {};
Fleur.XPathFunctions_request = Fleur.XPathFunctions["http://exquery.org/ns/request"];
Fleur.XPathFunctions["http://basex.org/modules/prof"] = {};
Fleur.XPathFunctions_prof = Fleur.XPathFunctions["http://basex.org/modules/prof"];
Fleur.XPathFunctions["http://basex.org/modules/proc"] = {};
Fleur.XPathFunctions_proc = Fleur.XPathFunctions["http://basex.org/modules/proc"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/dgram"] = {};
Fleur.XPathFunctions_dgram = Fleur.XPathFunctions["http://www.agencexml.com/fleur/dgram"];
Fleur.XPathFunctions["https://tools.ietf.org/rfc/index"] = {};
Fleur.XPathFunctions_ietf = Fleur.XPathFunctions["https://tools.ietf.org/rfc/index"];
Fleur.XPathFunctions_array["append"] = function(ctx, children) {};
Fleur.XPathFunctions_array["filter"] = function(ctx, children) {};
Fleur.XPathFunctions_array["flatten"] = function(ctx, children) {};
Fleur.XPathFunctions_array["fold-left"] = function(ctx, children) {};
Fleur.XPathFunctions_array["fold-right"] = function(ctx, children) {};
Fleur.XPathFunctions_array["for-each"] = function(ctx, children) {};
Fleur.XPathFunctions_array["for-each-pair"] = function(ctx, children) {};
Fleur.XPathFunctions_array["get"] = function(ctx, children) {};
Fleur.XPathFunctions_array["head"] = function(ctx, children) {};
Fleur.XPathFunctions_array["insert-before"] = function(ctx, children) {};
Fleur.XPathFunctions_array["join"] = function(ctx, children) {};
Fleur.XPathFunctions_array["remove"] = function(ctx, children) {};
Fleur.XPathFunctions_array["reverse"] = function(ctx, children) {};
Fleur.XPathFunctions_array["size"] = function(ctx, children) {};
Fleur.XPathFunctions_array["sort"] = function(ctx, children) {};
Fleur.XPathFunctions_array["subarray"] = function(ctx, children) {};
Fleur.XPathFunctions_array["tail"] = function(ctx, children) {};
Fleur.XPathFunctions_b["addEventListener#3"] = new Fleur.Function("http://xqib.org", "b:addEventListener",
	function(htmlelt, eventname, handler, ctx) {
		if (!htmlelt) {
			return null;
		}
		htmlelt.addEventListener(eventname, function(evt) {
			var newctx = {
				_curr: null,
				env: {}
			};
			newctx.env.varresolver = new Fleur.varMgr([], ctx.env.varresolver);
			newctx.env.nsresolver = ctx.env.nsresolver;
			newctx.env.varresolver.set(ctx, "", handler.argtypes[0].name, evt.target);
			var evtelt = new Fleur.Element();
			evtelt.nodeName = "event";
			evtelt.namespaceURI = null;
			evtelt.localName = "event";
			evtelt.prefix = null;
			evtelt.childNodes = new Fleur.NodeList();
			evtelt.children = new Fleur.NodeList();
			evtelt.textContent = "";
			["screenX", "screenY", "clientX", "clientY", "button"].forEach(function(p) {
				var prop;
				if (evt[p] !== null && evt[p] !== undefined) {
					prop = new Fleur.Element();
					prop.nodeName = p;
					prop.namespaceURI = null;
					prop.localName = p;
					prop.prefix = null;
					prop.childNodes = new Fleur.NodeList();
					prop.children = new Fleur.NodeList();
					prop.textContent = String(evt[p]);
					evtelt.appendChild(prop);
				}
			});
			newctx.env.varresolver.set(ctx, "", handler.argtypes[1].name, evtelt);
			newctx.evt = evt;
			Fleur.XQueryEngine[handler.xqxfunc[0]](newctx, handler.xqxfunc[1], function() {});
			return false;
		}, false);
		return null;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Node}], true, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_b["alert#1"] = new Fleur.Function("http://xqib.org", "b:alert",
	function(s) {
		alert(s);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_b["dom#0"] = new Fleur.Function("http://xqib.org", "b:dom",
	function() { return document; },
	null, [], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_b["getProperty#2"] = new Fleur.Function("http://xqib.org", "b:getProperty",
	function(htmlelt, propertyname) {
		if (!htmlelt) {
			return null;
		}
		return String(htmlelt[propertyname]);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_b["getProperty#1"] = new Fleur.Function("http://xqib.org", "b:getProperty",
	function(propertyname, ctx) {
		return String(ctx._curr[propertyname]);
	},
	null, [{type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_b["getStyle#2"] = new Fleur.Function("http://xqib.org", "b:getStyle",
	function(htmlelt, stylepropertyname) {
		if (!htmlelt) {
			return null;
		}
		return htmlelt.style[stylepropertyname];
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_b["js-eval#1"] = new Fleur.Function("http://xqib.org", "b:js-eval",
	function(s) {
		return String((0, eval)(s));
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_b["preventDefault#0"] = new Fleur.Function("http://xqib.org", "b:preventDefault",
	function(ctx) {
		if (ctx.evt) {
			ctx.evt.preventDefault();
		}
	},
	null, [], true, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_b["setStyle#3"] = new Fleur.Function("http://xqib.org", "b:setStyle",
	function(htmlelt, stylepropertyname, stylepropertyvalue) {
		if (!htmlelt) {
			return null;
		}
		htmlelt.style[stylepropertyname] = stylepropertyvalue;
		return null;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_b["stopPropagation#0"] = new Fleur.Function("http://xqib.org", "b:stopPropagation",
	function(ctx) {
		if (ctx.evt) {
			ctx.evt.stopPropagation();
		}
	},
	null, [], true, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_fn["abs"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.abs, function(a) {
		switch (a.schemaTypeInfo) {
			case Fleur.Types_XMLSchema["nonPositiveInteger"]:
				return Fleur.Types_XMLSchema["nonNegativeInteger"];
			case Fleur.Types_XMLSchema["negativeInteger"]:
				return Fleur.Types_XMLSchema["positiveInteger"];
			case Fleur.Types_XMLSchema["byte"]:
				if (a.data === "128") {
					return Fleur.Types_XMLSchema["short"];
				}
				return Fleur.Types_XMLSchema["byte"];
			case Fleur.Types_XMLSchema["short"]:
				if (a.data === "32768") {
					return Fleur.Types_XMLSchema["int"];
				}
				return Fleur.Types_XMLSchema["short"];
			case Fleur.Types_XMLSchema["int"]:
				if (a.data === "2147483648") {
					return Fleur.Types_XMLSchema["long"];
				}
				return Fleur.Types_XMLSchema["int"];
			case Fleur.Types_XMLSchema["long"]:
				if (a.data === "9223372036854775808") {
					return Fleur.Types_XMLSchema["integer"];
				}
				return Fleur.Types_XMLSchema["long"];
		}
		return a.schemaTypeInfo;
	}, callback);
};
Fleur.XPathFunctions_fn["avg"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var sum = 0, val, t = 0, l = 1, a;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			a = Fleur.Atomize(n);
			val = Fleur.toJSNumber(a);
			t = val[0];
			if (t < 0) {
				sum = NaN;
				t = 0;
			} else {
				sum = val[1];
			}
		} else {
			var items = n.childNodes.slice(0);
			var i;
			i = 0;
			l = items.length;
			t = 3;
			while (i < l) {
				n = items[i];
				a = Fleur.Atomize(n);
				val = Fleur.toJSNumber(a);
				if (val[0] < 0) {
					sum = NaN;
					break;
				}
				sum += val[1];
				i++;
			}
		}
		a.data = ("" + (sum / l)).replace("e+", "e");
		a.schemaTypeInfo = Fleur.numericTypes[t];
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathFunctions_fn["boolean"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var boolean;
		if (n === Fleur.EmptySequence) {
			boolean = "false";
		} else if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (n.childNodes.length === 0) {
				boolean = "false";
			} else if (n.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || n.childNodes[0].ownerDocument) {
				boolean = "true";
			} else {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
				return;
			}
		} else if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} else if (n.schemaTypeInfo === Fleur.Type_boolean) {
			boolean = n.data;
		} else if (n.schemaTypeInfo === Fleur.Type_string || n.schemaTypeInfo === Fleur.Type_untypedAtomic || n.schemaTypeInfo === Fleur.Type_anyURI) {
			boolean = (!n.data || n.data.length === 0) ? "false" : "true";
		} else if (n.schemaTypeInfo === Fleur.Type_integer || n.schemaTypeInfo === Fleur.Type_decimal || n.schemaTypeInfo === Fleur.Type_float || n.schemaTypeInfo === Fleur.Type_double) {
			boolean = (n.data === "0" || n.data === "0.0" || n.data === "0.0e0" || n.data === "NaN") ? "false" : "true";
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = n.data;
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = (!n.data || n.data.length === 0) ? "false" : "true";
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = (n.data === "0" || n.data === "0.0" || n.data === "0.0e0" || n.data === "NaN") ? "false" : "true";
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
			return;
		}
		n = new Fleur.Text();
		n.data = boolean;
		n.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(n);});
	});
};
Fleur.XPathFunctions_fn["ceiling#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:ceiling",
	function(a) {
		return Math.ceil(a);
	},
	null, [{type: Fleur.Type_double, occurence: "?"}], false, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["codepoint-equal"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, true, function(a, b) {
		return a === b;
	}, Fleur.Type_boolean, callback);
};
Fleur.XPathFunctions_fn["codepoints-to-string"] = function(ctx, children, callback) {
	var s = "";
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		var i, l, code;
		if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
			for (i = 0, l = a.childNodes.length; i < l; i++) {
				if (a.childNodes[i].schemaTypeInfo === Fleur.Type_integer) {
					code = parseInt(a.childNodes[i].data, 10);
					if (code < 0 || code > 65535) {
						Fleur.callback(function() {callback(Fleur.error(ctx, "FOCH0001"));});
						return;
					}
					s += String.fromCodePoint(code);
				} else {
					Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
					return;
				}
			}
		} else {
			if (a.schemaTypeInfo === Fleur.Type_integer) {
				code = parseInt(a.data, 10);
				if (code < 0 || code > 65535) {
					Fleur.callback(function() {callback(Fleur.error(ctx, "FOCH0001"));});
					return;
				}
				s = String.fromCodePoint(code);
			} else {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
		}
		a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_string;
		a.data = s;
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathFunctions_fn["compare"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, true, function(a, b) {
		return a === b ? 0 : a < b ? -1 : 1;
	}, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["concat"] = function(ctx, children, callback) {
	var result = new Fleur.Text();
	result.schemaTypeInfo = Fleur.Type_string;
	if (children.length === 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var cb = function(n, eob) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (n !== Fleur.EmptySequence && n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		if (eob) {
			if (n !== Fleur.EmptySequence) {
				result.data += a.data;
			}
			Fleur.callback(function() {callback(result, true);});
			return;
		}
		if (children.length === 1) {
			Fleur.callback(function() {callback(n, true);});
			return;
		}
		if (a.data) {
			result.data = a.data;
		}
		Fleur.XPathFunctions_fn["concat"](ctx, children.slice(1), cb);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XPathFunctions_fn["contains#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains",
	function(a, b) {
		return !b ? true : !a ? false : a.indexOf(b) !== -1;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["count"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var count, res;
		if (n === Fleur.EmptySequence) {
			count = 0;
		} else if (n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.ARRAY_NODE) {
			count = 1;
		} else {
			count = n.childNodes.length;
		}
		res = new Fleur.Text();
		res.data = String(count);
		res.schemaTypeInfo = Fleur.Type_integer;
		Fleur.callback(function() {callback(res);});
	});
};
Fleur.XPathFunctions_fn["current-date#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-date",
	function() {
		return new Date();
	},
	null, [], false, false, {type: Fleur.Type_date});
Fleur.XPathFunctions_fn["current-dateTime"] = function(ctx, children, callback) {
	var a;
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	a = new Fleur.Text();
	var date = new Date();
	var o = date.getTimezoneOffset();
	a.schemaTypeInfo = Fleur.Type_dateTime;
	a.data = ("000" + date.getFullYear()).slice(-4) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "." + ("00" + date.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
	Fleur.callback(function() {callback(a);});
};
Fleur.XPathFunctions_fn["current-time#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-time",
	function() {
		return new Date();
	},
	null, [], false, false, {type: Fleur.Type_time});
Fleur.XPathFunctions_fn["data"] = function(ctx, children, callback) {
	if (children.length === 0) {
		Fleur.callback(function() {callback(Fleur.Atomize(ctx._curr));});
		return;
	}
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		Fleur.callback(function() {callback(Fleur.Atomize(n));});
	});
};
Fleur.XPathFunctions_fn["day-from-date"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_date, /^\d{4}-\d{2}-(\d{2})(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["day-from-dateTime"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_dateTime, /^\d{4}-\d{2}-(\d{2})T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["distinct-values"] = function(ctx, children, callback) {
	if (children.length === 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "FOCH0002"));});
		return;
	}
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = new Fleur.Sequence();
			a.childNodes.forEach(function(c) {
				if (!result.childNodes.some(function(r) {
						if ((c.schemaTypeInfo === Fleur.Type_string || c.schemaTypeInfo === Fleur.Type_untypedAtomic) &&
							(r.schemaTypeInfo === Fleur.Type_string || r.schemaTypeInfo === Fleur.Type_untypedAtomic)) {
							return c.data === r.data;
						}
						if (Fleur.numericTypes.indexOf(c.schemaTypeInfo) !== -1 &&
							Fleur.numericTypes.indexOf(r.schemaTypeInfo) !== -1) {
							return (c.data === "INF" && r.data === "INF") ||
								(c.data === "-INF" && r.data === "-INF") ||
								(c.data === "NaN" && r.data === "NaN") ||
								parseFloat(c.data) === parseFloat(r.data);
						}
						return c.schemaTypeInfo === r.schemaTypeInfo && c.data === r.data;
					})) {
					result.appendChild(c);
				}
			});
			if (result.childNodes.length === 1) {
				result = result.childNodes[0];
			}
			Fleur.callback(function() {callback(result);});
		} else {
			Fleur.callback(function() {callback(a);});
		}
	});
};
Fleur.extension2contentType = {
	".csv":  "text/csv",
	".htm":  "text/html",
	".html": "text/html",
	".json": "application/json",
	".svg":  "image/svg+xml",
	".txt":  "text/plain",
	".xml":  "application/xml; charset=utf-8",
	".xsl":  "text/xsl"
};
Fleur.XPathFunctions_fn["doc#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
	function(docname, ctx, callback) {
		return Fleur.XPathFunctions_fn["doc#2"].jsfunc(docname, null, ctx, callback);
	},
	null, [{type: Fleur.Type_string}], true, true, {type: Fleur.Node});
Fleur.XPathFunctions_fn["doc#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
	function(docname, serialization, ctx, callback) {
		var contentType;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			contentType = Fleur.toContentType(op2[1]);
		}
		var httpget = docname.startsWith("http://") || Fleur.inBrowser;
		var fileread = docname.startsWith("file://") || !httpget;
		var parser = new Fleur.DOMParser();
		if (httpget) {
			var getp = new Promise(function(resolve, reject) {
				var req = new XMLHttpRequest();
				req.open('GET', docname, true);
				req.onload = function() {
					if (req.status === 200) {
						resolve({text: req.responseText, contenttype: req.getResponseHeader("Content-Type")});
					} else {
						reject(Fleur.error(ctx, "FODC0002"));
			      	}
				};
				req.send(null);
			});
			getp.then(
				function(o) {
					callback(parser.parseFromString(o.text, o.contenttype));
				},
				function(a) {
					callback(a);
				}
			);
		} else if (fileread) {
			if (docname.startsWith("file://")) {
				docname = docname.substr(7);
			}
			if (!contentType) {
				contentType = Fleur.extension2contentType[global.path.extname(docname).toLowerCase()] || "application/xml";
			}
			global.fs.readFile(docname, 'binary', function(err, file) {
				if (err) {
					callback(Fleur.error(ctx, "FODC0002"));
				} else {
					callback(parser.parseFromString(file, contentType));
				}
			});
		}
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.Node});
Fleur.XPathFunctions_fn["empty"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		var result = new Fleur.Text();
		result.data = "" + (n === Fleur.EmptySequence);
		result.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(result);});
	});
};
Fleur.XPathFunctions_fn["encode-for-uri"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return encodeURIComponent(s).replace(/[!'()*]/g, function(c) {return '%' + c.charCodeAt(0).toString(16).toUpperCase();});}, null, callback);
};
Fleur.XPathFunctions_fn["ends-with#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:ends-with",
	function(a, b) {
		return !b ? true : !a ? false : a.endsWith(b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["error"] = function(ctx, children, callback) {
	if (children.length === 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "FOER0000"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FOER0000"));});
		} else if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
		} else if (a1.schemaTypeInfo !== Fleur.Type_QName) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
		} else {
			a1.schemaTypeInfo = Fleur.Type_error;
			if (children.length === 1) {
				Fleur.callback(function() {callback(a1);});
			} else {
				Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
					var a2 = Fleur.Atomize(n);
					a1.data = a2.data;
					Fleur.callback(function() {callback(a1);});
				});
			}
		}
	});
};
Fleur.XPathFunctions_fn["escape-html-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:escape-html-uri",
	function(s) {
		return !s ? "" : s.replace(/[^ -~]/g, function(c) {return encodeURIComponent(c);});
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["exactly-one"] = function(ctx, children, callback) {
	var i;
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var err = Fleur.error(ctx, "FORG0005");
			var result = err;
			n.childNodes.forEach(function(c) {
				if (c.schemaTypeInfo === Fleur.Type_error && result === err) {
					result = c;
				}
			});
			Fleur.callback(function() {callback(result);});
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XPathFunctions_fn["exists"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var result = new Fleur.Text();
		result.data = String(n !== Fleur.EmptySequence);
		result.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(result);});
	});
};
Fleur.XPathFunctions_fn["false#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:false",
	function() {
		return false;
	},
	null, [], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["floor"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.floor, function(a) {
		return a.schemaTypeInfo;
	}, callback);
};
Fleur.XPathFunctions_fn["function-arity#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-arity",
	function(f) {
		return f.argtypes.length;
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["function-lookup#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-lookup",
	function(fqname, arity) {
		return Fleur.XPathFunctions[fqname.namespaceURI] ? Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity] || null : null;
	},
	null, [{type: Fleur.Type_QName}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["function-name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-name",
	function(f) {
		var	a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_QName;
		a._setNodeNameLocalNamePrefix(f.namespaceURI, f.nodeName);
		return a;
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_QName});
Fleur.XPathFunctions_fn["head"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n === Fleur.EmptySequence || n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(n);});
		} else  {
			Fleur.callback(function() {callback(n.childNodes[0]);});
		}
	});
};
Fleur.XPathFunctions_fn["hours-from-dateTime"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_dateTime, /^\d{4}-\d{2}-\d{2}T(\d{2}):\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["hours-from-time"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_time, /^(\d{2}):\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["index-of"] = function(ctx, children, callback) {
	if (children.length === 3) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "FOCH0002"));});
		return;
	}
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence || a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
				a2.schemaTypeInfo = Fleur.Type_double;
			} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a2.schemaTypeInfo = Fleur.Type_string;
			}
			if (a1.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
					a1.schemaTypeInfo = Fleur.Type_double;
				} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					a1.schemaTypeInfo = Fleur.Type_string;
				}
				if (a1.schemaTypeInfo === Fleur.Type_string && a2.schemaTypeInfo === Fleur.Type_string ?
					a1.data.localeCompare(a2.data) === 0 :
					a1.schemaTypeInfo === a2.schemaTypeInfo && a1.data === a2.data) {
					a2.schemaTypeInfo = Fleur.Type_integer;
					a2.data = "1";
					Fleur.callback(function() {callback(a2);});
					return;
				}
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			var result = new Fleur.Sequence();
			a1.childNodes.forEach(function(c, i) {
				if (c.schemaTypeInfo === Fleur.Type_string && a2.schemaTypeInfo === Fleur.Type_string ?
					c.data.localeCompare(a2.data) === 0 :
					c.schemaTypeInfo === c.schemaTypeInfo && c.data === a2.data) {
						var b = new Fleur.Text();
						b.schemaTypeInfo = Fleur.Type_integer;
						b.data = "" + (i + 1);
						result.appendChild(b);
				}
			});
			if (result.childNodes.length === 0) {
				result = Fleur.EmptySequence;
			} else if (result.childNodes.length === 1) {
				result = result.childNodes[0];
			}
			Fleur.callback(function() {callback(result);});
		});
	});
};
Fleur.XPathFunctions_fn["insert-before"] = function(ctx, children, callback) {
	if (children.length !== 3) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		var seq = n;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var index;
			var a1 = Fleur.Atomize(n);
			if (a1.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a1);});
				return;
			}
			if (a1.schemaTypeInfo !== Fleur.Type_integer) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			index = Math.max(parseInt(a1.data, 10) - 1, 0);
			Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
				var a2 = Fleur.Atomize(n);
				if (a2 === Fleur.EmptySequence) {
					Fleur.callback(function() {callback(seq);});
					return;
				}
				if (seq === Fleur.EmptySequence) {
					Fleur.callback(function() {callback(a2);});
					return;
				}
				var result = new Fleur.Sequence();
				if (seq.nodeType === Fleur.Node.SEQUENCE_NODE) {
					var i = 0, l;
					l = seq.childNodes.length;
					index = Math.min(index, l);
					while (i < index) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
					if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
						a2.childNodes.forEach(function(m) {result.appendChild(m);});
					} else {
						result.appendChild(a2);
					}
					while (i < l) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
				} else {
					result = new Fleur.Sequence();
					if (index !== 0) {
						result.appendChild(seq);
					}
					if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
						a2.childNodes.forEach(function(m) {result.appendChild(m);});
					} else {
						result.appendChild(a2);
					}
					if (index === 0) {
						result.appendChild(seq);
					}
				}
				Fleur.callback(function() {callback(result);});
			});
		});
	});
};
Fleur.XPathFunctions_fn["iri-to-uri"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return s.replace(/([^!-~]|[<>"{}|\\\^\`])/g, function(c) {return encodeURIComponent(c);});}, null, callback);
};
Fleur.XPathFunctions_fn["last"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_integer;
	a.data = "" + ctx._last;
	Fleur.callback(function() {callback(a);});
};
Fleur.XPathFunctions_fn["local-name#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:local-name",
	function(ctx) {
		if (ctx._curr === null) {
			return null;
		}
		if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return ctx._curr.localName;
	},
	null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["local-name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:local-name",
	function(node) {
		if (node === null) {
			return null;
		}
		if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return node.localName;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["lower-case"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return s.toLowerCase();}, null, callback);
};
Fleur.XPathFunctions_fn["max"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var max, val, t = 0, comp;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.Atomize(n));});
			return;
		} else {
			var items = n.childNodes, a;
			var i, l;
			i = 0;
			l = items.length;
			while (i < l) {
				a = Fleur.Atomize(items[i]);
				if (!comp) {
					if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
						comp = Fleur.Type_string;
					} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
						comp = Fleur.Type_string;
					} else {
						comp = Fleur.Type_double;
					}
				}
				if (comp === Fleur.Type_double) {
					val = Fleur.toJSNumber(a);
				} else {
					val = Fleur.toJSString(a);
				}
				if (val[0] < 0) {
					if (!comp) {
						comp = Fleur.Type_string;
						val = Fleur.toJSString(a);
					} else {
						Fleur.error("");
					}
				}
				if (!max) {
					t = val[0];
					max = val[1];
				} else {
					if (comp === Fleur.Type_double) {
						if (max < val[1]) {
							t = val[0];
							max = val[1];
						}
					} else if (max.localeCompare(val[1]) < 0) {
						max = val[1];
					}
				}
				i++;
			}
		}
		a.data = "" + max;
		a.schemaTypeInfo = comp === Fleur.Type_double ? Fleur.numericTypes[t] : Fleur.Type_string;
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathFunctions_fn["min"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var min, val, t = 0, comp;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.Atomize(n));});
			return;
		} else {
			var items = n.childNodes;
			var i, l, a;
			i = 0;
			l = items.length;
			while (i < l) {
				a = Fleur.Atomize(items[i]);
				if (!comp) {
					if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
						comp = Fleur.Type_string;
					} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
						comp = Fleur.Type_string;
					} else {
						comp = Fleur.Type_double;
					}
				}
				if (comp === Fleur.Type_double) {
					val = Fleur.toJSNumber(a);
				} else {
					val = Fleur.toJSString(a);
				}
				if (val[0] < 0) {
					if (!comp) {
						comp = Fleur.Type_string;
						val = Fleur.toJSString(a);
					} else {
						Fleur.error("");
					}
				}
				if (!min) {
					t = val[0];
					min = val[1];
				} else {
					if (comp === Fleur.Type_double) {
						if (min > val[1]) {
							t = val[0];
							min = val[1];
						}
					} else if (min.localeCompare(val[1]) > 0) {
						min = val[1];
					}
				}
				i++;
			}
		}
		a.data = "" + min;
		a.schemaTypeInfo = comp === Fleur.Type_double ? Fleur.numericTypes[t] : Fleur.Type_string;
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathFunctions_fn["minutes-from-dateTime"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_dateTime, /^\d{4}-\d{2}-\d{2}T\d{2}:(\d{2}):\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["minutes-from-time"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_time, /^\d{2}:(\d{2}):\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["month-from-date"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_date, /^\d{4}-(\d{2})-\d{2}(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["month-from-dateTime"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_dateTime, /^\d{4}-(\d{2})-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["name#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:name",
	function(ctx) {
		if (ctx._curr === null) {
			return null;
		}
		if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return ctx._curr.nodeName;
	},
	null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:name",
	function(node) {
		if (node === null) {
			return null;
		}
		if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return node.nodeName;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["namespace-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:namespace-uri",
	function(ctx) {
		if (ctx._curr === null) {
			return null;
		}
		if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return ctx._curr.namespaceURI;
	},
	null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Type_anyURI});
Fleur.XPathFunctions_fn["namespace-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:namespace-uri",
	function(node) {
		if (node === null) {
			return null;
		}
		if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return node.namespaceURI;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});
Fleur.XPathFunctions_fn["normalize-space"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return s.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");}, null, callback);
};
Fleur.XPathFunctions_fn["not"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var boolean;
		var a;
		if (n === Fleur.EmptySequence) {
			boolean = "true";
		} else {
			if (n.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			a = Fleur.Atomize(n);
			if (a.schemaTypeInfo === Fleur.Type_boolean) {
				boolean = a.data === "true" ? "false" : "true";
			} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
				boolean = a.childNodes.length !== 0 ? "false" : "true";
			} else if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				boolean = (a.data && a.data.length !== 0) ? "false" : "true";
			} else if (a.schemaTypeInfo === Fleur.Type_integer || a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
				boolean = (a.data !== "0" && a.data !== "0.0" && a.data !== "0.0e0" && a.data !== "NaN") ? "false" : "true";
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				boolean = (a.data !== "0" && a.data !== "0.0" && a.data !== "0.0e0" && a.data !== "NaN") ? "false" : "true";
			} else {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
				return;
			}
		}
		a = new Fleur.Text();
		a.data = boolean;
		a.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathFunctions_fn["number"] = function(ctx, children, callback) {
	if (children.length > 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var cb = function(n) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a === Fleur.EmptySequence) {
			a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_double;
			a.data = "NaN";
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_boolean) {
			a.schemaTypeInfo = Fleur.Type_double;
			a.data = a.data === "true" ? "1.0e0" : "0.0e0";
			Fleur.callback(function() {callback(a);});
			return;
		}
		a.schemaTypeInfo = Fleur.Type_double;
		if (!(/^\s*(([\-+]?([0-9]+(\.[0-9]*)?)|(\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN)\s*$/.test(a.data))) {
			a.data = "NaN";
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.data !== "INF" && a.data !== "-INF" && a.data !== "NaN") {
			a.data = ("" + parseFloat(a.data)).replace("e+", "e");
		}
		Fleur.callback(function() {callback(a);});
	};
	if (children.length === 0) {
		cb(ctx._curr);
	} else {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	}
};
Fleur.XPathFunctions_fn["one-or-more"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0004"));});
			return;
		}
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = n;
			n.childNodes.forEach(function(c) {
				if (c.schemaTypeInfo === Fleur.Type_error && result === n) {
					result = c;
				}
			});
			Fleur.callback(function() {callback(result);});
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XPathFunctions_fn["position"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_integer;
	a.data = String(ctx._pos);
	Fleur.callback(function() {callback(a);});
};
Fleur.XPathFunctions_fn["QName"] = function(ctx, children, callback) {
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var namespaceURI = n.data;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var qualifiedName = n.data;
			var a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_QName;
			a._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
			Fleur.callback(function() {callback(a);});
		});
	});
};
Fleur.XPathFunctions_fn["remove"] = function(ctx, children, callback) {
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		var seq = n;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var i, l, index, result;
			var a = Fleur.Atomize(n);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a);});
				return;
			}
			if (a.schemaTypeInfo !== Fleur.Type_integer) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
				return;
			}
			index = parseInt(a.data, 10) - 1;
			if (seq.nodeType === Fleur.Node.SEQUENCE_NODE) {
				l = seq.childNodes.length;
				if (index >= 0 && index < l) {
					result = new Fleur.Sequence();
					result.nodeType = Fleur.Node.SEQUENCE_NODE;
					i = 0;
					while (i < index) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
					i++;
					while (i < l) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
					if (result.childNodes.length === 1) {
						result = result.childNodes[0];
					}
				} else {
					result = seq;
				}
			} else if (index === 0) {
				result = Fleur.EmptySequence;
			} else {
				result = seq;
			}
			Fleur.callback(function() {callback(result);});
		});
	});
};
Fleur.XPathFunctions_fn["reverse"] = function(ctx, children, callback) {
	var i;
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = new Fleur.Sequence();
			result.nodeType = Fleur.Node.SEQUENCE_NODE;
			i = n.childNodes.length - 1;
			while (i >= 0) {
				result.appendChild(n.childNodes[i]);
				i--;
			}
			Fleur.callback(function() {callback(result);});
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XPathFunctions_fn["round"] = function(ctx, children, callback) {
	if (children.length === 2) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			var op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			var precision = op2[1];
			Fleur.XPathNumberFunction(ctx, children.slice(0, 1), function(v) {
				return Math.round(v * Math.pow(10, precision)) / Math.pow(10, precision);
			}, function(a) {
				return a.schemaTypeInfo;
			}, callback);
		});
		return;
	}
	Fleur.XPathNumberFunction(ctx, children, Math.round, function(a) {
		return a.schemaTypeInfo;
	}, callback);
};
Fleur.XPathFunctions_fn["round-half-to-even"] = function(ctx, children, callback) {
	if (children.length === 2) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			var op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			var precision = op2[1];
			Fleur.XPathNumberFunction(ctx, children.slice(0, 1), function(v) {
				var v2 = v * Math.pow(10, precision);
				if (v2 === Number.POSITIVE_INFINITY) {
					return v;
				}
				if (v2 === 0) {
					return 0;
				}
				if (v2 - Math.floor(v2) === 0.5 && Math.floor(v2) % 2 === 0) {
					v2 -= 1;
				}
				return Math.round(v2) / Math.pow(10, precision);
			}, function(a) {
				return a.schemaTypeInfo;
			}, callback);
		});
		return;
	}
	Fleur.XPathNumberFunction(ctx, children, function(v) {
		if (v - Math.floor(v) === 0.5 && Math.floor(v) % 2 === 0) {
			v -= 1;
		}
		return Math.round(v);
	}, function(a) {
		return a.schemaTypeInfo;
	}, callback);
};
Fleur.XPathFunctions_fn["seconds-from-dateTime"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_dateTime, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_decimal, callback);
};
Fleur.XPathFunctions_fn["seconds-from-time"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_time, /^\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_decimal, callback);
};
Fleur.XPathFunctions_fn["starts-with#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
	function(a, b) {
		return !b ? true : !a ? false : a.startsWith(b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["string"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_string, null, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_fn["string-length#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length",
	function(a) {
		return !a ? 0 : a.length;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["string-to-codepoints"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var result, c;
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			if (a.data.length === 0) {
				result = Fleur.EmptySequence;
			} else if (a.data.length === 1) {
				result = new Fleur.Text();
				result.schemaTypeInfo = Fleur.Type_integer;
				result.data = String(a.data.codePointAt(0));
			} else {
				result = new Fleur.Sequence();
				var i, l;
				for (i = 0, l = a.data.length; i < l; i++) {
					c = new Fleur.Text();
					c.schemaTypeInfo = Fleur.Type_integer;
					c.data = String(a.data.codePointAt(i));
					result.appendChild(c);
				}
			}
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FOCH0001"));});
			return;
		}
		Fleur.callback(function() {callback(result);});
	});
};
Fleur.XPathFunctions_fn["substring#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring",
	function(source, start) {
		return source.substr(start - 1);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["substring#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring",
	function(source, start, end) {
		return source.substr(start - 1, end);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_integer}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["substring-after#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-after",
	function(a, b) {
		if (!a) {
			return "";
		}
		if (!b || b === "") {
			return a;
		}
		var index = a.indexOf(b);
		return index === -1 ? "" : a.substring(index + b.length);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["substring-before#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-before",
	function(a, b) {
		return !a || !b ? "" : a.substring(0, a.indexOf(b));
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["sum"] = function(ctx, children, callback) {
	if (children.length !== 1 && children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var sum = 0, val, t = 0, a;
		if (n !== Fleur.EmptySequence) {
			if (n.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				a = Fleur.Atomize(n);
				val = Fleur.toJSNumber(a);
				t = val[0];
				if (t < 0) {
					sum = NaN;
					t = 0;
				} else {
					sum = val[1];
				}
			} else {
				var items = n.childNodes;
				var i, l;
				i = 0;
				l = items.length;
				while (i < l) {
					a = Fleur.Atomize(items[i]);
					val = Fleur.toJSNumber(a);
					if (val[0] < 0) {
						sum = NaN;
						t = 0;
						break;
					}
					sum += val[1];
					t = Math.max(t, val[0]);
					i++;
				}
			}
		} else {
			a = new Fleur.Text();
		}
		if (sum === 0 && children.length === 2) {
			Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
				Fleur.callback(function() {callback(Fleur.Atomize(n));});
			});
		} else {
			a.data = "" + sum;
			a.schemaTypeInfo = Fleur.numericTypes[t];
			Fleur.callback(function() {callback(a);});
		}
	});
};
Fleur.XPathFunctions_fn["tail"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (n.childNodes.length > 1) {
				n.childNodes.shift();
			} else {
				n = n.childNodes[0];
			}
		} else {
			n = Fleur.EmptySequence;
		}
		Fleur.callback(function() {callback(n);});
	});
};
Fleur.XPathFunctions_fn["trace#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n) {
		console.log(Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_fn["trace#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n, label) {
		console.log(label + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string}], false, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_fn["true#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:true",
	function() {
		return true;
	},
	null, [], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["unordered"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		Fleur.callback(function() {callback(n);});
	});
};
Fleur.XPathFunctions_fn["unparsed-text"] = function(ctx, children, callback) {
	var mediatype = "text/plain";
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var cb = function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSString(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		var docname = op1[1];
		var httpget = docname.startsWith("http://") || Fleur.inBrowser;
		var fileread = docname.startsWith("file://") || !httpget;
		if (httpget) {
			if (docname.startsWith("http://")) {
				docname = docname.substr(7);
			}
			var getp = new Promise(function(resolve, reject) {
				var req = new XMLHttpRequest();
				req.open('GET', docname, true);
				req.onload = function() {
					if (req.status === 200) {
						resolve(req.responseText);
					} else {
						reject(Fleur.error(ctx, "FODC0002"));
			      	}
				};
				req.send(null);
			});
			getp.then(
				function(s) {
					var parser = new Fleur.DOMParser();
					callback(parser.parseFromString(s, mediatype));
				},
				function(a) {
					callback(a);
				}
			);
		} else if (fileread) {
			if (docname.startsWith("file://")) {
				docname = docname.substr(7);
			}
			if (!docname.startsWith(global.path.sep)) {
				docname = global.path.join(Fleur.baseDir, docname);
			}
			global.fs.readFile(docname, 'binary', function(err, file){
				if (err) {
					process.stdout.write(err);
					Fleur.callback(function() {callback();});
				} else {
					var a = new Fleur.Text();
					a.schemaTypeInfo = Fleur.Type_string;
					a.data = file;
					Fleur.callback(function() {callback(a);});
				}
			});
		}
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XPathFunctions_fn["upper-case"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return s.toUpperCase();}, null, callback);
};
Fleur.XPathFunctions_fn["year-from-date"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_date, /^(\d{4})-\d{2}-\d{2}(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["year-from-dateTime"] = function(ctx, children, callback) {
	Fleur.XPathFromDateTimeFunction(ctx, children, Fleur.Type_dateTime, /^(\d{4})-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/, Fleur.Type_integer, callback);
};
Fleur.XPathFunctions_fn["zero-or-one"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n !== Fleur.EmptySequence && n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var err = Fleur.error(ctx, "FORG0003");
			var result = err;
			n.childNodes.forEach(function(c) {
				if (c.schemaTypeInfo === Fleur.Type_error && result === err) {
					result = c;
				}
			});
			Fleur.callback(function() {callback(result);});
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XPathFunctions_fn["adjust-date-to-timezone"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["adjust-time-to-timezone"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["analyze-string"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["apply"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["available-environment-variables"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["base-uri"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["collation-key"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["collection"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["contains-token"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["dateTime"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["days-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["deep-equal"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["default-collation"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["element-with-id"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["environment-variable"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["filter"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["fold-left"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["fold-right"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["for-each"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["for-each-pair"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["format-date"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["format-dateTime"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["format-integer"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["format-number"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["format-time"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["generate-id"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["has-children"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["hours-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["id"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["idref"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["implicit-timezone"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["in-scope-prefixes"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["innermost"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["json-doc"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["lang"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["load-xquery-module"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["local-name-from-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["matches"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["minutes-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["months-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["namespace-uri-for-prefix"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["namespace-uri-from-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["nilled"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["node-name"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["normalize-unicode"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["outermost"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["parse-ietf-date"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["parse-json"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["parse-xml"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["parse-xml-fragment"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["path"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["prefix-from-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["random-number-generator"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["replace"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["resolve-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["resolve-uri"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["root"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["seconds-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["serialize"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["sort"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["static-base-uri"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["string-join"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["subsequence"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["timezone-from-date"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["timezone-from-dateTime"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["timezone-from-time"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["tokenize"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["transform"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["translate"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["unparsed-text-available"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["unparsed-text-lines"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["uri-collection"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["years-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_http["send-request#1"] = new Fleur.Function("http://expath.org/ns/http-client", "http:send-request",
	function(request, callback) {
		var method = request.getAttribute("method");
		var href = request.getAttribute("href");
		try {
			if (global && global.http) {
				callback(null);
				return;
			}
		} catch (e) {
			var req = new XMLHttpRequest();
			req.addEventListener("load", function() {
				var seq = new Fleur.Sequence();
				var elt = new Fleur.Element();
				elt.nodeName = "http:response";
				elt.namespaceURI = "http://expath.org/ns/http-client";
				elt.localName = "response";
				elt.prefix = "http";
				elt.childNodes = new Fleur.NodeList();
				elt.children = new Fleur.NodeList();
				elt.textContent = "";
				seq.appendChild(elt);
				var parser = new Fleur.DOMParser();
				var doc = parser.parseFromString(req.responseText, "application/xml");
				seq.appendChild(doc);
				callback(seq);
			});
			req.open(method.toUpperCase(), href);
			req.send();
		}
	},
	null, [{type: Fleur.Node}], false, true, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_dgram["socket-create#1"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-create",
	function(protocol) {
		console.log("create");
		return global.dgram.createSocket(protocol);
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_handler});
Fleur.XPathFunctions_dgram["socket-send#4"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-send",
	function(sock, packet, address, port, callback) {
		console.log(packet[6].toString(16) + ":" + packet[7].toString(16) + ":" + packet[8].toString(16) + ":" + packet[9].toString(16) + ":" + packet[10].toString(16) + ":" + packet[11].toString(16) + " " + address + ":" + port);
		callback(null);
	},
	null, [{type: Fleur.Type_handler}, {type: Fleur.Type_integer, occurence: "+"}, {type: Fleur.Type_ipv4}, {type: Fleur.Type_port}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_dgram["socket-close#1"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-close",
	function(sock) {
		console.log("close");
		sock.close();
	},
	null, [{type: Fleur.Type_handler}], false, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_ietf["ipv4"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_ipv4, /^((1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]).){3}(1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/, function() {}, function(node) {
		return false;
	}, callback);
};
Fleur.XPathFunctions_ietf["mac#1"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:mac",
	function(macaddress) {
		var result = new Fleur.Sequence();
		var i, l, c;
		for (i = 0, l = macaddress.length; i < l; i++) {
			if ("0123456789ABCDEFabcdef".indexOf(macaddress.charAt(i)) !== -1) {
				c = new Fleur.Text();
				c.schemaTypeInfo = Fleur.Type_integer;
				c.data = String(parseInt(macaddress.charAt(i) + macaddress.charAt(i + 1), 16));
				result.appendChild(c);
				i++;
			}
		}
		return result;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_ietf["port"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_port, /^[0-9]+$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = String(value);
		return value > 65535;
	}, callback);
};
Fleur.XPathFunctions_map["contains"] = function(ctx, children) {};
Fleur.XPathFunctions_map["entry"] = function(ctx, children) {};
Fleur.XPathFunctions_map["for-each"] = function(ctx, children) {};
Fleur.XPathFunctions_map["get"] = function(ctx, children) {};
Fleur.XPathFunctions_map["keys"] = function(ctx, children) {};
Fleur.XPathFunctions_map["merge"] = function(ctx, children) {};
Fleur.XPathFunctions_map["put"] = function(ctx, children) {};
Fleur.XPathFunctions_map["remove"] = function(ctx, children) {};
Fleur.XPathFunctions_map["size"] = function(ctx, children) {};
Fleur.XPathFunctions_math["acos#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:acos",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.acos(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["asin#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:asin",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.asin(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["atan#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:atan",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.atan(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["atan2#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:atan2",
	Math.atan2,
	null, [{type: Fleur.numericTypes}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["cos#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:cos",
	function(theta) {
		if (theta === null) {
			return null;
		}
		return Math.cos(theta);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["exp#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:exp",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.exp(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["exp10#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:exp10",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.pow(10, arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["log#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:log",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.log(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["log10#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:log10",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.log10(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["pi#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:pi",
	function() { return 3.141592653589793; },
	null, [], false, false, {type: Fleur.Type_double});
Fleur.XPathFunctions_math["pow#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:pow",
	function(x, y) {
		if (x === null) {
			return null;
		}
		return Math.pow(x, y);},
	null, [{type: Fleur.numericTypes, occurence: "?"}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["sin#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:sin",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.sin(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["sqrt#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:sqrt",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.sqrt(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["tan#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:tan",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.tan(arg);},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_file["base-dir"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var result = Fleur.EmptySequence;
	Fleur.callback(function() {callback(result);});
};
Fleur.XPathFunctions_file["current-dir#0"] = new Fleur.Function("http://expath.org/ns/file", "file:current-dir",
	function() { return process ? process.cwd() : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["dir-separator#0"] = new Fleur.Function("http://expath.org/ns/file", "file:dir-separator",
	function() { return global.path ? global.path.sep : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["exists#1"] = new Fleur.Function("http://expath.org/ns/file", "file:exists",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.access(path, function(err) {
			callback(!err);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_file["is-absolute#1"] = new Fleur.Function("http://expath.org/ns/file", "file:is-absolute",
	function(path) {
		return global.path ? String(global.path.isAbsolute(path)) : null;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_file["is-dir#1"] = new Fleur.Function("http://expath.org/ns/file", "file:is-dir",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			callback(!err && stats.isDirectory());
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_file["is-file#1"] = new Fleur.Function("http://expath.org/ns/file", "file:is-file",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			callback(!err && stats.isFile());
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_file["last-modified#1"] = new Fleur.Function("http://expath.org/ns/file", "file:last-modified",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			if (!err) {
				callback(stats.mtime);
				return;
			}
			callback(null);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_dateTime, occurence: "?"});
Fleur.XPathFunctions_file["line-separator#0"] = new Fleur.Function("http://expath.org/ns/file", "file:line-separator",
	function() { return global.os ? global.os.EOL : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["name#1"] = new Fleur.Function("http://expath.org/ns/file", "file:name",
	function(path) {
		var spl = path.replace("\\", "/").split("/");
		if (spl.length > 0) {
			return spl[spl.length - 1];
		}
		return "";
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_file["path-separator#0"] = new Fleur.Function("http://expath.org/ns/file", "file:path-separator",
	function() { return global.path ? global.path.delimiter : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["size#1"] = new Fleur.Function("http://expath.org/ns/file", "file:size",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			if (!err) {
				callback(stats.isFile() ? stats.size : 0);
				return;
			}
			callback(null);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_file["temp-dir#0"] = new Fleur.Function("http://expath.org/ns/file", "file:temp-dir",
	function() { return global.os ? global.os.tmpdir() : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["write#2"] = new Fleur.Function("http://expath.org/ns/file", "file:write",
	function(filename, node, ctx, callback) {
		return Fleur.XPathFunctions_file["write#3"].jsfunc(filename, node, null, ctx, callback);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_file["write#3"] = new Fleur.Function("http://expath.org/ns/file", "file:write",
	function(filename, node, serialization, ctx, callback) {
		var contentType;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			contentType = Fleur.toContentType(op2[1]);
		}
		if (!contentType) {
			contentType = Fleur.extension2contentType[global.path.extname(filename).toLowerCase()] || "application/xml";
		}
		var ser = new Fleur.Serializer();
		global.fs.writeFile(filename, ser.serializeToString(node, contentType), function(err) {
			if (err) {
				callback(Fleur.error(ctx, "FODC0002"));
			} else {
				callback(Fleur.EmptySequence);
			}
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_prof["sleep#1"] = new Fleur.Function("http://basex.org/modules/proc", "prof:sleep",
	function(ms, callback) {
		if (ms > 0) {
			setTimeout(function() {
				callback(null);
			}, ms);
			return;
		}
		callback(null);
	},
	null, [{type: Fleur.Type_integer}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_proc["property#1"] = new Fleur.Function("http://basex.org/modules/proc", "proc:property",
	function(pname) {
		switch (pname) {
			case "host-name":
				if (process) {
					return global.os.hostname();
				}
				return null;
			case "host-addresses":
				if (process) {
					var addrs = '';
					var interfs = global.os.networkInterfaces();
					for (var interf in interfs) {
						if (interfs.hasOwnProperty(interf)) {
							if (interfs[interf].length !== 0 && interfs[interf][0].mac !== "00:00:00:00:00:00") {
								if (addrs !== "" && interfs[interf].length !== 0) {
									addrs += " /";
								}
								if (interfs[interf].length !== 0) {
									if (addrs === "") {
										addrs = interfs[interf][0].mac;
									} else {
										addrs += " " + interfs[interf][0].mac;
									}
								}
								interfs[interf].forEach(function(e) {
									if (addrs === "") {
										addrs = e.address;
									} else {
										addrs += ' ' + e.address;
									}
								});
							}
						}
					}
					return addrs;
				}
				return null;
			case "host-engine":
				if (process) {
					var filename = global.path.basename(process.argv[1]);
					if (!filename.endsWith(".js")) {
						filename += ".js";
					}
					var filestats = global.fs.statSync(filename);
					return global.os.platform() + ' ' + global.os.release() + " nodeJS " + process.version + " " + global.path.basename(filename) + " " + filestats.mtime.toISOString();
				}
				return navigator.userAgent;
			case "xquery-engine":
				return "Fleur.js " + global.fleurmtime;
			default:
				return null;
		}
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_request["query-map#0"] = new Fleur.Function("http://exquery.org/ns/request", "request:query-map",
	function(ctx) {
		var map = new Fleur.Map();
		if (ctx.env.request && ctx.env.request.query) {
			ctx.env.request.query.split("&").forEach(function (p) {
				p = p.split("=");
				var entry = new Fleur.Entry();
				entry.nodeName = p[0];
				entry.namespaceURI = null;
				entry.localName = p[0];
				var text = new Fleur.Text();
				text.schemaTypeInfo = Fleur.Type_string;
				text.nodeValue = decodeURIComponent(p[1]);
				entry.appendChild(text);
				map.setEntryNode(entry);
			});
		}
		return map;
	},
	null, [], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["anyURI"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["anyURI"], /^(([^ :\/?#]+):\/\/)?[^ \/\?#]+([^ \?#]*)(\?([^ #]*))?(#([^ \:#\[\]\@\!\$\&\\'\(\)\*\+\,\;\=]*))?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["base64Binary"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["base64Binary"], /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["boolean"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_boolean, /^(true|false|0|1)$/, function(node) {
		if (node.schemaTypeInfo === Fleur.Type_integer || node.schemaTypeInfo === Fleur.Type_decimal || node.schemaTypeInfo === Fleur.Type_float || node.schemaTypeInfo === Fleur.Type_double) {
			node.data = (node.data === "0" || node.data === "NaN") ? "false" : "true";
		} else {
			node = Fleur.error(ctx, "FORG0001");
		}
	}, function(node) {
		if (node.data === "0") {
			node.data = "false";
		} else if (node.data === "1") {
			node.data = "true";
		}
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["byte"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["byte"], /^[\-+]?[0-9]+$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value < -128 || value > 127;
	}, callback);
};
Fleur.XPathFunctions_xs["date"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["date"], /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["dateTime"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTime"], /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["dateTimeStamp"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTimeStamp"], /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["dayTimeDuration"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dayTimeDuration"], /^-?P(?!$)([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["decimal"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_decimal, /^[\-+]?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["double"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_double, /^(([\-+]?([0-9]+(\.[0-9]*)?)|(\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN)$/, function() {}, function(node) {
		if (node.data !== "INF" && node.data !== "-INF" && node.data !== "NaN") {
			var value = parseFloat(node.data);
			node.data = ("" + value).replace("e+", "e");
		}
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["duration"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["duration"], /^-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["float"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_float, /^(([\-+]?([0-9]+(\.[0-9]*)?)|(\.[0-9]+))([eE][\-+]?[0-9]+)?|-?INF|NaN)$/, function() {}, function(node) {
		if (node.data !== "INF" && node.data !== "-INF" && node.data !== "NaN") {
			var value = parseFloat(node.data);
			node.data = ("" + value).replace("e+", "e");
		}
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["gDay"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gDay"], /^---(0[1-9]|[12][0-9]|3[01])$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["gMonth"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gMonth"], /^--(0[1-9]|1[012])$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["gMonthDay"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gMonthDay"], /^--(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["gYear"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gYear"], /^([\-+]?([0-9]{4}|[1-9][0-9]{4,}))?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["gYearMonth"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gYearMonth"], /^([12][0-9]{3})-(0[1-9]|1[012])$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["hexBinary"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["hexBinary"], /^([0-9A-Fa-f]{2})+$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["int"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_int, /^[\-+]?[0-9]+$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value < -2147483648 || value > 2147483647;
	}, callback);
};
Fleur.XPathFunctions_xs["integer"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_integer, /^[\-+]?[0-9]+$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["long"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["long"], /^[\-+]?[0-9]+$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value < -9223372036854775808 || value > 9223372036854775807;
	}, callback);
};
Fleur.XPathFunctions_xs["negativeInteger"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["negativeInteger"], /^-0*[1-9][0-9]*$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["nonNegativeInteger"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonNegativeInteger"], /^(\+?[0-9]+|-0)$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["nonPositiveInteger"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonPositiveInteger"], /^(-[0-9]+|0)$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["positiveInteger"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["positiveInteger"], /^\+?0*[1-9][0-9]*$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["QName"] = function(ctx, children, callback) {
	var namespaceURI, qualifiedName, a;
	if (children.length === 1) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
			namespaceURI = "";
			qualifiedName = n.data;
			a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_QName;
			a._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
			Fleur.callback(function() {callback(a);});
		});
	} else if (children.length === 2) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
			namespaceURI = n.data;
			Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
				qualifiedName = n.data;
				a = new Fleur.Text();
				a.schemaTypeInfo = Fleur.Type_QName;
				a._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
				Fleur.callback(function() {callback(a);});
			});
		});
	} else {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
	}
};
Fleur.XPathFunctions_xs["short"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["short"], /^[\-+]?[0-9]+$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value < -32768 || value > 32767;
	}, callback);
};
Fleur.XPathFunctions_xs["string"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_string, null, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["time"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["time"], /^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9](\.[0-9]+)?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?)?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["unsignedByte"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedByte"], /^(\+?[0-9]+|-0)$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value > 255;
	}, callback);
};
Fleur.XPathFunctions_xs["unsignedInt"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedInt"], /^(\+?[0-9]+|-0)$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value > 4294967295;
	}, callback);
};
Fleur.XPathFunctions_xs["unsignedLong"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedLong"], /^(\+?[0-9]+|-0)$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value > 18446744073709551615;
	}, callback);
};
Fleur.XPathFunctions_xs["unsignedShort"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedShort"], /^(\+?[0-9]+|-0)$/, function() {}, function(node) {
		var value = parseInt(node.data, 10);
		node.data = "" + value;
		return value > 65535;
	}, callback);
};
Fleur.XPathFunctions_xs["untypedAtomic"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_untypedAtomic, null, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["yearMonthDuration"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["yearMonthDuration"], /^-?P(?!$)([0-9]+Y)?([0-9]+M)?$/, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_xs["ENTITY"] = function(ctx, children) {};
Fleur.XPathFunctions_xs["ID"] = function(ctx, children) {};
Fleur.XPathFunctions_xs["IDREF"] = function(ctx, children) {};
Fleur.XPathFunctions_xs["NCName"] = function(ctx, children) {};
Fleur.XPathFunctions_xs["NMTOKEN"] = function(ctx, children) {};
Fleur.XPathFunctions_xs["Name"] = function(ctx, children) {};
Fleur.XPathFunctions_xs["language"] = function(ctx, children) {};
Fleur.XPathFunctions_xs["normalizedString"] = function(ctx, children) {};
Fleur.XPathFunctions_xs["token"] = function(ctx, children) {};
Fleur._schemaTypeInfoLookup = function(n) {
	var i, l, s;
	switch (n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			return n.schemaTypeInfo;
		case Fleur.Node.ATTRIBUTE_NODE:
		case Fleur.Node.ELEMENT_NODE:
		case Fleur.Node.MAP_NODE:
		case Fleur.Node.ENTRY_NODE:
			for (i = 0, l < n.childNodes.length; i < l; i++) {
				s = Fleur._schemaTypeInfoLookup(n.childNodes[i]);
				if (s !== Fleur.Type_untypedAtomic) {
					return s;
				}
			}
			return Fleur.Type_untypedAtomic;
	}
};
Fleur._Atomize = function(a, n, force) {
	var i, l, n2, seq;
	switch (n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			if (n.schemaTypeInfo === Fleur.Type_error || n.nodeName !== "#text") {
				return n;
			}
			a = new Fleur.Text();
			a.data = n.data;
			a.schemaTypeInfo = n.schemaTypeInfo;
			return a;
		case Fleur.Node.DOCUMENT_NODE:
			n = n.documentElement;
		case Fleur.Node.ELEMENT_NODE:
			a = new Fleur.Text();
			a.data = n.textContent;
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.ATTRIBUTE_NODE:
			a = new Fleur.Text();
			a.data = n.value.slice(0);
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.MAP_NODE:
			a = new Fleur.Map();
			i = 0;
			l = n.entries.length;
			while (i < l) {
				a.setEntryNode(Fleur._Atomize(null, n.entries[i]));
				i++;
			}
			return a;
		case Fleur.Node.ENTRY_NODE:
			if (force) {
				return Fleur._Atomize(null, n.firstChild);
			}
			a = new Fleur.Entry();
			a.nodeName = n.nodeName;
			a.namespaceURI = null;
			a.localName = n.nodeName;
			a.appendChild(Fleur._Atomize(null, n.firstChild));
			return a;
		case Fleur.Node.SEQUENCE_NODE:
			a = new Fleur.Text();
			a.data = "";
			var nextsep = "";
			for (i = 0, l = n.childNodes.length; i < l; i++) {
				n2 = Fleur._Atomize(a, n.childNodes[i]);
				if (n2.schemaTypeInfo === Fleur.Type_error || n2.nodeName !== "#text") {
					return n2;
				}
				a.data += nextsep + n2.data;
				nextsep = " ";
			}
			return a;
		case Fleur.Node.ARRAY_NODE:
			if (n.childNodes.length === 0) {
				return null;
			}
			for (i = 0, l = n.childNodes.length; i < l; i++) {
				n2 = Fleur._Atomize(a, n.childNodes[i]);
				if (n2) {
					if (!a) {
						a = n2;
					} else {
						if (a.nodeType !== Fleur.Node.ARRAY_NODE) {
							seq = new Fleur.Array();
							seq.appendChild(a);
							a = seq;
						}
						if (n2.nodeType !== Fleur.Node.ARRAY_NODE) {
							a.appendChild(n2);
						} else {
							n2.childNodes.forEach(function(n3) {
								a.appendChild(n3);
							});
						}
					}
				}
			}
			return a;
	}
};
Fleur.Atomize = function(n, force) {
	return n === Fleur.EmptySequence ? Fleur.EmptySequence : Fleur._Atomize(null, n, force);
};
Fleur.XPathConstructor = function(ctx, children, schemaType, stringreg, others, formatvalue, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n, true);
		if (a.schemaTypeInfo === Fleur.Type_error || a.schemaTypeInfo === schemaType) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			if (!a.data || (stringreg && !(stringreg.test(a.data)))) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
		} else {
			others(a);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a);});
				return;
			}
		}
		a.schemaTypeInfo = schemaType;
		if (formatvalue(a)) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
			return;
		}
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathStringFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	if (children.length > 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var cb = function(n, forceString) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a === Fleur.EmptySequence) {
			a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_string;
			a.data = "";
		}
		if (forceString === "force") {
			a.schemaTypeInfo = Fleur.Type_string;
		}
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			a.data = "" + f(a.data);
			if (schemaTypeInfo) {
				a.schemaTypeInfo = schemaTypeInfo;
			}
			Fleur.callback(function() {callback(a);});
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
		}
	};
	if (children.length === 0) {
		cb(ctx._curr, "force");
	} else {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	}
};
Fleur.XPathStringContentFunction = function(ctx, children, empty, f, schemaTypeInfo, callback) {
	var arg1, arg2;
	if (children.length === 3) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "FOCH0002"));});
		return;
	}
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1 === Fleur.EmptySequence) {
			if (empty) {
				Fleur.callback(function() {callback(a1);});
				return;
			}
			arg1 = "";
		} else {
			if (a1.schemaTypeInfo !== Fleur.Type_string && a1.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			arg1 = a1.data;
		}
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2 === Fleur.EmptySequence) {
				if (empty) {
					Fleur.callback(function() {callback(a2);});
					return;
				}
				a2 = new Fleur.Text();
				arg2 = "";
			} else {
				if (a2.schemaTypeInfo !== Fleur.Type_string && a2.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
					callback(Fleur.error(ctx, "XPTY0004"));
					return;
				}
				arg2 = a2.data;
			}
			a2.data = "" + f(arg1, arg2);
			a2.schemaTypeInfo = schemaTypeInfo;
			Fleur.callback(function() {callback(a2);});
		});
	});
};
Fleur.XPathNumberFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var value;
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence || a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_integer) {
			value = f(parseInt(a.data, 10));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			} else {
				a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : ("" + value).replace("e+", "e");
			}
		} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
			value = f(a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : a.data === "NaN" ? Number.NaN : parseFloat(a.data));
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : ("" + value).replace("e+", "e");
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			value = f(parseInt(a.data, 10));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			} else {
				a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : ("" + value).replace("e+", "e");
			}
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			value = f(parseFloat(a.data));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			} else {
				a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : ("" + value).replace("e+", "e");
			}
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		if (schemaTypeInfo) {
			if (typeof schemaTypeInfo === "function") {
				a.schemaTypeInfo = schemaTypeInfo(a);
			} else {
				a.schemaTypeInfo = schemaTypeInfo;
			}
		}
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathTestOpFunction = function(ctx, children, f, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1 === Fleur.EmptySequence) {
			a1 = new Fleur.Text();
			a1.schemaTypeInfo = Fleur.Type_string;
			a1.data = "";
		}
		if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
			return;
		}
		if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
			a1.schemaTypeInfo = Fleur.Type_double;
		} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			a1.schemaTypeInfo = Fleur.Type_string;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2 === Fleur.EmptySequence) {
				a2 = new Fleur.Text();
				a2.schemaTypeInfo = Fleur.Type_string;
				a2.data = "";
			}
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
				a2.schemaTypeInfo = Fleur.Type_double;
			} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a2.schemaTypeInfo = Fleur.Type_string;
			}
			if (a1.schemaTypeInfo !== a2.schemaTypeInfo) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
				return;
			}
			a1.data = "" + f(a1, a2);
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XPathGenTestOpFunction = function(ctx, children, f, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence || a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
			a1.childNodes.forEach(function(a) {
				if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1) {
					a.schemaTypeInfo = Fleur.Type_double;
				} else if (a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					a.schemaTypeInfo = Fleur.Type_string;
				}
			});
		} else {
			if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
				a1.schemaTypeInfo = Fleur.Type_double;
			} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a1.schemaTypeInfo = Fleur.Type_string;
			}
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n);
			var i1, res = false, b, l;
			if (a2 === Fleur.EmptySequence || a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				a2.childNodes.forEach(function(a) {
					if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1) {
						a.schemaTypeInfo = Fleur.Type_double;
					} else if (a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
						a.schemaTypeInfo = Fleur.Type_string;
					}
				});
			} else {
				if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
					a2.schemaTypeInfo = Fleur.Type_double;
				} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					a2.schemaTypeInfo = Fleur.Type_string;
				}
			}
			do {
				if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
					i1 = a1.childNodes.shift();
					if (a1.childNodes.length === 1) {
						a1 = a1.childNodes[0];
					}
				} else {
					i1 = a1;
					a1 = Fleur.EmptySequence;
				}
				if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
					for (b = 0, l = a2.childNodes.length; b < l && !res; b++) {
						res = f(i1, a2.childNodes[b]);
					}
				} else {
					res = f(i1, a2);
				}
				if (res) {
					break;
				}
			} while(a1 !== Fleur.EmptySequence)
			a1 = new Fleur.Text();
			a1.data = "" + res;
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XPathFromDateTimeFunction = function(ctx, children, t1, r, t2, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence || a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo !== t1) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		a.schemaTypeInfo = t2;
		a.data = "" + (t2 === Fleur.Type_integer ? parseInt(a.data.match(r)[1], 10) : parseFloat(a.data.match(r)[1]));
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathEvaluator = function() {};
Fleur.XPathEvaluator._precedence = "././/.:.as.;0.!.;1.~+.~-.;2.cast as.;3.castable as.;4.treat as.;5.instance of.;6.intersect.except.;7.|.union.;8.div.mod.*.idiv.;9.+.-.;10.to.;11.||.;12.eq.ne.lt.le.gt.ge.<.>.<=.>=.is.<<.>>.=.!=.;13.and.;14.or.;17.:=.in.;18.after.before.into.with.value.;19.node.nodes.;20.for.let.some.every.return.satisfies.then.;21.else.;22.,.;50.";
Fleur.XPathEvaluator._opcodes = "./;stepExpr.|;unionOp.union;unionOp.div;divOp.mod;modOp.*;multiplyOp.idiv;idivOp.+;addOp.-;subtractOp.to;toOp.||;stringConcatenateOp.eq;eqOp.ne;neOp.lt;ltOp.le;leOp.gt;gtOp.ge;geOp.<;lessThanOp.>;greaterThanOp.<=;lessThanOrEqualOp.>=;greaterThanOrEqualOp.is;isOp.<<;nodeBeforeOp.>>;nodeAfterOp.=;equalOp.!=;notEqualOp.and;andOp.or;orOp.,;argExpr.";
Fleur.XPathEvaluator._skipComment = function(s, offset) {
	var i = offset;
	var c = s.charAt(i);
	var d = s.charAt(i + 1);
	var l = s.length;
	do {
		if (c === "(" && d === ":") {
			i = Fleur.XPathEvaluator._skipComment(s, i + 2);
		} else if (c === ":" && d === ")") {
			return i + 1;
		}
		c = s.charAt(++i);
		d = s.charAt(i + 1);
	} while (i < l);
};
Fleur.XPathEvaluator._skipSpaces = function(s, offset) {
	var i = offset;
	var c = s.charAt(i);
	var l = s.length;
	do {
		if (c === "(" && s.charAt(i + 1) === ":") {
			i = Fleur.XPathEvaluator._skipComment(s, i + 2);
		} else if (c !== "\n" && c !== "\r" && c !== "\t" && c !== " ") {
			return i;
		}
		c = s.charAt(++i);
	} while (i < l);
	return i;
};
Fleur.XPathEvaluator._getName = function(s) {
	var i = 0;
	var o = s.charAt(0);
	var prev = "";
	while (o !== "" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:*{".indexOf(o) !== -1) {
		if (o === "*") {
			if (i > 0 && (s.charAt(i - 1) === ":" || s.charAt(i - 1) === "}")) {
				i++;
				break;
			} else if (s.charAt(i + 1) !== ":") {
				if (i === 0) {
					i++;
				}
				break;
			}
		}
		if (o === "{") {
			if (prev !== "Q") {
				return s.substr(0, i);
			}
			while (o !== "" && o !== "}") {
				o = s.charAt(++i);
			}
		}
		prev = o;
		o = s.charAt(++i);
	}
	if (o === "#") {
		o = s.charAt(++i);
		while (o !== "" && "0123456789".indexOf(o) !== -1) {
			o = s.charAt(++i);
		}
	}
	return s.substr(0, i);
};
Fleur.XPathEvaluator._getNameStep = function(s, attr) {
	var n = Fleur.XPathEvaluator._getName(s);
	var fctind = n.indexOf("#");
	if (fctind !== -1) {
		var pindex = n.indexOf(":");
		if (pindex === -1) {
			return n.length + ".[Fleur.XQueryX.namedFunctionRef,[[Fleur.XQueryX.functionName,['" + n.substr(0, fctind) + "']],[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,['" + n.substr(fctind + 1) + "']]]]]]";
		}
		return n.length + ".[Fleur.XQueryX.namedFunctionRef,[[Fleur.XQueryX.functionName,['" + n.substr(0, fctind).substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + n.substr(0, pindex) + "']]]],[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,['" + n.substr(fctind + 1) + "']]]]]]";
	}
	var aind = n.indexOf("::");
	var axis = aind !== -1 ? n.substr(0, aind) : attr ? "attribute" : "child";
	var n2 = aind !== -1 ? n.substr(aind + 2) : n;
	var eq = n2.substr(0, 2) === "Q{";
	var sind = eq ? n2.indexOf("}") : n2.indexOf(":");
	var n3 = sind !== -1 ? n2.substr(sind + 1) : n2;
	var nsp = eq ? n2.substr(2, sind - 2) : sind !== -1 ? n2.substr(0, sind) : "";
	var ntest = n3 === "*" || nsp === "*" ? "[Fleur.XQueryX.Wildcard,[" + (n3 !== "*" ? "[Fleur.XQueryX.star,[]],[Fleur.XQueryX.NCName,['" + n3 + "']]" : "") + "]]" : "[Fleur.XQueryX.nameTest,['" + n3 + "'" + (eq || sind !== -1 ? ",[" + (eq ? "Fleur.XQueryX.URI" : "Fleur.XQueryX.prefix") + ",['" + nsp + "']]" : "") + "]]";
	return (n.length + attr) + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['" + axis + "']]," + ntest + "]]]]";
};
Fleur.XPathEvaluator._pathExprFormat = function(s, p) {
	if (s.substr(0, 25) === "[Fleur.XQueryX.pathExpr,[") {
		return s.substr(25, s.length - 29) + p + "]]";
	}
	return "[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[" + s + "]]" + p + "]]";
};
Fleur.XPathEvaluator._calc = function(args, ops, opprec) {
	var curop = parseInt(ops.split(".")[1], 10);
	if ((ops === "" || curop > opprec) || (curop >= opprec && curop === 16)) {
		return args.length + "." + args + ops.length + "." + ops;
	}
	var op0 = ops.substr(ops.indexOf(".") + 1, parseInt(ops.split(".")[0], 10));
	var op = op0.substr(op0.indexOf(".") + 1);
	var arg2len = args.substr(0, args.indexOf("."));
	var arg2val = args.substr(args.indexOf(".") + 1).substr(0, parseInt(arg2len, 10));
	var arg2val2, arg2val3;
	var args3 = args.substr(arg2len.length + 1 + parseInt(arg2len, 10));
	var arg1len = args3.substr(0, args3.indexOf("."));
	var arg1val = args3.substr(args3.indexOf(".") + 1).substr(0, parseInt(arg1len, 10));
	var arg;
	switch (op) {
		case ",":
			if (ops.substr(0, 13) === "4.50.,5.999.(") {
				if (arg1val.substr(0, 26) === "[Fleur.XQueryX.arguments,[") {
					arg = arg1val.substr(0, arg1len - 2) + "," + arg2val + "]]";
				} else {
					arg = "[Fleur.XQueryX.arguments,[" + arg1val + "," + arg2val + "]]";
				}
			} else if (ops === "4.50.,") {
				if (arg1val.substr(0, 36) === "[Fleur.XQueryX.mapConstructorEntry,[") {
					arg = arg1val + "," + arg2val;
				} else if (arg1val.substr(0, 29) === "[Fleur.XQueryX.sequenceExpr,[" && arg1val !== "[Fleur.XQueryX.sequenceExpr,[]]") {
					arg = arg1val.substr(0, arg1len - 2) + "," + arg2val + "]]";
				} else {
					arg = "[Fleur.XQueryX.sequenceExpr,[" + arg1val + "," + arg2val + "]]";
				}
			} else if (arg1val.substr(0, 25) === "[Fleur.XQueryX.letClause,") {
				arg = arg1val.substr(0, arg1len - 2) + "," + arg2val.substr(26);
			} else {
				arg = arg1val + "," + arg2val;
			}
			break;
		case "//":
			arg = "[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg1val, "") + ",[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['descendant-or-self']],[Fleur.XQueryX.anyKindTest,[]]]]," + Fleur.XPathEvaluator._pathExprFormat(arg2val, "") + "]]";
			break;
		case "/":
			arg = "[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg1val, "") + (arg2val !== "" ? "," + Fleur.XPathEvaluator._pathExprFormat(arg2val, "") : "") + "]]";
			break;
		case "!":
			arg = "[Fleur.XQueryX.simpleMapExpr,[[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg1val, "") + "]],[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg2val, "") + "]]]]";
			break;
		case "|":
			arg = "[Fleur.XQueryX.unionOp,[[Fleur.XQueryX.firstOperand,[" + arg1val + "]],[Fleur.XQueryX.secondOperand,[" + arg2val + "]]]]";
			break;
		case ":":
			arg = "[Fleur.XQueryX.mapConstructorEntry,[[Fleur.XQueryX.mapKeyExpr,[" + arg1val + "]],[Fleur.XQueryX.mapValueExpr,[" + arg2val + "]]]]";
			break;
		case "?":
			break;
		case "to":
			arg = "[Fleur.XQueryX.rangeSequenceExpr,[[Fleur.XQueryX.startExpr,[" + arg1val + "]],[Fleur.XQueryX.endExpr,[" + arg2val + "]]]]";
			break;
		case "~-":
			arg = "[Fleur.XQueryX.unaryMinusOp,[[Fleur.XQueryX.operand,[" + arg2val + "]]]]";
			break;
		case "~+":
			arg = "[Fleur.XQueryX.unaryPlusOp,[[Fleur.XQueryX.operand,[" + arg2val + "]]]]";
			break;
		case "in":
			if (ops.substr(ops.length - 7) === "5.999.q") {
				arg = "[Fleur.XQueryX.quantifiedExprInClause,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.sourceExpr,[" + arg2val + "]]]]";
			} else {
				arg = "[Fleur.XQueryX.forClause,[[Fleur.XQueryX.forClauseItem,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.forExpr,[" + arg2val + "]]]]]]";
			}
			break;
		case "as":
			if (arg2val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['last']]]]]]") {
				arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertInto,[[Fleur.XQueryX.insertAsLast,[]]]]";
			} else if (arg2val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['first']]]]]]") {
				arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertInto,[[Fleur.XQueryX.insertAsFirst,[]]]]";
			} else {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
				arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
				arg = "[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]],[Fleur.XQueryX.typeDeclaration,[" + arg2val3 + "]]";
			}
			break;
		case ":=":
			if (arg1val.substr(0, 23) === "[Fleur.XQueryX.varName,") {
				arg = "[Fleur.XQueryX.letClause,[[Fleur.XQueryX.letClauseItem,[[Fleur.XQueryX.typedVariableBinding,[" + arg1val + "]],[Fleur.XQueryX.letExpr,[" + arg2val + "]]]]]]";
			} else {
				arg = "[Fleur.XQueryX.letClause,[[Fleur.XQueryX.letClauseItem,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.letExpr,[" + arg2val + "]]]]]]";
			}
			break;
		case "return":
			arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.returnClause,[" + arg2val + "]]]]";
			break;
		case "satisfies":
			arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.predicateExpr,[" + arg2val + "]]]]";
			break;
		case "cast as":
			arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
			arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
			arg = "[Fleur.XQueryX.castExpr,[[Fleur.XQueryX.argExpr,[" + arg1val + "]],[Fleur.XQueryX.singleType,[" + arg2val3 + "]]]]";
			break;
		case "castable as":
			arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
			arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
			arg = "[Fleur.XQueryX.castableExpr,[[Fleur.XQueryX.argExpr,[" + arg1val + "]],[Fleur.XQueryX.singleType,[" + arg2val3 + "]]]]";
			break;
		case "treat as":
			arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.elementTest,"));
			arg2val3 = "[Fleur.XQueryX.sequenceType,[" + arg2val2.substr(0, arg2val2.length - 2);
			arg = "[Fleur.XQueryX.treatExpr,[[Fleur.XQueryX.argExpr,[" + arg1val + "]]," + arg2val3 + "]]";
			break;
		case "instance of":
		case "instance of+":
		case "instance of?":
		case "instance of*":
			var occ = op.charAt(11);
			if (arg2val.indexOf("[Fleur.XQueryX.nameTest,") !== -1) {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
				arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
			} else if (arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") !== -1) {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") + 86);
				arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
			} else {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['attribute']],") + 90);
				arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
			}
			arg = "[Fleur.XQueryX.instanceOfExpr,[[Fleur.XQueryX.argExpr,[" + arg1val + "]],[Fleur.XQueryX.sequenceType,[" + arg2val3 + (occ !== "" ? ",[Fleur.XQueryX.occurrenceIndicator,['" + occ + "']]" : "") + "]]]]";
			break;
		case "then":
			if (arg1val.substr(0, 95) === "[Fleur.XQueryX.functionCallExpr,[[Fleur.XQueryX.functionName,['if']],[Fleur.XQueryX.arguments,[") {
				arg = "[Fleur.XQueryX.ifThenElseExpr,[[Fleur.XQueryX.ifClause,[" + arg1val.substr(0, arg1val.length - 4).substr(arg1val.indexOf(",[Fleur.XQueryX.arguments,[") + 27) + "]],[Fleur.XQueryX.thenClause,[" + arg2val + "]]]]";
			}
			opprec = -1;
			break;
		case "else":
			if (arg1val.substr(0, 30) === "[Fleur.XQueryX.ifThenElseExpr,") {
				arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.elseClause,[" + arg2val + "]]]]";
			}
			break;
		case "let":
			arg = arg1val + "," + arg2val;
			break;
		case "for":
			arg = arg1val + "," + arg2val;
			break;
		case "nodes":
			if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['delete']]]]]]") {
				arg = "[Fleur.XQueryX.deleteExpr,[[Fleur.XQueryX.targetExpr,[" + arg2val + "]]]]";
			} else if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['insert']]]]]]") {
				arg = "[Fleur.XQueryX.insertExpr,[" + arg2val + "]]";
			}
			break;
		case "node":
			if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['delete']]]]]]") {
				arg = "[Fleur.XQueryX.deleteExpr,[[Fleur.XQueryX.targetExpr,[" + arg2val + "]]]]";
			} else if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['insert']]]]]]") {
				arg = "[Fleur.XQueryX.insertExpr,[" + arg2val + "]]";
			} else if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['replace']]]]]]") {
				arg = "[Fleur.XQueryX.replaceExpr,[" + arg2val + "]]";
			} else if (arg1val === "[Fleur.XQueryX.replaceValue,[]]") {
				arg = "[Fleur.XQueryX.replaceExpr,[[Fleur.XQueryX.replaceValue,[]]," + arg2val + "]]";
			}
			break;
		case "into":
			if (arg1val.substr(0, 28) === "[Fleur.XQueryX.sourceExprUf,") {
				arg = arg1val + ",[Fleur.XQueryX.targetExpr,[" + arg2val + "]]";
			} else {
				arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertInto,[]],[Fleur.XQueryX.targetExpr,[" + arg2val + "]]";
			}
			break;
		case "after":
			arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertAfter,[]],[Fleur.XQueryX.targetExpr,[" + arg2val + "]]";
			break;
		case "before":
			arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertBefore,[]],[Fleur.XQueryX.targetExpr,[" + arg2val + "]]";
			break;
		case "value":
			if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['replace']]]]]]" && arg2val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['of']]]]]]") {
				arg = "[Fleur.XQueryX.replaceValue,[]]";
			}
			break;
		case "with":
			arg = "[Fleur.XQueryX.targetExpr,[" + arg1val + "]],[Fleur.XQueryX.replacementExpr,[" + arg2val + "]]";
			break;
		default:
			var opcode0 = Fleur.XPathEvaluator._opcodes.substr(Fleur.XPathEvaluator._opcodes.indexOf("." + op + ";") + op.length + 2);
			var opcode = opcode0.substr(0, opcode0.indexOf("."));
			arg = "[Fleur.XQueryX." + opcode + ",[[Fleur.XQueryX.firstOperand,[" + arg1val + "]],[Fleur.XQueryX.secondOperand,[" + arg2val + "]]]]";
	}
	var args2 = arg.length + "." + arg + args3.substr(arg1len.length + 1 + parseInt(arg1len, 10));
	return Fleur.XPathEvaluator._calc(args2, ops.substr(ops.indexOf(".") + 1).substr(parseInt(ops.substr(0, ops.indexOf(".")), 10)), opprec);
};
Fleur.XPathEvaluator._testFormat = function(s, namecode) {
	var arg1, arg2, arg20, arg200;
	if (s === "") {
		return "";
	}
	if (s.indexOf(",[Fleur.XQueryX.pathExpr,[") !== -1) {
		arg1 = s.substr(0, s.indexOf(",[Fleur.XQueryX.pathExpr,["));
		arg20 = s.substr(s.indexOf(",[Fleur.XQueryX.pathExpr,[") + 1);
		arg200 = arg20.substr(arg20.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
		arg2 = "," + "[Fleur.XQueryX.typeName,[" + arg200.substr(0, arg200.length - 6) + "]]";
	} else {
		arg1 = s;
		arg2 = "";
	}
	var arg120 = arg1.indexOf("[Fleur.XQueryX.nameTest,['") !== -1 ? arg1.substr(arg1.indexOf("[Fleur.XQueryX.nameTest,['") + 25) : "[Fleur.XQueryX.star,[]]";
	var arg12 = "[" + namecode + ",[" + (arg120 === "[Fleur.XQueryX.star,[]]" ? arg120 : "[Fleur.XQueryX.QName,[" + arg120.substr(0, arg120.length - 6) + "]]") + "]]";
	return arg12 + arg2;
};
Fleur.XPathEvaluator._getNodeConstructor = function(s) {
	var ii, text, texts, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrvalues, attrs, parents = [], currnodename = "", c, c0, c1, c2, braces,
		seps_pi = " \t\n\r?", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r",
		namespaces = {}, newnamespaces = {}, pindex, prefix, localName, r0, r = "", nextsep = "";
	while (offset !== end) {
		text = "";
		texts = [];
		c1 = " ";
		c = s.charAt(offset);
		braces = 0;
		while ((c !== "<" || braces !== 0) && offset !== end) {
			if (c === "{") {
				if (braces === 0 && text !== "") {
					texts.push([0, text]);
					text = "";
				}
				if (braces !== 0) {
					text += "{";
				}
				if (c1 === c) {
					braces--;
					if (braces === 0) {
						text = (texts.length > 0 ? texts.pop()[1] : "") + "{";
					}
				} else {
					braces++;
				}
			} else if (c === "}") {
				if (braces === 1 && text !== "") {
					texts.push([1, text]);
					text = "";
				}
				if (braces !== 1) {
					text += "}";
				}
				if (c1 === c) {
					braces++;
					if (braces === 0) {
						text += "}";
					}
				} else {
					braces--;
				}
			} else if (c === "&") {
				c = s.charAt(++offset);
				entityname = "";
				while (c !== ";" && offset !== end) {
					entityname += c;
					c = s.charAt(++offset);
				}
				if (offset === end) {
					break;
				}
				switch (entityname) {
					case "amp":
						text += "&";
						break;
					case "lt":
						text += "<";
						break;
					case "gt":
						text += ">";
						break;
					case "apos":
						text += "'";
						break;
					case "quot":
						text += '"';
						break;
					default:
						if (entityname.charAt(0) === "#") {
							text += String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
						}
				}
			} else if (braces === 0 && c === "\n") {
				text += "\\n";
			} else if (braces === 0 && c === "\r") {
				text += "\\r";
			} else {
				text += c;
			}
			c1 = c;
			c = s.charAt(++offset);
		}
		if (text !== "" && texts.length === 0) {
			r += nextsep + "[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + text.replace(/'/gm,"\\'") + "']]]]";
			nextsep = ",";
		} else if (texts.length > 0) {
			if (text !== "") {
				texts.push([0, text]);
			}
			texts.forEach(function(t) {
				r += nextsep;
				if (t[0] === 0) {
					r += "[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + t[1].replace(/'/gm,"\\'") + "']]]]";
				} else {
					r += Fleur.XPathEvaluator._xp2js(t[1], "", "");
				}
				nextsep = ",";
			});
		}
		if (offset === end) {
			break;
		}
		offset++;
		if (s.charAt(offset) === "!") {
			offset++;
			if (s.substr(offset, 2) === "--") {
				offset += 2;
				index = s.indexOf("-->", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					r0 = "[Fleur.XQueryX.computedCommentConstructor,[[Fleur.XQueryX.argExpr,[[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + text + "']]]]]]]]";
					if (r === "") {
						return offset + "." + r0;
					}
					r += nextsep + r0;
					nextsep = ",";
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			} else if (s.substr(offset, 7) === "[CDATA[") {
				offset += 7;
				index = s.indexOf("]]>", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					if (text !== "") {
						r += nextsep + "[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + text + "']]]]";
						nextsep = ",";
					}
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			}
		} else if (s.charAt(offset) === "?") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_pi.indexOf(c) === -1) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf("?>", offset - 1);
			if (index === -1) {
				index = end;
			}
			if (nodename.toLowerCase() === "xml") {
				throw Error("Invalid processing instruction");
			} else if (nodename !== "") {
				text = "";
				ii = offset;
				while (ii < index) {
					text += s.charAt(ii++);
				}
				text = text.replace(/\x01/gm,"<");
				r += nextsep + "[Fleur.XQueryX.computedPIConstructor[[Fleur.XQueryX.piTarget,['" + nodename + "']],[Fleur.XQueryX.piValueExpr,[[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + text + "']]]]]]]]";
				nextsep = ",";
			}
			if (index === end) {
				break;
			}
			offset = index + 2;
		} else if (s.charAt(offset) === "/") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_close.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			if (nodename === currnodename) {
				if (nextsep !== ",") {
					r += "]]";
				} else {
					r += "]]]]";
				}
				nextsep = ",";
				if (parents.length === 1) {
					return offset + "." + r;
				}
				currnodename = parents.pop();
			} else {
				throw Error("Malformed XML fragment");
			}
			offset = s.indexOf(">", offset - 1) + 1;
			if (offset === 0) {
				break;
			}
		} else {
			c = s.charAt(offset++);
			nodename = "";
			while (seps_elt.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf(">", offset - 1);
			if (nodename !== "") {
				newnamespaces = {};
				for (prefix in namespaces) {
					if (namespaces.hasOwnProperty(prefix)) {
						newnamespaces[prefix] = namespaces[prefix];
					}
				}
				attrs = {};
				while (offset <= end) {
					while (seps.indexOf(c) !== -1 && offset <= end) {
						c = s.charAt(offset++);
					}
					if (c === "/" || c === ">" || offset === end) {
						break;
					}
					attrname = "";
					while (seps_attr.indexOf(c) === -1 && offset <= end) {
						attrname += c;
						c = s.charAt(offset++);
					}
					if (attrname === "") {
						throw new Error("Invalid character: " + c);
					}
					while (seps.indexOf(c) !== -1 && offset <= end) {
						c = s.charAt(offset++);
					}
					if (c === "=") {
						c = s.charAt(offset++);
						while (seps.indexOf(c) !== -1 && offset <= end) {
							c = s.charAt(offset++);
						}
						attrvalue = "";
						attrvalues = [];
						if (c === "'" || c === "\"") {
							c0 = c;
							c1 = c;
							c = s.charAt(offset++);
							c2 = s.charAt(offset);
							braces = 0;
							attrvalue = "";
							ii = offset;
							while ((c !== c0 || c2 === c0 || braces !== 0) && offset <= end) {
								if (c === "{") {
									if (braces === 0 && attrvalue !== "") {
										attrvalues.push([0, attrvalue]);
										attrvalue = "";
									}
									if (c1 === c) {
										braces--;
										if (braces === 0) {
											attrvalue = (attrvalues.length > 0 ? attrvalues.pop()[1] : "") + "{";
										}
									} else {
										braces++;
									}
								} else if (c === "}") {
									if (braces === 1 && attrvalue !== "") {
										attrvalues.push([1, attrvalue]);
										attrvalue = "";
									}
									if (c1 === c) {
										braces++;
										if (braces === 0) {
											attrvalue += "}";
										}
									} else {
										braces--;
									}
								} else if (c === c2 && c === c0) {
									attrvalue += c;
									c1 = c;
									c = s.charAt(++offset);
									c2 = s.charAt(++offset);
									continue;
								} else {
									attrvalue += c;
								}
								c1 = c;
								c = c2;
								c2 = s.charAt(++offset);
							}
							if (attrvalue !== "") {
								attrvalues.push([0, attrvalue]);
							}
							c = c2;
							offset++;
						} else {
							while (seps_elt.indexOf(c) === -1 && offset <= end) {
								attrvalue += c;
								c = s.charAt(offset++);
							}
							attrvalues = [[0, attrvalue]];
						}
					} else {
						attrvalues = [[0, attrname]];
					}
					pindex = attrname.indexOf(":");
					prefix = pindex !== -1 ? attrname.substr(0, pindex) : " ";
					localName = pindex !== -1 ? attrname.substr(pindex + 1) : attrname;
					if (!attrs[prefix]) {
						attrs[prefix] = {};
					}
					attrs[prefix][localName] = attrvalues;
					if (prefix === "xmlns") {
						newnamespaces[localName] = attrvalues;
					} else if (prefix === " " && localName === "xmlns") {
						newnamespaces[" "] = attrvalues;
					}
				}
				pindex = nodename.indexOf(":");
				if (pindex === -1) {
					r0 = nextsep + "[Fleur.XQueryX.elementConstructor,[[Fleur.XQueryX.tagName,['" + nodename + "']]";
				} else {
					r0 = nextsep + "[Fleur.XQueryX.elementConstructor,[[Fleur.XQueryX.tagName,['" + nodename.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + nodename.substr(0, pindex) + "']]]]";
				}
				if (Object.keys(attrs).length) {
					nextsep = ",[Fleur.XQueryX.attributeList,[";
					if (attrs[" "] && attrs[" "].xmlns) {
						r0 += nextsep + "[Fleur.XQueryX.namespaceDeclaration,[[Fleur.XQueryX.uri,['" + attrs[" "].xmlns[0][1] + "']]]]";
						nextsep = ",";
						delete attrs[" "].xmlns;
					}
					for (attrname in attrs.xmlns) {
						if (attrs.xmlns.hasOwnProperty(attrname)) {
							r0 += nextsep + "[Fleur.XQueryX.namespaceDeclaration,[[Fleur.XQueryX.prefixElt,['" + attrname + "']],[Fleur.XQueryX.uri,['" + attrs.xmlns[attrname][0][1] + "']]]]";
							nextsep = ",";
						}
					}
					delete attrs.xmlns;
					for (prefix in attrs) {
						if (attrs.hasOwnProperty(prefix)) {
							for (attrname in attrs[prefix]) {
								if (attrs[prefix].hasOwnProperty(attrname)) {
									r0 += nextsep + "[Fleur.XQueryX.attributeConstructor,[[Fleur.XQueryX.attributeName,['" + attrname + "'";
									if (prefix !== " ") {
										r0 += ",[Fleur.XQueryX.prefix,['" + prefix + "']]";
									}
									r0 += "]],";
									if (attrs[prefix][attrname].length === 1 && attrs[prefix][attrname][0][0] === 0) {
										r0 += "[Fleur.XQueryX.attributeValue,['" + Fleur.DocumentType.resolveEntities(null, attrs[prefix][attrname][0][1]).replace(/'/gm,"\\'").replace(/\x01/gm,"<") + "']]";
										nextsep = ",";
									} else {
										nextsep = "[Fleur.XQueryX.attributeValueExpr,[";
										attrs[prefix][attrname].forEach(function(v) {
											r0 += nextsep;
											if (v[0] === 0) {
												r0 += "[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + Fleur.DocumentType.resolveEntities(null, v[1]).replace(/'/gm,"\\'") + "']]]]";
											} else {
												r0 += Fleur.XPathEvaluator._xp2js(v[1], "", "");
											}
											nextsep = ",";
										});
										r0 += "]]";
									}
									r0 += "]]";
								}
							}
						}
					}
					r0 += "]]";
				}
				if (s.charAt(offset - 1) !== "/") {
					nextsep = ",[Fleur.XQueryX.elementContent,[";
					parents.push(currnodename);
					currnodename = nodename;
					r += r0;
				} else {
					if (r === "") {
						return (offset + 1) + "." + r0 + "]]";
					}
					r += r0 + "]]";
					nextsep = ",";
				}
			} else {
				throw Error("Invalid element name");
			}
			offset = index + 1;
			if (offset === 0) {
				break;
			}
		}
	}
};
Fleur.XPathEvaluator._getPredParam = function(c, s, l, arg) {
	var t;
	l = l || 0;
	var p, plen;
	if (c === "?") {
		var i = Fleur.XPathEvaluator._skipSpaces(s, 0);
		var c2 = s.charAt(i);
		var d = s.substr(i + 1);
		var r, t1;
		if (c2 !== "" && "0123456789".indexOf(c2) !== -1) {
			t1 = Fleur.XPathEvaluator._getNumber(c2 + d);
			r = "[Fleur.XQueryX.lookup,[[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,['" + t1.replace(/e\+/, "e") + "']]]]]]";
			t = (t1.length + 1) + "." + r;
			plen = t1.length + 1;
		} else if (c2 !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*".indexOf(c2) !== -1) {
			t1 = Fleur.XPathEvaluator._getName(c2 + d);
			r = "[Fleur.XQueryX.lookup,[[Fleur.XQueryX.NCName,['" + t1 + "']]]]";
			t = (t1.length + 1) + "." + r;
			plen = t1.length + 1;
		} else if (c2 === "(") {
			t = Fleur.XPathEvaluator._xp2js(s.substr(i + 1), "", "5.999.(");
			plen = s.length - parseInt(t.substr(0, t.indexOf(".")), 10) + 1 + i;
			t = String(plen) + "." + "[Fleur.XQueryX.lookup,[[Fleur.XQueryX.expr,[" + t.substr(t.indexOf(".") + 1) + "]]]]";
		}
	} else {
		t = Fleur.XPathEvaluator._xp2js(s, "", l === 0 ? "" : arg.substr(0, 57) === "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier," ? "5.999.q" : "5.999.(");
		plen = s.length - parseInt(t.substr(0, t.indexOf(".")), 10) + 1;
	}
	if (t.indexOf("~~~~") !== -1) {
		var t0 = t + "~#~#";
		t0 = t0.substr(0, t0.indexOf("~#~#"));
		t0 = t0.replace('"', "");
		var msg = '"~~~~' + t0.substr(t0.indexOf("~~~~") + 4) + "in '" + s + "'~#~#" + '"';
		p = plen + "." + msg;
		throw Error(t0.substr(t0.indexOf("~~~~") + 4) + "in '" + s + "'");
	} else if (t === "") {
		var msg2 = '"' + "~~~~Unrecognized expression '" + s + "'~#~#" + '"';
		p = plen + "." + msg2;
		throw Error("Unrecognized expression '" + s + "'");
	} else if (c === "{") {
		var cargs = t.substr(t.indexOf(".") + 1);
		if (arg.substr(0, 40) === "[Fleur.XQueryX.computedEntryConstructor," || arg.substr(0, 42) === "[Fleur.XQueryX.computedElementConstructor," || arg.substr(0, 44) === "[Fleur.XQueryX.computedAttributeConstructor,") {
			p = plen + "." + arg.substr(0, arg.length - 2) + ",[Fleur.XQueryX.valueExpr,[" + cargs + "]]]]";
		} else if (arg.substr(0, 37) === "[Fleur.XQueryX.computedPIConstructor,") {
			p = plen + "." + arg.substr(0, arg.length - 2) + ",[Fleur.XQueryX.piValueExpr,[" + cargs + "]]]]";
		} else {
			var cname0 = arg.substr(arg.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
			var cname = cname0.substr(0, cname0.length - 6);
			switch (cname) {
				case "'document'":
					p = plen + "." + "[Fleur.XQueryX.computedDocumentConstructor,[[Fleur.XQueryX.argExpr,[" + cargs + "]]]]";
					break;
				case "'comment'":
					p = plen + "." + "[Fleur.XQueryX.computedCommentConstructor,[[Fleur.XQueryX.argExpr,[" + cargs + "]]]]";
					break;
				case "'map'":
					var cargs2 = cargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? cargs.substr(26, cargs.length - 28) : cargs;
					p = plen + "." + "[Fleur.XQueryX.mapConstructor,[" + cargs2 + "]]";
					break;
				case "'entry'":
					p = plen + "." + "[Fleur.XQueryX.computedEntryConstructor,[[Fleur.XQueryX.tagNameExpr,[" + cargs + "]]]]";
					break;
				case "'element'":
					p = plen + "." + "[Fleur.XQueryX.computedElementConstructor,[[Fleur.XQueryX.tagNameExpr,[" + cargs + "]]]]";
					break;
				case "'attribute'":
					p = plen + "." + "[Fleur.XQueryX.computedAttributeConstructor,[[Fleur.XQueryX.tagNameExpr,[" + cargs + "]]]]";
					break;
				case "'processing-instruction'":
					p = plen + "." + "[Fleur.XQueryX.computedPIConstructor,[[Fleur.XQueryX.piTargetExpr,[" + cargs + "]]]]";
					break;
				case "'text'":
					p = plen + "." + "[Fleur.XQueryX.computedTextConstructor,[[Fleur.XQueryX.argExpr,[" + cargs + "]]]]";
					break;
			}
		}
	} else if (c === "(") {
		if (arg.substr(0, 77) === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['") {
			var fname0 = arg.substr(arg.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
			var fname = fname0.substr(0, fname0.length - 6);
			var fargs = t.substr(t.indexOf(".") + 1);
			var fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			var parg0, parg;
			switch (fname) {
				case "'array'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['array']]]]")) + "[Fleur.XQueryX.arrayTest,[]]]]]]";
					break;
				case "'attribute'":
					parg = Fleur.XPathEvaluator._testFormat(fargs2, "Fleur.XQueryX.attributeName");
					p = plen + "." + "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['attribute']],[Fleur.XQueryX.attributeTest,[" + parg + "]]]]]]";
					break;
				case "'comment'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['comment']]]]")) + "[Fleur.XQueryX.commentTest,[]]]]]]";
					break;
				case "'document-node'":
					if (fargs2 !== "") {
						parg0 = fargs2.substr(fargs2.indexOf("[Fleur.XQueryX.elementTest,["));
						parg = parg0.substr(0, parg0.length - 4);
					} else {
						parg = "";
					}
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['document-node']]]]")) + "[Fleur.XQueryX.documentTest,[" + parg + "]]]]]]";
					break;
				case "'element'":
					parg = Fleur.XPathEvaluator._testFormat(fargs2, "Fleur.XQueryX.elementName");
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['element']]]]")) + "[Fleur.XQueryX.elementTest,[" + parg + "]]]]]]";
					break;
				case "'entry'":
					parg = Fleur.XPathEvaluator._testFormat(fargs2, "Fleur.XQueryX.entryName");
					p = plen + "." + "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['entry']],[Fleur.XQueryX.entryTest,[" + parg + "]]]]]]";
					break;
				case "'function'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['function']]]]")) + "[33,[]]]]]]";
					break;
				case "'map'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['map']]]]")) + "[Fleur.XQueryX.mapTest,[]]]]]]";
					break;
				case "'namespace-node'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['namespace-node']]]]")) + "[Fleur.XQueryX.namespaceTest,[]]]]]]";
					break;
				case "'node'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['node']]]]")) + "[Fleur.XQueryX.anyKindTest,[]]]]]]";
					break;
				case "'processing-instruction'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['processing-instruction']]]]")) + "[Fleur.XQueryX.piTest,[]]]]]]";
					break;
				case "'schema-attribute'":
					parg0 = fargs.substr(fargs.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
					parg = parg0.substr(0, parg0.length - 6);
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['schema-attribute']]]]")) + "[Fleur.XQueryX.schemaAttributeTest,[" + parg + "]]]]]]";
					break;
				case "'schema-element'":
					parg0 = fargs.substr(fargs.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
					parg = parg0.substr(0, parg0.length - 6);
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['schema-element']]]]")) + "[Fleur.XQueryX.schemaElementTest,[" + parg + "]]]]]]";
					break;
				case "'text'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['text']]]]")) + "[Fleur.XQueryX.textTest,[]]]]]]";
					break;
				default:
					p = plen + ".[Fleur.XQueryX.functionCallExpr,[[Fleur.XQueryX.functionName,[" + fname + "]],[Fleur.XQueryX.arguments,[" + fargs2 + "]]]]";
			}
		} else if (arg.substr(0, 77) === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[") {
			var arg1, arg2, arg20;
			if (arg.indexOf(",[Fleur.XQueryX.predicates,[") !== -1) {
				arg1 = arg.substr(0, arg.indexOf(",[Fleur.XQueryX.predicates,[")).substr(77);
				arg20 = arg.substr(arg.indexOf(",[Fleur.XQueryX.predicates,[") + 28);
				arg2 = arg20.substr(0, arg20.length - 6);
			} else {
				arg1 = arg.substr(0, arg.length - 8).substr(77);
				arg2 = "";
			}
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[" + arg1 + (arg2 === "" ? "" : ",[Fleur.XQueryX.predicates,[" + arg2 + "]]") + (fargs2 === "" ? "" : ",[Fleur.XQueryX.arguments,[" + fargs2 + "]]") + "]]]]]]]]";
		} else if (arg.substr(0, 32) === "[Fleur.XQueryX.namedFunctionRef,") {
			p = plen + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[" + arg + "]]]]]]]]]]";
		} else if (arg === "[Fleur.XQueryX.flworExpr,[]]") {
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + ".[Fleur.XQueryX.flworExpr,[" + fargs2 + "]]";
		} else if (arg.substr(0, 57) === "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier,") {
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + "." + arg.substr(0, arg.length - 2) + "," + fargs2 + "]]";
		} else if (arg !== "") {
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[" + arg + "]]" + (fargs2 === "" ? "" : ",[Fleur.XQueryX.arguments,[" + fargs2 + "]]") + "]]]]]]]]";
		} else {
			p = plen + "." + t.substr(t.indexOf(".") + 1);
		}
	} else {
		if (arg.substr(0, 25) !== "[Fleur.XQueryX.pathExpr,[") {
			arg = "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[" + arg + "]]]]]]";
		}
		if (c === "?") {
			p = plen + "." + arg.substr(0, arg.length - 4) + "," + t.substr(t.indexOf(".") + 1) + "]]]]";
		} else if (arg.indexOf(",[Fleur.XQueryX.predicates,[") === -1) {
			p = plen + "." + arg.substr(0, arg.length - 4) + ",[Fleur.XQueryX.predicates,[" + t.substr(t.indexOf(".") + 1) + "]]]]]]";
		} else {
			p = plen + "." + arg.substr(0, arg.length - 6) + "," + t.substr(t.indexOf(".") + 1) + "]]]]]]";
		}
	}
	var inext = Fleur.XPathEvaluator._skipSpaces(s, plen - 1);
	var cnext = s.charAt(inext);
	if (cnext === "(" || cnext === "[" || cnext === "{" || cnext === "?") {
		return Fleur.XPathEvaluator._getPredParam(cnext, s.substr(inext + 1), l + inext + 1, p.substr(p.indexOf(".") + 1));
	}
	return (l + plen) + "." + p.substr(p.indexOf(".") + 1);
};
Fleur.XPathEvaluator._getPredParams = function(s, len, arg) {
	var i = Fleur.XPathEvaluator._skipSpaces(s, 0);
	if (s.charAt(i) === "(" || s.charAt(i) === "[" || s.charAt(i) === "{" || s.charAt(i) === "?") {
		return Fleur.XPathEvaluator._getPredParam(s.charAt(i), s.substr(i + 1), len + i, arg);
	}
	return (len + i) + "." + arg;
};
Fleur.XPathEvaluator._getStringLiteral = function(s) {
	var i = Fleur.XPathEvaluator._skipSpaces(s, 0);
	var d = s.substr(i + 1);
	if (s.charAt(i) === "'") {
		var sep2 = d.indexOf("'");
		var t2 = d.substr(0, d.indexOf("'"));
		while (d.substr(sep2 + 1, 1) === "'") {
			var d2 = d.substr(sep2 + 2);
			t2 += "\\'" + d2.substr(0, d2.indexOf("'"));
			sep2 += 2 + d2.indexOf("'");
		}
		var t2b = "'" + Fleur.DocumentType.resolveEntities(null, t2) + "'";
		if (t2b === "''") {
			t2b = "";
		}
		return (sep2 + 2) + "." + t2b;
	} else if (s.charAt(i) === '"') {
		var sep3 = d.indexOf('"');
		var t3 = d.substr(0, d.indexOf('"'));
		while (d.substr(sep3 + 1, 1) === '"') {
			var d3 = d.substr(sep3 + 2);
			t3 += '\\"' + d3.substr(0, d3.indexOf('"'));
			sep3 += 2 + d3.indexOf('"');
		}
		var t3b = '"' + Fleur.DocumentType.resolveEntities(null, t3) + '"';
		if (t3b === '""') {
			t3b = "";
		}
		return (sep3 + 2) + "." + t3b;
	}
};
Fleur.XPathEvaluator._getNumber = function(s, r) {
	r = r || "";
	if (s === "") {
		return r;
	}
	var c = s.charAt(0);
	if (c === "E") {
		c = "e";
	}
	if ("0123456789".indexOf(c) !== -1 || ((c === "." || c === "e") && r.indexOf(c) === -1) ||
		((c === "-" || c === "+") && r.endsWith("e"))) {
		return Fleur.XPathEvaluator._getNumber(s.substr(1), r + c);
	}
	return r;
};
Fleur.XPathEvaluator._xp2js = function(xp, args, ops) {
	var i = Fleur.XPathEvaluator._skipSpaces(xp, 0);
	var c = xp.charAt(i);
	var d = xp.substr(i + 1);
	var d2;
	var r = "";
	if (c === ".") {
		if (d.charAt(0) === ".") {
			r = "2.[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['parent']],[Fleur.XQueryX.anyKindTest,[]]]]]]";
		} else {
			r = "1.[Fleur.XQueryX.contextItemExpr,[]]";
		}
	} else if (c === ")" || c === "}") {
		r = "0.";
	} else if (c === "/") {
		r = (d.charAt(0) === "" || "/@*.(_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ \n\r\t".indexOf(d.charAt(0)) === -1 ? "1" : "0") + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.rootExpr,[]]]]";
	} else if (c === "@") {
		r = Fleur.XPathEvaluator._getNameStep(d, 1);
	} else if (c === "'") {
		var sep2 = d.indexOf("'");
		var t2 = d.substr(0, d.indexOf("'"));
		while (d.substr(sep2 + 1, 1) === "'") {
			d2 = d.substr(sep2 + 2);
			t2 += "\\'" + d2.substr(0, d2.indexOf("'"));
			sep2 += 2 + d2.indexOf("'");
		}
		var t2b = "'" + Fleur.DocumentType.resolveEntities(null, t2) + "'";
		if (t2b === "''") {
			t2b = "";
		}
		r = (sep2 + 2) + ".[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[" + t2b + "]]]]";
	} else if (c === '"') {
		var sep3 = d.indexOf('"');
		var t3 = d.substr(0, d.indexOf('"'));
		while (d.substr(sep3 + 1, 1) === '"') {
			var d3 = d.substr(sep3 + 2);
			t3 += '\\"' + d3.substr(0, d3.indexOf('"'));
			sep3 += 2 + d3.indexOf('"');
		}
		var t3b = '"' + Fleur.DocumentType.resolveEntities(null, t3) + '"';
		if (t3b === '""') {
			t3b = "";
		}
		r = (sep3 + 2) + ".[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[" + t3b + "]]]]";
	} else if (c === "(") {
		if (d.charAt(Fleur.XPathEvaluator._skipSpaces(d, 0)) === ")") {
			r = "2.[Fleur.XQueryX.sequenceExpr,[]]";
		} else {
			r = "0.";
		}
	} else if (c === "-" || c === "+") {
		if (d !== "" && "0123456789".indexOf(d.charAt(0)) !== -1) {
			var t4 = Fleur.XPathEvaluator._getNumber(d, c);
			r = t4.length + ".[" + (t4.indexOf("e") !== -1 ? "Fleur.XQueryX.doubleConstantExpr" : t4.indexOf(".") !== -1 ? "Fleur.XQueryX.decimalConstantExpr" : "Fleur.XQueryX.integerConstantExpr") + ",[[Fleur.XQueryX.value,['" + t4.replace(/e\+/, "e") + "']]]]";
		} else {
			c = "~" + c;
			r = "0.";
		}
	} else if (c !== "" && "0123456789".indexOf(c) !== -1) {
		var t5 = Fleur.XPathEvaluator._getNumber(c + d);
		r = t5.length + ".[" + (t5.indexOf("e") !== -1 ? "Fleur.XQueryX.doubleConstantExpr" : t5.indexOf(".") !== -1 ? "Fleur.XQueryX.decimalConstantExpr" : "Fleur.XQueryX.integerConstantExpr") + ",[[Fleur.XQueryX.value,['" + t5.replace(/e\+/, "e") + "']]]]";
	} else if (c === "$") {
		var t51 = Fleur.XPathEvaluator._getName(d);
		var pt51 = (t51.indexOf(":") === -1 ? ":" : "") + t51;
		r = (t51.length + 1) + ".[Fleur.XQueryX.varRef,[[Fleur.XQueryX.name,['" + pt51.substr(pt51.indexOf(":") + 1) + "'" + (pt51.charAt(0) === ":" ? "" : ",[Fleur.XQueryX.prefix,['" + pt51.substr(0, pt51.indexOf(":")) + "']]") + "]]]]";
	} else if (c !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*".indexOf(c) !== -1) {
		var t61 = Fleur.XPathEvaluator._getName(c+d);
		if (["element","attribute","entry","processing-instruction"].indexOf(t61) !== -1) {
			var i61 = Fleur.XPathEvaluator._skipSpaces(xp, i + t61.length);
			var c61 = xp.charAt(i61);
			if (c61 !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c61) !== -1) {
				var d61 = xp.substr(i61 + 1);
				var t62 = Fleur.XPathEvaluator._getName(c61 + d61);
				switch(t61) {
					case "element":
						r = String(i61 - i + t62.length) + ".[Fleur.XQueryX.computedElementConstructor,[[Fleur.XQueryX.tagName,['" + t62  + "']]]]";
						break;
					case "attribute":
						r = String(i61 - i + t62.length) + ".[Fleur.XQueryX.computedAttributeConstructor,[[Fleur.XQueryX.tagName,['" + t62  + "']]]]";
						break;
					case "processing-instruction":
						r = String(i61 - i + t62.length) + ".[Fleur.XQueryX.computedPIConstructor,[[Fleur.XQueryX.piTarget,['" + t62  + "']]]]";
						break;
					case "entry":
						r = String(i61 - i + t62.length) + ".[Fleur.XQueryX.computedEntryConstructor,[[Fleur.XQueryX.tagName,['" + t62  + "']]]]";
				}
			} else {
				r = Fleur.XPathEvaluator._getNameStep(c + d, 0);
			}
		} else {
			r = Fleur.XPathEvaluator._getNameStep(c + d, 0);
		}
	} else if (c === "<") {
		r = Fleur.XPathEvaluator._getNodeConstructor(c + d);
	} else {
		r = "~~~~Unexpected char at '" + c + d + "'~#~#";
		throw Error("Unexpected char at '" + c + d + "'");
	}
	if (r.indexOf("~~~~") !== -1) {
		return r;
	}
	var rlen = parseInt(r.substr(0, r.indexOf(".")), 10);
	var rval = r.substr(r.indexOf(".") + 1);
	d2 = rlen === 0 ? c + d : d.substr(rlen - 1);
	r = Fleur.XPathEvaluator._getPredParams(d2, rlen, rval);
	rlen = parseInt(r.substr(0, r.indexOf(".")), 10);
	rval = r.substr(r.indexOf(".") + 1);
	var args2 = rval.length + "." + rval + args;
	var f = rlen === 0 ? c + d : d.substr(rlen - 1);
	var i4 = Fleur.XPathEvaluator._skipSpaces(f, 0);
	var o = f.charAt(i4);
	if (ops.substr(0, 16) === "13.6.instance of") {
		if (o === "+" || o === "?" || o === "*") {
			ops = "14.6.instance of" + o + ops.substr(16);
			i4 = Fleur.XPathEvaluator._skipSpaces(f, 1);
			o = f.charAt(i4);
		}
	}
	if (o === "") {
		var stacks = Fleur.XPathEvaluator._calc(args2, ops, 9999999);
		var reslen0 = stacks.substr(stacks.indexOf(".") + 1);
		var reslen = reslen0.substr(0, reslen0.indexOf("."));
		var ret0 = stacks.substr(stacks.indexOf(".") + 1);
		return ret0.substr(ret0.indexOf(".") + 1).substr(0, parseInt(reslen, 10));
	}
	var p = f.substr(f.indexOf(o));
	if (o === "]" || o === ")" || o === "}" || (p.substr(0, 6) === "return" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) || (p.substr(0, 9) === "satisfies" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(9)) === -1)) {
		var stacks2 = Fleur.XPathEvaluator._calc(args2, ops, 998);
		var reslen20 = stacks2.substr(stacks2.indexOf(".") + 1);
		var reslen2 = reslen20.substr(0, reslen20.indexOf("."));
		var ret20 = stacks2.substr(stacks2.indexOf(".") + 1);
		return (f.substr(f.indexOf(o) + 1).length - (o === "r" ? 5 : o === "s" ? 8 : 0)) + "." + ret20.substr(ret20.indexOf(".") + 1).substr(0, parseInt(reslen2, 10));
	}
	var op = "null";
	var op2 = "null";
	if (o === "$") {
		switch(rval) {
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['for']]]]]]":
				rval = "[Fleur.XQueryX.flworExpr,[]]";
				op = "for";
				break;
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['let']]]]]]":
				rval = "[Fleur.XQueryX.flworExpr,[]]";
				op = "let";
				break;
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['every']]]]]]":
				rval = "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier,['every']]]]";
				op = "every";
				break;
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['some']]]]]]":
				rval = "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier,['some']]]]";
				op = "some";
				break;
		}
		if (op !== "null") {
			r = Fleur.XPathEvaluator._getPredParams("(" + f, rlen, rval);
			rlen = parseInt(r.substr(0, r.indexOf(".")), 10);
			rval = r.substr(r.indexOf(".") + 1);
			args2 = rval.length + "." + rval + args;
			op = op === "for" || op === "let" ? "return" : "satisfies";
			f = d.substr(rlen - 2 - op.length);
			p = f.substr(1);
		}
	} else if (p.substr(0, 9) === "intersect" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(9)) === -1) {
		op = p.substr(0, 9);
	} else if (p.substr(0, 8) === "instance" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(8)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 8) + 2);
		op2 = "instance of";
	} else if (p.substr(0, 8) === "castable" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(8)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 8) + 2);
		op2 = "castable as";
	} else if ((p.substr(0, 6) === "except" || p.substr(0, 6) === "before") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) {
		op = p.substr(0, 6);
	} else if (p.substr(0, 5) === "treat" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 5) + 2);
		op2 = "treat as";
	} else if ((p.substr(0, 5) === "union" || p.substr(0, 5) === "every" || p.substr(0, 5) === "nodes" || p.substr(0, 5) === "after" || p.substr(0, 5) === "value") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
		op = p.substr(0, 5);
	} else if (p.substr(0, 4) === "cast" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(4)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 4) + 2);
		op2 = "cast as";
	} else if ((p.substr(0, 4) === "idiv" || p.substr(0, 4) === "some" || p.substr(0, 4) === "then" || p.substr(0, 4) === "else" || p.substr(0, 4) === "node" || p.substr(0, 4) === "with" || p.substr(0, 4) === "into") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(4)) === -1) {
		op = p.substr(0, 4);
	} else if ((p.substr(0, 3) === "div" || p.substr(0, 3) === "and" || p.substr(0, 3) === "mod" || p.substr(0, 3) === "let" || p.substr(0, 3) === "for") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(3)) === -1) {
		op = p.substr(0, 3);
	} else if ((p.substr(0, 2) === "or" || p.substr(0, 2) === "eq" || p.substr(0, 2) === "ne" || p.substr(0, 2) === "lt" || p.substr(0, 2) === "le" || p.substr(0, 2) === "gt" || p.substr(0, 2) === "ge" || p.substr(0, 2) === "is" || p.substr(0, 2) === "to" || p.substr(0, 2) === "in" || p.substr(0, 2) === "as") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(2)) === -1) {
		op = p.substr(0, 2);
	} else if (p.substr(0, 2) === "!=" || p.substr(0, 2) === "<=" || p.substr(0, 2) === ">=" || p.substr(0, 2) === "<<" || p.substr(0, 2) === ">>" || p.substr(0, 2) === "//" || p.substr(0, 2) === "~+" || p.substr(0, 2) === "~-" || p.substr(0, 2) === ":=" || p.substr(0, 2) === "||") {
		op = p.substr(0, 2);
	} else if ("+-*=|,<>/!{:".indexOf(o) !== -1) {
		op = o;
	}
	if (op !== "null") {
		var opprec0 = Fleur.XPathEvaluator._precedence.substr(Fleur.XPathEvaluator._precedence.indexOf("." + (op2 !== "null" ? op2 : op) + ".") + op.length + 2);
		var opprec00 = opprec0.substr(opprec0.indexOf(";") + 1);
		var opprec = opprec00.substr(0, opprec00.indexOf("."));
		var stacks3 = Fleur.XPathEvaluator._calc(args2, ops, parseInt(opprec, 10));
		var args3len = stacks3.substr(0, stacks3.indexOf("."));
		var args3 = stacks3.substr(stacks3.indexOf(".") + 1).substr(0, parseInt(args3len, 10));
		var nextstack = stacks3.substr(args3len.length + 1 + parseInt(args3len, 10));
		var ops3len = nextstack.substr(0, nextstack.indexOf("."));
		var ops3 = nextstack.substr(nextstack.indexOf(".") + 1).substr(0, parseInt(ops3len, 10));
		var xp3 = p.substr(op.length);
		return Fleur.XPathEvaluator._xp2js(xp3, args3, (opprec.length + 1 + op.length) + "." + opprec + "." + op + ops3);
	}
	throw Error("Unknown operator at '" + f + "'");
};
Fleur.XPathEvaluator._getVersion = function(xq) {
	var i = Fleur.XPathEvaluator._skipSpaces(xq, 0);
	var c = xq.charAt(i);
	var d = xq.substr(i + 1);
	var r = "";
	var v, e;
	if (c === "" || "abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
		return i + ".";
	}
	r = Fleur.XPathEvaluator._getName(c + d);
	if (r === "xquery") {
		var j = Fleur.XPathEvaluator._skipSpaces(xq, i + r.length);
		c = xq.charAt(j);
		d = xq.substr(j + 1);
		if (c === "" || "abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
			return i + ".";
		}
		r = Fleur.XPathEvaluator._getName(c + d);
		if (r === "version") {
			j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
			c = xq.charAt(j);
			d = xq.substr(j + 1);
			if (c !== "'" && c !== '"') {
				return i + ".";
			}
			r = Fleur.XPathEvaluator._getStringLiteral(c + d);
			var vl = r.substr(0, r.indexOf("."));
			v = r.substr(vl.length + 1);
			j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
			c = xq.charAt(j);
			if (c === ";") {
				return (j + 1) + ".[Fleur.XQueryX.versionDecl,[[Fleur.XQueryX.version,[" + v + "]]]],";
			}
			d = xq.substr(j + 1);
			r = Fleur.XPathEvaluator._getName(c + d);
		}
		if (r === "encoding") {
			j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
			c = xq.charAt(j);
			d = xq.substr(j + 1);
			if (c !== "'" && c !== '"') {
				return i + ".";
			}
			r = Fleur.XPathEvaluator._getStringLiteral(c + d);
			var el = r.substr(0, r.indexOf("."));
			e = r.substr(el.length + 1);
			j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(el, 10));
			c = xq.charAt(j);
			if (c === ";") {
				return (j + 1) + ".[Fleur.XQueryX.versionDecl,[" + (v ? "[Fleur.XQueryX.version,[" + v + "]]," : "") + "[Fleur.XQueryX.encoding,[" + e + "]]]],";
			}
		}
	}
	return i + ".";
};
Fleur.XPathEvaluator._getProlog = function(xq, i) {
	var pindex;
	i = Fleur.XPathEvaluator._skipSpaces(xq, i);
	var c = xq.charAt(i);
	var d = xq.substr(i + 1);
	var r = "", v, vl;
	var res = i + ".";
	var end = xq.length;
	var updatingfunction = false;
	var j;
	if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
		r = Fleur.XPathEvaluator._getName(c + d);
		switch (r) {
			case "declare":
				j = Fleur.XPathEvaluator._skipSpaces(xq, i + r.length);
				c = xq.charAt(j);
				d = xq.substr(j + 1);
				while (c === "%") {
					r = Fleur.XPathEvaluator._getName(d);
					if (r === "updating") {
						updatingfunction = true;
					}
					j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1 + r.length);
					c = xq.charAt(j);
					d = xq.substr(j + 1);
				}
				if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
					r = Fleur.XPathEvaluator._getName(c + d);
					switch (r) {
						case "default":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								switch (r) {
									case "element":
									case "function":
										var category = r;
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
										if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
											r = Fleur.XPathEvaluator._getName(c + d);
											if (r === "namespace") {
												j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
												c = xq.charAt(j);
												d = xq.substr(j + 1);
												if (c === "'" || c === '"') {
													r = Fleur.XPathEvaluator._getStringLiteral(c + d);
													vl = r.substr(0, r.indexOf("."));
													v = r.substr(vl.length + 1);
													j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
													c = xq.charAt(j);
													if (c === ";") {
														return (j + 1) + ".[Fleur.XQueryX.defaultNamespaceDecl,[[Fleur.XQueryX.defaultNamespaceCategory,['" + category + "']],[Fleur.XQueryX.uri,[" + v + "]]]],";
													}
												}
											}
										}
										break;
									case "collation":
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
										if (c === "'" || c === '"') {
											r = Fleur.XPathEvaluator._getStringLiteral(c + d);
											vl = r.substr(0, r.indexOf("."));
											v = r.substr(vl.length + 1);
											j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
											c = xq.charAt(j);
											if (c === ";") {
												return (j + 1) + ".[Fleur.XQueryX.defaultCollationDecl,[" + v + "]],";
											}
										}
										break;
									case "order":
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
										if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
											r = Fleur.XPathEvaluator._getName(c + d);
											if (r === "empty") {
												j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
												c = xq.charAt(j);
												d = xq.substr(j + 1);
												if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
													r = Fleur.XPathEvaluator._getName(c + d);
													if (r === "greatest" || r === "least") {
														j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
														c = xq.charAt(j);
														if (c === ";") {
															return (j + 1) + ".[Fleur.XQueryX.emptyOrderingDecl,['empty " + r + "']],";
														}
													}
												}
											}
										}
										break;
									case "decimal-format":
								}
							}
							break;
						case "boundary-space":
						case "construction":
							var decl = r === "boundary-space" ? "boundarySpaceDecl" : "constructionDecl";
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "strip" || r === "preserve") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									if (c === ";") {
										return (j + 1) + ".[Fleur.XQueryX." + decl + ",['" + r + "']],";
									}
								}
							}
							break;
						case "base-uri":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if (c === "'" || c === '"') {
								r = Fleur.XPathEvaluator._getStringLiteral(c + d);
								vl = r.substr(0, r.indexOf("."));
								v = r.substr(vl.length + 1);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
								c = xq.charAt(j);
								if (c === ";") {
									return (j + 1) + ".[Fleur.XQueryX.baseUriDecl,[" + v + "]],";
								}
							}
							break;
						case "ordering":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "ordered" || r === "unordered") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									if (c === ";") {
										return (j + 1) + ".[Fleur.XQueryX.orderingModeDecl,['" + r + "']],";
									}
								}
							}
							break;
						case "copy-namespaces":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "preserve" || r === "no-preserve") {
									var preserve = r;
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									if (c === ",") {
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
										if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
											r = Fleur.XPathEvaluator._getName(c + d);
											if (r === "inherit" || r === "no-inherit") {
												j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
												c = xq.charAt(j);
												if (c === ";") {
													return (j + 1) + ".[Fleur.XQueryX.copyNamespacesDecl,[[Fleur.XQueryX.preserveMode,['" + preserve + "']],[Fleur.XQueryX.inheritMode,['" + r + "']]]],";
												}
											}
										}
									}
								}
							}
							break;
						case "decimal-format":
							break;
						case "namespace":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								var prefix = Fleur.XPathEvaluator._getName(c + d);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + prefix.length);
								c = xq.charAt(j);
								if (c === "=") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
									c = xq.charAt(j);
									d = xq.substr(j + 1);
									if (c === "'" || c === '"') {
										r = Fleur.XPathEvaluator._getStringLiteral(c + d);
										vl = r.substr(0, r.indexOf("."));
										v = r.substr(vl.length + 1);
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
										c = xq.charAt(j);
										if (c === ";") {
											return (j + 1) + ".[Fleur.XQueryX.namespaceDecl,[[Fleur.XQueryX.prefixElt,['" + prefix + "']],[Fleur.XQueryX.uri,[" + v + "]]]],";
										}
									}
								}
							}
							break;
						case "context":
							break;
						case "variable":
							break;
						case "function":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								var fname = Fleur.XPathEvaluator._getName(c + d);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + fname.length);
								c = xq.charAt(j);
								pindex = fname.indexOf(":");
								var np = pindex === -1 ? "'" + fname + "'" : "'" + fname.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + fname.substr(0, pindex) + "']]";
								var fres = ".[Fleur.XQueryX.functionDecl,[" + (updatingfunction ? "[Fleur.XQueryX.updatingFunction,['true']]," : "") + "[Fleur.XQueryX.functionName,[" + np + "]],[Fleur.XQueryX.paramList,[";
								var nbpar = 0;
								if (c === "(") {
									do {
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
										c = xq.charAt(j);
										if (c !== ")") {
											if (c !== "$") {
												return res;
											}
											j++;
											c = xq.charAt(j);
											d = xq.substr(j + 1);
											if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
												return res;
											}
											var pname = Fleur.XPathEvaluator._getName(c + d);
											j = Fleur.XPathEvaluator._skipSpaces(xq, j + pname.length);
											c = xq.charAt(j);
											var tdecl = "";
											if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
												d = xq.substr(j + 1);
												r = Fleur.XPathEvaluator._getName(c + d);
												if (r === "as") {
													j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
													c = xq.charAt(j);
													if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
														d = xq.substr(j + 1);
														var ptype = Fleur.XPathEvaluator._getName(c + d);
														pindex = ptype.indexOf(":");
														np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
														c = xq.charAt(j + ptype.length);
														tdecl = ",[Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[" + np + "]]";
														if ("?+*".indexOf(c) !== -1) {
															tdecl += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
															j++;
														}
														tdecl += "]]";
														j = Fleur.XPathEvaluator._skipSpaces(xq, j + ptype.length);
														c = xq.charAt(j);
													}
												}
											}
											if (nbpar !== 0) {
												fres += ",";
											}
											fres += "[Fleur.XQueryX.param,[[Fleur.XQueryX.varName,['" + pname + "']]" + tdecl + "]]";
											nbpar++;
										}
									} while (c === ",");
									if (c !== ")") {
										return res;
									}
									fres += "]]";
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
									c = xq.charAt(j);
									if (c === "a") {
										d = xq.substr(j + 1);
										r = Fleur.XPathEvaluator._getName(c + d);
										if (r === "as") {
											j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
											c = xq.charAt(j);
											if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
												d = xq.substr(j + 1);
												ptype = Fleur.XPathEvaluator._getName(c + d);
												pindex = ptype.indexOf(":");
												np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
												c = xq.charAt(j + ptype.length);
												fres += ",[Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[" + np + "]]";
												if ("?+*".indexOf(c) !== -1) {
													fres += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
													j++;
												}
												fres += "]]";
												j = Fleur.XPathEvaluator._skipSpaces(xq, j + ptype.length);
												c = xq.charAt(j);
											}
										}
									}
									if (c === "{") {
										fres += ",[Fleur.XQueryX.functionBody,[";
										var braces = 1;
										var body = "";
										while ((c !== "}" || braces !== 0) && j !== end) {
											c = xq.charAt(++j);
											if (c === "{") {
												braces++;
											} else if (c === "}") {
												braces--;
											}
											if (braces !== 0) {
												body += c;
											}
										}
										if (body !== "") {
											fres += Fleur.XPathEvaluator._xp2js(body, "", "");
										}
										fres += "]]]],";
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
										c = xq.charAt(j);
										if (c === ";") {
											return (j + 1) + fres;
										}
									} else if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
										d = xq.substr(j + 1);
										r = Fleur.XPathEvaluator._getName(c + d);
										if (r === "external") {
											j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
											c = xq.charAt(j);
											fres += ",[Fleur.XQueryX.externalDefinition,[]]]],";
											if (c === ";") {
												return (j + 1) + fres;
											}
										}
									}
								}
							}
							break;
						case "option":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								var optionname = Fleur.XPathEvaluator._getName(c + d);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + optionname.length);
								c = xq.charAt(j);
								d = xq.substr(j + 1);
								if (c === "'" || c === '"') {
									r = Fleur.XPathEvaluator._getStringLiteral(c + d);
									vl = r.substr(0, r.indexOf("."));
									v = r.substr(vl.length + 1);
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
									c = xq.charAt(j);
									if (c === ";") {
										pindex = optionname.indexOf(":");
										if (pindex === -1) {
											return (j + 1) + ".[Fleur.XQueryX.optionDecl,[[Fleur.XQueryX.optionName,['" + optionname + "']],[Fleur.XQueryX.optionContents,[" + v + "]]]],";
										}
										return (j + 1) + ".[Fleur.XQueryX.optionDecl,[[Fleur.XQueryX.optionName,['" + optionname.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + optionname.substr(0, pindex) + "']]]],[Fleur.XQueryX.optionContents,[" + v + "]]]],";
									}
								}
							}
					}
				}
				break;
			case "import":
				j = Fleur.XPathEvaluator._skipSpaces(xq, i + r.length);
				c = xq.charAt(j);
				d = xq.substr(j + 1);
				if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
					r = Fleur.XPathEvaluator._getName(c + d);
					if (r === "javascript") {
						j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
						c = xq.charAt(j);
						d = xq.substr(j + 1);
						if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
							r = Fleur.XPathEvaluator._getName(c + d);
							if (r === "at") {
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
								c = xq.charAt(j);
								d = xq.substr(j + 1);
								if (c === "'" || c === '"') {
									r = Fleur.XPathEvaluator._getStringLiteral(c + d);
									vl = r.substr(0, r.indexOf("."));
									v = r.substr(vl.length + 1);
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
									c = xq.charAt(j);
									if (c === ";") {
										return (j + 1) + ".[Fleur.XQueryX.javascriptImport,[[Fleur.XQueryX.targetLocation,[" + v + "]]]],";
									}
								}
							} else {
								return res;
							}
						} else {
							return res;
						}
					}
				}
		}
	}
	return res;
};
Fleur.XPathEvaluator._xq2js = function(xq) {
	xq = xq.replace(/^\s+|\s+$/gm, " ");
	var v = Fleur.XPathEvaluator._getVersion(xq);
	var vl = v.substr(0, v.indexOf("."));
	var prolog = "", p, pc, pl = parseInt(vl, 10);
	do {
		p = Fleur.XPathEvaluator._getProlog(xq, pl);
		pl = parseInt(p.substr(0, p.indexOf(".")), 10);
		pc = p.substr(p.indexOf(".") + 1);
		prolog += pc;
	} while (pc !== "");
	return "[Fleur.XQueryX.module,[" + v.substr(v.indexOf(".") + 1) + "[Fleur.XQueryX.mainModule,[" + (prolog === "" ? "" : "[Fleur.XQueryX.prolog,[" + prolog.substr(0, prolog.length - 1) + "]],") + "[Fleur.XQueryX.queryBody,[" + Fleur.XPathEvaluator._xp2js(xq.substr(pl), "", "") + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]],[Fleur.XQueryX.xqxuf,["http://www.w3.org/2007/xquery-update-10"]],[Fleur.XQueryX.schemaLocation,["http://www.w3.org/2007/xquery-update-10 http://www.w3.org/2007/xquery-update-10/xquery-update-10-xqueryx.xsd http://www.w3.org/2005/XQueryX http://www.w3.org/2005/XQueryX/xqueryx.xsd"]],[Fleur.XQueryX.xsi,["http://www.w3.org/2001/XMLSchema-instance"]]]]';
};
Fleur.XPathException = function(code, error) {
	this.code = code;
	this.error = error;
};
Fleur.XPathException.INVALID_EXPRESSION_ERR = 51;
Fleur.XPathException.TYPE_ERR = 52;
Fleur.XPathNSResolver = function(node) {
	this.pf2uri = {
		"xml": "http://www.w3.org/XML/1998/namespace",
		"xmlns": "http://www.w3.org/2000/xmlns/",
		"xs": "http://www.w3.org/2001/XMLSchema",
		" function": "http://www.w3.org/2005/xpath-functions",
		"fn": "http://www.w3.org/2005/xpath-functions",
		"local": "http://www.w3.org/2005/xquery-local-functions",
		"math": "http://www.w3.org/2005/xpath-functions/math",
		"map": "http://www.w3.org/2005/xpath-functions/map",
		"array": "http://www.w3.org/2005/xpath-functions/array",
		"err": "http://www.w3.org/2005/xqt-errors",
		"b": "http://xqib.org",
		"file": "http://expath.org/ns/file",
		"http": "http://expath.org/ns/http-client",
		"request": "http://exquery.org/ns/request",
		"prof": "http://basex.org/modules/prof",
		"proc": "http://basex.org/modules/proc",
		"js": "http://www.w3.org/standards/webdesign/script",
		"fleur": "http://www.agencexml.com/fleur",
		"dgram": "http://www.agencexml.com/fleur/dgram",
		"ietf": "https://tools.ietf.org/rfc/index"
	};
	this.node = node;
};
Fleur.XPathNSResolver.prototype.lookupNamespaceURI = function(prefix) {
	var uri;
	if (this.pf2uri[prefix]) {
		return this.pf2uri[prefix];
	}
	if (this.node) {
		uri = this.node.lookupNamespaceURI(prefix);
		if (uri) {
			this.pf2uri[prefix] = uri;
		}
	}
	return uri;
};
Fleur.XPathNSResolver.prototype.declareNamespace = function(prefix, uri) {
	this.pf2uri[prefix] = uri;
};
Fleur.XPathResult = function(doc, expression, contextNode, env, resultType) {
	this.document = doc;
	this.expression = expression;
	this.contextNode = contextNode;
	this.env = env;
	this.resultType = resultType;
	this._index = 0;
};
Fleur.XPathResult.ANY_TYPE = 0;
Fleur.XPathResult.NUMBER_TYPE = 1;
Fleur.XPathResult.STRING_TYPE = 2;
Fleur.XPathResult.BOOLEAN_TYPE = 3;
Fleur.XPathResult.UNORDERED_NODE_ITERATOR_TYPE = 4;
Fleur.XPathResult.ORDERED_NODE_ITERATOR_TYPE = 5;
Fleur.XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = 6;
Fleur.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7;
Fleur.XPathResult.ANY_UNORDERED_NODE_TYPE = 8;
Fleur.XPathResult.FIRST_ORDERED_NODE_TYPE = 9;
Object.defineProperties(Fleur.XPathResult.prototype, {
	numberValue: {
		get: function() {
			var jsNumber = Fleur.toJSNumber(this);
			if (jsNumber[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsNumber[1];
		}
	},
	stringValue: {
		get: function() {
			var jsString = Fleur.toJSString(this);
			if (jsString[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsString[1];
		}
	},
	booleanValue: {
		get: function() {
			var jsBoolean = Fleur.toJSBoolean(this);
			if (jsBoolean[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsBoolean[1];
		}
	},
	singleNodeValue: {
		get: function() {
			if (this._result && this._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
				var firstnode = this._result.childNodes[0];
				this._result = firstnode;
			}
			Fleur.Atomize(this);
			var jsString = Fleur.toJSString(this);
			if (jsString[0] === -1 || (this.resultType !== Fleur.XPathResult.ANY_TYPE && this.resultType !== Fleur.XPathResult.ANY_UNORDERED_NODE_TYPE && this.resultType !== Fleur.XPathResult.FIRST_ORDERED_NODE_TYPE)) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result && this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsString[1];
		}
	},
	mediatype: {
		get: function() {
			var opt = this.env.options ? this.env.options["http://www.w3.org/2010/xslt-xquery-serialization"] : null;
			if (opt && opt["media-type"]) {
				return opt["media-type"];
			}
			return ({
				xml: "application/xml",
				html: "text/html",
				json: "application/json",
				text: "text/plain"
			})[this.method];
		}
	},
	method: {
		get: function() {
			var opt = this.env.options ? this.env.options["http://www.w3.org/2010/xslt-xquery-serialization"] : null;
			if (opt && opt.method) {
				return opt.method;
			}
			if (!opt || !opt["media-type"]) {
				if (!this._result) {
					return "text";
				}
				var elt = this._result.documentElement || this._result;
				switch (elt.nodeType) {
					case Fleur.Node.ELEMENT_NODE:
						if (elt.nodeName === "html") {
							if (this._result.nodeType === Fleur.Node.DOCUMENT_NODE) {
								for (var i = 0, l = this._result.childNodes.length; i < l; i++) {
									if (this._result.childNodes[i].nodeType === Fleur.Node.PROCESSING_INSTRUCTION_NODE && this._result.childNodes[i].nodeName === "xml-stylesheet") {
										return "xml";
									}
								}
							}
							return "html";
						}
						return "xml";
					case Fleur.Node.MAP_NODE:
						return "json";
					default:
						return "text";
				}
			}
			switch (opt["media-type"]) {
				case "application/xml":
					return "xml";
				case "text/html":
					return "html";
				default:
					return "text";
			}
		}
	},
	indent: {
		get: function() {
			return false;
		}
	}
});
Fleur.XPathResult.prototype.evaluate = function(resolve, reject) {
	var ctx = {
		_curr: this.contextNode || this.document,
		env: this.env,
		xpresult: this
	};
	ctx.env.globalvarresolver = ctx.env.varresolver || new Fleur.varMgr();
	ctx.env.varresolver = new Fleur.varMgr([], ctx.env.globalvarresolver);
	var src;
	try {
		src = Fleur.XPathEvaluator._xq2js(this.expression);
	} catch (e) {
		ctx.xpresult._result = Fleur.error(ctx, "XPST0003", e.message);
		reject(ctx.xpresult);
		return;
	}
	try {
		var compiled = eval(src);
		Fleur.XQueryEngine[compiled[0]](ctx, compiled[1], function(n) {
			ctx.xpresult._result = n;
			ctx.xpresult.env = ctx.env;
			if (n.schemaTypeInfo === Fleur.Type_error) {
				reject(ctx.xpresult);
			} else {
				resolve(ctx.xpresult);
			}
		});
	} catch (e) {
		ctx.xpresult._result = Fleur.error(ctx, "XPST0003", e.message);
		reject(ctx.xpresult);
	}
};
Fleur.XPathResult.prototype.iterateNext = function() {
	if (this.resultType !== Fleur.XPathResult.ANY_TYPE && this.resultType !== Fleur.XPathResult.UNORDERED_NODE_ITERATOR_TYPE && this.resultType !== Fleur.XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
		throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result && this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
	}
	if (this._result === Fleur.EmptySequence) {
		return null;
	}
	if (this._result.schemaTypeInfo === Fleur.Type_error) {
		throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.nodeName);
	}
	if (this._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		if (this._index === 0) {
			this._index++;
			return this._result;
		}
		return null;
	}
	if (this._index >= this._result.childNodes.length) {
		return null;
	}
	return this._result.childNodes[this._index++];
};
Fleur.XPathResult.prototype.serialize = function() {
	var ser = new Fleur.Serializer();
	return ser.serializeToString(this._result, this.mediatype, this.indent);
};
Fleur.XPathResult.prototype.toXQuery = function(indent) {
	if (this._result === Fleur.EmptySequence) {
		return "()";
	}
	return Fleur.Serializer._serializeNodeToXQuery(this._result, indent, "");
};
Fleur.XPathResult.prototype.toArray = function() {
	if (this._result === Fleur.EmptySequence) {
		return [];
	}
	if (this._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		return [this._result];
	}
	return this._result.childNodes;
};
Fleur.XPathResult.prototype.then = function(resolve, reject) {
	this.evaluate(resolve, reject);
};
Fleur.varMgr = function(vars, previous) {
	this.vars = vars || [];
	this.previous = previous;
	this.globals = 0;
};
Fleur.varMgr.prototype.get = function(ctx, vuri, vname) {
	var i;
	var r = this;
	do {
		i = r.vars.length;
		while (i) {
			i--;
			if (r.vars[i].vuri === vuri && r.vars[i].vname === vname) {
				return r.vars[i].value;
			}
		}
		r = r.previous;
	} while (r);
	return Fleur.error(ctx, "XPST0008");
};
Fleur.varMgr.prototype.set = function(ctx, vuri, vname, value) {
	this.vars.push({vuri: vuri, vname: vname, value: value});
	return value;
};
Fleur.encchars = new Fleur.varMgr([
	{vuri: "http://w3.org/encoded/characters", vname: "quot", value: new Fleur.Text("\x22")},
	{vuri: "http://w3.org/encoded/characters", vname: "amp", value: new Fleur.Text("\x26")},
	{vuri: "http://w3.org/encoded/characters", vname: "apos", value: new Fleur.Text("\x27")},
	{vuri: "http://w3.org/encoded/characters", vname: "lt", value: new Fleur.Text("\x3c")},
	{vuri: "http://w3.org/encoded/characters", vname: "gt", value: new Fleur.Text("\x3e")},
	{vuri: "http://w3.org/encoded/characters", vname: "nbsp", value: new Fleur.Text("\xa0")},
	{vuri: "http://w3.org/encoded/characters", vname: "iexcl", value: new Fleur.Text("\xa1")},
	{vuri: "http://w3.org/encoded/characters", vname: "cent", value: new Fleur.Text("\xa2")},
	{vuri: "http://w3.org/encoded/characters", vname: "pound", value: new Fleur.Text("\xa3")},
	{vuri: "http://w3.org/encoded/characters", vname: "curren", value: new Fleur.Text("\xa4")},
	{vuri: "http://w3.org/encoded/characters", vname: "yen", value: new Fleur.Text("\xa5")},
	{vuri: "http://w3.org/encoded/characters", vname: "brvbar", value: new Fleur.Text("\xa6")},
	{vuri: "http://w3.org/encoded/characters", vname: "sect", value: new Fleur.Text("\xa7")},
	{vuri: "http://w3.org/encoded/characters", vname: "uml", value: new Fleur.Text("\xa8")},
	{vuri: "http://w3.org/encoded/characters", vname: "copy", value: new Fleur.Text("\xa9")},
	{vuri: "http://w3.org/encoded/characters", vname: "ordf", value: new Fleur.Text("\xaa")},
	{vuri: "http://w3.org/encoded/characters", vname: "laquo", value: new Fleur.Text("\xab")},
	{vuri: "http://w3.org/encoded/characters", vname: "not", value: new Fleur.Text("\xac")},
	{vuri: "http://w3.org/encoded/characters", vname: "shy", value: new Fleur.Text("\xad")},
	{vuri: "http://w3.org/encoded/characters", vname: "reg", value: new Fleur.Text("\xae")},
	{vuri: "http://w3.org/encoded/characters", vname: "macr", value: new Fleur.Text("\xaf")},
	{vuri: "http://w3.org/encoded/characters", vname: "deg", value: new Fleur.Text("\xb0")},
	{vuri: "http://w3.org/encoded/characters", vname: "plusmn", value: new Fleur.Text("\xb1")},
	{vuri: "http://w3.org/encoded/characters", vname: "sup2", value: new Fleur.Text("\xb2")},
	{vuri: "http://w3.org/encoded/characters", vname: "sup3", value: new Fleur.Text("\xb3")},
	{vuri: "http://w3.org/encoded/characters", vname: "acute", value: new Fleur.Text("\xb4")},
	{vuri: "http://w3.org/encoded/characters", vname: "micro", value: new Fleur.Text("\xb5")},
	{vuri: "http://w3.org/encoded/characters", vname: "para", value: new Fleur.Text("\xb6")},
	{vuri: "http://w3.org/encoded/characters", vname: "middot", value: new Fleur.Text("\xb7")},
	{vuri: "http://w3.org/encoded/characters", vname: "cedil", value: new Fleur.Text("\xb8")},
	{vuri: "http://w3.org/encoded/characters", vname: "sup1", value: new Fleur.Text("\xb9")},
	{vuri: "http://w3.org/encoded/characters", vname: "ordm", value: new Fleur.Text("\xba")},
	{vuri: "http://w3.org/encoded/characters", vname: "raquo", value: new Fleur.Text("\xbb")},
	{vuri: "http://w3.org/encoded/characters", vname: "frac14", value: new Fleur.Text("\xbc")},
	{vuri: "http://w3.org/encoded/characters", vname: "frac12", value: new Fleur.Text("\xbd")},
	{vuri: "http://w3.org/encoded/characters", vname: "frac34", value: new Fleur.Text("\xbe")},
	{vuri: "http://w3.org/encoded/characters", vname: "iquest", value: new Fleur.Text("\xbf")},
	{vuri: "http://w3.org/encoded/characters", vname: "Agrave", value: new Fleur.Text("\xc0")},
	{vuri: "http://w3.org/encoded/characters", vname: "Aacute", value: new Fleur.Text("\xc1")},
	{vuri: "http://w3.org/encoded/characters", vname: "Acirc", value: new Fleur.Text("\xc2")},
	{vuri: "http://w3.org/encoded/characters", vname: "Atilde", value: new Fleur.Text("\xc3")},
	{vuri: "http://w3.org/encoded/characters", vname: "Auml", value: new Fleur.Text("\xc4")},
	{vuri: "http://w3.org/encoded/characters", vname: "Aring", value: new Fleur.Text("\xc5")},
	{vuri: "http://w3.org/encoded/characters", vname: "AElig", value: new Fleur.Text("\xc6")},
	{vuri: "http://w3.org/encoded/characters", vname: "Ccedil", value: new Fleur.Text("\xc7")},
	{vuri: "http://w3.org/encoded/characters", vname: "Egrave", value: new Fleur.Text("\xc8")},
	{vuri: "http://w3.org/encoded/characters", vname: "Eacute", value: new Fleur.Text("\xc9")},
	{vuri: "http://w3.org/encoded/characters", vname: "Ecirc", value: new Fleur.Text("\xca")},
	{vuri: "http://w3.org/encoded/characters", vname: "Euml", value: new Fleur.Text("\xcb")},
	{vuri: "http://w3.org/encoded/characters", vname: "Igrave", value: new Fleur.Text("\xcc")},
	{vuri: "http://w3.org/encoded/characters", vname: "Iacute", value: new Fleur.Text("\xcd")},
	{vuri: "http://w3.org/encoded/characters", vname: "Icirc", value: new Fleur.Text("\xce")},
	{vuri: "http://w3.org/encoded/characters", vname: "Iuml", value: new Fleur.Text("\xcf")},
	{vuri: "http://w3.org/encoded/characters", vname: "ETH", value: new Fleur.Text("\xd0")},
	{vuri: "http://w3.org/encoded/characters", vname: "Ntilde", value: new Fleur.Text("\xd1")},
	{vuri: "http://w3.org/encoded/characters", vname: "Ograve", value: new Fleur.Text("\xd2")},
	{vuri: "http://w3.org/encoded/characters", vname: "Oacute", value: new Fleur.Text("\xd3")},
	{vuri: "http://w3.org/encoded/characters", vname: "Ocirc", value: new Fleur.Text("\xd4")},
	{vuri: "http://w3.org/encoded/characters", vname: "Otilde", value: new Fleur.Text("\xd5")},
	{vuri: "http://w3.org/encoded/characters", vname: "Ouml", value: new Fleur.Text("\xd6")},
	{vuri: "http://w3.org/encoded/characters", vname: "times", value: new Fleur.Text("\xd7")},
	{vuri: "http://w3.org/encoded/characters", vname: "Oslash", value: new Fleur.Text("\xd8")},
	{vuri: "http://w3.org/encoded/characters", vname: "Ugrave", value: new Fleur.Text("\xd9")},
	{vuri: "http://w3.org/encoded/characters", vname: "Uacute", value: new Fleur.Text("\xda")},
	{vuri: "http://w3.org/encoded/characters", vname: "Ucirc", value: new Fleur.Text("\xdb")},
	{vuri: "http://w3.org/encoded/characters", vname: "Uuml", value: new Fleur.Text("\xdc")},
	{vuri: "http://w3.org/encoded/characters", vname: "Yacute", value: new Fleur.Text("\xdd")},
	{vuri: "http://w3.org/encoded/characters", vname: "THORN", value: new Fleur.Text("\xde")},
	{vuri: "http://w3.org/encoded/characters", vname: "szlig", value: new Fleur.Text("\xdf")},
	{vuri: "http://w3.org/encoded/characters", vname: "agrave", value: new Fleur.Text("\xe0")},
	{vuri: "http://w3.org/encoded/characters", vname: "aacute", value: new Fleur.Text("\xe1")},
	{vuri: "http://w3.org/encoded/characters", vname: "acirc", value: new Fleur.Text("\xe2")},
	{vuri: "http://w3.org/encoded/characters", vname: "atilde", value: new Fleur.Text("\xe3")},
	{vuri: "http://w3.org/encoded/characters", vname: "auml", value: new Fleur.Text("\xe4")},
	{vuri: "http://w3.org/encoded/characters", vname: "aring", value: new Fleur.Text("\xe5")},
	{vuri: "http://w3.org/encoded/characters", vname: "aelig", value: new Fleur.Text("\xe6")},
	{vuri: "http://w3.org/encoded/characters", vname: "ccedil", value: new Fleur.Text("\xe7")},
	{vuri: "http://w3.org/encoded/characters", vname: "egrave", value: new Fleur.Text("\xe8")},
	{vuri: "http://w3.org/encoded/characters", vname: "eacute", value: new Fleur.Text("\xe9")},
	{vuri: "http://w3.org/encoded/characters", vname: "ecirc", value: new Fleur.Text("\xea")},
	{vuri: "http://w3.org/encoded/characters", vname: "euml", value: new Fleur.Text("\xeb")},
	{vuri: "http://w3.org/encoded/characters", vname: "igrave", value: new Fleur.Text("\xec")},
	{vuri: "http://w3.org/encoded/characters", vname: "iacute", value: new Fleur.Text("\xed")},
	{vuri: "http://w3.org/encoded/characters", vname: "icirc", value: new Fleur.Text("\xee")},
	{vuri: "http://w3.org/encoded/characters", vname: "iuml", value: new Fleur.Text("\xef")},
	{vuri: "http://w3.org/encoded/characters", vname: "eth", value: new Fleur.Text("\xf0")},
	{vuri: "http://w3.org/encoded/characters", vname: "ntilde", value: new Fleur.Text("\xf1")},
	{vuri: "http://w3.org/encoded/characters", vname: "ograve", value: new Fleur.Text("\xf2")},
	{vuri: "http://w3.org/encoded/characters", vname: "oacute", value: new Fleur.Text("\xf3")},
	{vuri: "http://w3.org/encoded/characters", vname: "ocirc", value: new Fleur.Text("\xf4")},
	{vuri: "http://w3.org/encoded/characters", vname: "otilde", value: new Fleur.Text("\xf5")},
	{vuri: "http://w3.org/encoded/characters", vname: "ouml", value: new Fleur.Text("\xf6")},
	{vuri: "http://w3.org/encoded/characters", vname: "divide", value: new Fleur.Text("\xf7")},
	{vuri: "http://w3.org/encoded/characters", vname: "oslash", value: new Fleur.Text("\xf8")},
	{vuri: "http://w3.org/encoded/characters", vname: "ugrave", value: new Fleur.Text("\xf9")},
	{vuri: "http://w3.org/encoded/characters", vname: "uacute", value: new Fleur.Text("\xfa")},
	{vuri: "http://w3.org/encoded/characters", vname: "ucirc", value: new Fleur.Text("\xfb")},
	{vuri: "http://w3.org/encoded/characters", vname: "uuml", value: new Fleur.Text("\xfc")},
	{vuri: "http://w3.org/encoded/characters", vname: "yacute", value: new Fleur.Text("\xfd")},
	{vuri: "http://w3.org/encoded/characters", vname: "thorn", value: new Fleur.Text("\xfe")},
	{vuri: "http://w3.org/encoded/characters", vname: "yuml", value: new Fleur.Text("\xff")},
	{vuri: "http://w3.org/encoded/characters", vname: "OElig", value: new Fleur.Text("\u0152")},
	{vuri: "http://w3.org/encoded/characters", vname: "oelig", value: new Fleur.Text("\u0153")},
	{vuri: "http://w3.org/encoded/characters", vname: "Scaron", value: new Fleur.Text("\u0160")},
	{vuri: "http://w3.org/encoded/characters", vname: "scaron", value: new Fleur.Text("\u0161")},
	{vuri: "http://w3.org/encoded/characters", vname: "Yuml", value: new Fleur.Text("\u0178")},
	{vuri: "http://w3.org/encoded/characters", vname: "fnof", value: new Fleur.Text("\u0192")},
	{vuri: "http://w3.org/encoded/characters", vname: "circ", value: new Fleur.Text("\u02c6")},
	{vuri: "http://w3.org/encoded/characters", vname: "tilde", value: new Fleur.Text("\u02dc")},
	{vuri: "http://w3.org/encoded/characters", vname: "Alpha", value: new Fleur.Text("\u0391")},
	{vuri: "http://w3.org/encoded/characters", vname: "Beta", value: new Fleur.Text("\u0392")},
	{vuri: "http://w3.org/encoded/characters", vname: "Gamma", value: new Fleur.Text("\u0393")},
	{vuri: "http://w3.org/encoded/characters", vname: "Delta", value: new Fleur.Text("\u0394")},
	{vuri: "http://w3.org/encoded/characters", vname: "Epsilon", value: new Fleur.Text("\u0395")},
	{vuri: "http://w3.org/encoded/characters", vname: "Zeta", value: new Fleur.Text("\u0396")},
	{vuri: "http://w3.org/encoded/characters", vname: "Eta", value: new Fleur.Text("\u0397")},
	{vuri: "http://w3.org/encoded/characters", vname: "Theta", value: new Fleur.Text("\u0398")},
	{vuri: "http://w3.org/encoded/characters", vname: "Iota", value: new Fleur.Text("\u0399")},
	{vuri: "http://w3.org/encoded/characters", vname: "Kappa", value: new Fleur.Text("\u039a")},
	{vuri: "http://w3.org/encoded/characters", vname: "Lambda", value: new Fleur.Text("\u039b")},
	{vuri: "http://w3.org/encoded/characters", vname: "Mu", value: new Fleur.Text("\u039c")},
	{vuri: "http://w3.org/encoded/characters", vname: "Nu", value: new Fleur.Text("\u039d")},
	{vuri: "http://w3.org/encoded/characters", vname: "Xi", value: new Fleur.Text("\u039e")},
	{vuri: "http://w3.org/encoded/characters", vname: "Omicron", value: new Fleur.Text("\u039f")},
	{vuri: "http://w3.org/encoded/characters", vname: "Pi", value: new Fleur.Text("\u03a0")},
	{vuri: "http://w3.org/encoded/characters", vname: "Rho", value: new Fleur.Text("\u03a1")},
	{vuri: "http://w3.org/encoded/characters", vname: "Sigma", value: new Fleur.Text("\u03a3")},
	{vuri: "http://w3.org/encoded/characters", vname: "Tau", value: new Fleur.Text("\u03a4")},
	{vuri: "http://w3.org/encoded/characters", vname: "Upsilon", value: new Fleur.Text("\u03a5")},
	{vuri: "http://w3.org/encoded/characters", vname: "Phi", value: new Fleur.Text("\u03a6")},
	{vuri: "http://w3.org/encoded/characters", vname: "Chi", value: new Fleur.Text("\u03a7")},
	{vuri: "http://w3.org/encoded/characters", vname: "Psi", value: new Fleur.Text("\u03a8")},
	{vuri: "http://w3.org/encoded/characters", vname: "Omega", value: new Fleur.Text("\u03a9")},
	{vuri: "http://w3.org/encoded/characters", vname: "alpha", value: new Fleur.Text("\u03b1")},
	{vuri: "http://w3.org/encoded/characters", vname: "beta", value: new Fleur.Text("\u03b2")},
	{vuri: "http://w3.org/encoded/characters", vname: "gamma", value: new Fleur.Text("\u03b3")},
	{vuri: "http://w3.org/encoded/characters", vname: "delta", value: new Fleur.Text("\u03b4")},
	{vuri: "http://w3.org/encoded/characters", vname: "epsilon", value: new Fleur.Text("\u03b5")},
	{vuri: "http://w3.org/encoded/characters", vname: "zeta", value: new Fleur.Text("\u03b6")},
	{vuri: "http://w3.org/encoded/characters", vname: "eta", value: new Fleur.Text("\u03b7")},
	{vuri: "http://w3.org/encoded/characters", vname: "theta", value: new Fleur.Text("\u03b8")},
	{vuri: "http://w3.org/encoded/characters", vname: "iota", value: new Fleur.Text("\u03b9")},
	{vuri: "http://w3.org/encoded/characters", vname: "kappa", value: new Fleur.Text("\u03ba")},
	{vuri: "http://w3.org/encoded/characters", vname: "lambda", value: new Fleur.Text("\u03bb")},
	{vuri: "http://w3.org/encoded/characters", vname: "mu", value: new Fleur.Text("\u03bc")},
	{vuri: "http://w3.org/encoded/characters", vname: "nu", value: new Fleur.Text("\u03bd")},
	{vuri: "http://w3.org/encoded/characters", vname: "xi", value: new Fleur.Text("\u03be")},
	{vuri: "http://w3.org/encoded/characters", vname: "omicron", value: new Fleur.Text("\u03bf")},
	{vuri: "http://w3.org/encoded/characters", vname: "pi", value: new Fleur.Text("\u03c0")},
	{vuri: "http://w3.org/encoded/characters", vname: "rho", value: new Fleur.Text("\u03c1")},
	{vuri: "http://w3.org/encoded/characters", vname: "sigmaf", value: new Fleur.Text("\u03c2")},
	{vuri: "http://w3.org/encoded/characters", vname: "sigma", value: new Fleur.Text("\u03c3")},
	{vuri: "http://w3.org/encoded/characters", vname: "tau", value: new Fleur.Text("\u03c4")},
	{vuri: "http://w3.org/encoded/characters", vname: "upsilon", value: new Fleur.Text("\u03c5")},
	{vuri: "http://w3.org/encoded/characters", vname: "phi", value: new Fleur.Text("\u03c6")},
	{vuri: "http://w3.org/encoded/characters", vname: "chi", value: new Fleur.Text("\u03c7")},
	{vuri: "http://w3.org/encoded/characters", vname: "psi", value: new Fleur.Text("\u03c8")},
	{vuri: "http://w3.org/encoded/characters", vname: "omega", value: new Fleur.Text("\u03c9")},
	{vuri: "http://w3.org/encoded/characters", vname: "thetasym", value: new Fleur.Text("\u03d1")},
	{vuri: "http://w3.org/encoded/characters", vname: "upsih", value: new Fleur.Text("\u03d2")},
	{vuri: "http://w3.org/encoded/characters", vname: "piv", value: new Fleur.Text("\u03d6")},
	{vuri: "http://w3.org/encoded/characters", vname: "ensp", value: new Fleur.Text("\u2002")},
	{vuri: "http://w3.org/encoded/characters", vname: "emsp", value: new Fleur.Text("\u2003")},
	{vuri: "http://w3.org/encoded/characters", vname: "thinsp", value: new Fleur.Text("\u2009")},
	{vuri: "http://w3.org/encoded/characters", vname: "zwnj", value: new Fleur.Text("\u200c")},
	{vuri: "http://w3.org/encoded/characters", vname: "zwj", value: new Fleur.Text("\u200d")},
	{vuri: "http://w3.org/encoded/characters", vname: "lrm", value: new Fleur.Text("\u200e")},
	{vuri: "http://w3.org/encoded/characters", vname: "rlm", value: new Fleur.Text("\u200f")},
	{vuri: "http://w3.org/encoded/characters", vname: "ndash", value: new Fleur.Text("\u2013")},
	{vuri: "http://w3.org/encoded/characters", vname: "mdash", value: new Fleur.Text("\u2014")},
	{vuri: "http://w3.org/encoded/characters", vname: "lsquo", value: new Fleur.Text("\u2018")},
	{vuri: "http://w3.org/encoded/characters", vname: "rsquo", value: new Fleur.Text("\u2019")},
	{vuri: "http://w3.org/encoded/characters", vname: "sbquo", value: new Fleur.Text("\u201a")},
	{vuri: "http://w3.org/encoded/characters", vname: "ldquo", value: new Fleur.Text("\u201c")},
	{vuri: "http://w3.org/encoded/characters", vname: "rdquo", value: new Fleur.Text("\u201d")},
	{vuri: "http://w3.org/encoded/characters", vname: "bdquo", value: new Fleur.Text("\u201e")},
	{vuri: "http://w3.org/encoded/characters", vname: "dagger", value: new Fleur.Text("\u2020")},
	{vuri: "http://w3.org/encoded/characters", vname: "Dagger", value: new Fleur.Text("\u2021")},
	{vuri: "http://w3.org/encoded/characters", vname: "bull", value: new Fleur.Text("\u2022")},
	{vuri: "http://w3.org/encoded/characters", vname: "hellip", value: new Fleur.Text("\u2026")},
	{vuri: "http://w3.org/encoded/characters", vname: "permil", value: new Fleur.Text("\u2030")},
	{vuri: "http://w3.org/encoded/characters", vname: "prime", value: new Fleur.Text("\u2032")},
	{vuri: "http://w3.org/encoded/characters", vname: "Prime", value: new Fleur.Text("\u2033")},
	{vuri: "http://w3.org/encoded/characters", vname: "lsaquo", value: new Fleur.Text("\u2039")},
	{vuri: "http://w3.org/encoded/characters", vname: "rsaquo", value: new Fleur.Text("\u203a")},
	{vuri: "http://w3.org/encoded/characters", vname: "oline", value: new Fleur.Text("\u203e")},
	{vuri: "http://w3.org/encoded/characters", vname: "frasl", value: new Fleur.Text("\u2044")},
	{vuri: "http://w3.org/encoded/characters", vname: "euro", value: new Fleur.Text("\u20ac")},
	{vuri: "http://w3.org/encoded/characters", vname: "image", value: new Fleur.Text("\u2111")},
	{vuri: "http://w3.org/encoded/characters", vname: "weierp", value: new Fleur.Text("\u2118")},
	{vuri: "http://w3.org/encoded/characters", vname: "real", value: new Fleur.Text("\u211c")},
	{vuri: "http://w3.org/encoded/characters", vname: "trade", value: new Fleur.Text("\u2122")},
	{vuri: "http://w3.org/encoded/characters", vname: "alefsym", value: new Fleur.Text("\u2135")},
	{vuri: "http://w3.org/encoded/characters", vname: "larr", value: new Fleur.Text("\u2190")},
	{vuri: "http://w3.org/encoded/characters", vname: "uarr", value: new Fleur.Text("\u2191")},
	{vuri: "http://w3.org/encoded/characters", vname: "rarr", value: new Fleur.Text("\u2192")},
	{vuri: "http://w3.org/encoded/characters", vname: "darr", value: new Fleur.Text("\u2193")},
	{vuri: "http://w3.org/encoded/characters", vname: "harr", value: new Fleur.Text("\u2194")},
	{vuri: "http://w3.org/encoded/characters", vname: "crarr", value: new Fleur.Text("\u21b5")},
	{vuri: "http://w3.org/encoded/characters", vname: "lArr", value: new Fleur.Text("\u21d0")},
	{vuri: "http://w3.org/encoded/characters", vname: "uArr", value: new Fleur.Text("\u21d1")},
	{vuri: "http://w3.org/encoded/characters", vname: "rArr", value: new Fleur.Text("\u21d2")},
	{vuri: "http://w3.org/encoded/characters", vname: "dArr", value: new Fleur.Text("\u21d3")},
	{vuri: "http://w3.org/encoded/characters", vname: "hArr", value: new Fleur.Text("\u21d4")},
	{vuri: "http://w3.org/encoded/characters", vname: "forall", value: new Fleur.Text("\u2200")},
	{vuri: "http://w3.org/encoded/characters", vname: "part", value: new Fleur.Text("\u2202")},
	{vuri: "http://w3.org/encoded/characters", vname: "exist", value: new Fleur.Text("\u2203")},
	{vuri: "http://w3.org/encoded/characters", vname: "empty", value: new Fleur.Text("\u2205")},
	{vuri: "http://w3.org/encoded/characters", vname: "nabla", value: new Fleur.Text("\u2207")},
	{vuri: "http://w3.org/encoded/characters", vname: "isin", value: new Fleur.Text("\u2208")},
	{vuri: "http://w3.org/encoded/characters", vname: "notin", value: new Fleur.Text("\u2209")},
	{vuri: "http://w3.org/encoded/characters", vname: "ni", value: new Fleur.Text("\u220b")},
	{vuri: "http://w3.org/encoded/characters", vname: "prod", value: new Fleur.Text("\u220f")},
	{vuri: "http://w3.org/encoded/characters", vname: "sum", value: new Fleur.Text("\u2211")},
	{vuri: "http://w3.org/encoded/characters", vname: "minus", value: new Fleur.Text("\u2212")},
	{vuri: "http://w3.org/encoded/characters", vname: "lowast", value: new Fleur.Text("\u2217")},
	{vuri: "http://w3.org/encoded/characters", vname: "radic", value: new Fleur.Text("\u221a")},
	{vuri: "http://w3.org/encoded/characters", vname: "prop", value: new Fleur.Text("\u221d")},
	{vuri: "http://w3.org/encoded/characters", vname: "infin", value: new Fleur.Text("\u221e")},
	{vuri: "http://w3.org/encoded/characters", vname: "ang", value: new Fleur.Text("\u2220")},
	{vuri: "http://w3.org/encoded/characters", vname: "and", value: new Fleur.Text("\u2227")},
	{vuri: "http://w3.org/encoded/characters", vname: "or", value: new Fleur.Text("\u2228")},
	{vuri: "http://w3.org/encoded/characters", vname: "cap", value: new Fleur.Text("\u2229")},
	{vuri: "http://w3.org/encoded/characters", vname: "cup", value: new Fleur.Text("\u222a")},
	{vuri: "http://w3.org/encoded/characters", vname: "int", value: new Fleur.Text("\u222b")},
	{vuri: "http://w3.org/encoded/characters", vname: "there4", value: new Fleur.Text("\u2234")},
	{vuri: "http://w3.org/encoded/characters", vname: "sim", value: new Fleur.Text("\u223c")},
	{vuri: "http://w3.org/encoded/characters", vname: "cong", value: new Fleur.Text("\u2245")},
	{vuri: "http://w3.org/encoded/characters", vname: "asymp", value: new Fleur.Text("\u2248")},
	{vuri: "http://w3.org/encoded/characters", vname: "ne", value: new Fleur.Text("\u2260")},
	{vuri: "http://w3.org/encoded/characters", vname: "equiv", value: new Fleur.Text("\u2261")},
	{vuri: "http://w3.org/encoded/characters", vname: "le", value: new Fleur.Text("\u2264")},
	{vuri: "http://w3.org/encoded/characters", vname: "ge", value: new Fleur.Text("\u2265")},
	{vuri: "http://w3.org/encoded/characters", vname: "sub", value: new Fleur.Text("\u2282")},
	{vuri: "http://w3.org/encoded/characters", vname: "sup", value: new Fleur.Text("\u2283")},
	{vuri: "http://w3.org/encoded/characters", vname: "nsub", value: new Fleur.Text("\u2284")},
	{vuri: "http://w3.org/encoded/characters", vname: "sube", value: new Fleur.Text("\u2286")},
	{vuri: "http://w3.org/encoded/characters", vname: "supe", value: new Fleur.Text("\u2287")},
	{vuri: "http://w3.org/encoded/characters", vname: "oplus", value: new Fleur.Text("\u2295")},
	{vuri: "http://w3.org/encoded/characters", vname: "otimes", value: new Fleur.Text("\u2297")},
	{vuri: "http://w3.org/encoded/characters", vname: "perp", value: new Fleur.Text("\u22a5")},
	{vuri: "http://w3.org/encoded/characters", vname: "sdot", value: new Fleur.Text("\u22c5")},
	{vuri: "http://w3.org/encoded/characters", vname: "lceil", value: new Fleur.Text("\u2308")},
	{vuri: "http://w3.org/encoded/characters", vname: "rceil", value: new Fleur.Text("\u2309")},
	{vuri: "http://w3.org/encoded/characters", vname: "lfloor", value: new Fleur.Text("\u230a;")},
	{vuri: "http://w3.org/encoded/characters", vname: "rfloor", value: new Fleur.Text("\u230b")},
	{vuri: "http://w3.org/encoded/characters", vname: "lang", value: new Fleur.Text("\u2329")},
	{vuri: "http://w3.org/encoded/characters", vname: "rang", value: new Fleur.Text("\u232a")},
	{vuri: "http://w3.org/encoded/characters", vname: "loz", value: new Fleur.Text("\u25ca")},
	{vuri: "http://w3.org/encoded/characters", vname: "spades", value: new Fleur.Text("\u2660")},
	{vuri: "http://w3.org/encoded/characters", vname: "clubs", value: new Fleur.Text("\u2663")},
	{vuri: "http://w3.org/encoded/characters", vname: "hearts", value: new Fleur.Text("\u2665")},
	{vuri: "http://w3.org/encoded/characters", vname: "diams", value: new Fleur.Text("\u2666")}
]);
Fleur.Xlength = 0;
Fleur.XQueryXNames = [["http://www.w3.org/2005/XQueryX", "http://www.w3.org/2000/xmlns/", "http://www.w3.org/2001/XMLSchema-instance", "http://www.w3.org/2007/xquery-update-10"], []];
Fleur.XQueryX = {};
Fleur.XQueryXNames[1][Fleur.XQueryX.NCName = Fleur.Xlength++] = [1, 0, "xqx:NCName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.QName = Fleur.Xlength++] = [1, 0, "xqx:QName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.URIExpr = Fleur.Xlength++] = [1, 0, "xqx:URIExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.Wildcard = Fleur.Xlength++] = [1, 0, "xqx:Wildcard"];
Fleur.XQueryXNames[1][Fleur.XQueryX.addOp = Fleur.Xlength++] = [1, 0, "xqx:addOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.allowingEmpty = Fleur.Xlength++] = [1, 0, "xqx:allowingEmpty"];
Fleur.XQueryXNames[1][Fleur.XQueryX.andOp = Fleur.Xlength++] = [1, 0, "xqx:andOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.annotation = Fleur.Xlength++] = [1, 0, "xqx:annotation"];
Fleur.XQueryXNames[1][Fleur.XQueryX.annotationName = Fleur.Xlength++] = [1, 0, "xqx:annotationName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.anyElementTest = Fleur.Xlength++] = [1, 0, "xqx:anyElementTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.anyFunctionTest = Fleur.Xlength++] = [1, 0, "xqx:anyFunctionTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.anyItemType = Fleur.Xlength++] = [1, 0, "xqx:anyItemType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.anyKindTest = Fleur.Xlength++] = [1, 0, "xqx:anyKindTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.argExpr = Fleur.Xlength++] = [1, 0, "xqx:argExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.argumentPlaceholder = Fleur.Xlength++] = [1, 0, "xqx:argumentPlaceholder"];
Fleur.XQueryXNames[1][Fleur.XQueryX.arguments = Fleur.Xlength++] = [1, 0, "xqx:arguments"];
Fleur.XQueryXNames[1][Fleur.XQueryX.arithmeticOp = Fleur.Xlength++] = [1, 0, "xqx:arithmeticOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.arrayTest = Fleur.Xlength++] = [1, 0, "xqx:arrayTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.atomicType = Fleur.Xlength++] = [1, 0, "xqx:atomicType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeConstructor = Fleur.Xlength++] = [1, 0, "xqx:attributeConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeList = Fleur.Xlength++] = [1, 0, "xqx:attributeList"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeName = Fleur.Xlength++] = [1, 0, "xqx:attributeName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeTest = Fleur.Xlength++] = [1, 0, "xqx:attributeTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeValue = Fleur.Xlength++] = [1, 0, "xqx:attributeValue"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeValueExpr = Fleur.Xlength++] = [1, 0, "xqx:attributeValueExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.baseUriDecl = Fleur.Xlength++] = [1, 0, "xqx:baseUriDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.bindingSequence = Fleur.Xlength++] = [1, 0, "xqx:bindingSequence"];
Fleur.XQueryXNames[1][Fleur.XQueryX.boundarySpaceDecl = Fleur.Xlength++] = [1, 0, "xqx:boundarySpaceDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.castExpr = Fleur.Xlength++] = [1, 0, "xqx:castExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.castableExpr = Fleur.Xlength++] = [1, 0, "xqx:castableExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.catchClause = Fleur.Xlength++] = [1, 0, "xqx:catchClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.catchErrorList = Fleur.Xlength++] = [1, 0, "xqx:catchErrorList"];
Fleur.XQueryXNames[1][Fleur.XQueryX.catchExpr = Fleur.Xlength++] = [1, 0, "xqx:catchExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.collation = Fleur.Xlength++] = [1, 0, "xqx:collation"];
Fleur.XQueryXNames[1][Fleur.XQueryX.commentTest = Fleur.Xlength++] = [1, 0, "xqx:commentTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.comparisonOp = Fleur.Xlength++] = [1, 0, "xqx:comparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedAttributeConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedAttributeConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedCommentConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedCommentConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedDocumentConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedDocumentConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedElementConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedElementConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedEntryConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedEntryConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedNamespaceConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedNamespaceConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedPIConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedPIConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedTextConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedTextConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.constantExpr = Fleur.Xlength++] = [1, 0, "xqx:constantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.constructionDecl = Fleur.Xlength++] = [1, 0, "xqx:constructionDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.constructorFunctionExpr = Fleur.Xlength++] = [1, 0, "xqx:constructorFunctionExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.contentExpr = Fleur.Xlength++] = [1, 0, "xqx:contentExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.contextItemDecl = Fleur.Xlength++] = [1, 0, "xqx:contextItemDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.contextItemExpr = Fleur.Xlength++] = [1, 0, "xqx:contextItemExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.copyNamespacesDecl = Fleur.Xlength++] = [1, 0, "xqx:copyNamespacesDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.countClause = Fleur.Xlength++] = [1, 0, "xqx:countClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.currentItem = Fleur.Xlength++] = [1, 0, "xqx:currentItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalConstantExpr = Fleur.Xlength++] = [1, 0, "xqx:decimalConstantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatDecl = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatName = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatParam = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatParam"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatParamName = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatParamName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatParamValue = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatParamValue"];
Fleur.XQueryXNames[1][Fleur.XQueryX.defaultCollationDecl = Fleur.Xlength++] = [1, 0, "xqx:defaultCollationDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.defaultElementNamespace = Fleur.Xlength++] = [1, 0, "xqx:defaultElementNamespace"];
Fleur.XQueryXNames[1][Fleur.XQueryX.defaultNamespaceCategory = Fleur.Xlength++] = [1, 0, "xqx:defaultNamespaceCategory"];
Fleur.XQueryXNames[1][Fleur.XQueryX.defaultNamespaceDecl = Fleur.Xlength++] = [1, 0, "xqx:defaultNamespaceDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.divOp = Fleur.Xlength++] = [1, 0, "xqx:divOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.documentTest = Fleur.Xlength++] = [1, 0, "xqx:documentTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.doubleConstantExpr = Fleur.Xlength++] = [1, 0, "xqx:doubleConstantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.dynamicFunctionInvocationExpr = Fleur.Xlength++] = [1, 0, "xqx:dynamicFunctionInvocationExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elementConstructor = Fleur.Xlength++] = [1, 0, "xqx:elementConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elementContent = Fleur.Xlength++] = [1, 0, "xqx:elementContent"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elementName = Fleur.Xlength++] = [1, 0, "xqx:elementName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elementTest = Fleur.Xlength++] = [1, 0, "xqx:elementTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elseClause = Fleur.Xlength++] = [1, 0, "xqx:elseClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.emptyOrderingDecl = Fleur.Xlength++] = [1, 0, "xqx:emptyOrderingDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.emptyOrderingMode = Fleur.Xlength++] = [1, 0, "xqx:emptyOrderingMode"];
Fleur.XQueryXNames[1][Fleur.XQueryX.encoding = Fleur.Xlength++] = [1, 0, "xqx:encoding"];
Fleur.XQueryXNames[1][Fleur.XQueryX.endExpr = Fleur.Xlength++] = [1, 0, "xqx:endExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.entryTest = Fleur.Xlength++] = [1, 0, "xqx:entryTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.eqOp = Fleur.Xlength++] = [1, 0, "xqx:eqOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.equalOp = Fleur.Xlength++] = [1, 0, "xqx:equalOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.exceptOp = Fleur.Xlength++] = [1, 0, "xqx:exceptOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.expr = Fleur.Xlength++] = [1, 0, "xqx:expr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.extensionExpr = Fleur.Xlength++] = [1, 0, "xqx:extensionExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.external = Fleur.Xlength++] = [1, 0, "xqx:external"];
Fleur.XQueryXNames[1][Fleur.XQueryX.externalDefinition = Fleur.Xlength++] = [1, 0, "xqx:externalDefinition"];
Fleur.XQueryXNames[1][Fleur.XQueryX.filterExpr = Fleur.Xlength++] = [1, 0, "xqx:filterExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.firstOperand = Fleur.Xlength++] = [1, 0, "xqx:firstOperand"];
Fleur.XQueryXNames[1][Fleur.XQueryX.flworExpr = Fleur.Xlength++] = [1, 0, "xqx:flworExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.forClause = Fleur.Xlength++] = [1, 0, "xqx:forClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.forClauseItem = Fleur.Xlength++] = [1, 0, "xqx:forClauseItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.forExpr = Fleur.Xlength++] = [1, 0, "xqx:forExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.forLetClauseItemExtensions = Fleur.Xlength++] = [1, 0, "xqx:forLetClauseItemExtensions"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionBody = Fleur.Xlength++] = [1, 0, "xqx:functionBody"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionCallExpr = Fleur.Xlength++] = [1, 0, "xqx:functionCallExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionDecl = Fleur.Xlength++] = [1, 0, "xqx:functionDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionItem = Fleur.Xlength++] = [1, 0, "xqx:functionItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionName = Fleur.Xlength++] = [1, 0, "xqx:functionName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.geOp = Fleur.Xlength++] = [1, 0, "xqx:geOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.generalComparisonOp = Fleur.Xlength++] = [1, 0, "xqx:generalComparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.greaterThanOp = Fleur.Xlength++] = [1, 0, "xqx:greaterThanOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.greaterThanOrEqualOp = Fleur.Xlength++] = [1, 0, "xqx:greaterThanOrEqualOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.groupByClause = Fleur.Xlength++] = [1, 0, "xqx:groupByClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.groupVarInitialize = Fleur.Xlength++] = [1, 0, "xqx:groupVarInitialize"];
Fleur.XQueryXNames[1][Fleur.XQueryX.groupingSpec = Fleur.Xlength++] = [1, 0, "xqx:groupingSpec"];
Fleur.XQueryXNames[1][Fleur.XQueryX.gtOp = Fleur.Xlength++] = [1, 0, "xqx:gtOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.idivOp = Fleur.Xlength++] = [1, 0, "xqx:idivOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.ifClause = Fleur.Xlength++] = [1, 0, "xqx:ifClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.ifThenElseExpr = Fleur.Xlength++] = [1, 0, "xqx:ifThenElseExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.inheritMode = Fleur.Xlength++] = [1, 0, "xqx:inheritMode"];
Fleur.XQueryXNames[1][Fleur.XQueryX.inlineFunctionExpr = Fleur.Xlength++] = [1, 0, "xqx:inlineFunctionExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.instanceOfExpr = Fleur.Xlength++] = [1, 0, "xqx:instanceOfExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.integerConstantExpr = Fleur.Xlength++] = [1, 0, "xqx:integerConstantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.intersectOp = Fleur.Xlength++] = [1, 0, "xqx:intersectOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.isOp = Fleur.Xlength++] = [1, 0, "xqx:isOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.itemType = Fleur.Xlength++] = [1, 0, "xqx:itemType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.javascriptImport = Fleur.Xlength++] = [1, 0, "xqx:javascriptImport"];
Fleur.XQueryXNames[1][Fleur.XQueryX.kindTest = Fleur.Xlength++] = [1, 0, "xqx:kindTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.leOp = Fleur.Xlength++] = [1, 0, "xqx:leOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.lessThanOp = Fleur.Xlength++] = [1, 0, "xqx:lessThanOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.lessThanOrEqualOp = Fleur.Xlength++] = [1, 0, "xqx:lessThanOrEqualOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letClause = Fleur.Xlength++] = [1, 0, "xqx:letClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letClauseItem = Fleur.Xlength++] = [1, 0, "xqx:letClauseItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letExpr = Fleur.Xlength++] = [1, 0, "xqx:letExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.libraryModule = Fleur.Xlength++] = [1, 0, "xqx:libraryModule"];
Fleur.XQueryXNames[1][Fleur.XQueryX.logicalOp = Fleur.Xlength++] = [1, 0, "xqx:logicalOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.lookup = Fleur.Xlength++] = [1, 0, "xqx:lookup"];
Fleur.XQueryXNames[1][Fleur.XQueryX.ltOp = Fleur.Xlength++] = [1, 0, "xqx:ltOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mainModule = Fleur.Xlength++] = [1, 0, "xqx:mainModule"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapConstructor = Fleur.Xlength++] = [1, 0, "xqx:mapConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapConstructorEntry = Fleur.Xlength++] = [1, 0, "xqx:mapConstructorEntry"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapKeyExpr = Fleur.Xlength++] = [1, 0, "xqx:mapKeyExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapTest = Fleur.Xlength++] = [1, 0, "xqx:mapTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapValueExpr = Fleur.Xlength++] = [1, 0, "xqx:mapValueExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.modOp = Fleur.Xlength++] = [1, 0, "xqx:modOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.module = Fleur.Xlength++] = [1, 0, "xqx:module"];
Fleur.XQueryXNames[1][Fleur.XQueryX.moduleDecl = Fleur.Xlength++] = [1, 0, "xqx:moduleDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.moduleImport = Fleur.Xlength++] = [1, 0, "xqx:moduleImport"];
Fleur.XQueryXNames[1][Fleur.XQueryX.multiplyOp = Fleur.Xlength++] = [1, 0, "xqx:multiplyOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.name = Fleur.Xlength++] = [1, 0, "xqx:name"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nameTest = Fleur.Xlength++] = [1, 0, "xqx:nameTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namedFunctionRef = Fleur.Xlength++] = [1, 0, "xqx:namedFunctionRef"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namespaceDecl = Fleur.Xlength++] = [1, 0, "xqx:namespaceDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namespaceDeclaration = Fleur.Xlength++] = [1, 0, "xqx:namespaceDeclaration"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namespacePrefix = Fleur.Xlength++] = [1, 0, "xqx:namespacePrefix"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namespaceTest = Fleur.Xlength++] = [1, 0, "xqx:namespaceTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.neOp = Fleur.Xlength++] = [1, 0, "xqx:neOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nextItem = Fleur.Xlength++] = [1, 0, "xqx:nextItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nillable = Fleur.Xlength++] = [1, 0, "xqx:nillable"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nodeAfterOp = Fleur.Xlength++] = [1, 0, "xqx:nodeAfterOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nodeBeforeOp = Fleur.Xlength++] = [1, 0, "xqx:nodeBeforeOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nodeComparisonOp = Fleur.Xlength++] = [1, 0, "xqx:nodeComparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.notEqualOp = Fleur.Xlength++] = [1, 0, "xqx:notEqualOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.occurrenceIndicator = Fleur.Xlength++] = [1, 0, "xqx:occurrenceIndicator"];
Fleur.XQueryXNames[1][Fleur.XQueryX.operand = Fleur.Xlength++] = [1, 0, "xqx:operand"];
Fleur.XQueryXNames[1][Fleur.XQueryX.operatorExpr = Fleur.Xlength++] = [1, 0, "xqx:operatorExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.optionContents = Fleur.Xlength++] = [1, 0, "xqx:optionContents"];
Fleur.XQueryXNames[1][Fleur.XQueryX.optionDecl = Fleur.Xlength++] = [1, 0, "xqx:optionDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.optionName = Fleur.Xlength++] = [1, 0, "xqx:optionName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.optional = Fleur.Xlength++] = [1, 0, "xqx:optional"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orOp = Fleur.Xlength++] = [1, 0, "xqx:orOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderByClause = Fleur.Xlength++] = [1, 0, "xqx:orderByClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderByExpr = Fleur.Xlength++] = [1, 0, "xqx:orderByExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderBySpec = Fleur.Xlength++] = [1, 0, "xqx:orderBySpec"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderComparisonOp = Fleur.Xlength++] = [1, 0, "xqx:orderComparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderModifier = Fleur.Xlength++] = [1, 0, "xqx:orderModifier"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderedExpr = Fleur.Xlength++] = [1, 0, "xqx:orderedExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderingKind = Fleur.Xlength++] = [1, 0, "xqx:orderingKind"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderingModeDecl = Fleur.Xlength++] = [1, 0, "xqx:orderingModeDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.param = Fleur.Xlength++] = [1, 0, "xqx:param"];
Fleur.XQueryXNames[1][Fleur.XQueryX.paramList = Fleur.Xlength++] = [1, 0, "xqx:paramList"];
Fleur.XQueryXNames[1][Fleur.XQueryX.paramTypeList = Fleur.Xlength++] = [1, 0, "xqx:paramTypeList"];
Fleur.XQueryXNames[1][Fleur.XQueryX.parenthesizedItemType = Fleur.Xlength++] = [1, 0, "xqx:parenthesizedItemType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.pathExpr = Fleur.Xlength++] = [1, 0, "xqx:pathExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.piTarget = Fleur.Xlength++] = [1, 0, "xqx:piTarget"];
Fleur.XQueryXNames[1][Fleur.XQueryX.piTargetExpr = Fleur.Xlength++] = [1, 0, "xqx:piTargetExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.piTest = Fleur.Xlength++] = [1, 0, "xqx:piTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.piValueExpr = Fleur.Xlength++] = [1, 0, "xqx:piValueExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.positionalVariableBinding = Fleur.Xlength++] = [1, 0, "xqx:positionalVariableBinding"];
Fleur.XQueryXNames[1][Fleur.XQueryX.pragma = Fleur.Xlength++] = [1, 0, "xqx:pragma"];
Fleur.XQueryXNames[1][Fleur.XQueryX.pragmaContents = Fleur.Xlength++] = [1, 0, "xqx:pragmaContents"];
Fleur.XQueryXNames[1][Fleur.XQueryX.pragmaName = Fleur.Xlength++] = [1, 0, "xqx:pragmaName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.predicate = Fleur.Xlength++] = [1, 0, "xqx:predicate"];
Fleur.XQueryXNames[1][Fleur.XQueryX.predicateExpr = Fleur.Xlength++] = [1, 0, "xqx:predicateExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.predicates = Fleur.Xlength++] = [1, 0, "xqx:predicates"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prefixElt = Fleur.Xlength++] = [1, 0, "xqx:prefix"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prefixExpr = Fleur.Xlength++] = [1, 0, "xqx:prefixExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.preserveMode = Fleur.Xlength++] = [1, 0, "xqx:preserveMode"];
Fleur.XQueryXNames[1][Fleur.XQueryX.previousItem = Fleur.Xlength++] = [1, 0, "xqx:previousItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prolog = Fleur.Xlength++] = [1, 0, "xqx:prolog"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prologPartOneItem = Fleur.Xlength++] = [1, 0, "xqx:prologPartOneItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prologPartTwoItem = Fleur.Xlength++] = [1, 0, "xqx:prologPartTwoItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.quantifiedExpr = Fleur.Xlength++] = [1, 0, "xqx:quantifiedExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.quantifiedExprInClause = Fleur.Xlength++] = [1, 0, "xqx:quantifiedExprInClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.quantifier = Fleur.Xlength++] = [1, 0, "xqx:quantifier"];
Fleur.XQueryXNames[1][Fleur.XQueryX.queryBody = Fleur.Xlength++] = [1, 0, "xqx:queryBody"];
Fleur.XQueryXNames[1][Fleur.XQueryX.rangeSequenceExpr = Fleur.Xlength++] = [1, 0, "xqx:rangeSequenceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.resultExpr = Fleur.Xlength++] = [1, 0, "xqx:resultExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.returnClause = Fleur.Xlength++] = [1, 0, "xqx:returnClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.rootExpr = Fleur.Xlength++] = [1, 0, "xqx:rootExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaAttributeTest = Fleur.Xlength++] = [1, 0, "xqx:schemaAttributeTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaElementTest = Fleur.Xlength++] = [1, 0, "xqx:schemaElementTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaImport = Fleur.Xlength++] = [1, 0, "xqx:schemaImport"];
Fleur.XQueryXNames[1][Fleur.XQueryX.secondOperand = Fleur.Xlength++] = [1, 0, "xqx:secondOperand"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sequenceExpr = Fleur.Xlength++] = [1, 0, "xqx:sequenceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sequenceType = Fleur.Xlength++] = [1, 0, "xqx:sequenceType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sequenceTypeUnion = Fleur.Xlength++] = [1, 0, "xqx:sequenceTypeUnion"];
Fleur.XQueryXNames[1][Fleur.XQueryX.setOp = Fleur.Xlength++] = [1, 0, "xqx:setOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.simpleMapExpr = Fleur.Xlength++] = [1, 0, "xqx:simpleMapExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.singleType = Fleur.Xlength++] = [1, 0, "xqx:singleType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.slidingWindowClause = Fleur.Xlength++] = [1, 0, "xqx:slidingWindowClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sourceExpr = Fleur.Xlength++] = [1, 0, "xqx:sourceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stable = Fleur.Xlength++] = [1, 0, "xqx:stable"];
Fleur.XQueryXNames[1][Fleur.XQueryX.star = Fleur.Xlength++] = [1, 0, "xqx:star"];
Fleur.XQueryXNames[1][Fleur.XQueryX.startExpr = Fleur.Xlength++] = [1, 0, "xqx:startExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stepExpr = Fleur.Xlength++] = [1, 0, "xqx:stepExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stringConcatenateOp = Fleur.Xlength++] = [1, 0, "xqx:stringConcatenateOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stringConstantExpr = Fleur.Xlength++] = [1, 0, "xqx:stringConstantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stringOp = Fleur.Xlength++] = [1, 0, "xqx:stringOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.subtractOp = Fleur.Xlength++] = [1, 0, "xqx:subtractOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.switchCaseExpr = Fleur.Xlength++] = [1, 0, "xqx:switchCaseExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.switchExpr = Fleur.Xlength++] = [1, 0, "xqx:switchExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.switchExprCaseClause = Fleur.Xlength++] = [1, 0, "xqx:switchExprCaseClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.switchExprDefaultClause = Fleur.Xlength++] = [1, 0, "xqx:switchExprDefaultClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tagName = Fleur.Xlength++] = [1, 0, "xqx:tagName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tagNameExpr = Fleur.Xlength++] = [1, 0, "xqx:tagNameExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.targetLocation = Fleur.Xlength++] = [1, 0, "xqx:targetLocation"];
Fleur.XQueryXNames[1][Fleur.XQueryX.targetNamespace = Fleur.Xlength++] = [1, 0, "xqx:targetNamespace"];
Fleur.XQueryXNames[1][Fleur.XQueryX.textTest = Fleur.Xlength++] = [1, 0, "xqx:textTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.thenClause = Fleur.Xlength++] = [1, 0, "xqx:thenClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.treatExpr = Fleur.Xlength++] = [1, 0, "xqx:treatExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tryCatchExpr = Fleur.Xlength++] = [1, 0, "xqx:tryCatchExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tryClause = Fleur.Xlength++] = [1, 0, "xqx:tryClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tumblingWindowClause = Fleur.Xlength++] = [1, 0, "xqx:tumblingWindowClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeDeclaration = Fleur.Xlength++] = [1, 0, "xqx:typeDeclaration"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeName = Fleur.Xlength++] = [1, 0, "xqx:typeName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typedFunctionTest = Fleur.Xlength++] = [1, 0, "xqx:typedFunctionTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typedVariableBinding = Fleur.Xlength++] = [1, 0, "xqx:typedVariableBinding"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeswitchExpr = Fleur.Xlength++] = [1, 0, "xqx:typeswitchExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeswitchExprCaseClause = Fleur.Xlength++] = [1, 0, "xqx:typeswitchExprCaseClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeswitchExprDefaultClause = Fleur.Xlength++] = [1, 0, "xqx:typeswitchExprDefaultClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unaryMinusOp = Fleur.Xlength++] = [1, 0, "xqx:unaryMinusOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unaryPlusOp = Fleur.Xlength++] = [1, 0, "xqx:unaryPlusOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unionOp = Fleur.Xlength++] = [1, 0, "xqx:unionOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unorderedExpr = Fleur.Xlength++] = [1, 0, "xqx:unorderedExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.uri = Fleur.Xlength++] = [1, 0, "xqx:uri"];
Fleur.XQueryXNames[1][Fleur.XQueryX.validateExpr = Fleur.Xlength++] = [1, 0, "xqx:validateExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.validationMode = Fleur.Xlength++] = [1, 0, "xqx:validationMode"];
Fleur.XQueryXNames[1][Fleur.XQueryX.value = Fleur.Xlength++] = [1, 0, "xqx:value"];
Fleur.XQueryXNames[1][Fleur.XQueryX.valueComparisonOp = Fleur.Xlength++] = [1, 0, "xqx:valueComparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.valueExpr = Fleur.Xlength++] = [1, 0, "xqx:valueExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.varDecl = Fleur.Xlength++] = [1, 0, "xqx:varDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.varName = Fleur.Xlength++] = [1, 0, "xqx:varName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.varRef = Fleur.Xlength++] = [1, 0, "xqx:varRef"];
Fleur.XQueryXNames[1][Fleur.XQueryX.varValue = Fleur.Xlength++] = [1, 0, "xqx:varValue"];
Fleur.XQueryXNames[1][Fleur.XQueryX.variableBinding = Fleur.Xlength++] = [1, 0, "xqx:variableBinding"];
Fleur.XQueryXNames[1][Fleur.XQueryX.version = Fleur.Xlength++] = [1, 0, "xqx:version"];
Fleur.XQueryXNames[1][Fleur.XQueryX.versionDecl = Fleur.Xlength++] = [1, 0, "xqx:versionDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.voidSequenceType = Fleur.Xlength++] = [1, 0, "xqx:voidSequenceType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.whereClause = Fleur.Xlength++] = [1, 0, "xqx:whereClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.winEndExpr = Fleur.Xlength++] = [1, 0, "xqx:winEndExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.winStartExpr = Fleur.Xlength++] = [1, 0, "xqx:winStartExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.windowClause = Fleur.Xlength++] = [1, 0, "xqx:windowClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.windowEndCondition = Fleur.Xlength++] = [1, 0, "xqx:windowEndCondition"];
Fleur.XQueryXNames[1][Fleur.XQueryX.windowStartCondition = Fleur.Xlength++] = [1, 0, "xqx:windowStartCondition"];
Fleur.XQueryXNames[1][Fleur.XQueryX.windowVars = Fleur.Xlength++] = [1, 0, "xqx:windowVars"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xpathAxis = Fleur.Xlength++] = [1, 0, "xqx:xpathAxis"];
Fleur.XQueryXNames[1][Fleur.XQueryX.URI = Fleur.Xlength++] = [2, 0, "xqx:URI"];
Fleur.XQueryXNames[1][Fleur.XQueryX["default"] = Fleur.Xlength++] = [2, 0, "xqx:default"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nondeterministic = Fleur.Xlength++] = [2, 0, "xqx:nondeterministic"];
Fleur.XQueryXNames[1][Fleur.XQueryX.onlyEnd = Fleur.Xlength++] = [2, 0, "xqx:onlyEnd"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prefix = Fleur.Xlength++] = [2, 0, "xqx:prefix"];
Fleur.XQueryXNames[1][Fleur.XQueryX["private"] = Fleur.Xlength++] = [2, 0, "xqx:private"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sequentialFunction = Fleur.Xlength++] = [2, 0, "xqx:sequentialFunction"];
Fleur.XQueryXNames[1][Fleur.XQueryX.updatingFunction = Fleur.Xlength++] = [2, 0, "xqx:updatingFunction"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xqx = Fleur.Xlength++] = [2, 1, "xmlns:xqx"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xsi = Fleur.Xlength++] = [2, 1, "xmlns:xsi"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaLocation = Fleur.Xlength++] = [2, 2, "xsi:schemaLocation"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xqxuf = Fleur.Xlength++] = [2, 1, "xmlns:xqxuf"];
Fleur.XQueryXNames[1][Fleur.XQueryX.copyModifyExpr = Fleur.Xlength++] = [1, 3, "xqxuf:copyModifyExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.copySource = Fleur.Xlength++] = [1, 3, "xqxuf:copySource"];
Fleur.XQueryXNames[1][Fleur.XQueryX.deleteExpr = Fleur.Xlength++] = [1, 3, "xqxuf:deleteExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertAfter = Fleur.Xlength++] = [1, 3, "xqxuf:insertAfter"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertAsFirst = Fleur.Xlength++] = [1, 3, "xqxuf:insertAsFirst"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertAsLast = Fleur.Xlength++] = [1, 3, "xqxuf:insertAsLast"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertBefore = Fleur.Xlength++] = [1, 3, "xqxuf:insertBefore"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertExpr = Fleur.Xlength++] = [1, 3, "xqxuf:insertExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertInto = Fleur.Xlength++] = [1, 3, "xqxuf:insertInto"];
Fleur.XQueryXNames[1][Fleur.XQueryX.modifyExpr = Fleur.Xlength++] = [1, 3, "xqxuf:modifyExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.newNameExpr = Fleur.Xlength++] = [1, 3, "xqxuf:newNameExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.renameExpr = Fleur.Xlength++] = [1, 3, "xqxuf:renameExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.replaceExpr = Fleur.Xlength++] = [1, 3, "xqxuf:replaceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.replaceValue = Fleur.Xlength++] = [1, 3, "xqxuf:replaceValue"];
Fleur.XQueryXNames[1][Fleur.XQueryX.replacementExpr = Fleur.Xlength++] = [1, 3, "xqxuf:replacementExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.returnExpr = Fleur.Xlength++] = [1, 3, "xqxuf:returnExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.revalidationDecl = Fleur.Xlength++] = [1, 3, "xqxuf:revalidationDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sourceExprUf = Fleur.Xlength++] = [1, 3, "xqxuf:sourceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.targetExpr = Fleur.Xlength++] = [1, 3, "xqxuf:targetExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.transformCopies = Fleur.Xlength++] = [1, 3, "xqxuf:transformCopies"];
Fleur.XQueryXNames[1][Fleur.XQueryX.transformCopy = Fleur.Xlength++] = [1, 3, "xqxuf:transformCopy"];
Fleur.XQueryXNames[1][Fleur.XQueryX.transformExpr = Fleur.Xlength++] = [1, 3, "xqxuf:transformExpr"];
Fleur.XQueryEngine = [];
Fleur.XQueryEngine[Fleur.XQueryX.anyKindTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.arrayTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ARRAY_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.atomicType] = function(ctx, children, callback) {
	if (!ctx._curr.schemaTypeInfo) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	var localname = children[0];
	var prefix = children[1][1][0];
	var namespace = ctx.env.nsresolver.lookupNamespaceURI(prefix);
	if ((localname === ctx._curr.schemaTypeInfo.typeName && namespace === ctx._curr.schemaTypeInfo.typeNamespace) ||
		ctx._curr.schemaTypeInfo.isDerivedFrom(namespace, localname, Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		Fleur.callback(function() {callback(ctx._curr);});
		return;
	}
	Fleur.callback(function() {callback(Fleur.EmptySequence);});
};
Fleur.XQueryEngine[Fleur.XQueryX.attributeConstructor] = function(ctx, children, callback, elt) {
	var attr = new Fleur.Attr();
	var t = new Fleur.Text();
	attr.nodeName = children[0][1][0];
	attr.localName = children[0][1][0];
	if (children[0][1].length === 2) {
		attr.prefix = children[0][1][1][1][0];
	} else {
		attr.prefix = null;
	}
	attr.namespaceURI = elt.lookupNamespaceURI(attr.prefix);
	attr.appendChild(t);
	t.data = "";
	if (children[1][0] === Fleur.XQueryX.attributeValueExpr) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			Fleur.callback(function() {callback(n);});
		}, attr);
	} else {
		t.data = children[1][1][0];
		Fleur.callback(function() {callback(attr);});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.attributeList] = function(ctx, children, callback, elt) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
			elt.setAttributeNode(n);
			if (children.length > 1) {
				Fleur.XQueryEngine[Fleur.XQueryX.attributeList](ctx, children.slice(1), function(n) {
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(elt);});
			}
		} else {
			Fleur.callback(function() {callback(n);});
		}
	}, elt);
};
Fleur.XQueryEngine[Fleur.XQueryX.attributeTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ATTRIBUTE_NODE || ctx._curr.nodeName === "xmlns" || ctx._curr.prefix === "xmlns" ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.attributeValueExpr] = function(ctx, children, callback, attr) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a.nodeType !== Fleur.Node.TEXT_NODE) {
			Fleur.callback(function() {callback(a);});
		} else {
			attr.firstChild.data += a.data;
			if (children.length > 1) {
				Fleur.XQueryEngine[Fleur.XQueryX.attributeValueExpr](ctx, children.slice(1), function(n) {
					Fleur.callback(function() {callback(n);});
				}, attr);
			} else {
				Fleur.callback(function() {callback(attr);});
			}
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.commentTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.COMMENT_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.computedAttributeConstructor] = function(ctx, children, callback) {
	var attr = new Fleur.Attr();
	if (children[0][0] === Fleur.XQueryX.tagName) {
		attr.name = children[0][1][0];
		attr.namespaceURI = null;
		attr.nodeName = children[0][1][0];
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			attr.appendChild(n);
			Fleur.callback(function() {callback(attr);});
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				attr.nodeName = a.data;
				attr.namespaceURI = null;
				attr.localName = a.data;
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					attr.appendChild(n);
					Fleur.callback(function() {callback(attr);});
				});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.computedCommentConstructor] = function(ctx, children, callback) {
	var cmt = new Fleur.Comment();
	cmt.data = "";
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		cmt.data = n.data;
		Fleur.callback(function() {callback(cmt);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.computedDocumentConstructor] = function(ctx, children, callback) {
	var doc = new Fleur.Document();
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		doc.appendChild(n);
		Fleur.callback(function() {callback(doc);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.computedElementConstructor] = function(ctx, children, callback) {
	var elt = new Fleur.Element();
	if (children[0][0] === Fleur.XQueryX.tagName) {
		elt.name = children[0][1][0];
		elt.namespaceURI = null;
		elt.nodeName = children[0][1][0];
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			elt.appendChild(n);
			Fleur.callback(function() {callback(elt);});
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				elt.nodeName = a.data;
				elt.namespaceURI = null;
				elt.localName = a.data;
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					elt.appendChild(n);
					Fleur.callback(function() {callback(elt);});
				});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.computedEntryConstructor] = function(ctx, children, callback) {
	var entry = new Fleur.Entry();
	if (children[0][0] === Fleur.XQueryX.tagName) {
		entry.name = children[0][1][0];
		entry.namespaceURI = null;
		entry.nodeName = children[0][1][0];
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			entry.appendChild(n);
			Fleur.callback(function() {callback(entry);});
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				entry.nodeName = a.data;
				entry.namespaceURI = null;
				entry.localName = a.data;
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					entry.appendChild(n);
					Fleur.callback(function() {callback(entry);});
				});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.computedPIConstructor] = function(ctx, children, callback) {
	var aval, prins = new Fleur.ProcessingInstruction();
	if (children[0][0] === Fleur.XQueryX.piTarget) {
		prins.nodeName = children[0][1][0];
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			aval = Fleur.Atomize(n);
			if (aval.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(aval);});
			} else {
				prins.data = aval.data;
				Fleur.callback(function() {callback(prins);});
			}
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var aname = Fleur.Atomize(n);
			if (aname.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(aname);});
			} else {
				prins.nodeName = aname.data;
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					aval = Fleur.Atomize(n);
					if (aval.nodeType !== Fleur.Node.TEXT_NODE) {
						Fleur.callback(function() {callback(aval);});
					} else {
						prins.data = aval.data;
						Fleur.callback(function() {callback(prins);});
					}
				});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.computedTextConstructor] = function(ctx, children, callback) {
	var txt = new Fleur.Text();
	txt.data = "";
	txt.schemaTypeInfo = Fleur.Type_string;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		txt.data = n.data;
		txt.schemaTypeInfo = n.schemaTypeInfo;
		Fleur.callback(function() {callback(txt);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.contextItemExpr] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.decimalConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(children[0][1][0]);
	a.schemaTypeInfo = Fleur.Type_decimal;
	Fleur.callback(function() {callback(a);});
};
Fleur.XQueryEngine[Fleur.XQueryX.defaultNamespaceCategory] = function(ctx, children) {
};
Fleur.XQueryEngine[Fleur.XQueryX.defaultNamespaceDecl] = function(ctx, children, callback) {
	ctx.env.nsresolver.declareNamespace(" " + children[0][1][0], children[1][1][0]);
	Fleur.callback(function() {callback();});
};
Fleur.XQueryEngine[Fleur.XQueryX.deleteExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var i, l;
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				for (i = 0, l = n.childNodes.length; i < l; i++) {
					if (n.childNodes[i].parentElement) {
						if (n.childNodes[i].nodeType === Fleur.Node.ATTRIBUTE_NODE) {
							n.childNodes[i].parentElement.removeAttributeNode(n.childNodes[i]);
						} else {
							n.childNodes[i].parentElement.removeChild(n.childNodes[i]);
						}
					}
				}
			} else if (n.parentElement) {
				if (n.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
					n.parentElement.removeAttributeNode(n);
				} else {
					n.parentElement.removeChild(n);
				}
			}
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.documentTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.DOCUMENT_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.doubleConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(children[0][1][0]);
	a.schemaTypeInfo = Fleur.Type_double;
	Fleur.callback(function() {callback(a);});
};
Fleur.XQueryEngine[Fleur.XQueryX.elementConstructor] = function(ctx, children, callback) {
	var elt = new Fleur.Element();
	elt.nodeName = children[0][1][0];
	elt.namespaceURI = null;
	elt.localName = children[0][1][0];
	if (children[0][1].length === 2) {
		elt.prefix = children[0][1][1][1][0];
	} else {
		elt.prefix = null;
	}
	elt.childNodes = new Fleur.NodeList();
	elt.children = new Fleur.NodeList();
	elt.textContent = "";
	if (children.length > 1) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			elt.namespaceURI = elt.lookupNamespaceURI(elt.prefix);
			if (children.length > 2) {
				Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(n);});
			}
		}, elt);
	} else {
		elt.namespaceURI = elt.lookupNamespaceURI(elt.prefix);
		Fleur.callback(function() {callback(elt);});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.elementContent] = function(ctx, children, callback, elt) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
		} else {
			elt.appendContent(n, "");
			if (children.length > 1) {
				Fleur.XQueryEngine[Fleur.XQueryX.elementContent](ctx, children.slice(1), function(n) {
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(elt);});
			}
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.elementTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ELEMENT_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.encoding] = function(ctx, children) {
};
Fleur.XQueryEngine[Fleur.XQueryX.entryTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ENTRY_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.filterExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		Fleur.callback(function() {callback(n);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.flworExpr] = function(ctx, children, callback) {
	var i = 0;
	var prevvarres;
	var resarr;
	var cb = function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		i++;
		if (i === children.length) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb, resarr);
	};
	prevvarres = ctx.env.varresolver;
	resarr = [new Fleur.varMgr([], prevvarres)];
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb, resarr);
};
Fleur.XQueryEngine[Fleur.XQueryX.forClause] = function(ctx, children, callback, resarr) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		if (children.length <= 1) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		Fleur.XQueryEngine[Fleur.XQueryX.forClause](ctx, children.slice(1), callback, resarr);
	}, resarr);
};
Fleur.XQueryEngine[Fleur.XQueryX.forClauseItem] = function(ctx, children, callback, resarr) {
	var i = 0;
	var varname = children[0][1][0][1][0];
	var allowingEmpty = children[1][0] === Fleur.XQueryX.allowingEmpty ? 1 : 0;
	var positionalVariableBinding = children[1 + allowingEmpty][0] === Fleur.XQueryX.positionalVariableBinding ? 1 : 0;
	var pvarname = positionalVariableBinding !== 0 ? children[1 + allowingEmpty][1][0] : "";
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		var posvalue;
		if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			resarr[i].set(ctx, "", varname, n);
			if (positionalVariableBinding !== 0) {
				posvalue = new Fleur.Text();
				posvalue.data = "1";
				posvalue.schemaTypeInfo = Fleur.Type_integer;
				resarr[i].set(ctx, "", pvarname, posvalue);
			}
			i++;
		} else {
			n.childNodes.forEach(function(e, ie) {
				if (ie === 0) {
					resarr[i].set(ctx, "", varname, e);
					if (positionalVariableBinding !== 0) {
						posvalue = new Fleur.Text();
						posvalue.data = "1";
						posvalue.schemaTypeInfo = Fleur.Type_integer;
						resarr[i].set(ctx, "", pvarname, posvalue);
					}
				} else {
					var newres = new Fleur.varMgr([], resarr[i]);
					newres.set(ctx, "", varname, e);
					if (positionalVariableBinding !== 0) {
						posvalue = new Fleur.Text();
						posvalue.data = String(ie + 1);
						posvalue.schemaTypeInfo = Fleur.Type_integer;
						newres.set(ctx, "", pvarname, posvalue);
					}
					resarr.splice(i + ie, 0, newres);
				}
			});
			i += n.childNodes.length;
		}
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[1 + allowingEmpty + positionalVariableBinding][1][0][0]](ctx, children[1 + allowingEmpty + positionalVariableBinding][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[1 + allowingEmpty + positionalVariableBinding][1][0][0]](ctx, children[1 + allowingEmpty + positionalVariableBinding][1][0][1], cb);
};
Fleur.XQueryEngine.updating = false;
Fleur.XQueryEngine.updateQueue = [];
Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var args = children[1][1];
	var mainUpdater = false;
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix && ctx.env.nsresolver) {
			uri = ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]);
		}
	}
	var xf;
	if (uri === "http://www.w3.org/standards/webdesign/script") {
		xf = (Fleur.XPathFunctions[uri] && Fleur.XPathFunctions[uri][fname + "#" + args.length]) ? Fleur.XPathFunctions[uri][fname + "#" + args.length] : {};
		xf.jsfunc = eval(fname);
	} else {
		xf = Fleur.XPathFunctions[uri][fname + "#" + args.length] || Fleur.XPathFunctions[uri][fname];
	}
	if (!uri || !xf) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017", "Q{" + uri + "}" + fname + "#" + args.length));});
		return;
	}
	if (xf.updating && !ctx.updater) {
		if (Fleur.XQueryEngine.updating) {
			Fleur.XQueryEngine.updateQueue.push(function() {
				Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr](ctx, children, callback);
			});
			return;
		}
		Fleur.XQueryEngine.updating = true;
		mainUpdater = true;
		ctx.updater = true;
	}
	if (xf.jsfunc || xf.xqxfunc) {
		var argscalc = function(xqxargs, effargs, f) {
			if (xqxargs.length === 0) {
				f(effargs);
			} else {
				var xqxarg = xqxargs.shift();
				Fleur.XQueryEngine[xqxarg[0]](ctx, xqxarg[1], function(n) {
					if ((xf.argtypes && xf.argtypes[effargs.length].type === Fleur.Node) || (n && n.nodeType === Fleur.Node.SEQUENCE_NODE)) {
						effargs.push(n);
					} else if (xf.argtypes && xf.argtypes[effargs.length].type === Fleur.Type_handler) {
						effargs.push(n.data);
					} else {
						var a = Fleur.Atomize(n);
						effargs.push(a);
					}
					argscalc(xqxargs, effargs, f);
				});
			}
		};
		argscalc(args.slice(), [], function(effargs) {
			var a = new Fleur.Text();
			a.schemaTypeInfo = xf.restype ? xf.restype.type : null;
			a.data = "";
			if (xf.jsfunc) {
				var jsargs = [];
				try {
					effargs.forEach(function(effarg, iarg) {
						var op;
						var carg = xf.argtypes ? xf.argtypes[iarg] : null;
						if (carg.type === Fleur.Node) {
							jsargs.push(effarg);
						} else if (effarg === Fleur.EmptySequence) {
							if (carg && (!carg.occurence || (carg.occurence !== "?" && carg.occurence !== "*"))) {
								a.nodeType = Fleur.Node.TEXT_NODE;
								a.schemaTypeInfo = Fleur.Type_error;
								a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
								throw new Error("error");
							}
							jsargs.push(null);
						} else if (effarg.nodeType === Fleur.Node.SEQUENCE_NODE) {
							if (carg && (!carg.occurence || carg.occurence === "?")) {
								a.nodeType = Fleur.Node.TEXT_NODE;
								a.schemaTypeInfo = Fleur.Type_error;
								a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
								throw new Error("error");
							}
							var subarr = [];
							for (var iseq = 0, lseq = effarg.childNodes.length; iseq < lseq; iseq++) {
								var effchild = effarg.childNodes[iseq];
								if ((!carg && Fleur.numericTypes.indexOf(effchild.schemaTypeInfo) !== -1) || (carg && (carg.type === Fleur.numericTypes || Fleur.numericTypes.indexOf(carg.type) !== -1))) {
									op = Fleur.toJSNumber(effchild);
									if (op[0] < 0) {
										a = effchild;
										throw new Error("error");
									}
									subarr.push(op[1]);
								} else if ((!carg && effchild.schemaTypeInfo === Fleur.Type_string) || (carg && carg.type === Fleur.Type_string)) {
									op = Fleur.toJSString(effchild);
									if (op[0] < 0) {
										a = effchild;
										throw new Error("error");
									}
									subarr.push(op[1]);
								} else if ((!carg && effchild.schemaTypeInfo === Fleur.Type_boolean) || (carg && carg.type === Fleur.Type_boolean)) {
									op = Fleur.toJSBoolean(effchild);
									if (op[0] < 0) {
										a = effchild;
										throw new Error("error");
									}
									subarr.push(op[1]);
								} else if (carg.type === Fleur.Type_dateTime) {
								} else {
									subarr.push(effchild);
								}
							}
							jsargs.push(subarr);
						} else if ((!carg && Fleur.numericTypes.indexOf(effarg.schemaTypeInfo) !== -1) || (carg && (carg.type === Fleur.numericTypes || Fleur.numericTypes.indexOf(carg.type) !== -1 || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)))) {
							op = Fleur.toJSNumber(effarg);
							if (op[0] < 0) {
								a = effarg;
								throw new Error("error");
							}
							jsargs.push(op[1]);
						} else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_string) || (carg && (carg.type === Fleur.Type_string || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION)))) {
							op = Fleur.toJSString(effarg);
							if (op[0] < 0) {
								a = effarg;
								throw new Error("error");
							}
							jsargs.push(op[1]);
						} else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_boolean) || (carg && carg.type === Fleur.Type_boolean)) {
							op = Fleur.toJSBoolean(effarg);
							if (op[0] < 0) {
								a = effarg;
								throw new Error("error");
							}
							jsargs.push(op[1]);
						} else if (carg.type === Fleur.Type_dateTime) {
						} else {
							jsargs.push(effarg);
						}
					});
				} catch (e) {
					Fleur.callback(function() {callback(a);});
					return;
				}
				if (xf.needctx) {
					jsargs.push(ctx);
				}
				var convback = function(vret) {
					if (mainUpdater) {
						Fleur.XQueryEngine.updating = false;
						ctx.updater = false;
						if (Fleur.XQueryEngine.updateQueue.length !== 0) {
							setImmediate(Fleur.XQueryEngine.updateQueue.pop());
						}
					}
					if (vret === undefined || vret === null) {
						a = Fleur.EmptySequence;
					} else if (vret === Number.POSITIVE_INFINITY) {
						a.data = "INF";
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_double;
						}
					} else if (vret === Number.NEGATIVE_INFINITY) {
						a.data = "-INF";
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_double;
						}
					} else if (typeof vret === "number" || typeof vret === "boolean") {
						a.data = String(vret);
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = typeof vret === "number" ? Fleur.Type_double : Fleur.Type_boolean;
						}
					} else if (typeof vret === "string") {
						a.data = vret;
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_string;
						}
					} else if (typeof vret.getMonth === "function") {
						var o = vret.getTimezoneOffset();
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_datetime;
						}
						if (a.schemaTypeInfo === Fleur.Type_date) {
							a.data = ("000" + vret.getFullYear()).slice(-4) + "-" + ("0" + (vret.getMonth() + 1)).slice(-2) + "-" + ("0" + vret.getDate()).slice(-2) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
						} else if (a.schemaTypeInfo === Fleur.Type_time) {
							a.data = ("0" + vret.getHours()).slice(-2) + ":" + ("0" + vret.getMinutes()).slice(-2) + ":" + ("0" + vret.getSeconds()).slice(-2) + "." + ("00" + vret.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
						} else {
							a.data = ("000" + vret.getFullYear()).slice(-4) + "-" + ("0" + (vret.getMonth() + 1)).slice(-2) + "-" + ("0" + vret.getDate()).slice(-2) + "T" + ("0" + vret.getHours()).slice(-2) + ":" + ("0" + vret.getMinutes()).slice(-2) + ":" + ("0" + vret.getSeconds()).slice(-2) + "." + ("00" + vret.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
						}
					} else if (vret instanceof Fleur.Node || vret instanceof Node) {
						a = vret;
					} else {
						a.data = vret;
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_handler;
						}
					}
					Fleur.callback(function() {callback(a);});
				};
				if (xf.needcallback) {
					jsargs.push(convback);
					xf.jsfunc.apply(null, jsargs);
					return;
				}
				convback(xf.jsfunc.apply(null, jsargs));
			} else {
				var currvarres = ctx.env.varresolver;
				ctx.env.varresolver = new Fleur.varMgr([], ctx.env.globalvarresolver);
				effargs.forEach(function(effarg, iarg) {
					ctx.env.varresolver.set(ctx, "", xf.argtypes[iarg].name, effarg);
				});
				Fleur.XQueryEngine[xf.xqxfunc[0]](ctx, xf.xqxfunc[1], function(n) {
					if (mainUpdater) {
						Fleur.XQueryEngine.updating = false;
						ctx.updater = false;
						if (Fleur.XQueryEngine.updateQueue.length !== 0) {
							setImmediate(Fleur.XQueryEngine.updateQueue.pop());
						}
					}
					ctx.env.varresolver = currvarres;
					Fleur.callback(function() {callback(n);});
				});
			}
		});
	} else {
		xf(ctx, args, function(n) {
			if (mainUpdater) {
				Fleur.XQueryEngine.updating = false;
				ctx.updater = false;
				if (Fleur.XQueryEngine.updateQueue.length !== 0) {
					setImmediate(Fleur.XQueryEngine.updateQueue.pop());
				}
			}
			Fleur.callback(function() {callback(n);});
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.functionDecl] = function(ctx, children, callback) {
	var updating = children[0][0] === Fleur.XQueryX.updatingFunction;
	var init = updating ? 1 : 0;
	var fname = children[init][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var prefix = null;
	if (children[init][1][1]) {
		if (children[init][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[init][1][1][1][0];
		} else if (children[init][1][1][0] === Fleur.XQueryX.prefix) {
			prefix = children[init][1][1][1][0];
			uri = ctx.env.nsresolver.lookupNamespaceURI(prefix);
		}
	}
	var args = children[init + 1][1].map(function(arg) {
		var o = {name: arg[1][0][1][0]};
		if (arg[1].length === 1) {
			o.type = Fleur.Node;
			o.occurence = "*";
		} else {
			var tprefix = null, turi;
			var atype = arg[1][1][1][0][1];
			var tname = atype[0];
			if (atype[1]) {
				if (atype[1][0] === Fleur.XQueryX.URI) {
					turi = atype[1][1][0];
				} else if (atype[1][0] === Fleur.XQueryX.prefix) {
					tprefix = atype[1][1][0];
					turi = ctx.env.nsresolver.lookupNamespaceURI(tprefix);
				}
			}
			o.type = Fleur.Types[turi][tname];
			if (arg[1][1][1].length === 2) {
				o.occurence = arg[1][1][1][1][1][0];
			}
		}
		return o;
	});
	var fbody, fret;
	if (children[init + 2][0] === Fleur.XQueryX.typeDeclaration) {
		fret = children[init + 2][1][0];
		fbody = children[init + 3][0] === Fleur.XQueryX.functionBody ? children[init + 3][1][0] : null;
	} else {
		fret = {type: Fleur.Node, occurence: "*"};
		fbody = children[init + 2][0] === Fleur.XQueryX.functionBody ? children[init + 2][1][0] : null;
	}
	if (!Fleur.XPathFunctions[uri]) {
		Fleur.XPathFunctions[uri] = {};
	}
	Fleur.XPathFunctions[uri][fname + "#" + String(args.length)] = new Fleur.Function(uri, prefix ? prefix + ":" + fname : fname, null, fbody, args, false, false, fret, updating);
	Fleur.callback(function() {callback();});
};
Fleur.XQueryEngine[Fleur.XQueryX.ifThenElseExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var boolean;
		if (n === Fleur.EmptySequence) {
			boolean = false;
		} else if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (n.childNodes.length === 0) {
				boolean = false;
			} else if (n.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || n.childNodes[0].ownerDocument) {
				boolean = true;
			} else {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
				return;
			}
		} else if (n.nodeType !== Fleur.Node.TEXT_NODE) {
			boolean = true;
		} else if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} else if (n.schemaTypeInfo === Fleur.Type_boolean) {
			boolean = n.data === "true";
		} else if (n.schemaTypeInfo === Fleur.Type_string || n.schemaTypeInfo === Fleur.Type_untypedAtomic || n.schemaTypeInfo === Fleur.Type_anyURI) {
			boolean = !(!n.data || n.data.length === 0);
		} else if (n.schemaTypeInfo === Fleur.Type_integer || n.schemaTypeInfo === Fleur.Type_decimal || n.schemaTypeInfo === Fleur.Type_float || n.schemaTypeInfo === Fleur.Type_double) {
			boolean = !(n.data === "0" || n.data === "0.0" || n.data === "0.0e0" || n.data === "NaN");
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = n.data === "true";
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = !(!n.data || n.data.length === 0);
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = !(n.data === "0" || n.data === "0.0" || n.data === "0.0e0" || n.data === "NaN");
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
			return;
		}
		if (boolean) {
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], callback);
		} else {
			Fleur.XQueryEngine[children[2][1][0][0]](ctx, children[2][1][0][1], callback);
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.insertExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(source) {
		if (source !== Fleur.EmptySequence) {
			Fleur.XQueryEngine[children[2][1][0][0]](ctx, children[2][1][0][1], function(target) {
				var targetChoice = children[1][0];
				var intoPos = null;
				if (targetChoice === Fleur.XQueryX.insertInto) {
					if (children[1][1].length !== 0) {
						intoPos = children[1][1][0][0];
					}
				}
				if (source.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var tnode;
					if (target instanceof Fleur.Node) {
						tnode = target.ownerDocument ? target.ownerDocument.importNode(source, true) : source;
					} else {
						tnode = Fleur.Document.docImportNode(target.ownerDocument, source, true);
					}
					switch (target.nodeType) {
						case Fleur.Node.ELEMENT_NODE:
							switch (targetChoice) {
								case Fleur.XQueryX.insertInto:
									if (intoPos === Fleur.XQueryX.insertAsFirst) {
										target.insertBefore(tnode, target.firstChild);
									} else {
										target.appendChild(tnode);
									}
									break;
								case Fleur.XQueryX.insertBefore:
									target.parentNode.insertBefore(tnode, target);
									break;
								case Fleur.XQueryX.insertAfter:
									if (target.nextSibling) {
										target.parentNode.insertBefore(tnode, target.nextSibling);
									} else {
										target.parentNode.appendChild(tnode);
									}
									break;
							}
							break;
						case Fleur.Node.MAP_NODE:
							target.setEntryNode(tnode);
							break;
					}
				}
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			});
			return;
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.instanceOfExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var seqtype = children[1][1];
		var occurrence = "1";
		var res = true;
		var a;
		if (seqtype.length === 2) {
			occurrence = seqtype[1][0];
		}
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (occurrence === "1" || occurrence === "?") {
					res = false;
				} else {
				}
			} else {
				Fleur.XQueryEngine[seqtype[0][0]]({
					_curr: n,
					env: ctx.env
				}, seqtype[0][1], function(n) {
					a = new Fleur.Text();
					a.data = String(n !== Fleur.EmptySequence);
					a.schemaTypeInfo = Fleur.Type_boolean;
					Fleur.callback(function() {callback(a);});
				});
				return;
			}
		} else if (occurrence === "1" || occurrence === "+") {
				res = false;
		}
		a = new Fleur.Text();
		a.data = String(res);
		a.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.integerConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(children[0][1][0]);
	a.schemaTypeInfo = Fleur.Type_integer;
	Fleur.callback(function() {callback(a);});
};
Fleur.XQueryEngine[Fleur.XQueryX.javascriptImport] = function(ctx, children, callback) {
	var at = children[0][1][0];
	var httpget = at.startsWith("http://") || Fleur.inBrowser;
	var fileread = at.startsWith("file://") || !httpget;
	if (httpget) {
		if (at.startsWith("http://")) {
			at = at.substr(7);
		}
		var getp = new Promise(function(resolve, reject) {
			var req = new XMLHttpRequest();
			req.open('GET', at, true);
			req.onload = function() {
				if (req.status === 200) {
					resolve(req.responseText);
				} else {
					reject(Fleur.error(ctx, "FODC0002"));
		      	}
			};
			req.send(null);
		});
		getp.then(
			function(s) {
				Fleur.callback(function() {callback();});
			},
			function(a) {
				Fleur.callback(function() {callback();});
			}
		);
	} else if (fileread) {
		if (at.startsWith("file://")) {
			at = at.substr(7);
		}
		if (!at.startsWith(global.path.sep)) {
			at = global.path.join(Fleur.baseDir, at);
		}
		global.fs.readFile(at, 'binary', function(err, file){
			if (err) {
				process.stdout.write(err);
				Fleur.callback(function() {callback();});
			} else {
				(0, eval)(file);
				Fleur.callback(function() {callback();});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.letClause] = function(ctx, children, callback, resarr) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		if (children.length <= 1) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		Fleur.XQueryEngine[Fleur.XQueryX.letClause](ctx, children.slice(1), callback, resarr);
	}, resarr);
};
Fleur.XQueryEngine[Fleur.XQueryX.letClauseItem] = function(ctx, children, callback, resarr) {
	var i = 0;
	var varname = children[0][1][0][1][0];
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		resarr[i].set(ctx, "", varname, n);
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.lookup] = function(ctx, children, callback) {
	if (ctx._curr.nodeType !== Fleur.Node.MAP_NODE) {
		Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.lookup);});
	} else if (children[0][0] === Fleur.XQueryX.NCName) {
		Fleur.callback(function() {callback(ctx._curr.getEntryNode(children[0][1][0]) || Fleur.EmptySequence, Fleur.XQueryX.lookup);});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				Fleur.callback(function() {callback(ctx._curr.getEntryNode(a.data) || Fleur.EmptySequence, Fleur.XQueryX.lookup);});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.mainModule] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.mainModule](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.mapConstructor] = function(ctx, children, callback) {
	var map = new Fleur.Map();
	var i = 0;
	var cb = function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n !== Fleur.EmptySequence) {
			map.setEntryNode(n);
		}
		i++;
		if (i === children.length) {
			Fleur.callback(function() {callback(map);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb);
	};
	if (children.length !== 0) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	} else {
		Fleur.callback(function() {callback(map);});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.mapConstructorEntry] = function(ctx, children, callback) {
	var entry = new Fleur.Entry();
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a.nodeType !== Fleur.Node.TEXT_NODE) {
			Fleur.callback(function() {callback(a);});
		} else {
			entry.nodeName = a.data;
			entry.namespaceURI = null;
			entry.localName = a.data;
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
				if (n === Fleur.EmptySequence) {
					Fleur.callback(function() {callback(Fleur.EmptySequence);});
				} else {
					entry.appendChild(n);
					Fleur.callback(function() {callback(entry);});
				}
			});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.mapTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.MAP_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.module] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		ctx._result = n;
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.module](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.namedFunctionRef] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var nbargs = parseInt(children[1][1][0][1][0], 10);
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix && ctx.env.nsresolver) {
			uri = ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]);
		}
	}
	Fleur.callback(function() {callback(Fleur.XPathFunctions[uri] ? Fleur.XPathFunctions[uri][fname + "#" + nbargs] || Fleur.EmptySequence : Fleur.EmptySequence);});
};
Fleur.XQueryEngine[Fleur.XQueryX.namespaceDecl] = function(ctx, children, callback) {
	ctx.env.nsresolver.declareNamespace(children[0][1][0], children[1][1][0]);
	Fleur.callback(function() {callback();});
};
Fleur.XQueryEngine[Fleur.XQueryX.namespaceDeclaration] = function(ctx, children, callback) {
	var attr = new Fleur.Attr();
	var t = new Fleur.Text();
	if (children[0][0] === Fleur.XQueryX.prefixElt) {
		attr.localName = children[0][1][0];
		attr.nodeName = "xmlns:" + attr.localName;
		attr.namespaceURI = "http://www.w3.org/2000/xmlns/";
		attr.prefix = "xmlns";
		t.data = children[1][1][0];
	} else {
		attr.localName = "xmlns";
		attr.nodeName = "xmlns";
		attr.namespaceURI = "http://www.w3.org/XML/1998/namespace";
		t.data = children[0][1][0];
	}
	attr.appendChild(t);
	Fleur.callback(function() {callback(attr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.nameTest] = function(ctx, children, callback) {
	if (ctx._curr.localName !== children[0]) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	var nsURI;
	if (children.length === 1) {
		nsURI = "";
	} else {
		nsURI = children[1][1][0];
	}
	var currURI = ctx._curr.namespaceURI || null;
	if (currURI !== ctx.env.nsresolver.lookupNamespaceURI(nsURI) && currURI !== "http://www.w3.org/1999/xhtml") {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	Fleur.callback(function() {callback(ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.optionDecl] = function(ctx, children, callback) {
	if (!ctx.env.options) {
		ctx.env.options = {};
	}
	var uri = children[0][1].length > 1 ? ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]) : "http://www.w3.org/2012/xquery";
	if (!ctx.env.options[uri]) {
		ctx.env.options[uri] = {};
	}
	ctx.env.options[uri][children[0][1][0]] = children[1][1][0];
	Fleur.callback(function() {callback();});
};
Fleur.XQueryEngine[Fleur.XQueryX.pathExpr] = function(ctx, children, callback) {
	var next;
	var result = Fleur.EmptySequence;
	var cb = function(n, eob) {
		if (eob === Fleur.XQueryX.pathExpr) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			n = next;
		}
		if (n === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(result, Fleur.XQueryX.pathExpr);});
			return;
		}
		if (children.length === 1) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.pathExpr);});
			return;
		}
		var subcurr;
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			subcurr = n.childNodes.shift();
			if (n.childNodes.length === 1) {
				n = n.childNodes[0];
			}
		} else {
			subcurr = n;
			n = Fleur.EmptySequence;
		}
		next = n;
		Fleur.XQueryEngine[Fleur.XQueryX.pathExpr]({
				_curr: subcurr,
				env: ctx.env
			}, children.slice(1), cb);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.piTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.PROCESSING_INSTRUCTION_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.predicate] = function(ctx, children, callback) {
	var next = ctx._next;
	var last;
	var pos = 1;
	var result = Fleur.EmptySequence;
	var subcurr;
	if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
		last = next.childNodes.length;
		subcurr = next.childNodes.shift();
		if (next.childNodes.length === 1) {
			next = next.childNodes[0];
		}
	} else {
		subcurr = next;
		next = Fleur.EmptySequence;
		last = 1;
	}
	var cb = function(n, eob) {
		if (eob === Fleur.XQueryX.predicate) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.predicate);});
			return;
		}
		if ((n.nodeType === Fleur.Node.SEQUENCE_NODE && n.childNodes.length !== 0) ||
			(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_boolean && n.data !== "false") ||
			(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_integer && parseInt(n.data, 10) === pos) ||
			(n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.TEXT_NODE)) {
			if (result === Fleur.EmptySequence) {
				result = subcurr;
			} else {
				if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					seq.appendChild(result);
					result = seq;
				}
				result.appendChild(subcurr);
			}
		}
		if (next === Fleur.EmptySequence) {
			if (children.length === 1 || result === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.predicate);});
				return;
			}
			children.shift();
			next = result;
			result = Fleur.EmptySequence;
			pos = 1;
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				last = next.childNodes.length;
				subcurr = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					next = next.childNodes[0];
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
				last = 1;
			}
			Fleur.XQueryEngine[children[0][0]]({
						_curr: subcurr,
						_next: next,
						_last: last,
						_pos: pos,
						env: ctx.env
					}, children[0][1], cb);
			return;
		}
		if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
			subcurr = next.childNodes.shift();
			if (next.childNodes.length === 1) {
				next = next.childNodes[0];
			}
		} else {
			subcurr = next;
			next = Fleur.EmptySequence;
		}
		pos++;
		Fleur.XQueryEngine[children[0][0]]({
					_curr: subcurr,
					_next: next,
					_last: last,
					_pos: pos,
					env: ctx.env
				}, children[0][1], cb);
	};
	Fleur.XQueryEngine[children[0][0]]({
				_curr: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				env: ctx.env
			}, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.predicates] = function(ctx, children, callback) {
	var next = ctx._next;
	var last;
	var pos = 1;
	var result = Fleur.EmptySequence;
	var subcurr;
	if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
		last = next.childNodes.length;
		subcurr = next.childNodes.shift();
		if (next.childNodes.length === 1) {
			next = next.childNodes[0];
		}
	} else {
		subcurr = next;
		next = Fleur.EmptySequence;
		last = 1;
	}
	var cb = function(n, eob) {
		if (eob === Fleur.XQueryX.predicates) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.predicates);});
			return;
		}
		if (eob === Fleur.XQueryX.lookup) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					result.appendChild(n);
				}
			}
		} else {
			if ((n.nodeType === Fleur.Node.SEQUENCE_NODE && n.childNodes.length !== 0) ||
				(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_boolean && n.data !== "false") ||
				(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_integer && parseInt(n.data, 10) === pos) ||
				(n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.TEXT_NODE)) {
				if (result === Fleur.EmptySequence) {
					result = subcurr;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					result.appendChild(subcurr);
				}
			}
		}
		if (next === Fleur.EmptySequence) {
			if (children.length === 1 || result === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.predicates);});
				return;
			}
			children.shift();
			next = result;
			result = Fleur.EmptySequence;
			pos = 1;
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				last = next.childNodes.length;
				subcurr = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					next = next.childNodes[0];
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
				last = 1;
			}
			Fleur.XQueryEngine[children[0][0]]({
						_curr: subcurr,
						_next: next,
						_last: last,
						_pos: pos,
						env: ctx.env
					}, children[0][1], cb);
			return;
		}
		if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
			subcurr = next.childNodes.shift();
			if (next.childNodes.length === 1) {
				next = next.childNodes[0];
			}
		} else {
			subcurr = next;
			next = Fleur.EmptySequence;
		}
		pos++;
		Fleur.XQueryEngine[children[0][0]]({
					_curr: subcurr,
					_next: next,
					_last: last,
					_pos: pos,
					env: ctx.env
				}, children[0][1], cb);
	};
	Fleur.XQueryEngine[children[0][0]]({
				_curr: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				env: ctx.env
			}, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.prolog] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.prolog](ctx, children.slice(1), callback);
		} else {
			ctx.env.varresolver.globals = ctx.env.varresolver.length;
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.queryBody] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.queryBody](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.rangeSequenceExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] !== 0) {
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var a2 = Fleur.Atomize(n);
			if (a2 === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] !== 0) {
				return;
			}
			if (op1[1] > op2[1]) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (op1[1] === op2[1]) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			var result = new Fleur.Sequence();
			result.nodeType = Fleur.Node.SEQUENCE_NODE;
			while (op1[1] <= op2[1]) {
				var i = new Fleur.Text();
				i.schemaTypeInfo = Fleur.Type_integer;
				i.data = "" + op1[1];
				result.appendChild(i);
				op1[1]++;
			}
			Fleur.callback(function() {callback(result);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.replaceExpr] = function(ctx, children, callback) {
	var replaceValue = children[0][0] === Fleur.XQueryX.replaceValue ? 1 : 0;
	Fleur.XQueryEngine[children[replaceValue][1][0][0]](ctx, children[replaceValue][1][0][1], function(target) {
		if (target !== Fleur.EmptySequence) {
			Fleur.XQueryEngine[children[replaceValue + 1][1][0][0]](ctx, children[replaceValue + 1][1][0][1], function(replacement) {
				if (replaceValue === 1) {
					var a = Fleur.Atomize(replacement);
					target.textContent = a.data;
				} else if (replacement === Fleur.EmptySequence) {
					if (target.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
						target.ownerElement.removeAttributeNode(target);
					} else if (target.nodeType === Fleur.Node.ENTRY_NODE) {
						target.ownerMap.removeEntryNode(target);
					} else {
						target.parentElement.removeChild(target);
					}
				} else {
					var parelt = target.nodeType === Fleur.Node.ATTRIBUTE_NODE ? target.ownerElement : target.nodeType === Fleur.Node.ENTRY_NODE ? target.ownerMap : target.nodeType === Fleur.Node.MAP_NODE ? target.parentNode : target.parentElement;
					var n2;
					if (target instanceof Fleur.Node) {
						n2 = target.ownerDocument.importNode(replacement.nodeType === Fleur.Node.SEQUENCE_NODE ? replacement.firstChild : replacement, true);
					} else {
						n2 = Fleur.Document.docImportNode(target.ownerDocument, replacement.nodeType === Fleur.Node.SEQUENCE_NODE ? replacement.firstChild : replacement, true);
					}
					if (target.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
						parelt.removeAttributeNode(target);
						parelt.setAttributeNode(n2);
					} else if (target.nodeType === Fleur.Node.ENTRY_NODE) {
						parelt.removeEntryNode(target);
						parelt.setEntryNode(n2);
					} else {
						parelt.replaceChild(n2, target);
					}
					if (replacement.nodeType === Fleur.Node.SEQUENCE_NODE) {
						var n3;
						for (var i = 1, l = replacement.childNodes.length; i < l; i++) {
							if (parelt instanceof Fleur.Node) {
								n3 = parelt.ownerDocument.importNode(replacement.childNodes[i], true);
							} else {
								n3 = Fleur.Document.docImportNode(parelt.ownerDocument, replacement.childNodes[i], true);
							}
							if (n3.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
								parelt.setAttributeNode(n3);
							} else if (n3.nodeType === Fleur.Node.ENTRY_NODE) {
								parelt.setEntryNode(n3);
							} else {
								parelt.insertBefore(n3, n2.followingSibling);
							}
						}
					}
				}
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			});
			return;
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.returnClause] = function(ctx, children, callback, resarr) {
	var i = 0;
	var result = Fleur.EmptySequence;
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		if (n !== Fleur.EmptySequence) {
			if (result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				result = n;
			} else {
				if (result === Fleur.EmptySequence || result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					if (result !== Fleur.EmptySequence) {
						seq.appendChild(result);
					}
					result = seq;
				}
				if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					result.appendChild(n);
				} else {
					n.childNodes.forEach(function(node) {
						result.appendChild(node);
					});
				}
			}
		}
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
		} else {
			Fleur.callback(function() {callback(result);});
		}
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.rootExpr] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.ownerDocument || ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.schemaLocation] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.sequenceExpr] = function(ctx, children, callback, depth) {
	if (!depth) {
		depth = 0;
	}
	if (children.length === 0) {
		Fleur.callback(function() {callback(Fleur.EmptySequence, depth);});
		return;
	}
	var result = Fleur.EmptySequence;
	var cb = function(n, eob) {
		var seq;
		if (eob === depth) {
			if (result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				result = n;
			} else if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence || result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					if (result !== Fleur.EmptySequence) {
						seq.appendChild(result);
					}
					result = seq;
				}
				if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					result.appendChild(n);
				} else {
					n.childNodes.forEach(function(child) {result.appendChild(child);});
				}
			}
			Fleur.callback(function() {callback(result, depth);});
			return;
		}
		if (children.length === 1) {
			Fleur.callback(function() {callback(n, depth);});
			return;
		}
		if (result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			result = n;
		} else if (n !== Fleur.EmptySequence) {
			if (result === Fleur.EmptySequence || result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				seq = new Fleur.Sequence();
				seq.childNodes = new Fleur.NodeList();
				seq.children = new Fleur.NodeList();
				seq.textContent = "";
				if (result !== Fleur.EmptySequence) {
					seq.appendChild(result);
				}
				result = seq;
			}
			if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				result.appendChild(n);
			} else {
				n.childNodes.forEach(function(child) {result.appendChild(child);});
			}
		}
		Fleur.XQueryEngine[Fleur.XQueryX.sequenceExpr](ctx, children.slice(1), cb, depth);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb, children[0][0] === Fleur.XQueryX.sequenceExpr ? depth + 1 : depth);
};
Fleur.XQueryEngine[Fleur.XQueryX.simpleMapExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var subcurr, next, last, pos, result = Fleur.EmptySequence;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		next = n;
		if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
			last = next.childNodes.length;
			subcurr = next.childNodes.shift();
			if (next.childNodes.length === 1) {
				next = next.childNodes[0];
			}
		} else {
			subcurr = next;
			next = Fleur.EmptySequence;
			last = 1;
		}
		var cb = function(n) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			if (next === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.simpleMapExpr);});
				return;
			}
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				subcurr = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					next = next.childNodes[0];
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
			}
			pos++;
			Fleur.XQueryEngine[children[1][0]]({
				_curr: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				env: ctx.env
			}, children[1][1], cb);
		};
		Fleur.XQueryEngine[children[1][0]]({
			_curr: subcurr,
			_next: next,
			_last: last,
			_pos: pos,
			env: ctx.env
		}, children[1][1], cb);
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.stepExpr] = function(ctx, children, callback) {
	var next;
	var result = Fleur.EmptySequence;
	var cb = function(n, eob) {
		var subcurr;
		if (eob === Fleur.XQueryX.stepExpr) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			n = next;
		}
		if (n === Fleur.EmptySequence) {
			if (eob === Fleur.XQueryX.stepExpr && result !== Fleur.EmptySequence && callback !== cb && (children[children.length - 1][0] === Fleur.XQueryX.predicates || children[children.length - 1][0] === Fleur.XQueryX.predicate || children[children.length - 1][0] === Fleur.XQueryX.lookup)) {
				var predpos = children.length - 1;
				var preds = children[children.length - 1][1];
				if (children[children.length - 1][0] !== Fleur.XQueryX.predicates) {
					while (children[predpos][0] === Fleur.XQueryX.predicate || children[predpos][0] === Fleur.XQueryX.lookup) {
						predpos--;
					}
					preds = children.slice(predpos + 1);
				}
				Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
					_next: result,
					env: ctx.env
				}, preds, function(n) {
					Fleur.callback(function() {callback(n, Fleur.XQueryX.stepExpr);});
				});
				return;
			}
			Fleur.callback(function() {callback(result, Fleur.XQueryX.stepExpr);});
			return;
		}
		if (children.length === 1) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.stepExpr);});
			return;
		}
		if (children.length > 1 && (children[1][0] === Fleur.XQueryX.predicates || children[1][0] === Fleur.XQueryX.predicate || children[1][0] === Fleur.XQueryX.lookup)) {
			Fleur.callback(function() {next = Fleur.EmptySequence; cb(n, Fleur.XQueryX.stepExpr);});
			return;
		}
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			subcurr = n.childNodes.shift();
			if (n.childNodes.length === 1) {
				n = n.childNodes[0];
			}
		} else {
			subcurr = n;
			n = Fleur.EmptySequence;
		}
		next = n;
		Fleur.XQueryEngine[Fleur.XQueryX.stepExpr]({
				_curr: subcurr,
				env: ctx.env
			}, children.slice(1), cb);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.stringConstantExpr] = function(ctx, children, callback) {
	var n = new Fleur.Text();
	n.appendData(children[0][1][0] || "");
	n.schemaTypeInfo = Fleur.Type_string;
	Fleur.callback(function() {callback(n);});
};
Fleur.XQueryEngine[Fleur.XQueryX.textTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.TEXT_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.uri] = function(ctx, children) {
};
Fleur.XQueryEngine[Fleur.XQueryX.varRef] = function(ctx, children, callback) {
	var n = ctx.env.varresolver.get(ctx, "", children[0][1][0]);
	Fleur.callback(function() {callback(n);});
};
Fleur.XQueryEngine[Fleur.XQueryX.version] = function(ctx, children) {
};
Fleur.XQueryEngine[Fleur.XQueryX.Wildcard] = function(ctx, children, callback) {
	if (children[0]) {
		if (children[0][0] === Fleur.XQueryX.star && children[1][0] === Fleur.XQueryX.NCName) {
			if (ctx._curr.localName !== children[1][1][0]) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
		}
	}
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ELEMENT_NODE && ctx._curr.nodeType !== Fleur.Node.ATTRIBUTE_NODE && ctx._curr.nodeType !== Fleur.Node.ENTRY_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.xpathAxis] = function(ctx, children, callback) {
	var seq, n, i, l;
	var curr = ctx._curr;
	switch(children[0]) {
		case "ancestor-or-self":
			if (!curr.parentNode && !curr.ownerElement) {
				Fleur.callback(function() {callback(curr);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(curr);
			n = curr.parentNode || curr.ownerElement;
			seq.appendChild(n);
			n = n.parentNode;
			while (n) {
				seq.appendChild(n);
				n = n.parentNode;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "ancestor":
			if (!curr.parentNode && !curr.ownerElement) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.parentNode || curr.ownerElement;
			if (!n.parentNode) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.parentNode;
			while (n) {
				seq.appendChild(n);
				n = n.parentNode;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "attribute":
			if (!curr.attributes || curr.attributes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.attributes.length === 1 && curr.attributes[0].nodeName !== "xmlns" && curr.attributes[0].prefix !== "xmlns") {
				Fleur.callback(function() {callback(curr.attributes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			if (curr.attributes.forEach) {
				curr.attributes.forEach(function(a) {
					if (a.nodeName !== "xmlns" && a.prefix !== "xmlns") {
						seq.appendChild(a);
					}
				});
			} else {
				for (i = 0, l = curr.attributes.length; i < l; i++) {
					if (curr.attributes[i].nodeName !== "xmlns" && curr.attributes[i].prefix !== "xmlns") {
						seq.appendChild(curr.attributes[i]);
					}
				}
			}
			if (seq.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			} else {
				if (seq.childNodes.length === 1) {
					seq = seq.childNodes[0];
				}
				Fleur.callback(function() {callback(seq);});
			}
			return;
		case "entry":
			if (!curr.entries || curr.entries.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.entries.length === 1) {
				Fleur.callback(function() {callback(curr.entries[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			curr.entries.forEach(function(a) {seq.appendChild(a);});
			Fleur.callback(function() {callback(seq);});
			return;
		case "child":
			if (!curr.childNodes || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.childNodes.length === 1) {
				Fleur.callback(function() {callback(curr.childNodes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			if (curr.childNodes.forEach) {
				curr.childNodes.forEach(function(a) {seq.appendChild(a);});
			} else {
				for (i = 0, l = curr.childNodes.length; i < l; i++) {
					seq.appendChild(curr.childNodes[i]);
				}
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "descendant":
			if (!curr.childNodes || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.childNodes.length === 1 && curr.childNodes[0].childNodes.length === 0) {
				Fleur.callback(function() {callback(curr.childNodes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendDescendants(curr);
			Fleur.callback(function() {callback(seq);});
			return;
		case "descendant-or-self":
			if (!curr.childNodes || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(curr);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(curr);
			seq.appendDescendants(curr);
			Fleur.callback(function() {callback(seq);});
			return;
		case "following":
			if (!curr.nextSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.nextSibling;
			if (!n.nextSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.nextSibling;
			while (n) {
				seq.appendChild(n);
				seq.appendDescendants(n);
				n = n.nextSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "following-sibling":
			if (!curr.nextSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.nextSibling;
			if (!n.nextSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.nextSibling;
			while (n) {
				seq.appendChild(n);
				n = n.nextSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "parent":
			Fleur.callback(function() {callback(curr.parentNode || curr.ownerElement || Fleur.EmptySequence);});
			return;
		case "preceding":
			if (!curr.previousSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.previousSibling;
			if (!n.previousSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.previousSibling;
			while (n) {
				seq.appendDescendantsRev(n);
				seq.appendChild(n);
				n = n.previousSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "preceding-sibling":
			if (!curr.previousSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.previousSibling;
			if (!n.previousSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.previousSibling;
			while (n) {
				seq.appendChild(n);
				n = n.previousSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "self":
			Fleur.callback(function() {callback(curr);});
			return;
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.xqx] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.xqxuf] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.xsi] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.NCName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.QName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.URIExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.annotation] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.annotationName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyElementTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyFunctionTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyItemType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.argumentPlaceholder] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.arguments] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.attributeName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.attributeValue] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.baseUriDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.bindingSequence] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.boundarySpaceDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.castExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.castableExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.catchClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.catchErrorList] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.catchExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.collation] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.computedNamespaceConstructor] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.constantExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.constructionDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.constructorFunctionExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.contentExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.contextItemDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.copyNamespacesDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.countClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.currentItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatParam] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatParamName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatParamValue] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.defaultCollationDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.defaultElementNamespace] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.dynamicFunctionInvocationExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.elementName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.emptyOrderingDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.emptyOrderingMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.endExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.expr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.extensionExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.external] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.externalDefinition] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.firstOperand] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.forLetClauseItemExtensions] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionBody] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.groupByClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.groupVarInitialize] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.groupingSpec] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.inheritMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.inlineFunctionExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.itemType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.kindTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.libraryModule] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.moduleDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.moduleImport] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.name] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.namespacePrefix] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.namespaceTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nextItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nillable] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.occurrenceIndicator] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.operand] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.operatorExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.optional] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderByClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderByExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderBySpec] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderModifier] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderedExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderingKind] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderingModeDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.param] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.paramList] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.paramTypeList] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.parenthesizedItemType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragma] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragmaContents] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragmaName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.predicateExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prefix] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prefixExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.preserveMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.previousItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prologPartOneItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prologPartTwoItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.quantifiedExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.quantifiedExprInClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.quantifier] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.resultExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.schemaAttributeTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.schemaElementTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.schemaImport] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.secondOperand] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.sequenceType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.sequenceTypeUnion] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.singleType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.slidingWindowClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.sourceExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.stable] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.star] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.startExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.switchCaseExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.switchExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.switchExprCaseClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.switchExprDefaultClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.targetLocation] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.targetNamespace] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.treatExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.tryCatchExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.tryClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.tumblingWindowClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeDeclaration] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typedFunctionTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typedVariableBinding] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeswitchExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeswitchExprCaseClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeswitchExprDefaultClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.unorderedExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.uri] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.validateExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.validationMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.value] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.valueExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.varDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.varName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.varValue] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.variableBinding] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.versionDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.voidSequenceType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.whereClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.winEndExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.winStartExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.windowClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.windowEndCondition] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.windowStartCondition] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.windowVars] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX["default"]] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nondeterministic] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.onlyEnd] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prefix] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX["private"]] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.addOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1, op1;
		a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] >= 0) {
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
				var a2, op2;
				a2 = Fleur.Atomize(n);
				op2 = Fleur.toJSNumber(a2);
				if (op2[0] < 0) {
					Fleur.callback(function() {callback(a2);});
					return;
				}
				a1.data = String(op1[1] + op2[1]);
				a1.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
				Fleur.callback(function() {callback(a1);});
			});
		} else {
			Fleur.callback(function() {callback(a1);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.andOp] = function(ctx, children, callback) {
	var op1;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSBoolean(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (!op1[1]) {
			a1.data = "false";
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		} else {
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
				var op2;
				var a2 = Fleur.Atomize(n);
				op2 = Fleur.toJSBoolean(a2);
				if (op2[0] < 0) {
					Fleur.callback(function() {callback(n);});
					return;
				}
				a2.data = String(op2[1]);
				a2.schemaTypeInfo = Fleur.Type_boolean;
				Fleur.callback(function() {callback(a2);});
			});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.divOp] = function(ctx, children, callback) {
	var op1, op2;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			a1.data = "" + (op1[1] / op2[1]);
			a1.schemaTypeInfo = op1[0] === 0 && op2[0] === 0 ? Fleur.Type_decimal : Fleur.numericTypes[Math.max(op1[0], op2[0])];
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.eqOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, function(op1, op2) {
		if (op1.schemaTypeInfo === Fleur.Type_string && op2.schemaTypeInfo === Fleur.Type_string) {
			return op1.data.localeCompare(op2.data) === 0;
		}
		if (Fleur.numericTypes.indexOf(op1.schemaTypeInfo) !== -1 && Fleur.numericTypes.indexOf(op2.schemaTypeInfo) !== -1) {
			var v1, v2;
			if (op1.schemaTypeInfo === Fleur.Type_integer) {
				v1 = parseInt(op1.data, 10);
			} else if (op1.schemaTypeInfo === Fleur.Type_decimal) {
				v1 = parseFloat(op1.data);
			} else if (op1.schemaTypeInfo === Fleur.Type_float || op1.schemaTypeInfo === Fleur.Type_double) {
				if (op1.data === "INF" || op1.data === "-INF" || op1.data === "NaN") {
					v1 = op1.data;
				} else {
					v1 = parseFloat(op1.data);
				}
			} else if (op1.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				v1 = parseInt(op1.data, 10);
			} else if (op1.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				v1 = parseFloat(op1.data);
			} else if (op1.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || op1.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				if (op1.data === "INF" || op1.data === "-INF" || op1.data === "NaN") {
					v1 = op1.data;
				} else {
					v1 = parseFloat(op1.data);
				}
			}
			if (op2.schemaTypeInfo === Fleur.Type_integer) {
				v2 = parseInt(op2.data, 10);
			} else if (op2.schemaTypeInfo === Fleur.Type_decimal) {
				v2 = parseFloat(op2.data);
			} else if (op2.schemaTypeInfo === Fleur.Type_float || op2.schemaTypeInfo === Fleur.Type_double) {
				if (op2.data === "INF" || op2.data === "-INF" || op2.data === "NaN") {
					v2 = op2.data;
				} else {
					v2 = parseFloat(op2.data);
				}
			} else if (op2.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				v2 = parseInt(op2.data, 10);
			} else if (op2.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				v2 = parseFloat(op2.data);
			} else if (op2.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || op2.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				if (op2.data === "INF" || op2.data === "-INF" || op2.data === "NaN") {
					v2 = op2.data;
				} else {
					v2 = parseFloat(op2.data);
				}
			}
			return v1 !== "NaN" && v2 !== "NaN" && v1 === v2;
		}
		return op1.schemaTypeInfo === op2.schemaTypeInfo && op1.data === op2.data;
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.equalOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string && op2.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) === 0 :
			op1.schemaTypeInfo === op2.schemaTypeInfo && op1.data === op2.data;
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.geOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) >= 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") >= (op2.data === "true") :
			parseFloat(op1.data) >= parseFloat(op2.data);
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.greaterThanOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) > 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") > (op2.data === "true") :
			parseFloat(op1.data) > parseFloat(op2.data);
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.greaterThanOrEqualOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) >= 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") >= (op2.data === "true") :
			parseFloat(op1.data) >= parseFloat(op2.data);
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.gtOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) > 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") > (op2.data === "true") :
			parseFloat(op1.data) > parseFloat(op2.data);
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.idivOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2, divres;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			divres = op1[1] / op2[1];
			a1.data = "" + (Math.floor(divres) + (divres >= 0 ? 0 : 1));
			a1.schemaTypeInfo = Fleur.Type_integer;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.leOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) <= 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") <= (op2.data === "true") :
			parseFloat(op1.data) <= parseFloat(op2.data);
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.lessThanOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) < 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") < (op2.data === "true") :
			parseFloat(op1.data) < parseFloat(op2.data);
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.lessThanOrEqualOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) <= 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") <= (op2.data === "true") :
			parseFloat(op1.data) <= parseFloat(op2.data);
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.ltOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) < 0 :
			op1.schemaTypeInfo === Fleur.Type_boolean ? (op1.data === "true") < (op2.data === "true") :
			parseFloat(op1.data) < parseFloat(op2.data);
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.modOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2, divres;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			divres = op1[1] / op2[1];
			a1.data = "" + (op1[1] - (Math.floor(divres) + (divres >= 0 ? 0 : 1)) * op2[1]);
			a1.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.multiplyOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			a1.data = "" + (op1[1] * op2[1]);
			a1.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.neOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string && op2.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) !== 0 :
			op1.schemaTypeInfo !== op2.schemaTypeInfo || op1.data !== op2.data;
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.notEqualOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, function(op1, op2) {
		return op1.schemaTypeInfo === Fleur.Type_string && op2.schemaTypeInfo === Fleur.Type_string ? op1.data.localeCompare(op2.data) !== 0 :
			op1.schemaTypeInfo !== op2.schemaTypeInfo || op1.data !== op2.data;
	}, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.orOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSBoolean(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (op1[1]) {
			a1.data = "true";
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		} else {
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
				var op2;
				var a2 = Fleur.Atomize(n);
				op2 = Fleur.toJSBoolean(a2);
				if (op2[0] < 0) {
					Fleur.callback(function() {callback(a2);});
					return;
				}
				a2.data = "" + op2[1];
				a2.schemaTypeInfo = Fleur.Type_boolean;
				Fleur.callback(function() {callback(a2);});
			});
		}
	});
};
 
Fleur.XQueryEngine[Fleur.XQueryX.stringConcatenateOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1 === Fleur.EmptySequence) {
			a1 = new Fleur.Text();
			a1.data = "";
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2.data) {
				a1.data += a2.data;
			}
			a1.schemaTypeInfo = Fleur.Type_string;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.subtractOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSNumber(a2);
			if (op1[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			a1.data = "" + (op1[1] - op2[1]);
			a1.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.arithmeticOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.comparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.exceptOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.generalComparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.intersectOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.isOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.logicalOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nodeAfterOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nodeBeforeOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nodeComparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderComparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.setOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.stringOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.unionOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.valueComparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.unaryMinusOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op;
		var a = Fleur.Atomize(n);
		op = Fleur.toJSNumber(a);
		if (op[0] < 0) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		a.data = "" + (- op[1]);
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.unaryPlusOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op;
		var a = Fleur.Atomize(n);
		op = Fleur.toJSNumber(a);
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.callback_period = 1000;
Fleur.callback_counter = 0;
Fleur.callback = function(cb) {
	if (Fleur.callback_counter === 0) {
		Fleur.callback_counter = Fleur.callback_period;
		setImmediate(cb);
		return;
	}
	Fleur.callback_counter--;
	cb();
};
Fleur.error = function(ctx, ename, emessage) {
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:" + ename);
	if (emessage) {
		a.data = emessage;
	}
	return a;
};
Fleur.toJSNumber = function(a) {
	if (a.nodeType === Fleur.Node.TEXT_NODE) {
		if (a.schemaTypeInfo === Fleur.Type_integer) {
			return [0, parseInt(a.data, 10)];
		} else if (a.schemaTypeInfo === Fleur.Type_decimal) {
			return [1, parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_float) {
			return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_double || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [0, parseInt(a.data, 10)];
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [1, parseFloat(a.data)];
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		return [-1];
	} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		a.nodeType = Fleur.Node.TEXT_NODE;
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0005");
		return [-1];
	}
	a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSString = function(a) {
	if (a === Fleur.EmptySequence) {
		return [0];
	}
	if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, a.data];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSBoolean = function(a) {
	var value;
	if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		return [0, a.childNodes.length !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_boolean) {
		return [0, a.data === "true"];
	} else if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, a.data.length !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_integer) {
		value = parseInt(a.data, 10);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
		value = parseFloat(a.data);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data === "true"];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data.length !== 0];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = parseInt(a.data, 10);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = parseFloat(a.data);
		return [0, !isNaN(value) && value !== 0];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSObject = function(a) {
	if (a.nodeType === Fleur.Node.MAP_NODE) {
		var o = {};
		var i = 0;
		var l = a.entries.length;
		while (i < l) {
			o[a.entries[i].nodeName] = a.entries[i].textContent;
			i++;
		}
		return [0, o];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toContentType = function(o) {
	var s;
	if (o["media-type"]) {
		s = o["media-type"];
	} else {
		switch (o.method) {
			case "html":
				s = "text/html";
				break;
			case "xml":
			default: s = "application/xml";
		}
	}
	if (o.encoding) {
		s += "; charset=\"" + o.encoding + "\"";
	}
	for (var p in o) {
		if (o.hasOwnProperty(p) && p !== "media-type" && p !== "encoding") {
			s += "; " + p + "=\"" + o[p] + "\"";
		}
	}
	return s;
};
Fleur.XsltEngine = Fleur.XQueryEngine.slice(0);
Fleur.XsltX = {};
Fleur.XsltX._pattern2xpath = function(xqueryx) {
	var i, step, newaxis, t;
	switch (xqueryx[0]) {
		case Fleur.XQueryX.pathExpr:
			i = xqueryx[1].length - 1;
			newaxis = "self";
			t = [];
			while (i >= 0) {
				step = xqueryx[1][i];
				switch (step[0]) {
					case Fleur.XQueryX.rootExpr:
						t.push([Fleur.XQueryX.stepExpr, [[Fleur.XQueryX.xpathAxis, [newaxis]], [Fleur.XQueryX.documentTest, []]]]);
						break;
					case Fleur.XQueryX.stepExpr:
						if (step[1][0][0] === Fleur.XQueryX.xpathAxis &&
						    step[1][0][1][0] === "descendant-or-self" &&
							step[1][1][0] === Fleur.XQueryX.anyKindTest) {
							newaxis = "ancestor";
						} else {
							t.push([Fleur.XQueryX.stepExpr, [[Fleur.XQueryX.xpathAxis, [newaxis]], step[1][1]]]);
							newaxis = "parent";
						}
						break;
				}
				i--;
			}
			xqueryx[1] = t;
			break;
		case Fleur.XQueryX.unionOp:
			Fleur.XsltX._pattern2xpath(xqueryx[1][0][1][0]);
			Fleur.XsltX._pattern2xpath(xqueryx[1][1][1][0]);
			break;
	}
};
Fleur.XsltXNames = [["http://www.w3.org/2005/XQueryX", "http://www.w3.org/2000/xmlns/", "http://www.w3.org/2001/XMLSchema-instance", "http://www.w3.org/1999/XSL/Transform", "http://www.w3.org/1999/XSL/Transform/expression", "http://www.w3.org/1999/XSL/Transform/avt", "http://www.w3.org/1999/XSL/Transform/pattern"], Fleur.XQueryXNames[1]];
Fleur.XsltXNames[1][Fleur.XsltX.accept = Fleur.Xlength++] = [1, 3, "xsl:accept"];
Fleur.XsltXNames[1][Fleur.XsltX.accumulator = Fleur.Xlength++] = [1, 3, "xsl:accumulator"];
Fleur.XsltXNames[1][Fleur.XsltX.assert = Fleur.Xlength++] = [1, 3, "xsl:assert"];
Fleur.XsltXNames[1][Fleur.XsltX.attribute = Fleur.Xlength++] = [1, 3, "xsl:attribute"];
Fleur.XsltXNames[1][Fleur.XsltX["break"] = Fleur.Xlength++] = [1, 3, "xsl:break"];
Fleur.XsltXNames[1][Fleur.XsltX["catch"] = Fleur.Xlength++] = [1, 3, "xsl:catch"];
Fleur.XsltXNames[1][Fleur.XsltX.choose = Fleur.Xlength++] = [1, 3, "xsl:choose"];
Fleur.XsltXNames[1][Fleur.XsltX.comment = Fleur.Xlength++] = [1, 3, "xsl:comment"];
Fleur.XsltXNames[1][Fleur.XsltX.copy = Fleur.Xlength++] = [1, 3, "xsl:copy"];
Fleur.XsltXNames[1][Fleur.XsltX.document = Fleur.Xlength++] = [1, 3, "xsl:document"];
Fleur.XsltXNames[1][Fleur.XsltX.element = Fleur.Xlength++] = [1, 3, "xsl:element"];
Fleur.XsltXNames[1][Fleur.XsltX.evaluate = Fleur.Xlength++] = [1, 3, "xsl:evaluate"];
Fleur.XsltXNames[1][Fleur.XsltX.expose = Fleur.Xlength++] = [1, 3, "xsl:expose"];
Fleur.XsltXNames[1][Fleur.XsltX.fallback = Fleur.Xlength++] = [1, 3, "xsl:fallback"];
Fleur.XsltXNames[1][Fleur.XsltX.fork = Fleur.Xlength++] = [1, 3, "xsl:fork"];
Fleur.XsltXNames[1][Fleur.XsltX["function"] = Fleur.Xlength++] = [1, 3, "xsl:function"];
Fleur.XsltXNames[1][Fleur.XsltX["if"] = Fleur.Xlength++] = [1, 3, "xsl:if"];
Fleur.XsltXNames[1][Fleur.XsltX["import"] = Fleur.Xlength++] = [1, 3, "xsl:import"];
Fleur.XsltXNames[1][Fleur.XsltX.include = Fleur.Xlength++] = [1, 3, "xsl:include"];
Fleur.XsltXNames[1][Fleur.XsltX.iterate = Fleur.Xlength++] = [1, 3, "xsl:iterate"];
Fleur.XsltXNames[1][Fleur.XsltX.key = Fleur.Xlength++] = [1, 3, "xsl:key"];
Fleur.XsltXNames[1][Fleur.XsltX.map = Fleur.Xlength++] = [1, 3, "xsl:map"];
Fleur.XsltXNames[1][Fleur.XsltX.merge = Fleur.Xlength++] = [1, 3, "xsl:merge"];
Fleur.XsltXNames[1][Fleur.XsltX.message = Fleur.Xlength++] = [1, 3, "xsl:message"];
Fleur.XsltXNames[1][Fleur.XsltX.mode = Fleur.Xlength++] = [1, 3, "xsl:mode"];
Fleur.XsltXNames[1][Fleur.XsltX.namespace = Fleur.Xlength++] = [1, 3, "xsl:namespace"];
Fleur.XsltXNames[1][Fleur.XsltX.number = Fleur.Xlength++] = [1, 3, "xsl:number"];
Fleur.XsltXNames[1][Fleur.XsltX.otherwise = Fleur.Xlength++] = [1, 3, "xsl:otherwise"];
Fleur.XsltXNames[1][Fleur.XsltX.output = Fleur.Xlength++] = [1, 3, "xsl:output"];
Fleur.XsltXNames[1][Fleur.XsltX.override = Fleur.Xlength++] = [1, 3, "xsl:override"];
Fleur.XsltXNames[1][Fleur.XsltX["package"] = Fleur.Xlength++] = [1, 3, "xsl:package"];
Fleur.XsltXNames[1][Fleur.XsltX.param = Fleur.Xlength++] = [1, 3, "xsl:param"];
Fleur.XsltXNames[1][Fleur.XsltX.sequence = Fleur.Xlength++] = [1, 3, "xsl:sequence"];
Fleur.XsltXNames[1][Fleur.XsltX.sort = Fleur.Xlength++] = [1, 3, "xsl:sort"];
Fleur.XsltXNames[1][Fleur.XsltX.stream = Fleur.Xlength++] = [1, 3, "xsl:stream"];
Fleur.XsltX.transform = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltX.stylesheet = Fleur.Xlength++] = [1, 3, "xsl:stylesheet"];
Fleur.XsltXNames[1][Fleur.XsltX.template = Fleur.Xlength++] = [1, 3, "xsl:template"];
Fleur.XsltXNames[1][Fleur.XsltX.text = Fleur.Xlength++] = [1, 3, "xsl:text"];
Fleur.XsltXNames[1][Fleur.XsltX["try"] = Fleur.Xlength++] = [1, 3, "xsl:try"];
Fleur.XsltXNames[1][Fleur.XsltX.variable = Fleur.Xlength++] = [1, 3, "xsl:variable"];
Fleur.XsltXNames[1][Fleur.XsltX.when = Fleur.Xlength++] = [1, 3, "xsl:when"];
Fleur.XsltXNames[1][Fleur.XsltX["accumulator-rule"] = Fleur.Xlength++] = [1, 3, "xsl:accumulator-rule"];
Fleur.XsltXNames[1][Fleur.XsltX["analyze-string"] = Fleur.Xlength++] = [1, 3, "xsl:analyze-string"];
Fleur.XsltXNames[1][Fleur.XsltX["apply-imports"] = Fleur.Xlength++] = [1, 3, "xsl:apply-imports"];
Fleur.XsltXNames[1][Fleur.XsltX["apply-templates"] = Fleur.Xlength++] = [1, 3, "xsl:apply-templates"];
Fleur.XsltXNames[1][Fleur.XsltX["attribute-set"] = Fleur.Xlength++] = [1, 3, "xsl:attribute-set"];
Fleur.XsltXNames[1][Fleur.XsltX["call-template"] = Fleur.Xlength++] = [1, 3, "xsl:call-template"];
Fleur.XsltXNames[1][Fleur.XsltX["character-map"] = Fleur.Xlength++] = [1, 3, "xsl:character-map"];
Fleur.XsltXNames[1][Fleur.XsltX["context-item"] = Fleur.Xlength++] = [1, 3, "xsl:context-item"];
Fleur.XsltXNames[1][Fleur.XsltX["copy-of"] = Fleur.Xlength++] = [1, 3, "xsl:copy-of"];
Fleur.XsltXNames[1][Fleur.XsltX["decimal-format"] = Fleur.Xlength++] = [1, 3, "xsl:decimal-format"];
Fleur.XsltXNames[1][Fleur.XsltX["for-each"] = Fleur.Xlength++] = [1, 3, "xsl:for-each"];
Fleur.XsltXNames[1][Fleur.XsltX["for-each-group"] = Fleur.Xlength++] = [1, 3, "xsl:for-each-group"];
Fleur.XsltXNames[1][Fleur.XsltX["import-schema"] = Fleur.Xlength++] = [1, 3, "xsl:import-schema"];
Fleur.XsltXNames[1][Fleur.XsltX["map-entry"] = Fleur.Xlength++] = [1, 3, "xsl:map-entry"];
Fleur.XsltXNames[1][Fleur.XsltX["matching-substring"] = Fleur.Xlength++] = [1, 3, "xsl:matching-substring"];
Fleur.XsltXNames[1][Fleur.XsltX["merge-action"] = Fleur.Xlength++] = [1, 3, "xsl:merge-action"];
Fleur.XsltXNames[1][Fleur.XsltX["merge-key"] = Fleur.Xlength++] = [1, 3, "xsl:merge-key"];
Fleur.XsltXNames[1][Fleur.XsltX["merge-source"] = Fleur.Xlength++] = [1, 3, "xsl:merge-source"];
Fleur.XsltXNames[1][Fleur.XsltX["namespace-alias"] = Fleur.Xlength++] = [1, 3, "xsl:namespace-alias"];
Fleur.XsltXNames[1][Fleur.XsltX["next-iteration"] = Fleur.Xlength++] = [1, 3, "xsl:next-iteration"];
Fleur.XsltXNames[1][Fleur.XsltX["next-match"] = Fleur.Xlength++] = [1, 3, "xsl:next-match"];
Fleur.XsltXNames[1][Fleur.XsltX["non-matching-substring"] = Fleur.Xlength++] = [1, 3, "xsl:non-matching-substring"];
Fleur.XsltXNames[1][Fleur.XsltX["on-completion"] = Fleur.Xlength++] = [1, 3, "xsl:on-completion"];
Fleur.XsltXNames[1][Fleur.XsltX["output-character"] = Fleur.Xlength++] = [1, 3, "xsl:output-character"];
Fleur.XsltXNames[1][Fleur.XsltX["perform-sort"] = Fleur.Xlength++] = [1, 3, "xsl:perform-sort"];
Fleur.XsltXNames[1][Fleur.XsltX["post-descent"] = Fleur.Xlength++] = [1, 3, "xsl:post-descent"];
Fleur.XsltXNames[1][Fleur.XsltX["preserve-space"] = Fleur.Xlength++] = [1, 3, "xsl:preserve-space"];
Fleur.XsltXNames[1][Fleur.XsltX["processing-instruction"] = Fleur.Xlength++] = [1, 3, "xsl:processing-instruction"];
Fleur.XsltXNames[1][Fleur.XsltX["result-document"] = Fleur.Xlength++] = [1, 3, "xsl:result-document"];
Fleur.XsltXNames[1][Fleur.XsltX["strip-space"] = Fleur.Xlength++] = [1, 3, "xsl:strip-space"];
Fleur.XsltXNames[1][Fleur.XsltX["use-package"] = Fleur.Xlength++] = [1, 3, "xsl:use-package"];
Fleur.XsltXNames[1][Fleur.XsltX["value-of"] = Fleur.Xlength++] = [1, 3, "xsl:value-of"];
Fleur.XsltXNames[1][Fleur.XsltX["with-param"] = Fleur.Xlength++] = [1, 3, "xsl:with-param"];
Fleur.XsltXattr = {};
Fleur.XsltXNames[1][Fleur.XsltXattr["NaN decimal-format"] = Fleur.Xlength++] = [2, 3, "NaN"];
Fleur.XsltXNames[1][Fleur.XsltXattr["applies-to accumulator"] = Fleur.Xlength++] = [1, 6, "patternx:applies-to"];
Fleur.XsltXattr["as accumulator"] = Fleur.Xlength;
Fleur.XsltXattr["as context-item"] = Fleur.Xlength;
Fleur.XsltXattr["as evaluate"] = Fleur.Xlength;
Fleur.XsltXattr["as function"] = Fleur.Xlength;
Fleur.XsltXattr["as param"] = Fleur.Xlength;
Fleur.XsltXattr["as template"] = Fleur.Xlength;
Fleur.XsltXattr["as variable"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["as with-param"] = Fleur.Xlength++] = [1, 4, "xsltx:as"];
Fleur.XsltXNames[1][Fleur.XsltXattr["base-uri evaluate"] = Fleur.Xlength++] = [1, 5, "avtx:base-uri"];
Fleur.XsltXattr["bind-group for-each-group"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["bind-group merge"] = Fleur.Xlength++] = [2, 3, "bind-group"];
Fleur.XsltXNames[1][Fleur.XsltXattr["bind-grouping-key for-each-group"] = Fleur.Xlength++] = [2, 3, "bind-grouping-key"];
Fleur.XsltXNames[1][Fleur.XsltXattr["bind-key merge"] = Fleur.Xlength++] = [2, 3, "bind-key"];
Fleur.XsltXNames[1][Fleur.XsltXattr["bind-source merge-source"] = Fleur.Xlength++] = [2, 3, "bind-source"];
Fleur.XsltXNames[1][Fleur.XsltXattr["byte-order-mark output"] = Fleur.Xlength++] = [2, 3, "byte-order-mark"];
Fleur.XsltXNames[1][Fleur.XsltXattr["byte-order-mark result-document"] = Fleur.Xlength++] = [1, 5, "avtx:byte-order-mark"];
Fleur.XsltXNames[1][Fleur.XsltXattr["cache function"] = Fleur.Xlength++] = [2, 3, "cache"];
Fleur.XsltXattr["case-order merge-key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["case-order sort"] = Fleur.Xlength++] = [1, 5, "avtx:case-order"];
Fleur.XsltXNames[1][Fleur.XsltXattr["cdata-section-elements output"] = Fleur.Xlength++] = [2, 3, "cdata-section-elements"];
Fleur.XsltXNames[1][Fleur.XsltXattr["cdata-section-elements result-document"] = Fleur.Xlength++] = [1, 5, "avtx:cdata-section-elements"];
Fleur.XsltXNames[1][Fleur.XsltXattr["character output-character"] = Fleur.Xlength++] = [2, 3, "character"];
Fleur.XsltXattr["collation key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["collation merge-key"] = Fleur.Xlength++] = [2, 3, "collation"];
Fleur.XsltXattr["collation for-each-group"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["collation sort"] = Fleur.Xlength++] = [1, 5, "avtx:collation"];
Fleur.XsltXattr["component accept"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["component expose"] = Fleur.Xlength++] = [2, 3, "component"];
Fleur.XsltXattr["composite for-each-group"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["composite key"] = Fleur.Xlength++] = [2, 3, "composite"];
Fleur.XsltXNames[1][Fleur.XsltXattr["context-item evaluate"] = Fleur.Xlength++] = [1, 4, "xsltx:context-item"];
Fleur.XsltXattr["copy-namespaces copy"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["copy-namespaces copy-of"] = Fleur.Xlength++] = [2, 3, "copy-namespaces"];
Fleur.XsltXNames[1][Fleur.XsltXattr["count number"] = Fleur.Xlength++] = [1, 6, "patternx:count"];
Fleur.XsltXattr["data-type merge-key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["data-type sort"] = Fleur.Xlength++] = [1, 5, "avtx:data-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["decimal-separator decimal-format"] = Fleur.Xlength++] = [2, 3, "decimal-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["default-collation *"] = Fleur.Xlength++] = [2, 3, "default-collation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["default-mode *"] = Fleur.Xlength++] = [2, 3, "default-mode"];
Fleur.XsltXNames[1][Fleur.XsltXattr["default-validation *"] = Fleur.Xlength++] = [2, 3, "default-validation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["digit decimal-format"] = Fleur.Xlength++] = [2, 3, "digit"];
Fleur.XsltXattr["disable-output-escaping text"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["disable-output-escaping value-of"] = Fleur.Xlength++] = [2, 3, "disable-output-escaping"];
Fleur.XsltXNames[1][Fleur.XsltXattr["doctype-public output"] = Fleur.Xlength++] = [2, 3, "doctype-public"];
Fleur.XsltXNames[1][Fleur.XsltXattr["doctype-public result-document"] = Fleur.Xlength++] = [1, 5, "avtx:doctype-public"];
Fleur.XsltXNames[1][Fleur.XsltXattr["doctype-system output"] = Fleur.Xlength++] = [2, 3, "doctype-system"];
Fleur.XsltXNames[1][Fleur.XsltXattr["doctype-system result-document"] = Fleur.Xlength++] = [1, 5, "avtx:doctype-system"];
Fleur.XsltXNames[1][Fleur.XsltXattr["elements strip-space"] = Fleur.Xlength++] = [1, 4, "xsltx:elements"];
Fleur.XsltXNames[1][Fleur.XsltXattr["encoding output"] = Fleur.Xlength++] = [2, 3, "encoding"];
Fleur.XsltXNames[1][Fleur.XsltXattr["encoding result-document"] = Fleur.Xlength++] = [1, 5, "avtx:encoding"];
Fleur.XsltXattr["error-code assert"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["error-code message"] = Fleur.Xlength++] = [1, 5, "avtx:error-code"];
Fleur.XsltXNames[1][Fleur.XsltXattr["errors catch"] = Fleur.Xlength++] = [2, 3, "errors"];
Fleur.XsltXNames[1][Fleur.XsltXattr["escape-uri-attributes output"] = Fleur.Xlength++] = [2, 3, "escape-uri-attributes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["escape-uri-attributes result-document"] = Fleur.Xlength++] = [1, 5, "avtx:escape-uri-attributes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["exclude-result-prefixes *"] = Fleur.Xlength++] = [2, 3, "exclude-result-prefixes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["expand-text *"] = Fleur.Xlength++] = [2, 3, "expand-text"];
Fleur.XsltXNames[1][Fleur.XsltXattr["extension-element-prefixes *"] = Fleur.Xlength++] = [2, 3, "extension-element-prefixes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["flags analyze-string"] = Fleur.Xlength++] = [1, 5, "avtx:flags"];
Fleur.XsltXNames[1][Fleur.XsltXattr["for-each merge-source"] = Fleur.Xlength++] = [1, 4, "xsltx:for-each"];
Fleur.XsltXattr["format number"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["format result-document"] = Fleur.Xlength++] = [1, 5, "avtx:format"];
Fleur.XsltXNames[1][Fleur.XsltXattr["from number"] = Fleur.Xlength++] = [1, 6, "patternx:from"];
Fleur.XsltXNames[1][Fleur.XsltXattr["group-adjacent for-each-group"] = Fleur.Xlength++] = [1, 4, "xsltx:group-adjacent"];
Fleur.XsltXNames[1][Fleur.XsltXattr["group-by for-each-group"] = Fleur.Xlength++] = [1, 4, "xsltx:group-by"];
Fleur.XsltXNames[1][Fleur.XsltXattr["group-ending-with for-each-group"] = Fleur.Xlength++] = [1, 6, "patternx:group-ending-with"];
Fleur.XsltXNames[1][Fleur.XsltXattr["group-starting-with for-each-group"] = Fleur.Xlength++] = [1, 6, "patternx:group-starting-with"];
Fleur.XsltXNames[1][Fleur.XsltXattr["grouping-separator decimal-format"] = Fleur.Xlength++] = [2, 3, "grouping-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["grouping-separator number"] = Fleur.Xlength++] = [1, 5, "avtx:grouping-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["grouping-size number"] = Fleur.Xlength++] = [1, 5, "avtx:grouping-size"];
Fleur.XsltXattr["href import"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["href include"] = Fleur.Xlength++] = [2, 3, "href"];
Fleur.XsltXattr["href result-document"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["href stream"] = Fleur.Xlength++] = [1, 5, "avtx:href"];
Fleur.XsltXNames[1][Fleur.XsltXattr["html-version output"] = Fleur.Xlength++] = [2, 3, "html-version"];
Fleur.XsltXNames[1][Fleur.XsltXattr["html-version result-document"] = Fleur.Xlength++] = [1, 5, "avtx:html-version"];
Fleur.XsltXattr["id stylesheet"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["id transform"] = Fleur.Xlength++] = [2, 3, "id"];
Fleur.XsltXNames[1][Fleur.XsltXattr["identity-sensitive function"] = Fleur.Xlength++] = [2, 3, "identity-sensitive"];
Fleur.XsltXNames[1][Fleur.XsltXattr["include-content-type output"] = Fleur.Xlength++] = [2, 3, "include-content-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["include-content-type result-document"] = Fleur.Xlength++] = [1, 5, "avtx:include-content-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["indent output"] = Fleur.Xlength++] = [2, 3, "indent"];
Fleur.XsltXNames[1][Fleur.XsltXattr["indent result-document"] = Fleur.Xlength++] = [1, 5, "avtx:indent"];
Fleur.XsltXNames[1][Fleur.XsltXattr["infinity decimal-format"] = Fleur.Xlength++] = [2, 3, "infinity"];
Fleur.XsltXattr["inherit-namespaces copy"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["inherit-namespaces element"] = Fleur.Xlength++] = [2, 3, "inherit-namespaces"];
Fleur.XsltXNames[1][Fleur.XsltXattr["initial-value accumulator"] = Fleur.Xlength++] = [1, 4, "xsltx:initial-value"];
Fleur.XsltXattr["input-type-annotations package"] = Fleur.Xlength;
Fleur.XsltXattr["input-type-annotations stylesheet"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["input-type-annotations transform"] = Fleur.Xlength++] = [2, 3, "input-type-annotations"];
Fleur.XsltXNames[1][Fleur.XsltXattr["item-separator output"] = Fleur.Xlength++] = [2, 3, "item-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["item-separator result-document"] = Fleur.Xlength++] = [1, 5, "avtx:item-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["key map-entry"] = Fleur.Xlength++] = [1, 4, "xsltx:key"];
Fleur.XsltXattr["lang merge-key"] = Fleur.Xlength;
Fleur.XsltXattr["lang number"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["lang sort"] = Fleur.Xlength++] = [1, 5, "avtx:lang"];
Fleur.XsltXNames[1][Fleur.XsltXattr["letter-value number"] = Fleur.Xlength++] = [1, 5, "avtx:letter-value"];
Fleur.XsltXNames[1][Fleur.XsltXattr["level number"] = Fleur.Xlength++] = [2, 3, "level"];
Fleur.XsltXattr["match accumulator-rule"] = Fleur.Xlength;
Fleur.XsltXattr["match key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["match template"] = Fleur.Xlength++] = [1, 6, "patternx:match"];
Fleur.XsltXNames[1][Fleur.XsltXattr["media-type output"] = Fleur.Xlength++] = [2, 3, "media-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["media-type result-document"] = Fleur.Xlength++] = [1, 5, "avtx:media-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["method output"] = Fleur.Xlength++] = [2, 3, "method"];
Fleur.XsltXNames[1][Fleur.XsltXattr["method result-document"] = Fleur.Xlength++] = [1, 5, "avtx:method"];
Fleur.XsltXNames[1][Fleur.XsltXattr["minus-sign decimal-format"] = Fleur.Xlength++] = [2, 3, "minus-sign"];
Fleur.XsltXattr["mode apply-templates"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["mode template"] = Fleur.Xlength++] = [2, 3, "mode"];
Fleur.XsltXattr["name accumulator"] = Fleur.Xlength;
Fleur.XsltXattr["name attribute-set"] = Fleur.Xlength;
Fleur.XsltXattr["name call-template"] = Fleur.Xlength;
Fleur.XsltXattr["name character-map"] = Fleur.Xlength;
Fleur.XsltXattr["name decimal-format"] = Fleur.Xlength;
Fleur.XsltXattr["name function"] = Fleur.Xlength;
Fleur.XsltXattr["name key"] = Fleur.Xlength;
Fleur.XsltXattr["name mode"] = Fleur.Xlength;
Fleur.XsltXattr["name output"] = Fleur.Xlength;
Fleur.XsltXattr["name package"] = Fleur.Xlength;
Fleur.XsltXattr["name param"] = Fleur.Xlength;
Fleur.XsltXattr["name template"] = Fleur.Xlength;
Fleur.XsltXattr["name use-package"] = Fleur.Xlength;
Fleur.XsltXattr["name variable"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["name with-param"] = Fleur.Xlength++] = [2, 3, "name"];
Fleur.XsltXattr["name attribute"] = Fleur.Xlength;
Fleur.XsltXattr["name element"] = Fleur.Xlength;
Fleur.XsltXattr["name namespace"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["name processing-instruction"] = Fleur.Xlength++] = [1, 5, "avtx:name"];
Fleur.XsltXattr["names accept"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["names expose"] = Fleur.Xlength++] = [2, 3, "names"];
Fleur.XsltXNames[1][Fleur.XsltXattr["namespace import-schema"] = Fleur.Xlength++] = [2, 3, "namespace"];
Fleur.XsltXattr["namespace attribute"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["namespace element"] = Fleur.Xlength++] = [1, 5, "avtx:namespace"];
Fleur.XsltXNames[1][Fleur.XsltXattr["namespace-context evaluate"] = Fleur.Xlength++] = [1, 4, "xsltx:namespace-context"];
Fleur.XsltXNames[1][Fleur.XsltXattr["new-value accumulator-rule"] = Fleur.Xlength++] = [1, 4, "xsltx:new-value"];
Fleur.XsltXNames[1][Fleur.XsltXattr["normalization-form output"] = Fleur.Xlength++] = [2, 3, "normalization-form"];
Fleur.XsltXNames[1][Fleur.XsltXattr["normalization-form result-document"] = Fleur.Xlength++] = [1, 5, "avtx:normalization-form"];
Fleur.XsltXNames[1][Fleur.XsltXattr["omit-xml-declaration output"] = Fleur.Xlength++] = [2, 3, "omit-xml-declaration"];
Fleur.XsltXNames[1][Fleur.XsltXattr["omit-xml-declaration result-document"] = Fleur.Xlength++] = [1, 5, "avtx:omit-xml-declaration"];
Fleur.XsltXattr["on-empty attribute"] = Fleur.Xlength;
Fleur.XsltXattr["on-empty copy"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["on-empty element"] = Fleur.Xlength++] = [1, 4, "xsltx:on-empty"];
Fleur.XsltXNames[1][Fleur.XsltXattr["on-multiple-match mode"] = Fleur.Xlength++] = [2, 3, "on-multiple-match"];
Fleur.XsltXNames[1][Fleur.XsltXattr["on-no-match mode"] = Fleur.Xlength++] = [2, 3, "on-no-match"];
Fleur.XsltXattr["order merge-key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["order sort"] = Fleur.Xlength++] = [1, 5, "avtx:order"];
Fleur.XsltXNames[1][Fleur.XsltXattr["ordinal number"] = Fleur.Xlength++] = [1, 5, "avtx:ordinal"];
Fleur.XsltXNames[1][Fleur.XsltXattr["output-version result-document"] = Fleur.Xlength++] = [1, 5, "avtx:output-version"];
Fleur.XsltXNames[1][Fleur.XsltXattr["override function"] = Fleur.Xlength++] = [2, 3, "override"];
Fleur.XsltXNames[1][Fleur.XsltXattr["override-extension-function function"] = Fleur.Xlength++] = [2, 3, "override-extension-function"];
Fleur.XsltXattr["package-version package"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["package-version use-package"] = Fleur.Xlength++] = [2, 3, "package-version"];
Fleur.XsltXNames[1][Fleur.XsltXattr["parameter-document output"] = Fleur.Xlength++] = [2, 3, "parameter-document"];
Fleur.XsltXNames[1][Fleur.XsltXattr["parameter-document result-document"] = Fleur.Xlength++] = [1, 5, "avtx:parameter-document"];
Fleur.XsltXNames[1][Fleur.XsltXattr["pattern-separator decimal-format"] = Fleur.Xlength++] = [2, 3, "pattern-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["per-mille decimal-format"] = Fleur.Xlength++] = [2, 3, "per-mille"];
Fleur.XsltXNames[1][Fleur.XsltXattr["percent decimal-format"] = Fleur.Xlength++] = [2, 3, "percent"];
Fleur.XsltXNames[1][Fleur.XsltXattr["phase accumulator-rule"] = Fleur.Xlength++] = [2, 3, "phase"];
Fleur.XsltXNames[1][Fleur.XsltXattr["priority template"] = Fleur.Xlength++] = [2, 3, "priority"];
Fleur.XsltXNames[1][Fleur.XsltXattr["regex analyze-string"] = Fleur.Xlength++] = [1, 5, "avtx:regex"];
Fleur.XsltXNames[1][Fleur.XsltXattr["required param"] = Fleur.Xlength++] = [2, 3, "required"];
Fleur.XsltXNames[1][Fleur.XsltXattr["result-prefix namespace-alias"] = Fleur.Xlength++] = [2, 3, "result-prefix"];
Fleur.XsltXNames[1][Fleur.XsltXattr["schema-aware evaluate"] = Fleur.Xlength++] = [1, 5, "avtx:schema-aware"];
Fleur.XsltXNames[1][Fleur.XsltXattr["schema-location import-schema"] = Fleur.Xlength++] = [2, 3, "schema-location"];
Fleur.XsltXattr["select analyze-string"] = Fleur.Xlength;
Fleur.XsltXattr["select apply-templates"] = Fleur.Xlength;
Fleur.XsltXattr["select assert"] = Fleur.Xlength;
Fleur.XsltXattr["select attribute"] = Fleur.Xlength;
Fleur.XsltXattr["select break"] = Fleur.Xlength;
Fleur.XsltXattr["select catch"] = Fleur.Xlength;
Fleur.XsltXattr["select comment"] = Fleur.Xlength;
Fleur.XsltXattr["select copy"] = Fleur.Xlength;
Fleur.XsltXattr["select copy-of"] = Fleur.Xlength;
Fleur.XsltXattr["select for-each"] = Fleur.Xlength;
Fleur.XsltXattr["select for-each-group"] = Fleur.Xlength;
Fleur.XsltXattr["select iterate"] = Fleur.Xlength;
Fleur.XsltXattr["select map-entry"] = Fleur.Xlength;
Fleur.XsltXattr["select merge-key"] = Fleur.Xlength;
Fleur.XsltXattr["select merge-source"] = Fleur.Xlength;
Fleur.XsltXattr["select message"] = Fleur.Xlength;
Fleur.XsltXattr["select namespace"] = Fleur.Xlength;
Fleur.XsltXattr["select number"] = Fleur.Xlength;
Fleur.XsltXattr["select on-completion"] = Fleur.Xlength;
Fleur.XsltXattr["select param"] = Fleur.Xlength;
Fleur.XsltXattr["select perform-sort"] = Fleur.Xlength;
Fleur.XsltXattr["select processing-instruction"] = Fleur.Xlength;
Fleur.XsltXattr["select sequence"] = Fleur.Xlength;
Fleur.XsltXattr["select sort"] = Fleur.Xlength;
Fleur.XsltXattr["select try"] = Fleur.Xlength;
Fleur.XsltXattr["select value-of"] = Fleur.Xlength;
Fleur.XsltXattr["select variable"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["select with-param"] = Fleur.Xlength++] = [1, 4, "xsltx:select"];
Fleur.XsltXattr["separator attribute"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["separator value-of"] = Fleur.Xlength++] = [1, 5, "avtx:separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["sort-before-merge merge-source"] = Fleur.Xlength++] = [2, 3, "sort-before-merge"];
Fleur.XsltXNames[1][Fleur.XsltXattr["stable sort"] = Fleur.Xlength++] = [1, 5, "avtx:stable"];
Fleur.XsltXNames[1][Fleur.XsltXattr["standalone output"] = Fleur.Xlength++] = [2, 3, "standalone"];
Fleur.XsltXNames[1][Fleur.XsltXattr["standalone result-document"] = Fleur.Xlength++] = [1, 5, "avtx:standalone"];
Fleur.XsltXNames[1][Fleur.XsltXattr["start-at number"] = Fleur.Xlength++] = [1, 5, "avtx:start-at"];
Fleur.XsltXattr["static param"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["static variable"] = Fleur.Xlength++] = [2, 3, "static"];
Fleur.XsltXattr["streamable accumulator"] = Fleur.Xlength;
Fleur.XsltXattr["streamable attribute-set"] = Fleur.Xlength;
Fleur.XsltXattr["streamable merge-source"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["streamable mode"] = Fleur.Xlength++] = [2, 3, "streamable"];
Fleur.XsltXNames[1][Fleur.XsltXattr["string output-character"] = Fleur.Xlength++] = [2, 3, "string"];
Fleur.XsltXNames[1][Fleur.XsltXattr["stylesheet-prefix namespace-alias"] = Fleur.Xlength++] = [2, 3, "stylesheet-prefix"];
Fleur.XsltXNames[1][Fleur.XsltXattr["suppress-indentation output"] = Fleur.Xlength++] = [2, 3, "suppress-indentation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["suppress-indentation result-document"] = Fleur.Xlength++] = [1, 5, "avtx:suppress-indentation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["terminate message"] = Fleur.Xlength++] = [1, 5, "avtx:terminate"];
Fleur.XsltXattr["test assert"] = Fleur.Xlength;
Fleur.XsltXattr["test if"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["test when"] = Fleur.Xlength++] = [1, 4, "xsltx:test"];
Fleur.XsltXattr["tunnel param"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["tunnel with-param"] = Fleur.Xlength++] = [2, 3, "tunnel"];
Fleur.XsltXattr["type attribute"] = Fleur.Xlength;
Fleur.XsltXattr["type copy"] = Fleur.Xlength;
Fleur.XsltXattr["type copy-of"] = Fleur.Xlength;
Fleur.XsltXattr["type document"] = Fleur.Xlength;
Fleur.XsltXattr["type element"] = Fleur.Xlength;
Fleur.XsltXattr["type result-document"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["type stream"] = Fleur.Xlength++] = [2, 3, "type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["typed mode"] = Fleur.Xlength++] = [2, 3, "typed"];
Fleur.XsltXNames[1][Fleur.XsltXattr["undeclare-prefixes output"] = Fleur.Xlength++] = [2, 3, "undeclare-prefixes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["undeclare-prefixes result-document"] = Fleur.Xlength++] = [1, 5, "avtx:undeclare-prefixes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["use context-item"] = Fleur.Xlength++] = [2, 3, "use"];
Fleur.XsltXNames[1][Fleur.XsltXattr["use key"] = Fleur.Xlength++] = [1, 4, "xsltx:use"];
Fleur.XsltXattr["use-attribute-sets attribute-set"] = Fleur.Xlength;
Fleur.XsltXattr["use-attribute-sets copy"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["use-attribute-sets element"] = Fleur.Xlength++] = [2, 3, "use-attribute-sets"];
Fleur.XsltXattr["use-character-maps character-map"] = Fleur.Xlength;
Fleur.XsltXattr["use-character-maps output"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["use-character-maps result-document"] = Fleur.Xlength++] = [2, 3, "use-character-maps"];
Fleur.XsltXNames[1][Fleur.XsltXattr["use-when *"] = Fleur.Xlength++] = [1, 4, "xsltx:use-when"];
Fleur.XsltXattr["validation attribute"] = Fleur.Xlength;
Fleur.XsltXattr["validation copy"] = Fleur.Xlength;
Fleur.XsltXattr["validation copy-of"] = Fleur.Xlength;
Fleur.XsltXattr["validation document"] = Fleur.Xlength;
Fleur.XsltXattr["validation element"] = Fleur.Xlength;
Fleur.XsltXattr["validation result-document"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["validation stream"] = Fleur.Xlength++] = [2, 3, "validation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["value number"] = Fleur.Xlength++] = [1, 4, "xsltx:value"];
Fleur.XsltXNames[1][Fleur.XsltXattr["version *"] = Fleur.Xlength++] = [2, 3, "version"];
Fleur.XsltXattr["visibility accept"] = Fleur.Xlength;
Fleur.XsltXattr["visibility accumulator"] = Fleur.Xlength;
Fleur.XsltXattr["visibility attribute-set"] = Fleur.Xlength;
Fleur.XsltXattr["visibility expose"] = Fleur.Xlength;
Fleur.XsltXattr["visibility function"] = Fleur.Xlength;
Fleur.XsltXattr["visibility mode"] = Fleur.Xlength;
Fleur.XsltXattr["visibility param"] = Fleur.Xlength;
Fleur.XsltXattr["visibility template"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["visibility variable"] = Fleur.Xlength++] = [2, 3, "visibility"];
Fleur.XsltXNames[1][Fleur.XsltXattr["warning-on-multiple-match mode"] = Fleur.Xlength++] = [2, 3, "warning-on-multiple-match"];
Fleur.XsltXNames[1][Fleur.XsltXattr["warning-on-no-match mode"] = Fleur.Xlength++] = [2, 3, "warning-on-no-match"];
Fleur.XsltXNames[1][Fleur.XsltXattr["with-params evaluate"] = Fleur.Xlength++] = [1, 4, "xsltx:with-params"];
Fleur.XsltXNames[1][Fleur.XsltXattr["xpath evaluate"] = Fleur.Xlength++] = [1, 4, "xsltx:xpath"];
Fleur.XsltXNames[1][Fleur.XsltXattr["xpath-default-namespace *"] = Fleur.Xlength++] = [2, 3, "xpath-default-namespace"];
Fleur.XsltXNames[1][Fleur.XsltXattr["zero-digit decimal-format"] = Fleur.Xlength++] = [2, 3, "zero-digit"];
Fleur.XsltXNames[1][Fleur.XsltX.xslt = Fleur.Xlength++] = [2, 1, "xmlns:xsl"];
Fleur.XsltXNames[1][Fleur.XsltX.xsltx = Fleur.Xlength++] = [2, 1, "xmlns:xsltx"];
Fleur.XsltXNames[1][Fleur.XsltX.avtx = Fleur.Xlength++] = [2, 1, "xmlns:avtx"];
Fleur.XsltXNames[1][Fleur.XsltX.patternx = Fleur.Xlength++] = [2, 1, "xmlns:patternx"];
Fleur.XsltStylesheet = function() {};
Fleur.XsltStylesheet.prototype = new Array();
Fleur.XsltEngine[Fleur.XsltXattr["match template"]] = function(ctx, children) {
	ctx.match = children[0];
};
Fleur.XsltEngine[Fleur.XsltXattr["mode template"]] = function(ctx, children) {
	ctx.mode = children[0];
};
Fleur.XsltEngine[Fleur.XsltXattr["priority template"]] = function(ctx, children) {
	ctx.priority = children[0];
};
Fleur.XsltEngine[Fleur.XsltX.stylesheet] = function(ctx, children) {
	var i = 0, l;
	l = children.length;
	while (i < l) {
		Fleur.XsltEngine[children[i][0]](ctx, children[i][1]);
		i++;
	}
};
Fleur.XsltEngine[Fleur.XsltX.template] = function(ctx, children) {
	var i = 0, l, template = {};
	l = children.length;
	while (i < l) {
		if (Fleur.XsltXNames[1][children[i][0]][0] !== 2 && Fleur.XsltXNames[1][children[i][0]][1] !== 4 && Fleur.XsltXNames[1][children[i][0]][1] !== 5) {
			break;
		}
		Fleur.XsltEngine[children[i][0]](template, children[i][1]);
		i++;
	}
	template.mode = template.mode || "#default";
	if (template.name) {
		ctx.template[1][template.name] = [template, children.slice(i)];
	}
	if (template.match) {
		if (ctx.template[0][template.mode]) {
			ctx.template[0][template.mode].push([template, children.slice(i)]);
		} else {
			ctx.template[0][template.mode] = [[template, children.slice(i)]];
		}
	}
};
Fleur.XsltEngine[Fleur.XsltX.accept] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.accumulator] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.assert] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.attribute] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["break"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["catch"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.choose] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.comment] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.copy] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.document] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.element] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.evaluate] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.expose] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.fallback] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.fork] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["if"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["import"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.include] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.iterate] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.key] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.map] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.merge] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.message] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.mode] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.namespace] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.number] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.otherwise] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.output] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.override] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["package"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.param] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.sequence] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.sort] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.stream] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.text] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["try"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.variable] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.when] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["accumulator-rule"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["analyze-string"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["apply-imports"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["apply-templates"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["attribute-set"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["call-template"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["character-map"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["context-item"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["copy-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["for-each"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["import-schema"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["map-entry"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["matching-substring"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["merge-action"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["merge-key"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["merge-source"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["namespace-alias"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["next-iteration"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["next-match"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["non-matching-substring"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["on-completion"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["output-character"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["perform-sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["post-descent"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["preserve-space"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["processing-instruction"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["strip-space"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["use-package"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["value-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.avtx] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.xslt] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.xsltx] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["NaN decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["as with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["base-uri evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["bind-group merge"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["bind-grouping-key for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["bind-key merge"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["bind-source merge-source"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["byte-order-mark output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["byte-order-mark result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["cache function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["case-order sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["cdata-section-elements output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["cdata-section-elements result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["character output-character"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["collation merge-key"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["collation sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["component expose"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["composite key"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["context-item evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["copy-namespaces copy-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["count number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["data-type sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["decimal-separator decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["default-collation *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["default-mode *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["default-validation *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["digit decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["disable-output-escaping value-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["doctype-public output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["doctype-public result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["doctype-system output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["doctype-system result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["elements strip-space"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["encoding output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["encoding result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["error-code message"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["errors catch"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["escape-uri-attributes output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["escape-uri-attributes result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["exclude-result-prefixes *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["expand-text *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["extension-element-prefixes *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["flags analyze-string"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["for-each merge-source"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["format result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["from number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["group-adjacent for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["group-by for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["group-ending-with for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["group-starting-with for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["grouping-separator decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["grouping-separator number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["grouping-size number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["href include"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["href stream"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["html-version output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["html-version result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["id transform"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["identity-sensitive function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["include-content-type output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["include-content-type result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["indent output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["indent result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["infinity decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["inherit-namespaces element"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["initial-value accumulator"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["input-type-annotations transform"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["item-separator output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["item-separator result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["key map-entry"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["lang sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["letter-value number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["level number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["media-type output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["media-type result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["method output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["method result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["minus-sign decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["name processing-instruction"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["name with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["names expose"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["namespace element"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["namespace import-schema"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["namespace-context evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["new-value accumulator-rule"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["normalization-form output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["normalization-form result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["omit-xml-declaration output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["omit-xml-declaration result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["on-empty element"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["on-multiple-match mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["on-no-match mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["order sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["ordinal number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["output-version result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["override function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["override-extension-function function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["package-version use-package"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["parameter-document output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["parameter-document result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["pattern-separator decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["per-mille decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["percent decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["phase accumulator-rule"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["regex analyze-string"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["required param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["result-prefix namespace-alias"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["schema-aware evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["schema-location import-schema"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["select with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["separator value-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["sort-before-merge merge-source"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["stable sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["standalone output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["standalone result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["start-at number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["static variable"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["streamable mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["string output-character"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["stylesheet-prefix namespace-alias"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["suppress-indentation output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["suppress-indentation result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["terminate message"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["test when"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["tunnel with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["type stream"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["typed mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["undeclare-prefixes output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["undeclare-prefixes result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use context-item"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use key"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use-attribute-sets element"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use-character-maps result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use-when *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["validation stream"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["value number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["version *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["visibility variable"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["warning-on-multiple-match mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["warning-on-no-match mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["with-params evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["xpath evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["xpath-default-namespace *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["zero-digit decimal-format"]] = function(ctx, children) {};
Fleur.deflate = function(str, level) {
};
Fleur.inflate = function(s) {
};
Fleur.inBrowser = (new Function("try {return this === window;}catch(e){ return false;}"))();
Fleur.inNode = (new Function("try {return this === global;}catch(e){return false;}"))();

})(typeof exports === 'undefined'? this.Fleur = {} : require.main === module ? global.Fleur = {} : exports);
if (typeof Object.assign !== 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}
if (!String.fromCodePoint) {
  (function() {
    var defineProperty = (function() {
      try {
        var object = {};
        var $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch(error) {}
      return result;
    }());
    var stringFromCharCode = String.fromCharCode;
    var floor = Math.floor;
    var fromCodePoint = function() {
      var MAX_SIZE = 0x4000;
      var codeUnits = [];
      var highSurrogate;
      var lowSurrogate;
      var index = -1;
      var length = arguments.length;
      if (!length) {
        return '';
      }
      var result = '';
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if (
          !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
          codePoint < 0 ||              // not a valid Unicode code point
          codePoint > 0x10FFFF ||       // not a valid Unicode code point
          floor(codePoint) != codePoint // not an integer
        ) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) { // BMP code point
          codeUnits.push(codePoint);
        } else { // Astral code point; split in surrogate halves
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
        if (index + 1 == length || codeUnits.length > MAX_SIZE) {
          result += stringFromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }
      }
      return result;
    };
    if (defineProperty) {
      defineProperty(String, 'fromCodePoint', {
        'value': fromCodePoint,
        'configurable': true,
        'writable': true
      });
    } else {
      String.fromCodePoint = fromCodePoint;
    }
  }());
}
if (!String.prototype.codePointAt) {
	(function() {
		'use strict';
		var codePointAt = function(position) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			var size = string.length;
			var index = position ? Number(position) : 0;
			if (index != index) {
				index = 0;
			}
			if (index < 0 || index >= size) {
				return undefined;
			}
			var first = string.charCodeAt(index);
			var second;
			if (
				first >= 0xD800 && first <= 0xDBFF &&
				size > index + 1
			) {
				second = string.charCodeAt(index + 1);
				if (second >= 0xDC00 && second <= 0xDFFF) {
					return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
				}
			}
			return first;
		};
		if (Object.defineProperty) {
			Object.defineProperty(String.prototype, 'codePointAt', {
				'value': codePointAt,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.codePointAt = codePointAt;
		}
	}());
}
(function (global, undefined) {
    if (global.setImmediate) {
        return;
    }
    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;
    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }
    function runIfPresent(handle) {
        if (currentlyRunningATask) {
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }
    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }
    function installNextTickImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }
    function canUsePostMessage() {
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }
    function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };
        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }
    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }
    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }
    function installSetTimeoutImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
    if ({}.toString.call(global.process) === "[object process]") {
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        installReadyStateChangeImplementation();
    } else {
        installSetTimeoutImplementation();
    }
    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self)
);
if ((new Function("try {return this === window;} catch(e) {return false;}"))()) {
	document.addEventListener('DOMContentLoaded', function() {
		var scripts = Array.prototype.slice.call(document.getElementsByTagName("script"), 0).filter(function(sc) {
			return sc.getAttribute("type") === "application/xquery";
		});
		var parser = new Fleur.DOMParser();
		var xmldoc;
		var xqeval = function(xexpr) {
			try {
				xmldoc.evaluate(xexpr).then(
					function(res) {},
					function(err) {
						alert(err.toXQuery());
					}
				);
			} catch(e) {
				alert("Exception!\n" + e.stack);
			}
		};
		xmldoc = parser.parseFromString("<dummy/>", "application/xml");
		scripts.forEach(function(sc) {
			xqeval(sc.textContent);
		});
	}, false);
} else if (global) {
	global.fs = require('fs');
	global.http = require('http');
	global.path = require('path');
	global.url = require('url');
	global.os = require('os');
	global.dgram = require('dgram');
	var startparams = process.argv[1].endsWith('fleur.js') || process.argv[1].endsWith('fleur') ? 2 : 3;
	var params = {argv: []};
	process.argv.forEach(function(val, i) {
		if (i >= startparams) {
			if (!params.q && !params.qs) {
				if (val.startsWith("-q:") && val.length > 3) {
					params.q = val.substr(3);
				} else if (val.startsWith("-qs:") && val.length > 4) {
					params.qs = val.substr(4);
				} else if (val.startsWith("-s:") && !params.s && val.length > 3) {
					params.s = val.substr(3);
				} else if (val.startsWith("-o:") && !params.o && val.length > 3) {
					params.o = val.substr(3);
				} else {
					params.usage = true;
				}
			} else if (params.q || params.qs) {
				params.argv.push(val);
			} else {
				params.usage = true;
			}
		}
	});
	if (process.argv.length > 2) {
		if (params.usage || (!params.qs && !params.q)) {
			process.stdout.write("Usage: node fleur [-s:xmlfile] [-o:outfile] (-q:queryfile|-qs:querystring) [params]\n");
			process.stdout.write(" -s:     XML input file (optional)\n");
			process.stdout.write(" -o:     output file (optional)\n");
			process.stdout.write(" -q:     query file\n");
			process.stdout.write(" -qs:    query string\n");
			process.stdout.write(" params  name=value as externals");
		} else {
			var parseval = function(xml, xexpr, out) {
				var parser = new global.Fleur.DOMParser();
				var xmldoc = parser.parseFromString(xml, "application/xml");
				try {
					xmldoc.evaluate(xexpr).then(
						function(res) {
							if (out) {
		        				global.fs.writeFile(out, res.toXQuery(), function(err) {if (err) process.stdout.write(err);});
							} else {
								process.stdout.write(res.toXQuery());
							}
						},
						function(err) {
							if (out) {
		        				global.fs.writeFile(out, err.toXQuery(), function(err) {if (err) process.stdout.write(err);});
							} else {
								process.stdout.write(err.toXQuery());
							}
						}
					);
				} catch(e) {
					process.stdout.write("Exception!\n" + e.stack);
				}
			};
			Fleur.baseDir = params.q ? global.path.dirname(params.q) : process.cwd();
			var sourceval = function(xml) {
				if (params.qs) {
					parseval(xml, params.qs, params.o);
				} else {
					global.fs.readFile(params.q, 'binary', function(err, file){
						if (err) {
							process.stdout.write(err);
						} else {
							parseval(xml, file, params.o);
						}
					});
				}
			};
			if (params.s) {
				global.fs.readFile(params.s, 'binary', function(err, file){
					if (err) {
						process.stdout.write(err);
					} else {
						sourceval(file);
					}
				});
			} else {
				sourceval("<dummy/>");
			}
		}
	}
}
