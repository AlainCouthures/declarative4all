"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module FleurConv
 * @description  === FleurConv ===
 * Converter from Fleur XQuery parser result to XPath engine
 */

Fleur.Transpiler = function(ctxvarname, step) {
  this.ctxvarname = ctxvarname;
  this.step = step;
  this.indent = "";
  this.async = false;
};

Fleur.Transpiler.prototype.inst = function(s, isasync, expectedType, preinst) {
  return {
    inst: (preinst || "") + "\n" + this.indent + (isasync ? "await " : "") + this.ctxvarname + "." + s + ";",
    sequenceType: expectedType
  };
};

Fleur.Transpiler.prototype.gen = function(arr, expectedType) {
  return this[Fleur.XQueryXNames[1][arr[0]][2].replace(":", "_")](arr[1], expectedType);
};

Fleur.Transpiler.prototype.funcdef = function(arr, expectedType) {
  const previndent  = this.indent;
  this.indent += this.step;
  const prevasync = this.async;
  this.async = false;
  const gen = this.gen(arr, expectedType);
  const newasync = this.async;
  if (!this.async) {
    this.async = prevasync;
  }
  let result = gen.inst;
  result += "\n" + this.indent + "return "+ this.ctxvarname + ";";
  result += "\n" + previndent + "}";
  this.indent = previndent;
  return {
    inst: (this.indent === "" ? "" : "\n") + this.indent + (newasync ? "async " : "") + this.ctxvarname + " => {" + result,
    sequenceType: gen.sequenceType
  };
};