"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryParser = function() {};
Fleur.XQueryParser._precedence = {
  "/": 0,
  "//": 0,
  ":": 0,
  "as": 0,
  "!": 1,
  "!!": 1,
  "~+": 2,
  "~-": 2,
  "cast as": 3,
  "castable as": 4,
  "treat as": 5,
  "instance of": 6,
  "intersect": 7,
  "except": 7,
  "|": 8,
  "union": 8,
  "div": 9,
  "mod": 9,
  "*": 9,
  "idiv": 9,
  "+": 10,
  "-": 10,
  "to": 11,
  "||": 12,
  "eq": 13,
  "ne": 13,
  "lt": 13,
  "le": 13,
  "gt": 13,
  "ge": 13,
  "<": 13,
  ">": 13,
  "<=": 13,
  ">=": 13,
  "is": 13,
  "<<": 13,
  ">>": 13,
  "=": 13,
  "!=": 13,
  "and": 14,
  "or": 15,
  "allowing": 16,
  "at": 17,
  ":=": 18,
  "in": 18,
  "after": 19,
  "before": 19,
  "into": 19,
  "with": 19,
  "value": 19,
  "node": 20,
  "nodes": 20,
  "~~ascending": 28,
  "~~descending": 28,
  "empty": 28,
  "~,": 29,
  "for": 30,
  "let": 30,
  "group by": 30,
  "order by": 30,
  "stable order by": 30,
  "count": 30,
  "where": 30,
  "some": 30,
  "every": 30,
  "then": 31,
  "catch": 31,
  "else": 32,
  "return": 32,
  "satisfies": 32,
  ",": 50,
  ";": 51
};
Fleur.XQueryParser._rightgrouping1 = Fleur.XQueryParser._precedence.then;
Fleur.XQueryParser._rightgrouping2 = Fleur.XQueryParser._precedence.return;
Fleur.XQueryParser._opcodes = {
  "/": "stepExpr",
  "|": "unionOp",
  "union": "unionOp",
  "div": "divOp",
  "mod": "modOp",
  "*": "multiplyOp",
  "idiv": "idivOp",
  "+": "addOp",
  "-": "subtractOp",
  "to": "toOp",
  "||": "stringConcatenateOp",
  "eq": "eqOp",
  "ne": "neOp",
  "lt": "ltOp",
  "le": "leOp",
  "gt": "gtOp",
  "ge": "geOp",
  "<": "lessThanOp",
  ">": "greaterThanOp",
  "<=": "lessThanOrEqualOp",
  ">=": "greaterThanOrEqualOp",
  "is": "isOp",
  "<<": "nodeBeforeOp",
  ">>": "nodeAfterOp",
  "=": "equalOp",
  "!=": "notEqualOp",
  "and": "andOp",
  "or": "orOp",
  ",": "argExpr"
};
Fleur.XQueryParser._skipComment = function(s, offset) {
  let i = offset;
  let c = s.charAt(i);
  let d = s.charAt(i + 1);
  const l = s.length;
  do {
    if (c === "(" && d === ":") {
      i = Fleur.XQueryParser._skipComment(s, i + 2);
    } else if (c === ":" && d === ")") {
      return i + 1;
    }
    c = s.charAt(++i);
    d = s.charAt(i + 1);
  } while (i < l);
};
Fleur.XQueryParser._skipSpaces = function(s, offset) {
  let i = offset;
  let c = s.charAt(i);
  const l = s.length;
  do {
    if (c === "(" && s.charAt(i + 1) === ":") {
      i = Fleur.XQueryParser._skipComment(s, i + 2);
    } else if (c !== "\n" && c !== "\r" && c !== "\t" && c !== " ") {
      return i;
    }
    c = s.charAt(++i);
  } while (i < l);
  return i;
};
Fleur.XQueryParser._getName = function(s) {
  let i = 0;
  let o = s.charAt(0);
  let prev = "";
  let hasPrefix = false;
  let hasAxis = false;
  while (o !== "" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:*{".indexOf(o) !== -1) {
    if (o === "*") {
      if (prev !== "" && (prev === o || prev !== ":")) {
        break;
      }
      if (hasPrefix) {
        i++;
        break;
      }
    }
    if (o === "{") {
      if (prev !== "Q") {
        return s.substr(0, i);
      }
      while (o !== "" && o !== "}") {
        o = s.charAt(++i);
      }
    }
    if (o === ":") {
      if (s.charAt(i + 1) === ":") {
        if (hasAxis || hasPrefix) {
          break;
        }
        hasAxis = true;
        i++;
      } else {
        if (hasPrefix) {
          break;
        }
        hasPrefix = true;
      }
    }
    prev = o;
    o = s.charAt(++i);
  }
  if (o === "#") {
    o = s.charAt(++i);
    while (o !== "" && "0123456789".indexOf(o) !== -1) {
      o = s.charAt(++i);
    }
  }
  return s.substr(0, i);
};
Fleur.XQueryParser._getNameStep = function(s, attr, begin) {
  const n = Fleur.XQueryParser._getName(s);
  const fctind = n.indexOf("#");
  if (fctind !== -1) {
    const pindex = n.indexOf(":");
    if (pindex === -1) {
      return [Fleur.XQueryX.namedFunctionRef,[
        [Fleur.XQueryX.functionName,[n.substr(0, fctind)]],
        [Fleur.XQueryX.integerConstantExpr,[
          [Fleur.XQueryX.value,[n.substr(fctind + 1)]]
        ]]
      ], begin, n.length, 0];
    }
    return [Fleur.XQueryX.namedFunctionRef,[
      [Fleur.XQueryX.functionName,[n.substr(0, fctind).substr(pindex + 1),[Fleur.XQueryX.prefix,[n.substr(0, pindex)]]]],
      [Fleur.XQueryX.integerConstantExpr,[
        [Fleur.XQueryX.value,[n.substr(fctind + 1)]]
      ]]
    ], begin, n.length, 0];
  }
  const aind = n.indexOf("::");
  const axis = aind !== -1 ? n.substr(0, aind) : attr ? "attribute" : "child";
  const n2 = aind !== -1 ? n.substr(aind + 2) : n;
  const eq = n2.substr(0, 2) === "Q{";
  const sind = eq ? n2.indexOf("}") : n2.indexOf(":");
  const n3 = sind !== -1 ? n2.substr(sind + 1) : n2;
  const nsp = eq ? n2.substr(2, sind - 2) : sind !== -1 ? n2.substr(0, sind) : "";
  let nametest;
  if (n3 === "*" || nsp === "*") {
    nametest = [Fleur.XQueryX.Wildcard, []];
    if (nsp !== "") {
      let wtest;
      if (n3 !== "*" && nsp === "*") {
        wtest = [[Fleur.XQueryX.star,[]]];
        wtest.push([Fleur.XQueryX.NCName,[n3]]);
      } else {
        wtest = [[eq ? Fleur.XQueryX.uri : Fleur.XQueryX.NCName,[nsp]]];
        wtest.push([Fleur.XQueryX.star,[]]);
      }
      nametest[1] = wtest;
    }
  } else {
    let ntest = [n3];
    if (eq || sind !== -1) {
      ntest.push([eq ? Fleur.XQueryX.URI : Fleur.XQueryX.prefix, [nsp]]);
    }
    nametest = [Fleur.XQueryX.nameTest,ntest];
  }
  return [Fleur.XQueryX.pathExpr,[
    [Fleur.XQueryX.stepExpr,[
      [Fleur.XQueryX.xpathAxis,[axis]],
      nametest
    ]]
  ], begin, n.length + attr, 0];
};
Fleur.XQueryParser._pathExprFormat = function(prod) {
  if (prod[0] === Fleur.XQueryX.pathExpr) {
    return prod[1];
  }
  return [[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[prod]]]]];
};
Fleur.XQueryParser._calc = function(args, ops, opprec) {
  //console.log("_calc: ops = " + ops + " opprec = " + opprec) ;
  const curprec = ops.length !== 0 ? ops[ops.length - 1][0] : 0;
  if ((ops.length === 0 || curprec > opprec || opprec === 31) || (curprec >= opprec && (curprec === Fleur.XQueryParser._rightgrouping1 || curprec === Fleur.XQueryParser._rightgrouping2))) {
    return [args, ops];
  }
  const op = ops[ops.length - 1][1];
  ops.pop();
  const prevop = ops.length !== 0 ? ops[ops.length - 1][1] : "";
  let arg2 = args[args.length - 1];
  let arg1;
  if (op.startsWith("~~")) {
    arg1 = arg2;
  } else {
    args.pop();
    arg1 = args[args.length - 1];
  }
  args.pop();
  var arg;
  var occ;
  //console.log("_calc: op = " + op);
  switch (op) {
    case ";":
        if (arg1[0] === Fleur.XQueryX.sequenceExpr && arg1[1][0] === Fleur.XQueryX.multidimExpr) {
          arg1[1].push(arg2);
          arg = arg1;
        } else {
          arg = [Fleur.XQueryX.sequenceExpr,[[Fleur.XQueryX.multidimExpr,[arg1, arg2]]]];
        }
      break;
    case ",":
      if (prevop === "(") {
        if (arg1[0] === Fleur.XQueryX.arguments) {
          arg1[1].push(arg2);
          arg = arg1;
        } else {
          arg = [Fleur.XQueryX.arguments,[arg1, arg2]];
        }
      } else if (prevop === "q") {
        //arg = arg1 + "," + arg2;
      } else { // if (ops.startsWith("4.50.,")) {
        if (arg1[0] === Fleur.XQueryX.mapConstructorEntry) {
//          arg = arg1val + "," + arg2val;
        } else if (arg1[0] === Fleur.XQueryX.sequenceExpr && arg1[1].length !== 0) {
          arg1[1].push(arg2);
          arg = arg1;
        } else {
          arg = [Fleur.XQueryX.sequenceExpr,[arg1, arg2]];
        }
//      } else {
//        arg = arg1val + "," + arg2val;
      }
      break;
    case "~,":
      if (arg1[0] === Fleur.XQueryX.letClauseItem || arg1[0] === Fleur.XQueryX.groupBySpec) {
//        arg = arg1val + "," + arg2val;
      } else if (arg1[0] === Fleur.XQueryX.letClause) {
        if (arg2[0] === Fleur.XQueryX.letClause) {
          arg1[1].push(arg2[1][0]);
          arg = arg1;
        } else {
          arg1[1].push(arg2);
          arg = arg1;
        }
      } else {
        if (arg1[0] !== Fleur.XQueryX.orderBySpec) {
          arg = [Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[arg1]]]];
        } else {
          arg = arg1val;
        }
//        arg += ",";
        if (arg2[0] !== Fleur.XQueryX.orderBySpec) {
//          arg += "[Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[" + arg2val + "]]]]";
        } else {
//          arg += arg2val;
        }
      }
      break;
    case "//":
      arg = [Fleur.XQueryX.pathExpr,Fleur.XQueryParser._pathExprFormat(arg1)];
      arg[1].push([Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['descendant-or-self']],[Fleur.XQueryX.anyKindTest,[]]]]);
      arg[1].push(Fleur.XQueryParser._pathExprFormat(arg2)[0]);
      break;
    case "/":
      arg = [Fleur.XQueryX.pathExpr,Fleur.XQueryParser._pathExprFormat(arg1)];
      if (arg2.length !== 0) {
        arg[1].push(Fleur.XQueryParser._pathExprFormat(arg2)[0]);
      }
      break;
    case "!!":
      arg = [Fleur.XQueryX.doubleMapExpr,[[Fleur.XQueryX.pathExpr,Fleur.XQueryParser._pathExprFormat(arg1)],[Fleur.XQueryX.pathExpr,Fleur.XQueryParser._pathExprFormat(arg2)]]];
      break;
    case "!":
      arg = [Fleur.XQueryX.simpleMapExpr,[[Fleur.XQueryX.pathExpr,Fleur.XQueryParser._pathExprFormat(arg1)],[Fleur.XQueryX.pathExpr,Fleur.XQueryParser._pathExprFormat(arg2)]]];
      break;
    case "|":
      if (ops.length > 1 && ops[0][1] === "|" && ops[1][1] === "catch") {
        if (arg1[0] === Fleur.XQueryX.pathExpr) {
          arg1 = arg1[1][0][1];
        }
        if (arg2[0] === Fleur.XQueryX.pathExpr) {
          arg2 = arg2[1][0][1];
          arg = [arg1,arg2];
        } else {
          arg = [Fleur.XQueryX.catchErrorList,[arg1,arg2]];
        }
      } else {
        arg = [Fleur.XQueryX.unionOp,[[Fleur.XQueryX.firstOperand,[arg1]],[Fleur.XQueryX.secondOperand,[arg2]]]];
      }
      break;
    case ":":
      arg = [Fleur.XQueryX.mapConstructorEntry,[[Fleur.XQueryX.mapKeyExpr,[arg1]],[Fleur.XQueryX.mapValueExpr,[arg2]]]];
      break;
    case "?":
      break;
    case "to":
      arg = [Fleur.XQueryX.rangeSequenceExpr,[[Fleur.XQueryX.startExpr,[arg1]],[Fleur.XQueryX.endExpr,[arg2]]]];
      break;
    case "~-":
      arg = [Fleur.XQueryX.unaryMinusOp,[[Fleur.XQueryX.operand,[arg2]]]];
      break;
    case "~+":
      arg = [Fleur.XQueryX.unaryPlusOp,[[Fleur.XQueryX.operand,[arg2]]]];
      break;
    case "allowing":
      arg = [[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[arg1[1][0]]]]],[Fleur.XQueryX.allowingEmpty,[]]];
      break;
    case "at":
      if (arg[0] === Fleur.XQueryX.typedVariableBinding) {
        arg = [arg1,[Fleur.XQueryX.positionalVariableBinding,[arg2[1][0][1]]]];
      } else {
        arg = [[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[arg1[1][0]]]]],[Fleur.XQueryX.positionalVariableBinding,[arg2[1][0]]]];
      }
      break;
    case "in":
      if (ops[0] === "q") {
        arg = [Fleur.XQueryX.quantifiedExprInClause,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[arg1[1][0]]]]],[Fleur.XQueryX.sourceExpr,[arg2]]]];
      } else if (arg1[0] === Fleur.XQueryX.typedVariableBinding) {
        arg = [Fleur.XQueryX.forClause,[[Fleur.XQueryX.forClauseItem,[arg1val,[Fleur.XQueryX.forExpr,[arg2val]]]]]];
      } else {
        arg = [Fleur.XQueryX.forClause,[[Fleur.XQueryX.forClauseItem,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[arg1[1][0]]]]],[Fleur.XQueryX.forExpr,[arg2]]]]]];
      }
      break;
    case "as":
      if (arg2[0] === Fleur.XQueryX.pathExpr &&
        arg2[1][0][0] === Fleur.XQueryX.stepExpr && arg2[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg2[1][0][1][0][1][0] === "child" &&
        arg2[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg2[1][0][1][1][1][0] === "last") {
        arg = [Fleur.XQueryX.sourceExprUf,[arg1]],[Fleur.XQueryX.insertInto,[[Fleur.XQueryX.insertAsLast,[]]]];
      } else if (arg2[0] === Fleur.XQueryX.pathExpr &&
        arg2[1][0][0] === Fleur.XQueryX.stepExpr && arg2[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg2[1][0][1][0][1][0] === "child" &&
        arg2[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg2[1][0][1][1][1][0] === "first") {
        arg = [Fleur.XQueryX.sourceExprUf,[arg1]],[Fleur.XQueryX.insertInto,[[Fleur.XQueryX.insertAsFirst,[]]]];
      } else {
        arg2 = [Fleur.XQueryX.atomicType,arg2[1][0][1][1][1][0][1]];
        arg = [Fleur.XQueryX.varName,[arg1[1][0]]],[Fleur.XQueryX.typeDeclaration,[arg2]];
      }
      break;
    case ":=":
      if ((ops.length > 1 && ops[1][1] === "group by") || (ops.length > 2 && ops[1][1] === "~," && ops[2][1] === "group by")) {
        if (arg1[0] === Fleur.XQueryX.groupingSpec) {
          arg1[1].push([Fleur.XQueryX.groupVarInitialize,[[Fleur.XQueryX.varValue,[arg2]]]]);
          arg = arg1;
        } else {
          arg = [Fleur.XQueryX.groupingSpec,[[Fleur.XQueryX.varName,[arg1]],[Fleur.XQueryX.groupVarInitialize,[[Fleur.XQueryX.varValue,[arg2]]]]]];
        }
      } else if (arg1[0] === Fleur.XQueryX.varName) {
        arg = [Fleur.XQueryX.letClause,[[Fleur.XQueryX.letClauseItem,[[Fleur.XQueryX.typedVariableBinding,[arg1]],[Fleur.XQueryX.letExpr,[arg2]]]]]];
      } else {
        arg = [Fleur.XQueryX.letClause,[[Fleur.XQueryX.letClauseItem,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[arg1[1][0]]]]],[Fleur.XQueryX.letExpr,[arg2]]]]]];
      }
      break;
    case "return":
      arg1[1].push([Fleur.XQueryX.returnClause,[arg2]]);
      arg = arg1;
      break;
    case "satisfies":
      arg1[1].push([Fleur.XQueryX.predicateExpr,[arg2]]);
      arg = arg1;
      break;
    case "cast as":
    case "cast as?":
      occ = op.charAt(7);
      arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
      arg2 = [Fleur.XQueryX.atomicType,arg2[1][0]];
      if (occ === "?") {
        arg2.push([Fleur.XQueryX.optional,[]]);
      }
      arg = [Fleur.XQueryX.castExpr,[[Fleur.XQueryX.argExpr,[arg1]],[Fleur.XQueryX.singleType,arg2]]];
      break;
    case "castable as":
    case "castable as?":
      occ = op.charAt(11);
      arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
      arg2 = [Fleur.XQueryX.atomicType,arg2[1][0]];
      arg2 = [arg2];
      if (occ === "?") {
        arg2.push([Fleur.XQueryX.optional,[]]);
      }
      arg = [Fleur.XQueryX.castableExpr,[[Fleur.XQueryX.argExpr,[arg1]],[Fleur.XQueryX.singleType,arg2]]];
      break;
    case "treat as":
    case "treat as+":
    case "treat as?":
    case "treat as*":
      occ = op.charAt(8);
      if (arg2val.indexOf("[Fleur.XQueryX.nameTest,") !== -1) {
        arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
        arg2 = [Fleur.XQueryX.atomicType,arg2[1][0]];
      } else if (arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") !== -1) {
        arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") + 86);
        arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
      } else {
        arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['attribute']],") + 90);
        arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
      }
      arg2 = [arg2];
      if (occ !== "") {
        arg2.push([Fleur.XQueryX.occurrenceIndicator,[occ]]);
      }
      arg = [Fleur.XQueryX.treatExpr,[[Fleur.XQueryX.argExpr,[arg]],[Fleur.XQueryX.sequenceType,arg2]]];
      break;
    case "instance of":
    case "instance of+":
    case "instance of?":
    case "instance of*":
      occ = op.charAt(11);
      if (arg2val.indexOf("[Fleur.XQueryX.nameTest,") !== -1) {
        arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
        arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
      } else if (arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") !== -1) {
        arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") + 86);
        arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
      } else {
        arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['attribute']],") + 90);
        arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
      }
      arg2 = [arg2];
      if (occ !== "") {
        arg2.push([Fleur.XQueryX.occurrenceIndicator,[occ]]);
      }
      arg = [Fleur.XQueryX.instanceOfExpr,[[Fleur.XQueryX.argExpr,[arg1]],[Fleur.XQueryX.sequenceType,arg2]]];
      break;
    case "then":
      if (arg1[0] === Fleur.XQueryX.functionCallExpr && arg1[1][0][0] === Fleur.XQueryX.functionName && arg1[1][0][1][0] === 'if') {
        arg = [Fleur.XQueryX.ifThenElseExpr,[[Fleur.XQueryX.ifClause,[arg1[1][1][1][0]]],[Fleur.XQueryX.thenClause,[arg2]]]];
      }
      opprec = -1;
      break;
    case "else":
      if (arg1[0] === Fleur.XQueryX.ifThenElseExpr) {
        arg1[0].push([Fleur.XQueryX.elseClause,[arg2]]);
        arg = arg1;
      }
      break;
    case "catch":
      if (arg1[0] === Fleur.XQueryX.tryCatchExpr) {
        arg1[1].push([Fleur.XQueryX.catchClause,[arg2]]);
        arg = arg1;
      }
      break;
    case "let":
      arg = [Fleur.XQueryX.flworExpr,[arg1,arg2]];
      break;
    case "for":
      arg = [Fleur.XQueryX.flworExpr,[arg1,arg2]];
      break;
    case "group by":
      arg = [Fleur.XQueryX.flworExpr,[arg1,[Fleur.XQueryX.groupByClause,[arg2]]]];
      break;
    case "order by":
      if (arg2[0] === Fleur.XQueryX.orderBySpec) {
        arg = [Fleur.XQueryX.flworExpr,[arg1,[Fleur.XQueryX.orderByClause,[arg2]]]];
      } else {
        arg = [Fleur.XQueryX.flworExpr,[arg1,[Fleur.XQueryX.orderByClause,[[Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[arg2]]]]]]]];
      }
      break;
    case "~~ascending":
    case "~~descending":
      arg = [Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[arg1]],[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.orderingKind,[op.substr(2)]]]]]];
      break;
    case "empty":
      if (arg1[0] === Fleur.XQueryX.orderBySpec) {
        if (arg1val.endsWith(",[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.orderingKind,['ascending']]]]]]") || arg1val.endsWith(",[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.orderingKind,['descending']]]]]]")) {
          arg = arg1val.substr(0, arg1val.length - 4) + ",[Fleur.XQueryX.emptyOrderingMode,['empty " + arg2val.substr(112, arg2val.length - 119) + "']]]]]]";
        } else {
          arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.emptyOrderingMode,['empty " + arg2val.substr(112, arg2val.length - 119) + "']]]]]]";
        }
      } else {
        arg = [Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[arg1]],[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.emptyOrderingMode,["empty " + arg2val.substr(112, arg2val.length - 119)]]]]]];
      }
      break;
    case "where":
      arg = [Fleur.XQueryX.flworExpr,[arg1,[Fleur.XQueryX.whereClause,[arg2]]]];
      break;
    case "count":
      arg = [Fleur.XQueryX.flworExpr,[arg1,[Fleur.XQueryX.countClause,[arg2]]]];
      break;
    case "nodes":
      if (arg1[0] === Fleur.XQueryX.pathExpr &&
        arg1[1][0][0] === Fleur.XQueryX.stepExpr && arg1[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg1[1][0][1][0][1][0] === "child" &&
        arg1[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg1[1][0][1][1][1][0] === "delete") {
        arg = [Fleur.XQueryX.deleteExpr,[[Fleur.XQueryX.targetExpr,[arg2]]]];
      } else if (arg1[0] === Fleur.XQueryX.pathExpr &&
        arg1[1][0][0] === Fleur.XQueryX.stepExpr && arg1[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg1[1][0][1][0][1][0] === "child" &&
        arg1[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg1[1][0][1][1][1][0] === "insert") {
        arg = [Fleur.XQueryX.insertExpr,[arg2]];
      }
      break;
    case "node":
      if (arg1[0] === Fleur.XQueryX.pathExpr &&
        arg1[1][0][0] === Fleur.XQueryX.stepExpr && arg1[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg1[1][0][1][0][1][0] === "child" &&
        arg1[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg1[1][0][1][1][1][0] === "delete") {
        arg = [Fleur.XQueryX.deleteExpr,[[Fleur.XQueryX.targetExpr,[arg2]]]];
      } else if (arg1[0] === Fleur.XQueryX.pathExpr &&
        arg1[1][0][0] === Fleur.XQueryX.stepExpr && arg1[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg1[1][0][1][0][1][0] === "child" &&
        arg1[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg1[1][0][1][1][1][0] === "insert") {
        arg = [Fleur.XQueryX.insertExpr,[arg2]];
      } else if (arg1[0] === Fleur.XQueryX.pathExpr &&
        arg1[1][0][0] === Fleur.XQueryX.stepExpr && arg1[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg1[1][0][1][0][1][0] === "child" &&
        arg1[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg1[1][0][1][1][1][0] === "replace") {
        arg = [Fleur.XQueryX.replaceExpr,[arg2]];
      } else if (arg1[0] === Fleur.XQueryX.replaceValue && arg1[1].length === 0) {
        arg = [Fleur.XQueryX.replaceExpr,[[Fleur.XQueryX.replaceValue,[]],arg2]];
      }
      break;
    case "into":
      if (arg1[0] === Fleur.XQueryX.sourceExprUf) {
        arg1[1].push([Fleur.XQueryX.targetExpr,[arg2]]);
        arg = arg1;
      } else {
        arg = [Fleur.XQueryX.sourceExprUf,[arg1]],[Fleur.XQueryX.insertInto,[]],[Fleur.XQueryX.targetExpr,[arg2]];
      }
      break;
    case "after":
      arg = [Fleur.XQueryX.sourceExprUf,[arg1]],[Fleur.XQueryX.insertAfter,[]],[Fleur.XQueryX.targetExpr,[arg2]];
      break;
    case "before":
      arg = [Fleur.XQueryX.sourceExprUf,[arg1]],[Fleur.XQueryX.insertBefore,[]],[Fleur.XQueryX.targetExpr,[arg2]];
      break;
    case "value":
      if (arg1[0] === Fleur.XQueryX.pathExpr &&
        arg1[1][0][0] === Fleur.XQueryX.stepExpr && arg1[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg1[1][0][1][0][1][0] === "child" &&
        arg1[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg1[1][0][1][1][1][0] === "replace" &&
        arg2[0] === Fleur.XQueryX.pathExpr &&
        arg2[1][0][0] === Fleur.XQueryX.stepExpr && arg2[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && arg2[1][0][1][0][1][0] === "child" &&
        arg2[1][0][1][1][0] === Fleur.XQueryX.nameTest && arg2[1][0][1][1][1][0] === "of") {
        arg = [Fleur.XQueryX.replaceValue,[]];
      }
      break;
    case "with":
      arg = [Fleur.XQueryX.targetExpr,[arg1]],[Fleur.XQueryX.replacementExpr,[arg2]];
      break;
    default:
      arg = [Fleur.XQueryX[Fleur.XQueryParser._opcodes[op]],[[Fleur.XQueryX.firstOperand,[arg1]],[Fleur.XQueryX.secondOperand,[arg2]]]];
  }
  args.push(arg);
  return Fleur.XQueryParser._calc(args, ops, opprec);
};
Fleur.XQueryParser._testFormat = function(s, namecode) {
  var arg1, arg2, arg20, arg200;
  if (s === "") {
    return "";
  }
  if (s.indexOf(",[Fleur.XQueryX.pathExpr,[") !== -1) {
    arg1 = s.substr(0, s.indexOf(",[Fleur.XQueryX.pathExpr,["));
    arg20 = s.substr(s.indexOf(",[Fleur.XQueryX.pathExpr,[") + 1);
    arg200 = arg20.substr(arg20.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
    arg2 = "," + "[Fleur.XQueryX.typeName,[" + arg200.substr(0, arg200.length - 6) + "]]";
  } else {
    arg1 = s;
    arg2 = "";
  }
  var arg120 = arg1.indexOf("[Fleur.XQueryX.nameTest,['") !== -1 ? arg1.substr(arg1.indexOf("[Fleur.XQueryX.nameTest,['") + 25) : "[Fleur.XQueryX.star,[]]";
  var arg12 = "[" + namecode + ",[" + (arg120 === "[Fleur.XQueryX.star,[]]" ? arg120 : "[Fleur.XQueryX.QName,[" + arg120.substr(0, arg120.length - 6) + "]]") + "]]";
  return arg12 + arg2;
};
Fleur.XQueryParser._getNodeConstructor = function(s, begin) {
  var ii, text, texts, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrvalues, attrs, parents = [], locstack = [], currnodename = "", c, c0, c1, c2, braces,
    seps_pi = " \t\n\r?", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r", rseps = /^\s*$/gm,
    namespaces = {}, newnamespaces = {}, pindex, prefix, localName, r0 = null, r = null, nextsep = "";
  while (offset !== end) {
    text = "";
    texts = [];
    c1 = " ";
    c = s.charAt(offset);
    braces = 0;
    while ((c !== "<" || braces !== 0) && offset !== end) {
      c2 = s.charAt(offset + 1);
      if (c === "{" && c2 !== c) {
        if (braces === 0 && text !== "") {
          if (/\S/.test(text.replace("\\n", "\n").replace("\\r", "\r"))) {
            texts.push([0, text]);
          }
          text = "";
        }
        if (braces !== 0) {
          text += "{";
        }
        if (c1 === c) {
          braces--;
          if (braces === 0) {
            text = (texts.length > 0 ? texts.pop()[1] : "") + "{";
          }
        } else {
          braces++;
        }
      } else if (c === "}" && c2 !== c) {
        if (braces === 1 && text !== "") {
          texts.push([1, text]);
          text = "";
        }
        if (braces !== 1 && braces !== -1) {
          text += "}";
        }
        if (c1 === c) {
          braces++;
        } else {
          braces--;
        }
      } else if (c === "&") {
        c = s.charAt(++offset);
        entityname = "";
        while (c !== ";" && offset !== end) {
          entityname += c;
          c = s.charAt(++offset);
        }
        if (offset === end) {
          break;
        }
        if (entityname.charAt(0) === "#") {
          text += String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
        } else {
          text += Fleur.encchars[entityname];
        }
      } else if (braces === 0 && c === "\n") {
        text += "\\n";
      } else if (braces === 0 && c === "\r") {
        text += "\\r";
      } else {
        text += c;
        if (c2 === c && (c === "{" || c === "}")) {
          if (braces !== 0) {
            text += c;
          }
          offset++;
          c = " ";
        }
      }
      c1 = c;
      c = s.charAt(++offset);
    }
    if (/\S/.test(text.replace("\\n", "\n").replace("\\r", "\r")) && texts.length === 0) {
      locstack[locstack.length - 1].push([Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[text.replace(/'/gm,"\\'")]]]]);
    } else if (texts.length > 0) {
      if (/\S/.test(text.replace("\\n", "\n").replace("\\r", "\r"))) {
        texts.push([0, text]);
      }
      texts.forEach(function(t) {
        if (t[0] === 0) {
          locstack[locstack.length - 1].push([Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[t[1].replace(/'/gm,"\\'")]]]]);
        } else {
          locstack[locstack.length - 1].push(Fleur.XQueryParser._xp2js(t[1], [], [], begin));
        }
        nextsep = ",";
      });
    }
    if (offset === end) {
      break;
    }
    offset++;
    if (s.charAt(offset) === "!") {
      offset++;
      if (s.substr(offset, 2) === "--") {
        offset += 2;
        index = s.indexOf("-->", offset);
        if (index !== offset) {
          if (index === -1) {
            index = end;
          }
          text = "";
          ii = offset;
          while (ii < index) {
            text += s.charAt(ii++);
          }
          text = text.replace(/\x01/gm,"<");
          r0 = [Fleur.XQueryX.computedCommentConstructor,[[Fleur.XQueryX.argExpr,[[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[text ]]]]]]], begin, offset, 0];
          if (r === null) {
            return r0;
          }
          locstack[locstack.length - 1].push(r0);
          if (index === end) {
            break;
          }
          offset = index;
        }
        offset += 3;
      } else if (s.substr(offset, 7) === "[CDATA[") {
        offset += 7;
        index = s.indexOf("]]>", offset);
        if (index !== offset) {
          if (index === -1) {
            index = end;
          }
          text = "";
          ii = offset;
          while (ii < index) {
            text += s.charAt(ii++);
          }
          text = text.replace(/\x01/gm,"<");
          if (text !== "") {
            locstack[locstack.length - 1].push([Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[text]]]]);
          }
          if (index === end) {
            break;
          }
          offset = index;
        }
        offset += 3;
      }
    } else if (s.charAt(offset) === "?") {
      offset++;
      c = s.charAt(offset++);
      nodename = "";
      while (seps_pi.indexOf(c) === -1) {
        nodename += c;
        c = s.charAt(offset++);
      }
      index = s.indexOf("?>", offset - 1);
      if (index === -1) {
        index = end;
      }
      if (nodename.toLowerCase() === "xml") {
        Fleur.XQueryError_xqt("XPST0003", null, "Invalid processing instruction", "", new Fleur.Text("xml"));
      } else if (nodename !== "") {
        text = "";
        ii = offset;
        while (ii < index) {
          text += s.charAt(ii++);
        }
        text = text.replace(/\x01/gm,"<");
        r0 = [Fleur.XQueryX.computedPIConstructor,[[Fleur.XQueryX.piTarget,[nodename]],[Fleur.XQueryX.piValueExpr,[[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[text]]]]]]], begin, index + 2, 0];
        if (r === null) {
          return r0;
        }
        locstack[locstack.length - 1].push(r0);
      }
      if (index === end) {
        break;
      }
      offset = index + 2;
    } else if (s.charAt(offset) === "/") {
      offset++;
      c = s.charAt(offset++);
      nodename = "";
      while (seps_close.indexOf(c) === -1 && offset <= end) {
        nodename += c;
        c = s.charAt(offset++);
      }
      if (nodename === currnodename) {
        if (parents.length === 1) {
          return [r[0], r[1], begin, offset, 0];
        }
        locstack.pop();
        currnodename = parents.pop();
      } else {
        Fleur.XQueryError_xqt("XPST0003", null, "Unbalanced XML element", "", new Fleur.Text(nodename));
      }
      offset = s.indexOf(">", offset - 1) + 1;
      if (offset === 0) {
        break;
      }
    } else {
      c = s.charAt(offset++);
      nodename = "";
      while (seps_elt.indexOf(c) === -1 && offset <= end) {
        nodename += c;
        c = s.charAt(offset++);
      }
      index = s.indexOf(">", offset - 1);
      if (nodename !== "") {
        newnamespaces = {};
        for (prefix in namespaces) {
          if (namespaces.hasOwnProperty(prefix)) {
            newnamespaces[prefix] = namespaces[prefix];
          }
        }
        attrs = {};
        while (offset <= end) {
          while (seps.indexOf(c) !== -1 && offset <= end) {
            c = s.charAt(offset++);
          }
          if (c === "/" || c === ">" || offset === end) {
            break;
          }
          attrname = "";
          while (seps_attr.indexOf(c) === -1 && offset <= end) {
            attrname += c;
            c = s.charAt(offset++);
          }
          if (attrname === "") {
            Fleur.XQueryError_xqt("XPST0003", null, "Invalid character in XML attribut name", "", new Fleur.Text(c));
          }
          while (seps.indexOf(c) !== -1 && offset <= end) {
            c = s.charAt(offset++);
          }
          if (c === "=") {
            c = s.charAt(offset++);
            while (seps.indexOf(c) !== -1 && offset <= end) {
              c = s.charAt(offset++);
            }
            attrvalue = "";
            attrvalues = [];
            if (c === "'" || c === "\"") {
              c0 = c;
              c1 = c;
              c = s.charAt(offset++);
              c2 = s.charAt(offset);
              braces = 0;
              attrvalue = "";
              ii = offset;
              while ((c !== c0 || c2 === c0 || braces !== 0) && offset <= end) {
                if (c === "{") {
                  if (braces === 0 && attrvalue !== "") {
                    attrvalues.push([0, attrvalue]);
                    attrvalue = "";
                  }
                  if (c1 === c) {
                    braces--;
                    if (braces === 0) {
                      attrvalue = (attrvalues.length > 0 ? attrvalues.pop()[1] : "") + "{";
                    }
                  } else {
                    braces++;
                  }
                } else if (c === "}") {
                  if (braces === 1 && attrvalue !== "") {
                    attrvalues.push([1, attrvalue]);
                    attrvalue = "";
                  }
                  if (c1 === c) {
                    braces++;
                    if (braces === 0) {
                      attrvalue += "}";
                    }
                  } else {
                    braces--;
                  }
                } else if (c === c2 && c === c0) {
                  attrvalue += c;
                  c1 = c;
                  c = s.charAt(++offset);
                  c2 = s.charAt(++offset);
                  continue;
                } else {
                  attrvalue += c;
                }
                c1 = c;
                c = c2;
                c2 = s.charAt(++offset);
              }
              if (attrvalue !== "") {
                attrvalues.push([0, attrvalue]);
              }
              c = c2;
              offset++;
            } else {
              while (seps_elt.indexOf(c) === -1 && offset <= end) {
                attrvalue += c;
                c = s.charAt(offset++);
              }
              attrvalues = [[0, attrvalue]];
            }
          } else {
            attrvalues = [[0, attrname]];
          }
          pindex = attrname.indexOf(":");
          prefix = pindex !== -1 ? attrname.substr(0, pindex) : " ";
          localName = pindex !== -1 ? attrname.substr(pindex + 1) : attrname;
          if (!attrs[prefix]) {
            attrs[prefix] = {};
          }
          attrs[prefix][localName] = attrvalues;
          if (prefix === "xmlns") {
            newnamespaces[localName] = attrvalues;
          } else if (prefix === " " && localName === "xmlns") {
            newnamespaces[" "] = attrvalues;
          }
        }
        pindex = nodename.indexOf(":");
        if (pindex === -1) {
          r0 = [Fleur.XQueryX.elementConstructor,[[Fleur.XQueryX.tagName,[nodename]]]];
        } else {
          r0 = [Fleur.XQueryX.elementConstructor,[[Fleur.XQueryX.tagName,[nodename.substr(pindex + 1),[Fleur.XQueryX.prefix,[nodename.substr(0, pindex)]]]]]];
        }
        if (Object.keys(attrs).length) {
          const attrprod = [Fleur.XQueryX.attributeList,[]];
          if (attrs[" "] && attrs[" "].xmlns) {
            attrprod[1].push([Fleur.XQueryX.namespaceDeclaration,[[Fleur.XQueryX.uri,[(attrs[" "].xmlns.length !== 0 ? attrs[" "].xmlns[0][1] : "")]]]]);
            delete attrs[" "].xmlns;
          }
          for (attrname in attrs.xmlns) {
            if (attrs.xmlns.hasOwnProperty(attrname)) {
              attrprod[1].push([Fleur.XQueryX.namespaceDeclaration,[[Fleur.XQueryX.prefixElt,[attrname]],[Fleur.XQueryX.uri,[attrs.xmlns[attrname][0][1]]]]]);
            }
          }
          delete attrs.xmlns;
          for (prefix in attrs) {
            if (attrs.hasOwnProperty(prefix)) {
              for (attrname in attrs[prefix]) {
                if (attrs[prefix].hasOwnProperty(attrname)) {
                  const aconsprod = [Fleur.XQueryX.attributeConstructor,[[Fleur.XQueryX.attributeName,[attrname]]]];
                  if (prefix !== " ") {
                    aconsprod[1][0][1].push([Fleur.XQueryX.prefix,[prefix]]);
                  }
                  if (attrs[prefix][attrname].length === 0) {
                    aconsprod[1].push([Fleur.XQueryX.attributeValue,[]]);
                  } else if (attrs[prefix][attrname].length === 1 && attrs[prefix][attrname][0][0] === 0) {
                    aconsprod[1].push([Fleur.XQueryX.attributeValue,[Fleur.DocumentType.resolveEntities(null, attrs[prefix][attrname][0][1]).replace(/'/gm,"\\'").replace(/\x01/gm,"<")]]);
                  } else {
                    const ave = [Fleur.XQueryX.attributeValueExpr,[]];
                    attrs[prefix][attrname].forEach(function(v) {
                      if (v[0] === 0) {
                        ave[1].push([Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[Fleur.DocumentType.resolveEntities(null, v[1]).replace(/'/gm,"\\'")]]]]);
                      } else {
                        ave[1].push(Fleur.XQueryParser._xp2js(v[1], [], [], begin));
                      }
                    });
                    aconsprod[1].push(ave);
                  }
                  attrprod[1].push(aconsprod);
                }
              }
            }
          }
          r0[1].push(attrprod);
        }
        if (s.charAt(offset - 1) !== "/") {
          const newloc = [];
          r0[1].push([Fleur.XQueryX.elementContent,newloc]);
          parents.push(currnodename);
          currnodename = nodename;
          if (locstack.length !== 0) {
            locstack[locstack.length -1].push(r0);
          } else {
            r = r0;
          }
          locstack.push(newloc);
          //namespaces = {};
          //for (prefix in newnamespaces) {
          //  if (newnamespaces.hasOwnProperty(prefix)) {
          //    namespaces[prefix] = newnamespaces[prefix];
          //  }
          //}
        } else {
          if (r === null) {
            return [r0[0], r0[1], begin, offset + 1, 0];
          }
          locstack[locstack.length - 1].push(r0);
        }
      } else {
        Fleur.XQueryError_xqt("XPST0003", null, "Invalid character in XML element name", "", new Fleur.Text(c));
      }
      offset = index + 1;
      if (offset === 0) {
        break;
      }
    }
  }
};
Fleur.XQueryParser._getPredParam = function(c, s, l, arg, allowpredicates, predstart, predarr, ops) {
  //console.log("_getPredParam: c = " + c + " s = " + s + " ops = " + ops);
  let t = [];
  l = l || 0;
  var p, plen, arg20, arg2;
  var isret = false;
  if (c === "?") {
    var i = Fleur.XQueryParser._skipSpaces(s, 0);
    var c2 = s.charAt(i);
    var d = s.substr(i + 1);
    var r, t1;
    if (c2 !== "" && "0123456789".indexOf(c2) !== -1) {
      t1 = Fleur.XQueryParser._getNumber(c2 + d);
      r = [Fleur.XQueryX.lookup,[[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,[t1.replace(/e\+/, "e")]]]]]];
      plen = t1.length + 1;
    } else if (c2 !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c2) !== -1) {
      t1 = Fleur.XQueryParser._getName(c2 + d);
      r = [Fleur.XQueryX.lookup,[[Fleur.XQueryX.NCName,[t1]]]];
      plen = t1.length + 1;
    } else if (c2 === "*") {
      r = [Fleur.XQueryX.lookup,[[Fleur.XQueryX.star,[]]]];
      plen = 2;
    } else if (c2 === "(") {
      t = Fleur.XQueryParser._xp2js(s.substr(i + 1), [], [999,"("]);
      plen = s.length - parseInt(t.substr(0, t.indexOf(".")), 10) + 1 + i;
      r = [Fleur.XQueryX.lookup,[[Fleur.XQueryX.expr,[t.substr(t.indexOf(".") + 1)]]]];
    }
  } else {
    var func = [];
    if (arg[0] === Fleur.XQueryX.pathExpr && arg[1][0][1][1][0] === Fleur.XQueryX.nameTest) {
      func = arg[1][0][1][1];
    }
    if (func.length !== 0 && func[1][0] === "function" && func[1].length === 1) {
      plen = s.length;
    } else {
      t = Fleur.XQueryParser._xp2js(s, [], l === 0 ? [] : [[999, arg[0] === Fleur.XQueryX.quantifiedExpr && arg[1][0][0] === Fleur.XQueryX.quantifier ? "q" : "("]], 0);
      plen = s.length - t[3] + 1;
    }
  }
  if (t.length === 0) {
    Fleur.XQueryError_xqt("XPST0003", null, "Unrecognized expression", "", new Fleur.Text(s));
  } else if (c === "{") {
    var cargs = t;
    if (cargs[0] === Fleur.XQueryX.arguments) {
      cargs[0] = Fleur.XQueryX.sequenceExpr;
    }
    if (arg[0] === Fleur.XQueryX.computedEntryConstructor || arg[0] === Fleur.XQueryX.computedElementConstructor || arg[0] === Fleur.XQueryX.computedAttributeConstructor) {
      if (cargs[1] !== 0) {
        arg[1].push([Fleur.XQueryX.valueExpr,[cargs]]);
      }
      p = arg;
      p[3] = plen;
    } else if (arg[0] === Fleur.XQueryX.computedPIConstructor) {
      if (cargs[1] !== 0) {
        arg[1].push([Fleur.XQueryX.piValueExpr,[cargs]]);
      }
      p = arg;
      p[3] = plen;
    } else {
      var cname = arg[1][0][1][1];
      if (cname[1].length === 1) {
        switch (cname[1][0]) {
          case "document":
            p = [Fleur.XQueryX.computedDocumentConstructor,(cargs[1] !== 0 ? [[Fleur.XQueryX.argExpr,[cargs]]] : []), 0, plen, 0];
            break;
          case "comment":
            p = [Fleur.XQueryX.computedCommentConstructor,(cargs[1] !== 0 ? [[Fleur.XQueryX.argExpr,[cargs]]] : []), 0, plen, 0];
            break;
          case "map":
            var cargs2 = cargs[0] === Fleur.XQueryX.arguments ? cargs[1] : cargs;
            p = [Fleur.XQueryX.mapConstructor,[cargs2], 0, plen, 0];
            break;
          case "array":
            var cargs3 = cargs[0] === Fleur.XQueryX.arguments ? cargs[1] : cargs;
            p = [Fleur.XQueryX.arrayConstructor,[cargs3], 0, plen, 0];
            break;
          case "entry":
            p = [Fleur.XQueryX.computedEntryConstructor,[[Fleur.XQueryX.tagNameExpr,[cargs]]], 0, plen, 0];
            break;
          case "element":
            p = [Fleur.XQueryX.computedElementConstructor,[[Fleur.XQueryX.tagNameExpr,[cargs]]], 0, plen, 0];
            break;
          case "attribute":
            p = [Fleur.XQueryX.computedAttributeConstructor,[[Fleur.XQueryX.tagNameExpr,[cargs]]], 0, plen, 0];
            break;
          case "processing-instruction":
            p = [Fleur.XQueryX.computedPIConstructor,[[Fleur.XQueryX.piTargetExpr,[cargs]]], 0, plen, 0];
            break;
          case "text":
            p = [Fleur.XQueryX.computedTextConstructor,(cargs[1] !== 0 ? [[Fleur.XQueryX.argExpr,[cargs]]] : []), 0, plen, 0];
            break;
          case "try":
            p = [Fleur.XQueryX.tryCatchExpr,[[Fleur.XQueryX.tryClause,[cargs]]], 0, plen, 0];
            break;
        }
      }
      if (ops.length !== 0 && (ops[0][1] === "catch" || (ops[0][1] === "|" && ops.length > 1 && ops[1][1] === "catch"))) {
        arg2 = arg[1][0][1];
        p = [Fleur.XQueryX.catchErrorList,[arg2]],[Fleur.XQueryX.catchExpr,[cargs], 0, plen, 0];
      }
    }
  } else if (c === "(") {
    if (arg[0] === Fleur.XQueryX.pathExpr && arg[1][0][0] === Fleur.XQueryX.stepExpr && arg[1][0][1][0][0] === Fleur.XQueryX.xpathAxis) {
      const fname = arg[1][0][1][1];
      var fargs = t[0] === Fleur.XQueryX.arguments ? t : [Fleur.XQueryX.arguments,t[0] === 0 ? [] : [t]];
      var parg0, parg;
      if (fname[1].length === 1) {
        switch (fname[1][0]) {
          case "array":
            arg[1][0][1][1] = [Fleur.XQueryX.arrayTest,[]];
            p = arg;
            p[3] = plen;
            break;
          case "attribute":
            parg = Fleur.XQueryParser._testFormat(fargs, Fleur.XQueryX.attributeName);
            p = [Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['attribute']],[Fleur.XQueryX.attributeTest,parg]]]], 0, plen, 0];
            break;
          case "comment":
            arg[1][0][1][1] = [Fleur.XQueryX.commentTest,[]];
            p = arg;
            p[3] = plen;
            break;
          case "document-node":
            if (fargs.length !== 0) {
              parg = fargs[1][0][1][0][1];
            } else {
              parg = [];
            }
            arg[1][0][1][1] = [Fleur.XQueryX.documentTest,parg];
            p = arg;
            p[3] = plen;
            break;
          case "element":
            parg = Fleur.XQueryParser._testFormat(fargs, Fleur.XQueryX.elementName);
            arg[1][0][1][1] = [Fleur.XQueryX.elementTest,parg];
            p = arg;
            p[3] = plen;
            break;
          case "entry":
            parg = Fleur.XQueryParser._testFormat(fargs, "Fleur.XQueryX.entryName");
            p = [Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['entry']],[Fleur.XQueryX.entryTest,parg]]]], 0, plen, 0];
            break;
          case "function":
            var j = -1;
            var xq = s;
            var pindex, np, nbpar = 0;
            var fres = [Fleur.XQueryX.paramList,[]];
            var end = xq.length;
            do {
              j = Fleur.XQueryParser._skipSpaces(xq, j + 1);
              c = xq.charAt(j);
              if (c !== ")") {
                if (c !== "$") {
                  Fleur.XQueryError_xqt("XPST0003", null, "Unexpected char", "", new Fleur.Text(xq.substr(j)));
                }
                j++;
                c = xq.charAt(j);
                d = xq.substr(j + 1);
                if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
                  Fleur.XQueryError_xqt("XPST0003", null, "Unexpected char", "", new Fleur.Text(xq.substr(j)));
                }
                var pname = Fleur.XQueryParser._getName(c + d);
                j = Fleur.XQueryParser._skipSpaces(xq, j + pname.length);
                c = xq.charAt(j);
                var tdecl = [];
                if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                  d = xq.substr(j + 1);
                  r = Fleur.XQueryParser._getName(c + d);
                  if (r === "as") {
                    j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                    c = xq.charAt(j);
                    if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                      d = xq.substr(j + 1);
                      var ptype = Fleur.XQueryParser._getName(c + d);
                      pindex = ptype.indexOf(":");
                      np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
                      c = xq.charAt(j + ptype.length);
                      tdecl = [Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[np]]]];
                      if ("?+*".indexOf(c) !== -1) {
                        tdecl[1].push([Fleur.XQueryX.occurrenceIndicator,[c]]);
                        j++;
                      }
                      j = Fleur.XQueryParser._skipSpaces(xq, j + ptype.length);
                      c = xq.charAt(j);
                    }
                  }
                }
                fres[1].push([Fleur.XQueryX.param,[[Fleur.XQueryX.varName,[pname]]]]);
                if (tdecl.length !== 0) {
                  fres[1].push(tdecl);
                }
                nbpar++;
              }
            } while (c === ",");
            if (c !== ")") {
              Fleur.XQueryError_xqt("XPST0003", null, "Unexpected char", "", new Fleur.Text(xq.substr(j)));
            }
            j = Fleur.XQueryParser._skipSpaces(xq, j + 1);
            c = xq.charAt(j);
            if (c === "a") {
              d = xq.substr(j + 1);
              r = Fleur.XQueryParser._getName(c + d);
              if (r === "as") {
                j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                c = xq.charAt(j);
                if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                  d = xq.substr(j + 1);
                  ptype = Fleur.XQueryParser._getName(c + d);
                  pindex = ptype.indexOf(":");
                  np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
                  c = xq.charAt(j + ptype.length);
                  fres += ",[Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[" + np + "]]";
                  if ("?+*".indexOf(c) !== -1) {
                    fres += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
                    j++;
                  }
                  fres += "]]";
                  j = Fleur.XQueryParser._skipSpaces(xq, j + ptype.length);
                  c = xq.charAt(j);
                }
              }
            }
            if (c === "{") {
              fres += ",[Fleur.XQueryX.functionBody,[";
              var braces = 1;
              var body = "";
              while ((c !== "}" || braces !== 0) && j !== end) {
                c = xq.charAt(++j);
                if (c === "{") {
                  braces++;
                } else if (c === "}") {
                  braces--;
                }
                if (braces !== 0) {
                  body += c;
                }
              }
              if (body !== "") {
                fres += Fleur.XQueryParser._xp2js(body, [], [], 0);
              }
              fres += "]]";
            } else {
              Fleur.XQueryError_xqt("XPST0003", null, "Unexpected char", "", new Fleur.Text(xq.substr(j)));
            }
            plen = j + 2;
            p = [Fleur.XQueryX.inlineFunctionExpr,[fres], 0, plen, 0];
            break;
          case "item":
            arg[1][0][1][1] = [Fleur.XQueryX.anyItemType,[]];
            p = arg;
            p[3] = plen;
            break;
          case "map":
            arg[1][0][1][1] = [Fleur.XQueryX.mapTest,[]];
            p = arg;
            p[3] = plen;
            break;
          case "namespace-node":
            arg[1][0][1][1] = [Fleur.XQueryX.namespaceTest,[]];
            p = arg;
            p[3] = plen;
            break;
          case "node":
            arg[1][0][1][1] = [Fleur.XQueryX.anyKindTest,[]];
            p = arg;
            p[3] = plen;
            break;
          case "processing-instruction":
            arg[1][0][1][1] = [Fleur.XQueryX.piTest,fargs.length !== 0 ? [Fleur.XQueryX.piTarget,fargs[1]] : []];
            p = arg;
            p[3] = plen;
            break;
          case "schema-attribute":
            if (fargs.length !== 0) {
              parg = fargs[1][0][1][0][1];
            } else {
              parg = [];
            }
            arg[1][0][1][1] = [Fleur.XQueryX.schemaAttributeTest,parg];
            p = arg;
            p[3] = plen;
            break;
          case "schema-element":
            if (fargs.length !== 0) {
              parg = fargs[1][0][1][0][1];
            } else {
              parg = [];
            }
            arg[1][0][1][1] = [Fleur.XQueryX.schemaElementTest,parg];
            p = arg;
            p[3] = plen;
            break;
          case "text":
            arg[1][0][1][1] = [Fleur.XQueryX.textTest,[]];
            p = arg;
            p[3] = plen;
            break;
        }
      }
      if (!p) {
        fname[0] = Fleur.XQueryX.functionName;
        p = [Fleur.XQueryX.functionCallExpr,[fname,fargs], 0, plen, 0];
      }
    } else if (arg[0] === Fleur.XQueryX.pathExpr && arg[1].length !== 0  && arg[1][0][0] === Fleur.XQueryX.stepExpr && arg[1][0][1].length !== 0 && arg1[1][0][1][0][0] === Fleur.XQueryX.filterExpr) {
      var arg1, lookup = false;
      if (arg.indexOf(",[Fleur.XQueryX.predicates,[") !== -1) {
        arg1 = arg.substr(0, arg.indexOf(",[Fleur.XQueryX.predicates,[")).substr(77);
        arg20 = arg.substr(arg.indexOf(",[Fleur.XQueryX.predicates,[") + 28);
        arg2 = arg20.substr(0, arg20.length - 6);
      } else if (arg.indexOf(",[Fleur.XQueryX.lookup,[") !== -1) {
        lookup = true;
        arg1 = arg.substr(0, arg.indexOf(",[Fleur.XQueryX.lookup,[")).substr(77);
        arg20 = arg.substr(arg.indexOf(",[Fleur.XQueryX.lookup,[") + 24);
        arg2 = arg20.substr(0, arg20.length - 6);
      } else {
        arg1 = arg.substr(0, arg.length - 8).substr(77);
        arg2 = "";
      }
      fargs = t.length !== 0 && t[0] !== Fleur.XQueryX.arguments ? [Fleur.XQueryX.arguments,[t]] : t;
      arg1 = [arg1];
      if (arg2.length !== 0) {
        arg1.push([lookup ? Fleur.XQueryX.lookup: Fleur.XQueryX.predicates,[arg2]]);
      }
      if (fargs.length !== 0) {
        arg1.push(fargs);
      }
      p = [Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[arg1]]]]]]]]], 0, plen, 0];
      p[3] = plen;
    } else if (arg[0] === Fleur.XQueryX.namedFunctionRef) {
      p = [Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[arg]]]]]]]]], 0, plen, 0];
