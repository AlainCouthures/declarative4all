"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.addOpTypes = [
              /*  integer decimal   float  double  string boolean    date  dateT.    time yearMD.  dayTD. */
/*integer   0*/  [     0,     1,     2,     3,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*decimal   1*/  [     1,     1,     2,     3,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*float     2*/  [     2,     2,     2,     3,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*double   3*/   [     3,     3,     3,     3,    -1,    -1,    -1,    -1,    -1,    -1,   -1],
/*string   4*/   [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*boolean   5*/  [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*date     6*/   [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,     6,     6],
/*dateTime   7*/ [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,     7,     7],
/*time     8*/   [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,     8],
/*yearMonthD.9*/ [    -1,    -1,    -1,    -1,    -1,    -1,     6,     7,    -1,     9,    -1],
/*dayTimeD.  10*/[    -1,    -1,    -1,    -1,    -1,    -1,     6,     7,     8,    -1,    10]
];

Fleur.Transpiler.prototype.xqx_addOp = function(children) {
  const arg1 = this.gen(children[0][1][0], Fleur.SequenceType_numeric_1);
  const arg2 = this.gen(children[1][1][0], Fleur.SequenceType_numeric_1);
  if (arg1.value && arg2.value) {
    return this.staticargs([arg1, arg2]).xqx_addOp().staticinst(this);
  }
  return this.inst("xqx_addOp()", false, Fleur.SequenceType_numeric_1, arg1.inst + arg2.inst);
};

Fleur.Context.prototype.xqx_addOp = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  if (arg1.isEmpty()) {
    this.item = arg1;
    return this;
  }
  if (arg2.isEmpty()) {
    return this;
  }
  const op1 = Fleur.toJSValue(arg1, true, true, false, true, false, true);
  if (op1[0] < 0) {
    this.item = arg1;
    return this;
  }
  const op2 = Fleur.toJSValue(arg2, true, true, false, true, false, true);
  if (op2[0] < 0) {
    return this;
  }
  const res = new Fleur.Text();
  const restype = Fleur.addOpTypes[op1[0]][op2[0]];
  if (restype !== -1) {
    let d, dres, dresvalue, prevm;
    if (op1[0] < 4 && op2[0] < 4) {
      const val = typeof op1[1] === typeof op2[1] ? op1[1] + op2[1] : Number(op1[1]) + Number(op2[1]);
      if (restype > 1) {
        res.data = Fleur.Type_double.canonicalize(String(val));
      } else {
        const precision1 = arg1.data.indexOf(".") !== -1 ? arg1.data.length - arg1.data.indexOf(".") - 1 : 0;
        const precision2 = arg2.data.indexOf(".") !== -1 ? arg2.data.length - arg2.data.indexOf(".") - 1 : 0;
        res.data = Fleur.NumberToDecimalString(val, Math.max(precision1, precision2));
      }
    } else if (op1[0] === 4 && op2[0] === 4) {
      res.data = op1[1] + op2[1];
    } else if (op1[0] > 5 && op1[0] < 9 && op2[0] > 8) {
      d = op1[1].d;
      if (op2[0] === 9) {
        prevm = d.getMonth();
        if (op2[1].year !== 0) {
          d.setFullYear(d.getFullYear() + op2[1].sign * op2[1].year);
        }
        if (op2[1].month !== 0) {
          d.setMonth(d.getMonth() + op2[1].sign * op2[1].month);
        }
        if (d.getMonth() !== prevm + (op2[1].month !== 0 ? op2[1].sign * op2[1].month : 0)) {
          d.setDate(0);
        }
      } else {
        if (op2[1].day !== 0) {
          d.setDate(d.getDate() + op2[1].sign * op2[1].day);
        }
        if (op2[1].hour !== 0) {
          d.setHours(d.getHours() + op2[1].sign * op2[1].hour);
        }
        if (op2[1].minute !== 0) {
          d.setMinutes(d.getMinutes() + op2[1].sign * op2[1].minute);
        }
        if (op2[1].second !== 0) {
          d.setSeconds(d.getSeconds() + op2[1].sign * op2[1].second);
        }
      }
      res.data = restype === 6 ? Fleur.dateToDate({d: d, tz: op1[1].tz}) : restype === 7 ? Fleur.dateToDateTime({d: d, tz: op1[1].tz}) : Fleur.dateToTime({d: d, tz: op1[1].tz});
    } else if (op2[0] > 5 && op2[0] < 9 && op1[0] > 8) {
      d = op2[1].d;
      if (op1[0] === 9) {
        prevm = d.getMonth();
        if (op1[1].year !== 0) {
          d.setFullYear(d.getFullYear() + op1[1].sign * op1[1].year);
        }
        if (op1[1].month !== 0) {
          d.setMonth(d.getMonth() + op1[1].sign * op1[1].month);
        }
        if (d.getMonth() !== prevm + (op1[1].month !== 0 ? op1[1].sign * op1[1].month : 0)) {
          d.setDate(0);
        }
      } else {
        if (op1[1].day !== 0) {
          d.setDate(d.getDate() + op1[1].sign * op1[1].day);
        }
        if (op1[1].hour !== 0) {
          d.setHours(d.getHours() + op1[1].sign * op1[1].hour);
        }
        if (op1[1].minute !== 0) {
          d.setMinutes(d.getMinutes() + op1[1].sign * op1[1].minute);
        }
        if (op1[1].second !== 0) {
          d.setSeconds(d.getSeconds() + op1[1].sign * op1[1].second);
        }
      }
      res.data = restype === 6 ? Fleur.dateToDate({d: d, tz: op2[1].tz}) : restype === 7 ? Fleur.dateToDateTime({d: d, tz: op2[1].tz}) : Fleur.dateToTime({d: d, tz: op2[1].tz});
    } else if (op1[0] === 9 && op2[0] === 9) {
      dresvalue = op1[1].sign * (op1[1].year * 12 + op1[1].month) + op2[1].sign * (op2[1].year * 12 + op2[1].month);
      dres = {
        sign: dresvalue < 0 ? -1 : 1,
        year: Math.floor(Math.abs(dresvalue) / 12),
        month: Math.abs(dresvalue) % 12};
      res.data = (dres.sign < 0 ? "-" : "") + "P" + (dres.year !== 0 ? String(dres.year) + "Y": "") + (dres.month !== 0 || dres.year === 0 ? String(dres.month) + "M" : "");
    } else if (op1[0] === 10 && op2[0] === 10) {
      dresvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) + op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
      dres = {sign: dresvalue < 0 ? -1 : 1};
      dresvalue = Math.abs(dresvalue);
      dres.day = Math.floor(dresvalue / 86400);
      dresvalue = dresvalue % 86400;
      dres.hour = Math.floor(dresvalue / 3600);
      dresvalue = dresvalue % 3600;
      dres.minute = Math.floor(dresvalue / 60);
      dres.second = dresvalue % 60;
      res.data = (dres.sign < 0 ? "-" : "") + "P" + (dres.day !== 0 ? String(dres.day) + "D": "") + (dres.hour !== 0 || dres.minute !== 0 || dres.second !== 0 || dres.day + dres.hour + dres.minute === 0 ? "T" : "") + (dres.hour !== 0 ? String(dres.hour) + "H" : "") + (dres.minute !== 0 ? String(dres.minute) + "M" : "") + (dres.second !== 0 || dres.day + dres.hour + dres.minute === 0 ? String(dres.second) + "S" : "");
    }
    res.schemaTypeInfo = Fleur.JSTypes[restype];
  } else {
    Fleur.XQueryError_xqt(arg1.nodeType === Fleur.Node.ELEMENT_NODE || arg2.nodeType === Fleur.Node.ELEMENT_NODE ? "FORG0001" : "XPTY0004");
  }
  this.item = res;
  return this;
};
/*
Fleur.XQueryEngine[Fleur.XQueryX.addOp] = function(ctx, children, callback) {
  Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n1) {
    var op1, d;
    var a1 = Fleur.Atomize(n1, true);
    if (a1 === Fleur.EmptySequence) {
      Fleur.callback(function() {callback(a1);});
      return;
    }
    Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n2) {
      var op2;
      var restype, res, resvalue;
      var prevm;
      var a2 = Fleur.Atomize(n2, true);
      if (a2 === Fleur.EmptySequence) {
        Fleur.callback(function() {callback(a2);});
        return;
      }
      op1 = Fleur.toJSValue(a1, true, true, false, true, false, true);
      if (op1[0] < 0) {
        Fleur.callback(function() {callback(a1);});
        return;
      }
      op2 = Fleur.toJSValue(a2, true, true, false, true, false, true);
      if (op2[0] < 0) {
        Fleur.callback(function() {callback(a2);});
        return;
      }
      restype = Fleur.addOpTypes[op1[0]][op2[0]];
      if (restype !== -1) {
        if (op1[0] < 4 && op2[0] < 4) {
          var val = typeof op1[1] === typeof op2[1] ? op1[1] + op2[1] : Number(op1[1]) + Number(op2[1]);
          if (restype > 1) {
            a1.data = Fleur.Type_double.canonicalize(String(val));
          } else {
            var precision1 = a1.data.indexOf(".") !== -1 ? a1.data.length - a1.data.indexOf(".") - 1 : 0;
            var precision2 = a2.data.indexOf(".") !== -1 ? a2.data.length - a2.data.indexOf(".") - 1 : 0;
            a1.data = Fleur.NumberToDecimalString(val, Math.max(precision1, precision2));
          }
        } else if (op1[0] === 4 && op2[0] === 4) {
          a1.data = op1[1] + op2[1];
        } else if (op1[0] > 5 && op1[0] < 9 && op2[0] > 8) {
          d = op1[1].d;
          if (op2[0] === 9) {
            prevm = d.getMonth();
            if (op2[1].year !== 0) {
              d.setFullYear(d.getFullYear() + op2[1].sign * op2[1].year);
            }
            if (op2[1].month !== 0) {
              d.setMonth(d.getMonth() + op2[1].sign * op2[1].month);
            }
            if (d.getMonth() !== prevm + (op2[1].month !== 0 ? op2[1].sign * op2[1].month : 0)) {
              d.setDate(0);
            }
          } else {
            if (op2[1].day !== 0) {
              d.setDate(d.getDate() + op2[1].sign * op2[1].day);
            }
            if (op2[1].hour !== 0) {
              d.setHours(d.getHours() + op2[1].sign * op2[1].hour);
            }
            if (op2[1].minute !== 0) {
              d.setMinutes(d.getMinutes() + op2[1].sign * op2[1].minute);
            }
            if (op2[1].second !== 0) {
              d.setSeconds(d.getSeconds() + op2[1].sign * op2[1].second);
            }
          }
          a1.data = restype === 6 ? Fleur.dateToDate({d: d, tz: op1[1].tz}) : restype === 7 ? Fleur.dateToDateTime({d: d, tz: op1[1].tz}) : Fleur.dateToTime({d: d, tz: op1[1].tz});
        } else if (op2[0] > 5 && op2[0] < 9 && op1[0] > 8) {
          d = op2[1].d;
          if (op1[0] === 9) {
            prevm = d.getMonth();
            if (op1[1].year !== 0) {
              d.setFullYear(d.getFullYear() + op1[1].sign * op1[1].year);
            }
            if (op1[1].month !== 0) {
              d.setMonth(d.getMonth() + op1[1].sign * op1[1].month);
            }
            if (d.getMonth() !== prevm + (op1[1].month !== 0 ? op1[1].sign * op1[1].month : 0)) {
              d.setDate(0);
            }
          } else {
            if (op1[1].day !== 0) {
              d.setDate(d.getDate() + op1[1].sign * op1[1].day);
            }
            if (op1[1].hour !== 0) {
              d.setHours(d.getHours() + op1[1].sign * op1[1].hour);
            }
            if (op1[1].minute !== 0) {
              d.setMinutes(d.getMinutes() + op1[1].sign * op1[1].minute);
            }
            if (op1[1].second !== 0) {
              d.setSeconds(d.getSeconds() + op1[1].sign * op1[1].second);
            }
          }
          a1.data = restype === 6 ? Fleur.dateToDate({d: d, tz: op2[1].tz}) : restype === 7 ? Fleur.dateToDateTime({d: d, tz: op2[1].tz}) : Fleur.dateToTime({d: d, tz: op2[1].tz});
        } else if (op1[0] === 9 && op2[0] === 9) {
          resvalue = op1[1].sign * (op1[1].year * 12 + op1[1].month) + op2[1].sign * (op2[1].year * 12 + op2[1].month);
          res = {
            sign: resvalue < 0 ? -1 : 1,
            year: Math.floor(Math.abs(resvalue) / 12),
            month: Math.abs(resvalue) % 12};
          a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0 || res.year === 0 ? String(res.month) + "M" : "");
        } else if (op1[0] === 10 && op2[0] === 10) {
          resvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) + op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
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
        var casterr = n1.nodeType === Fleur.Node.ELEMENT_NODE || n2.nodeType === Fleur.Node.ELEMENT_NODE;
        a1 = new Fleur.Text();
        a1.schemaTypeInfo = Fleur.Type_error;
        a1._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", casterr ? "err:FORG0001" : "err:XPTY0004");
      }
      Fleur.callback(function() {callback(a1);});
    });
  });
};
*/