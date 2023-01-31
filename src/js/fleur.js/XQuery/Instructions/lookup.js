"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_lookup = function(children) {
  let r = "";
  const childname =
    children[0][0] === Fleur.XQueryX.star ? "star" :
    children[0][0] === Fleur.XQueryX.NCName ? "NCName" :
    "expr";
  const NCName = childname === "NCName" ? children[0][1][0] : null;
  if (childname === "expr") {
    r = this.gen(children[0][1][0]).inst;
  }
  r += this.inst("xqx_lookup_" + childname + "(" + (NCName ? "'" + NCName + "'": "") + ")").inst;
  return {
    inst: r,
    sequenceType: childname === "star" ? Fleur.SequenceType_entry_0n : Fleur.SequenceType_entry_01
  };
};

Fleur.Context.prototype.xqx_lookup_NCName = function(NCName) {
  const arg = this.item;
  const res = new Fleur.Sequence();
  if (arg.isSingle()) {
    if (arg.nodeType === Fleur.Node.MAP_NODE) {
      arg.entries.forEach(e => {
        if (e.localName === NCName) {
          res.appendChild(e.cloneNode());
        }
      });
    }
  } else {
    arg.childNodes.forEach(c => {
      if (c.nodeType === Fleur.Node.MAP_NODE) {
        c.entries.forEach(e => {
          if (e.localName === NCName) {
            res.appendChild(e.cloneNode());
          }
        });
      }
    });
  }
  this.item = res.singleton();
  return this;
};
Fleur.Context.prototype.xqx_lookup_expr = function() {
  const arg1 = this.itemstack.pop();
  const NCName = this.item.data;
  const res = new Fleur.Sequence();
  if (arg1.isSingle()) {
    if (arg1.nodeType === Fleur.Node.MAP_NODE) {
      arg1.entries.forEach(e => {
        if (e.localName === NCName) {
          res.appendChild(e.cloneNode());
        }
      });
    }
  } else {
    arg1.childNodes.forEach(c => {
      if (c.nodeType === Fleur.Node.MAP_NODE) {
        c.entries.forEach(e => {
          if (e.localName === NCName) {
            res.appendChild(e.cloneNode());
          }
        });
      }
    });
  }
  this.item = res.singleton();
  return this;
};
Fleur.Context.prototype.xqx_lookup_star = function() {
  const arg = this.item;
  const res = new Fleur.Sequence();
  if (arg.isSingle()) {
    if (arg.nodeType === Fleur.Node.MAP_NODE) {
      arg.entries.forEach(e => res.appendChild(e.cloneNode()));
    }
  } else {
    arg.childNodes.forEach(c => {
      if (c.nodeType === Fleur.Node.MAP_NODE) {
        c.entries.forEach(e => res.appendChild(e.cloneNode()));
      }
    });
  }
  this.item = res.singleton();
  return this;
};
/*
Fleur.XQueryEngine.lookups = function(ctx, children, callback, functionid) {
//console.log(functionid + " - " + pos + " - " + Fleur.Serializer._serializeNodeToXQuery(ctx._curr, false, ""));
  var ncname, ilabel, seq;
  if (ctx._label) {
    if (children[0][0] === Fleur.XQueryX.NCName) {
      ncname = children[0][1][0];
      if (ncname !== ctx._label) {
        Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
      } else {
        ctx._curr.collabels = null;
        Fleur.callback(function() {callback(ctx._curr, functionid);});
      }
    } else {
      Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
        var a = Fleur.Atomize(n);
        if (a.nodeType !== Fleur.Node.TEXT_NODE) {
          Fleur.callback(function() {callback(a, functionid);});
        } else {
          if (a.data !== ctx._label) {
            Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
          } else {
            ctx._curr.collabels = null;
            Fleur.callback(function() {callback(ctx._curr, functionid);});
          }
        }
      });
    }
    return;
  } else if (ctx._curr.collabels) {
    if (children[0][0] === Fleur.XQueryX.NCName) {
      ncname = children[0][1][0];
      ilabel = ctx._curr.collabels.indexOf(ncname);
      if (ilabel === -1) {
        Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
      } else if (ctx._curr.childNodes[ilabel]) {
        if (ctx._curr.childNodes[ilabel].nodeType === Fleur.Node.MULTIDIM_NODE) {
          seq = new Fleur.Sequence();
          seq.appendChild(ctx._curr.childNodes[ilabel]);
          Fleur.callback(function() {callback(seq, functionid);});
        } else {
          Fleur.callback(function() {callback(ctx._curr.childNodes[ilabel], functionid);});
        }
      } else {
        Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
      }
    } else {
      Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
        var a = Fleur.Atomize(n);
        if (a.nodeType !== Fleur.Node.TEXT_NODE) {
          Fleur.callback(function() {callback(a, functionid);});
        } else {
          ilabel = ctx._curr.collabels.indexOf(a.data);
          Fleur.callback(function() {callback(ilabel === -1 || !ctx._curr.childNodes[ilabel] ? Fleur.EmptySequence : ctx._curr.childNodes[ilabel], functionid);});
        }
      });
    }
    return;
  }
  var parents = [];
  if (ctx._curr.nodeType === Fleur.Node.MAP_NODE || ctx._curr.nodeType === Fleur.Node.ARRAY_NODE) {
    parents.push(ctx._curr);
  } else if (ctx._curr.childNodes) {
    parents = ctx._curr.childNodes.filter(function(c) { return c.nodeType === Fleur.Node.MAP_NODE || c.nodeType === Fleur.Node.ARRAY_NODE;});  
  }
  if (parents.length === 0) {
    Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
    return;
  }
  seq = new Fleur.Sequence();
  seq.childNodes = new Fleur.NodeList();
  if (children[0][0] === Fleur.XQueryX.NCName) {
    ncname = children[0][1][0];
    parents.forEach(function(p) {
      var e;
      if (p.nodeType === Fleur.Node.MAP_NODE) {
        e = p.getEntryNode(ncname);
        if (e) {
          seq.appendChild(e);
        }
      }
    });
    if (seq.childNodes.length === 0) {
      seq = Fleur.EmptySequence;
    } else if (seq.childNodes.length === 1) {
      seq = seq.childNodes[0];
    }
    Fleur.callback(function() {callback(seq, functionid);});
  } else if (children[0][0] === Fleur.XQueryX.integerConstantExpr) {
    var idx = parseInt(children[0][1][0][1][0], 10) - 1;
    parents.forEach(function(p) {
      var e;
      if (p.nodeType === Fleur.Node.ARRAY_NODE) {
        e = p.childNodes[idx];
        if (e) {
          seq.appendChild(e);
        }
      }
    });
    if (seq.childNodes.length === 0) {
      seq = Fleur.EmptySequence;
    } else if (seq.childNodes.length === 1) {
      seq = seq.childNodes[0];
    }
    Fleur.callback(function() {callback(seq, functionid);});
  } else if (children[0][0] === Fleur.XQueryX.star) {
    parents.forEach(function(p) {
      if (p.nodeType === Fleur.Node.MAP_NODE) {
        p.entries.forEach(function(e) {
          seq.appendChild(e);
        });
      } else {
        p.childNodes.forEach(function(e) {
          seq.appendChild(e);
        });
      }
    });
    if (seq.childNodes.length === 0) {
      seq = Fleur.EmptySequence;
    } else if (seq.childNodes.length === 1) {
      seq = seq.childNodes[0];
    }
    Fleur.callback(function() {callback(seq, functionid);});
  } else {
    Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
      var a = Fleur.Atomize(n);
      if (a.nodeType !== Fleur.Node.TEXT_NODE) {
        Fleur.callback(function() {callback(a);});
      } else {
        parents.forEach(function(p) {
          var e; 
          if (p.nodeType === Fleur.Node.MAP_NODE) {
            e = p.getEntryNode(a.data);
          } else {
            e = p.childNodes[parseInt(a.data, 10) - 1];
          }
          if (e) {
            seq.appendChild(e);
          }
        });
        if (seq.childNodes.length === 0) {
          seq = Fleur.EmptySequence;
        } else if (seq.childNodes.length === 1) {
          seq = seq.childNodes[0];
        }
        Fleur.callback(function() {callback(seq, functionid);});
      }
    });
  }
};

Fleur.XQueryEngine[Fleur.XQueryX.lookup] = function(ctx, children, callback) {
  Fleur.XQueryEngine.lookups(ctx, children, callback, Fleur.XQueryX.lookup);
};
*/