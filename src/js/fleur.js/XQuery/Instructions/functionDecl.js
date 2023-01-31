"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_functionDecl = function(children) {
  let r = "";
  let fstype = Fleur.SequenceType_item_0n; 
  let sfstype = "SequenceType_item_0n"; 
  const updating = children[0][0] === Fleur.XQueryX.updatingFunction;
  const init = updating ? 1 : 0;
  const fname = children[init][1][0];
  let uri = this.rs.nsresolver.lookupNamespaceURI(" function");
  let prefix = null;
  if (children[init][1][1]) {
    if (children[init][1][1][0] === Fleur.XQueryX.URI) {
      uri = children[init][1][1][1][0];
    } else if (children[init][1][1][0] === Fleur.XQueryX.prefix) {
      prefix = children[init][1][1][1][0];
      uri = this.rs.nsresolver.lookupNamespaceURI(prefix);
    }
  }
  const nsr = this.rs.nsresolver;
  const args = children[init + 1][1].map(function(arg) {
    const o = {name: arg[1][0][1][0]};
    if (arg[1][0][1].length === 1) {
      o.uri = "";
    } else {
      //o.uri = nsr.lookupNamespaceURI(tprefix);
    }
    if (arg[1].length === 1) {
      o.sequenceType = "SequenceType_item_0n";
    } else {
      let tprefix = null, turi;
      const atype = arg[1][1][1][0][1];
      const tname = atype[0];
      if (atype[1]) {
        if (atype[1][0] === Fleur.XQueryX.URI) {
          turi = atype[1][1][0];
        } else if (atype[1][0] === Fleur.XQueryX.prefix) {
          tprefix = atype[1][1][0];
          turi = nsr.lookupNamespaceURI(tprefix);
        }
      }
      const occ = arg[1][1][1].length === 2 ? arg[1][1][1][1][1][0] : "";
      o.sequenceType = "SequenceType_" + tname + "_" + (
        occ === "" ? "1" :
        occ === "?" ? "01" :
        occ === "+" ? "1n" : "0n"
      );
    }
    return o;
  });
  let fbody;
  if (children[init + 2][0] === Fleur.XQueryX.typeDeclaration) {
    const fret = children[init + 2];
    const atype = fret[1][0][1];
    const tname = atype[0];
    let turi = "";
    let tprefix = "";
    if (atype[1]) {
      if (atype[1][0] === Fleur.XQueryX.URI) {
        turi = atype[1][1][0];
      } else if (atype[1][0] === Fleur.XQueryX.prefix) {
        tprefix = atype[1][1][0];
        turi = nsr.lookupNamespaceURI(tprefix);
      }
    }
    const occ = fret[1].length === 2 ? fret[1][1][1][0] : "";
    sfstype = "SequenceType_" + tname + "_" + (
      occ === "" ? "1" :
      occ === "?" ? "01" :
      occ === "+" ? "1n" : "0n"
    );
    fbody = children[init + 3][0] === Fleur.XQueryX.functionBody ? children[init + 3][1][0] : null;
  } else {
    fbody = children[init + 2][0] === Fleur.XQueryX.functionBody ? children[init + 2][1][0] : null;
  }
  if (!Fleur.XPathFunctions[uri]) {
    Fleur.XPathFunctions[uri] = {};
  }
  Fleur.XPathFunctions[uri][fname + "#" + String(args.length)] = new Fleur.Function(uri, prefix ? prefix + ":" + fname : fname, null, [], Fleur[sfstype], {dynonly: true});
  r += "\n" + this.indent + this.ctxvarname + ".xqx_functionDecl('" + uri + "', '" + fname + "', [" + args.reduce((s, a) => s + (s === "" ? "" : ", ") + this.ctxvarname + ".engine." + a.sequenceType, "") + "], " + this.ctxvarname + ".engine." + sfstype + ", function() {";
  const previndent = this.indent;
  const prevctxvarname = this.ctxvarname;
  this.indent += this.step;
  this.ctxvarname = "this";
  if (args.length !== 0) {
    this.rs.varresolver = new Fleur.varMgr([], this.rs.varresolver);
    const vr = this.rs.varresolver;
    args.forEach(a => vr.set(null, a.uri, a.name, Fleur[a.sequenceType]));
    r += this.inst("xqx_paramList()").inst;
    const sol = "\n" + this.indent + this.ctxvarname + ".xqx_param('";
    r += args.reverse().reduce((s, a) => s + sol + a.uri + "', '" + a.name + "');", "");
  }
  if (fbody) {
    r += this.gen(fbody).inst;
  }
  if (args.length !== 0) {
    this.rs.varresolver = this.rs.varresolver.previous;
    r += this.inst("xqx_paramList_drop()").inst;
  }
  r += "\n" + this.indent + "return " + this.ctxvarname + ";";
  this.indent = previndent;
  this.ctxvarname = prevctxvarname;
  r += "\n" + this.indent + "});";
  return {
    inst: r,
    sequenceType: Fleur.SequenceType_empty_sequence
  };
};

