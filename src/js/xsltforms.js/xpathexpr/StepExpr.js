"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module StepExpr
 * @description  === XsltForms_stepExpr Class ===
 * XPath Expression Class for location step expressions
 * * constructor function : initializes axis, nodetest and unlimited number of predicates properties
 */
    
function XsltForms_stepExpr(axis, nodetest) {
  this.axis = axis;
  this.nodetest = nodetest;
  this.predicates = [];
  for (var i = 2, len = arguments.length; i < len; i++) {
    this.predicates.push(arguments[i]);
  }
}


    
/**
 * * '''evaluate''' method : evaluates as a node list this expression object according to the context
 */

XsltForms_stepExpr.prototype.evaluate = function(ctx) {
  var input = ctx.node;
  var list = [];
  switch(this.axis) {
    case XsltForms_xpathAxis.ANCESTOR_OR_SELF :
      XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
      if (input.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
        input = input.ownerElement ? input.ownerElement : input.selectSingleNode("..");
        XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
      } else if (input.nodeType === Fleur.Node.ENTRY_NODE) {
        input = input.ownerMap;
        XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
      }
      for (var pn = input.parentNode; pn.parentNode; pn = pn.parentNode) {
        XsltForms_stepExpr.push(ctx, list, pn, this.nodetest);
      }
      break;
    case XsltForms_xpathAxis.ANCESTOR :
      if (input.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
        input = input.ownerElement ? input.ownerElement : input.selectSingleNode("..");
        XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
      } else if (input.nodeType === Fleur.Node.ENTRY_NODE) {
        input = input.ownerMap;
        XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
      }
      for (var pn2 = input.parentNode; pn2.parentNode; pn2 = pn2.parentNode) {
        XsltForms_stepExpr.push(ctx, list, pn2, this.nodetest);
      }
      break;
    case XsltForms_xpathAxis.ATTRIBUTE :
      XsltForms_stepExpr.pushList(ctx, list, input.attributes, this.nodetest, !input.namespaceURI || input.namespaceURI === "http://www.w3.org/1999/xhtml");
      break;
    case XsltForms_xpathAxis.CHILD :
      XsltForms_stepExpr.pushList(ctx, list, input.childNodes, this.nodetest);
      break;
    case XsltForms_xpathAxis.DESCENDANT_OR_SELF :
      XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
      XsltForms_stepExpr.pushDescendants(ctx, list, input, this.nodetest);
      break;
    case XsltForms_xpathAxis.DESCENDANT :
      XsltForms_stepExpr.pushDescendants(ctx, list, input, this.nodetest);
      break;
    case XsltForms_xpathAxis.ENTRY :
      XsltForms_stepExpr.pushList(ctx, list, input.entries, this.nodetest);
      break;
    case XsltForms_xpathAxis.FOLLOWING :
      var n = input.nodeType === Fleur.Node.ATTRIBUTE_NODE ? (input.ownerElement ? input.ownerElement : input.selectSingleNode("..")) : (input.nodeType === Fleur.Node.ENTRY_NODE ? input.ownerMap : input);
      while (n.nodeType !== Fleur.Node.DOCUMENT_NODE) {
        for (var nn = n.nextSibling; nn; nn = nn.nextSibling) {
          XsltForms_stepExpr.push(ctx, list, nn, this.nodetest);
          XsltForms_stepExpr.pushDescendants(ctx, list, nn, this.nodetest);
        }
        n = n.parentNode;
      }
      break;
    case XsltForms_xpathAxis.FOLLOWING_SIBLING :
      for (var ns = input.nextSibling; ns; ns = ns.nextSibling) {
        XsltForms_stepExpr.push(ctx, list, ns, this.nodetest);
      }
      break;
    case XsltForms_xpathAxis.NAMESPACE : 
      alert('not implemented: axis namespace');
      break;
    case XsltForms_xpathAxis.PARENT :
      if (input.parentNode) {
        XsltForms_stepExpr.push(ctx, list, input.parentNode, this.nodetest);
      } else {
        if (input.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
          XsltForms_stepExpr.push(ctx, list, input.ownerElement ? input.ownerElement : input.selectSingleNode(".."), this.nodetest);
        } else if (input.nodeType === Fleur.Node.ENTRY_NODE) {
          XsltForms_stepExpr.push(ctx, list, input.ownerMap, this.nodetest);
        }
      }
      break;
    case XsltForms_xpathAxis.PRECEDING :
      var p = input.nodeType === Fleur.Node.ATTRIBUTE_NODE ? (input.ownerElement ? input.ownerElement : input.selectSingleNode("..")) : (input.nodeType === Fleur.Node.ENTRY_NODE ? input.ownerMap : input);
      while (p.nodeType !== Fleur.Node.DOCUMENT_NODE) {
        for (var ps = p.previousSibling; ps; ps = ps.previousSibling) {
          XsltForms_stepExpr.pushDescendantsRev(ctx, list, ps, this.nodetest);
          XsltForms_stepExpr.push(ctx, list, ps, this.nodetest);
        }
        p = p.parentNode;
      }
      break;
    case XsltForms_xpathAxis.PRECEDING_SIBLING :
      for (var ps2 = input.previousSibling; ps2; ps2 = ps2.previousSibling) {
        XsltForms_stepExpr.push(ctx, list, ps2, this.nodetest);
      }
      break;
    case XsltForms_xpathAxis.SELF :
      XsltForms_stepExpr.push(ctx, list, input, this.nodetest);
      break;
    default :
      throw new Error({name:'ERROR -- NO SUCH AXIS: ' + this.axis});
  }
  for (var i = 0, len = this.predicates.length; i < len; i++) {
    var pred = this.predicates[i];
    var newList = [];
    for (var j = 0, len1 = list.length; j < len1; j++) {
      var x = list[j];
      var newCtx = ctx.clone(x, j + 1, list);
      if (XsltForms_globals.booleanValue(pred.evaluate(newCtx))) {
        newList.push(x);
      }
      //for (var k = 0, len2 = newCtx.depsNodes.length; k < len2; k++) {
      //  ctx.addDepNode(newCtx.depsNodes[k]);
      //}
    }
    list = newList;
  }
  return list;
};

XsltForms_stepExpr.push = function(ctx, list, node, test, csensitive) {
  if (test.evaluate(node, ctx.nsresolver, csensitive) && !XsltForms_browser.inArray(node, list)) {
    list[list.length] = node;
  }
};

XsltForms_stepExpr.pushList = function(ctx, list, l, test, csensitive) {
  for (var i = 0, len = l ? l.length : 0; i < len; i++) {
    XsltForms_stepExpr.push(ctx, list, l[i], test, csensitive);
  }
};

XsltForms_stepExpr.pushDescendants = function(ctx, list, node, test) {
  for (var n = node.firstChild; n; n = n.nextSibling) {
    XsltForms_stepExpr.push(ctx, list, n, test);
    XsltForms_stepExpr.pushDescendants(ctx, list, n, test);
  }
};

XsltForms_stepExpr.pushDescendantsRev = function(ctx, list, node, test) {
  for (var n = node.lastChild; n; n = n.previousSibling) {
    XsltForms_stepExpr.push(ctx, list, n, test);
    XsltForms_stepExpr.pushDescendantsRev(ctx, list, n, test);
  }
};