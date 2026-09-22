import { readFile, writeFile } from 'node:fs/promises';
import { render } from '../dist-ssr/entry-server.js';

const htmlPath = new URL('../dist/index.html', import.meta.url);
const template = await readFile(htmlPath, 'utf8');
const placeholder = '<div id="root"></div>';

if (!template.includes(placeholder)) {
  throw new Error('Prerender failed: root placeholder missing from dist/index.html');
}

const markup = render();
if (!markup.includes('<h1') || !markup.includes('id="why-leti"')) {
  throw new Error('Prerender failed: the landing page content is missing');
}

await writeFile(htmlPath, template.replace(placeholder, `<div id="root">${markup}</div>`));
console.log(`Prerendered ${Buffer.byteLength(markup)} bytes of page content.`);
