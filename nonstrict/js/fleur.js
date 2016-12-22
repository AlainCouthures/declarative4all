/*
Fleur rev.4 (4)
Asynchronous XPath engine

Copyright (C) 2016 agenceXML - Alain COUTHURES
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
			if (this.nodeType === Fleur.Node.TEXT_NODE || this.nodeType === Fleur.Node.CDATA_NODE) {
				this.data = value;
			} else if (this.firstChild) {
				this.firstChild.nodeValue = value;
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
		src.childNodes.forEach(function(n) {dest.appendChild(n); dest.appendDescendants(n);});
	}
};
Fleur.Node.prototype.appendDescendantsRev = function(src) {
	if (src.childNodes) {
		var dest = this;
		src.childNodes.forEach(function(n) {dest.appendDescendantsRev(n); dest.appendChild(n);});
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
Fleur.Document.prototype.evaluate = function(expression, contextNode, nsResolver, type, xpresult) {
	if (!xpresult) {
		return new Fleur.XPathResult(this, expression, contextNode, nsResolver, type);
	} else {
		xpresult.document = this;
		xpresult.expression = expression;
		xpresult.contextNode = contextNode;
		xpresult.nsResolver = nsResolver;
		xpresult.resultType = type;
		xpresult._index = 0;
		return xpresult;
	}
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
			n = doc.createTextNode(o);
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
	return !!this.attributes.getNamedItem(attrname);
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
Fleur.Serializer._serializeNodeToXQuery = function(node, indent, offset, tree, postfix) {
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
			var fdata = node.data;
			if (fdata !== "INF" && fdata !== "-INF" && fdata !== "NaN") {
				if (node.schemaTypeInfo === Fleur.Type_float || node.schemaTypeInfo === Fleur.Type_double) {
					if (fdata.indexOf("e") === -1) {
						if (fdata !== "0") {
							var exp = Math.floor(Math.log10(Math.abs(parseFloat(fdata))));
							fdata = "" + (parseFloat(fdata) * Math.pow(10, -exp)) + "e" + exp;
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
			s = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset, true);
			}
			return s + postfix;
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
			quote = node.schemaTypeInfo === Fleur.Type_string ? '"' : node.schemaTypeInfo === Fleur.Type_regex ? '/' : "";
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
	} else {
		return s;
	}
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
Fleur.Types["http://www.agencexml.com/types"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/types", "regex");
Fleur.Type_regex = Fleur.Types["http://www.agencexml.com/types"]["regex"];
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
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions"] = {};
Fleur.XPathFunctions_fn = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/map"] = {};
Fleur.XPathFunctions_map = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/map"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/math"] = {};
Fleur.XPathFunctions_math = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/math"];
Fleur.XPathFunctions["http://www.w3.org/2001/XMLSchema"] = {};
Fleur.XPathFunctions_xs = Fleur.XPathFunctions["http://www.w3.org/2001/XMLSchema"];
Fleur.XPathFunctions["http://basex.org/modules/prof"] = {};
Fleur.XPathFunctions_prof = Fleur.XPathFunctions["http://basex.org/modules/prof"];
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
Fleur.XPathFunctions_fn["ceiling"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.ceil, Fleur.Type_integer, callback);
};
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
Fleur.XPathFunctions_fn["contains"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, false, function(a, b) {
		return a.indexOf(b) !== -1;
	}, Fleur.Type_boolean, callback);
};
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
		res.data = "" + count;
		res.schemaTypeInfo = Fleur.Type_integer;
		Fleur.callback(function() {callback(res);});
	});
};
Fleur.XPathFunctions_fn["current-date"] = function(ctx, children, callback) {
	var a;
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	a = new Fleur.Text();
	var date = new Date();
	var o = date.getTimezoneOffset();
	a.schemaTypeInfo = Fleur.Type_date;
	a.data = ("000" + date.getFullYear()).slice(-4) + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
	Fleur.callback(function() {callback(a);});
};
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
Fleur.XPathFunctions_fn["current-time"] = function(ctx, children, callback) {
	var a;
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	a = new Fleur.Text();
	var date = new Date();
	var o = date.getTimezoneOffset();
	a.schemaTypeInfo = Fleur.Type_time;
	a.data = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2) + "." + ("00" + date.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
	Fleur.callback(function() {callback(a);});
};
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
Fleur.XPathFunctions_fn["doc"] = function(ctx, children, callback) {
	var mediatype = "application/xml";
	if (children.length !== 1 && children.length !== 2) {
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
		}
	};
	if (children.length === 2) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var op2;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSString(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			mediatype = op2[1];
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
		});
	} else {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	}
};
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
Fleur.XPathFunctions_fn["ends-with"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, false, function(a, b) {
		return a.endsWith(b);
	}, Fleur.Type_boolean, callback);
};
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
Fleur.XPathFunctions_fn["escape-html-uri"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return s.replace(/[^ -~]/g, function(c) {return encodeURIComponent(c);});}, null, callback);
};
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
		result.data = "" + (n !== Fleur.EmptySequence);
		result.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(result);});
	});
};
Fleur.XPathFunctions_fn["false"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var result = new Fleur.Text();
	result.schemaTypeInfo = Fleur.Type_boolean;
	result.data = "false";
	Fleur.callback(function() {callback(result);});
};
Fleur.XPathFunctions_fn["floor"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.floor, function(a) {
		return a.schemaTypeInfo;
	}, callback);
};
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
	a.data = "" + ctx._pos;
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
Fleur.XPathFunctions_fn["starts-with"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, false, function(a, b) {
		return a.startsWith(b);
	}, Fleur.Type_boolean, callback);
};
Fleur.XPathFunctions_fn["string"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_string, null, function() {}, function() {
		return false;
	}, callback);
};
Fleur.XPathFunctions_fn["string-length"] = function(ctx, children, callback) {
	Fleur.XPathStringFunction(ctx, children, function(s) {return s.length;}, Fleur.Type_integer, callback);
};
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
				result.data = "" + a.data.codePointAt(0);
			} else {
				result = new Fleur.Sequence();
				var i, l;
				for (i = 0, l = a.data.length; i < l; i++) {
					c = new Fleur.Text();
					c.schemaTypeInfo = Fleur.Type_integer;
					c.data = "" + a.data.codePointAt(i);
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
Fleur.XPathFunctions_fn["substring-after"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, false, function(a, b) {
		var index = a.indexOf(b);
		return index === -1 ? "" : a.substring(index + b.length);
	}, Fleur.Type_string, callback);
};
Fleur.XPathFunctions_fn["substring-before"] = function(ctx, children, callback) {
	Fleur.XPathStringContentFunction(ctx, children, false, function(a, b) {
		return a.substring(0, a.indexOf(b));
	}, Fleur.Type_string, callback);
};
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
Fleur.XPathFunctions_fn["true"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_boolean;
	a.data = "true";
	Fleur.callback(function() {callback(a);});
};
Fleur.XPathFunctions_fn["unordered"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		Fleur.callback(function() {callback(n);});
	});
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
Fleur.XPathFunctions_fn["function-arity"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["function-lookup"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["function-name"] = function(ctx, children) {};
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
Fleur.XPathFunctions_fn["local-name"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["local-name-from-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["matches"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["minutes-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["months-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["name"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["namespace-uri"] = function(ctx, children) {};
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
Fleur.XPathFunctions_fn["substring"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["timezone-from-date"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["timezone-from-dateTime"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["timezone-from-time"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["tokenize"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["trace"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["transform"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["translate"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["unparsed-text"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["unparsed-text-available"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["unparsed-text-lines"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["uri-collection"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["years-from-duration"] = function(ctx, children) {};
Fleur.XPathFunctions_map["contains"] = function(ctx, children) {};
Fleur.XPathFunctions_map["entry"] = function(ctx, children) {};
Fleur.XPathFunctions_map["for-each"] = function(ctx, children) {};
Fleur.XPathFunctions_map["get"] = function(ctx, children) {};
Fleur.XPathFunctions_map["keys"] = function(ctx, children) {};
Fleur.XPathFunctions_map["merge"] = function(ctx, children) {};
Fleur.XPathFunctions_map["put"] = function(ctx, children) {};
Fleur.XPathFunctions_map["remove"] = function(ctx, children) {};
Fleur.XPathFunctions_map["size"] = function(ctx, children) {};
Fleur.XPathFunctions_math["acos"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.acos, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["asin"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.asin, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["atan"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.atan, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["atan2"] = function(ctx, children, callback) {
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
		var a2 = Fleur.Atomize(n);
		var op2 = Fleur.toJSNumber(a2);
		if (op2[0] < 0) {
			Fleur.callback(function() {callback(a2);});
			return;
		}
		var x = op2[1];
		Fleur.XPathNumberFunction(ctx, children.slice(0, 1), function(y) {
			return Math.atan2(y, x);
		}, Fleur.Type_double, callback);
	});
};
Fleur.XPathFunctions_math["cos"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.cos, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["exp"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.exp, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["exp10"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, function(x) {return Math.pow(10, x);}, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["log"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.log, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["log10"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.log10, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["pi"] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	a.schemaTypeInfo = Fleur.Type_double;
	a.data = "3.141592653589793e0";
	Fleur.callback(function() {callback(a);});
};
Fleur.XPathFunctions_math["pow"] = function(ctx, children, callback) {
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
		var a2 = Fleur.Atomize(n);
		var op2 = Fleur.toJSNumber(a2);
		if (op2[0] < 0) {
			Fleur.callback(function() {callback(a2);});
			return;
		}
		var power = op2[1];
		Fleur.XPathNumberFunction(ctx, children.slice(0, 1), function(v) {
			return Math.pow(v, power);
		}, Fleur.Type_double, callback);
	});
};
Fleur.XPathFunctions_math["sin"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.sin, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["sqrt"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.sqrt, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_math["tan"] = function(ctx, children, callback) {
	Fleur.XPathNumberFunction(ctx, children, Math.tan, Fleur.Type_double, callback);
};
Fleur.XPathFunctions_prof["sleep"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a, op;
		a = Fleur.Atomize(n);
		op = Fleur.toJSNumber(a);
		if (op[0] >= 0) {
			setTimeout(function() {
				callback(Fleur.EmptySequence);
			}, op[1]);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	});
};
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
Fleur._Atomize = function(a, n) {
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
		case Fleur.Node.MAP_NODE:
		case Fleur.Node.ENTRY_NODE:
			a = new Fleur.Text();
			a.data = n.textContent;
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.ATTRIBUTE_NODE:
			a = new Fleur.Text();
			a.data = n.value.slice(0);
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
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
Fleur.Atomize = function(n) {
	return n === Fleur.EmptySequence ? Fleur.EmptySequence : Fleur._Atomize(null, n);
};
Fleur.XPathConstructor = function(ctx, children, schemaType, stringreg, others, formatvalue, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
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
Fleur.XPathEvaluator._precedence = "././/.;0.!.;1.~+.~-.;2.cast as.;3.castable as.;4.treat as.;5.instance of.;6.intersect.except.;7.|.union.;8.div.mod.*.idiv.;9.+.-.;10.to.;11.||.;12.eq.ne.lt.le.gt.ge.<.>.<=.>=.is.<<.>>.=.!=.;13.and.;14.or.;15.for.let.some.every.then.else.in.:=.return.satisfies.;16.,.;17.";
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
			while (o !== "" && o !== "}") {
				o = s.charAt(++i);
			}
		}
		o = s.charAt(++i);
	}
	return s.substr(0, i);
};
Fleur.XPathEvaluator._getNameStep = function(s, attr) {
	var n = Fleur.XPathEvaluator._getName(s);
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
	if (ops === "" || parseInt(ops.split(".")[1], 10) > opprec) {
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
			if (ops.substr(0, 13) === "4.17.,5.999.(") {
				if (arg1val.substr(0, 26) === "[Fleur.XQueryX.arguments,[") {
					arg = arg1val.substr(0, arg1len - 2) + "," + arg2val + "]]";
				} else {
					arg = "[Fleur.XQueryX.arguments,[" + arg1val + "," + arg2val + "]]";
				}
			} else if (ops === "4.17.,") {
				if (arg1val.substr(0, 29) === "[Fleur.XQueryX.sequenceExpr,[" && arg1val !== "[Fleur.XQueryX.sequenceExpr,[]]") {
					arg = arg1val.substr(0, arg1len - 2) + "," + arg2val + "]]";
				} else {
					arg = "[Fleur.XQueryX.sequenceExpr,[" + arg1val + "," + arg2val + "]]";
				}
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
				arg = "[Fleur.XQueryX.forClauseItem,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.forExpr,[" + arg2val + "]]]]";
			}
			break;
		case ":=":
			arg = "[Fleur.XQueryX.letClauseItem,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.letExpr,[" + arg2val + "]]]]";
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
			break;
		case "else":
			if (arg1val.substr(0, 30) === "[Fleur.XQueryX.ifThenElseExpr,") {
				arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.elseClause,[" + arg2val + "]]]]";
			}
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
	var ii, ll, text, texts, entstart, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrvalues, attrs, parents = [], currnodename = "", eltnode, attrnode, c, c0, c1, c2, braces,
		seps_pi = " \t\n\r?", seps_dtd = " \t\n\r[>", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r",
		n, namespaces = {}, newnamespaces = {}, pindex, prefix, localName, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue,
		r0, r = "", nextsep = "";
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
						}
				}
			} else if (c === "\n") {
				text += "\\n";
			} else if (c === "\r") {
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
							ll = Math.min(index - 1, s.indexOf(c, offset));
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
					} else {
						r += r0 + "]]";
						nextsep = ",";
					}
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
	l = l || 0;
	var p;
	var t = Fleur.XPathEvaluator._xp2js(s, "", l === 0 ? "" : arg.substr(0, 57) === "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier," ? "5.999.q" : "5.999.(");
	var plen = s.length - parseInt(t.substr(0, t.indexOf(".")), 10) + 1;
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
	} else if (c === "(" ) {
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
		} else if (arg === "[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.forClause,[]]]]") {
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + ".[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.forClause,[" + fargs2 + "]]]]";
		} else if (arg === "[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.letClause,[]]]]") {
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + ".[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.letClause,[" + fargs2 + "]]]]";
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
		if (arg.indexOf(",[Fleur.XQueryX.predicates,[") === -1) {
			p = plen + "." + arg.substr(0, arg.length - 4) + ",[Fleur.XQueryX.predicates,[" + t.substr(t.indexOf(".") + 1) + "]]]]]]";
		} else {
			p = plen + "." + arg.substr(0, arg.length - 6) + "," + t.substr(t.indexOf(".") + 1) + "]]]]]]";
		}
	}
	if (s.charAt(plen - 1) === "(" || s.charAt(plen - 1) === "[") {
		return Fleur.XPathEvaluator._getPredParam(s.charAt(plen - 1), s.substr(plen), l + plen, p.substr(p.indexOf(".") + 1));
	}
	return (l + plen) + "." + p.substr(p.indexOf(".") + 1);
};
Fleur.XPathEvaluator._getPredParams = function(s, len, arg) {
	var i = Fleur.XPathEvaluator._skipSpaces(s, 0);
	if (s.charAt(i) === "(" || s.charAt(i) === "[") {
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
	var d = xp.substr(xp.indexOf(c) + 1);
	var d2;
	var r = "";
	if (c === ".") {
		if (d.charAt(0) === ".") {
			r = "2.[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['parent']],[Fleur.XQueryX.anyKindTest,[]]]]]]";
		} else {
			r = "1.[Fleur.XQueryX.contextItemExpr,[]]";
		}
	} else if (c === ")") {
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
		r = Fleur.XPathEvaluator._getNameStep(c + d, 0);
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
	if (o === "]" || o === ")" || (p.substr(0, 6) === "return" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) || (p.substr(0, 9) === "satisfies" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(9)) === -1)) {
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
				rval = "[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.forClause,[]]]]";
				op = "for";
				break;
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['let']]]]]]":
				rval = "[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.letClause,[]]]]";
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
	} else if (p.substr(0, 6) === "except" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) {
		op = p.substr(0, 6);
	} else if (p.substr(0, 5) === "treat" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 5) + 2);
		op2 = "treat as";
	} else if ((p.substr(0, 5) === "union" || p.substr(0, 5) === "every") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
		op = p.substr(0, 5);
	} else if (p.substr(0, 4) === "cast" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(4)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 4) + 2);
		op2 = "cast as";
	} else if ((p.substr(0, 4) === "idiv" || p.substr(0, 4) === "some" || p.substr(0, 4) === "then" || p.substr(0, 4) === "else") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(4)) === -1) {
		op = p.substr(0, 4);
	} else if ((p.substr(0, 3) === "div" || p.substr(0, 3) === "and" || p.substr(0, 3) === "mod") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(3)) === -1) {
		op = p.substr(0, 3);
	} else if ((p.substr(0, 2) === "or" || p.substr(0, 2) === "eq" || p.substr(0, 2) === "ne" || p.substr(0, 2) === "lt" || p.substr(0, 2) === "le" || p.substr(0, 2) === "gt" || p.substr(0, 2) === "ge" || p.substr(0, 2) === "is" || p.substr(0, 2) === "to" || p.substr(0, 2) === "in") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(2)) === -1) {
		op = p.substr(0, 2);
	} else if (p.substr(0, 2) === "!=" || p.substr(0, 2) === "<=" || p.substr(0, 2) === ">=" || p.substr(0, 2) === "<<" || p.substr(0, 2) === ">>" || p.substr(0, 2) === "//" || p.substr(0, 2) === "~+" || p.substr(0, 2) === "~-" || p.substr(0, 2) === ":=" || p.substr(0, 2) === "||") {
		op = p.substr(0, 2);
	} else if ("+-*=|,<>/!".indexOf(o) !== -1) {
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
	i = Fleur.XPathEvaluator._skipSpaces(xq, i);
	var c = xq.charAt(i);
	var d = xq.substr(i + 1);
	var r = "", v, vl;
	var res = i + ".";
	if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
		r = Fleur.XPathEvaluator._getName(c + d);
		switch (r) {
			case "declare":
				var j = Fleur.XPathEvaluator._skipSpaces(xq, i + r.length);
				c = xq.charAt(j);
				d = xq.substr(j + 1);
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
							break;
						case "context":
							break;
						case "variable":
							break;
						case "function":
							break;
						case "option":
					}
				}
				break;
			case "import":
		}
	}
	return res;
};
Fleur.XPathEvaluator._xq2js = function(xq) {
	xq = xq.replace(/^\s+|\s+$/gm, "");
	var v = Fleur.XPathEvaluator._getVersion(xq);
	var vl = v.substr(0, v.indexOf("."));
	var prolog = "", p, pc, pl = parseInt(vl, 10);
	do {
		p = Fleur.XPathEvaluator._getProlog(xq, pl);
		pl = parseInt(p.substr(0, p.indexOf(".")), 10);
		pc = p.substr(p.indexOf(".") + 1);
		prolog += pc;
	} while (pc !== "")
	return "[Fleur.XQueryX.module,[" + v.substr(v.indexOf(".") + 1) + "[Fleur.XQueryX.mainModule,[" + prolog + "[Fleur.XQueryX.queryBody,[" + Fleur.XPathEvaluator._xp2js(xq.substr(pl), "", "") + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]],[Fleur.XQueryX.schemaLocation,["http://www.w3.org/2005/XQueryX http://www.w3.org/2005/XQueryX/xqueryx.xsd"]],[Fleur.XQueryX.xsi,["http://www.w3.org/2001/XMLSchema-instance"]]]]';
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
		"fn": "http://www.w3.org/2005/xpath-functions",
		"math": "http://www.w3.org/2005/xpath-functions/math",
		"map": "http://www.w3.org/2005/xpath-functions/map",
		"array": "http://www.w3.org/2005/xpath-functions/array",
		"err": "http://www.w3.org/2005/xqt-errors",
		"prof": "http://basex.org/modules/prof"
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
Fleur.XPathResult = function(doc, expression, contextNode, nsResolver, resultType) {
	this.document = doc;
	this.expression = expression;
	this.contextNode = contextNode;
	this.nsResolver = nsResolver;
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
	}
});
Fleur.XPathResult.prototype.evaluate = function(resolve, reject) {
	var ctx = {
		_curr: this.contextNode || this.document,
		nsresolver: this.nsResolver,
		xpresult: this
	};
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
Fleur.Xlength = 0;
Fleur.XQueryXNames = [["http://www.w3.org/2005/XQueryX", "http://www.w3.org/2000/xmlns/", "http://www.w3.org/2001/XMLSchema-instance"], []];
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
Fleur.XQueryXNames[1][Fleur.XQueryX.kindTest = Fleur.Xlength++] = [1, 0, "xqx:kindTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.leOp = Fleur.Xlength++] = [1, 0, "xqx:leOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.lessThanOp = Fleur.Xlength++] = [1, 0, "xqx:lessThanOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.lessThanOrEqualOp = Fleur.Xlength++] = [1, 0, "xqx:lessThanOrEqualOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letClause = Fleur.Xlength++] = [1, 0, "xqx:letClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letClauseItem = Fleur.Xlength++] = [1, 0, "xqx:letClauseItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letExpr = Fleur.Xlength++] = [1, 0, "xqx:letExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.libraryModule = Fleur.Xlength++] = [1, 0, "xqx:libraryModule"];
Fleur.XQueryXNames[1][Fleur.XQueryX.logicalOp = Fleur.Xlength++] = [1, 0, "xqx:logicalOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.ltOp = Fleur.Xlength++] = [1, 0, "xqx:ltOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mainModule = Fleur.Xlength++] = [1, 0, "xqx:mainModule"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapTest = Fleur.Xlength++] = [1, 0, "xqx:mapTest"];
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
Fleur.XQueryXNames[1][Fleur.XQueryX.xqx = Fleur.Xlength++] = [2, 1, "xmlns:xqx"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xsi = Fleur.Xlength++] = [2, 1, "xmlns:xsi"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaLocation = Fleur.Xlength++] = [2, 2, "xsi:schemaLocation"];
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
	var namespace = ctx.nsresolver.lookupNamespaceURI(prefix);
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
Fleur.XQueryEngine[Fleur.XQueryX.defaultNamespaceDecl] = function(ctx, children) {
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
	var i = 0, l;
	l = children.length;
	while (i < l) {
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1]);
		if (ctx._result && ctx._result.schemaTypeInfo === Fleur.Type_error) {
			return;
		}
		i++;
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = "http://www.w3.org/2005/xpath-functions";
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix && ctx.nsresolver) {
			uri = ctx.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]);
		}
	}
	if (!uri || !Fleur.XPathFunctions[uri][fname]) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XPathFunctions[uri][fname](ctx, children[1][1], function(n) {
		Fleur.callback(function() {callback(n);});
	});
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
					nsresolver: ctx.nsresolver
				}, seqtype[0][1], function(n) {
					a = new Fleur.Text();
					a.data = "" + (n !== Fleur.EmptySequence);
					a.schemaTypeInfo = Fleur.Type_boolean;
					Fleur.callback(function() {callback(a);});
				});
				return;
			}
		} else if (occurrence === "1" || occurrence === "+") {
				res = false;
		}
		a = new Fleur.Text();
		a.data = "" + res;
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
Fleur.XQueryEngine[Fleur.XQueryX.mainModule] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.mainModule](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
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
	if (currURI !== ctx.nsresolver.lookupNamespaceURI(nsURI)) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	Fleur.callback(function() {callback(ctx._curr);});
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
				nsresolver: ctx.nsresolver
			}, children.slice(1), cb);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.piTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.PROCESSING_INSTRUCTION_NODE ? Fleur.EmptySequence : ctx._curr);});
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
						nsresolver: ctx.nsresolver
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
					nsresolver: ctx.nsresolver
				}, children[0][1], cb);
	};
	Fleur.XQueryEngine[children[0][0]]({
				_curr: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				nsresolver: ctx.nsresolver
			}, children[0][1], cb);
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
		if (eob === depth) {
			if (result === Fleur.EmptySequence) {
				result = n;
			} else if (n !== Fleur.EmptySequence) {
				if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var seq = new Fleur.Sequence();
					seq.appendChild(result);
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
		result = n;
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
				nsresolver: ctx.nsresolver
			}, children[1][1], cb);
		};
		Fleur.XQueryEngine[children[1][0]]({
			_curr: subcurr,
			_next: next,
			_last: last,
			_pos: pos,
			nsresolver: ctx.nsresolver
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
			if (eob === Fleur.XQueryX.stepExpr && result !== Fleur.EmptySequence && callback !== cb && children[children.length - 1][0] === Fleur.XQueryX.predicates) {
				Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
					_next: result,
					nsresolver: ctx.nsresolver
				}, children[children.length - 1][1], function(n) {
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
		if (children.length === 2 && children[1][0] === Fleur.XQueryX.predicates) {
			if (callback !== cb) {
				Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
					_next: n,
					nsresolver: ctx.nsresolver
				}, children[1][1], function(n) {
					Fleur.callback(function() {callback(n, Fleur.XQueryX.stepExpr);});
				});
				return;
			}
			Fleur.callback(function() {callback(n, Fleur.XQueryX.stepExpr);});
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
				nsresolver: ctx.nsresolver
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
	var seq, n;
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
			curr.attributes.forEach(function(a) {
				if (a.nodeName !== "xmlns" && a.prefix !== "xmlns") {
					seq.appendChild(a);
				}
			});
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
			curr.childNodes.forEach(function(a) {seq.appendChild(a);});
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
Fleur.XQueryEngine[Fleur.XQueryX.xsi] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.NCName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.QName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.URIExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.allowingEmpty] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.annotation] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.annotationName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyElementTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyFunctionTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyItemType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.argExpr] = function(ctx, children) {};
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
Fleur.XQueryEngine[Fleur.XQueryX.computedAttributeConstructor] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.computedCommentConstructor] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.computedDocumentConstructor] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.computedElementConstructor] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.computedNamespaceConstructor] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.computedPIConstructor] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.computedTextConstructor] = function(ctx, children) {};
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
Fleur.XQueryEngine[Fleur.XQueryX.forClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.forClauseItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.forExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.forLetClauseItemExtensions] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionBody] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.groupByClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.groupVarInitialize] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.groupingSpec] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.inheritMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.inlineFunctionExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.itemType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.kindTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.letClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.letClauseItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.letExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.libraryModule] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.moduleDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.moduleImport] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.name] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.namedFunctionRef] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.namespaceDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.namespacePrefix] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.namespaceTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nextItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nillable] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.occurrenceIndicator] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.operand] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.operatorExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.optionContents] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.optionDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.optionName] = function(ctx, children) {};
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
Fleur.XQueryEngine[Fleur.XQueryX.piTarget] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.piTargetExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.piValueExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.positionalVariableBinding] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragma] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragmaContents] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragmaName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.predicateExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prefix] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prefixExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.preserveMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.previousItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prolog] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prologPartOneItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prologPartTwoItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.quantifiedExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.quantifiedExprInClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.quantifier] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.resultExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.returnClause] = function(ctx, children) {};
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
Fleur.XQueryEngine[Fleur.XQueryX.tagName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.tagNameExpr] = function(ctx, children) {};
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
Fleur.XQueryEngine[Fleur.XQueryX.varRef] = function(ctx, children) {};
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
				a1.data = "" + (op1[1] + op2[1]);
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
				a2.data = "" + op2[1];
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
Fleur.inBrowser = (new Function("try {return this === window;}catch(e){ return false;}"))();
Fleur.inNode = (new Function("try {return this === global;}catch(e){return false;}"))();

})(typeof exports === 'undefined'? this.Fleur = {}: exports);if (typeof Object.assign !== 'function') {
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
if (!Promise) {
(function(){function t(t){return"function"==typeof t||"object"==typeof t&&null!==t}function e(t){return"function"==typeof t}function n(t){G=t}function r(t){Q=t}function o(){return function(){process.nextTick(a)}}function i(){return function(){B(a)}}function s(){var t=0,e=new X(a),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}function u(){var t=new MessageChannel;return t.port1.onmessage=a,function(){t.port2.postMessage(0)}}function c(){return function(){setTimeout(a,1)}}function a(){for(var t=0;J>t;t+=2){var e=tt[t],n=tt[t+1];e(n),tt[t]=void 0,tt[t+1]=void 0}J=0}function f(){try{var t=require,e=t("vertx");return B=e.runOnLoop||e.runOnContext,i()}catch(n){return c()}}function l(t,e){var n=this,r=new this.constructor(p);void 0===r[rt]&&k(r);var o=n._state;if(o){var i=arguments[o-1];Q(function(){x(o,r,i,n._result)})}else E(n,r,t,e);return r}function h(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(p);return g(n,t),n}function p(){}function _(){return new TypeError("You cannot resolve a promise with itself")}function d(){return new TypeError("A promises callback cannot return that same promise.")}function v(t){try{return t.then}catch(e){return ut.error=e,ut}}function y(t,e,n,r){try{t.call(e,n,r)}catch(o){return o}}function m(t,e,n){Q(function(t){var r=!1,o=y(n,e,function(n){r||(r=!0,e!==n?g(t,n):S(t,n))},function(e){r||(r=!0,j(t,e))},"Settle: "+(t._label||" unknown promise"));!r&&o&&(r=!0,j(t,o))},t)}function b(t,e){e._state===it?S(t,e._result):e._state===st?j(t,e._result):E(e,void 0,function(e){g(t,e)},function(e){j(t,e)})}function w(t,n,r){n.constructor===t.constructor&&r===et&&constructor.resolve===nt?b(t,n):r===ut?j(t,ut.error):void 0===r?S(t,n):e(r)?m(t,n,r):S(t,n)}function g(e,n){e===n?j(e,_()):t(n)?w(e,n,v(n)):S(e,n)}function A(t){t._onerror&&t._onerror(t._result),T(t)}function S(t,e){t._state===ot&&(t._result=e,t._state=it,0!==t._subscribers.length&&Q(T,t))}function j(t,e){t._state===ot&&(t._state=st,t._result=e,Q(A,t))}function E(t,e,n,r){var o=t._subscribers,i=o.length;t._onerror=null,o[i]=e,o[i+it]=n,o[i+st]=r,0===i&&t._state&&Q(T,t)}function T(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var r,o,i=t._result,s=0;s<e.length;s+=3)r=e[s],o=e[s+n],r?x(n,r,o,i):o(i);t._subscribers.length=0}}function M(){this.error=null}function P(t,e){try{return t(e)}catch(n){return ct.error=n,ct}}function x(t,n,r,o){var i,s,u,c,a=e(r);if(a){if(i=P(r,o),i===ct?(c=!0,s=i.error,i=null):u=!0,n===i)return void j(n,d())}else i=o,u=!0;n._state!==ot||(a&&u?g(n,i):c?j(n,s):t===it?S(n,i):t===st&&j(n,i))}function C(t,e){try{e(function(e){g(t,e)},function(e){j(t,e)})}catch(n){j(t,n)}}function O(){return at++}function k(t){t[rt]=at++,t._state=void 0,t._result=void 0,t._subscribers=[]}function Y(t){return new _t(this,t).promise}function q(t){var e=this;return new e(I(t)?function(n,r){for(var o=t.length,i=0;o>i;i++)e.resolve(t[i]).then(n,r)}:function(t,e){e(new TypeError("You must pass an array to race."))})}function F(t){var e=this,n=new e(p);return j(n,t),n}function D(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function K(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function L(t){this[rt]=O(),this._result=this._state=void 0,this._subscribers=[],p!==t&&("function"!=typeof t&&D(),this instanceof L?C(this,t):K())}function N(t,e){this._instanceConstructor=t,this.promise=new t(p),this.promise[rt]||k(this.promise),Array.isArray(e)?(this._input=e,this.length=e.length,this._remaining=e.length,this._result=new Array(this.length),0===this.length?S(this.promise,this._result):(this.length=this.length||0,this._enumerate(),0===this._remaining&&S(this.promise,this._result))):j(this.promise,U())}function U(){return new Error("Array Methods must be provided an Array")}function W(){var t;if("undefined"!=typeof global)t=global;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var n=t.Promise;(!n||"[object Promise]"!==Object.prototype.toString.call(n.resolve())||n.cast)&&(t.Promise=pt)}var z;z=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var B,G,H,I=z,J=0,Q=function(t,e){tt[J]=t,tt[J+1]=e,J+=2,2===J&&(G?G(a):H())},R="undefined"!=typeof window?window:void 0,V=R||{},X=V.MutationObserver||V.WebKitMutationObserver,Z="undefined"==typeof self&&"undefined"!=typeof process&&"[object process]"==={}.toString.call(process),$="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,tt=new Array(1e3);H=Z?o():X?s():$?u():void 0===R&&"function"==typeof require?f():c();var et=l,nt=h,rt=Math.random().toString(36).substring(16),ot=void 0,it=1,st=2,ut=new M,ct=new M,at=0,ft=Y,lt=q,ht=F,pt=L;L.all=ft,L.race=lt,L.resolve=nt,L.reject=ht,L._setScheduler=n,L._setAsap=r,L._asap=Q,L.prototype={constructor:L,then:et,"catch":function(t){return this.then(null,t)}};var _t=N;N.prototype._enumerate=function(){for(var t=this.length,e=this._input,n=0;this._state===ot&&t>n;n++)this._eachEntry(e[n],n)},N.prototype._eachEntry=function(t,e){var n=this._instanceConstructor,r=n.resolve;if(r===nt){var o=v(t);if(o===et&&t._state!==ot)this._settledAt(t._state,e,t._result);else if("function"!=typeof o)this._remaining--,this._result[e]=t;else if(n===pt){var i=new n(p);w(i,t,o),this._willSettleAt(i,e)}else this._willSettleAt(new n(function(e){e(t)}),e)}else this._willSettleAt(r(t),e)},N.prototype._settledAt=function(t,e,n){var r=this.promise;r._state===ot&&(this._remaining--,t===st?j(r,n):this._result[e]=n),0===this._remaining&&S(r,this._result)},N.prototype._willSettleAt=function(t,e){var n=this;E(t,void 0,function(t){n._settledAt(it,e,t)},function(t){n._settledAt(st,e,t)})};var dt=W,vt={Promise:pt,polyfill:dt};"function"==typeof define&&define.amd?define(function(){return vt}):"undefined"!=typeof module&&module.exports?module.exports=vt:"undefined"!=typeof this&&(this.ES6Promise=vt),dt()}).call(this);
	var Promise = ES6Promise.Promise;
}
