import { XFormsSerializerDocument } from '../classes/XFormsSerializerDocument.js';
import { loadFromString } from './loadFromString.js';

export const fromXhtmlToHtml = (source, path) => {
  const document = new XFormsSerializerDocument(path ?? '');
  loadFromString(document, source);
  return document.serialize('\n', '  ');
};