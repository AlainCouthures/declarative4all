"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_gYear_1 = function() {
  this.typeConstructor(Fleur.Type_gYear);
  return this;
};

Fleur.XPathFunctions_xs["gYear#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:gYear", Fleur.Context.prototype.xs_gYear_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_gYear_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_gYear, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/