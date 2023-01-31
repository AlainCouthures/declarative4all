"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_contains$_token_2 = function() {
  this.itemstack.push(this.item);
  this.item = new Fleur.Text();
  this.item.data = "http://www.w3.org/2005/xpath-functions/collation/codepoint";
  this.item.schemaTypeInfo = Fleur.Type_collation;
  this.fn_contains$_token_3();
  return this;
};
Fleur.Context.prototype.fn_contains$_token_3 = function() {
  const collation = this.item;
  const token = this.itemstack.pop();
  const input = this.itemstack.pop();
  const res = new Fleur.Text();
  if (input.isEmpty() || token.isEmpty()) {
    res.data = "false";
  } else {
    const c = Fleur.getCollation(collation.data);
    let result = "false";
    const ftokens = inputdata => {
      const tokens = inputdata.split(" ");
      for (let i = 0, l = tokens.length; i < l; i++) {
        if (c.equals(tokens[i], token.data)) {
          return true;
        }
      }
      return false;
    };
    if (input.nodeType !== Fleur.Node.SEQUENCE_NODE) {
      result = String(ftokens(input.data));
    } else {
      for (let i = 0, l = input.childNodes.length; i < l; i++) {
        if (ftokens(input.childNodes[i].data)) {
          result = "true";
          break;
        }
      }
    }
    res.data = result;
  }
  res.schemaTypeInfo = Fleur.Type_boolean;
  this.item = res;
  return this;
};

Fleur.XPathFunctions_fn["contains-token#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains-token", Fleur.Context.prototype.fn_contains$_token_2,
  [Fleur.SequenceType_string_0n, Fleur.SequenceType_string_1], Fleur.SequenceType_boolean_1);

Fleur.XPathFunctions_fn["contains-token#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains-token", Fleur.Context.prototype.fn_contains$_token_3,
  [Fleur.SequenceType_string_0n, Fleur.SequenceType_string_1, Fleur.SequenceType_string_1], Fleur.SequenceType_boolean_1);
/*
function(input, token) {
    return Fleur.XPathFunctions_fn["contains-token#3"].jsfunc(input, token, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
  },
  null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
*/
/*
function(input, token, collation) {
    var c = Fleur.getCollation(collation);
    if (!c) {
      var e = new Error("");
      e.name = "FOCH0002";
      return e;
    }
    if (!input || input === "") {
      return false;
    }
    token = token.trim();
    if (token === "") {
      return false;
    }
    if (!(input instanceof Array)) {
      input = [input];
    }
    for (var i1 = 0, l1 = input.length; i1 < l1; i1++) {
      input[i1] = input[i1].split(" ");
      for (var i2 = 0, l2 = input[i1].length; i2 < l2; i2++) {
        if ( c.equals(input[i1][i2], token)) {
          return true;
        }
      }
    }
    return false;
  },
  null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
*/