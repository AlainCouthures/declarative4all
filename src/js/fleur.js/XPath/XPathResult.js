/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathResult = function(doc, expression, contextNode, env, resultType) {
	this.document = doc;
	this.expression = expression;
	this.contextNode = contextNode;
	this.env = env;
	this.resultType = resultType;
	this._index = 0;
};
Fleur.XPathResult.ANY_TYPE = 0;
Fleur.XPathResult.NUMBER_TYPE = 1;
Fleur.XPathResult.STRING_TYPE = 2;
Fleur.XPathResult.BOOLEAN_TYPE = 3;
Fleur.XPathResult.UNORDERED_NODE_ITERATOR_TYPE = 4;
Fleur.XPathResult.ORDERED_NODE_ITERATOR_TYPE = 5;
Fleur.XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = 6;
Fleur.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7;
Fleur.XPathResult.ANY_UNORDERED_NODE_TYPE = 8;
Fleur.XPathResult.FIRST_ORDERED_NODE_TYPE = 9;
Object.defineProperties(Fleur.XPathResult.prototype, {
	numberValue: {
		get: function() {
			var jsNumber = Fleur.toJSNumber(this);
			if (jsNumber[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsNumber[1];
		}
	},
	stringValue: {
		get: function() {
			var jsString = Fleur.toJSString(this);
			if (jsString[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsString[1];
		}
	},
	booleanValue: {
		get: function() {
			var jsBoolean = Fleur.toJSBoolean(this);
			if (jsBoolean[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsBoolean[1];
		}
	},
	singleNodeValue: {
		get: function() {
			if (this._result && this._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
				var firstnode = this._result.childNodes[0];
				this._result = firstnode;
			}
			Fleur.Atomize(this);
			var jsString = Fleur.toJSString(this);
			if (jsString[0] === -1 || (this.resultType !== Fleur.XPathResult.ANY_TYPE && this.resultType !== Fleur.XPathResult.ANY_UNORDERED_NODE_TYPE && this.resultType !== Fleur.XPathResult.FIRST_ORDERED_NODE_TYPE)) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result && this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsString[1];
		}
	}
});
Fleur.XPathResult.prototype.evaluate = function(resolve, reject) {
	var ctx = {
		_curr: this.contextNode || this.document,
		env: this.env,
		xpresult: this
	};
	if (!ctx.env.varresolver) {
		ctx.env.varresolver = new Fleur.varMgr();
	}
	var src;
	try {
		src = Fleur.XPathEvaluator._xq2js(this.expression);
	} catch (e) {
		ctx.xpresult._result = Fleur.error(ctx, "XPST0003", e.message);
		reject(ctx.xpresult);
		return;
	}
	try {
		var compiled = eval(src);
		Fleur.XQueryEngine[compiled[0]](ctx, compiled[1], function(n) {
			ctx.xpresult._result = n;
			if (n.schemaTypeInfo === Fleur.Type_error) {
				reject(ctx.xpresult);
			} else {
				resolve(ctx.xpresult);
			}
		});
	} catch (e) {
		ctx.xpresult._result = Fleur.error(ctx, "XPST0003", e.message);
		reject(ctx.xpresult);
	}
};
Fleur.XPathResult.prototype.iterateNext = function() {
	if (this.resultType !== Fleur.XPathResult.ANY_TYPE && this.resultType !== Fleur.XPathResult.UNORDERED_NODE_ITERATOR_TYPE && this.resultType !== Fleur.XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
		throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result && this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
	}
	if (this._result === Fleur.EmptySequence) {
		return null;
	}
	if (this._result.schemaTypeInfo === Fleur.Type_error) {
		throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.nodeName);
	}
	if (this._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		if (this._index === 0) {
			this._index++;
			return this._result;
		}
		return null;
	}
	if (this._index >= this._result.childNodes.length) {
		return null;
	}
	return this._result.childNodes[this._index++];
};
Fleur.XPathResult.prototype.toXQuery = function(indent) {
	if (this._result === Fleur.EmptySequence) {
		return "()";
	}
	return Fleur.Serializer._serializeNodeToXQuery(this._result, indent, "");
};
Fleur.XPathResult.prototype.toArray = function() {
	if (this._result === Fleur.EmptySequence) {
		return [];
	}
	if (this._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		return [this._result];
	}
	return this._result.childNodes;
};
Fleur.XPathResult.prototype.then = function(resolve, reject) {
	this.evaluate(resolve, reject);
};