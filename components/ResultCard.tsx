import { SelectedPOI } from "@/types";

interface ResultCardProps {
  poi: SelectedPOI;
  index: number;
}

/**
 * 寄り道スポット結果カードコンポーネント
 * Material Design準拠: 8px角丸、十分な余白、影による階層表現
 */
export default function ResultCard({ poi, index }: ResultCardProps) {
  // 順位に応じたグラデーションカラー
  const gradients = [
    "from-yellow-400 to-orange-500", // 1位: ゴールド
    "from-gray-300 to-gray-400", // 2位: シルバー
    "from-orange-400 to-orange-600", // 3位: ブロンズ
  ];

  return (
    <div className="group relative bg-white rounded-xl shadow-lg p-6 card-hover border border-gray-100 overflow-hidden" role="article" aria-label={`寄り道スポット${index + 1}: ${poi.name}`}>
      {/* 背景装飾 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

      {/* 順位バッジ */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`bg-gradient-to-br ${gradients[index]} text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl shadow-lg ring-4 ring-white`}>
            {index + 1}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{poi.name}</h3>
            <div className="flex items-center gap-1 text-yellow-500 text-sm mt-1">
              {"⭐".repeat(Math.floor(poi.rating))}
              <span className="text-gray-500 ml-1">{poi.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* タグ */}
      <div className="relative flex flex-wrap gap-2 mb-4">
        {poi.tags.map((tag, i) => (
          <span
            key={tag}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100 hover:border-blue-200 transition-colors"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* 説明 */}
      <p className="relative text-gray-600 text-sm mb-4 leading-relaxed">{poi.brief}</p>

      {/* 詳細情報 */}
      <div className="relative grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-100">
          <div className="text-blue-600 text-xs mb-1 font-medium flex items-center gap-1">
            <span>⏱️</span> 滞在時間
          </div>
          <div className="font-bold text-gray-900 text-lg">{poi.stayMinutes}分</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-3 border border-orange-100">
          <div className="text-orange-600 text-xs mb-1 font-medium flex items-center gap-1">
            <span>🚗</span> 迂回時間
          </div>
          <div className="font-bold text-gray-900 text-lg">
            {poi.detourMinutes}分
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-3 border border-purple-100 col-span-2">
          <div className="text-purple-600 text-xs mb-1 font-medium flex items-center gap-1">
            <span>🕐</span> 合計所要時間
          </div>
          <div className="font-bold text-gray-900 text-lg">
            {poi.totalMinutes}分
          </div>
        </div>
      </div>
    </div>
  );
}
