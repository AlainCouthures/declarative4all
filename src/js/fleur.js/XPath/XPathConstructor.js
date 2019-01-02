/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathConstructor = function(ctx, children, schemaType, others, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n, true);
		if (a === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_error || a.schemaTypeInfo === schemaType) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			if (!a.hasOwnProperty("data")) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
		} else {
			others(a);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a);});
				return;
			}
		}
		a.schemaTypeInfo = schemaType;
		try {
			a.data = a.schemaTypeInfo.canonicalize(a.data);
			Fleur.callback(function() {callback(a);});
		} catch (e) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
		}
	});
};

Fleur.XPathStringFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	if (children.length > 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var cb = function(n, forceString) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a === Fleur.EmptySequence) {
			a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_string;
			a.data = "";
		}
		if (forceString === "force") {
			a.schemaTypeInfo = Fleur.Type_string;
		}
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			a.data = String(f(a.data));
			if (schemaTypeInfo) {
				a.schemaTypeInfo = schemaTypeInfo;
			}
			Fleur.callback(function() {callback(a);});
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
		}
	};
	if (children.length === 0) {
		cb(ctx._curr, "force");
	} else {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	}
};

Fleur.XPathStringContentFunction = function(ctx, children, empty, f, schemaTypeInfo, callback) {
	var arg1, arg2;
	if (children.length === 3) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "FOCH0002"));});
		return;
	}
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1 === Fleur.EmptySequence) {
			if (empty) {
				Fleur.callback(function() {callback(a1);});
				return;
			}
			arg1 = "";
		} else {
			if (a1.schemaTypeInfo !== Fleur.Type_string && a1.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			arg1 = a1.data;
		}
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2 === Fleur.EmptySequence) {
				if (empty) {
					Fleur.callback(function() {callback(a2);});
					return;
				}
				a2 = new Fleur.Text();
				arg2 = "";
			} else {
				if (a2.schemaTypeInfo !== Fleur.Type_string && a2.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
					callback(Fleur.error(ctx, "XPTY0004"));
					return;
				}
				arg2 = a2.data;
			}
			a2.data = String(f(arg1, arg2));
			a2.schemaTypeInfo = schemaTypeInfo;
			Fleur.callback(function() {callback(a2);});
		});
	});
};

Fleur.XPathNumberFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var value;
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence || a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_integer) {
			value = f(parseInt(a.data, 10));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : String(value).replace("e+", "e");
		} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
			value = f(a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : a.data === "NaN" ? Number.NaN : parseFloat(a.data));
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : String(value).replace("e+", "e");
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			value = f(parseInt(a.data, 10));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : String(value).replace("e+", "e");
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			value = f(parseFloat(a.data));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : String(value).replace("e+", "e");
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		if (schemaTypeInfo) {
			if (typeof schemaTypeInfo === "function") {
				a.schemaTypeInfo = schemaTypeInfo(a);
			} else {
				a.schemaTypeInfo = schemaTypeInfo;
			}
		}
		Fleur.callback(function() {callback(a);});
	});
};

Fleur.XPathTestOpFunction = function(ctx, children, f, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence) {
			a1 = new Fleur.Text();
			a1.schemaTypeInfo = Fleur.Type_string;
			a1.data = "";
		}
		if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
			return;
		}
		var op1 = Fleur.toJSValue(a1, true, true, true, true, false, true);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
			a1.schemaTypeInfo = Fleur.Type_double;
		} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			a1.schemaTypeInfo = Fleur.Type_string;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2 === Fleur.EmptySequence) {
				a2 = new Fleur.Text();
				a2.schemaTypeInfo = Fleur.Type_string;
				a2.data = "";
			}
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			var op2 = Fleur.toJSValue(a2, true, true, true, true, false, true);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
				a2.schemaTypeInfo = Fleur.Type_double;
			} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a2.schemaTypeInfo = Fleur.Type_string;
			}
			if (a1.schemaTypeInfo !== a2.schemaTypeInfo) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			a1.data = String(f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint")));
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		});
	});
};

Fleur.XPathGenTestOpFunction = function(ctx, children, f, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n, true);
		if (a1 === Fleur.EmptySequence || a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
			a1.childNodes.forEach(function(a) {
				if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1) {
					a.schemaTypeInfo = Fleur.Type_double;
				} else if (a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					a.schemaTypeInfo = Fleur.Type_string;
				}
			});
		} else {
			if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
				a1.schemaTypeInfo = Fleur.Type_double;
			} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a1.schemaTypeInfo = Fleur.Type_string;
			}
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n, true);
			var i1, res = false, b, l;
			if (a2 === Fleur.EmptySequence || a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				a2.childNodes.forEach(function(a) {
					if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1) {
						a.schemaTypeInfo = Fleur.Type_double;
					} else if (a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
						a.schemaTypeInfo = Fleur.Type_string;
					}
				});
			} else {
				if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
					a2.schemaTypeInfo = Fleur.Type_double;
				} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					a2.schemaTypeInfo = Fleur.Type_string;
				}
			}
			do {
				if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
					i1 = a1.childNodes.shift();
					if (a1.childNodes.length === 1) {
						a1 = a1.childNodes[0];
					}
				} else {
					i1 = a1;
					a1 = Fleur.EmptySequence;
				}
				var op1 = Fleur.toJSValue(i1, true, true, true, true, false, true);
				var op2;
				if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
					for (b = 0, l = a2.childNodes.length; b < l && !res; b++) {
						op2 = Fleur.toJSValue(a2.childNodes[b], true, true, true, true, false, true);
						res = f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint"));
					}
				} else {
					op2 = Fleur.toJSValue(a2, true, true, true, true, false, true);
					res = f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint"));
				}
				if (res) {
					break;
				}
			} while(a1 !== Fleur.EmptySequence);
			a1 = new Fleur.Text();
			a1.data = String(res);
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		});
	});
};

Fleur.XPathFromDateTimeFunction = function(ctx, children, t1, r, t2, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence || a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo !== t1) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		a.schemaTypeInfo = t2;
		a.data = String(t2 === Fleur.Type_integer ? parseInt(a.data.match(r)[1], 10) : parseFloat(a.data.match(r)[1]));
		Fleur.callback(function() {callback(a);});
	});
};