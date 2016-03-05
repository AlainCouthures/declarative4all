/*eslint-env browser*/
/*globals XsltForms_browser Fleur*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module idManager
 * @description  === "XsltForms_idManager" class ===
 * Id Manager for repeat structures
 */
		
var XsltForms_idManager = {
	cloneId : function(element) {
		XsltForms_browser.assert(element && element.id);
		var id = element.getAttribute("oldid") || element.id;
		var list = this.data[id];
		if (!list) {
			list = [];
			this.data[id] = list;
		}
		var newId = "clonedId" + this.index++;
		list.push(newId);
		element.setAttribute("oldid", id);
		element.id = newId;
	},
    find : function(id) {
		var ids = this.data[id];
		if (ids) {
			for (var i = 0, len = ids.length; i < len; i++) {
				var element = document.getElementById(ids[i]);
				if (element) {
					var parentElt = element.parentNode;
					while (parentElt.nodeType === Fleur.Node.ELEMENT_NODE) {
						if (XsltForms_browser.hasClass(parentElt, "xforms-repeat-item")) {
							if (XsltForms_browser.hasClass(parentElt, "xforms-repeat-item-selected")) {
								return element;
							} else {
								break;
							}
						}
						parentElt = parentElt.parentNode;
					}
				}
			}
		}
		var res = document.getElementById(id);
		//if (!res) {
			//alert("element " + id + " not found");
		//}
		return res;
	},
	clear : function() {
		for (var i = 0, len = this.data.length; i < len; i++) {
			this.data[i] = null;
		}
		this.data = [];
		this.index = 0;
	},
	data : [],
	index : 0
};