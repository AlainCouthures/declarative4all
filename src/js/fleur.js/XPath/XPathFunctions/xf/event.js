"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.xf_event_1 = function() {
  const res = new Fleur.Text();
  res.schemaTypeInfo = Fleur.Type_string;
  for (let i = XsltForms_xmlevents.EventContexts.length - 1; i >= 0 ; i--) {
    const evcontext = XsltForms_xmlevents.EventContexts[i];
    if (evcontext[this.item.data]) {
      res.data = evcontext[this.item.data];
      this.item = res;
      return this;
    }
  }
  res.data = "";
  this.item = res;
  return this;
};

Fleur.XPathFunctions_xf["event#1"] = new Fleur.Function("http://www.w3.org/2002/xforms", "xf:event", Fleur.Context.prototype.xf_event_1,
  [Fleur.SequenceType_string_1], Fleur.SequenceType_string_1, {dynonly: true});