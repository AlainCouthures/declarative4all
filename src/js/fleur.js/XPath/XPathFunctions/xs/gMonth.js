"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_gMonth_1 = function() {
  this.typeConstructor(Fleur.Type_gMonth);
  return this;
};

Fleur.XPathFunctions_xs["gMonth#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:gMonth", Fleur.Context.prototype.xs_gMonth_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_gMonth_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_gMonth, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/