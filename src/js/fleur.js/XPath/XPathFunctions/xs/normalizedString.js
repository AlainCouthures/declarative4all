"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_normalizedString_1 = function() {
  this.typeConstructor(Fleur.Type_normalizedString);
  return this;
};

Fleur.XPathFunctions_xs["normalizedString#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:normalizedString", Fleur.Context.prototype.xs_normalizedString_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_normalizedString_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_normalizedString, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/