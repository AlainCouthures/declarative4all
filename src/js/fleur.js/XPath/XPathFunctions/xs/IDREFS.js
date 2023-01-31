"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_IDREFS_1 = function() {
  this.typeConstructor(Fleur.Type_IDREFS);
  return this;
};

Fleur.XPathFunctions_xs["IDREFS#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:IDREFS", Fleur.Context.prototype.xs_IDREFS_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_IDREF_0n);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_IDREFS, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/