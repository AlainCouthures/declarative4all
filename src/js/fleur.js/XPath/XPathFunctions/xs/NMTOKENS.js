"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_NMTOKENS_1 = function() {
  this.typeConstructor(Fleur.Type_NMTOKENS);
  return this;
};

Fleur.XPathFunctions_xs["NMTOKENS#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:NMTOKENS", Fleur.Context.prototype.xs_NMTOKENS_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_NMTOKEN_0n);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_NMTOKENS, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/