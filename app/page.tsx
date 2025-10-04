"use client";

import { useState } from "react";
import { sampleLocations, defaultSampleSpots, Location } from "@/data/samples";
import {
  optimizeRoute,
  generateGoogleMapsUrl,
  generateAppleMapsUrl,
  RouteResult,
} from "@/lib/route";

export default function Home() {
  const [spots, setSpots] = useState<string>("");
  const [result, setResult] = useState<RouteResult | null>(null);
  const [error, setError] = useState<string>("");

  // サンプルを流し込む
  const loadSample = () => {
    setSpots(defaultSampleSpots.join(", "));
    setResult(null);
    setError("");
  };

  // ルートを作成
  const createRoute = () => {
    setError("");

    // 入力をカンマ区切りで分割
    const spotNames = spots
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // バリデーション
    if (spotNames.length < 2) {
      setError("2つ以上のスポットを入力してください");
      return;
    }

    if (spotNames.length > 20) {
      setError("スポット数は20個までです");
      return;
    }

    // サンプルデータから位置情報を取得
    const locations: Location[] = [];
    const unknownSpots: string[] = [];

    spotNames.forEach((name) => {
      if (sampleLocations[name]) {
        locations.push(sampleLocations[name]);
      } else {
        unknownSpots.push(name);
      }
    });

    // 未解決のスポットがある場合
    if (unknownSpots.length > 0) {
      setError(
        `以下のスポットは位置情報がありません（サンプルを使用すると正確な距離が計算できます）: ${unknownSpots.join(
          ", "
        )}`
      );
    }

    // 解決できたスポットが2つ未満の場合
    if (locations.length < 2) {
      setError(
        "位置情報が取得できるスポットが2つ以上必要です。サンプルボタンを試してください"
      );
      setResult(null);
      return;
    }

    // ルート最適化
    const optimizedRoute = optimizeRoute(locations);
    setResult(optimizedRoute);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            旅ルート最適化
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            行きたい場所を入れると、最適な順番と距離を瞬時に提示します
          </p>
        </header>

        {/* 入力エリア */}
        <section className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            立ち寄りたい場所
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            カンマ区切りで入力してください（例: 浅草寺, 東京スカイツリー,
            上野公園）
          </p>

          <textarea
            className="input-field mb-4 min-h-[100px] resize-y"
            placeholder="浅草寺, 東京スカイツリー, 上野公園"
            value={spots}
            onChange={(e) => setSpots(e.target.value)}
            aria-label="立ち寄りたい場所を入力"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={loadSample}
              className="btn-secondary flex-1"
              aria-label="サンプルを使う"
            >
              📍 サンプルを使う
            </button>
            <button
              onClick={createRoute}
              className="btn-primary flex-1"
              disabled={!spots.trim()}
              aria-label="ルートを作成"
            >
              🗺️ ルートを作成
            </button>
          </div>

          {error && (
            <div
              className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg text-sm text-yellow-800"
              role="alert"
            >
              {error}
            </div>
          )}
        </section>

        {/* 結果エリア */}
        {result && result.orderedLocations.length > 0 && (
          <section className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              おすすめルート
            </h2>

            {/* 総移動距離 */}
            <div className="mb-6 p-5 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-sm text-blue-700 mb-1">総移動距離</div>
              <div className="text-3xl font-bold text-blue-900">
                {result.totalDistance.toFixed(1)} km
              </div>
            </div>

            {/* 訪問順序 */}
            <div className="space-y-3 mb-6">
              {result.orderedLocations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {location.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 地図アプリで開くボタン */}
            <div className="space-y-3">
              <a
                href={generateGoogleMapsUrl(result.orderedLocations)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium text-center hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                aria-label="Google Mapsで開く"
              >
                🗺️ Google Maps で開く
              </a>
              <a
                href={generateAppleMapsUrl(result.orderedLocations)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium text-center hover:bg-gray-900 transition-colors duration-200 shadow-md hover:shadow-lg"
                aria-label="Apple Mapsで開く"
              >
                🍎 Apple Maps で開く
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-500 text-center">
              地図アプリで開くと、実際のナビゲーションが利用できます
            </p>
          </section>
        )}

        {/* フッター */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            このアプリは外部APIを使わず、ブラウザ内で完結して動作します
          </p>
          <p className="mt-2">
            サンプルスポット以外は位置情報が取得できないため、サンプルでのデモを推奨します
          </p>
        </footer>
      </div>
    </div>
  );
}
