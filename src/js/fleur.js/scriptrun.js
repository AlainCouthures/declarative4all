/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
if (document) {
	document.addEventListener('DOMContentLoaded', function() {
		var scripts = Array.prototype.slice.call(document.getElementsByTagName("script"), 0).filter(function(sc) {
			return sc.getAttribute("type") === "application/xquery";
		});
		var parser = new Fleur.DOMParser();
		var xmldoc;
		var xqeval = function(xexpr) {
			try {
				xmldoc.evaluate(xexpr).then(
					function(res) {},
					function(err) {
						alert(err.toXQuery());
					}
				);
			} catch(e) {
				alert("Exception!\n" + e.stack);
			}
		};
		xmldoc = parser.parseFromString("<dummy/>", "application/xml");
		scripts.forEach(function(sc) {
			xqeval(sc.textContent);
		});
	}, false);
}