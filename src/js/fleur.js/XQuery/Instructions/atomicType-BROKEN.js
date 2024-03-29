"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
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