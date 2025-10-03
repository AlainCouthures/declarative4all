import { ELEMENT_NODE, ATTRIBUTE_NODE, TEXT_NODE } from './constants.js';

export const replicate = (src, dest) => {
  const doc = dest.ownerDocument ?? dest;
  switch (src.nodeType) {
    case ELEMENT_NODE: {
      const newNode = doc.createElementNS(src.namespaceURI, src.nodeName);
      if (src.namespaces) {
        for (const ns of src.namespaces) {
          newNode.setAttributeNS('http://www.w3.org/2000/xmlns/', ns.prefix ? `xmlns:${ns.prefix}` : 'xmlns', ns.URI);
        }
      }
      for (const attr of src.attributes) {
        replicate(attr, newNode);
      }
      for (const child of src.childNodes) {
        replicate(child, newNode);
      }
      dest.appendChild(newNode);
      break;
    }
    case ATTRIBUTE_NODE: {
      dest.setAttributeNS(src.namespaceURI, src.name, src.value);
      break;
    }
    case TEXT_NODE: {
      dest.appendChild(doc.createTextNode(src.textContent));
      break;
    }
  }
}