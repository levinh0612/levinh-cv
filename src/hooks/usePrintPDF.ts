import { useCallback } from 'react';

// Compress all <img> in the CV to small JPEGs before print, restore after.
// The achievement proof images are 800KB–1.2MB each but displayed at 68×52px —
// embedding them full-size is the main reason the PDF hits 3.5MB.
async function compressImages(root: HTMLElement, maxPx = 400, quality = 0.72) {
  const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('img'));
  const origSrcs: string[] = [];

  await Promise.all(imgs.map((img, i) => new Promise<void>(resolve => {
    origSrcs[i] = img.src;

    const compress = (source: HTMLImageElement) => {
      const w = Math.min(source.naturalWidth || maxPx, maxPx);
      const ratio = (source.naturalHeight || maxPx) / (source.naturalWidth || maxPx);
      const h = Math.round(w * ratio);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d')!.drawImage(source, 0, 0, w, h);
      img.src = c.toDataURL('image/jpeg', quality);
      resolve();
    };

    if (img.complete && img.naturalWidth) {
      compress(img);
    } else {
      const tmp = new Image();
      tmp.crossOrigin = 'anonymous';
      tmp.onload = () => compress(tmp);
      tmp.onerror = () => resolve(); // skip if can't load
      tmp.src = origSrcs[i];
    }
  })));

  return () => imgs.forEach((img, i) => { img.src = origSrcs[i]; });
}

export const usePrintPDF = () => {
  const downloadPDF = useCallback(async (lang: 'en' | 'vi', isDark: boolean) => {
    const root = document.getElementById('cv-content');
    if (!root) return;

    const wasDark = isDark;
    if (wasDark) document.documentElement.removeAttribute('data-theme');

    const langTag = lang === 'vi' ? 'VI' : 'EN';
    const originalTitle = document.title;
    document.title = `[FullStack][NguyenHuuLeVinh][${langTag}]`;

    // Compress images → print → restore
    const restoreImgs = await compressImages(root);

    window.print();

    // Restore happens after print dialog closes
    setTimeout(() => {
      restoreImgs();
      document.title = originalTitle;
      if (wasDark) document.documentElement.setAttribute('data-theme', 'dark');
    }, 500);
  }, []);

  return { downloadPDF };
};
