/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_ietf["email#1"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:email",
	function(message, callback) {
		return Fleur.XPathFunctions_ietf["email#2"].jsfunc(message, null, callback);
	},
	null, [{type: Fleur.Node}], false, true, {type: Fleur.EmptySequence});

Fleur.XPathFunctions_ietf["email#2"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:email",
	function(message, options, callback) {
		var cmd = "Send-MailMessage ";
		var toString = function (n) {
			return '"' + n.textContent + '"';
		};
		var QName = function (n) {
			return "Q{" + n.namespaceURI + "}" + n.localName;
		};
		var addressformat = function(n) {
			return "'" + n.children.map(function(m) {
				switch (QName(m)) {
					case "Q{URN:ietf:params:email-xml:}name":
						return m.textContent.replace(/'/g, "''");
					case "Q{URN:ietf:params:email-xml:}adrs":
						return "<" + m.textContent.replace(/'/g, "''") + ">";
				}
			}).sort(function(a, b) { return a < b ? 1 : -1; }).join(" ") +"'";
		};
		cmd += message.children.map(function(n) {
			switch (QName(n)) {
				case "Q{URN:ietf:params:rfc822:}subject":
					return "-Subject '" + n.textContent.replace(/'/g, "''") + "'";
				case "Q{URN:ietf:params:rfc822:}from":
					return "-From " + addressformat(n.children[0]);
				case "Q{URN:ietf:params:rfc822:}to":
					return "-To " + n.children.map(addressformat).join(", ");
				case "Q{URN:ietf:params:email-xml:}content":
					if (QName(n.children[0]) === "Q{http://www.w3.org/1999/xhtml}html") {
						return "-BodyAsHtml -Body '" + Fleur.Serializer._serializeHTMLToString(n.children[0]).replace(/\n/g, "") + "'";
					}
					return "-Body '" + n.textContent + "'";
			}
		}).join(" ");
		if (options && options !== Fleur.EmptySequence) {
			cmd += " " + options.children.map(function(n) {
				switch (n.localName) {
					case "authentication":
						return "-Credential (New-Object Management.Automation.PSCredential " + n.children.sort(function(a, b) {
							var nameorder = ["username", "password"];
							return nameorder.indexOf(a.localName) < nameorder.indexOf(b.localName) ? -1 : 1;
						}).map(function(m) {
							switch (m.localName) {
								case "username":
									return toString(m);
								case "password":
									return "(ConvertTo-SecureString " + toString(m) + " -AsPlainText -Force)";
							}
						}).join(", ") + ")";
					case "verify-cert":
						return "-UseSsl";
					case "smtp-server":
						return "-SmtpServer " + toString(n);
					case "port":
						return "-Port " + n.textContent;
				}
			}).join(" ");
		}
		cmd += " -Encoding ([System.Text.Encoding]::UTF8)";
		console.log(cmd);
		cmd = "%SystemRoot%\\system32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -NoLogo -NonInteractive -ExecutionPolicy Bypass \"& {chcp 65001 ; $ProgressPreference='SilentlyContinue' ; " + cmd + "}\"";
		global.child_process.exec(cmd, {windowsHide: true}, function(err, stdout, stderr) {
			if (err) {
				err.name = "FOPR0001";
				callback(err);
			} else if (stderr) {
				var e = new Error(stderr);
				e.name = "FOPR0001";
				callback(e);
			} else {
				callback();
			}
		});
	},
	null, [{type: Fleur.Node}, {type: Fleur.Node, occurence: "?"}], false, true, {type: Fleur.EmptySequence});