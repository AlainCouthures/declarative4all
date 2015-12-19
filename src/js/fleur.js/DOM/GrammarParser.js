/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.GrammarParser = function() {};
Fleur.GrammarParser._skipSpaces = function(s, offset) {
	var i = offset;
	var c = s.charAt(i);
	var pre = "";
	do {
		if (c !== "\n" && c !== "\r" && c !== "\t" && c !== " ") {
			return pre === "\n" ? i - 1 : i;
		}
		pre = c;
		c = s.charAt(++i);
	} while (c !== "");
	//console.log("skip="+s.substring(offset, i).quote());
	return i;
};
Fleur.GrammarParser._getName = function(s) {
	var i = 0;
	var o = s.charAt(0);
	while (o !== "" && "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-$".indexOf(o) !== -1) {
		o = s.charAt(++i);
	}
	return s.substr(0, i).toLowerCase();
};
Fleur.GrammarParser._bases = {
	b: "01",
	d: "0123456789",
	x: "0123456789abcdef"
};
Fleur.GrammarParser._getChar = function(s, base) {
	var i = 0;
	var o = s.charAt(0).toLowerCase();
	var c = 0;
	while (base.indexOf(o) !== -1) {
		c = c * base.length + base.indexOf(o);
		o = s.charAt(++i).toLowerCase();
	}
	return [i, c];
};
Fleur.GrammarParser._getTerm = function(s, gram) {
	var i = 0;
	var o = s.charAt(i);
	var prevo = "";
	var t = [];
	var l;
	var typ = 0;
	var ref = 1;
	var reg;
	var newrulename;
	var base;
	var c1, c2;
	var term;
	var min = 1;
	var max = 1;
	prevo = o;
	if ("0123456789".indexOf(o) !== -1) {
		min = 0;
		do {
			min = min * 10 + Fleur.GrammarParser._bases.d.indexOf(o);
			o = s.charAt(++i);
		} while ("0123456789".indexOf(o) !== -1);
	}
	if (o === "*") {
		if (prevo === "*") {
			min = 0;
		}
		o = s.charAt(++i);
		if ("0123456789".indexOf(o) !== -1) {
			max = 0;
			do {
				max = max * 10 + Fleur.GrammarParser._bases.d.indexOf(o);
				o = s.charAt(++i);
			} while ("0123456789".indexOf(o) !== -1);
		} else {
			max = Number.POSITIVE_INFINITY;
		}
	} else {
		max = min;
	}
	//console.log("[" + min + ", " + max + "]");
	if (min !== max) {
		newrulename = "$" + gram[0].length;
		if (min !== 0) {
			reg = "\r\n" + newrulename + " = " + min + s.substr(i) + " " + (max === Number.POSITIVE_INFINITY ? "*" : (max - min)) + s.substr(i);
		} else if (max !== Number.POSITIVE_INFINITY){
			reg = "\r\n" + newrulename + " = " + max + "[" + s.substr(i) + "]";
		} else {
			reg = "\r\n" + newrulename + " = / ^" + newrulename + " " + s.substr(i);
		}
		t.push([2, newrulename]);
		gram[0] += reg;
		return t;
	}
	if (min === 0) {
		return [[]];
	}
	if (o === "(") {
		newrulename = "$" + gram[0].length;
		reg = "\r\n" + newrulename + " = ";
		do {
			o = s.charAt(++i);
			if (o === ')') {
				if (prevo !== '\\') {
					t.push([2, newrulename]);
					gram[0] += reg;
					break;
				}
			}
			reg += o;
		} while (o !== "");
	} else if (o === "[") {
		newrulename = "$" + gram[0].length;
		reg = "\r\n" + newrulename + " = / ";
		do {
			o = s.charAt(++i);
			if (o === ']') {
				if (prevo !== '\\') {
					t.push([2, newrulename]);
					gram[0] += reg;
					break;
				}
			}
			reg += o;
		} while (o !== "");
	} else {
		if (o === "^") {
			ref = 0;
			o = s.charAt(++i);
		} else if (o === "@") {
			ref = 1;
			typ = 2;
			o = s.charAt(++i);
		}
		if (o === '"') {
			typ = 3;
			do {
				o = s.charAt(++i);
				if (o === '"') {
					if (prevo === '"') {
						t.push(ref ? [0, '"', 1] : [0, '"']);
						prevo = "";
					} else {
						break;
					}
				} else {
					t.push(ref ? [0, o, 1] : [0, o]);
					prevo = o;
				}
			} while (o !== "");
		} else if (o === "%") {
			base = Fleur.GrammarParser._bases[s.charAt(++i)];
			c1 = Fleur.GrammarParser._getChar(s.substr(i + 1), base);
			i += c1[0] + 1;
			o = s.charAt(++i);
			if (o === "-") {
				c2 = Fleur.GrammarParser._getChar(s.substr(i), base);
				reg = "[\\x" + c1[1].charCodeAt(0).toString(16) + "-\\x" + c2[1].charCodeAt(0).toString(16) + "]";
				t.push(ref ? [1, new RegExp(reg), 1] : [1, new RegExp(reg)]);
			} else {
				t.push(ref ? [0, c1[1], 1] : [0, c1[1]]);
				while (o === ".") {
					c1 = Fleur.GrammarParser._getChar(s.substr(i + 1), base);
					i += c1[0] + 1;
					o = s.charAt(++i);
					t.push(ref ? [0, c1[1], 1] : [0, c1[1]]);
				}
			}
			switch (s.charAt(i + 1)) {
				case ".":
					break;
				case "-":
					c2 = Fleur.GrammarParser._getChar(s.substr(i + 1));
			}
		} else {
			if (typ === 0) {
				typ = 1;
			}
			o = Fleur.GrammarParser._getName(s.substr(i));
			switch (o) {
				case "alpha":
					term = ref ? [1, /[A-Za-z]/, 1] : [1, /[A-Za-z]/];
					break;
				case "bit":
					term = ref ? [1, /[01]/, 1] : [1, /[01]/];
					break;
				case "char":
					term = ref ? [1, /[^\0]/, 1] : [1, /[^\0]/];
					break;
				case "cr":
					term = ref ? [0, "\r", 1] : [0, "\r"];
					break;
				case "ctl":
					term = ref ? [1, /[\0-\x1f\x7f]/, 1] : [1, /[\0-\x1f\x7f]/];
					break;
				case "digit":
					term = ref ? [1, /[0-9]/, 1] : [1, /[0-9]/];
					break;
				case "dquote":
					term = ref ? [0, '"', 1] : [0, '"'];
					break;
				case "hexdig":
					term = ref ? [1, /[0-9A-Fa-f]/, 1] : [1, /[0-9A-Fa-f]/];
					break;
				case "htab":
					term = ref ? [0, "\t", 1] : [0, "\t"];
					break;
				case "lf":
					term = ref ? [0, "\n", 1] : [0, "\n"];
					break;
				case "octet":
					term = ref ? [1, /[\0-\xff]/, 1] : [1, /[\0-\xff]/];
					break;
				case "sp":
					term = ref ? [0, " ", 1] : [0, " "];
					break;
				case "vchar":
					term = ref ? [1, /[\x21-\x7e]/, 1] : [1, /[\x21-\x7e]/];
					break;
				case "wsp":
					term = ref ? [1, /[ \t]/, 1] : [1, /[ \t]/];
					break;
				default:
					term = ref ? [2, o, typ] : [2, o];
			}
			t.push(term);
		}
	}
	if (min !== 1) {
		//console.log(t);
		l = t.length * (min - 1);
		for (i = 0; i < l; i++) {
			term = t[i].slice(0);
			t.push(term);
		}
		//console.log(t);
	}
	return t;
};
Fleur.GrammarParser._getAlternative = function(s, gram) {
	var offset = 0;
	var o = s.charAt(offset);
	var term = "";
	var alt = [];
	var nbpar = 0;
	while (o !== "") {
		if (o === " " && nbpar === 0) {
			term = term.substr(Fleur.GrammarParser._skipSpaces(term, 0));
			//console.log("term=" + term.quote());
			if (term !== "") {
				alt = alt.concat(Fleur.GrammarParser._getTerm(term, gram));
			}
			term = "";
		} else {
			switch (o) {
				case "(":
				case "[":
					nbpar++;
					break;
				case ")":
				case "]":
					nbpar--;
			}
			term += o;
		}
		o = s.charAt(++offset);
	}
	term = term.substr(Fleur.GrammarParser._skipSpaces(term, 0));
	//console.log("term=" + term.quote());
	if (term !== "") {
		return alt.concat(Fleur.GrammarParser._getTerm(term, gram));
	}
	return alt;
};
Fleur.GrammarParser._getDefinition = function(s, gram) {
	var offset = 0;
	var o = s.charAt(offset);
	var alt = "";
	var def = [];
	var empty = true;
	var nbpar = 0;
	while (o !== "") {
		if (o === "/" && nbpar === 0) {
			alt = alt.substr(Fleur.GrammarParser._skipSpaces(alt, 0));
			//console.log("alt=" + alt.quote());
			if (alt !== "") {
				def.push(Fleur.GrammarParser._getAlternative(alt, gram));
				empty = false;
			} else if (empty) {
				def.push([]);
			}
			alt = "";
		} else {
			switch (o) {
				case "(":
				case "[":
					nbpar++;
					break;
				case ")":
				case "]":
					nbpar--;
			}
			alt += o;
		}
		o = s.charAt(++offset);
	}
	alt = alt.substr(Fleur.GrammarParser._skipSpaces(alt, 0));
	//console.log("alt=" + alt.quote());
	if (alt !== "") {
		def.push(Fleur.GrammarParser._getAlternative(alt, gram));
	} else if (empty) {
		def.push([]);
	}
	return def;
};
Fleur.GrammarParser.prototype.createGrammar = function(grammar) {
	var g = [];
	var gram = [grammar];
	var offset = 0;
	var n = [[""], [[2, 0, "xmlns"]]];
	var rules = {};
	var nbrules = 0;
	var rulename;
	var o;
	var def;
	var i, j, k, l, l2, l3;
	var prods = {};
	var nbprods = 1;
	var root = "";
	var ruleindex;
	while (offset < gram[0].length) {
		offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
		rulename = Fleur.GrammarParser._getName(gram[0].substr(offset));
		//console.log("rulename=" + rulename.quote());
		if (rulename !== "") {
			if (root === "") {
				root = rulename;
			}
			offset += rulename.length;
			offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
			offset++;
			if (gram[0].charAt(offset) === "/") {
				ruleindex = rules[rulename];
				offset++;
			} else {
				rules[rulename] = nbrules++;
				ruleindex = g.length;
			}
			offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
			o = gram[0].charAt(offset);
			def = "";
			var pre = "";
			var instr = false;
			var incomment = false;
			while (o !== ""){
				if (pre === "\n") {
					if (o !== " ") {
						def = def.substr(0, def.length - 1);
						offset--;
						break;
					} else {
						def = def.substr(0, def.length - 1);
					}
				}
				if (instr) {
					instr = o !== '"';
				}
				if (incomment) {
					incomment = o !== "\n";
				} else if (o === ";" && !instr) {
					incomment = true;
				} else {
					def += o;
					instr = o === '"' && !incomment;
				}
				pre = o;
				o = gram[0].charAt(++offset);
			}
			offset++;
			//console.log("def=" + def.quote());
			if (ruleindex === g.length) {
				g.push(Fleur.GrammarParser._getDefinition(def, gram));
			} else {
				g[ruleindex] = g[ruleindex].concat(Fleur.GrammarParser._getDefinition(def, gram));
			}
		} else {
			offset++;
		}
	}
	prods["1 " + root] = 0;
	n[1][1] = [1, 0, root];
	//console.log(g);
	for (i = 0, l = g.length; i < l; i++) {
		for (j = 0, l2 = g[i].length; j < l2; j++) {
			for (k = 0, l3 = g[i][j].length; k < l3; k++) {
				if (g[i][j][k][0] === 2) {
					if (g[i][j][k][2]) {
						if (prods[g[i][j][k][2] + " " + g[i][j][k][1]]) {
							g[i][j][k][2] = prods[g[i][j][k][2] + " " + g[i][j][k][1]];
						} else {
							prods[g[i][j][k][2] + " " + g[i][j][k][1]] = ++nbprods;
							n[1].push([g[i][j][k][2], 0, g[i][j][k][1]]);
							g[i][j][k][2] = nbprods;
						}
					}
					g[i][j][k][1] = rules[g[i][j][k][1]];
				}
			}
		}
	}
	return [g, n];
};