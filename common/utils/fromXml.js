import { IXmlXmlDocument } from '../classes/IXmlXmlDocument.js';

export const fromXml = source => {
  const grammar = new IXmlXmlDocument();
  grammar.fromString(source);
  grammar.generateRules();
  return grammar;
};