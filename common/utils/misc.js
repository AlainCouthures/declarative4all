export const kebabToPascalCase = s => s.split('-').map(([c, ...r]) => c.toUpperCase() + r.join('')).join('');
export const pascalToKebabCase = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
export const kebabToCamelCase = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
export const ixmlQuoted = s => s.includes('"') ? s.includes("'") ? `"${s.replaceAll('"', '""')}"` : `'${s}'`: `"${s}"`;
export const jsQuoted = s => s.includes("'") ? s.includes('"') ? `'${s.replaceAll("'", "\\'").replace(/\r?\n/g, '\\n')}'` : `"${s.replace(/\r?\n/g, '\\n')}"` : `'${s.replace(/\r?\n/g, '\\n')}'`;