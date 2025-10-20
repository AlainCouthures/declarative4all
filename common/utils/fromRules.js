import { IXmlXmlDocument } from '../classes/IXmlXmlDocument.js';

export const fromRules = ([rules, normalizingRules]) => {
  const grammar = new IXmlXmlDocument();
  grammar.rules = rules;
  grammar.generateParseFunction();
  grammar.normalizingRules = normalizingRules;
  grammar.generateNormalizeFunction();
  return grammar;
};