"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_unsignedByte_1 = function() {
  this.typeConstructor(Fleur.Type_unsignedByte);
  return this;
};

Fleur.XPathFunctions_xs["unsignedByte#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:unsignedByte", Fleur.Context.prototype.xs_unsignedByte_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_unsignedByte_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_unsignedByte, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/