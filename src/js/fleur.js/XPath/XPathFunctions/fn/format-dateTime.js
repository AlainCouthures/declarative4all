"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_format$_dateTime_2 = function() {
  return this.emptySequence().emptySequence().emptySequence().fn_format$_dateTime_5(false, false);
};
Fleur.Context.prototype.fn_format$_dateTime_5 = function(nodate, notime) {
  //const place = this.item.data;
  //const calendar =
  this.itemstack.pop();
  const language = this.itemstack.pop().data || Fleur.defaultLanguage;
  const picture = this.itemstack.pop().data;
  const valueitem = this.itemstack.pop();
  const value = valueitem.data;
  let s = "";
  let i = 0, l = picture.length;
  let format = "";
  let pdate = false;
  let ptime = false;
  let valueDate = notime ? Fleur.toDate(value) : nodate ? Fleur.toTime(value) : Fleur.toDateTime(value);
  while (i < l) {
    var c = picture.charAt(i);
    var prec = "";
    while (c !== "[" && i < l) {
      if (c !== "]") {
        s += c;
      } else if (prec === c) {
        s += c;
        c = "";
      }
      prec = c;
      c = picture.charAt(++i);
    }
    if (c === "[") {
      c = picture.charAt(++i);
      if (c === "[") {
        s += c;
        i++;
      } else {
        format = "";
        while (c !== "]" && i < l) {
          format += c;
          c = picture.charAt(++i);
        }
        if (c === "]") {
          var intvalue = null, stringvalue = null;
          switch(format.charAt(0)) {
            case "Y":
              pdate = true;
              if (format.charAt(1).toLowerCase() === "i") {
                stringvalue = Fleur.convertToRoman(parseInt(value.substr(0, 4), 10));
                if (format.charAt(1) === "i") {
                  stringvalue = stringvalue.toLowerCase();
                }
              } else {
                intvalue = parseInt(value.substr(0, 4), 10);
              }
              break;
            case "M":
              pdate = true;
              if (format.charAt(1).toLowerCase() === "i") {
                stringvalue = Fleur.convertToRoman(parseInt(value.substr(5, 2), 10));
                if (format.charAt(1) === "i") {
                  stringvalue = stringvalue.toLowerCase();
                }
              } else if (format.charAt(1).toLowerCase() === "n") {
                stringvalue = Fleur.getMonthName(language, valueDate.d);
                if (format.charAt(1) === "N") {
                  if (format.charAt(2) === "n") {
                    stringvalue = stringvalue.charAt(0).toUpperCase() + stringvalue.substr(1).toLowerCase();
                  } else {
                    stringvalue = stringvalue.toUpperCase();
                  }
                } else {
                  stringvalue = stringvalue.toLowerCase();
                }
              } else {
                intvalue = parseInt(value.substr(5, 2), 10);
              }
              break;
            case "D":
              pdate = true;
              intvalue = parseInt(value.substr(8, 2), 10);
              break;
            case "d":
              break;
            case "F":
              pdate = true;
              stringvalue = Fleur.getDayName(language, valueDate.d);
              if (format.charAt(1) === "N") {
                if (format.charAt(2) === "n") {
                  stringvalue = stringvalue.charAt(0).toUpperCase() + stringvalue.substr(1).toLowerCase();
                } else {
                  stringvalue = stringvalue.toUpperCase();
                }
              } else {
                stringvalue = stringvalue.toLowerCase();
              }
              break;
            case "W":
              break;
            case "w":
              break;
            case "H":
              break;
            case "h":
              ptime = true;
              intvalue = parseInt(value.substr(nodate ? 0 : 11, 2), 10);
              break;
            case "P":
              break;
            case "m":
              ptime = true;
              intvalue = parseInt(value.substr(nodate ? 3 : 14, 2), 10);
              break;
            case "s":
              ptime = true;
              intvalue = parseInt(value.substr(nodate ? 6 : 17, 2), 10);
              break;
            case "f":
              break;
            case "Z":
              break;
            case "z":
              break;
            case "C":
              break;
            case "E":
              break;
          }
          if ((ptime && notime) || (pdate && nodate)) {
            Fleur.XQueryError_xqt("FOFD1350", null, "Wrong argument type for fn:format-dateTime#5", "", valueitem);
          }
          if (intvalue !== null || stringvalue !== null) {
            format = format.split(',');
            var maxw, minw;
            if (format[1]) {
              var ws = format[1].split('-');
              minw = ws[0] === "*" ? 1 : parseInt(ws[0], 10);
              maxw = !ws[1] || ws[1] === "*" ? Infinity : parseInt(ws[1], 10);
            } else {
              minw = Math.max(format[0].length - 1, 1);
              maxw = Infinity;
            }
            if (intvalue !== null) {
              stringvalue = String(intvalue);
            }
            stringvalue = "0".repeat(Math.max(minw - stringvalue.length, 0)) + stringvalue;
            if (stringvalue.length > maxw) {
              if (format[0].charAt(0) === 'Y') {
                stringvalue = stringvalue.substring(stringvalue.length - maxw);
              }
            }
          }
          if (stringvalue !== null) {
            s += stringvalue;
          }
          i++;
        }
      }
    }
  }
  this.item = new Fleur.Text();
  this.item.schemaTypeInfo = Fleur.Type_string;
  this.item.data = s;
  return this;
};