//    } else if (arg === "[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.forClause,[]]]]") {
//      fargs = t.substr(t.indexOf(".") + 1);
//      fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
//      p = plen + ".[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.forClause,[" + fargs2 + "]]]]";
    } else if (arg[0] === Fleur.XQueryX.flworExpr && arg[1].length === 0) {
      p = [Fleur.XQueryX.flworExpr,t[0] === Fleur.XQueryX.arguments || t[0] === Fleur.XQueryX.flworExpr ? t[1] : [t], 0, plen, 0];
      isret = true;
    } else if (arg[0] === Fleur.XQueryX.quantifiedExpr && arg[1][0] && arg[1][0][0] === Fleur.XQueryX.quantifier) {
      fargs = t[0] === Fleur.XQueryX.arguments ? t[1] : [t];
      arg[1].push(fargs);
      p = arg;
      p[3] = plen;
      isret = true;
    } else if (arg.length !== 0 && arg[1] !== 0) {
      fargs = t[0] === Fleur.XQueryX.arguments ? t[1] : [t];
      p = [Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[arg]],fargs]]]]]]]];
    } else {
      p = t;
      p[3] = plen;
    }
  } else {
    //predicates
    if (arg[0] !== Fleur.XQueryX.pathExpr) {
      arg = [Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[arg]]]]]];
    }
    const stepcontent = arg[1][0][1];
    const laststepcontent = stepcontent[stepcontent.length - 1];
    if (c === "?") {
      if (arg.indexOf(",[Fleur.XQueryX.predicates,[") === -1) {
        p = plen + "." + arg.substr(0, arg.length - 4) + "," + t.substr(t.indexOf(".") + 1) + "]]]]";
      } else {
        p = plen + "." + arg.substr(0, predstart) + predarr.reduce(function(s, pr) {return s + ",[Fleur.XQueryX.predicate,[" + pr + "]]";}, "") + "," + t.substr(t.indexOf(".") + 1) + "]]]]";;
      }
      allowpredicates = false;
    } else if (laststepcontent[0] !== Fleur.XQueryX.predicates) {
      stepcontent.push([allowpredicates ? Fleur.XQueryX.predicates : Fleur.XQueryX.predicate,[t]]);
      p = arg;
      p[3] = plen;
    } else {
      laststepcontent[1].push(t);
      p = arg;
      p[3] = plen;
    }
  }
  if (!isret) {
    var inext = Fleur.XQueryParser._skipSpaces(s, plen - 1);
    var cnext = s.charAt(inext);
    if (cnext === "(" || cnext === "[" || cnext === "{" || cnext === "?") {
      //console.log("_getPredParam: cnext = " + cnext);
      return Fleur.XQueryParser._getPredParam(cnext, s.substr(inext + 1), l + inext + 1, p, allowpredicates, predstart, predarr, ops);
    }
  }
  p[3] += l;
  return p;
};
Fleur.XQueryParser._getPredParams = function(s, len, arg, ops, begin) {
  const i = Fleur.XQueryParser._skipSpaces(s, 0);
  const op = ops.length !== 0 ? ops[ops.length - 1][1] : "";
  if (s.charAt(i) === "(" || s.charAt(i) === "[" || s.charAt(i) === "{" || (s.charAt(i) === "?" && op !== "instance of" && op !== "cast as" && op !== "castable as")) {
    return Fleur.XQueryParser._getPredParam(s.charAt(i), s.substr(i + 1), len + i, arg, true, 0, [], ops, begin + 1);
  }
  arg[2] += i;
  return arg;
};
Fleur.XQueryParser._getStringLiteral = function(s, nodeCode, begin) {
  const i = Fleur.XQueryParser._skipSpaces(s, 0);
  const d = s.substr(i + 1);
  const delim = s.charAt(i);
  let sep = d.indexOf(delim);
  let t = d.substr(0, d.indexOf(delim));
  while (d.substr(sep + 1, 1) === delim) {
    const d2 = d.substr(sep + 2);
    t += delim + d2.substr(0, d2.indexOf(delim));
    sep += 2 + d2.indexOf(delim);
  }
  let t2 = Fleur.DocumentType.resolveEntities(null, t);
  return [nodeCode, [t2], begin + i, sep + 2, 0];
};
Fleur.XQueryParser._getNumber = function(s, r) {
  r = r || "";
  if (s === "") {
    return r;
  }
  let c = s.charAt(0);
  if (c === "E") {
    c = "e";
  }
  if ("0123456789".indexOf(c) !== -1 || ((c === "." || c === "e") && r.indexOf(c) === -1) ||
    ((c === "-" || c === "+") && r.endsWith("e"))) {
    return Fleur.XQueryParser._getNumber(s.substr(1), r + c);
  }
  return r;
};
Fleur.XQueryParser._xp2js = function(xp, args, ops, begin) {
  //console.log("_xp2js: xp = " + xp + " ops = " + ops);
  const i = Fleur.XQueryParser._skipSpaces(xp, 0);
  let c = xp.charAt(i);
  let d = xp.substr(i + 1);
  let d2;
  let r;
  if (c === "." && (d === "" || "0123456789".indexOf(d.charAt(0)) === -1)) {
    if (d.charAt(0) === ".") {
      //stepExpr
      r = [Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['parent']],[Fleur.XQueryX.anyKindTest,[]]]]], begin + i, 2, 0];
    } else {
      //contextItemExpr
      r = [Fleur.XQueryX.contextItemExpr,[], begin + i, 1, 0];
    }
  } else if (c === ")" || c === "}") {
    r = [0, 0, begin + i, 0, 0];
  } else if (c === "/") {
    //rootExpr
    var ir = Fleur.XQueryParser._skipSpaces(d, 0);
    r = [Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.rootExpr,[]]], begin, d.charAt(0) === "" || "/@*.(_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(d.charAt(ir)) === -1 ? 1 : 0, 0];
  } else if (c === "@") {
    r = Fleur.XQueryParser._getNameStep(d, 1, begin + i);
  } else if (c === "'" || c === '"') {
    r = Fleur.XQueryParser._getStringLiteral(c + d, Fleur.XQueryX.value, begin);
    r = [Fleur.XQueryX.stringConstantExpr,[r], r[2], r[3], r[4]];
  } else if (c === "(") {
    var endseq = Fleur.XQueryParser._skipSpaces(d, 0);
    if (d.charAt(endseq) === ")") {
      r = [Fleur.XQueryX.sequenceExpr,[], begin + i, 2 + endseq, 0];
    } else {
      r = [0, 0, begin + i, 0, 0];
    }
  } else if (c === "-" || c === "+") {
    //if (d !== "" && ".0123456789".indexOf(d.charAt(0)) !== -1) {
    //  var t4 = Fleur.XQueryParser._getNumber(d, c);
    //  r = t4.length + ".[" + (t4.indexOf("e") !== -1 ? "Fleur.XQueryX.doubleConstantExpr" : t4.indexOf(".") !== -1 ? "Fleur.XQueryX.decimalConstantExpr" : "Fleur.XQueryX.integerConstantExpr") + ",[[Fleur.XQueryX.value,['" + t4.replace(/e\+/, "e") + "']]]]";
    //} else {
      c = "~" + c;
      r = [0, 0, begin + i, 0, 0];
    //}
  } else if (c !== "" && ".0123456789".indexOf(c) !== -1) {
    const t5 = Fleur.XQueryParser._getNumber(c + d);
    r = [t5.indexOf("e") !== -1 ? Fleur.XQueryX.doubleConstantExpr : t5.indexOf(".") !== -1 ? Fleur.XQueryX.decimalConstantExpr : Fleur.XQueryX.integerConstantExpr, [[Fleur.XQueryX.value,[t5.replace(/e\+/, "e")]]], begin, t5.length, 0];
  } else if (c === "$") {
    const t51 = Fleur.XQueryParser._getName(d);
    const pt51 = (t51.indexOf(":") === -1 ? ":" : "") + t51;
    if ((ops.length !== 0 && ops[0][1] === "group by") || (ops.length > 1 && ops[0][1] === "~," && ops[1][1] === "group by")) {
      r = [Fleur.XQueryX.groupingSpec,[[Fleur.XQueryX.varName,[pt51.substr(pt51.indexOf(":") + 1)]]], begin, t51.length + 1, 0];
    } else {
      r = [Fleur.XQueryX.varRef,[[Fleur.XQueryX.name,[pt51.substr(pt51.indexOf(":") + 1)]]], begin, t51.length + 1, 0];
    }
    if (pt51.charAt(0) !== ":") {
      r[1][0][1].push([Fleur.XQueryX.prefix,[pt51.substr(0, pt51.indexOf(":"))]]);
    }
  } else if (c === "?") {
    var c2 = d.charAt(0);
    d = d.substr(1);
    var t52;
    if (c2 !== "" && "0123456789".indexOf(c2) !== -1) {
      t52 = Fleur.XQueryParser._getNumber(c2 + d);
      r = [Fleur.XQueryX.unaryLookup,[[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,[t52.replace(/e\+/, "e")]]]]], begin, t52.length, 0];
    } else if (c2 !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c2) !== -1) {
      t52 = Fleur.XQueryParser._getName(c2 + d);
      r = [Fleur.XQueryX.unaryLookup,[[Fleur.XQueryX.NCName,[t52]]], begin, t52.length, 0];
    } else if (c2 === "*") {
      r = [Fleur.XQueryX.unaryLookup,[[Fleur.XQueryX.star,[]]], begin, 1, 0];
    } else if (c2 === "(") {
      t52 = Fleur.XQueryParser._xp2js(d, null, "5.999.(", 2);
      r = [Fleur.XQueryX.unaryLookup,[[Fleur.XQueryX.expr,[t52]]], begin, t52[3], 0];
    }
  } else if (c !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*".indexOf(c) !== -1) {
    var t61 = Fleur.XQueryParser._getName(c+d);
    if (["element","attribute","entry","processing-instruction"].indexOf(t61) !== -1) {
      var i61 = Fleur.XQueryParser._skipSpaces(xp, i + t61.length);
      var c61 = xp.charAt(i61);
      if (c61 !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c61) !== -1) {
        var d61 = xp.substr(i61 + 1);
        var t62 = Fleur.XQueryParser._getName(c61 + d61);
        const eq = t62.substr(0, 2) === "Q{";
        const sind = eq ? t62.indexOf("}") : t62.indexOf(":");
        const n3 = sind !== -1 ? t62.substr(sind + 1) : t62;
        const nsp = eq ? t62.substr(2, sind - 2) : sind !== -1 ? t62.substr(0, sind) : "";
        switch(t61) {
          case "element":
            r = [Fleur.XQueryX.computedElementConstructor,[[Fleur.XQueryX.tagName,(eq || sind !== -1 ? [n3, [eq ? Fleur.XQueryX.URI : Fleur.XQueryX.prefix, [nsp]]] : [t62])]], begin, i61 - i + t62.length, 0];
            break;
          case "attribute":
            r = [Fleur.XQueryX.computedAttributeConstructor,[[Fleur.XQueryX.tagName,(eq || sind !== -1 ? [n3, [eq ? Fleur.XQueryX.URI : Fleur.XQueryX.prefix, [nsp]]] : [t62])]], begin, i61 - i + t62.length, 0];
            break;
          case "processing-instruction":
            r = [Fleur.XQueryX.computedPIConstructor,[[Fleur.XQueryX.piTarget,[t62]]], begin, i61 - i + t62.length, 0];
            break;
          case "entry":
            r = [Fleur.XQueryX.computedEntryConstructor,[[Fleur.XQueryX.tagName,[t62]]], begin, i61 - i + t62.length, 0];
        }
      } else {
        r = Fleur.XQueryParser._getNameStep(c + d, 0, begin + i);
      }
    } else {
      r = Fleur.XQueryParser._getNameStep(c + d, 0, begin + i);
    }
  } else if (c === "<") {
    r = Fleur.XQueryParser._getNodeConstructor(c + d, begin + i);
  } else {
    Fleur.XQueryError_xqt("XPST0003", null, "Unexpected char", "", new Fleur.Text(c + d));
  }
  var rlen = r[3];
  var rval = r;
  d2 = rlen === 0 ? c + d : d.substr(rlen - 1);
  r = Fleur.XQueryParser._getPredParams(d2, rlen, rval, ops, begin + i);
  rlen = r[3];
  rval = r;
  args.push(r);
  var f = rlen === 0 ? c + d : d.substr(rlen - 1);
  var i4 = Fleur.XQueryParser._skipSpaces(f, 0);
  var o = f.charAt(i4);
  var p = f.substr(f.indexOf(o));
  var op = "null";
  var op2 = "null";
  if ((p.substr(0, 9) === "ascending" || p.substr(0, 10) === "descending") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(o === "a" ? 9 : 10)) === -1) {
    var poststacks = Fleur.XQueryParser._calc(args, ops, Fleur.XQueryParser._precedence["~~" + (o === "a" ? "ascending" : "descending")]);
    var postargslen = poststacks.substr(0, poststacks.indexOf("."));
    args2 = poststacks.substr(poststacks.indexOf(".") + 1).substr(0, parseInt(postargslen, 10));
    var postnextstack = poststacks.substr(postargslen.length + 1 + parseInt(postargslen, 10));
    var postopslen = postnextstack.substr(0, postnextstack.indexOf("."));
    ops = (postprec.length + 1 + (o === "a" ? 11 : 12)) + "." + postprec + ".~~" + (o === "a" ? "ascending" : "descending") + postnextstack.substr(postnextstack.indexOf(".") + 1).substr(0, parseInt(postopslen, 10));
    f = f.substr(i4 + (o === "a" ? 9 : 10));
    i4 = Fleur.XQueryParser._skipSpaces(f, 0);
    o = f.charAt(i4);
    p = f.substr(f.indexOf(o));
  }
  if (ops.length !== 0) {
    if (ops[ops.length - 1][1] === "instance of") {
      if (o === "+" || o === "?" || o === "*") {
        ops[ops.length - 1][1] += o;
        i4 = Fleur.XQueryParser._skipSpaces(f, 1);
        o = f.charAt(i4);
        p = f.substr(f.indexOf(o));
      }
    } else if (ops[ops.length - 1][1] === "treat as") {
      if (o === "+" || o === "?" || o === "*") {
        ops[ops.length - 1][1] += o;
        i4 = Fleur.XQueryParser._skipSpaces(f, 1);
        o = f.charAt(i4);
        p = f.substr(f.indexOf(o));
      }
    } else if (ops[ops.length - 1][1] === "cast as") {
      if (o === "?") {
        ops[ops.length - 1][1] += o;
        i4 = Fleur.XQueryParser._skipSpaces(f, 1);
        o = f.charAt(i4);
        p = f.substr(f.indexOf(o));
      }
    } else if (ops[ops.length - 1][1] === "castable as") {
      if (o === "?") {
        ops[ops.length - 1][1] += o;
        i4 = Fleur.XQueryParser._skipSpaces(f, 1);
        o = f.charAt(i4);
        p = f.substr(f.indexOf(o));
      }
    }
  }
  if (o === "") {
    Fleur.XQueryParser._calc(args, ops, 9999999, begin + i);
    return args[0];
  }
  if (o === "]" || o === ")" || o === "}" || (p.substr(0, 6) === "return" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) || (p.substr(0, 9) === "satisfies" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(9)) === -1)) {
    const stacks2 = Fleur.XQueryParser._calc(args, ops, 998, begin + i);
    //var reslen20 = stacks2.substr(stacks2.indexOf(".") + 1);
    //var reslen2 = reslen20.substr(0, reslen20.indexOf("."));
    //var ret20 = stacks2.substr(stacks2.indexOf(".") + 1);
    const ret20 = stacks2[0][0];
    //return (f.substr(f.indexOf(o) + 1).length - (o === "r" ? 5 : o === "s" ? 8 : 0)) + "." + ret20.substr(ret20.indexOf(".") + 1).substr(0, parseInt(reslen2, 10));
    return [ret20[0], ret20[1], begin + i, f.substr(f.indexOf(o) + 1).length - (o === "r" ? 5 : o === "s" ? 8 : 0), 0];
  }
  if (o === "$") {
    if (rval[0] === Fleur.XQueryX.pathExpr && rval[1][0][0] === Fleur.XQueryX.stepExpr && rval[1][0][1][0][0] === Fleur.XQueryX.xpathAxis && rval[1][0][1][0][1][0] === "child" && rval[1][0][1][1][0] === Fleur.XQueryX.nameTest) {
      switch(rval[1][0][1][1][1][0]) {
        case "for":
          rval = [Fleur.XQueryX.flworExpr,[]];
          op = "for";
          break;
        case "let":
          rval = [Fleur.XQueryX.flworExpr,[]];
          op = "let";
          break;
        case "every":
          rval = [Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier,["every"]]]];
          op = "every";
          break;
        case "some":
          rval = [Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier,["some"]]]];
          op = "some";
          break;
      }
    }
    if (op !== "null") {
      r = Fleur.XQueryParser._getPredParams("(" + f, rlen, rval);
      rlen = r[3];
      rval = r;
      args[args.length - 1] = r;
      op = op === "for" || op === "let" ? "return" : "satisfies";
      f = d.substr(rlen - 2 - op.length);
      p = f.substr(1);
    }
  } else if (p.substr(0, 9) === "intersect" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(9)) === -1) {
    op = p.substr(0, 9);
  } else if (p.substr(0, 8) === "allowing" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(8)) === -1) {
    op = p.substr(0, 8);
  } else if (p.substr(0, 8) === "instance" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(8)) === -1) {
    op = p.substr(0, Fleur.XQueryParser._skipSpaces(p, 8) + 2);
    op2 = "instance of";
  } else if (p.substr(0, 8) === "castable" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(8)) === -1) {
    op = p.substr(0, Fleur.XQueryParser._skipSpaces(p, 8) + 2);
    op2 = "castable as";
  } else if ((p.substr(0, 6) === "except" || p.substr(0, 6) === "before") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) {
    op = p.substr(0, 6);
  } else if (p.substr(0, 5) === "treat" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
    op = p.substr(0, Fleur.XQueryParser._skipSpaces(p, 5) + 2);
    op2 = "treat as";
  } else if (p.substr(0, 5) === "group" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
    op = p.substr(0, Fleur.XQueryParser._skipSpaces(p, 5) + 2);
    op2 = "group by";
  } else if (p.substr(0, 5) === "order" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
    op = p.substr(0, Fleur.XQueryParser._skipSpaces(p, 5) + 2);
    op2 = "order by";
  } else if ((p.substr(0, 5) === "union" || p.substr(0, 5) === "every" || p.substr(0, 5) === "nodes" || p.substr(0, 5) === "after" || p.substr(0, 5) === "value" || p.substr(0, 5) === "count" || p.substr(0, 5) === "where" || p.substr(0, 5) === "empty" || p.substr(0, 5) === "catch") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
    op = p.substr(0, 5);
  } else if (p.substr(0, 4) === "cast" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(4)) === -1) {
    op = p.substr(0, Fleur.XQueryParser._skipSpaces(p, 4) + 2);
    op2 = "cast as";
  } else if ((p.substr(0, 4) === "idiv" || p.substr(0, 4) === "some" || p.substr(0, 4) === "then" || p.substr(0, 4) === "else" || p.substr(0, 4) === "node" || p.substr(0, 4) === "with" || p.substr(0, 4) === "into") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(4)) === -1) {
    op = p.substr(0, 4);
  } else if ((p.substr(0, 3) === "div" || p.substr(0, 3) === "and" || p.substr(0, 3) === "mod" || p.substr(0, 3) === "let" || p.substr(0, 3) === "for") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(3)) === -1) {
    op = p.substr(0, 3);
  } else if ((p.substr(0, 2) === "or" || p.substr(0, 2) === "eq" || p.substr(0, 2) === "ne" || p.substr(0, 2) === "lt" || p.substr(0, 2) === "le" || p.substr(0, 2) === "gt" || p.substr(0, 2) === "ge" || p.substr(0, 2) === "is" || p.substr(0, 2) === "to" || p.substr(0, 2) === "in" || p.substr(0, 2) === "as" || p.substr(0, 2) === "at" || p.substr(0, 2) === "by") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(2)) === -1) {
    op = p.substr(0, 2);
  } else if (p.substr(0, 2) === "!=" || p.substr(0, 2) === "<=" || p.substr(0, 2) === ">=" || p.substr(0, 2) === "<<" || p.substr(0, 2) === ">>" || p.substr(0, 2) === "//" || p.substr(0, 2) === "~+" || p.substr(0, 2) === "~-" || p.substr(0, 2) === ":=" || p.substr(0, 2) === "||" || p.substr(0, 2) === "!!") {
    op = p.substr(0, 2);
  } else if ("+-*=|,;<>/!{:".indexOf(o) !== -1) {
    op = o;
    if (op === ",") {
      if (ops.length !== 0 && (ops[ops.length - 1][1] === ":=" || ops[ops.length - 1][1] === "group by" || (ops.length > 1 && ops[ops.length - 1][1] === "~" && ops[ops.length - 2][1] === "group by"))) {
        op2 = "~,";
      } else {
        let opi = ops.length - 1;
        while (opi >= 0) {
          if (ops[opi][1] === "order by") {
            op2 = "~,";
            break;
          }
          if (ops[opi][0] > 30) {
            break;
          }
          opi--;
        }
      }
    }
  }
  if (op !== "null") {
    const opprec = Fleur.XQueryParser._precedence[op2 !== "null" ? op2 : op];
    var stacks3 = Fleur.XQueryParser._calc(args, ops, opprec);
    var args3 = stacks3[0];
    var ops3 = stacks3[1];
    var xp3 = p.substr(op.length);
    ops3.push([parseInt(opprec, 10), op2 !== "null" ? op2 : op]);
    return Fleur.XQueryParser._xp2js(xp3, args3, ops3, begin);
  }
  Fleur.XQueryError_xqt("XPST0003", null, "Unknown operator", "", new Fleur.Text(f.trim()));
};
Fleur.XQueryParser._getVersion = function(xq) {
  var i = Fleur.XQueryParser._skipSpaces(xq, 0);
  var c = xq.charAt(i);
  var d = xq.substr(i + 1);
  var r = "";
  var v, e;
  if (c === "" || "abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
    return i + ".";
  }
  r = Fleur.XQueryParser._getName(c + d);
  if (r === "xquery") {
    var j = Fleur.XQueryParser._skipSpaces(xq, i + r.length);
    c = xq.charAt(j);
    d = xq.substr(j + 1);
    if (c === "" || "abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
      return i + ".";
    }
    r = Fleur.XQueryParser._getName(c + d);
    if (r === "version") {
      j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
      c = xq.charAt(j);
      d = xq.substr(j + 1);
      if (c !== "'" && c !== '"') {
        return i + ".";
      }
      r = Fleur.XQueryParser._getStringLiteral(c + d);
      var vl = r.substr(0, r.indexOf("."));
      v = r.substr(vl.length + 1);
      j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(vl, 10));
      c = xq.charAt(j);
      if (c === ";") {
        return (j + 1) + ".[Fleur.XQueryX.versionDecl,[[Fleur.XQueryX.version,[" + v + "]]]],";
      }
      d = xq.substr(j + 1);
      r = Fleur.XQueryParser._getName(c + d);
    }
    if (r === "encoding") {
      j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
      c = xq.charAt(j);
      d = xq.substr(j + 1);
      if (c !== "'" && c !== '"') {
        return i + ".";
      }
      r = Fleur.XQueryParser._getStringLiteral(c + d);
      var el = r.substr(0, r.indexOf("."));
      e = r.substr(el.length + 1);
      j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(el, 10));
      c = xq.charAt(j);
      if (c === ";") {
        return (j + 1) + ".[Fleur.XQueryX.versionDecl,[" + (v ? "[Fleur.XQueryX.version,[" + v + "]]," : "") + "[Fleur.XQueryX.encoding,[" + e + "]]]],";
      }
    }
  }
  return i + ".";
};
Fleur.XQueryParser._getProlog = function(xq, i) {
  var pindex;
  i = Fleur.XQueryParser._skipSpaces(xq, i);
  var c = xq.charAt(i);
  var d = xq.substr(i + 1);
  var r = "", prefix, v, vl;
  var res = i + ".";
  var end = xq.length;
  var updatingfunction = false;
  var j;
  if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
    r = Fleur.XQueryParser._getName(c + d);
    switch (r) {
      case "declare":
        j = Fleur.XQueryParser._skipSpaces(xq, i + r.length);
        c = xq.charAt(j);
        d = xq.substr(j + 1);
        while (c === "%") {
          r = Fleur.XQueryParser._getName(d);
          if (r === "updating") {
            updatingfunction = true;
          }
          j = Fleur.XQueryParser._skipSpaces(xq, j + 1 + r.length);
          c = xq.charAt(j);
          d = xq.substr(j + 1);
        }
        if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
          r = Fleur.XQueryParser._getName(c + d);
          switch (r) {
            case "default":
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                r = Fleur.XQueryParser._getName(c + d);
                switch (r) {
                  case "element":
                  case "function":
                    var category = r;
                    j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                    c = xq.charAt(j);
                    d = xq.substr(j + 1);
                    if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                      r = Fleur.XQueryParser._getName(c + d);
                      if (r === "namespace") {
                        j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                        c = xq.charAt(j);
                        d = xq.substr(j + 1);
                        if (c === "'" || c === '"') {
                          r = Fleur.XQueryParser._getStringLiteral(c + d);
                          vl = r.substr(0, r.indexOf("."));
                          v = r.substr(vl.length + 1);
                          j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(vl, 10));
                          c = xq.charAt(j);
                          if (c === ";") {
                            return (j + 1) + ".[Fleur.XQueryX.defaultNamespaceDecl,[[Fleur.XQueryX.defaultNamespaceCategory,['" + category + "']],[Fleur.XQueryX.uri,[" + v + "]]]],";
                          }
                        }
                      }
                    }
                    break;
                  case "collation":
                    j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                    c = xq.charAt(j);
                    d = xq.substr(j + 1);
                    if (c === "'" || c === '"') {
                      r = Fleur.XQueryParser._getStringLiteral(c + d);
                      vl = r.substr(0, r.indexOf("."));
                      v = r.substr(vl.length + 1);
                      j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(vl, 10));
                      c = xq.charAt(j);
                      if (c === ";") {
                        return (j + 1) + ".[Fleur.XQueryX.defaultCollationDecl,[" + v + "]],";
                      }
                    }
                    break;
                  case "order":
                    j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                    c = xq.charAt(j);
                    d = xq.substr(j + 1);
                    if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                      r = Fleur.XQueryParser._getName(c + d);
                      if (r === "empty") {
                        j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                        c = xq.charAt(j);
                        d = xq.substr(j + 1);
                        if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                          r = Fleur.XQueryParser._getName(c + d);
                          if (r === "greatest" || r === "least") {
                            j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                            c = xq.charAt(j);
                            if (c === ";") {
                              return (j + 1) + ".[Fleur.XQueryX.emptyOrderingDecl,['empty " + r + "']],";
                            }
                          }
                        }
                      }
                    }
                    break;
                  case "decimal-format":
                }
              }
              break;
            case "boundary-space":
            case "construction":
              var decl = r === "boundary-space" ? "boundarySpaceDecl" : "constructionDecl";
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                r = Fleur.XQueryParser._getName(c + d);
                if (r === "strip" || r === "preserve") {
                  j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                  c = xq.charAt(j);
                  if (c === ";") {
                    return (j + 1) + ".[Fleur.XQueryX." + decl + ",['" + r + "']],";
                  }
                }
              }
              break;
            case "base-uri":
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if (c === "'" || c === '"') {
                r = Fleur.XQueryParser._getStringLiteral(c + d);
                vl = r.substr(0, r.indexOf("."));
                v = r.substr(vl.length + 1);
                j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(vl, 10));
                c = xq.charAt(j);
                if (c === ";") {
                  return (j + 1) + ".[Fleur.XQueryX.baseUriDecl,[" + v + "]],";
                }
              }
              break;
            case "ordering":
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                r = Fleur.XQueryParser._getName(c + d);
                if (r === "ordered" || r === "unordered") {
                  j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                  c = xq.charAt(j);
                  if (c === ";") {
                    return (j + 1) + ".[Fleur.XQueryX.orderingModeDecl,['" + r + "']],";
                  }
                }
              }
              break;
            case "copy-namespaces":
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                r = Fleur.XQueryParser._getName(c + d);
                if (r === "preserve" || r === "no-preserve") {
                  var preserve = r;
                  j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                  c = xq.charAt(j);
                  if (c === ",") {
                    j = Fleur.XQueryParser._skipSpaces(xq, j + 1);
                    c = xq.charAt(j);
                    d = xq.substr(j + 1);
                    if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                      r = Fleur.XQueryParser._getName(c + d);
                      if (r === "inherit" || r === "no-inherit") {
                        j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                        c = xq.charAt(j);
                        if (c === ";") {
                          return (j + 1) + ".[Fleur.XQueryX.copyNamespacesDecl,[[Fleur.XQueryX.preserveMode,['" + preserve + "']],[Fleur.XQueryX.inheritMode,['" + r + "']]]],";
                        }
                      }
                    }
                  }
                }
              }
              break;
            case "decimal-format":
              break;
            case "namespace":
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                prefix = Fleur.XQueryParser._getName(c + d);
                j = Fleur.XQueryParser._skipSpaces(xq, j + prefix.length);
                c = xq.charAt(j);
                if (c === "=") {
                  j = Fleur.XQueryParser._skipSpaces(xq, j + 1);
                  c = xq.charAt(j);
                  d = xq.substr(j + 1);
                  if (c === "'" || c === '"') {
                    r = Fleur.XQueryParser._getStringLiteral(c + d);
                    vl = r.substr(0, r.indexOf("."));
                    v = r.substr(vl.length + 1);
                    j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(vl, 10));
                    c = xq.charAt(j);
                    if (c === ";") {
                      return (j + 1) + ".[Fleur.XQueryX.namespaceDecl,[[Fleur.XQueryX.prefixElt,['" + prefix + "']],[Fleur.XQueryX.uri,[" + v + "]]]],";
                    }
                  }
                }
              }
              break;
            case "context":
              break;
            case "variable":
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              if (c !== "$") {
                return res;
              }
              j++;
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                var vname = Fleur.XQueryParser._getName(c + d);
                j = Fleur.XQueryParser._skipSpaces(xq, j + vname.length);
                c = xq.charAt(j);
                d = xq.substr(j + 1);
                pindex = vname.indexOf(":");
                var np = pindex === -1 ? "'" + vname + "'" : "'" + vname.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + vname.substr(0, pindex) + "']]";
                var fres = ".[Fleur.XQueryX.varDecl,[[Fleur.XQueryX.varName,[" + np + "]]";
                var nbpar = 0;
                r = Fleur.XQueryParser._getName(c + d);
                if (r === "external") {
                  j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                  c = xq.charAt(j);
                  fres += ",[Fleur.XQueryX.external,[]]";
                  if (c === ";") {
                    return (j + 1) + fres + "]],";
                  }
                  d = xq.substr(j + 1);
                }
                if (c + d.charAt(0) !== ":=") {
                  return res;
                }
                fres += ",[Fleur.XQueryX.varValue,[";
                j = Fleur.XQueryParser._skipSpaces(xq, j + 2);
                c = xq.charAt(j);
                var parents = 0;
                var vvalue = "";
                var instring = false;
                var stringstart;
                while ((c !== ";" || parents !== 0 || instring) && j !== end) {
                  vvalue += c;
                  if (instring) {
                    if (c === stringstart && c !== xq.charAt(j + 1)) {
                      instring = false;
                    }
                  } else {
                    if (c === "'" || c === '"') {
                      instring = true;
                      stringstart = c;
                    } else if (c === "(") {
                      parents++;
                    } else if (c === ")") {
                      parents--;
                    }
                  }
                  c = xq.charAt(++j);
                }
                if (vvalue !== "") {
                  fres += Fleur.XQueryParser._xp2js(vvalue, [], [], 0);
                }
                fres += "]]]],";
                if (c === ";") {
                  return (j + 1) + fres;
                }
              }
              break;
            case "function":
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                var fname = Fleur.XQueryParser._getName(c + d);
                j = Fleur.XQueryParser._skipSpaces(xq, j + fname.length);
                c = xq.charAt(j);
                pindex = fname.indexOf(":");
                var np = pindex === -1 ? "'" + fname + "'" : "'" + fname.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + fname.substr(0, pindex) + "']]";
                var fres = ".[Fleur.XQueryX.functionDecl,[" + (updatingfunction ? "[Fleur.XQueryX.updatingFunction,['true']]," : "") + "[Fleur.XQueryX.functionName,[" + np + "]],[Fleur.XQueryX.paramList,[";
                var nbpar = 0;
                if (c === "(") {
                  do {
                    j = Fleur.XQueryParser._skipSpaces(xq, j + 1);
                    c = xq.charAt(j);
                    if (c !== ")") {
                      if (c !== "$") {
                        return res;
                      }
                      j++;
                      c = xq.charAt(j);
                      d = xq.substr(j + 1);
                      if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
                        return res;
                      }
                      var pname = Fleur.XQueryParser._getName(c + d);
                      j = Fleur.XQueryParser._skipSpaces(xq, j + pname.length);
                      c = xq.charAt(j);
                      var tdecl = "";
                      if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                        d = xq.substr(j + 1);
                        r = Fleur.XQueryParser._getName(c + d);
                        if (r === "as") {
                          j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                          c = xq.charAt(j);
                          if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                            d = xq.substr(j + 1);
                            var ptype = Fleur.XQueryParser._getName(c + d);
                            pindex = ptype.indexOf(":");
                            np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
                            c = xq.charAt(j + ptype.length);
                            tdecl = ",[Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[" + np + "]]";
                            if ("?+*".indexOf(c) !== -1) {
                              tdecl += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
                              j++;
                            }
                            tdecl += "]]";
                            j = Fleur.XQueryParser._skipSpaces(xq, j + ptype.length);
                            c = xq.charAt(j);
                          }
                        }
                      }
                      if (nbpar !== 0) {
                        fres += ",";
                      }
                      fres += "[Fleur.XQueryX.param,[[Fleur.XQueryX.varName,['" + pname + "']]" + tdecl + "]]";
                      nbpar++;
                    }
                  } while (c === ",");
                  if (c !== ")") {
                    return res;
                  }
                  fres += "]]";
                  j = Fleur.XQueryParser._skipSpaces(xq, j + 1);
                  c = xq.charAt(j);
                  if (c === "a") {
                    d = xq.substr(j + 1);
                    r = Fleur.XQueryParser._getName(c + d);
                    if (r === "as") {
                      j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                      c = xq.charAt(j);
                      var ftdecl = "";
                      while ("{?+*".indexOf(c) === -1 && j !== end) {
                        ftdecl += c;
                        c = xq.charAt(++j);
                      }
                      np = Fleur.XQueryParser._xp2js(ftdecl, [], [], 0);
                      if (np === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.anyItemType,[]]]]]]") {
                        np = "[Fleur.XQueryX.anyItemType,[]]";
                      } else {
                        np = np.substr(np.indexOf("[Fleur.XQueryX.nameTest,") + 24);
                        np = "[Fleur.XQueryX.atomicType," + np.substr(0, np.length - 4);
                      }
                      fres += ",[Fleur.XQueryX.typeDeclaration,[" + np;
                      if ("?+*".indexOf(c) !== -1) {
                        fres += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
                        j++;
                      }
                      fres += "]]";
                      j = Fleur.XQueryParser._skipSpaces(xq, j);
                      c = xq.charAt(j);
