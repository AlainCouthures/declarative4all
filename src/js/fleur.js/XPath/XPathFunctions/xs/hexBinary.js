"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_hexBinary_1 = function() {
  this.typeConstructor(Fleur.Type_hexBinary);
  return this;
};

Fleur.XPathFunctions_xs["hexBinary#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:hexBinary", Fleur.Context.prototype.xs_hexBinary_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_hexBinary_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_hexBinary, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/