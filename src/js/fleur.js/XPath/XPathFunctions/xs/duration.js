"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_duration_1 = function() {
  this.typeConstructor(Fleur.Type_duration);
  return this;
};

Fleur.XPathFunctions_xs["duration#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:duration", Fleur.Context.prototype.xs_duration_1,
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_duration_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_duration, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/