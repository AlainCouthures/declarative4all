/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.unaryMinusOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op;
		var a = Fleur.Atomize(n);
		op = Fleur.toJSNumber(a);
		if (op[0] < 0) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo !== Fleur.Type_integer && a.schemaTypeInfo !== Fleur.Type_decimal && a.schemaTypeInfo !== Fleur.Type_float && a.schemaTypeInfo !== Fleur.Type_double) {
			if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				a.schemaTypeInfo = Fleur.Type_integer;
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				a.schemaTypeInfo = Fleur.Type_decimal;
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				a.schemaTypeInfo = Fleur.Type_float;
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				a.schemaTypeInfo = Fleur.Type_double;
			}
		}
		a.data = a.schemaTypeInfo.canonicalize(String(-op[1]));
		Fleur.callback(function() {callback(a);});
	});
};