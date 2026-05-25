/**
 * Generate static PDF from the built CV.
 * Usage: npm run generate-pdf
 */
import puppeteer from 'puppeteer';
import { spawn, execFileSync } from 'child_process';
import { writeFileSync, renameSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4173;

function startPreview() {
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    cwd: ROOT, stdio: 'pipe',
  });
  return new Promise((resolve) => {
    proc.stdout.on('data', d => { if (d.toString().includes('Local:')) resolve(proc); });
    proc.stderr.on('data', d => { if (d.toString().includes('Local:')) resolve(proc); });
    setTimeout(() => resolve(proc), 3000); // fallback
  });
}

async function generatePDF(lang) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // 2x scale → images rendered at double resolution → sharper in PDF
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
  // Force light mode — PDF must never be dark
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
  await page.goto(`http://localhost:${PORT}?lang=${lang}`, {
    waitUntil: 'networkidle0', timeout: 30000,
  });
  await page.evaluate(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('cv-dark-mode', 'false');
  });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 600));

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  await browser.close();
  return pdf;
}

console.log('Starting preview server...');
const server = await startPreview();

for (const lang of ['en', 'vi']) {
  console.log(`Generating CV [${lang.toUpperCase()}]...`);
  const pdf = await generatePDF(lang);
  const out = join(ROOT, 'public', `cv-${lang}.pdf`);
  const tmp = out + '.tmp.pdf';
  writeFileSync(tmp, pdf);
  console.log(`  Raw: ${(pdf.length / 1024).toFixed(0)} KB — compressing...`);

  // Compress with Ghostscript
  execFileSync('gs', [
    '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4',
    '-dPDFSETTINGS=/prepress', '-dNOPAUSE', '-dQUIET', '-dBATCH',
    `-sOutputFile=${out}`, tmp,
  ]);
  renameSync(tmp, tmp); // tmp already replaced by gs output
  if (existsSync(tmp)) renameSync(tmp, tmp + '.del');

  const { statSync } = await import('fs');
  console.log(`✓ Saved cv-${lang}.pdf (${(statSync(out).size / 1024).toFixed(0)} KB)`);
}

server.kill();
console.log('Done!');
process.exit(0);
