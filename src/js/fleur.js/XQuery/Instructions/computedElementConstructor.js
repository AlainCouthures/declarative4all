"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_computedElementConstructor = function(children) {
  let r = "";
  const prefix = children[0][1].length === 2 && children[0][1][1][0] === Fleur.XQueryX.prefix ? children[0][1][1][1][0] : "";
  const URI = children[0][1].length === 2 && children[0][1][1][0] === Fleur.XQueryX.URI ? children[0][1][1][1][0] : null;
  let tagName;
  if (children[0][0] === Fleur.XQueryX.tagName) {
    tagName = children[0][1][0];
  } else {
    r = this.gen(children[0][1][0], Fleur.atomicTypes).inst;
  }
  r += children.length === 2 ? this.gen(children[1][1][0]).inst : this.inst("emptySequence()").inst;
  r += this.inst("xqx_computedElementConstructor" + (tagName ? (URI ? "_URI" : "") + "('" + (URI ? URI : prefix) + "', '" + tagName + "')" : "_expr()")).inst;
  return {
    inst: r
  };
};

Fleur.Context.prototype.xqx_computedElementConstructor = function(prefix, localName) {
  const elt = new Fleur.Element();
  elt.nodeName = prefix === "" ? localName : prefix + ":" + localName;
  elt.localName = localName;
  elt.prefix = prefix === "" ? null : prefix;
  elt.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  elt.appendContent(this.item, "");
  this.item = elt;
  return this;
};

Fleur.Context.prototype.xqx_computedElementConstructor_expr = function() {
  const arg2 = this.item;
  const arg1 = this.itemstack.pop();
  const elt = new Fleur.Element();
  const prefix = arg1.data.includes(":") ? arg1.data.split(":")[0] : "";
  elt.nodeName = arg1.data;
  elt.localName = prefix === "" ? arg1.data : arg1.data.split(":")[1];
  elt.prefix = prefix === "" ? null : prefix;
  elt.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  elt.appendContent(arg2, "");
  this.item = elt;
  return this;
};

Fleur.Context.prototype.xqx_computedElementConstructor_URI = function(URI, localName) {
  const elt = new Fleur.Element();
  elt.nodeName = localName;
  elt.localName = localName;
  elt.prefix = null;
  elt.namespaceURI = URI;
  elt.appendContent(this.item, "");
  this.item = elt;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.computedElementConstructor] = function(ctx, children, callback) {
  var elt = new Fleur.Element();
  if (children[0][0] === Fleur.XQueryX.tagName) {
    elt.name = children[0][1][0];
    elt.namespaceURI = null;
    elt.nodeName = children[0][1][0];
    if (children[1][1].length !== 0) {
      Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
        elt.appendChild(n);
        Fleur.callback(function() {callback(elt);});
      });
    } else {
      Fleur.callback(function() {callback(elt);});
    }  
  } else {
    Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
      var a = Fleur.Atomize(n);
      if (a.nodeType !== Fleur.Node.TEXT_NODE) {
        Fleur.callback(function() {callback(a);});
      } else {
        if (a.schemaTypeInfo === Fleur.Type_QName) {
          elt.nodeName = a.nodeName;
          elt.namespaceURI = a.namespaceURI;
          elt.localName = a.localName;
        } else {
          elt.nodeName = a.data;
          elt.namespaceURI = null;
          elt.localName = a.data;
        }
        if (children[1][1].length !== 0) {
          Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
            elt.appendChild(n);
            Fleur.callback(function() {callback(elt);});
          });
        } else {
          Fleur.callback(function() {callback(elt);});
        }  
      }
    });
  }
};