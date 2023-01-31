"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_byte_1 = function() {
  this.typeConstructor(Fleur.Type_byte);
  return this;
};

Fleur.XPathFunctions_xs["byte#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:byte", Fleur.Context.prototype.xs_byte_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_byte_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_byte, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/