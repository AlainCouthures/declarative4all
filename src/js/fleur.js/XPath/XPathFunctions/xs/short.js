"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licenSe LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_short_1 = function() {
  this.typeConstructor(Fleur.Type_short);
  return this;
};

Fleur.XPathFunctions_xs["short#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:short", Fleur.Context.prototype.xs_short_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_short_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_short, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/