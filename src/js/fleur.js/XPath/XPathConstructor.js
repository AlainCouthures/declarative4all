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
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	Fleur.Atomize(ctx);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error || ctx._result.schemaTypeInfo === schemaType) {
		return;
	}
	if (ctx._result.schemaTypeInfo === Fleur.Type_string || ctx._result.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		if (!ctx._result.data || (stringreg && !(stringreg.test(ctx._result.data)))) {
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
	} else {
		Fleur.error(ctx, "XPST0017");
	}
};
Fleur.XPathStringContentFunction = function(ctx, children, f, schemaTypeInfo) {
	var a, b;
	if (children.length !== 2) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1]);
	Fleur.Atomize(ctx);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.schemaTypeInfo !== Fleur.Type_string && ctx._result.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
		Fleur.error(ctx, "XPST0017");
	}
	a = ctx._result.data;
	Fleur.XQueryEngine[children[1][0]](ctx, children[1][1]);
	Fleur.Atomize(ctx);
	if (ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.schemaTypeInfo !== Fleur.Type_string && ctx._result.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
		Fleur.error(ctx, "XPST0017");
	}
	b = ctx._result.data;
	ctx._result = new Fleur.Text();
	ctx._result.data = "" + f(a, b);
	ctx._result.schemaTypeInfo = schemaTypeInfo;
};
Fleur.XPathNumberFunction = function(ctx, children, f, schemaTypeInfo) {
	var value;
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
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
	} else {
		Fleur.error(ctx, "XPST0017");
	}
};
Fleur.XPathTestOpFunction = function(ctx, children, f) {
	var op1, t1, op2, t2;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1]);
	Fleur.Atomize(ctx);
	if (!ctx._result || ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
		ctx._result = null;
		return;
	}
	op1 = ctx._result;
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1]);
	Fleur.Atomize(ctx);
	if (!ctx._result || ctx._result.schemaTypeInfo === Fleur.Type_error) {
		return;
	}
	if (ctx._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
		ctx._result = null;
		return;
	}
	op2 = ctx._result;
	t1 = op1.schemaTypeInfo;
	if (Fleur.numericTypes.indexOf(t1) !== -1) {
		t1 = Fleur.Type_double;
	} else if (t1 === Fleur.Type_untypedAtomic) {
		t1 = Fleur.Type_string;
	}
	t2 = op2.schemaTypeInfo;
	if (Fleur.numericTypes.indexOf(t2) !== -1) {
		t2 = Fleur.Type_double;
	} else if (t2 === Fleur.Type_untypedAtomic) {
		t2 = Fleur.Type_string;
	}
	if (t1 !== t2) {
		Fleur.error(ctx, "FORG0006");
		return;
	}
	ctx._result.data = "" + f(op1, op2);
	ctx._result.schemaTypeInfo = Fleur.Type_boolean;
};