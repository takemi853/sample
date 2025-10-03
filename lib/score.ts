import { POI, Coordinate, SelectedPOI } from "@/types";
import { calculateDetourDistance, distanceToMinutes, optimizeOrder } from "./geo";

/**
 * スコアリングの重み係数
 */
const WEIGHTS = {
  tagMatch: 2.0,
  rating: 1.0,
  detourPenalty: 0.05,
};

/**
 * POIのスコアを計算
 * @param poi POI
 * @param interests ユーザーの興味タグ
 * @param detourMinutes 迂回時間（分）
 * @returns スコア
 */
export function calculateScore(
  poi: POI,
  interests: string[],
  detourMinutes: number
): number {
  // タグの一致度（0-1）
  const tagMatchCount = poi.tags.filter((tag) => interests.includes(tag)).length;
  const tagMatchRatio = interests.length > 0 ? tagMatchCount / interests.length : 0;

  // スコア計算
  const score =
    WEIGHTS.tagMatch * tagMatchRatio +
    WEIGHTS.rating * (poi.rating / 5) -
    WEIGHTS.detourPenalty * detourMinutes;

  return score;
}

/**
 * POIリストから最適な寄り道プランを生成
 * @param origin 出発地
 * @param destination 目的地
 * @param allPois 全POIリスト
 * @param interests ユーザーの興味タグ
 * @param timeBudgetMin 寄り道時間上限（分）
 * @returns 選定されたPOIリスト（最大3件）
 */
export function selectPOIs(
  origin: Coordinate,
  destination: Coordinate,
  allPois: POI[],
  interests: string[],
  timeBudgetMin: number
): SelectedPOI[] {
  // 各POIの迂回時間とスコアを計算
  const scored = allPois.map((poi) => {
    const detourKm = calculateDetourDistance(origin, destination, {
      lat: poi.lat,
      lng: poi.lng,
    });
    const detourMinutes = distanceToMinutes(detourKm);
    const totalMinutes = detourMinutes + poi.stayMinutes;
    const score = calculateScore(poi, interests, detourMinutes);

    return {
      ...poi,
      detourMinutes,
      totalMinutes,
      score,
    };
  });

  // スコア順にソート
  scored.sort((a, b) => b.score - a.score);

  // 貪欲法で予算内で選定（最大3件）
  const selected: SelectedPOI[] = [];
  let remainingBudget = timeBudgetMin;

  for (const poi of scored) {
    if (selected.length >= 3) break;
    if (poi.totalMinutes <= remainingBudget) {
      selected.push(poi);
      remainingBudget -= poi.totalMinutes;
    }
  }

  // 訪問順を最適化
  const optimized = optimizeOrder(origin, destination, selected);

  // 最適化後の順序でSelectedPOIを再構築
  return optimized.map((poi) => {
    const found = selected.find((s) => s.id === poi.id)!;
    return found;
  });
}

/**
 * 選定されたPOIの合計情報を計算
 */
export function calculateTotals(pois: SelectedPOI[]): {
  detourMinutes: number;
  stayMinutes: number;
  totalMinutes: number;
} {
  const detourMinutes = pois.reduce((sum, poi) => sum + poi.detourMinutes, 0);
  const stayMinutes = pois.reduce((sum, poi) => sum + poi.stayMinutes, 0);
  const totalMinutes = detourMinutes + stayMinutes;

  return { detourMinutes, stayMinutes, totalMinutes };
}
