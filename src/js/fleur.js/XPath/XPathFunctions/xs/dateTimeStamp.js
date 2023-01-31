"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xs_dateTimeStamp_1 = function() {
  this.typeConstructor(Fleur.Type_dateTimeStamp);
  return this;
};

Fleur.XPathFunctions_xs["dateTimeStamp#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:dateTimeStamp",
  [Fleur.SequenceType_anyAtomicType_01], Fleur.SequenceType_dateTimeStamp_01);
/*
  function(arg) {
    return Fleur.XPathConstructor(arg, Fleur.Type_dateTimeStamp, function() {});
  },
  null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
*/