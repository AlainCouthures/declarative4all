/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_fn["format-integer#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-integer",
	function(value, picture) {
		var i, j, l, l2, pictures, dss, ess, ps, pms, ms, msbefore, psafter, pmsafter, signs, esigns, iipgp, ipgp, mips, prefix, fstart, fpgp, minfps, maxfps, mes, suffix, dsspos, evalue, esign, s0, s;
		pictures = picture.split(";");
		picture = value < 0 && pictures[1] ? pictures[1] : pictures[0];
		signs = ".,-%\u2030#0123456789";
		esigns = ".,e-%\u2030#0123456789";
		i = 0;
		l = picture.length;
		while (i < l && signs.indexOf(picture.charAt(i)) === -1) {
			i++;
		}
		prefix = picture.substring(0, i);
		dss = ess = ps = pms = false;
		mips = 0;
		minfps = 0;
		maxfps = 0;
		mes = 0;
		iipgp = [];
		ipgp = [];
		fpgp = [];
		while (i < l && esigns.indexOf(picture.charAt(i)) !== -1) {
			switch (picture.charAt(i)) {
				case ".":
					dss = true;
					fstart = i + 1;
					j = 0;
					l2 = iipgp.length;
					while (j < l2) {
						ipgp[l2 - j - 1] = i - iipgp[j] - 1;
						j++;
					}
					break;
				case ",":
					if (dss) {
						fpgp.push(i - fstart);
					} else {
						iipgp.push(i);
					}
					break;
				case "e":
					ess = true;
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "-":
					ms = true;
					msbefore = mips === 0;
					break;
				case "%":
					ps = true;
					psafter = mips !== 0;
					value *= 100;
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "\u2030":
					pms = true;
					pmsafter = mips !== 0;
					value *= 1000;
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "0":
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					if (ess) {
						mes++;
					} else if (dss) {
						minfps++;
						maxfps++;
					} else {
						mips++;
					}
					break;
				case "#":
					if (dss) {
						maxfps++;
					}
					break;
			}
			i++;
		}
		if (!dss) {
			if (iipgp.length !== ipgp.length) {
				j = 0;
				l2 = iipgp.length;
				while (j < l2) {
					ipgp[l2 - j - 1] = i - iipgp[j] - 1;
					j++;
				}
			}
			if (mips === 0) {
				mips = 1;
			}
		}
		if (ipgp.length > 1) {
			j = 1;
			l2 = ipgp.length;
			while (j < l2 && ipgp[j] % ipgp[0] === 0) {
				j++;
			}
			if (j === l2) {
				ipgp = [ipgp[0]];
			}
		}
		if (ipgp.length === 1) {
			j = 1;
			while (j < 30) {
				ipgp[j] = ipgp[j - 1] + ipgp[0];
				j++;
			}
		}
		suffix = picture.substring(i);
		if (value === Number.POSITIVE_INFINITY) {
			return prefix + "Infinity" + suffix;
		} else if (value === Number.NEGATIVE_INFINITY) {
			return "-" + prefix + "Infinity" + suffix;
		}
		if (value < 0 && pictures.length === 1) {
			prefix = "-" + prefix;
		}
		if (ess) {
			evalue = Math.floor(Math.log(value) / Math.LN10) + 1 - mips;
			value /= Math.pow(10, evalue);
			esign = evalue < 0 ? "-" : "";
			evalue = String(Math.abs(evalue));
			evalue = esign + ("000000000000000000000000000000").substr(0, Math.max(0, mes - evalue.length)) + evalue;
		}
		s0 = Math.abs(value).toFixed(maxfps);
		if (maxfps === 0 && dss) {
			s0 += ".";
		}
		dsspos = s0.indexOf(".") === -1 ? s0.length : s0.indexOf(".");
		if (dsspos < mips) {
			s0 = ("000000000000000000000000000000").substr(0, mips - dsspos) + s0;
			dsspos = mips;
		}
		j = dsspos - 1;
		s = "";
		i = 0;
		l2 = s0.length;
		while (j >= 0) {
			s = s0.charAt(j) + s;
			if (j !== 0 && ipgp[i] === dsspos - j) {
				s = "," + s;
				i++;
			}
			j--;
		}
		if (dss) {
			s += ".";
			j = dsspos + 1;
			i = 0;
			while (j < l2) {
				s += s0.charAt(j);
				if (j !== l2 - 1 && fpgp[i] === j - dsspos) {
					s += ",";
					i++;
				}
				j++;
			}
		}
		if (ps) {
			if (psafter) {
				s += "%";
			} else {
				s = "%" + s;
			}
		}
		if (pms) {
			if (pmsafter) {
				s += "\u2030";
			} else {
				s = "\u2030" + s;
			}
		}
		if (ess) {
			s += "e" + evalue;
		}
		return prefix + s + suffix;
	},
	null, [{type: Fleur.Type_integer, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});