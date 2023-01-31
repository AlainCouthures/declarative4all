"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_nonPositiveInteger_1 = function() {
  this.typeConstructor(Fleur.Type_nonPositiveInteger);
  return this;
};

Fleur.XPathFunctions_xs["nonPositiveInteger#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:nonPositiveInteger", Fleur.Context.prototype.xs_nonPositiveInteger_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_nonPositiveInteger_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_nonPositiveInteger, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/