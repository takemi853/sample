"use client";

import { Coordinate, SelectedPOI } from "@/types";

interface MapViewProps {
  origin: Coordinate;
  destination: Coordinate;
  pois: SelectedPOI[];
}

/**
 * 地図表示コンポーネント（シンプルな静的画像版）
 * MVPではGoogle Static Maps APIまたは簡易表示
 */
export default function MapView({ origin, destination, pois }: MapViewProps) {
  // Google Static Maps API URL生成
  const markers = [
    `color:green|label:S|${origin.lat},${origin.lng}`,
    ...pois.map(
      (poi, i) => `color:blue|label:${i + 1}|${poi.lat},${poi.lng}`
    ),
    `color:red|label:G|${destination.lat},${destination.lng}`,
  ];

  const path = [
    `${origin.lat},${origin.lng}`,
    ...pois.map((poi) => `${poi.lat},${poi.lng}`),
    `${destination.lat},${destination.lng}`,
  ].join("|");

  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=${markers.join(
    "&markers="
  )}&path=color:0x0000ff|weight:3|${path}&key=YOUR_API_KEY`;

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
      {/* MVPでは簡易的なプレースホルダー */}
      <div className="aspect-[3/2] bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center relative">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">ルートマップ</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div>🟢 出発: {origin.lat.toFixed(4)}, {origin.lng.toFixed(4)}</div>
            {pois.map((poi, i) => (
              <div key={poi.id}>
                🔵 {i + 1}. {poi.name}
              </div>
            ))}
            <div>🔴 目的: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}</div>
          </div>
        </div>
      </div>

      {/* 実装時にはGoogle Maps JS APIやMapLibre GLを使用 */}
      <div className="p-4 bg-white border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ※ 実装版では対話的な地図を表示します
        </p>
      </div>
    </div>
  );
}
