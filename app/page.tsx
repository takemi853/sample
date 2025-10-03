"use client";

import { useState } from "react";
import { PlanRequest, PlanResponse, Coordinate } from "@/types";
import PlanForm from "@/components/PlanForm";
import PlanResults from "@/components/PlanResults";
import { geocode, generateGoogleMapsUrl } from "@/lib/geo";

/**
 * メインページコンポーネント
 * 寄り道プランナーのエントリーポイント
 */
export default function Home() {
  // State管理
  const [originText, setOriginText] = useState("");
  const [destinationText, setDestinationText] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [timeBudgetMin, setTimeBudgetMin] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PlanResponse | null>(null);
  const [origin, setOrigin] = useState<Coordinate | null>(null);
  const [destination, setDestination] = useState<Coordinate | null>(null);

  /**
   * フォーム送信ハンドラー
   * APIにリクエストを送信してプランを取得
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // バリデーション
    if (!originText.trim() || !destinationText.trim()) {
      setError("出発地と目的地を入力してください");
      return;
    }

    if (timeBudgetMin <= 0) {
      setError("寄り道時間は1分以上で指定してください");
      return;
    }

    setLoading(true);

    try {
      const requestBody: PlanRequest = {
        originText: originText.trim(),
        destinationText: destinationText.trim(),
        interests,
        timeBudgetMin,
      };

      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "エラーが発生しました");
        return;
      }

      // ジオコード結果を保存
      const originCoord = geocode(originText.trim());
      const destCoord = geocode(destinationText.trim());

      if (originCoord && destCoord) {
        setOrigin(originCoord);
        setDestination(destCoord);
      }

      setResult(data);
    } catch (err) {
      setError("通信エラーが発生しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Google Mapsで開くハンドラー
   */
  const handleOpenInMaps = () => {
    if (!result || !origin || !destination) return;
    const url = generateGoogleMapsUrl(origin, destination, result.items);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* ヒーローセクション */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
        {/* 背景装飾 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            {/* アイコン */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-6 animate-bounce-slow">
              <span className="text-5xl">🗺️</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              移動の"ついで"が、
              <br />
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                旅のハイライトに。
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              出発地と目的地の間で、効率的かつ魅力的な寄り道を自動提案
            </p>

            {/* 特徴バッジ */}
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                ⚡ 90秒で完結
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                🎯 最大3スポット
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30">
                🔗 Google Maps連携
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 入力フォーム */}
        <PlanForm
          originText={originText}
          destinationText={destinationText}
          interests={interests}
          timeBudgetMin={timeBudgetMin}
          loading={loading}
          error={error}
          onOriginChange={setOriginText}
          onDestinationChange={setDestinationText}
          onInterestsChange={setInterests}
          onTimeBudgetChange={setTimeBudgetMin}
          onSubmit={handleSubmit}
        />

        {/* 結果表示 */}
        {result && origin && destination && (
          <PlanResults
            result={result}
            origin={origin}
            destination={destination}
            onOpenInMaps={handleOpenInMaps}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          <p>
            対応エリア: 東京、横浜、鎌倉、箱根、軽井沢、大阪、京都など
          </p>
        </div>
      </footer>
    </div>
  );
}
