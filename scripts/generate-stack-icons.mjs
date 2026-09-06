import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Offline composition: the original MIT-licensed Skill Icons are vendored in
// assets/icons. See assets/icons/NOTICE.md for source and license details.
const root = fileURLToPath(new URL('../', import.meta.url));
const groups = {
  web: [
    ['React', 'React-Dark.svg'], ['Next.js', 'NextJS-Dark.svg'],
    ['TypeScript', 'TypeScript.svg'], ['JavaScript', 'JavaScript.svg'],
    ['Tailwind CSS', 'TailwindCSS-Dark.svg'], ['Redux', 'Redux.svg'],
  ],
  'mobile-desktop': [
    ['React Native', 'React-Dark.svg'], ['Electron', 'Electron.svg'],
  ],
  'ai-data': [
    ['Python', 'Python-Dark.svg'], ['PyTorch', 'PyTorch-Dark.svg'],
    ['TensorFlow', 'TensorFlow-Dark.svg'], ['PostgreSQL', 'PostgreSQL-Dark.svg'],
    ['MongoDB', 'MongoDB.svg'], ['Redis', 'Redis-Dark.svg'],
  ],
  backend: [
    ['Node.js', 'NodeJS-Dark.svg'], ['Express', 'ExpressJS-Dark.svg'],
    ['Docker', 'Docker.svg'], ['AWS', 'AWS-Dark.svg'], ['Git', 'Git.svg'],
  ],
};

const tile = 54;
const gap = 16;
const height = 64;
// Equal canvases keep tile scale consistent when README table cells use 100%.
const width = 6 * tile + 5 * gap;
const escapeXml = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

for (const [group, icons] of Object.entries(groups)) {
  const pieces = [];
  for (const [index, [label, filename]] of icons.entries()) {
    const original = await readFile(path.join(root, 'assets/icons', filename), 'utf8');
    if (/<(?:script|foreignObject|image)\b/i.test(original) || /(?:href\s*=\s*["'](?:https?:|data:)|on\w+\s*=)/i.test(original)) {
      throw new Error(`Unexpected active or external content in ${filename}`);
    }
    const match = original.trim().match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
    if (!match) throw new Error(`Invalid source SVG: ${filename}`);
    const viewBox = match[1].match(/\bviewBox="([^"]+)"/)?.[1];
    if (!viewBox) throw new Error(`Missing viewBox: ${filename}`);
    // Prefix IDs when composing the originals so paint/clip references cannot
    // accidentally resolve to definitions belonging to a neighbouring tile.
    const prefix = `${group}-${index}-`;
    const body = match[2]
      .replace(/\bid="([^"]+)"/g, (_, id) => `id="${prefix}${id}"`)
      .replace(/url\(#([^\)]+)\)/g, (_, id) => `url(#${prefix}${id})`)
      .replace(/\b((?:xlink:)?href)="#([^"]+)"/g, (_, attr, id) => `${attr}="#${prefix}${id}"`);
    pieces.push(`<svg x="${index * (tile + gap)}" y="5" width="${tile}" height="${tile}" viewBox="${viewBox}" fill="none"><title>${escapeXml(label)}</title>${body}</svg>`);
  }
  const names = icons.map(([name]) => name).join(', ');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="stack-${group}-title">\n<title id="stack-${group}-title">${escapeXml(names)}</title>\n<!-- Skill Icons, copyright (c) 2022 tandpfun. MIT license: assets/icons/LICENSE -->\n${pieces.join('\n')}\n</svg>\n`;
  const output = `assets/stack-${group}.svg`;
  await writeFile(path.join(root, output), svg);
  console.log(`${output} — ${width} × ${height}: ${names}`);
}
