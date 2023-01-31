"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_base64Binary_1 = function() {
  this.typeConstructor(Fleur.Type_base64Binary);
  return this;
};

Fleur.XPathFunctions_xs["base64Binary#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:base64Binary", Fleur.Context.prototype.xs_base64Binary_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_base64Binary_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_base64Binary, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/