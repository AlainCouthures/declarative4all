"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_data_0 = function() {
  this.itemstack.push(this.item);
  this.item = Fleur.Atomize(this.path, true);
  return this;
};
Fleur.Context.prototype.fn_data_1 = function() {
  this.item = Fleur.Atomize(this.item, true);
  return this;
};

Fleur.XPathFunctions_fn["data#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:data", Fleur.Context.prototype.fn_data_0,
  [], Fleur.SequenceType_anyAtomicType_0n);

Fleur.XPathFunctions_fn["data#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:data", Fleur.Context.prototype.fn_data_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_anyAtomicType_0n);
/*
function(ctx) {
    return Fleur.XPathFunctions_fn["data#1"].jsfunc(ctx._curr);
  },
  null, [], true, false, {type: Fleur.Node, occurence: "*"});
*/
/*
function(arg) {
    return Fleur.Atomize(arg, true);
  },
  null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node, occurence: "*"});
*/