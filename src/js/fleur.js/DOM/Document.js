/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Document_index = 0;
Fleur.Document = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.DOCUMENT_NODE;
	this.nodeName = "#document";
	this.inputEncoding = "UTF-8";
	this.xmlStandalone = false;
	this.xmlVersion = "1.0";
	this._elementById = {};
	this._elementsByTagName = {};
	this.internal_id = String(Fleur.Document_index++);
	this.internal_id = String.fromCharCode(64 + this.internal_id.length) + this.internal_id;
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
/**
 * @name Fleur.Document#_adoptNode
 * @function
 * @param {Fleur.Node} source
 * @returns {Fleur.Node}
 */
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
/**
 * @name Fleur.Document#adoptNode
 * @function
 * @param {Fleur.Node} source
 * @returns {Fleur.Node}
 */
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
			console.log(qualifiedName);
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
	//if (!Fleur.Node.QNameReg.test(tagName) && (this.mediatype === "text/xml" || this.mediatype === "application/xml")) {
	//	if (Fleur.Node.QNameCharsReg.test(tagName)) {
	//		throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
	//	} else {
	//		throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
	//	}
	//}
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
	//if (!Fleur.Node.QNameReg.test(qualifiedName)) {
	//	if (Fleur.Node.QNameCharsReg.test(qualifiedName)) {
	//		throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
	//	} else {
	//		throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
	//	}
	//}
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
//	return this._elementsByTagName[namespaceURI] ? this._elementsByTagName[namespaceURI][localName] : null;
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
Fleur.Document.prototype.sortNodes = function(nodes) {
	nodes.sort(function(a, b) {
		var ia = a.internal_id;
		var ib = b.internal_id;
		return ia === ib ? 0 : ia < ib ? -1 : 1;
	});
	return nodes;
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
Fleur._evaluate = function(expression, contextNode, env, type, xpresult) {
	var doc;
	if (contextNode) {
		if (contextNode.nodeType === Fleur.Node.DOCUMENT_NODE) {
			doc = contextNode;
		} else if (contextNode.ownerDocument) {
			doc = contextNode.ownerDocument;
		}
	}
	env = env || {};
	var d = new Date();
	if (!env.timezone) {
		var jstz = d.getTimezoneOffset();
		env.timezone = Fleur.msToDayTimeDuration(-jstz * 60 * 1000);
	}
	if (!env.now) {
		env.now = d;
	}
	if (!env.nsresolver) {
		var nsResolver;
		if (doc && doc.documentElement) {
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
					lookupPrefix: function(uri) {
						return this.nsresolver.lookupPrefix(uri);
					},
					declareNamespace: function(prefix, uri) {
						return this.nsresolver.declareNamespace(prefix, uri);
					}
				};
			};
			env.nsresolver = nsResolver(doc.documentElement);
		} else if (doc) {
			nsResolver = function(document) {
				return {
					nsresolver: document.createNSResolver(),
					lookupNamespaceURI: function(prefix) {
						return this.nsresolver.lookupNamespaceURI(prefix);
					},
					lookupPrefix: function(uri) {
						return this.nsresolver.lookupPrefix(uri);
					},
					declareNamespace: function(prefix, uri) {
						return this.nsresolver.declareNamespace(prefix, uri);
					}
				};
			};
			env.nsresolver = nsResolver(doc);
		} else {
			env.nsresolver = new Fleur.XPathNSResolver();
		}
	}
	type = type || Fleur.XPathResult.ANY_TYPE;
	var invalidmsg = "";
	if (typeof expression === "string") {
		try {
			var compiled = new Fleur.XPathExpression(expression);
			expression = compiled;
		} catch(e) {
			invalidmsg = e.error;
		}
	}
	if (!xpresult) {
		xpresult = new Fleur.XPathResult(doc, invalidmsg === "" ? expression : null, contextNode, env, type);
		if (!xpresult.expression) {
			xpresult.expression = expression;
		}
	} else {
		xpresult.document = doc;
		xpresult.expression = expression;
		xpresult.contextNode = contextNode;
		xpresult.env = env;
		xpresult.resultType = type;
		xpresult._index = 0;
	}
	if (invalidmsg !== "") {
		xpresult._result = new Fleur.Text();
		xpresult._result.schemaTypeInfo = Fleur.Type_error;
		xpresult._result._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0003");
		xpresult._result.data = invalidmsg;
	}
	return xpresult;
};
Fleur.Document.prototype._evaluate = function(expression, contextNode, env, type, xpresult) {
	contextNode = contextNode || this;
	return Fleur._evaluate(expression, contextNode, env, type, xpresult);
};
Fleur.evaluate = function(expression, contextNode, env, type, xpresult) {
	if (xpresult && xpresult._result) {
		xpresult._result = null;
	}
	var xpr = Fleur._evaluate(expression, contextNode, env, type, xpresult);
	return xpr._result ? xpr : new Promise(function(resolve, reject) {
		xpr.evaluate(function(res) {
			resolve(res);
		}, function(res) {
			reject(res);
		});
	});
};
Fleur.Document.prototype.evaluate = function(expression, contextNode, env, type, xpresult) {
	contextNode = contextNode || this;
	return Fleur.evaluate(expression, contextNode, env, type, xpresult);
};;
Fleur.createExpression = function(expression) {
	expression = expression || "";
	return new Fleur.XPathExpression(expression);
};
Fleur.Document.prototype.createExpression = Fleur.createExpression;
Fleur.Document.prototype.createNSResolver = function(node) {
	return new Fleur.XPathNSResolver(node);
};
/*
Fleur.Document.prototype.normalizeDocument = function() {
};
*/
/*
Fleur.Document.prototype.renameNode = function(n, namespaceURI, qualifiedName) {
};
*/
