// Rebuild the repository-owned contact buttons and public project cards.
// The animated header and launch cards are authored directly as SVG files.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const directory = fileURLToPath(new URL('../assets/', import.meta.url));
await mkdir(directory, { recursive: true });
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const svg = (width, height, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-labelledby="title"><title id="title">${escape(title)}</title>${body}</svg>\n`;
for (const [name, label, accent] of [
  ['portfolio', 'PORTFOLIO ↗', '#8ce8ef'], ['resume', 'RÉSUMÉ ↗', '#c8b3ff'],
  ['linkedin', 'LINKEDIN ↗', '#a8c8ff'], ['email', 'EMAIL AMAN ↗', '#c4ed9d'],
]) {
  await writeFile(`${directory}contact-${name}.svg`, svg(160, 42, label,
    `<rect x=".5" y=".5" width="159" height="41" rx="7" fill="#111b2e" stroke="${accent}" stroke-opacity=".65"/><text x="80" y="26" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="${accent}" letter-spacing=".7">${escape(label)}</text>`));
}
const cards = [
  { file:'project-focus', n:'01', title:['Virtual Focus','Room'], tag:'WEB / MOBILE / DESKTOP', lines:['WebRTC collaboration','React Native + Electron'], accent:'#90e7ed' },
  { file:'project-algocode', n:'02', title:['AlgoCode'], tag:'BACKEND / ASYNC SYSTEMS', lines:['Queued code evaluation','Python + Java in Docker'], accent:'#c6b0ff' },
  { file:'project-ide', n:'03', title:['Cloud IDE'], tag:'DEVELOPER TOOLS', lines:['Monaco + file explorer','Container terminal + preview'], accent:'#c7edaa' },
];
for (const card of cards) {
  const title = card.title.map((line, i) => `<text x="22" y="${78 + i * 30}" font-size="28" font-weight="700" letter-spacing="-.7" fill="#f1f5ff">${escape(line)}</text>`).join('');
  const body = `<rect x=".5" y=".5" width="309" height="209" rx="13" fill="#101a2b" stroke="#3b4963"/>
<rect x="22" y="20" width="27" height="24" rx="5" fill="${card.accent}"/><g font-family="Arial,Helvetica,sans-serif"><text x="35.5" y="37" text-anchor="middle" fill="#132030" font-size="13" font-weight="700">${card.n}</text><text x="61" y="36" fill="${card.accent}" font-size="10" font-weight="700" letter-spacing=".6">${card.tag}</text>${title}
<text x="22" y="140" fill="#bac6dc" font-size="15">${escape(card.lines[0])}</text><text x="22" y="164" fill="#bac6dc" font-size="15">${escape(card.lines[1])}</text><text x="22" y="194" fill="${card.accent}" font-size="13" font-weight="700">EXPLORE THE SOURCE ↗</text></g>`;
  await writeFile(`${directory}${card.file}.svg`, svg(310, 210, `${card.title.join(' ')} — ${card.lines.join('. ')}`, body));
}
console.log('Generated 4 contact buttons and 3 public project cards.');
