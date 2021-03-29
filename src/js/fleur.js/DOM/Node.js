/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
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
Fleur.Node.MULTIDIM_NODE = 131;
Fleur.Node.ARRAY_NODE = 132;
Fleur.Node.MAP_NODE = 133;
Fleur.Node.ENTRY_NODE = 134;
Fleur.Node.FUNCTION_NODE = 135;
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
	//console.log((this.nodeType === Fleur.Node.ATTRIBUTE_NODE ? this.ownerElement.nodeName + "[" + this.ownerElement.childNodes.length + "]/@" + this.nodeName : this.nodeName + "[" + this.childNodes.length + "]") + " -> " + (newChild.nodeName === "#text" ? '"' + newChild.nodeValue.replace("\n","\\n") + '"' : newChild.nodeName + "[" + newChild.childNodes.length + "]"));
	//if(this.nodeType === Fleur.Node.SEQUENCE_NODE && newChild.nodeType === Fleur.Node.SEQUENCE_NODE) {
	//	alert("WrongAppend");
	//}
	var n = this, i = 0, l;
	if (newChild.nodeType === Fleur.Node.DOCUMENT_FRAGMENT_NODE) {
		l = newChild.childNodes.length;
		while (i < l) {
			this.appendChild(newChild.childNodes[0]);
			i++;
		}
		return newChild;
	}
	if ((this.nodeType !== Fleur.Node.SEQUENCE_NODE || this.ownerDocument) && (newChild.nodeType === Fleur.Node.ATTRIBUTE_NODE || (this.nodeType === Fleur.Node.ATTRIBUTE_NODE && newChild.nodeType !== Fleur.Node.TEXT_NODE))) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	} else {
		if ((this.nodeType !== Fleur.Node.SEQUENCE_NODE && this.nodeType !== Fleur.Node.MULTIDIM_NODE) || this.ownerDocument) {
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
		if (newChild.isNotEmpty()) {
			this.childNodes.push(newChild);
			if (newChild.nodeType === Fleur.Node.ELEMENT_NODE || newChild.nodeType === Fleur.Node.SEQUENCE_NODE || newChild.nodeType === Fleur.Node.MULTIDIM_NODE || newChild.nodeType === Fleur.Node.ARRAY_NODE || newChild.nodeType === Fleur.Node.MAP_NODE || newChild.nodeType === Fleur.Node.ENTRY_NODE) {
				this.children.push(newChild);
			}
		}
	}
	if (this.nodeType !== Fleur.Node.SEQUENCE_NODE && this.nodeType !== Fleur.Node.MULTIDIM_NODE) {
		newChild.idRecalculate(String(this.childNodes.length - 1));
	}
	return newChild;
};
Fleur.Node.prototype.idRecalculate = function(strpos) {
	var i, l;
	var upper = this.parentNode || this.ownerElement;
	if (upper) {
		upper = upper.internal_id;
	}
	if (upper) {
		this.internal_id = (this.parentNode || this.ownerElement).internal_id + (this.parentNode ? "-" : "+") + String.fromCharCode(96 + strpos.length) + strpos;
		if (this.attributes) {
			for (i = 0, l = this.attributes.length; i < l; i++) {
				this.attributes[i].idRecalculate(String(i));
			}
		}
		for (i = 0, l = this.childNodes.length; i < l; i++) {
			this.childNodes[i].idRecalculate(String(i));
		}
	}
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
Fleur.Node.prototype.canonicalize = function() {
	if (this.nodeType === Fleur.Node.TEXT_NODE && this.schemaTypeInfo) {
		try {
			this.data = this.schemaTypeInfo.canonicalize(this.data);
			return true;
		} catch (e) {}
	}
	return false;
};
Fleur.Node.prototype.clearUserData = function() {
	this._userData = {};
};
Fleur.Node.prototype.cloneNode = function(deep) {
	var i = 0, li = 0, j = 0, lj = 0, clone = null;
	switch (this.nodeType) {
		case Fleur.Node.TEXT_NODE:
			if (this.ownerDocument) {
				clone = this.ownerDocument.createTextNode(this.data);
			} else {
				clone = new Fleur.Text();
				clone.appendData(this.data);
			}
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
			if (this.ownerDocument) {
				clone = this.ownerDocument.createEntry(this.nodeName);
			} else {
				clone = new Fleur.Entry();
				clone.childNodes = new Fleur.NodeList();
				clone.children = new Fleur.NodeList();
				clone.nodeName = clone.localName = this.nodeName;
				clone.textContent = "";
			}
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
			clone = this.ownerDocument ? this.ownerDocument.createMap() : new Fleur.Map();
			li = this.entries.length;
			while (i < li) {
				clone.setEntryNode(this.entries[i++].cloneNode(false));
			}
			break;
		case Fleur.Node.SEQUENCE_NODE:
			clone = this.ownerDocument ? this.ownerDocument.createSequence() : new Fleur.Sequence();
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
		case Fleur.Node.FUNCTION_NODE:
			clone = new Fleur.Function(this.namespaceURI, this.nodeName, this.jsfunc, this.xqxfunc, this.argtypes, this.needctx, this.needcallback, this.restype, this.updating);
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
Fleur.Node.prototype.copyNode = function() {
	var i = 0, li = 0, j = 0, lj = 0, copy = null;
	switch (this.nodeType) {
		case Fleur.Node.TEXT_NODE:
			copy = new Fleur.Text();
			copy.appendData(this.data);
			copy.schemaTypeInfo = this.schemaTypeInfo;
			break;
		case Fleur.Node.ENTRY_NODE:
			copy = new Fleur.Entry();
			copy.childNodes = new Fleur.NodeList();
			copy.children = new Fleur.NodeList();
			copy.nodeName = copy.localName = this.nodeName;
			copy.textContent = "";
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.MAP_NODE:
			copy = new Fleur.Map();
			li = this.entries.length;
			while (i < li) {
				copy.setEntryNode(this.entries[i++].copyNode());
			}
			break;
		case Fleur.Node.SEQUENCE_NODE:
			if (this === Fleur.EmptySequence) {
				return this;
			}
			copy = new Fleur.Sequence();
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.ARRAY_NODE:
			copy = new Fleur.Array();
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			copy = new Fleur.Attr();
			copy.nodeName = this.nodeName;
			copy.localName = this.localName;
			copy.prefix = this.prefix;
			copy.namespaceURI = this.namespaceURI;
			copy.schemaTypeInfo = this.schemaTypeInfo;
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.ELEMENT_NODE:
			copy = new Fleur.Element();
			copy.nodeName = this.nodeName;
			copy.localName = this.localName;
			copy.prefix = this.prefix;
			copy.namespaceURI = this.namespaceURI;
			copy.schemaTypeInfo = this.schemaTypeInfo;
			li = this.attributes.length;
			while (i < li) {
				copy.setAttributeNode(this.attributes[i++].copyNode());
			}
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.DOCUMENT_NODE:
			break;
		case Fleur.Node.FUNCTION_NODE:
			copy = new Fleur.Function(this.namespaceURI, this.nodeName, this.jsfunc, this.xqxfunc, this.argtypes, this.needctx, this.needcallback, this.restype, this.updating);
			break;
	}
	return copy;
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
			for (var i = 0, l = pnode.attributes.length; i < l; i++) {
				if (pnode.attributes[i].namespaceURI === "http://www.w3.org/2000/xmlns/" && pnode.attributes[i].value === namespaceURI) {
					return pnode.attributes[i].localName;
				}
			}
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
	//if (this.nodeType === Fleur.Node.DOCUMENT_NODE && (oldChild.nodeType === Fleur.Node.ELEMENT_NODE || oldChild.nodeType === Fleur.Node.DOCUMENT_TYPE_NODE)) {
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
	if (newChild.ownerDocument && newChild.ownerDocument !== (this.ownerDocument || this)) {
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
Fleur.Node.prototype.singleton = function() {
  if (this.nodeType === Fleur.Node.SEQUENCE_NODE && this.childNodes.length === 1) {
    return this.childNodes[0];
  }
  return this;
};
Fleur.Node.prototype.head = function() {
  if (this.nodeType === Fleur.Node.SEQUENCE_NODE && this.childNodes.length !== 0) {
    return this.childNodes[0];
  }
  return this;
}
Fleur.Node.prototype.isNotEmpty = function() {
  return this.nodeType !== Fleur.Node.SEQUENCE_NODE || this.childNodes.length !== 0;
};
Fleur.Node.prototype.isEmpty = function() {
  return this.nodeType === Fleur.Node.SEQUENCE_NODE && this.childNodes.length === 0;
};
Fleur.Node.prototype.isSingle = function() {
  return this.nodeType !== Fleur.Node.SEQUENCE_NODE;
};
Fleur.Node.prototype.toArray = function() {
	if (this.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		return [this];
	}
	return this.childNodes;
};
Fleur.Node.prototype.hasNumericType = function() {
	return Fleur.numericTypes.indexOf(this.schemaTypeInfo) !== -1;
};