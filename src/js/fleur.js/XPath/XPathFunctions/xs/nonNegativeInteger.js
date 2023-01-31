"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_nonNegativeInteger_1 = function() {
  this.typeConstructor(Fleur.Type_nonNegativeInteger);
  return this;
};

Fleur.XPathFunctions_xs["nonNegativeInteger#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:nonNegativeInteger", Fleur.Context.prototype.xs_nonNegativeInteger_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_nonNegativeInteger_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_nonNegativeInteger, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/