"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.math_pi_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.data = "3.141592653589793";
  item.schemaTypeInfo = Fleur.Type_double;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_math["pi#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:pi", Fleur.Context.prototype.math_pi_0,
  [], Fleur.SequenceType_numeric_01);
/*
function() { return 3.141592653589793; },
  null, [], false, false, {type: Fleur.Type_double});
*/