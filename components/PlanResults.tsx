import { PlanResponse, Coordinate } from "@/types";
import ResultCard from "./ResultCard";
import MapView from "./MapView";

interface PlanResultsProps {
  result: PlanResponse;
  origin: Coordinate;
  destination: Coordinate;
  onOpenInMaps: () => void;
}

/**
 * プラン結果表示コンポーネント
 * Material Design準拠: カード配置、適切な余白、明確な階層構造
 */
export default function PlanResults({
  result,
  origin,
  destination,
  onOpenInMaps,
}: PlanResultsProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* サマリー */}
      <div className="relative bg-gradient-to-br from-white to-blue-50/30 rounded-2xl shadow-2xl p-6 border border-blue-100 overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            おすすめの寄り道プラン
          </h2>
          <button
            onClick={onOpenInMaps}
            aria-label="Google Mapsでルートを開く"
            className="relative bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-2xl active:scale-95 min-h-[48px] overflow-hidden group"
          >
            {/* シャイン効果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="text-xl relative z-10">🗺️</span>
            <span className="relative z-10">この順で行く</span>
            <span className="text-xl relative z-10">→</span>
          </button>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="relative group bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200 hover:border-blue-300 transition-all hover:shadow-lg">
            <div className="absolute top-2 right-2 text-2xl">📍</div>
            <div className="text-4xl font-bold text-blue-600 mb-1">
              {result.items.length}
            </div>
            <div className="text-sm text-blue-700 font-medium">スポット</div>
          </div>
          <div className="relative group bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-5 border border-green-200 hover:border-green-300 transition-all hover:shadow-lg">
            <div className="absolute top-2 right-2 text-2xl">⏱️</div>
            <div className="text-4xl font-bold text-green-600 mb-1">
              {result.totals.stayMinutes}分
            </div>
            <div className="text-sm text-green-700 font-medium">滞在時間</div>
          </div>
          <div className="relative group bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-5 border border-purple-200 hover:border-purple-300 transition-all hover:shadow-lg">
            <div className="absolute top-2 right-2 text-2xl">🕐</div>
            <div className="text-4xl font-bold text-purple-600 mb-1">
              {result.totals.totalMinutes}分
            </div>
            <div className="text-sm text-purple-700 font-medium">合計所要時間</div>
          </div>
        </div>

        {result.items.length === 0 && (
          <div
            className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 px-4 py-3 rounded"
            role="alert"
          >
            <p className="font-medium">スポットが見つかりませんでした</p>
            <p className="text-sm mt-1">
              時間上限を増やすか、興味カテゴリを変更してみてください。
            </p>
          </div>
        )}
      </div>

      {/* 地図と結果カード */}
      {result.items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 地図 */}
          <div className="order-2 lg:order-1">
            <MapView
              origin={origin}
              destination={destination}
              pois={result.items}
            />
          </div>

          {/* 結果カード */}
          <div className="space-y-4 order-1 lg:order-2">
            {result.items.map((poi, index) => (
              <ResultCard key={poi.id} poi={poi} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
