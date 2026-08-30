const DEG = Math.PI / 180;

function inBox(
  lat: number,
  lng: number,
  south: number,
  north: number,
  west: number,
  east: number,
) {
  return lat >= south && lat <= north && lng >= west && lng <= east;
}

/** Coarse land test — enough for a particle globe, not a GIS dataset. */
export function isLand(lat: number, lng: number) {
  if (lat < -60) return lng >= -80 && lng <= -10 && lat > -84;

  if (inBox(lat, lng, 60, 84, -74, -20)) return !(lat < 68 && lng > -45 && lng < -30);
  if (inBox(lat, lng, 50, 72, -168, -52)) {
    return !(lng > -70 && lat < 58 && lng < -52);
  }
  if (inBox(lat, lng, 24, 50, -125, -66)) {
    return !(lng > -82 && lat < 30 && lng < -66);
  }
  if (inBox(lat, lng, 14, 32, -118, -86)) return lat > 16 || lng < -92;
  if (inBox(lat, lng, 7, 22, -92, -77)) return true;

  if (inBox(lat, lng, -56, 12, -82, -34)) {
    if (lat > 8 && lng < -75) return false;
    if (lat < -20 && lng > -40) return false;
    return true;
  }

  if (inBox(lat, lng, -35, 37, -18, 52)) {
    if (lat < -5 && lng < 8) return lng > 11 || lat > -18;
    if (lat > 32 && lng < 0) return lng > -10;
    if (lat > 15 && lng > 44 && lat < 28) return false;
    return true;
  }
  if (inBox(lat, lng, -26, -12, 43, 50.5)) return true;

  if (inBox(lat, lng, 36, 71, -10, 40)) {
    if (lat < 44 && lng < 0) return lng > -9;
    if (lat > 62 && lng > 28) return false;
    return true;
  }
  if (inBox(lat, lng, 54, 71, 4, 32)) return true;

  if (inBox(lat, lng, 8, 77, 26, 190) || inBox(lat, lng, 8, 77, -180, -170)) {
    if (lat < 22 && lng < 45) return false;
    if (lat < 12 && lng > 95 && lng < 120) return lat > 0;
    return true;
  }
  if (inBox(lat, lng, -10, 28, 95, 130)) return !(lat < 0 && lng < 104);
  if (inBox(lat, lng, -11, 8, 95, 141)) return lng > 110 || lat > -3;

  if (inBox(lat, lng, -44, -11, 113, 154)) {
    return !(lat > -18 && lng < 122) && !(lat < -36 && lng < 136);
  }
  if (inBox(lat, lng, -47, -34, 166, 179)) return true;

  if (inBox(lat, lng, 18, 22, -160, -154)) return true;
  if (inBox(lat, lng, 17, 20, -67, -65)) return true;

  return false;
}

export function latLngToVector(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * DEG;
  const theta = (lng + 180) * DEG;
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ] as const;
}

function seeded(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function createLandPositions(radius: number, density = 1.15, seed = 20260831) {
  const points: number[] = [];
  const rand = seeded(seed);

  for (let lat = -84; lat <= 84; lat += density) {
    const step = density / Math.max(0.35, Math.cos(lat * DEG));
    for (let lng = -180; lng < 180; lng += step) {
      const jitterLat = lat + (rand() - 0.5) * density * 0.7;
      const jitterLng = lng + (rand() - 0.5) * step * 0.7;
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
