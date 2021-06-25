/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.inlineFunctionExpr] = function(ctx, children, callback) {
  var updating = children[0][0] === Fleur.XQueryX.updatingFunction;
  var init = updating ? 1 : 0;
  var args = children[init][1].map(function(arg) {
    var o = {name: arg[1][0][1][0]};
    if (arg[1].length === 1) {
      o.type = Fleur.Node;
      o.occurence = "*";
    } else {
      var tprefix = null, turi;
      var atype = arg[1][1][1][0][1];
      var tname = atype[0];
      if (atype[1]) {
        if (atype[1][0] === Fleur.XQueryX.URI) {
          turi = atype[1][1][0];
        } else if (atype[1][0] === Fleur.XQueryX.prefix) {
          tprefix = atype[1][1][0];
          turi = ctx.env.nsresolver.lookupNamespaceURI(tprefix);
        }
      }
      o.type = Fleur.Types[turi][tname];
      if (arg[1][1][1].length === 2) {
        o.occurence = arg[1][1][1][1][1][0];
      }
    }
    return o;
  });
  var fbody, fret;
  if (children[init + 1][0] === Fleur.XQueryX.typeDeclaration) {
    fret = children[init + 1][1][0];
    fbody = children[init + 2][0] === Fleur.XQueryX.functionBody ? children[init + 2][1][0] : null;
  } else {
    fret = {type: Fleur.Node, occurence: "*"};
    fbody = children[init + 1][0] === Fleur.XQueryX.functionBody ? children[init + 1][1][0] : null;
  }
  var f = new Fleur.Function(null, null, null, fbody, args, false, false, fret, updating);
  f.closurevarresolver = ctx.env.varresolver;
  Fleur.callback(function() {callback(f);});
};