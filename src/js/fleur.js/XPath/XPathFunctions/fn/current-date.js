"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_current$_date_0 = function() {
  this.itemstack.push(this.item);
  const item = new Fleur.Text();
  item.appendData(Fleur.dateToDate(Fleur.toDate(this.rs.now)));
  item.schemaTypeInfo = Fleur.Type_date;
  this.item = item;
  return this;
};

Fleur.XPathFunctions_fn["current-date#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-date", Fleur.Context.prototype.fn_current$_date_0,
  [], Fleur.SequenceType_date_1, {dynonly: true});
/*  function(ctx) {
    return ctx.env.now;
  },
  null, [], true, false, {type: Fleur.Type_date});
*/