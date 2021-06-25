/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.groupByClause] = function(ctx, children, callback, resarr, groupkeynames) {
  //console.log("groupByClause ");
  groupkeynames = groupkeynames || [];
  Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
    if (n && n.schemaTypeInfo === Fleur.Type_error) {
      Fleur.callback(function() {callback(n);});
      return;
    } 
    if (children.length <= 1) {
      var aggregnames = [];
      resarr[0].vars.forEach(function(v) {if (groupkeynames.indexOf(v.vname) === -1) aggregnames.push(v.vname);});
      var kgroups = [];
      var ogroups = resarr.reduce(function(o, vmgr) {
        var okey = groupkeynames.reduce(function(k, gkname) {
          var v = vmgr.get(ctx, "", gkname);
          var jsv = Fleur.toJSValue(v, v.schemaTypeInfo !== Fleur.Type_untypedAtomic, true, true, true);
          if (jsv[0] < 3) {
            jsv[0] = 3;
          }
          if (jsv[0] === 6 || jsv[0] === 7) {
            jsv[0] = 8;
          }
          jsv[1] = String(jsv[1]);
          return k + String(jsv[0]) + "." + String(jsv[1].length) + "." + jsv[1] + "|";
        }, "");
        if (o[okey]) {
          aggregnames.forEach(function(aname) {
            var avalue = vmgr.get(ctx, "", aname);
            if (avalue !== Fleur.EmptySequence) {
              var ovalue = o[okey].get(ctx, "", aname);
              if (ovalue === Fleur.EmptySequence) {
                o[okey].set(ctx, "", aname, avalue);
              } else {
                if (ovalue.nodeType !== Fleur.Node.SEQUENCE_NODE) {
                  var seq = new Fleur.Sequence();
                  seq.appendChild(ovalue);
                  ovalue = seq;
                }
                if (avalue.nodeType !== Fleur.Node.SEQUENCE_NODE) {
                  ovalue.appendChild(avalue);
                } else {
                  avalue.childNodes.forEach(function(av) {
                    ovalue.appendChild(av);
                  });
                }
                o[okey].set(ctx, "", aname, ovalue);
              }
            }
          });
        } else {
          kgroups.push(okey);
          o[okey] = vmgr;
        }
        return o;
      }, {});
      kgroups.forEach(function(k, i) {
        resarr[i] = ogroups[k];
      });
      resarr.splice(kgroups.length);
      Fleur.callback(function() {callback(n);});
      return;
    } 
    Fleur.XQueryEngine[Fleur.XQueryX.groupByClause](ctx, children.slice(1), callback, resarr, groupkeynames);
  }, resarr, groupkeynames);
};