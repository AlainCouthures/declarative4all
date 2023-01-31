"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_current$_dateTime_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(this.rs.now);
  item.schemaTypeInfo = Fleur.Type_dateTime;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["current-dateTime#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-dateTime", Fleur.Context.prototype.fn_current$_dateTime_0,
  [], Fleur.SequenceType_dateTime_1, {dynonly: true});
/*
  function(ctx) {
    return ctx.env.now;
  },
  null, [], true, false, {type: Fleur.Type_dateTime});
*/