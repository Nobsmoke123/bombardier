import landMaskAsset from "./earth-land-mask.png";

const DEG = Math.PI / 180;
const MASK_URL = typeof landMaskAsset === "string" ? landMaskAsset : landMaskAsset.src;

type LandMask = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

let landMask: LandMask | null = null;
let maskPromise: Promise<LandMask> | null = null;

export function latLngToVector(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * DEG;
  const theta = (lng + 180) * DEG;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ] as const;
}

export function isLand(lat: number, lng: number) {
  if (!landMask) return false;
  const x = Math.min(
    landMask.width - 1,
    Math.max(0, Math.floor(((lng + 180) / 360) * landMask.width)),
  );
  const y = Math.min(
    landMask.height - 1,
    Math.max(0, Math.floor(((90 - lat) / 180) * landMask.height)),
  );
  return landMask.data[(y * landMask.width + x) * 4] > 127;
}

export function loadLandMask() {
  if (!maskPromise) {
    maskPromise = decodeMask().then((mask) => {
      landMask = mask;
      return mask;
    });
  }
  return maskPromise;
}

async function decodeMask(): Promise<LandMask> {
  const image = new Image();
  image.src = MASK_URL;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Could not read land mask");
  context.drawImage(image, 0, 0);
  const pixels = context.getImageData(0, 0, image.width, image.height);
  return { width: pixels.width, height: pixels.height, data: pixels.data };
}

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createLandPositions(radius: number, density = 0.7, seed = 20260831) {
  const points: number[] = [];
  const rand = seeded(seed);

  for (let lat = -84; lat <= 84; lat += density) {
    const step = density / Math.max(0.35, Math.cos(lat * DEG));
    for (let lng = -180; lng < 180; lng += step) {
      const jitterLat = lat + (rand() - 0.5) * density * 0.28;
      const jitterLng = lng + (rand() - 0.5) * step * 0.28;
      if (!isLand(jitterLat, jitterLng)) continue;
      const [x, y, z] = latLngToVector(jitterLat, jitterLng, radius);
      points.push(x, y, z);
    }
  }

  return new Float32Array(points);
}

export function createStarPositions(count = 700) {
  const points = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = 8 + Math.random() * 14;
    const [x, y, z] = latLngToVector(
      Math.acos(2 * Math.random() - 1) * (180 / Math.PI) - 90,
      Math.random() * 360 - 180,
      r,
    );
    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
}
