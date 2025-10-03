import { IXmlXmlDocument } from '../classes/IXmlXmlDocument.js';
import { replicate } from './replicate.js';

export const fromNode = node => {
  const grammar = new IXmlXmlDocument();
  replicate(node.documentElement ?? node, grammar);
  grammar.generateRules();
  return grammar;
};