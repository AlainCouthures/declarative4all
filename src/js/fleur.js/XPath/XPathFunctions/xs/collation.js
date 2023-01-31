"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_collation_1 = function() {
  this.typeConstructor(Fleur.Type_collation);
  return this;
};

Fleur.XPathFunctions_xs["collation#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:collation", Fleur.Context.prototype.xs_collation_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_collation_01);