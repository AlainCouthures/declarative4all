"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */

function fleur(expression) {
  let result;
  let compiled;
  const current = XsltForms_globals.defaultModel.getInstanceDocument().documentElement;
  let ctx = new XsltForms_exprContext(XsltForms_subform.subforms["xsltforms-mainform"], current, null, null, null, Fleur.XPathNSResolver_default, current, null);
  let arr;
  if (Fleur.minimal) {
    try {
      compiled = Fleur.XPathEvaluator._xp2js(expression, "", "");
      eval("arr = " + compiled + ";");
      compiled = XsltForms_FleurConv[arr[0]](arr[1]);
      compiled = eval(compiled);
      let res = compiled.evaluate(ctx);
      switch (typeof res) {
        case 'number':
          result = String(res);
          break;
        case 'boolean':
          result = String(res) + "()";
          break;
        case 'string':
          result = '"' + res + '"';
          break;
        case 'object':
          if (res.length === 0) {
            result = "()";
          } else if (res.length === 1) {
            result = XsltForms_browser.saveNode(res[0], "application/xml");
          } else {
            result = "(" + XsltForms_browser.saveNode(res[0], "application/xml");
            for (let i = 1, l = res.length; i < l; i++) {
              result += "," + XsltForms_browser.saveNode(res[i], "application/xml");
            }
            result += ")";
          }
      }
    } catch (e) {
      result = "Error: " + (e.message.startsWith("~~~~") ? e.message.substr(4, e.message.length - 8) : e.message);
    }
  } else {
    try {
      arr = Fleur.XQueryParser._xp2js(expression, [], [], 0);
      compiled = (new Fleur.Transpiler("ctx", "  ")).funcdef(arr);
      compiled = eval(compiled);
      let res = compiled(new Fleur.Context(ctx.node, {nsresolver: ctx.nsresolver}, ctx.depsNodes, ctx.depsElements)).item;
      result = Fleur.Serializer._serializeNodeToXQuery(res, false, "");
    } catch (e) {
      result = "Error " + e.localName + ": " + e.description + " [" + (!e.value.schemaTypeInfo ? e.value.data : Fleur.Serializer._serializeNodeToXQuery(e.value, false, "")) + "]";
    }
  }
  return result;
}

const XsltForms_debugger = {
  active: false,
  open: function() {
    XsltForms_debugger.active = true;
    XsltForms_debugger.xfdebugger = document.createElement("xforms-debugger");
    XsltForms_debugger.xfbody = document.createElement("xforms-body");
    XsltForms_debugger.xfgutter = document.createElement("xforms-gutter");
    XsltForms_debugger.xfboard = document.createElement("xforms-board");
    for (let i = 0, l = document.body.childNodes.length; i < l; i++) {
      XsltForms_debugger.xfbody.appendChild(document.body.firstChild);
    }
    XsltForms_debugger.xfboard.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" style="float:right; cursor:pointer" onclick="XsltForms_debugger.close()" height="20" width="20"><g transform="translate(4,4) scale (0.5,0.5)"><path stroke-miterlimit="4" d="M 0,0 20,20" style="opacity:1;fill:grey;stroke:grey;stroke-width:5;stroke-linecap:round;stroke-miterlimit:4;fill-opacity:1;stroke-opacity:1"/><path stroke-miterlimit="4" d="M 0,20 20,0" style="opacity:1;fill:grey;stroke:grey;stroke-width:5;stroke-linecap:round;stroke-miterlimit:4;fill-opacity:1;stroke-opacity:1"/></g></svg>';
    XsltForms_debugger.xfboard.innerHTML += "XForms Debugger (XSLTForms " + XsltForms_globals.fileVersion + (Fleur.version ? " + Fleur " + Fleur.version : "") + ")<br>";
    XsltForms_debugger.xfhistory = document.createElement("xforms-console-history");
    XsltForms_debugger.xfboard.appendChild(XsltForms_debugger.xfhistory);
    const xfexprbody = document.createElement("xforms-body");
    xfexprbody.innerHTML = "<span style='vertical-align:top'>&gt; </span><textarea id='xforms-debugger-textarea' oninput='(elt => elt.style.height = elt.scrollHeight + \"px\")(this)' autofocus></textarea>";
    XsltForms_debugger.xfboard.appendChild(xfexprbody);
    XsltForms_debugger.xfdebugger.appendChild(XsltForms_debugger.xfbody);
    XsltForms_debugger.xfdebugger.appendChild(XsltForms_debugger.xfgutter);
    XsltForms_debugger.xfdebugger.appendChild(XsltForms_debugger.xfboard);
    document.body.appendChild(XsltForms_debugger.xfdebugger);
    let dragging = false;
    XsltForms_debugger.draggingdown = e => dragging = e.target === XsltForms_debugger.xfgutter;
    XsltForms_debugger.draggingmove = e => {
      if (dragging) {
        XsltForms_debugger.xfbody.style.height = Number(Math.max(200, e.clientY - XsltForms_debugger.xfdebugger.offsetTop - 4)) + 'px';
        XsltForms_debugger.xfbody.style.flexGrow = 0;
        e.preventDefault();
      }
    };
    XsltForms_debugger.draggingup = () => dragging = false;
    document.addEventListener('mousedown', XsltForms_debugger.draggingdown);
    document.addEventListener('mousemove', XsltForms_debugger.draggingmove);
    document.addEventListener('mouseup', XsltForms_debugger.draggingup);
    XsltForms_debugger.textarea = document.getElementById("xforms-debugger-textarea");
    XsltForms_debugger.textarea.addEventListener("keypress", evt => {
      if (evt.keyCode === 13 && !evt.altKey && !evt.ctrlKey && !evt.shiftKey) {
        if (evt.target.value.trim() === "") {
          const expr = document.createElement("xforms-expression");
          expr.textContent = ">";
          XsltForms_debugger.xfhistory.appendChild(expr);
        } else {
          const expr = document.createElement("xforms-expression");
          expr.textContent = "-> " + evt.target.value;
          XsltForms_debugger.xfhistory.appendChild(expr);
          const value = document.createElement("xforms-result");
          value.textContent = "<- " + fleur(evt.target.value);
          XsltForms_debugger.xfhistory.appendChild(value);
        }
        XsltForms_debugger.textarea.value = "";
        evt.target.style.height = evt.target.scrollHeight + "px";
        evt.stopPropagation();
        evt.preventDefault();
      }
    });
  },
  close: function() {
    document.removeEventListener('mousedown', XsltForms_debugger.draggingdown);
    document.removeEventListener('mousemove', XsltForms_debugger.draggingmove);
    document.removeEventListener('mouseup', XsltForms_debugger.draggingup);
    for (let i = 0, l = XsltForms_debugger.xfbody.childNodes.length; i < l; i++) {
      document.body.appendChild(XsltForms_debugger.xfbody.firstChild);
    }
    document.body.removeChild(XsltForms_debugger.xfdebugger);
    XsltForms_debugger.active = false;
  }
};