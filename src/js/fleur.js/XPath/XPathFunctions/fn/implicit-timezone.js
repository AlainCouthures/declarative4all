"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_implicit$_timezone_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(this.rs.timezone);
  item.schemaTypeInfo = Fleur.Type_dayTimeDuration;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["implicit-timezone#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:implicit-timezone", Fleur.Context.prototype.fn_implicit$_timezone_0,
  [], Fleur.SequenceType_dayTimeDuration_01);
/*
  function(ctx) {
    var a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_dayTimeDuration;
    a.data = ctx.env.timezone;
    return a;
  },
  null, [], true, false, {type: Fleur.Node, occurence: "?"});
*/