Fleur.XPathFunctions_fn["format-dateTime#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-dateTime", Fleur.Context.prototype.fn_format$_dateTime_2,
  [Fleur.SequenceType_dateTime_01, Fleur.SequenceType_string_1], Fleur.SequenceType_string_01);

Fleur.XPathFunctions_fn["format-dateTime#5"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-dateTime", Fleur.Context.prototype.fn_format$_dateTime_5,
[Fleur.SequenceType_dateTime_01, Fleur.SequenceType_string_1, Fleur.SequenceType_string_01, Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_string_01);
/*
  function(value, picture, ctx) {
    return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, null, null, null, ctx, false, false);
  },
  null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});
*/
/*
  function(value, picture, language, calendar, place, ctx, notime, nodate) {
    var s = "";
    var i = 0, l = picture.length;
    var format = "";
    var pdate = false;
    var ptime = false;
    var valueDate = notime ? Fleur.toDate(value) : nodate ? Fleur.toTime(value) : Fleur.toDateTime(value);
    language = language || Fleur.defaultLanguage;
    while (i < l) {
      var c = picture.charAt(i);
      var prec = "";
      while (c !== "[" && i < l) {
        if (c !== "]") {
          s += c;
        } else if (prec === c) {
          s += c;
          c = "";
        }
        prec = c;
        c = picture.charAt(++i);
      }
      if (c === "[") {
        c = picture.charAt(++i);
        if (c === "[") {
          s += c;
          i++;
        } else {
          format = "";
          while (c !== "]" && i < l) {
            format += c;
            c = picture.charAt(++i);
          }
          if (c === "]") {
            var intvalue = null, stringvalue = null;
            switch(format.charAt(0)) {
              case "Y":
                pdate = true;
                if (format.charAt(1).toLowerCase() === "i") {
                  stringvalue = Fleur.convertToRoman(parseInt(value.substr(0, 4), 10));
                  if (format.charAt(1) === "i") {
                    stringvalue = stringvalue.toLowerCase();
                  }
                } else {
                  intvalue = parseInt(value.substr(0, 4), 10);
                }
                break;
              case "M":
                pdate = true;
                if (format.charAt(1).toLowerCase() === "i") {
                  stringvalue = Fleur.convertToRoman(parseInt(value.substr(5, 2), 10));
                  if (format.charAt(1) === "i") {
                    stringvalue = stringvalue.toLowerCase();
                  }
                } else if (format.charAt(1).toLowerCase() === "n") {
                  stringvalue = Fleur.getMonthName(language, valueDate.d);
                  if (format.charAt(1) === "N") {
                    if (format.charAt(2) === "n") {
                      stringvalue = stringvalue.charAt(0).toUpperCase() + stringvalue.substr(1).toLowerCase();
                    } else {
                      stringvalue = stringvalue.toUpperCase();
                    }
                  } else {
                    stringvalue = stringvalue.toLowerCase();
                  }
                } else {
                  intvalue = parseInt(value.substr(5, 2), 10);
                }
                break;
              case "D":
                pdate = true;
                intvalue = parseInt(value.substr(8, 2), 10);
                break;
              case "d":
                break;
              case "F":
                pdate = true;
                stringvalue = Fleur.getDayName(language, valueDate.d);
                if (format.charAt(1) === "N") {
                  if (format.charAt(2) === "n") {
                    stringvalue = stringvalue.charAt(0).toUpperCase() + stringvalue.substr(1).toLowerCase();
                  } else {
                    stringvalue = stringvalue.toUpperCase();
                  }
                } else {
                  stringvalue = stringvalue.toLowerCase();
                }
                break;
              case "W":
                break;
              case "w":
                break;
              case "H":
                break;
              case "h":
                ptime = true;
                intvalue = parseInt(value.substr(nodate ? 0 : 11, 2), 10);
                break;
              case "P":
                break;
              case "m":
                ptime = true;
                intvalue = parseInt(value.substr(nodate ? 3 : 14, 2), 10);
                break;
              case "s":
                ptime = true;
                intvalue = parseInt(value.substr(nodate ? 6 : 17, 2), 10);
                break;
              case "f":
                break;
              case "Z":
                break;
              case "z":
                break;
              case "C":
                break;
              case "E":
                break;
            }
            if ((ptime && notime) || (pdate && nodate)) {
              return Fleur.error(ctx, "FOFD1350");
            }
            if (intvalue !== null || stringvalue !== null) {
              format = format.split(',');
              var maxw, minw;
              if (format[1]) {
                var ws = format[1].split('-');
                minw = ws[0] === "*" ? 1 : parseInt(ws[0], 10);
                maxw = !ws[1] || ws[1] === "*" ? Infinity : parseInt(ws[1], 10);
              } else {
                minw = Math.max(format[0].length - 1, 1);
                maxw = Infinity;
              }
              if (intvalue !== null) {
                stringvalue = String(intvalue);
              }
              stringvalue = "0".repeat(Math.max(minw - stringvalue.length, 0)) + stringvalue;
              if (stringvalue.length > maxw) {
                if (format[0].charAt(0) === 'Y') {
                  stringvalue = stringvalue.substr(stringvalue.length - maxw);
                }
              }
            }
            if (stringvalue !== null) {
              s += stringvalue;
            }
            i++;
          }
        }
      }
    }
    return s;
  },
  null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], true, false, {type: Fleur.Type_string, occurence: "?"});
*/