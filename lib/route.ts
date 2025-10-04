import { Location } from "@/data/samples";

// ハーサイン距離計算（地球半径6371km）
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// 貪欲法（Nearest Neighbor）でルートを最適化
export interface RouteResult {
  orderedLocations: Location[];
  totalDistance: number;
}

export function optimizeRoute(
  locations: Location[],
  startLocation?: Location,
  endLocation?: Location
): RouteResult {
  if (locations.length === 0) {
    return { orderedLocations: [], totalDistance: 0 };
  }

  if (locations.length === 1) {
    return { orderedLocations: locations, totalDistance: 0 };
  }

  const visited = new Set<number>();
  const orderedLocations: Location[] = [];
  let totalDistance = 0;

  // 開始地点を決定
  let currentIndex: number;
  if (startLocation) {
    // 出発地が指定されている場合、それに最も近い地点から開始
    currentIndex = findClosestIndex(startLocation, locations);
  } else {
    // 指定がなければ最初の地点から開始
    currentIndex = 0;
  }

  visited.add(currentIndex);
  orderedLocations.push(locations[currentIndex]);

  // 目的地が指定されている場合、そのインデックスを記録
  let endIndex: number | undefined;
  if (endLocation) {
    endIndex = findClosestIndex(endLocation, locations);
    // 目的地が開始地点と同じ場合は未定義に戻す
    if (endIndex === currentIndex) {
      endIndex = undefined;
    }
  }

  // 貪欲法で最も近い未訪問地点を順に選択
  while (visited.size < locations.length) {
    let closestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < locations.length; i++) {
      // 目的地が指定されていて、残り1つの場合は目的地を選択
      if (endIndex !== undefined && visited.size === locations.length - 1) {
        if (i === endIndex && !visited.has(i)) {
          closestIndex = i;
          minDistance = haversineDistance(
            locations[currentIndex].lat,
            locations[currentIndex].lng,
            locations[i].lat,
            locations[i].lng
          );
          break;
        }
        continue;
      }

      // 目的地は最後まで残す
      if (endIndex !== undefined && i === endIndex) {
        continue;
      }

      if (!visited.has(i)) {
        const distance = haversineDistance(
          locations[currentIndex].lat,
          locations[currentIndex].lng,
          locations[i].lat,
          locations[i].lng
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }
    }

    if (closestIndex === -1) break;

    visited.add(closestIndex);
    orderedLocations.push(locations[closestIndex]);
    totalDistance += minDistance;
    currentIndex = closestIndex;
  }

  return {
    orderedLocations,
    totalDistance,
  };
}

// 指定された地点に最も近いロケーションのインデックスを見つける
function findClosestIndex(target: Location, locations: Location[]): number {
  let closestIndex = 0;
  let minDistance = Infinity;

  for (let i = 0; i < locations.length; i++) {
    const distance = haversineDistance(
      target.lat,
      target.lng,
      locations[i].lat,
      locations[i].lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
    }
  }

  return closestIndex;
}

// Google Maps Directions URL を生成
export function generateGoogleMapsUrl(locations: Location[]): string {
  if (locations.length === 0) return "";

  const coords = locations
    .map((loc) => `${loc.lat},${loc.lng}`)
    .join("/");

  return `https://www.google.com/maps/dir/${coords}`;
}

// Apple Maps URL を生成（出発地と目的地のみをサポート）
export function generateAppleMapsUrl(locations: Location[]): string {
  if (locations.length === 0) return "";

  // Apple Mapsは中継地点の複雑なルートをサポートしていないため、
  // 最初と最後の地点のみを使用
  const start = locations[0];
  const end = locations[locations.length - 1];

  if (locations.length === 1) {
    return `http://maps.apple.com/?daddr=${start.lat},${start.lng}&dirflg=d`;
  }

  return `http://maps.apple.com/?saddr=${start.lat},${start.lng}&daddr=${end.lat},${end.lng}&dirflg=d`;
}
