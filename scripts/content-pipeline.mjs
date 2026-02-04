import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');
const assetsDir = path.join(root, 'assets', 'img', 'styles');

const sourcesPath = path.join(dataDir, 'sources.json');
const stylesPath = path.join(dataDir, 'styles.json');
const reportPath = path.join(dataDir, 'pipeline-report.json');

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function cleanupText(text) {
  return text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function absoluteUrl(base, candidate) {
  try {
    return new URL(candidate, base).toString();
  } catch {
    return '';
  }
}

function parseStylesFromHtml(html, baseUrl) {
  const anchorRe = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const imgRe = /<img\b[^>]*src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?[^>]*>/i;

  const styles = [];
  const seen = new Set();

  let match;
  while ((match = anchorRe.exec(html)) !== null && styles.length < 12) {
    const href = absoluteUrl(baseUrl, match[1]);
    const inner = match[2] || '';
    const imgMatch = inner.match(imgRe);
    const titleRaw = (imgMatch?.[2] || cleanupText(inner)).trim();
    const title = titleRaw.length > 2 ? titleRaw : '';

    if (!href || !title) continue;
    if (!/kuh|kitchen|catalog|model|collection|style|кух/i.test(href + ' ' + title)) continue;

    const slug = slugify(title);
    if (!slug || seen.has(slug)) continue;

    const imgSrc = imgMatch?.[1] ? absoluteUrl(baseUrl, imgMatch[1]) : '';
    styles.push({ slug, title, href, imageSource: imgSrc });
    seen.add(slug);
  }

  return styles;
}

async function downloadImage(url, outputFile) {
  if (!url) return false;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'FabriqContentBot/1.0' } });
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    await writeFile(outputFile, Buffer.from(arrayBuffer));
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const report = { startedAt: new Date().toISOString(), sources: [], warnings: [] };

  const sourcesJson = JSON.parse(await readFile(sourcesPath, 'utf8'));
  const sources = sourcesJson.sources || [];

  let stylesJson;
  try {
    stylesJson = JSON.parse(await readFile(stylesPath, 'utf8'));
  } catch {
    stylesJson = { zov: [], geosideal: [] };
  }

  for (const source of sources) {
    const { factory, url } = source;
    const nextStyles = [];

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'FabriqContentBot/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      const parsed = parseStylesFromHtml(html, url);
      if (!parsed.length) {
        report.warnings.push(`${factory}: карточки стилей не найдены автоматически`);
      }

      await mkdir(path.join(assetsDir, factory), { recursive: true });

      for (const style of parsed) {
        const ext = style.imageSource?.split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `${style.slug}.${ext}`;
        const outPath = path.join(assetsDir, factory, fileName);
        const downloaded = await downloadImage(style.imageSource, outPath);
        const imagePath = downloaded
          ? path.posix.join('assets', 'img', 'styles', factory, fileName)
          : path.posix.join('assets', 'img', 'styles', factory, `${style.slug}.svg`);

        nextStyles.push({
          slug: style.slug,
          title: style.title,
          description: `Стиль из каталога ${factory.toUpperCase()}`,
          image: imagePath,
          page: `styles/${factory}/${style.slug}.html`,
          sourceUrl: style.href
        });
      }

      if (nextStyles.length) {
        stylesJson[factory] = nextStyles;
      }

      report.sources.push({ factory, url, parsed: parsed.length, saved: nextStyles.length });
    } catch (error) {
      report.warnings.push(`${factory}: ${error.message}`);
      report.sources.push({ factory, url, parsed: 0, saved: 0 });
    }
  }

  report.finishedAt = new Date().toISOString();
  await writeFile(stylesPath, JSON.stringify(stylesJson, null, 2), 'utf8');
  await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('Pipeline finished. See data/pipeline-report.json');
}

run().catch((error) => {
  console.error('Pipeline failed:', error.message);
  process.exit(1);
});
