/**
 * POI (Point of Interest) の型定義
 */
export interface POI {
  id: string;
  name: string;
  lat: number;
  lng: number;
  tags: string[];
  stayMinutes: number;
  rating: number;
  brief: string;
}

/**
 * 選定されたPOI（迂回時間などを含む）
 */
export interface SelectedPOI extends POI {
  detourMinutes: number;
  totalMinutes: number; // 移動 + 滞在
}

/**
 * プラン生成リクエスト
 */
export interface PlanRequest {
  originText: string;
  destinationText: string;
  interests: string[];
  timeBudgetMin: number;
}

/**
 * プラン生成レスポンス
 */
export interface PlanResponse {
  items: SelectedPOI[];
  totals: {
    detourMinutes: number;
    stayMinutes: number;
    totalMinutes: number;
  };
}

/**
 * 座標
 */
export interface Coordinate {
  lat: number;
  lng: number;
}
