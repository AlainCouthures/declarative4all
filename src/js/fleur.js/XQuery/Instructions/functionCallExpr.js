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

Fleur.functionCall = function(ctx, children, xf, args, callback) {
	var mainUpdater = false;
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
					if (n.schemaTypeInfo === Fleur.Type_error) {
						if (mainUpdater) {
							Fleur.XQueryEngine.updating = false;
							ctx.updater = false;
							if (Fleur.XQueryEngine.updateQueue.length !== 0) {
								setImmediate(Fleur.XQueryEngine.updateQueue.pop());
							}
						}
						Fleur.callback(function() {callback(n);});
						return;
					}
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
			a.schemaTypeInfo = xf.restype && xf.restype.type !== Fleur.numericTypes ? xf.restype.type : null;
			a.data = "";
			if (xf.jsfunc) {
				var jsargs = [];
				try {
					effargs.forEach(function(effarg, iarg) {
						var op;
						var carg = xf.argtypes ? xf.argtypes[iarg] : null;
						if (carg.type === Fleur.Node) {
							jsargs.push(effarg);
						} else {
							effarg = Fleur.Atomize(effarg, true);
							if (effarg === Fleur.EmptySequence) {
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
									if (carg && carg.adaptative) {
										var precision = undefined;
										if (effchild.schemaTypeInfo === Fleur.Type_integer) {
											precision = 0;
										} else if (effchild.schemaTypeInfo === Fleur.Type_decimal) {
											precision = effchild.data.indexOf(".") !== -1 ? effchild.data.length - effchild.data.indexOf(".") - 1 : 0;
										}
										subarr.push([subarr.pop(), effchild.schemaTypeInfo, precision]);
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
							} else if ((!carg && [Fleur.Type_dateTime, Fleur.Type_date, Fleur.Type_time].indexOf(effarg.schemaTypeInfo) !== -1) || [Fleur.Type_dateTime, Fleur.Type_date, Fleur.Type_time].indexOf(carg.type) !== -1) {
								op = Fleur.toJSDate(effarg);
								if (op[0] < 0) {
									a = effarg;
									throw new Error("error");
								}
								jsargs.push(op[1]);
							} else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_dayTimeDuration) || (carg && carg.type === Fleur.Type_dayTimeDuration)) {
								jsargs.push(Fleur.toJSONDayTimeDuration(effarg.data));
							} else {
								jsargs.push(effarg);
							}
						}
						if (carg && carg.adaptative && effarg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
							jsargs.push([jsargs.pop(), effarg.schemaTypeInfo]);
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
					var convret = function(v) {
						var t = null;
						if (v instanceof Array) {
							t = v[1];
							v = v[0];
						}
						if (v === undefined || v === null) {
							a = Fleur.EmptySequence;
							return;
						}
						if (v === Number.POSITIVE_INFINITY) {
							a.data = "INF";
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_double;
							}
						} else if (v === Number.NEGATIVE_INFINITY) {
							a.data = "-INF";
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_double;
							}
						} else if (typeof v === "number" || typeof v === "bigint" || typeof v === "boolean") {
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || (typeof v === "boolean" ? Fleur.Type_boolean : Fleur.Type_double);
							}
							a.data = a.schemaTypeInfo.canonicalize(String(v));
						} else if (typeof v === "string") {
							a.data = v;
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_string;
							}
						} else if (typeof v.getMonth === "function") {
							var o = vret.getTimezoneOffset();
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_datetime;
							}
							if (a.schemaTypeInfo === Fleur.Type_date) {
								a.data = ("000" + v.getFullYear()).slice(-4) + "-" + ("0" + (v.getMonth() + 1)).slice(-2) + "-" + ("0" + v.getDate()).slice(-2) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
							} else if (a.schemaTypeInfo === Fleur.Type_time) {
								a.data = ("0" + v.getHours()).slice(-2) + ":" + ("0" + v.getMinutes()).slice(-2) + ":" + ("0" + v.getSeconds()).slice(-2) + "." + ("00" + v.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
							} else {
								a.data = ("000" + v.getFullYear()).slice(-4) + "-" + ("0" + (v.getMonth() + 1)).slice(-2) + "-" + ("0" + v.getDate()).slice(-2) + "T" + ("0" + v.getHours()).slice(-2) + ":" + ("0" + v.getMinutes()).slice(-2) + ":" + ("0" + v.getSeconds()).slice(-2) + "." + ("00" + v.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
							}
						} else if (v instanceof Error) {
							a = Fleur.error(ctx, v.name, v.message);
						} else if (v instanceof Fleur.Node || (Fleur.inBrowser && v instanceof Node)) {
							a = v;
						} else {
							a.data = v;
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_handler;
							}
						}
					};
					if (vret instanceof Array && !xf.restype.adaptative) {
						var seq = new Fleur.Sequence();
						vret.forEach(function(v) {
							a = new Fleur.Text();
							a.schemaTypeInfo = xf.restype ? xf.restype.type : null;
							a.data = "";
							convret(v);
							seq.appendChild(a);
						});
						Fleur.callback(function() {callback(seq);});
					} else if (typeof vret === 'object' && vret && !(vret instanceof Array || vret instanceof Fleur.Node || vret instanceof Node || vret instanceof Error || typeof vret.getMonth === "function")) {
						var map = new Fleur.Map();
						var e;
						for (var p in vret) {
							if (vret.hasOwnProperty(p)) {
								e = new Fleur.Entry();
								e.nodeName = p;
								e.namespaceURI = null;
								e.localName = p;
								a = new Fleur.Text();
								a.schemaTypeInfo = null;
								a.data = "";
								convret(vret[p]);
								e.appendChild(a);
								map.setEntryNode(e);
							}
						}
						Fleur.callback(function() {callback(map);});
					} else {
						convret(vret);
						Fleur.callback(function() {callback(a);});
					}
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

Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var args = children[1][1];
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
		if (uri === "http://www.w3.org/2005/xpath-functions" && fname === "concat" && args.length > 1 && !Fleur.XPathFunctions[uri][fname + "#" + args.length]) {
			var cparam = [];
			for (var i = 0, l = args.length; i < l; i++) {
				cparam[i] = {type: Fleur.Node};
			}
			xf = Fleur.XPathFunctions[uri][fname + "#" + args.length] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat", Fleur.XPathFunctions_fn["concat#"].jsfunc, null, cparam, false, false, {type: Fleur.Type_string});
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017", "The expanded QName and number of arguments in a static function call do not match the name and arity of a function signature in the static context for Q{" + uri + "}" + fname + "#" + args.length));});
			return;
		}
	}
	Fleur.functionCall(ctx, children, xf, args, callback);
};