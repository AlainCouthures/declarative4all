/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathConstructor = function(ctx, children, schemaType, stringreg, others, formatvalue) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	Fleur.Atomize(ctx);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error || ctx._result.schemaTypeInfo === schemaType) {
		return;
	}
	if (ctx._result.schemaTypeInfo === Fleur.Type_string || ctx._result.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		if (!ctx._result.data || !(stringreg.test(ctx._result.data))) {
			Fleur.error(ctx, "FORG0001");
			return;
		}
	} else {
		others(ctx);
		if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
			return;
		}
	}
	ctx._result.schemaTypeInfo = schemaType;
	if (formatvalue(ctx._result)) {
		Fleur.error(ctx, "FORG0001");
		return;
	}
};
Fleur.XPathStringFunction = function(ctx, children, f, schemaTypeInfo) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	Fleur.Atomize(ctx);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.schemaTypeInfo === Fleur.Type_string || ctx._result.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		ctx._result.data = "" + f(ctx._result.data);
		if (schemaTypeInfo) {
			ctx._result.schemaTypeInfo = schemaTypeInfo;
		}
	}
};
Fleur.XPathNumberFunction = function(ctx, children, f, schemaTypeInfo) {
	var value;
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	Fleur.Atomize(ctx);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.schemaTypeInfo === Fleur.Type_integer) {
		value = f(parseInt(ctx._result.data, 10));
		if (isNaN(value)) {
			Fleur.error(ctx, "FORG0001");
		} else {
			ctx._result.data = "" + value;
			if (schemaTypeInfo) {
				ctx._result.schemaTypeInfo = schemaTypeInfo;
			}
		}
	} else if (ctx._result.schemaTypeInfo === Fleur.Type_decimal || ctx._result.schemaTypeInfo === Fleur.Type_float || ctx._result.schemaTypeInfo === Fleur.Type_double) {
		value = f(parseFloat(ctx._result.data));
		if (isNaN(value)) {
			Fleur.error(ctx, "FORG0001");
		} else {
			ctx._result.data = "" + value;
			if (schemaTypeInfo) {
				ctx._result.schemaTypeInfo = schemaTypeInfo;
			}
		}
	} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = f(parseInt(ctx._result.data, 10));
		if (isNaN(value)) {
			Fleur.error(ctx, "FORG0001");
		} else {
			ctx._result.data = "" + value;
			if (schemaTypeInfo) {
				ctx._result.schemaTypeInfo = schemaTypeInfo;
			}
		}
	} else if (ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || ctx._result.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = f(parseFloat(ctx._result.data));
		if (isNaN(value)) {
			Fleur.error(ctx, "FORG0001");
		} else {
			ctx._result.data = "" + value;
			if (schemaTypeInfo) {
				ctx._result.schemaTypeInfo = schemaTypeInfo;
			}
		}
	}
};
