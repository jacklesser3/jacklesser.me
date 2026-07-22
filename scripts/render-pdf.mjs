import puppeteer from "puppeteer-core";
import path from "node:path";

const [, , htmlPath, outPath, widthArg, heightArg] = process.argv;
if (!htmlPath || !outPath) {
  console.error("usage: node scripts/render-pdf.mjs <html> <out.pdf> [width] [height]");
  process.exit(1);
}

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const fileUrl = "file://" + path.resolve(htmlPath);

const W = widthArg ? Number(widthArg) : 1440;
const H = heightArg ? Number(heightArg) : 900;

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
await page.goto(fileUrl, { waitUntil: "networkidle0" });
await page.evaluateHandle("document.fonts.ready");

const pageBg = await page.evaluate(() => {
  const bg = getComputedStyle(document.body).backgroundColor;
  return bg && bg !== "rgba(0, 0, 0, 0)" ? bg : "#09090b";
});

await page.addStyleTag({
  content: `
    html, body { background: ${pageBg} !important; }
    @page { size: ${W}px ${H}px; margin: 0; }
    @media print {
      .home-link, .nav-dots, .arrow-hint, .scroll-hint, .divider, footer, .hero-coming { display: none !important; }
      html, body { background: ${pageBg} !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      /* PDF renderers often fail at background-clip: text — fall back to a solid color so the gradient does not show as a rectangle behind the text. */
      .hero h1 {
        background: none !important;
        -webkit-background-clip: initial !important;
        background-clip: initial !important;
        -webkit-text-fill-color: var(--accent) !important;
        color: var(--accent) !important;
      }
    }
  `,
});

await page.pdf({
  path: path.resolve(outPath),
  width: `${W}px`,
  height: `${H}px`,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

await browser.close();
console.log("wrote", outPath);
