import { IXmlXmlDocument } from '../classes/IXmlXmlDocument.js';
import { parseWithGrammar } from './parseWithGrammar.js';
import { iXmlGrammar } from './iXmlGrammar.js';

export const fromIXml = source => {
  const grammar = new IXmlXmlDocument();
  parseWithGrammar(iXmlGrammar, source, null, null, grammar);
  grammar.generateRules();
  return grammar;
};