Fleur.Context.prototype.xqx_functionDecl = function(namespaceURI, fname, args, typedecl, f) {
  const prefix = this.rs.nsresolver.lookupPrefix(namespaceURI);
  if (!Fleur.XPathFunctions[namespaceURI]) {
    Fleur.XPathFunctions[namespaceURI] = {};
  }
  Fleur.XPathFunctions[namespaceURI][fname + "#" + String(args.length)] = new Fleur.Function(namespaceURI, prefix ? prefix + ":" + fname : fname, f, args, typedecl, {dynonly: true});
  Fleur.Context.prototype[(prefix ? prefix + "_" : "") + fname.replace(/-/g, "$_") + "_" + String(args.length)] = f;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.functionDecl] = function(ctx, children, callback) {
  var updating = children[0][0] === Fleur.XQueryX.updatingFunction;
  var init = updating ? 1 : 0;
  var fname = children[init][1][0];
  var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
  var prefix = null;
  if (children[init][1][1]) {
    if (children[init][1][1][0] === Fleur.XQueryX.URI) {
      uri = children[init][1][1][1][0];
    } else if (children[init][1][1][0] === Fleur.XQueryX.prefix) {
      prefix = children[init][1][1][1][0];
      uri = ctx.env.nsresolver.lookupNamespaceURI(prefix);
    }
  }
  var args = children[init + 1][1].map(function(arg) {
    var o = {name: arg[1][0][1][0]};
    if (arg[1].length === 1) {
      o.type = Fleur.Node;
      o.occurence = "*";
    } else {
      var tprefix = null, turi;
      var atype = arg[1][1][1][0][1];
      var tname = atype[0];
      if (atype[1]) {
        if (atype[1][0] === Fleur.XQueryX.URI) {
          turi = atype[1][1][0];
        } else if (atype[1][0] === Fleur.XQueryX.prefix) {
          tprefix = atype[1][1][0];
          turi = ctx.env.nsresolver.lookupNamespaceURI(tprefix);
        }
      }
      o.type = Fleur.Types[turi][tname];
      if (arg[1][1][1].length === 2) {
        o.occurence = arg[1][1][1][1][1][0];
      }
    }
    return o;
  });
  var fbody, fret;
  if (children[init + 2][0] === Fleur.XQueryX.typeDeclaration) {
    fret = children[init + 2][1][0];
    fbody = children[init + 3][0] === Fleur.XQueryX.functionBody ? children[init + 3][1][0] : null;
  } else {
    fret = {type: Fleur.Node, occurence: "*"};
    fbody = children[init + 2][0] === Fleur.XQueryX.functionBody ? children[init + 2][1][0] : null;
  }
  if (!Fleur.XPathFunctions[uri]) {
    Fleur.XPathFunctions[uri] = {};
  }
  Fleur.XPathFunctions[uri][fname + "#" + String(args.length)] = new Fleur.Function(uri, prefix ? prefix + ":" + fname : fname, null, fbody, args, false, false, fret, updating);
  Fleur.callback(function() {callback();});
};
*/