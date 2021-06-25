/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.tryCatchExpr] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
    if (n && n.schemaTypeInfo === Fleur.Type_error) {
      for (var i = 1, l = children.length; i < l ; i++) {
        for (var j = 0, l2 = children[i][1][0][1].length; j < l2 ; j++) {
          var ctest = children[i][1][0][1][j];
          var cok = false;
          if (ctest[0] === Fleur.XQueryX.Wildcard) {
            cok = true;
            if (ctest[1][0]) {
              if (ctest[1][0][0] === Fleur.XQueryX.star && ctest[1][1][0] === Fleur.XQueryX.NCName) {
                cok = n.localName === ctest[1][1][1][0];
              }
            }
          } else {
            cok = ctest[1][0] === n.localName;
            var nsURI;
            if (ctest[1][1].length === 1) {
              nsURI = "";
            } else {
              nsURI = ctest[1][1][1][0];
            }
            var currURI = n.namespaceURI || null;
            var lookupURI = ctx.env.nsresolver.lookupNamespaceURI(nsURI) || null;
            if (currURI !==  lookupURI && currURI !== "http://www.w3.org/1999/xhtml") {
              cok = false;
            }
          }
          if (cok) {
            var errcode = new Fleur.Text();
            errcode.data = n.localName;
            errcode.schemaTypeInfo = Fleur.Type_string;
            ctx.env.varresolver.set(ctx, "http://www.w3.org/2005/xqt-errors", "code", errcode);
            var errdescription = new Fleur.Text();
            errdescription.data = n.data;
            errdescription.schemaTypeInfo = Fleur.Type_string;
            ctx.env.varresolver.set(ctx, "http://www.w3.org/2005/xqt-errors", "description", errdescription);
            Fleur.XQueryEngine[children[i][1][1][1][0][0]](ctx, children[i][1][1][1][0][1], function(n) {
              Fleur.callback(function() {callback(n);});
            });
            return;
          }
        }
      }
      Fleur.callback(function() {callback(n);});
      return;
    } 
    Fleur.callback(function() {callback(n);});
  });
};