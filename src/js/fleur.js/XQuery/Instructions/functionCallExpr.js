/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine.updating = false;
Fleur.XQueryEngine.updateQueue = [];

Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var args = children[1][1];
	var mainUpdater = false;
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix && ctx.env.nsresolver) {
			uri = ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]);
		}
	}
	var xf;
	if (uri === "http://www.w3.org/standards/webdesign/script") {
		xf = (Fleur.XPathFunctions[uri] && Fleur.XPathFunctions[uri][fname + "#" + args.length]) ? Fleur.XPathFunctions[uri][fname + "#" + args.length] : {};
		xf.jsfunc = eval(fname);
	} else {
		xf = Fleur.XPathFunctions[uri][fname + "#" + args.length] || Fleur.XPathFunctions[uri][fname];
	}
	if (!uri || !xf) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017", "Q{" + uri + "}" + fname + "#" + args.length));});
		return;
	}
	if (xf.updating && !ctx.updater) {
		if (Fleur.XQueryEngine.updating) {
			Fleur.XQueryEngine.updateQueue.push(function() {
				Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr](ctx, children, callback);
			});
			return;
		}
		Fleur.XQueryEngine.updating = true;
		mainUpdater = true;
		ctx.updater = true;
	}
	if (xf.jsfunc || xf.xqxfunc) {
		var argscalc = function(xqxargs, effargs, f) {
			if (xqxargs.length === 0) {
				f(effargs);
			} else {
				var xqxarg = xqxargs.shift();
				Fleur.XQueryEngine[xqxarg[0]](ctx, xqxarg[1], function(n) {
					if ((xf.argtypes && xf.argtypes[effargs.length].type === Fleur.Node) || (n && n.nodeType === Fleur.Node.SEQUENCE_NODE)) {
						effargs.push(n);
					} else if (xf.argtypes && xf.argtypes[effargs.length].type === Fleur.Type_handler) {
						effargs.push(n.data);
					} else {
						var a = Fleur.Atomize(n);
						effargs.push(a);
					}
					argscalc(xqxargs, effargs, f);
				});
			}
		};
		argscalc(args.slice(), [], function(effargs) {
			var a = new Fleur.Text();
			a.schemaTypeInfo = xf.restype ? xf.restype.type : null;
			a.data = "";
			if (xf.jsfunc) {
				var jsargs = [];
				try {
					effargs.forEach(function(effarg, iarg) {
						var op;
						var carg = xf.argtypes ? xf.argtypes[iarg] : null;
						if (carg.type === Fleur.Node) {
							jsargs.push(effarg);
						} else if (effarg === Fleur.EmptySequence) {
							if (carg && (!carg.occurence || (carg.occurence !== "?" && carg.occurence !== "*"))) {
								a.nodeType = Fleur.Node.TEXT_NODE;
								a.schemaTypeInfo = Fleur.Type_error;
								a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
								throw new Error("error");
							}
							jsargs.push(null);
						} else if (effarg.nodeType === Fleur.Node.SEQUENCE_NODE) {
							if (carg && (!carg.occurence || carg.occurence === "?")) {
								a.nodeType = Fleur.Node.TEXT_NODE;
								a.schemaTypeInfo = Fleur.Type_error;
								a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
								throw new Error("error");
							}
							var subarr = [];
							for (var iseq = 0, lseq = effarg.childNodes.length; iseq < lseq; iseq++) {
								var effchild = effarg.childNodes[iseq];
								if ((!carg && Fleur.numericTypes.indexOf(effchild.schemaTypeInfo) !== -1) || (carg && (carg.type === Fleur.numericTypes || Fleur.numericTypes.indexOf(carg.type) !== -1))) {
									op = Fleur.toJSNumber(effchild);
									if (op[0] < 0) {
										a = effchild;
										throw new Error("error");
									}
									subarr.push(op[1]);
								} else if ((!carg && effchild.schemaTypeInfo === Fleur.Type_string) || (carg && carg.type === Fleur.Type_string)) {
									op = Fleur.toJSString(effchild);
									if (op[0] < 0) {
										a = effchild;
										throw new Error("error");
									}
									subarr.push(op[1]);
								} else if ((!carg && effchild.schemaTypeInfo === Fleur.Type_boolean) || (carg && carg.type === Fleur.Type_boolean)) {
									op = Fleur.toJSBoolean(effchild);
									if (op[0] < 0) {
										a = effchild;
										throw new Error("error");
									}
									subarr.push(op[1]);
								} else if (carg.type === Fleur.Type_dateTime) {
								} else {
									subarr.push(effchild);
								}
							}
							jsargs.push(subarr);
						} else if ((!carg && Fleur.numericTypes.indexOf(effarg.schemaTypeInfo) !== -1) || (carg && (carg.type === Fleur.numericTypes || Fleur.numericTypes.indexOf(carg.type) !== -1 || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)))) {
							op = Fleur.toJSNumber(effarg);
							if (op[0] < 0) {
								a = effarg;
								throw new Error("error");
							}
							jsargs.push(op[1]);
						} else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_string) || (carg && (carg.type === Fleur.Type_string || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION)))) {
							op = Fleur.toJSString(effarg);
							if (op[0] < 0) {
								a = effarg;
								throw new Error("error");
							}
							jsargs.push(op[1]);
						} else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_boolean) || (carg && carg.type === Fleur.Type_boolean)) {
							op = Fleur.toJSBoolean(effarg);
							if (op[0] < 0) {
								a = effarg;
								throw new Error("error");
							}
							jsargs.push(op[1]);
						} else if (carg.type === Fleur.Type_dateTime) {
						} else {
							jsargs.push(effarg);
						}
					});
				} catch (e) {
					Fleur.callback(function() {callback(a);});
					return;
				}
				if (xf.needctx) {
					jsargs.push(ctx);
				}
				var convback = function(vret) {
					if (mainUpdater) {
						Fleur.XQueryEngine.updating = false;
						ctx.updater = false;
						if (Fleur.XQueryEngine.updateQueue.length !== 0) {
							setImmediate(Fleur.XQueryEngine.updateQueue.pop());
						}
					}
					if (vret === undefined || vret === null) {
						a = Fleur.EmptySequence;
					} else if (vret === Number.POSITIVE_INFINITY) {
						a.data = "INF";
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_double;
						}
					} else if (vret === Number.NEGATIVE_INFINITY) {
						a.data = "-INF";
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_double;
						}
					} else if (typeof vret === "number" || typeof vret === "boolean") {
						a.data = String(vret);
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = typeof vret === "number" ? Fleur.Type_double : Fleur.Type_boolean;
						}
					} else if (typeof vret === "string") {
						a.data = vret;
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_string;
						}
					} else if (typeof vret.getMonth === "function") {
						var o = vret.getTimezoneOffset();
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_datetime;
						}
						if (a.schemaTypeInfo === Fleur.Type_date) {
							a.data = ("000" + vret.getFullYear()).slice(-4) + "-" + ("0" + (vret.getMonth() + 1)).slice(-2) + "-" + ("0" + vret.getDate()).slice(-2) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
						} else if (a.schemaTypeInfo === Fleur.Type_time) {
							a.data = ("0" + vret.getHours()).slice(-2) + ":" + ("0" + vret.getMinutes()).slice(-2) + ":" + ("0" + vret.getSeconds()).slice(-2) + "." + ("00" + vret.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
						} else {
							a.data = ("000" + vret.getFullYear()).slice(-4) + "-" + ("0" + (vret.getMonth() + 1)).slice(-2) + "-" + ("0" + vret.getDate()).slice(-2) + "T" + ("0" + vret.getHours()).slice(-2) + ":" + ("0" + vret.getMinutes()).slice(-2) + ":" + ("0" + vret.getSeconds()).slice(-2) + "." + ("00" + vret.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
						}
					} else if (vret instanceof Fleur.Node || vret instanceof Node) {
						a = vret;
					} else {
						a.data = vret;
						if (!a.schemaTypeInfo) {
							a.schemaTypeInfo = Fleur.Type_handler;
						}
					}
					Fleur.callback(function() {callback(a);});
				};
				if (xf.needcallback) {
					jsargs.push(convback);
					xf.jsfunc.apply(null, jsargs);
					return;
				}
				convback(xf.jsfunc.apply(null, jsargs));
			} else {
				var currvarres = ctx.env.varresolver;
				ctx.env.varresolver = new Fleur.varMgr([], ctx.env.globalvarresolver);
				effargs.forEach(function(effarg, iarg) {
					ctx.env.varresolver.set(ctx, "", xf.argtypes[iarg].name, effarg);
				});
				Fleur.XQueryEngine[xf.xqxfunc[0]](ctx, xf.xqxfunc[1], function(n) {
					if (mainUpdater) {
						Fleur.XQueryEngine.updating = false;
						ctx.updater = false;
						if (Fleur.XQueryEngine.updateQueue.length !== 0) {
							setImmediate(Fleur.XQueryEngine.updateQueue.pop());
						}
					}
					ctx.env.varresolver = currvarres;
					Fleur.callback(function() {callback(n);});
				});
			}
		});
	} else {
		xf(ctx, args, function(n) {
			if (mainUpdater) {
				Fleur.XQueryEngine.updating = false;
				ctx.updater = false;
				if (Fleur.XQueryEngine.updateQueue.length !== 0) {
					setImmediate(Fleur.XQueryEngine.updateQueue.pop());
				}
			}
			Fleur.callback(function() {callback(n);});
		});
	}
};