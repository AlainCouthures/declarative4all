/*globals Fleur*/
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

Fleur.Transpiler.prototype.inst = function(s, isasync, atomicType) {
	return "\n" + this.indent + (isasync ? "await " : "") + this.ctxvarname + "." + s + ";" + (atomicType && atomicType.atomizerName ? this.inst(atomicType.atomizerName + "()") : atomicType === Fleur.atomicTypes ? this.inst("atomize()") : "");
};

Fleur.Transpiler.prototype.gen = function(arr, atomicType) {
  return this[Fleur.XQueryXNames[1][arr[0]][2].replace(":", "_")](arr[1], atomicType);
};

Fleur.Transpiler.prototype.funcdef = function(arr) {
	const previndent  = this.indent;
	this.indent += this.step;
	let result = this.gen(arr);
	result += "\n" + this.indent + "return "+ this.ctxvarname + ";";
	result += "\n" + previndent + "}";
	this.indent = previndent;
	return (this.indent === "" ? "" : "\n") + this.indent + (this.async ? "async " : "") + this.ctxvarname + " => {" + result;
};