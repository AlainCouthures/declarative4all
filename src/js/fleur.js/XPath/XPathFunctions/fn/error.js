"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_error_0 = function() {
  this.emptySequence().emptySequence().emptySequence().fn_error_3();
};
Fleur.Context.prototype.fn_error_1 = function() {
  this.emptySequence().emptySequence().fn_error_3();
};
Fleur.Context.prototype.fn_error_2 = function() {
  this.emptySequence().fn_error_3();
};
Fleur.Context.prototype.fn_error_3 = function() {
  //const errorObject = this.item;
  const description = this.itemstack.pop();
  const code = this.itemstack.pop();
  let namespaceURI = "http://www.w3.org/2005/xqt-errors";
  let localName = "FOER0000";
  let prefix = "err";
  if (code.isNotEmpty()) {
    namespaceURI = code.namespaceURI;
    localName = code.localName;
    prefix = code.prefix;
  }
  Fleur.XQueryError(namespaceURI, localName, prefix, null, description.data, null, null, null);
};

Fleur.XPathFunctions_fn["error#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:error", Fleur.Context.prototype.fn_error_0,
  [], null, {dynonly: true});

Fleur.XPathFunctions_fn["error#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:error", Fleur.Context.prototype.fn_error_1,
  [Fleur.SequenceType_QName_01], null, {dynonly: true});

Fleur.XPathFunctions_fn["error#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:error", Fleur.Context.prototype.fn_error_2,
  [Fleur.SequenceType_QName_01, Fleur.SequenceType_string_01], null, {dynonly: true});

Fleur.XPathFunctions_fn["error#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:error", Fleur.Context.prototype.fn_error_3,
  [Fleur.SequenceType_QName_01, Fleur.SequenceType_string_01, Fleur.SequenceType_item_0n], null, {dynonly: true});
/*
  function(ctx) {
    return Fleur.XPathFunctions_fn["error#3"].jsfunc(null, null, null, ctx);
  },
  null, [], true, false, {type: Fleur.Node});
*/
/*
function(code, ctx) {
    return Fleur.XPathFunctions_fn["error#3"].jsfunc(code, null, null, ctx);
  },
  null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Node});
*/
/*
  function(code, description, ctx) {
    return Fleur.XPathFunctions_fn["error#3"].jsfunc(code, description, null, ctx);
  },
  null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Node});
*/
/*  function(code, description, errorObject, ctx) {
    var a = new Fleur.Text();
    a.schemaTypeInfo = Fleur.Type_error;
    if (!code || code === Fleur.EmptySequence) {
      a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:FOER0000");
    } else if (code.nodeType !== Fleur.Node.TEXT_NODE || (code.schemaTypeInfo !== Fleur.Type_QName && code.schemaTypeInfo !== Fleur.Type_error)) {
      a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
    } else if (code.schemaTypeInfo === Fleur.Type_error) {
      return code;
    } else {
      a._setNodeNameLocalNamePrefix(code.namespaceURI, code.nodeName);
    }
    if (description) {
      a.data = description;
    }
    return a;
  },
  null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});
*/