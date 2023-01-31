"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_trace_1 = function() {
  console.log(Fleur.Serializer._serializeNodeToXQuery(this.item, false, ""));
  return this;
};
Fleur.Context.prototype.fn_trace_2 = function() {
  const label = this.item;
  const n = this.itemstack.pop();
  const labelval = label.isNotEmpty() ? label.data : "";
  console.log(labelval + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
  this.item = n;
  return this;
};
Fleur.Context.prototype.fn_trace_3 = function() {
  const serialization = this.item;
  const label = this.itemstack.pop();
  const n = this.itemstack.pop();
  const labelval = label.isNotEmpty() ? label.data : "";
  let contentType;
  let indent = false;
  if (serialization.isNotEmpty()) {
    const op2 = Fleur.toJSObject(serialization);
    contentType = Fleur.toContentType(op2[1],  "application/xquery");
    indent = op2[1].indent === "yes";
  }
  if (!contentType) {
    contentType = "application/xquery";
  }
  const ser = new Fleur.Serializer();
  console.log(labelval + ser.serializeToString(n, contentType, indent));
  this.item = n;
  return this;
};

Fleur.XPathFunctions_fn["trace#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace", Fleur.Context.prototype.fn_trace_1,
  [Fleur.SequenceType_item_0n], Fleur.SequenceType_item_0n);

Fleur.XPathFunctions_fn["trace#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace", Fleur.Context.prototype.fn_trace_2,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_string_1], Fleur.SequenceType_item_0n);

Fleur.XPathFunctions_fn["trace#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace", Fleur.Context.prototype.fn_trace_3,
  [Fleur.SequenceType_item_0n, Fleur.SequenceType_string_1, Fleur.SequenceType_item_01], Fleur.SequenceType_item_0n);
/*
  function(n) {
    console.log(Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
    return n;
  },
  null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node});
*/
/*
  function(n, label) {
    console.log((label || "") + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
    return n;
  },
  null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node});
*/
/*
  function(n, label, serialization) {
    var contentType;
    var indent = false;
    if (serialization) {
      var a2 = Fleur.Atomize(serialization);
      var  op2 = Fleur.toJSObject(a2);
      if (op2[0] < 0) {
        return n;
      }
      contentType = Fleur.toContentType(op2[1],  "application/xquery");
      indent = op2[1].indent === "yes";
    }
    if (!contentType) {
      contentType = "application/xquery";
    }
    var ser = new Fleur.Serializer();
    console.log((label || "") + ser.serializeToString(n, contentType, indent));
    return n;
  },
  null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node});
*/