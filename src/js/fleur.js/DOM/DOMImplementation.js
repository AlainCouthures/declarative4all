/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
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
	//doc.ownerDocument = doc;
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