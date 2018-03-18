/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
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
	if (this === typeArg) {
		return true;
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
Fleur.TypeInfo.prototype.getPrimitiveType = function(types, derivationMethod) {
	var propname, t, prim;
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
	if (types.indexOf(this) !== -1) {
		return this;
	}
	prim = this;
	t = this[propname];
	while (t) {
		if (types.indexOf(t) !== -1) {
			return t;
		}
		prim = t;
		t = t[propname];
	}
	return prim;
};
Fleur.TypeInfo.prototype.compareType = function(typeArg, derivationMethod) {
	var propname, t;
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
	var arr = [this];
	t = this[propname];
	while (t) {
		if (t === typeArg) {
			return typeArg;
		}
		arr.push(t);
		t = t[propname];
	}
	t = typeArg;
	while (t) {
		if (arr.indexOf(t) !== -1) {
			return t;
		}
		t = t[propname];
	}
	return null;
};