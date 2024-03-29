/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.dynamicFunctionInvocationExpr] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    if (n && n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    }
    if (n && n.nodeType === Fleur.Node.ENTRY_NODE) {
      n = n.firstChild;
    }
    var args = children[children.length - 1][0] === Fleur.XQueryX.arguments ? children[children.length - 1][1] : [];
    var preds = [];
    children.forEach(function(child) {
      if (child[0] === Fleur.XQueryX.predicates) {
        child[1].forEach(function(subchild) {preds.push(subchild);});
      } else if (child[0] === Fleur.XQueryX.predicate) {
        preds.push(child[1][0]);
      } else if (child[0] === Fleur.XQueryX.lookup) {
        preds.push(child);
      }
    });
    if (preds.length === 0) {
      if (!n || n.nodeType !== Fleur.Node.FUNCTION_NODE) {
        Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
        return;
      }
      Fleur.functionCall(ctx, children, n, args, callback);
    } else {
      var next;
      if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
        next = new Fleur.Sequence();
        next.childNodes = new Fleur.NodeList();
        n.childNodes.forEach(function(node) {
          next.appendChild(node);
        });
      } else {
        next = n;
      }
      Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
        _next: next,
        _item: ctx._item,
        env: ctx.env
      }, preds, function(n) {
        if (n && n.nodeType === Fleur.Node.ENTRY_NODE) {
          n = n.firstChild;
        }
        if (!n || n.nodeType !== Fleur.Node.FUNCTION_NODE) {
          Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
          return;
        }
        Fleur.functionCall(ctx, children, n, args, callback);
      });
    }
  });
};
/*
    var mainUpdater = false;
    var xf = n;
    if (xf.updating && !ctx.updater) {
      if (Fleur.XQueryEngine.updating) {
        Fleur.XQueryEngine.updateQueue.push(function() {
          Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr](ctx, children, callback);
        });
        return;
      }
      Fleur.XQueryEngine.updating = true;
      mainUpdater = true;
      ctx.updater = true;
    }
    if (xf.jsfunc || xf.xqxfunc) {
      var argscalc = function(xqxargs, effargs, f) {
        if (xqxargs.length === 0) {
          f(effargs);
        } else {
          var xqxarg = xqxargs.shift();
          Fleur.XQueryEngine[xqxarg[0]](ctx, xqxarg[1], function(n) {
            if ((xf.argtypes && xf.argtypes[effargs.length].type === Fleur.Node) || (n && n.nodeType === Fleur.Node.SEQUENCE_NODE)) {
              effargs.push(n);
            } else if (xf.argtypes && xf.argtypes[effargs.length].type === Fleur.Type_handler) {
              effargs.push(n.data);
            } else {
              var a = Fleur.Atomize(n);
              effargs.push(a);
            }
            argscalc(xqxargs, effargs, f);
          });
        }
      };
      argscalc(args.slice(), [], function(effargs) {
        var a = new Fleur.Text();
        a.schemaTypeInfo = xf.restype ? xf.restype.type : null;
        a.data = "";
        if (xf.jsfunc) {
          var jsargs = [];
          try {
            effargs.forEach(function(effarg, iarg) {
              var op;
              var carg = xf.argtypes ? xf.argtypes[iarg] : null;
              if (carg.type === Fleur.Node) {
                jsargs.push(effarg);
              } else if (effarg === Fleur.EmptySequence) {
                if (carg && (!carg.occurence || (carg.occurence !== "?" && carg.occurence !== "*"))) {
                  a.nodeType = Fleur.Node.TEXT_NODE;
                  a.schemaTypeInfo = Fleur.Type_error;
                  a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
                  throw new Error("error");
                }
                jsargs.push(null);
              } else if (effarg.nodeType === Fleur.Node.SEQUENCE_NODE) {
                if (carg && (!carg.occurence || carg.occurence === "?")) {
                  a.nodeType = Fleur.Node.TEXT_NODE;
                  a.schemaTypeInfo = Fleur.Type_error;
                  a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
                  throw new Error("error");
                }
                var subarr = [];
                for (var iseq = 0, lseq = effarg.childNodes.length; iseq < lseq; iseq++) {
                  var effchild = effarg.childNodes[iseq];
                  if ((!carg && Fleur.numericTypes.indexOf(effchild.schemaTypeInfo) !== -1) || (carg && (carg.type === Fleur.numericTypes || Fleur.numericTypes.indexOf(carg.type) !== -1))) {
                    op = Fleur.toJSNumber(effchild);
                    if (op[0] < 0) {
                      a = effchild;
                      throw new Error("error");
                    }
                    subarr.push(op[1]);
                  } else if ((!carg && effchild.schemaTypeInfo === Fleur.Type_string) || (carg && carg.type === Fleur.Type_string)) {
                    op = Fleur.toJSString(effchild);
                    if (op[0] < 0) {
                      a = effchild;
                      throw new Error("error");
                    }
                    subarr.push(op[1]);
                  } else if ((!carg && effchild.schemaTypeInfo === Fleur.Type_boolean) || (carg && carg.type === Fleur.Type_boolean)) {
                    op = Fleur.toJSBoolean(effchild);
                    if (op[0] < 0) {
                      a = effchild;
                      throw new Error("error");
                    }
                    subarr.push(op[1]);
                  } else if (carg.type === Fleur.Type_dateTime) {
                  } else {
                    subarr.push(effchild);
                  }
                }
                jsargs.push(subarr);
              } else if ((!carg && Fleur.numericTypes.indexOf(effarg.schemaTypeInfo) !== -1) || (carg && (carg.type === Fleur.numericTypes || Fleur.numericTypes.indexOf(carg.type) !== -1 || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)))) {
                op = Fleur.toJSNumber(effarg);
                if (op[0] < 0) {
                  a = effarg;
                  throw new Error("error");
                }
                jsargs.push(op[1]);
              } else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_string) || (carg && (carg.type === Fleur.Type_string || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION)))) {
                op = Fleur.toJSString(effarg);
                if (op[0] < 0) {
                  a = effarg;
                  throw new Error("error");
                }
                jsargs.push(op[1]);
              } else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_boolean) || (carg && carg.type === Fleur.Type_boolean)) {
                op = Fleur.toJSBoolean(effarg);
                if (op[0] < 0) {
                  a = effarg;
                  throw new Error("error");
                }
                jsargs.push(op[1]);
              } else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_dateTime) || (carg.type === Fleur.Type_dateTime)) {
                op = Fleur.toJSDate(effarg);
                if (op[0] < 0) {
                  a = effarg;
                  throw new Error("error");
                }
                jsargs.push(op[1]);
              } else {
                jsargs.push(effarg);
              }
            });
          } catch (e) {
            Fleur.callback(function() {callback(a);});
            return;
          }
          if (xf.needctx) {
            jsargs.push(ctx);
          }
          var convback = function(vret) {
            if (mainUpdater) {
              Fleur.XQueryEngine.updating = false;
              ctx.updater = false;
              if (Fleur.XQueryEngine.updateQueue.length !== 0) {
                setImmediate(Fleur.XQueryEngine.updateQueue.pop());
              }
            }
            var convret = function(v) {
              if (v === undefined || v === null) {
                a = Fleur.EmptySequence;
              } else if (v === Number.POSITIVE_INFINITY) {
                a.data = "INF";
                if (!a.schemaTypeInfo) {
                  a.schemaTypeInfo = Fleur.Type_double;
                }
              } else if (v === Number.NEGATIVE_INFINITY) {
                a.data = "-INF";
                if (!a.schemaTypeInfo) {
                  a.schemaTypeInfo = Fleur.Type_double;
                }
              } else if (typeof v === "number" || typeof v === "boolean") {
                a.data = String(v);
                if (!a.schemaTypeInfo) {
                  a.schemaTypeInfo = typeof v === "number" ? Fleur.Type_double : Fleur.Type_boolean;
                }
              } else if (typeof v === "string") {
                a.data = v;
                if (!a.schemaTypeInfo) {
                  a.schemaTypeInfo = Fleur.Type_string;
                }
              } else if (typeof v.getMonth === "function") {
                var o = vret.getTimezoneOffset();
                if (!a.schemaTypeInfo) {
                  a.schemaTypeInfo = Fleur.Type_datetime;
                }
                if (a.schemaTypeInfo === Fleur.Type_date) {
                  a.data = ("000" + v.getFullYear()).slice(-4) + "-" + ("0" + (v.getMonth() + 1)).slice(-2) + "-" + ("0" + v.getDate()).slice(-2) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
                } else if (a.schemaTypeInfo === Fleur.Type_time) {
                  a.data = ("0" + v.getHours()).slice(-2) + ":" + ("0" + v.getMinutes()).slice(-2) + ":" + ("0" + v.getSeconds()).slice(-2) + "." + ("00" + v.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
                } else {
                  a.data = ("000" + v.getFullYear()).slice(-4) + "-" + ("0" + (v.getMonth() + 1)).slice(-2) + "-" + ("0" + v.getDate()).slice(-2) + "T" + ("0" + v.getHours()).slice(-2) + ":" + ("0" + v.getMinutes()).slice(-2) + ":" + ("0" + v.getSeconds()).slice(-2) + "." + ("00" + v.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
                }
              } else if (v instanceof Error) {
                a.nodeType = Fleur.Node.TEXT_NODE;
                a.schemaTypeInfo = Fleur.Type_error;
                a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY");
              } else if (v instanceof Fleur.Node || (Node && v instanceof Node)) {
                a = v;
              } else {
                a.data = v;
                if (!a.schemaTypeInfo) {
                  a.schemaTypeInfo = Fleur.Type_handler;
                }
              }
            };
            if (vret instanceof Array) {
              var seq = new Fleur.Sequence();
              vret.forEach(function(v) {
                a = new Fleur.Text();
                a.schemaTypeInfo = xf.restype ? xf.restype.type : null;
                a.data = "";
                convret(v);
                seq.appendChild(a);
              });
              Fleur.callback(function() {callback(seq);});
            } else {
              convret(vret);
              Fleur.callback(function() {callback(a);});
            }
          };
          if (xf.needcallback) {
            jsargs.push(convback);
            xf.jsfunc.apply(null, jsargs);
            return;
          }
          convback(xf.jsfunc.apply(null, jsargs));
        } else {
          var currvarres = ctx.env.varresolver;
          ctx.env.varresolver = new Fleur.varMgr([], xf.closurevarresolver || ctx.env.globalvarresolver);
          effargs.forEach(function(effarg, iarg) {
            ctx.env.varresolver.set(ctx, "", xf.argtypes[iarg].name, effarg);
          });
          Fleur.XQueryEngine[xf.xqxfunc[0]](ctx, xf.xqxfunc[1], function(n) {
            if (mainUpdater) {
              Fleur.XQueryEngine.updating = false;
              ctx.updater = false;
              if (Fleur.XQueryEngine.updateQueue.length !== 0) {
                setImmediate(Fleur.XQueryEngine.updateQueue.pop());
              }
            }
            ctx.env.varresolver = currvarres;
            Fleur.callback(function() {callback(n);});
          });
        }
      });
    } else {
      xf(ctx, args, function(n) {
        if (mainUpdater) {
          Fleur.XQueryEngine.updating = false;
          ctx.updater = false;
          if (Fleur.XQueryEngine.updateQueue.length !== 0) {
            setImmediate(Fleur.XQueryEngine.updateQueue.pop());
          }
        }
        Fleur.callback(function() {callback(n);});
      });
    }
 */