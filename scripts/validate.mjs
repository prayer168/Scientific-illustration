import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const panelCount = (html.match(/class="panel/g) || []).length;
const imageTags = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
const localRefs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map((match) => match[1])
  .filter((ref) => !/^(?:https?:|mailto:|data:)/.test(ref));

assert(panelCount === 12, `預期 12 個教材單元，找到 ${panelCount} 個。`);
assert(imageTags.length >= 16, `預期至少 16 張頁面圖像，找到 ${imageTags.length} 張。`);
assert(imageTags.every((tag) => /\balt="[^"]*"/.test(tag)), "每張 img 都必須有 alt 屬性。");
assert(/lang="zh-Hant-TW"/.test(html), "html 必須宣告 zh-Hant-TW。" );
assert(/class="skip-link"/.test(html), "缺少跳到主要內容連結。" );
assert(/aria-live=/.test(html), "缺少即時回饋的 aria-live 區域。" );

for (const ref of localRefs) {
  const clean = decodeURIComponent(ref.split("?")[0]);
  assert(fs.existsSync(path.join(root, clean)), `找不到本機資源：${clean}`);
}

const quiz = JSON.parse(fs.readFileSync(path.join(root, "data", "quiz.json"), "utf8"));
const resources = JSON.parse(fs.readFileSync(path.join(root, "data", "resources.json"), "utf8"));
const walk = (folder) => fs.readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
  const target = path.join(folder, entry.name);
  return entry.isDirectory() ? walk(target) : [target];
});
const webpFiles = walk(path.join(root, "images")).filter((file) => file.endsWith(".webp"));
assert(quiz.length >= 10, `預期至少 10 題，找到 ${quiz.length} 題。`);
assert(resources.length >= 15, `預期至少 15 筆資源，找到 ${resources.length} 筆。`);
assert(webpFiles.length >= 16, `預期至少 16 張原創 WebP，找到 ${webpFiles.length} 張。`);
assert(resources.every((item) => /^https:\/\//.test(item.url) && item.checkedAt), "每筆資源必須有 HTTPS 網址與查核日期。" );

if (failures.length) {
  console.error(failures.map((item) => `✗ ${item}`).join("\n"));
  process.exit(1);
}

console.log(`✓ ${panelCount} 個單元`);
console.log(`✓ ${imageTags.length} 張頁面圖像均有替代文字`);
console.log(`✓ ${webpFiles.length} 張原創 WebP 教學圖像`);
console.log(`✓ ${quiz.length} 題測驗與 ${resources.length} 筆已查核資源`);
console.log(`✓ ${localRefs.length} 個本機路徑均存在`);
