/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_nameTest = function(children) {
	const param = children.length !== 1 ? "\"" + children[1][1][0] + "\", " : "";
	const ns = children.length !== 1 ? children[1][0] === Fleur.XQueryX.prefix ? "_prefix" : "_namespaceURI" : "";
	return this.inst("xqx_nameTest" + ns + "(" + param + "\"" + children[0] + "\")");
};

Fleur.Context.prototype.xqx_nameTest = function(localName) {
  const namespaceURI = this.rs.nsresolver.lookupNamespaceURI("");
  return this.nodeTest(this.xpathAxis === Fleur.Context.XPATHAXIS_ATTRIBUTE ? Fleur.Node.ATTRIBUTE_NODE : Fleur.Node.ELEMENT_NODE, namespaceURI, localName);
};

Fleur.Context.prototype.xqx_nameTest_namespaceURI = function(namespaceURI, localName) {
  return this.nodeTest(this.xpathAxis === Fleur.Context.XPATHAXIS_ATTRIBUTE ? Fleur.Node.ATTRIBUTE_NODE : Fleur.Node.ELEMENT_NODE, namespaceURI, localName);
};

Fleur.Context.prototype.xqx_nameTest_prefix = function(prefix, localName) {
  const namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  return this.nodeTest(this.xpathAxis === Fleur.Context.XPATHAXIS_ATTRIBUTE ? Fleur.Node.ATTRIBUTE_NODE : Fleur.Node.ELEMENT_NODE, namespaceURI, localName);
};

Fleur.XQueryEngine[Fleur.XQueryX.nameTest] = function(ctx, children, callback) {
//console.log("nameTest - " + children[0] + " - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
	if (ctx._curr.localName !== children[0]) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	var nsURI;
	if (children.length === 1) {
		nsURI = ctx.env.nsresolver.lookupNamespaceURI("") || "";
	} else if (children[1][0] === Fleur.XQueryX.prefix) {
		nsURI = ctx.env.nsresolver.lookupNamespaceURI(children[1][1][0]) || "";
	} else {
		nsURI = children[1][1][0];
	}
	var currURI = ctx._curr.namespaceURI || "";
	if (currURI !==  nsURI && currURI !== "http://www.w3.org/1999/xhtml") {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	Fleur.callback(function() {callback(ctx._curr);});
};
