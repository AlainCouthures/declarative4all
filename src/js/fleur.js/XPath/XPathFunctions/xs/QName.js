"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_QName_1 = function() {
  this.typeConstructor(Fleur.Type_QName);
  let prefix = "";
  let localName = "";
  if (this.item.data.indexOf(":") !== -1) {
    const nparts = this.item.data.split(":");
    prefix = nparts[0];
    localName = nparts[1];
  } else {
    localName = this.item.data;
  }
  this.item.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  this.item.nodeName = this.item.data;
  this.item.prefix = prefix;
  this.item.localName = localName;
  this.item.data = null;
  return this;
};

Fleur.XPathFunctions_xs["QName#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:QName", Fleur.Context.prototype.xs_QName_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_QName_01);
/*
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
*/