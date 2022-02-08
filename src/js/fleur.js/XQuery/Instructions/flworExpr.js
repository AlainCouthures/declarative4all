"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_flworExpr = function(children, expectedType) {
  const previndent = this.indent;
  let result = this.inst("xqx_flworExpr()").inst;
  const ctx = this;
  let returnSequenceType;
  let isasync = ctx.async;
  children.forEach((clause, i, arr) => {
    ctx.async = false;
    if (i === arr.length - 1) {
      ctx.indent += ctx.step;
      const returnFuncDef = ctx.funcdef(clause[1][0], expectedType);
      ctx.indent = previndent;
      result += "\n" + previndent + (ctx.async ? "await " : "") + this.ctxvarname + ".xqx_returnClause" + (ctx.async ? "_async" : "") + "(";
      result += returnFuncDef.inst;
      result += "\n" + previndent + ");";
      returnSequenceType = returnFuncDef.sequenceType;
    } else {
      result += ctx.gen(clause).inst;
    }
    if (!isasync) {
      isasync = ctx.async;
    }
  });
  ctx.async = isasync;
  return {
    inst: result,
    sequenceType: returnSequenceType
  };
};

/*
Fleur.Transpiler.prototype.xqx_flworExpr_old = function(children, expectedType) {
  const previndent = this.indent;
  this.indent += this.step;
  const ctx = this;
  let returnSequenceType;
  const gens = [];
  children.forEach((clause, i, arr) => {
    ctx.async = false;
    if (i === arr.length - 1) {
      const returnFuncDef = ctx.funcdef(clause[1][0], expectedType);
      gens.push(returnFuncDef);
      returnSequenceType = returnFuncDef.sequenceType;
    } else if (clause[0] === Fleur.XQueryX.forClause || clause[0] === Fleur.XQueryX.letClause) {
      clause[1].forEach(clauseItem => {
        ctx.async = false;
        gens.push(ctx.funcdef(clauseItem));
      });
    } else {
      gens.push(ctx.funcdef(clause));
    }
  });
  const asyncacc = gens.reduce((acc, gen) => acc || gen.async, false);
  let result = "\n" + previndent + this.ctxvarname + ".xqx_flworExpr" + (asyncacc ? "_async" : "") + "([";
  result = gens.reduce((r, gen, i, arr) => r + (asyncacc ? "\n" + ctx.indent + "[" + String(Boolean(gen.async)) + ", " + gen.inst.trimStart() + "]" : gen.inst) + (i === arr.length - 1 ? "" : ","), result);
  this.indent = previndent;
  return {
    inst: result + "\n" + previndent + "]);",
    sequenceType: returnSequenceType
  };
};
*/

Fleur.Context.prototype.xqx_flworExpr = function() {
  this.tuplestack.push(this.tuple);
  this.tuple = [new Fleur.varMgr([], this.rs.varresolver)];
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.flworExpr] = function(ctx, children, callback) {
  //console.log("flworExpr");
  var i = 0;
  var prevvarres;
  var resarr;
  var cb = function(n, empty) {
    //console.log("flworExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + " " + String(empty));
    if (empty || n.schemaTypeInfo === Fleur.Type_error) {
      ctx.env.varresolver = prevvarres;
      Fleur.callback(function() {callback(n);});
      return;
    }
    i++;
    if (i === children.length) {
      ctx.env.varresolver = prevvarres;
      Fleur.callback(function() {callback(n);});
      return;
    }
    Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb, resarr);
  };
  prevvarres = ctx.env.varresolver;
  resarr = [new Fleur.varMgr([], prevvarres)];
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb, resarr);
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.flworExpr] = function(ctx, children, callback, ncbs) {
  console.log("flworExpr - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
  var result = Fleur.EmptySequence;
  ncbs = ncbs || [];
  var i = 0;
  var cb = function(n, eob, cbs) {
    console.log("flworExpr - cb - " + Fleur.Serializer._serializeNodeToXQuery(n, false, "") + (eob ? " - " + (eob === Fleur.XQueryX.flworExpr ? "flworExpr" : eob === Fleur.XQueryX.forClause ? "forClause" : "letClause") : ""));
    if (cbs) {
      ncbs = ncbs.concat(cbs);
    }
    if (n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n, Fleur.XQueryX.flworExpr);});
      return;
    }
    if (eob === Fleur.XQueryX.flworExpr) {
      console.log("Got " + (n.nodeType !== Fleur.Node.SEQUENCE_NODE ? "text": "sequence") + "!");
      if (n !== Fleur.EmptySequence) {
        if (result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
          result = n;
          console.log("result = n :" + (n.nodeType !== Fleur.Node.SEQUENCE_NODE ? 1 : result.childNodes.length));
        } else {
          if (newresult === Fleur.EmptySequence || newresult.nodeType !== Fleur.Node.SEQUENCE_NODE) {
            var seq = new Fleur.Sequence();
            seq.childNodes = new Fleur.NodeList();
            seq.children = new Fleur.NodeList();
            seq.textContent = "";
            if (result !== Fleur.EmptySequence) {
              seq.appendChild(result);
            }
            result = seq;
          }
          if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
            result.appendChild(n);
          } else {
            n.childNodes.forEach(function(node) {
              result.appendChild(node);
            });
          }
          console.log(result.childNodes.length);
        }
      }
      if (ncbs.length !== 0) {
        Fleur.callback(ncbs.pop());
        return;
      }
      Fleur.callback(function() {callback(result, Fleur.XQueryX.flworExpr);});
      return;
    }
    i++;
    if (i === children.length) {
      Fleur.callback(function() {callback(n, Fleur.XQueryX.flworExpr);});
      return;
    }
    Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb, ncbs);
  };
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
*/