#!/usr/bin/env node
async function mainCLI(argv = []) {
  const { readFile, stat } = await import('node:fs/promises');
  let inputFile;
  let outputFile;
  for(let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('-')) {
      if (arg === '--help' || arg === '-h') {
        console.log('Usage: node xsltforms-xsl-cli.js <input-file>');
        return;
      }
      if (arg === '--version' || arg === '-v') {
        const pkg = await import('../package.json', { assert: { type: 'json' } });
        console.log(`xsltforms-xsl version ${pkg.version}`);
        return;
      }
      if ((arg === '--output' || arg === '-o') && i + 1 < argv.length) {
        outputFile = argv[++i];
        continue;
      }
      console.error(`Unknown option: ${arg}`);
      process.exitCode = 1;
      return;
    } else {
      if (!inputFile) {
        inputFile = arg;
      } else {
        console.error(`Unexpected argument: ${arg}`);
        process.exitCode = 1;
        return;
      }
    }
  }
  if (!inputFile) {
    console.error('Usage: node xsltforms-xsl-cli.js <input-file>');
    process.exitCode = 1;
    return;
  }
  if (! await stat(inputFile).catch(() => false)) {
    console.error(`File not found: ${inputFile}`);
    process.exitCode = 1;
    return;
  }
  const inputSource = await readFile(inputFile, 'utf-8');
  const res = xsltforms_xsl.fromXhtmlToHtml(inputSource);

  if (outputFile) {
    await import('node:fs/promises').then(fs => fs.writeFile(outputFile, res, 'utf-8'));
    return;
  }
  console.log(res);
}

let xsltforms_xsl;
try {
  xsltforms_xsl = await import('./xsltforms-xsl.mjs');
  try {
    await mainCLI(process.argv.slice(2));
  } catch (err) {
    console.error('Runtime error:', err?.stack || err);
    process.exitCode = 1;
  }
} catch (err) {
  console.error('Failed to load xsltforms-xsl.mjs module:', err?.stack || err);
  process.exitCode = 1;
}