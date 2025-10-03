// 東京圏の有名スポットのサンプルデータ（緯度・経度付き）
export interface Location {
  name: string;
  lat: number;
  lng: number;
}

export const sampleLocations: Record<string, Location> = {
  浅草寺: { name: "浅草寺", lat: 35.7148, lng: 139.7967 },
  東京スカイツリー: { name: "東京スカイツリー", lat: 35.7101, lng: 139.8107 },
  上野公園: { name: "上野公園", lat: 35.7151, lng: 139.7744 },
  築地場外: { name: "築地場外市場", lat: 35.6654, lng: 139.7707 },
  銀座: { name: "銀座", lat: 35.6717, lng: 139.765 },
  東京タワー: { name: "東京タワー", lat: 35.6586, lng: 139.7454 },
  渋谷: { name: "渋谷スクランブル交差点", lat: 35.6595, lng: 139.7004 },
  新宿御苑: { name: "新宿御苑", lat: 35.6852, lng: 139.7101 },
  明治神宮: { name: "明治神宮", lat: 35.6764, lng: 139.6993 },
  お台場: { name: "お台場海浜公園", lat: 35.6305, lng: 139.7737 },
};

// デフォルトで使うサンプルスポット
export const defaultSampleSpots: string[] = [
  "浅草寺",
  "東京スカイツリー",
  "上野公園",
  "築地場外",
  "銀座",
];
