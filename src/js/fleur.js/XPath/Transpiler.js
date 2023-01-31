"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module Transpiler
 * @description  === Transpiler ===
 * Transpiler from Fleur XQuery parser result to Javascript function
 */

Fleur.Transpiler = function(ctxvarname, step, rs) {
  this.ctxvarname = ctxvarname || "ctx";
  this.step = step || "  ";
  this.indent = "";
  this.async = false;
  if (!rs) {
    rs = {};
    rs.now = Fleur.dateToDateTime();
    rs.nsresolver = new Fleur.XPathNSResolver();
    rs.varresolver = new Fleur.varMgr();
  }
  this.rs = rs;
};

Fleur.Transpiler.prototype.inst = function(s, isasync, expectedSequenceType, preinst, dynseqtype) {
  return {
    inst: (preinst || "") + "\n" + this.indent + (isasync ? "await " : "") + this.ctxvarname + "." + s + ";" +
    (expectedSequenceType && dynseqtype && dynseqtype.nodeType !== Fleur.Node.ANY_NODE ? "\n" + this.indent + this.ctxvarname + ".fn_data_1();" + 
      (expectedSequenceType.schemaTypeInfo.typeName !== "anyAtomicType" ?
        "\n" + this.indent + this.ctxvarname + "." + expectedSequenceType.schemaTypeInfo.constructorName + "();" : "") : "" 
    ),
    sequenceType: expectedSequenceType
  };
};

Fleur.Transpiler.prototype.gen = function(arr, expectedSequenceType) {
  const instname = Fleur.XQueryXNames[1][arr[0]][2];
  const jsfunc = this[instname.replace(":", "_")];
  if (jsfunc) {
    const genret = this[instname.replace(":", "_")](arr[1], expectedSequenceType);
    if (genret.sequenceType && !genret.sequenceType.as(expectedSequenceType)) {
      Fleur.XQueryError_xqt("XPST0017", null, "Invalid type");
    }
    return genret;
  }
  Fleur.XQueryError_xqt("XPST0000", null, "Unsupported instruction", "", new Fleur.Text(instname));
};

Fleur.Transpiler.prototype.funcdef = function(arr, expectedType, main) {
  const previndent  = this.indent;
  const prevctxvarname = this.ctxvarname;
  this.ctxvarname = "ctx";
  this.indent += this.step;
  const prevasync = this.async;
  this.async = false;
  const gen = this.gen(arr, expectedType);
  const newasync = this.async;
  if (!this.async) {
    this.async = prevasync;
  }
  let result = gen.inst;
  result += "\n" + this.indent + "return "+ this.ctxvarname + (main ? ".item" : "") + ";";
  result += "\n" + previndent + "}";
  this.indent = previndent;
  this.ctxvarname = prevctxvarname;
  return {
    inst: (this.indent === "" ? "" : "\n") + this.indent + (newasync ? "async " : "") + "ctx => {" + result,
    sequenceType: gen.sequenceType
  };
};

Fleur.Transpiler.prototype.source = function(arr) {
  this.indent += this.step;
  const prevasync = this.async;
  this.async = false;
  const gen = this.gen(arr);
  const newasync = this.async;
  if (!this.async) {
    this.async = prevasync;
  }
  let result = "\"use strict\";";
  result += "\nconst Fleur = require('./fleur.js');";
  result += "\n(" + (newasync ? "async " : "") + "() => {";
  result += "\n" + this.indent + "const " + this.ctxvarname + " = new Fleur.Context();"; 
  result += gen.inst;
  result += "\n" + this.indent + this.ctxvarname + ".log();";
  result += "\n})();";
  this.indent = "";
  return result;
};

Fleur.Transpiler.prototype.staticargs = function(args) {
  const ctx = new Fleur.Context(null, this.rs, []);
  for (let i = 0; i < args.length - 1; i++) {
    ctx.itemstack.push(args[i].value);
  }
  if (args.length !== 0) {
    ctx.item = args[args.length - 1].value;
  }
  return ctx;
};