import { deflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WIDTH = 1440;
const HEIGHT = 720;
const root = dirname(fileURLToPath(import.meta.url));
const source = process.argv[2];
const geojson = JSON.parse(readFileSync(source, "utf8"));
const grid = new Uint8Array(WIDTH * HEIGHT);

function projectX(lng) {
  return ((lng + 180) / 360) * WIDTH;
}

function projectY(lat) {
  return ((90 - lat) / 180) * HEIGHT;
}

function fillRing(ring, land) {
  const pts = ring.map(([lng, lat]) => [projectX(lng), projectY(lat)]);
  if (pts.length < 3) return;

  let minY = HEIGHT;
  let maxY = 0;
  for (const [, y] of pts) {
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const y0 = Math.max(0, Math.floor(minY));
  const y1 = Math.min(HEIGHT - 1, Math.ceil(maxY));
  const value = land ? 255 : 0;

  for (let y = y0; y <= y1; y += 1) {
    const hits = [];
    for (let i = 0; i < pts.length; i += 1) {
      const [xA, yA] = pts[i];
      const [xB, yB] = pts[(i + 1) % pts.length];
      if (yA === yB) continue;
      if ((yA <= y && yB > y) || (yB <= y && yA > y)) {
        hits.push(xA + ((y - yA) / (yB - yA)) * (xB - xA));
      }
    }
    hits.sort((a, b) => a - b);
    for (let i = 0; i + 1 < hits.length; i += 2) {
      const x0 = Math.max(0, Math.floor(hits[i]));
      const x1 = Math.min(WIDTH - 1, Math.ceil(hits[i + 1]));
      const row = y * WIDTH;
      for (let x = x0; x <= x1; x += 1) grid[row + x] = value;
    }
  }
}

for (const feature of geojson.features) {
  const rings = feature.geometry.coordinates;
  fillRing(rings[0], true);
  for (let i = 1; i < rings.length; i += 1) fillRing(rings[i], false);
}

function crc32(bytes) {
  let crc = ~0;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const header = Buffer.from(type);
  const body = Buffer.concat([header, data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 8 + data.length);
  return out;
}

const raw = Buffer.alloc((WIDTH + 1) * HEIGHT);
for (let y = 0; y < HEIGHT; y += 1) {
  raw[y * (WIDTH + 1)] = 0;
  raw.set(grid.subarray(y * WIDTH, (y + 1) * WIDTH), y * (WIDTH + 1) + 1);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8;
ihdr[9] = 0;

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const dest = resolve(root, "../src/components/landing/earth-land-mask.png");
writeFileSync(dest, png);

let land = 0;
for (const value of grid) if (value) land += 1;
console.log(`wrote ${dest} (${png.length} bytes, ${((land / grid.length) * 100).toFixed(1)}% land)`);
