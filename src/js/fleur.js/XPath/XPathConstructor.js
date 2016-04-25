/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathConstructor = function(ctx, children, schemaType, stringreg, others, formatvalue, callback) {
	if (children.length !== 1) {
		Fleur.error(ctx, "XPST0017");
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error || a.schemaTypeInfo === schemaType) {
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			if (!a.data || (stringreg && !(stringreg.test(a.data)))) {
				callback(Fleur.error(ctx, "FORG0001"));
				return;
			}
		} else {
			others(a);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				callback(a);
				return;
			}
		}
		a.schemaTypeInfo = schemaType;
		if (formatvalue(a)) {
			callback(Fleur.error(ctx, "FORG0001"));
			return;
		}
		callback(a);
	});
};

Fleur.XPathStringFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			callback(a);
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			a.data = "" + f(ctx._result.data);
			if (schemaTypeInfo) {
				a.schemaTypeInfo = schemaTypeInfo;
			}
			callback(a);
		} else {
			callback(Fleur.error(ctx, "XPST0017"));
		}
	});
};

Fleur.XPathStringContentFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	var arg1, arg2;
	if (children.length !== 2) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			callback(a);
			return;
		}
		if (a.schemaTypeInfo !== Fleur.Type_string && a.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
			callback(Fleur.error(ctx, "XPST0017"));
			return;
		}
		arg1 = a.data;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			a = Fleur.Atomize(n);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				return;
			}
			if (a.schemaTypeInfo !== Fleur.Type_string && a.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
				callback(Fleur.error(ctx, "XPST0017"));
				return;
			}
			arg2 = a.data;
			a.data = "" + f(arg1, arg2);
			a.schemaTypeInfo = schemaTypeInfo;
			callback(a);
		});
	});
};

Fleur.XPathNumberFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	if (children.length !== 1) {
		callback(Fleur.error(ctx, "XPST0017"));
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var value;
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence || a.schemaTypeInfo === Fleur.Type_error) {
			callback(a);
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_integer) {
			value = f(parseInt(a.data, 10));
			if (isNaN(value)) {
				callback(Fleur.error(ctx, "FORG0001"));
				return;
			} else {
				a.data = "" + value;
				if (schemaTypeInfo) {
					a.schemaTypeInfo = schemaTypeInfo;
				}
			}
		} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
			value = f(parseFloat(a.data));
			if (isNaN(value)) {
				callback(Fleur.error(ctx, "FORG0001"));
				return;
			} else {
				a.data = ("" + value).replace("e+", "e");
				if (schemaTypeInfo) {
					a.schemaTypeInfo = schemaTypeInfo;
				}
			}
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			value = f(parseInt(a.data, 10));
			if (isNaN(value)) {
				callback(Fleur.error(ctx, "FORG0001"));
				return;
			} else {
				a.data = "" + value;
				if (schemaTypeInfo) {
					a.schemaTypeInfo = schemaTypeInfo;
				}
			}
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			value = f(parseFloat(a.data));
			if (isNaN(value)) {
				callback(Fleur.error(ctx, "FORG0001"));
				return;
			} else {
				a.data = "" + value;
				if (schemaTypeInfo) {
					a.schemaTypeInfo = schemaTypeInfo;
				}
			}
		} else {
			callback(Fleur.error(ctx, "XPTY0004"));
		}
		callback(a);
	});
};

Fleur.XPathTestOpFunction = function(ctx, children, f, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence || a1.schemaTypeInfo === Fleur.Type_error) {
			callback(a1);
			return;
		}
		if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
			callback(Fleur.EmptySequence);
			return;
		}
		if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
			a1.schemaTypeInfo = Fleur.Type_double;
		} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			a1.schemaTypeInfo = Fleur.Type_string;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2 === Fleur.EmptySequence || a2.schemaTypeInfo === Fleur.Type_error) {
				callback(a2);
				return;
			}
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				callback(Fleur.EmptySequence);
				return;
			}
			if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
				a2.schemaTypeInfo = Fleur.Type_double;
			} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a2.schemaTypeInfo = Fleur.Type_string;
			}
			if (a1.schemaTypeInfo !== a2.schemaTypeInfo) {
				callback(Fleur.error(ctx, "FORG0006"));
				return;
			}
			a1.data = "" + f(a1, a2);
			a1.schemaTypeInfo = Fleur.Type_boolean;
			callback(a1);
		});
	});
};