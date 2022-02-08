"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_forClauseItem = function(children) {
  const previndent = this.indent;
  this.indent += this.step;
  const gen = this.funcdef(children[1][1][0]);
  this.indent = previndent;
  let result = "\n" + previndent + (this.async ? "await " : "") + this.ctxvarname + ".xqx_forClauseItem" + (this.async ? "_async" : "") + "('" + (children[0][1][0][1][0][1].length === 2 ? children[0][1][0][1][0][1][1][1][0] : "") + "', '" + children[0][1][0][1][0][1][0] + "',";
  result += gen.inst;
  result += "\n" + previndent + ");";
  return {
    inst: result
  };
};

Fleur.XQueryEngine[Fleur.XQueryX.forClauseItem] = function(ctx, children, callback, resarr) {
  //console.log("forClauseItem");
  var i = 0;
  var varname = children[0][1][0][1][0];
  var allowingEmpty = children[1][0] === Fleur.XQueryX.allowingEmpty ? 1 : 0;
  var positionalVariableBinding = children[1 + allowingEmpty][0] === Fleur.XQueryX.positionalVariableBinding ? 1 : 0;
  var pvarname = positionalVariableBinding !== 0 ? children[1 + allowingEmpty][1][0] : "";
  ctx.env.varresolver = resarr[0];
  var cb = function(n) {
    //console.log("forClause - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
    var posvalue;
    if (n === Fleur.EmptySequence) {
      if (allowingEmpty) {
        resarr[i].set(ctx, "", varname, n);
        if (positionalVariableBinding !== 0) {
          posvalue = new Fleur.Text();
          posvalue.data = "0";
          posvalue.schemaTypeInfo = Fleur.Type_integer;
          resarr[i].set(ctx, "", pvarname, posvalue);
        }
        i++;
      } else {
        resarr.splice(i, 1);
        if (resarr.length === 0) {
          Fleur.callback(function() {callback(Fleur.EmptySequence, true);});
          return;
        }
      }
    } else if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
      resarr[i].set(ctx, "", varname, n);
      if (positionalVariableBinding !== 0) {
        posvalue = new Fleur.Text();
        posvalue.data = "1";
        posvalue.schemaTypeInfo = Fleur.Type_integer;
        resarr[i].set(ctx, "", pvarname, posvalue);
      }
      i++;
    } else {
      n.childNodes.forEach(function(e, ie) {
        if (ie === 0) {
          resarr[i].set(ctx, "", varname, e);
          if (positionalVariableBinding !== 0) {
            posvalue = new Fleur.Text();
            posvalue.data = "1";
            posvalue.schemaTypeInfo = Fleur.Type_integer;
            resarr[i].set(ctx, "", pvarname, posvalue);
          }
        } else {
          var newres = resarr[i].clone();
          newres.set(ctx, "", varname, e);
          if (positionalVariableBinding !== 0) {
            posvalue = new Fleur.Text();
            posvalue.data = String(ie + 1);
            posvalue.schemaTypeInfo = Fleur.Type_integer;
            newres.set(ctx, "", pvarname, posvalue);
          }
          resarr.splice(i + ie, 0, newres);
        }
      });
      i += n.childNodes.length;
    }
    if (i !== resarr.length) {
      ctx.env.varresolver = resarr[i];
      Fleur.XQueryEngine[children[1 + allowingEmpty + positionalVariableBinding][1][0][0]](ctx, children[1 + allowingEmpty + positionalVariableBinding][1][0][1], cb);
    } else {
      Fleur.callback(function() {callback(Fleur.EmptySequence);});
    }
  };
  Fleur.XQueryEngine[children[1 + allowingEmpty + positionalVariableBinding][1][0][0]](ctx, children[1 + allowingEmpty + positionalVariableBinding][1][0][1], cb);
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.forClauseItem] = function(ctx, children, callback) {
  console.log("forClauseItem - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
  var varname = children[0][1][0][1][0];
  var allowingEmpty = children[1][0] === Fleur.XQueryX.allowingEmpty ? 1 : 0;
  var positionalVariableBinding = children[1 + allowingEmpty][0] === Fleur.XQueryX.positionalVariableBinding ? 1 : 0;
  var pvarname = positionalVariableBinding !== 0 ? children[1 + allowingEmpty][1][0] : "";
  Fleur.XQueryEngine[children[1 + allowingEmpty + positionalVariableBinding][1][0][0]](ctx, children[1 + allowingEmpty + positionalVariableBinding][1][0][1], function(n) {
    var next = Fleur.EmptySequence;
    var currval;
    var cb = function() {
    console.log("forClauseItem - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
      if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
        currval = next.childNodes.shift();
        if (next.childNodes.length === 1) {
          next = next.childNodes[0];
        }
      } else {
        currval = next;
        next = Fleur.EmptySequence;
      }
      //alert(varname + " = " + currval.data);
      ctx.env.varresolver.set(ctx, "", varname, currval);
      Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.forClauseItem, next === Fleur.EmptySequence ? null : cb);});
    };
    if (n === Fleur.EmptySequence) {
      if (allowingEmpty !== 0) {
        Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.forClauseItem, null);});
        return;
      }
      Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.forClauseItem);});
      return;
    }
    if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
      currval = n.childNodes.shift();
      if (n.childNodes.length === 1) {
        n = n.childNodes[0];
      }
    } else {
      currval = n;
      n = Fleur.EmptySequence;
    }
    next = n;
    //alert(varname + " = " + currval.data);
    ctx.env.varresolver.set(ctx, "", varname, currval);
    Fleur.callback(function() {callback(Fleur.EmptySequence, Fleur.XQueryX.forClauseItem, next === Fleur.EmptySequence ? null : cb);});
  });
};
*/