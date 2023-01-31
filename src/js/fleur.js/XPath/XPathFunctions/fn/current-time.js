"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_current$_time_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(Fleur.dateToTime(Fleur.toTime(this.rs.now)));
  item.schemaTypeInfo = Fleur.Type_date;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["current-time#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-time", Fleur.Context.prototype.fn_current$_time_0,
  [], Fleur.SequenceType_time_1, {dynonly: true});
/*
  function(ctx) {
    return ctx.env.now;
  },
  null, [], true, false, {type: Fleur.Type_time});
*/