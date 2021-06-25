"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.xs_unsignedByte_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {
    nodeType: Fleur.Node.TEXT_NODE,
    schemaTypeInfo: Fleur.Type_unsignedByte,
    occurrence: "?"
  },
  params_type: [
    {
      nodeType: Fleur.Node.TEXT_NODE,
      schemaTypeInfo: Fleur.Type_anySimpleType,
      occurrence: "?"
    }
  ]
};
Fleur.Context.prototype.xs_unsignedByte_1 = function() {
  this.typeConstructor(Fleur.Type_unsignedByte);
  return this;
};

Fleur.XPathFunctions_xs["unsignedByte#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:unsignedByte",
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_unsignedByte, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});