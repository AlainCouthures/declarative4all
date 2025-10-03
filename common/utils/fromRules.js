import { IXmlXmlDocument } from '../classes/IXmlXmlDocument.js';

export const fromRules = rules => {
  const grammar = new IXmlXmlDocument();
  grammar.generateRules(rules);
  return grammar;
};