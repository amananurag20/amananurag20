// Keep the opt-in static profile aligned with the main README.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
let markdown = await readFile(new URL('README.md', root), 'utf8');
for (const name of ['profile-header', 'developer-desk', 'career-rush']) {
  const source = await readFile(new URL(`assets/${name}.svg`, root), 'utf8');
  const still = source.replace('</svg>', '<style>*{animation:none!important;transition:none!important}</style></svg>');
  await writeFile(new URL(`assets/${name}-static.svg`, root), still);
  markdown = markdown.replaceAll(`./assets/${name}.svg`, `./assets/${name}-static.svg`);
}
markdown = markdown.replace('[Static profile](./PROFILE_STATIC.md)', '[Animated profile](./README.md)');
markdown = markdown.replace(/<p>\s*<img src="\.\/profile\/stats\.svg"[\s\S]*?<\/p>/, '[View my GitHub activity and repositories](https://github.com/amananurag20)');
await writeFile(new URL('PROFILE_STATIC.md', root), markdown);
console.log('Static profile and3 motion-free SVG alternatives generated.');
