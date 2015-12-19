/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
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
			offset = index + entityvalue.length + 1;
		} else {
			break;
		}
	}
	return s.split("\r\n").join("\n");
};