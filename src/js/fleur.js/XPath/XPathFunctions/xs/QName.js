"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_QName_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.Type_QName,
  params_type: [
    Fleur.atomicTypes
  ]
};
Fleur.Context.prototype.xs_QName_1 = function() {
	this.typeConstructor(Fleur.Type_QName);
	return this;
};

Fleur.XPathFunctions_xs["QName#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:QName",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_QName, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});

Fleur.XPathFunctions_xs.QName = function(ctx, children, callback) {
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