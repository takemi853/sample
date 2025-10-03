"use client";

import InterestChips from "./InterestChips";

interface PlanFormProps {
  originText: string;
  destinationText: string;
  interests: string[];
  timeBudgetMin: number;
  loading: boolean;
  error: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onInterestsChange: (interests: string[]) => void;
  onTimeBudgetChange: (minutes: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * プラン入力フォームコンポーネント
 * Material Design準拠: 8pxグリッド、統一された余白、明確なラベル
 */
export default function PlanForm({
  originText,
  destinationText,
  interests,
  timeBudgetMin,
  loading,
  error,
  onOriginChange,
  onDestinationChange,
  onInterestsChange,
  onTimeBudgetChange,
  onSubmit,
}: PlanFormProps) {
  return (
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-gray-100 overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30"></div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 出発地 */}
          <div>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              出発地
            </label>
            <input
              id="origin"
              type="text"
              value={originText}
              onChange={(e) => onOriginChange(e.target.value)}
              placeholder="例: 東京"
              aria-required="true"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* 目的地 */}
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              目的地
            </label>
            <input
              id="destination"
              type="text"
              value={destinationText}
              onChange={(e) => onDestinationChange(e.target.value)}
              placeholder="例: 横浜"
              aria-required="true"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* 興味タグ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            興味のあるカテゴリ（複数選択可）
          </label>
          <InterestChips selected={interests} onChange={onInterestsChange} />
        </div>

        {/* 寄り道時間上限 */}
        <div>
          <label
            htmlFor="timeBudget"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            寄り道時間の上限: <span className="text-blue-600 font-semibold">{timeBudgetMin}分</span>
          </label>
          <input
            id="timeBudget"
            type="range"
            min="30"
            max="300"
            step="30"
            value={timeBudgetMin}
            onChange={(e) => onTimeBudgetChange(Number(e.target.value))}
            aria-label={`寄り道時間上限: ${timeBudgetMin}分`}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>30分</span>
            <span>300分</span>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded"
            role="alert"
            aria-live="assertive"
          >
            <p className="font-medium">エラー</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="relative w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl active:scale-98 min-h-[56px] overflow-hidden group"
        >
          {/* ボタン内のシャイン効果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full" />
              <span className="text-lg">プラン作成中...</span>
            </>
          ) : (
            <>
              <span className="text-2xl">🗺️</span>
              <span className="text-lg">寄り道プランを作る</span>
              <span className="text-xl">✨</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
