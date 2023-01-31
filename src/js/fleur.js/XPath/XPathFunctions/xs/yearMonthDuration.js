"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_yearMonthDuration_1 = function() {
  this.typeConstructor(Fleur.Type_yearMonthDuration);
  return this;
};

Fleur.XPathFunctions_xs["yearMonthDuration#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:yearMonthDuration", Fleur.Context.prototype.xs_yearMonthDuration_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_yearMonthDuration_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_yearMonthDuration, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/