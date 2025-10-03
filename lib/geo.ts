import { Coordinate, POI } from "@/types";

/**
 * 2点間のハーサイン距離を計算（km単位）
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // 地球の半径（km）
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * 度数をラジアンに変換
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * 点から直線への最短距離を計算（簡易版）
 * ルート（origin-destination直線）からPOIまでの迂回距離を概算
 */
export function calculateDetourDistance(
  origin: Coordinate,
  destination: Coordinate,
  poi: Coordinate
): number {
  // origin→POI→destinationの距離 - origin→destinationの直線距離
  const directDistance = haversineDistance(
    origin.lat,
    origin.lng,
    destination.lat,
    destination.lng
  );

  const detourDistance =
    haversineDistance(origin.lat, origin.lng, poi.lat, poi.lng) +
    haversineDistance(poi.lat, poi.lng, destination.lat, destination.lng) -
    directDistance;

  return Math.max(0, detourDistance);
}

/**
 * 距離（km）を時間（分）に変換
 * 仮定: 平均時速60km/h
 */
export function distanceToMinutes(distanceKm: number): number {
  const averageSpeedKmh = 60;
  return Math.round((distanceKm / averageSpeedKmh) * 60);
}

/**
 * テキストから座標への変換（モック実装）
 * 実際のアプリではGeocoding APIを使用
 */
export function geocode(locationText: string): Coordinate | null {
  const mockLocations: Record<string, Coordinate> = {
    東京: { lat: 35.6762, lng: 139.6503 },
    横浜: { lat: 35.4437, lng: 139.6380 },
    鎌倉: { lat: 35.3193, lng: 139.5467 },
    箱根: { lat: 35.2328, lng: 139.1070 },
    軽井沢: { lat: 36.3431, lng: 138.5975 },
    大阪: { lat: 34.6937, lng: 135.5023 },
    京都: { lat: 35.0116, lng: 135.7681 },
    神戸: { lat: 34.6901, lng: 135.1955 },
    奈良: { lat: 34.6851, lng: 135.8050 },
    名古屋: { lat: 35.1815, lng: 136.9066 },
  };

  const normalized = locationText.trim();
  return mockLocations[normalized] || null;
}

/**
 * POIリストを最適な訪問順に並び替え（貪欲法）
 * origin → 最も近いPOI → 次に近いPOI → ... → destination
 */
export function optimizeOrder(
  origin: Coordinate,
  destination: Coordinate,
  pois: POI[]
): POI[] {
  if (pois.length === 0) return [];
  if (pois.length === 1) return pois;

  const unvisited = [...pois];
  const ordered: POI[] = [];
  let current = origin;

  while (unvisited.length > 0) {
    // 現在地から最も近いPOIを選択
    let nearestIndex = 0;
    let minDistance = haversineDistance(
      current.lat,
      current.lng,
      unvisited[0].lat,
      unvisited[0].lng
    );

    for (let i = 1; i < unvisited.length; i++) {
      const distance = haversineDistance(
        current.lat,
        current.lng,
        unvisited[i].lat,
        unvisited[i].lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    const nearest = unvisited.splice(nearestIndex, 1)[0];
    ordered.push(nearest);
    current = { lat: nearest.lat, lng: nearest.lng };
  }

  return ordered;
}

/**
 * Google Maps URLを生成
 */
export function generateGoogleMapsUrl(
  origin: Coordinate,
  destination: Coordinate,
  pois: POI[]
): string {
  const waypoints = pois.map((poi) => `${poi.lat},${poi.lng}`).join("/");
  const base = "https://www.google.com/maps/dir";
  return `${base}/${origin.lat},${origin.lng}/${waypoints}/${destination.lat},${destination.lng}`;
}
