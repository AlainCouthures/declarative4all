"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_double_1 = function() {
  this.typeConstructor(Fleur.Type_double);
  return this;
};

Fleur.XPathFunctions_xs["double#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:double", Fleur.Context.prototype.xs_double_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_double_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_double, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/