/*                      if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                        d = xq.substr(j + 1);
                        ptype = Fleur.XQueryParser._getName(c + d);
                        pindex = ptype.indexOf(":");
                        np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
                        c = xq.charAt(j + ptype.length);
                        fres += ",[Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[" + np + "]]";
                        if ("?+*".indexOf(c) !== -1) {
                          fres += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
                          j++;
                        }
                        fres += "]]";
                        j = Fleur.XQueryParser._skipSpaces(xq, j + ptype.length);
                        c = xq.charAt(j);
                      }*/
                    }
                  }
                  if (c === "{") {
                    fres += ",[Fleur.XQueryX.functionBody,[";
                    var braces = 1;
                    var body = "";
                    while ((c !== "}" || braces !== 0) && j !== end) {
                      c = xq.charAt(++j);
                      if (c === "{") {
                        braces++;
                      } else if (c === "}") {
                        braces--;
                      }
                      if (braces !== 0) {
                        body += c;
                      }
                    }
                    if (body !== "") {
                      fres += Fleur.XQueryParser._xp2js(body, [], [], 0);
                    }
                    fres += "]]]],";
                    j = Fleur.XQueryParser._skipSpaces(xq, j + 1);
                    c = xq.charAt(j);
                    if (c === ";") {
                      return (j + 1) + fres;
                    }
                  } else if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                    d = xq.substr(j + 1);
                    r = Fleur.XQueryParser._getName(c + d);
                    if (r === "external") {
                      j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                      c = xq.charAt(j);
                      fres += ",[Fleur.XQueryX.externalDefinition,[]]]],";
                      if (c === ";") {
                        return (j + 1) + fres;
                      }
                    }
                  }
                }
              }
              break;
            case "option":
              j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                var optionname = Fleur.XQueryParser._getName(c + d);
                j = Fleur.XQueryParser._skipSpaces(xq, j + optionname.length);
                c = xq.charAt(j);
                d = xq.substr(j + 1);
                if (c === "'" || c === '"') {
                  r = Fleur.XQueryParser._getStringLiteral(c + d);
                  vl = r.substr(0, r.indexOf("."));
                  v = r.substr(vl.length + 1);
                  j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(vl, 10));
                  c = xq.charAt(j);
                  if (c === ";") {
                    pindex = optionname.indexOf(":");
                    if (pindex === -1) {
                      return (j + 1) + ".[Fleur.XQueryX.optionDecl,[[Fleur.XQueryX.optionName,['" + optionname + "']],[Fleur.XQueryX.optionContents,[" + v + "]]]],";
                    }
                    return (j + 1) + ".[Fleur.XQueryX.optionDecl,[[Fleur.XQueryX.optionName,['" + optionname.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + optionname.substr(0, pindex) + "']]]],[Fleur.XQueryX.optionContents,[" + v + "]]]],";
                  }
                }
              }
          }
        }
        break;
      case "import":
        j = Fleur.XQueryParser._skipSpaces(xq, i + r.length);
        c = xq.charAt(j);
        d = xq.substr(j + 1);
        if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
          r = Fleur.XQueryParser._getName(c + d);
          if (r === "javascript") {
            j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
            c = xq.charAt(j);
            d = xq.substr(j + 1);
            if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
              r = Fleur.XQueryParser._getName(c + d);
              if (r === "at") {
                j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                c = xq.charAt(j);
                d = xq.substr(j + 1);
                if (c === "'" || c === '"') {
                  r = Fleur.XQueryParser._getStringLiteral(c + d);
                  vl = r.substr(0, r.indexOf("."));
                  v = r.substr(vl.length + 1);
                  j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(vl, 10));
                  c = xq.charAt(j);
                  if (c === ";") {
                    return (j + 1) + ".[Fleur.XQueryX.javascriptImport,[[Fleur.XQueryX.targetLocation,[" + v + "]]]],";
                  }
                }
              } else {
                return res;
              }
            } else {
              return res;
            }
          } else if (r === "module") {
            j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
            c = xq.charAt(j);
            d = xq.substr(j + 1);
            prefix = null;
            if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
              r = Fleur.XQueryParser._getName(c + d);
              if (r === "namespace") {
                j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                c = xq.charAt(j);
                d = xq.substr(j + 1);
                if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                  prefix = Fleur.XQueryParser._getName(c + d);
                  j = Fleur.XQueryParser._skipSpaces(xq, j + prefix.length);
                  c = xq.charAt(j);
                  if (c === "=") {
                    j = Fleur.XQueryParser._skipSpaces(xq, j + 1);
                    c = xq.charAt(j);
                    d = xq.substr(j + 1);
                  } else {
                    return res;
                  }
                } else {
                  return res;
                }
              } else {
                return res;
              }
            }
            if (c === "'" || c === '"') {
              r = Fleur.XQueryParser._getStringLiteral(c + d);
              vl = r.substr(0, r.indexOf("."));
              var modname = r.substr(vl.length + 1);
              j = Fleur.XQueryParser._skipSpaces(xq, j + parseInt(vl, 10));
              c = xq.charAt(j);
              d = xq.substr(j + 1);
              v = null;
              if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
                r = Fleur.XQueryParser._getName(c + d);
                if (r === "at") {
                  j = Fleur.XQueryParser._skipSpaces(xq, j + r.length);
                  c = xq.charAt(j);
                  var locexpr = "";
                  while (c !== ";" && j !== end) {
                    locexpr += c;
                    c = xq.charAt(++j);
                  }
                  if (locexpr !== "") {
                    v = Fleur.XQueryParser._xp2js(locexpr, [], [], 0);
                  }
                }
              }
              if (c === ";") {
                return (j + 1) + ".[Fleur.XQueryX.moduleImport,[[Fleur.XQueryX.targetNamespace,[" + modname + "]]" + (prefix ? ",[Fleur.XQueryX.namespacePrefix,['" + prefix + "']]" : "") + (v ? ",[Fleur.XQueryX.targetLocationExpr,[" + v + "]]" : "") + "]],";
              }
            }
          }
        }
    }
  }
  return res;
};
Fleur.XQueryParser._xq2js = function(xq) {
  //console.log("_xq2js: " + xq);
  //xq = xq.replace(/^\s+|\s+$/gm, " ");
  var v = Fleur.XQueryParser._getVersion(xq);
  var vl = v.substr(0, v.indexOf("."));
  var prolog = "", p, pc, pl = parseInt(vl, 10);
  do {
    p = Fleur.XQueryParser._getProlog(xq, pl);
    pl = parseInt(p.substr(0, p.indexOf(".")), 10);
    pc = p.substr(p.indexOf(".") + 1);
    prolog += pc;
  } while (pc !== "");
  return "[Fleur.XQueryX.module,[" + v.substr(v.indexOf(".") + 1) + "[Fleur.XQueryX.mainModule,[" + (prolog === "" ? "" : "[Fleur.XQueryX.prolog,[" + prolog.substr(0, prolog.length - 1) + "]],") + "[Fleur.XQueryX.queryBody,[" + Fleur.XQueryParser._xp2js(xq.substr(pl), [], [], 0) + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]],[Fleur.XQueryX.xqxuf,["http://www.w3.org/2007/xquery-update-10"]],[Fleur.XQueryX.schemaLocation,["http://www.w3.org/2007/xquery-update-10 http://www.w3.org/2007/xquery-update-10/xquery-update-10-xqueryx.xsd http://www.w3.org/2005/XQueryX http://www.w3.org/2005/XQueryX/xqueryx.xsd"]],[Fleur.XQueryX.xsi,["http://www.w3.org/2001/XMLSchema-instance"]]]]';
};