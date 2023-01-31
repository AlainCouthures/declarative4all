"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_numeric_1 = function() {
  this.typeConstructor(Fleur.Type_numeric);
  return this;
};

Fleur.XPathFunctions_xs["numeric#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:numeric", Fleur.Context.prototype.xs_numeric_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_numeric_01);