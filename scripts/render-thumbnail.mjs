import puppeteer from "puppeteer-core";
import { fileURLToPath } from "node:url";
import path from "node:path";

const [, , htmlPath, outPath] = process.argv;
if (!htmlPath || !outPath) {
  console.error("usage: node scripts/render-thumbnail.mjs <html> <out.jpg>");
  process.exit(1);
}

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const fileUrl = "file://" + path.resolve(htmlPath);

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await page.goto(fileUrl, { waitUntil: "networkidle0" });
await page.evaluateHandle("document.fonts.ready");
await page.screenshot({
  path: path.resolve(outPath),
  type: "jpeg",
  quality: 92,
  clip: { x: 0, y: 0, width: 1280, height: 720 },
  omitBackground: false,
});

await browser.close();
console.log("wrote", outPath);
