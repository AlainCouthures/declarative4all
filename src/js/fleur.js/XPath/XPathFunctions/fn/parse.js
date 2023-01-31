"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_parse_2 = function() {
  const serialization = this.item;
  const arg = this.itemstack.pop();
  if (arg.isNotEmpty()) {
    let contentType = "application/xml";
    if (serialization.isNotEmpty()) {
      const op2 = Fleur.toJSObject(serialization);
      contentType = Fleur.toContentType(op2[1]);
    }
    const parser = new Fleur.DOMParser();
    this.item = parser.parseFromString(arg.data, contentType);
  } else {
    this.item = arg;
  }
  return this;
};

Fleur.XPathFunctions_fn["parse#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse", Fleur.Context.prototype.fn_parse_2,
  [Fleur.SequenceType_string_01, Fleur.SequenceType_item_01], Fleur.SequenceType_document_01);
/*
  function(arg, serialization) {
    var contentType;
    if (serialization) {
      var a2 = Fleur.Atomize(serialization);
      var  op2 = Fleur.toJSObject(a2);
      if (op2[0] < 0) {
        callback(a2);
        return;
      }
      serialization = op2[1];
      contentType = Fleur.toContentType(serialization);
    } else {
      contentType = "application/xml";
    }
    var parser = new Fleur.DOMParser();
    return arg !== null ? parser.parseFromString(arg, contentType) : null;
  },
  null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
*/