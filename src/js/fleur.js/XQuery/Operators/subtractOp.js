/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.subtractOpTypes = [
					/*  integer decimal   float  double  string boolean    date  dateT.    time yearMD.  dayTD. */
/*integer	 0*/	[		 0,		 1,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
/*decimal	 1*/	[		 1,		 1,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
/*float		 2*/	[		 2,		 2,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
/*double	 3*/	[		 3,		 3,		 3,		 3,		-1,		-1,		-1,		-1,		-1,		-1, 	-1],
/*string	 4*/	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
/*boolean	 5*/	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
/*date		 6*/	[		-1,		-1,		-1,		-1,		-1,		-1,		10,		10,		10,		 6,		 6],
/*dateTime	 7*/	[		-1,		-1,		-1,		-1,		-1,		-1,		10,		10,		10,		 7,		 7],
/*time		 8*/	[		-1,		-1,		-1,		-1,		-1,		-1,		10,		10,		10,		-1,		 8],
/*yearMonthD.9*/	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		 9,		-1],
/*dayTimeD.	10*/	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		10]
];
Fleur.XQueryEngine[Fleur.XQueryX.subtractOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSValue(a1, true, false, false, true, false, true);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var restype, res, resvalue;
			var a2 = Fleur.Atomize(n);
			var prevm;
			op2 = Fleur.toJSValue(a2, true, false, false, true, false, true);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			restype = Fleur.subtractOpTypes[op1[0]][op2[0]];
			if (restype !== -1) {
				if (op1[0] < 4 && op2[0] < 4) {
					var val = typeof op1[1] === typeof op2[1] ? op1[1] - op2[1] : Number(op1[1]) - Number(op2[1]);
					if (restype > 1) {
						a1.data = Fleur.Type_double.canonicalize(String(val));
					} else {
						var precision1 = a1.data.indexOf(".") !== -1 ? a1.data.length - a1.data.indexOf(".") - 1 : 0;
						var precision2 = a2.data.indexOf(".") !== -1 ? a2.data.length - a2.data.indexOf(".") - 1 : 0;
						a1.data = Fleur.NumberToDecimalString(val, Math.max(precision1, precision2));
					}
				} else if (op1[0] > 5 && op1[0] < 9 && op2[0] > 5 && op2[0] < 9) {
					a1.data = Fleur.msToDayTimeDuration(op1[1].d - op1[1].tz * 60 * 1000 - op2[1].d + op2[1].tz * 60 * 1000);
				} else if (op1[0] > 5 && op1[0] < 9 && op2[0] > 8) {
					var d = op1[1].d;
					if (op2[0] === 9) {
						prevm = d.getMonth();
						if (op2[1].year !== 0) {
							d.setFullYear(d.getFullYear() - op2[1].sign * op2[1].year);
						}
						if (op2[1].month !== 0) {
							d.setMonth(d.getMonth() - op2[1].sign * op2[1].month);
						}
						if (d.getMonth() !== prevm - (op2[1].month !== 0 ? op2[1].sign * op2[1].month : 0)) {
							d.setDate(0);
						}
					} else {
						if (op2[1].day !== 0) {
							d.setDate(d.getDate() - op2[1].sign * op2[1].day);
						}
						if (op2[1].hour !== 0) {
							d.setHours(d.getHours() - op2[1].sign * op2[1].hour);
						}
						if (op2[1].minute !== 0) {
							d.setMinutes(d.getMinutes() - op2[1].sign * op2[1].minute);
						}
						if (op2[1].second !== 0) {
							d.setSeconds(d.getSeconds() - op2[1].sign * op2[1].second);
						}
					}
					op1[1].d = d;
					a1.data = restype === 6 ? Fleur.dateToDate(op1[1]) : restype === 7 ? Fleur.dateToDateTime(op1[1]) : Fleur.dateToTime(op1[1]);
				} else if (op1[0] === 9 && op2[0] === 9) {
					resvalue = op1[1].sign * (op1[1].year * 12 + op1[1].month) - op2[1].sign * (op2[1].year * 12 + op2[1].month);
					res = {
						sign: resvalue < 0 ? -1 : 1,
						year: Math.floor(Math.abs(resvalue) / 12),
						month: Math.abs(resvalue) % 12};
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0  || res.year === 0? String(res.month) + "M" : "");
				} else if (op1[0] === 10 && op2[0] === 10) {
					resvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) - op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
					res = {sign: resvalue < 0 ? -1 : 1};
					resvalue = Math.abs(resvalue);
					res.day = Math.floor(resvalue / 86400);
					resvalue = resvalue % 86400;
					res.hour = Math.floor(resvalue / 3600);
					resvalue = resvalue % 3600;
					res.minute = Math.floor(resvalue / 60);
					res.second = resvalue % 60;
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || res.day + res.hour + res.minute === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || res.day + res.hour + res.minute === 0 ? String(res.second) + "S" : "");
				}
				a1.schemaTypeInfo = Fleur.JSTypes[restype];
			} else {
				a1 = new Fleur.Text();
				a1.schemaTypeInfo = Fleur.Type_error;
				a1._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
			}
			Fleur.callback(function() {callback(a1);});
		});
	});
};