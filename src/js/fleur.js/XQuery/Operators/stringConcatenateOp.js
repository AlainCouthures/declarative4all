/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_stringConcatenateOp = function(children) {
	return this.gen(children[0][1][0], Fleur.Type_string) + this.gen(children[1][1][0], Fleur.Type_string) + this.inst("xqx_stringConcatenateOp()");
};

Fleur.Context.prototype.xqx_stringConcatenateOp = function() {
  let arg1 = this.itemstack.pop();
  const arg2 = this.item;
  if (arg1.isEmpty()) {
		arg1 = new Fleur.Text();
		arg1.data = "";
		arg1.schemaTypeInfo = Fleur.Type_string;
	}
	if (arg2.isNotEmpty()) {
		arg1.data += arg2.data;
	}
	this.item = arg1;
	return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.stringConcatenateOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n, true);
		if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1 === Fleur.EmptySequence) {
			a1 = new Fleur.Text();
			a1.data = "";
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n, true);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2.data) {
				a1.data += a2.data;
			}
			a1.schemaTypeInfo = Fleur.Type_string;
			Fleur.callback(function() {callback(a1);});
		});
	});
};